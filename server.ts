import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });
const { db, getSettings, hashPassword, dataDir } =
  await import("./backend/db.ts");
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import path from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import { paymentProviders } from "./backend/payments.ts";
import { createCashfreeProvider } from "./backend/cashfree.ts";
const cashfreeConfigured = !!(
  process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY
);
if (cashfreeConfigured && process.env.NODE_ENV !== "test") {
  const mode =
    process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
  paymentProviders.set(
    "cashfree",
    createCashfreeProvider({
      appId: process.env.CASHFREE_APP_ID!,
      secret: process.env.CASHFREE_SECRET_KEY!,
      mode,
      notifyUrl: process.env.CASHFREE_NOTIFY_URL,
    }),
  );
  const settings = getSettings();
  if (!settings.cashfreeInitialized) {
    settings.paymentProvider ||= "cashfree";
    settings.cashfreeInitialized = true;
    db.prepare("UPDATE settings SET value=? WHERE id=1").run(
      JSON.stringify(settings),
    );
  }
}
export const app = express();
app.disable("x-powered-by");
if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
const production = process.env.NODE_ENV === "production";
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (req.path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store");
  if (
    ["POST", "PATCH", "DELETE", "PUT"].includes(req.method) &&
    !req.path.startsWith("/api/payments/webhook/")
  ) {
    const origin = req.headers.origin;
    if (
      origin &&
      origin !==
        (process.env.APP_ORIGIN || `${req.protocol}://${req.get("host")}`)
    )
      return res.status(403).json({ error: "Request origin is not allowed." });
  }
  next();
});
const wrap = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);
app.post(
  "/api/payments/webhook/:provider",
  express.raw({ type: "application/json", limit: "256kb" }),
  wrap(async (req: Request, res: Response) => {
    const provider = paymentProviders.get(String(req.params.provider));
    if (!provider)
      return res.status(404).json({ error: "Provider not configured." });
    const event = await provider.verifyWebhook(req.body, req.headers);
    if (!event) return res.json({ received: true });
    db.exec("BEGIN IMMEDIATE");
    try {
      const order: any = db
        .prepare("SELECT * FROM orders WHERE id=?")
        .get(event.orderId);
      if (
        !order ||
        order.payment_method !== provider.id ||
        order.payment_reference !== event.reference ||
        event.amount !== order.total ||
        event.currency !== "INR"
      )
        throw new Error("Payment does not match order.");
      if (
        !db
          .prepare("SELECT id FROM payment_events WHERE id=?")
          .get(provider.id + ":" + event.eventId)
      ) {
        db.prepare("INSERT INTO payment_events VALUES (?,?)").run(
          provider.id + ":" + event.eventId,
          new Date().toISOString(),
        );
        if (order.payment_status !== "PAID")
          db.prepare(
            "UPDATE orders SET payment_status=?, status=? WHERE id=?",
          ).run(
            event.status,
            event.status === "PAID"
              ? order.status === "CANCELLED"
                ? "CANCELLED"
                : "CONFIRMED"
              : order.status,
            order.id,
          );
      }
      db.exec("COMMIT");
      res.json({ received: true });
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }),
);
const uploadDir = path.join(dataDir, "uploads");
mkdirSync(uploadDir, { recursive: true });
app.use(
  "/uploads",
  express.static(uploadDir, { dotfiles: "deny", maxAge: "1d" }),
);
app.post(
  "/api/admin/uploads",
  admin,
  express.json({ limit: "8mb" }),
  (req, res, next) => {
    try {
      if (typeof req.body.data !== "string") fail("Choose an image file.");
      const bytes = Buffer.from(req.body.data, "base64");
      if (!bytes.length || bytes.length > 5 * 1024 * 1024)
        fail("Images must be smaller than 5 MB.");
      let extension = "";
      if (
        bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      )
        extension = "png";
      else if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])))
        extension = "jpg";
      else if (
        bytes.toString("ascii", 0, 4) === "RIFF" &&
        bytes.toString("ascii", 8, 12) === "WEBP"
      )
        extension = "webp";
      if (!extension) fail("Choose a PNG, JPEG, or WebP image.");
      const name = randomUUID() + "." + extension;
      writeFileSync(path.join(uploadDir, name), bytes, { mode: 0o600 });
      res.status(201).json({ url: "/uploads/" + name });
    } catch (error) {
      next(error);
    }
  },
);
app.use(express.json({ limit: "128kb" }));
const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
function token(req: Request) {
  return (
    /(?:^|;\s*)shift_session=([^;]+)/.exec(req.headers.cookie || "")?.[1] || ""
  );
}
function admin(req: Request, res: Response, next: NextFunction) {
  const session = db
    .prepare("SELECT admin_id FROM sessions WHERE token=? AND expires>?")
    .get(tokenHash(token(req)), Date.now());
  if (!session)
    return res.status(401).json({ error: "Please sign in to continue." });
  next();
}
const attempts = new Map<string, { count: number; until: number }>();
function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip + ":" + req.path;
  const now = Date.now();
  if (attempts.size > 5000)
    for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
  const entry = attempts.get(key);
  if (entry && entry.until > now && entry.count >= 15)
    return res
      .status(429)
      .json({ error: "Too many attempts. Please try again in 15 minutes." });
  attempts.set(
    key,
    entry && entry.until > now
      ? { ...entry, count: entry.count + 1 }
      : { count: 1, until: now + 900000 },
  );
  next();
}
const text = (value: unknown, max = 300) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const fail = (message: string): never => {
  const e: any = new Error(message);
  e.status = 400;
  throw e;
};
function product(row: any) {
  return { ...row, published: !!row.published, featured: !!row.featured };
}
function order(row: any) {
  return { ...row, items: JSON.parse(row.items), idempotency_key: undefined };
}
app.get("/api/store", (_req, res) => {
  const settings = getSettings();
  res.json({
    settings: { ...settings, paymentProvider: undefined },
    products: db
      .prepare(
        "SELECT * FROM products WHERE published=1 ORDER BY featured DESC, created_at DESC",
      )
      .all()
      .map(product),
    paymentMethods: [
      ...(settings.codEnabled
        ? [{ id: "COD", label: "Cash on delivery" }]
        : []),
      ...(paymentProviders.has(settings.paymentProvider)
        ? [
            {
              id: settings.paymentProvider,
              label: paymentProviders.get(settings.paymentProvider)!.label,
              mode: paymentProviders.get(settings.paymentProvider)!.mode,
            },
          ]
        : []),
    ],
  });
});
app.post("/api/admin/login", rateLimit, (req, res) => {
  const account: any = db
    .prepare("SELECT * FROM admins WHERE email=?")
    .get(text(req.body.email).toLowerCase());
  const [salt, stored] = (
    account?.password || hashPassword("invalid-password")
  ).split(":");
  const supplied = scryptSync(text(req.body.password, 256), salt, 64);
  if (!account || !timingSafeEqual(Buffer.from(stored, "hex"), supplied))
    return res.status(401).json({ error: "Incorrect email or password." });
  db.prepare("DELETE FROM sessions WHERE expires<?").run(Date.now());
  const session = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions VALUES (?,?,?)").run(
    tokenHash(session),
    account.id,
    Date.now() + 86400000,
  );
  res.cookie("shift_session", session, {
    httpOnly: true,
    secure: production,
    sameSite: "strict",
    maxAge: 86400000,
    path: "/",
  });
  res.json({ email: account.email });
});
app.post("/api/admin/logout", (req, res) => {
  db.prepare("DELETE FROM sessions WHERE token=?").run(tokenHash(token(req)));
  res.clearCookie("shift_session", { path: "/" });
  res.json({ success: true });
});
app.use("/api/admin", admin);
app.get("/api/admin/me", (_req, res) => res.json({ authenticated: true }));
app.get("/api/admin/data", (_req, res) =>
  res.json({
    products: db
      .prepare("SELECT * FROM products ORDER BY created_at DESC")
      .all()
      .map(product),
    orders: db
      .prepare("SELECT * FROM orders ORDER BY created_at DESC")
      .all()
      .map(order),
    settings: getSettings(),
    providers: [...paymentProviders.values()].map((p) => ({
      id: p.id,
      label: p.label,
      mode: p.mode,
    })),
    messages: db
      .prepare("SELECT * FROM messages ORDER BY created_at DESC")
      .all(),
  }),
);
function validateProduct(body: any) {
  const name = text(body.name, 140),
    slug = text(body.slug, 160).toLowerCase();
  if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    fail("A name and valid URL slug are required.");
  if (
    !Number.isSafeInteger(body.price) ||
    body.price <= 0 ||
    body.price > 100000000
  )
    fail("Enter a valid price.");
  if (
    !Number.isSafeInteger(body.stock) ||
    body.stock < 0 ||
    body.stock > 1000000
  )
    fail("Stock must be a non-negative whole number.");
  const compare = body.compare_price || 0;
  if (!Number.isSafeInteger(compare) || (compare !== 0 && compare < body.price))
    fail("Compare-at price must be at least the selling price.");
  const image = text(body.image, 2000);
  if (
    image &&
    !/^https:\/\//.test(image) &&
    !/^\/uploads\/[a-f0-9-]+\.(png|jpg|webp)$/.test(image)
  )
    fail("Use an uploaded image or an HTTPS image URL.");
  return [
    slug,
    name,
    text(body.description, 5000),
    text(body.category, 80),
    body.price,
    compare,
    body.stock,
    image,
    body.published ? 1 : 0,
    body.featured ? 1 : 0,
  ];
}
app.post("/api/admin/products", (req, res, next) => {
  try {
    const values = validateProduct(req.body);
    const id = randomUUID();
    db.prepare(
      "INSERT INTO products (id,slug,name,description,category,price,compare_price,stock,image,published,featured,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    ).run(id, ...values, new Date().toISOString());
    res.status(201).json({ id });
  } catch (e) {
    next(e);
  }
});
app.patch("/api/admin/products/:id", (req, res, next) => {
  try {
    const values = validateProduct(req.body);
    const result = db
      .prepare(
        "UPDATE products SET slug=?,name=?,description=?,category=?,price=?,compare_price=?,stock=?,image=?,published=?,featured=? WHERE id=?",
      )
      .run(...values, String(req.params.id));
    if (!result.changes)
      return res.status(404).json({ error: "Product not found." });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});
app.delete("/api/admin/products/:id", (req, res) => {
  db.prepare("DELETE FROM products WHERE id=?").run(String(req.params.id));
  res.json({ success: true });
});
app.patch("/api/admin/settings", (req, res, next) => {
  try {
    const b = req.body,
      old = getSettings();
    for (const k of ["shippingFee", "freeShippingThreshold"])
      if (!Number.isSafeInteger(b[k]) || b[k] < 0 || b[k] > 100000000)
        fail("Enter valid shipping amounts.");
    if (b.paymentProvider && !paymentProviders.has(b.paymentProvider))
      fail("Payment provider is not installed.");
    if (!text(b.name, 80)) fail("Store name is required.");
    const settings = {
      ...old,
      name: text(b.name, 80),
      tagline: text(b.tagline, 160),
      description: text(b.description, 1000),
      email: text(b.email),
      phone: text(b.phone, 30),
      shippingPolicy: text(b.shippingPolicy, 5000),
      returnPolicy: text(b.returnPolicy, 5000),
      shippingFee: b.shippingFee,
      freeShippingThreshold: b.freeShippingThreshold,
      codEnabled: !!b.codEnabled,
      paymentProvider: b.paymentProvider || "",
      cashfreeInitialized: getSettings().cashfreeInitialized,
    };
    db.prepare("UPDATE settings SET value=? WHERE id=1").run(
      JSON.stringify(settings),
    );
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});
app.post("/api/admin/password", rateLimit, (req, res) => {
  const account: any = db.prepare("SELECT * FROM admins LIMIT 1").get();
  const [salt, hash] = account.password.split(":");
  if (
    !timingSafeEqual(
      Buffer.from(hash, "hex"),
      scryptSync(text(req.body.current, 256), salt, 64),
    )
  )
    return res.status(400).json({ error: "Current password is incorrect." });
  const password = text(req.body.password, 256);
  if (password.length < 12)
    return res.status(400).json({ error: "Use at least 12 characters." });
  db.prepare("UPDATE admins SET password=? WHERE id=?").run(
    hashPassword(password),
    account.id,
  );
  db.prepare("DELETE FROM sessions WHERE token!=?").run(tokenHash(token(req)));
  res.json({ success: true });
});
app.patch("/api/admin/orders/:id", (req, res, next) => {
  try {
    db.exec("BEGIN IMMEDIATE");
    const o: any = db
      .prepare("SELECT * FROM orders WHERE id=?")
      .get(String(req.params.id));
    if (!o) fail("Order not found.");
    const transitions: Record<string, string[]> = {
      NEW: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };
    const status = req.body.status || o.status;
    if (status !== o.status && !transitions[o.status]?.includes(status))
      fail("This order status transition is not allowed.");
    if (
      status === "CONFIRMED" &&
      o.payment_method !== "COD" &&
      o.payment_status !== "PAID"
    )
      fail("Online payment has not been verified.");
    if (
      status === "CANCELLED" &&
      o.payment_method === "cashfree" &&
      o.status !== "CANCELLED"
    )
      fail(
        "Cashfree orders can only be cancelled after the gateway confirms expiry. Refresh their payment status first.",
      );
    if (status === "CANCELLED" && o.payment_status === "PAID")
      fail(
        "Paid orders require a refund through the payment provider before cancellation.",
      );
    if (status === "CANCELLED" && o.status !== "CANCELLED")
      for (const item of JSON.parse(o.items))
        db.prepare("UPDATE products SET stock=stock+? WHERE id=?").run(
          item.quantity,
          item.productId,
        );
    db.prepare(
      "UPDATE orders SET status=?,tracking=?,payment_status=? WHERE id=?",
    ).run(
      status,
      text(req.body.tracking, 200),
      status === "DELIVERED" && o.payment_method === "COD"
        ? "PAID"
        : o.payment_status,
      o.id,
    );
    db.exec("COMMIT");
    res.json({ success: true });
  } catch (e) {
    db.exec("ROLLBACK");
    next(e);
  }
});
app.post(
  "/api/orders",
  rateLimit,
  wrap(async (req: Request, res: Response) => {
    const b = req.body,
      key = text(req.headers["idempotency-key"], 100);
    if (!/^[a-zA-Z0-9-]{16,100}$/.test(key))
      fail("A valid checkout request key is required.");
    const existing: any = db
      .prepare("SELECT * FROM orders WHERE idempotency_key=?")
      .get(key);
    if (existing) {
      if (
        existing.status === "NEW" &&
        !existing.payment_url &&
        !existing.payment_session
      )
        return res.status(409).json({
          error: "Payment setup is still pending. Please wait before retrying.",
        });
      return res.json({
        order: {
          id: existing.id,
          number: existing.number,
          total: existing.total,
          status: existing.status,
        },
        redirectUrl: existing.status === "NEW" ? existing.payment_url : null,
        payment:
          existing.payment_session &&
          existing.payment_status !== "PAID" &&
          existing.status !== "CANCELLED"
            ? {
                provider: existing.payment_method,
                sessionId: existing.payment_session,
                mode: existing.payment_mode,
              }
            : null,
        orderToken: key,
      });
    }
    const customer = text(b.customer, 120),
      phone = text(b.phone, 10),
      address = text(b.address, 500),
      city = text(b.city, 100),
      state = text(b.state, 100),
      pincode = text(b.pincode, 6),
      email = text(b.email, 200);
    if (
      customer.length < 2 ||
      !/^[6-9]\d{9}$/.test(phone) ||
      address.length < 8 ||
      !city ||
      !state ||
      !/^[1-9]\d{5}$/.test(pincode) ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    )
      fail("Please provide valid delivery details.");
    if (!Array.isArray(b.items) || !b.items.length || b.items.length > 30)
      fail("Your bag is empty or too large.");
    const settings = getSettings(),
      method = text(b.paymentMethod, 80),
      provider = paymentProviders.get(method);
    if (
      method === "COD"
        ? !settings.codEnabled
        : !provider || settings.paymentProvider !== method
    )
      fail("This payment method is unavailable.");
    const id = randomUUID(),
      number = "SS-" + randomBytes(5).toString("hex").toUpperCase();
    let total = 0;
    db.exec("BEGIN IMMEDIATE");
    try {
      const quantities = new Map<string, number>();
      for (const item of b.items) {
        if (
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 50
        )
          fail("Quantity must be between 1 and 50.");
        quantities.set(
          String(item.productId),
          (quantities.get(String(item.productId)) || 0) + item.quantity,
        );
      }
      const items = [...quantities].map(([productId, quantity]) => {
        const p: any = db
          .prepare("SELECT * FROM products WHERE id=? AND published=1")
          .get(productId);
        if (!p || quantity > 50 || p.stock < quantity)
          fail("An item is no longer available in the requested quantity.");
        db.prepare("UPDATE products SET stock=stock-? WHERE id=?").run(
          quantity,
          productId,
        );
        total += p.price * quantity;
        return {
          productId,
          name: p.name,
          price: p.price,
          quantity,
          image: p.image,
        };
      });
      total +=
        settings.freeShippingThreshold > 0 &&
        total >= settings.freeShippingThreshold
          ? 0
          : settings.shippingFee;
      db.prepare(
        "INSERT INTO orders (id,number,customer,email,phone,address,city,state,pincode,items,total,payment_method,payment_status,status,created_at,idempotency_key) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      ).run(
        id,
        number,
        customer,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        JSON.stringify(items),
        total,
        method,
        "PENDING",
        method === "COD" ? "CONFIRMED" : "NEW",
        new Date().toISOString(),
        key,
      );
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
    let redirectUrl: string | null = null;
    let onlinePayment: any = null;
    if (provider) {
      try {
        const payment = await provider.createPayment({
          orderId: id,
          amount: total,
          currency: "INR",
          idempotencyKey: key,
          customer: { name: customer, email, phone },
          returnUrl: `${process.env.APP_ORIGIN || "http://localhost:" + (process.env.PORT || 3000)}/payment-return?order_id=${id}`,
        });
        if (
          !payment.reference ||
          (!payment.sessionId && !payment.redirectUrl?.startsWith("https://"))
        )
          throw new Error("Invalid payment response");
        db.prepare(
          "UPDATE orders SET payment_reference=?,payment_url=?,payment_session=?,payment_mode=? WHERE id=?",
        ).run(
          payment.reference,
          payment.redirectUrl || null,
          payment.sessionId || null,
          payment.mode || null,
          id,
        );
        redirectUrl = payment.redirectUrl || null;
        if (payment.sessionId)
          onlinePayment = {
            provider: method,
            sessionId: payment.sessionId,
            mode: payment.mode,
          };
      } catch {
        db.exec("BEGIN IMMEDIATE");
        try {
          const o: any = db.prepare("SELECT * FROM orders WHERE id=?").get(id);
          for (const item of JSON.parse(o.items))
            db.prepare("UPDATE products SET stock=stock+? WHERE id=?").run(
              item.quantity,
              item.productId,
            );
          db.prepare(
            "UPDATE orders SET status='CANCELLED',payment_status='FAILED' WHERE id=?",
          ).run(id);
          db.exec("COMMIT");
        } catch (e) {
          db.exec("ROLLBACK");
          throw e;
        }
        return res.status(502).json({
          error:
            "Payment could not be started. Your order was cancelled; please try again.",
        });
      }
    }
    res.status(201).json({
      order: {
        id,
        number,
        total,
        status: method === "COD" ? "CONFIRMED" : "NEW",
      },
      redirectUrl,
      payment: onlinePayment,
      orderToken: key,
    });
  }),
);
const paymentChecks = new Map<string, number>();
app.get(
  "/api/orders/:id/status",
  wrap(async (req: Request, res: Response) => {
    let o: any = db
      .prepare("SELECT * FROM orders WHERE id=?")
      .get(String(req.params.id));
    const supplied = String(req.headers["x-order-token"] || "");
    if (
      !o ||
      !timingSafeEqual(
        Buffer.from(tokenHash(supplied)),
        Buffer.from(tokenHash(o.idempotency_key)),
      )
    )
      return res.status(404).json({
        error: "Order not found. Use the browser where you placed the order.",
      });
    const provider = paymentProviders.get(o.payment_method);
    if (
      provider?.getPayment &&
      o.payment_status !== "PAID" &&
      o.status !== "CANCELLED" &&
      Date.now() - (paymentChecks.get(o.id) || 0) > 4000
    ) {
      paymentChecks.set(o.id, Date.now());
      const result = await provider.getPayment(o.id);
      if (
        result.reference !== o.payment_reference ||
        result.amount !== o.total ||
        result.currency !== "INR"
      )
        fail("Gateway order verification failed.");
      db.exec("BEGIN IMMEDIATE");
      try {
        o = db.prepare("SELECT * FROM orders WHERE id=?").get(o.id);
        if (result.status === "PAID" && o.payment_status !== "PAID")
          db.prepare(
            "UPDATE orders SET payment_status='PAID',status=CASE WHEN status='CANCELLED' THEN status ELSE 'CONFIRMED' END WHERE id=?",
          ).run(o.id);
        else if (
          result.status === "EXPIRED" &&
          o.payment_status !== "PAID" &&
          o.status !== "CANCELLED"
        ) {
          for (const item of JSON.parse(o.items))
            db.prepare("UPDATE products SET stock=stock+? WHERE id=?").run(
              item.quantity,
              item.productId,
            );
          db.prepare(
            "UPDATE orders SET status='CANCELLED',payment_status='FAILED' WHERE id=?",
          ).run(o.id);
        }
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      o = db.prepare("SELECT * FROM orders WHERE id=?").get(o.id);
    }
    res.json({
      order: {
        id: o.id,
        number: o.number,
        total: o.total,
        status: o.status,
        paymentStatus: o.payment_status,
        paymentMethod: o.payment_method,
        tracking: o.tracking,
        createdAt: o.created_at,
        items: JSON.parse(o.items),
      },
      payment:
        o.payment_session &&
        o.status !== "CANCELLED" &&
        o.payment_status !== "PAID"
          ? {
              provider: o.payment_method,
              sessionId: o.payment_session,
              mode: o.payment_mode,
            }
          : null,
    });
  }),
);
app.post("/api/contact", rateLimit, (req, res) => {
  const name = text(req.body.name, 120),
    email = text(req.body.email, 200),
    message = text(req.body.message, 4000);
  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    message.length < 10
  )
    return res.status(400).json({
      error:
        "Enter your name, valid email, and a message of at least 10 characters.",
    });
  db.prepare("INSERT INTO messages VALUES (?,?,?,?,?)").run(
    randomUUID(),
    name,
    email,
    message,
    new Date().toISOString(),
  );
  res.status(201).json({ success: true });
});
app.use("/api", (_req, res) =>
  res.status(404).json({ error: "Endpoint not found." }),
);
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  if (String(error.message).includes("UNIQUE constraint"))
    return res
      .status(409)
      .json({ error: "That URL slug or request already exists." });
  res.status(error.status || 500).json({
    error: error.status
      ? error.message
      : "Something went wrong. Please try again.",
  });
});
if (process.env.NODE_ENV !== "test") {
  if (!production) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (_req, res) => res.sendFile(path.resolve("dist/index.html")));
  }
  app.listen(
    Number(process.env.PORT) || 3000,
    process.env.HOST || "127.0.0.1",
    () =>
      console.log(
        "ShiftStore running at http://localhost:" + (process.env.PORT || 3000),
      ),
  );
}
