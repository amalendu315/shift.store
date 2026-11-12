import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
process.env.NODE_ENV = "test";
process.env.DATA_DIR = mkdtempSync(path.join(tmpdir(), "shiftstore-test-"));
process.env.ADMIN_EMAIL = "test@example.com";
process.env.ADMIN_DEFAULT_PASSWORD = "test-only-password-2026";
const { app } = await import("../server.ts");
const { db } = await import("../backend/db.ts");
const { paymentProviders } = await import("../backend/payments.ts");
let server: any, base: string, cookie: string, id: string;
async function request(
  route: string,
  method = "GET",
  body?: any,
  authorized = false,
  headers: Record<string, string> = {},
) {
  const res = await fetch(base + "/api" + route, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authorized ? { cookie } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, data: await res.json(), headers: res.headers };
}
const product = {
  name: "Test object",
  slug: "test-object",
  description: "Only a test",
  category: "Objects",
  price: 279900,
  compare_price: 300000,
  stock: 5,
  image: "",
  published: true,
  featured: false,
};
const delivery = {
  customer: "Test Customer",
  email: "test@example.com",
  phone: "9000000000",
  address: "Test address 123",
  city: "Test City",
  state: "Test State",
  pincode: "700001",
  paymentMethod: "COD",
};
before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  base = "http://127.0.0.1:" + server.address().port;
});
after(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  db.close();
  rmSync(process.env.DATA_DIR!, { recursive: true, force: true });
});
test("starts empty and denies unauthenticated admin access", async () => {
  assert.equal((await request("/store")).data.products.length, 0);
  assert.equal((await request("/admin/data")).status, 401);
  assert.equal((await request("/admin/products", "POST", product)).status, 401);
  assert.equal(
    (
      await request("/admin/login", "POST", {
        email: "test@example.com",
        password: "wrong",
      })
    ).status,
    401,
  );
});
test("admin login, create product and public catalog read", async () => {
  const login = await request("/admin/login", "POST", {
    email: "test@example.com",
    password: "test-only-password-2026",
  });
  assert.equal(login.status, 200);
  assert.match(login.headers.get("set-cookie")!, /HttpOnly/);
  cookie = login.headers.get("set-cookie")!.split(";")[0];
  const result = await request("/admin/products", "POST", product, true);
  assert.equal(result.status, 201);
  id = result.data.id;
  assert.equal((await request("/store")).data.products[0].price, 279900);
  assert.equal(
    (await request("/admin/products", "POST", product, true)).status,
    409,
  );
});
test("server prices ignore client tampering, reserves inventory, and deduplicates checkout", async () => {
  const key = randomUUID(),
    payload = {
      ...delivery,
      items: [{ productId: id, quantity: 2, price: 1 }],
    };
  const order = await request("/orders", "POST", payload, false, {
    "Idempotency-Key": key,
  });
  assert.equal(order.status, 201);
  assert.equal(order.data.order.total, 559800);
  assert.equal((await request("/store")).data.products[0].stock, 3);
  const retry = await request("/orders", "POST", payload, false, {
    "Idempotency-Key": key,
  });
  assert.equal(retry.data.order.id, order.data.order.id);
  assert.equal((await request("/store")).data.products[0].stock, 3);
});
test("rejects invalid quantities, stock overruns, unpublished products and unknown payment providers", async () => {
  for (const quantity of [-1, 0, 4, 51, 1.5])
    assert.equal(
      (
        await request(
          "/orders",
          "POST",
          { ...delivery, items: [{ productId: id, quantity }] },
          false,
          { "Idempotency-Key": randomUUID() },
        )
      ).status,
      400,
    );
  assert.equal(
    (
      await request(
        "/orders",
        "POST",
        {
          ...delivery,
          paymentMethod: "FAKE",
          items: [{ productId: id, quantity: 1 }],
        },
        false,
        { "Idempotency-Key": randomUUID() },
      )
    ).status,
    400,
  );
  assert.equal((await request("/store")).data.products[0].stock, 3);
  await request(
    "/admin/products/" + id,
    "PATCH",
    { ...product, stock: 3, published: false },
    true,
  );
  assert.equal((await request("/store")).data.products.length, 0);
  assert.equal(
    (
      await request(
        "/orders",
        "POST",
        { ...delivery, items: [{ productId: id, quantity: 1 }] },
        false,
        { "Idempotency-Key": randomUUID() },
      )
    ).status,
    400,
  );
  await request(
    "/admin/products/" + id,
    "PATCH",
    { ...product, stock: 3 },
    true,
  );
});
test("invalid order transitions fail, cancellation restores stock once", async () => {
  const orders = (await request("/admin/data", "GET", undefined, true)).data
    .orders;
  const idOrder = orders[0].id;
  assert.equal(
    (
      await request(
        "/admin/orders/" + idOrder,
        "PATCH",
        { status: "DELIVERED" },
        true,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await request(
        "/admin/orders/" + idOrder,
        "PATCH",
        { status: "CANCELLED" },
        true,
      )
    ).status,
    200,
  );
  assert.equal((await request("/store")).data.products[0].stock, 5);
  await request(
    "/admin/orders/" + idOrder,
    "PATCH",
    { status: "CANCELLED" },
    true,
  );
  assert.equal((await request("/store")).data.products[0].stock, 5);
  assert.equal(
    (
      await request(
        "/admin/orders/" + idOrder,
        "PATCH",
        { status: "CONFIRMED" },
        true,
      )
    ).status,
    400,
  );
});
test("cross-origin writes are blocked and messages are persistent", async () => {
  assert.equal(
    (
      await request("/admin/settings", "PATCH", {}, true, {
        Origin: "https://evil.example",
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request("/contact", "POST", {
        name: "Test Person",
        email: "test@example.com",
        message: "A customer message for the team.",
      })
    ).status,
    201,
  );
  assert.equal(
    (await request("/admin/data", "GET", undefined, true)).data.messages.length,
    1,
  );
});
test("online provider verifies matching payments, deduplicates webhooks and never downgrades paid orders", async () => {
  paymentProviders.set("test", {
    id: "test",
    label: "Test provider",
    async createPayment(input) {
      return {
        reference: "ref-" + input.orderId,
        redirectUrl: "https://example.com/checkout",
      };
    },
    async verifyWebhook(body, headers) {
      if (headers["x-signature"] !== "valid")
        throw Object.assign(new Error("Invalid signature"), { status: 400 });
      return JSON.parse(body.toString());
    },
  });
  const settings = (await request("/admin/data", "GET", undefined, true)).data
    .settings;
  await request(
    "/admin/settings",
    "PATCH",
    { ...settings, paymentProvider: "test" },
    true,
  );
  const checkout = await request(
    "/orders",
    "POST",
    {
      ...delivery,
      paymentMethod: "test",
      items: [{ productId: id, quantity: 1 }],
    },
    false,
    { "Idempotency-Key": randomUUID() },
  );
  assert.equal(checkout.status, 201);
  assert.equal(checkout.data.redirectUrl, "https://example.com/checkout");
  const orderId = checkout.data.order.id;
  assert.equal(
    (
      await request(
        "/admin/orders/" + orderId,
        "PATCH",
        { status: "CONFIRMED" },
        true,
      )
    ).status,
    400,
  );
  const event = {
    eventId: "event-1",
    orderId,
    reference: "ref-" + orderId,
    amount: 279900,
    currency: "INR",
    status: "PAID",
  };
  assert.equal(
    (await request("/payments/webhook/test", "POST", event)).status,
    400,
  );
  assert.equal(
    (
      await request(
        "/payments/webhook/test",
        "POST",
        { ...event, amount: 1 },
        false,
        { "x-signature": "valid" },
      )
    ).status,
    500,
  );
  assert.equal(
    (
      await request("/payments/webhook/test", "POST", event, false, {
        "x-signature": "valid",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request("/payments/webhook/test", "POST", event, false, {
        "x-signature": "valid",
      })
    ).status,
    200,
  );
  await request(
    "/payments/webhook/test",
    "POST",
    { ...event, eventId: "event-2", status: "FAILED" },
    false,
    { "x-signature": "valid" },
  );
  const order = (
    await request("/admin/data", "GET", undefined, true)
  ).data.orders.find((o: any) => o.id === orderId);
  assert.equal(order.payment_status, "PAID");
  assert.equal(order.status, "CONFIRMED");
});
test("uploads require authentication and reject executable file types", async () => {
  const png =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=";
  assert.equal(
    (await request("/admin/uploads", "POST", { data: png })).status,
    401,
  );
  assert.equal(
    (
      await request(
        "/admin/uploads",
        "POST",
        {
          data: Buffer.from('<svg onload="alert(1)"></svg>').toString("base64"),
        },
        true,
      )
    ).status,
    400,
  );
  const upload = await request("/admin/uploads", "POST", { data: png }, true);
  assert.equal(upload.status, 201);
  assert.match(upload.data.url, /^\/uploads\/.*\.png$/);
  const imageResponse = await fetch(base + upload.data.url);
  assert.equal(imageResponse.status, 200);
  assert.match(imageResponse.headers.get("content-type")!, /image\/png/);
});
test("online checkout retries reuse the provider payment URL", async () => {
  const row: any = db
    .prepare("SELECT * FROM orders WHERE payment_method='test' LIMIT 1")
    .get();
  db.prepare(
    "UPDATE orders SET status='NEW', payment_status='PENDING' WHERE id=?",
  ).run(row.id);
  const result = await request("/orders", "POST", {}, false, {
    "Idempotency-Key": row.idempotency_key,
  });
  assert.equal(result.data.redirectUrl, "https://example.com/checkout");
  db.prepare(
    "UPDATE orders SET status='CONFIRMED',payment_status='PAID' WHERE id=?",
  ).run(row.id);
});
test("partial invalid carts roll back inventory and concurrent orders cannot oversell", async () => {
  const before = (await request("/store")).data.products[0].stock;
  const invalid = await request(
    "/orders",
    "POST",
    {
      ...delivery,
      items: [
        { productId: id, quantity: 1 },
        { productId: "does-not-exist", quantity: 1 },
      ],
    },
    false,
    { "Idempotency-Key": randomUUID() },
  );
  assert.equal(invalid.status, 400);
  assert.equal((await request("/store")).data.products[0].stock, before);
  const results = await Promise.all(
    [1, 2].map(() =>
      request(
        "/orders",
        "POST",
        { ...delivery, items: [{ productId: id, quantity: 3 }] },
        false,
        { "Idempotency-Key": randomUUID() },
      ),
    ),
  );
  assert.deepEqual(results.map((r) => r.status).sort(), [201, 400]);
  assert.equal((await request("/store")).data.products[0].stock, before - 3);
});
test("provider creation failure cancels the order and releases inventory", async () => {
  paymentProviders.set("broken", {
    id: "broken",
    label: "Broken gateway",
    async createPayment() {
      throw new Error("provider offline");
    },
    async verifyWebhook() {
      throw new Error("not called");
    },
  });
  const settings = (await request("/admin/data", "GET", undefined, true)).data
    .settings;
  await request(
    "/admin/settings",
    "PATCH",
    { ...settings, paymentProvider: "broken" },
    true,
  );
  const before = (await request("/store")).data.products[0].stock;
  const result = await request(
    "/orders",
    "POST",
    {
      ...delivery,
      paymentMethod: "broken",
      items: [{ productId: id, quantity: 1 }],
    },
    false,
    { "Idempotency-Key": randomUUID() },
  );
  assert.equal(result.status, 502);
  assert.equal((await request("/store")).data.products[0].stock, before);
  const row: any = db
    .prepare("SELECT * FROM orders WHERE payment_method='broken'")
    .get();
  assert.equal(row.status, "CANCELLED");
  assert.equal(row.payment_status, "FAILED");
});
test("settings and products are durable SQLite records, logout revokes the session", async () => {
  assert.equal(
    (db.prepare("SELECT COUNT(*) as n FROM products").get() as any).n,
    1,
  );
  assert.ok(
    (db.prepare("SELECT COUNT(*) as n FROM orders").get() as any).n > 0,
  );
  assert.equal(
    (await request("/admin/logout", "POST", undefined, true)).status,
    200,
  );
  assert.equal(
    (await request("/admin/data", "GET", undefined, true)).status,
    401,
  );
});
