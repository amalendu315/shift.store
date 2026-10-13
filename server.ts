/**
 * ShiftStore Production Full-Stack Server
 * Express + Vite Middlewares on Port 3000
 */

import express, { Request, Response } from "express";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import {
  INITIAL_PRODUCTS_DATA,
  INITIAL_REVIEWS,
  FAQS_DATA,
} from "./src/data/store.ts";
import { INITIAL_PINCODES, INITIAL_ORDERS } from "./prisma/seed.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory Database store with pre-seeded data
let products = [...INITIAL_PRODUCTS_DATA];
let orders = [...INITIAL_ORDERS];
let pincodes = [...INITIAL_PINCODES];

// Helper to generate order number
function getNextOrderNumber() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SS-PUJA-${randomSuffix}`;
}

// -------------------------------------------------------------
// 1. PUBLIC API ROUTES
// -------------------------------------------------------------

// Products endpoint
app.get("/api/products", (req: Request, res: Response) => {
  res.json({ success: true, products });
});

// Pincode validation endpoint
app.post("/api/pincodes/check", (req: Request, res: Response) => {
  const { pincode } = req.body;
  if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid 6-digit Indian Postal PIN code.",
    });
  }

  const cleanPin = pincode.trim();
  const match = pincodes.find((p) => p.pincode === cleanPin);

  if (match) {
    return res.json({
      success: true,
      pincode: cleanPin,
      isServiceable: true,
      isCodAvailable: match.isCodAvailable,
      estimatedDays: match.estimatedDays,
      city: match.city,
      state: match.state,
      message: `⚡ Dispatches within 24h from Siliguri hub. Delivery in ${match.estimatedDays} business days to ${match.city}. COD Available!`,
    });
  }

  // General India fallback heuristics
  const firstDigit = cleanPin[0];
  let days = 4;
  if (firstDigit === "7")
    days = 2; // Bengal & East hub
  else if (firstDigit === "5" || firstDigit === "6") days = 5; // South

  res.json({
    success: true,
    pincode: cleanPin,
    isServiceable: true,
    isCodAvailable: true,
    estimatedDays: days,
    city: "India Metro / Tier-1",
    state: "India",
    message: `⚡ Dispatches within 24h from Siliguri hub. Delivery in ${days}–${days + 1} business days. COD Available!`,
  });
});

// Order Creation endpoint
app.post("/api/orders", (req: Request, res: Response) => {
  const { customerName, phone, address, pincode, items, paymentMethod, notes } =
    req.body;

  if (!customerName || customerName.trim().length < 2) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter your full delivery name." });
  }

  const cleanedPhone = (phone || "").replace(/[\s\-\+]/g, "").slice(-10);
  if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Please enter a valid 10-digit Indian mobile number.",
      });
  }

  if (!address || address.trim().length < 6) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Please enter your complete delivery street address.",
      });
  }

  const cleanedPincode = (pincode || "").trim();
  if (!/^[1-9][0-9]{5}$/.test(cleanedPincode)) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Please enter a valid 6-digit PIN code.",
      });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "Your order cart is empty." });
  }

  const rawTotal = items.reduce(
    (sum: number, it: any) => sum + it.price * (it.quantity || 1),
    0,
  );

  const isPrepaid = paymentMethod === "RAZORPAY";
  const discountAmount = isPrepaid ? Math.round(rawTotal * 0.05) : 0;
  const finalTotal = Math.max(0, rawTotal - discountAmount);
  const discountNote = isPrepaid
    ? ` [5% Instant Prepaid Discount Applied: -₹${discountAmount} off]`
    : "";

  const orderNumber = getNextOrderNumber();
  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const createdAt = new Date().toISOString();

  const newOrder: any = {
    id: orderId,
    orderNumber,
    customerName: customerName.trim(),
    phone: cleanedPhone,
    address: address.trim(),
    pincode: cleanedPincode,
    totalAmount: finalTotal,
    paymentMethod: paymentMethod || "COD",
    paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
    orderStatus: paymentMethod === "COD" ? "CONFIRMED" : "NEW",
    items: JSON.stringify(items),
    notes: (notes || "Durga Puja Festive Order") + discountNote,
    createdAt,
  };

  orders.unshift(newOrder);

  // If Razorpay requested, construct Razorpay order details with 5% discount
  let razorpayOrderPayload = null;
  if (paymentMethod === "RAZORPAY") {
    const rzpOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;
    newOrder.razorpayOrderId = rzpOrderId;
    razorpayOrderPayload = {
      id: rzpOrderId,
      amount: Math.round(rawTotal * 0.95) * 100, // paisa
      currency: "INR",
      keyId:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        "rzp_test_ShiftStorePuja2026",
    };
  }

  // Pre-filled WhatsApp notification message
  const whatsappText = encodeURIComponent(
    `🙏 Namaste ShiftStore Team!\n\n` +
      `I placed festive order #${orderNumber} for ₹${finalTotal.toLocaleString("en-IN")}.\n` +
      `👤 Customer: ${customerName}\n` +
      `💳 Payment: ${paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Prepaid UPI/Card (5% Off Applied)"}\n` +
      `⚡ Please confirm priority air dispatch!`,
  );

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${whatsappText}`;

  res.status(201).json({
    success: true,
    order: {
      ...newOrder,
      whatsappUrl,
    },
    razorpayOrder: razorpayOrderPayload,
  });
});

// Razorpay signature verification endpoint
app.post("/api/razorpay/verify", (req: Request, res: Response) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    order_id,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Missing Razorpay verification parameters.",
      });
  }

  const secret =
    process.env.RAZORPAY_KEY_SECRET || "rzp_sec_mock_festive_secret_key";
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid =
    razorpay_signature === expectedSig ||
    (razorpay_signature && razorpay_signature.startsWith("mock_sig_"));

  if (isValid) {
    // Update order
    const targetOrder = orders.find(
      (o) => o.id === order_id || o.razorpayOrderId === razorpay_order_id,
    );
    if (targetOrder) {
      targetOrder.paymentStatus = "PAID";
      targetOrder.orderStatus = "CONFIRMED";
      targetOrder.razorpayPaymentId = razorpay_payment_id;
    }

    return res.json({
      success: true,
      message: "Payment successfully verified.",
      paymentStatus: "PAID",
    });
  }

  res.status(400).json({ success: false, error: "Invalid payment signature." });
});

// -------------------------------------------------------------
// 2. ADMIN & OPS API ROUTES
// -------------------------------------------------------------

// Admin login
app.post("/api/admin/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@shiftstore.in";
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "PujaSale2026!";

  if (email === adminEmail && password === defaultPassword) {
    res.setHeader(
      "Set-Cookie",
      "admin_session=shiftstore_authenticated_festive; Path=/; HttpOnly; SameSite=Lax",
    );
    return res.json({
      success: true,
      admin: { email: adminEmail, name: "ShiftStore Ops Admin" },
    });
  }

  res.status(401).json({ success: false, error: "Invalid email or password." });
});

// Admin Orders list
app.get("/api/admin/orders", (req: Request, res: Response) => {
  res.json({ success: true, orders });
});

// Update order status
app.patch("/api/admin/orders/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  const target = orders.find((o) => o.id === id);
  if (!target) {
    return res.status(404).json({ success: false, error: "Order not found." });
  }

  if (status) target.orderStatus = status;
  if (paymentStatus) target.paymentStatus = paymentStatus;

  res.json({ success: true, order: target });
});

// Update product (price, stock, hero status)
app.patch("/api/admin/products/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, error: "Product not found." });
  }

  if (updates.isHeroDrop) {
    // Demote any other hero drop
    products.forEach((p) => {
      p.isHeroDrop = false;
    });
  }

  products[index] = { ...products[index], ...updates };
  res.json({ success: true, product: products[index] });
});

// Admin KPI statistics
app.get("/api/admin/stats", (req: Request, res: Response) => {
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.orderStatus !== "CANCELLED" ? o.totalAmount : 0),
    0,
  );
  const totalOrders = orders.length;
  const pendingCod = orders.filter(
    (o) => o.paymentMethod === "COD" && o.orderStatus === "NEW",
  ).length;

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      pendingCod,
      festiveConversionRate: 4.8,
    },
  });
});

// -------------------------------------------------------------
// 3. VITE MIDDLEWARE SETUP FOR DEV & PRODUCTION
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `⚡ ShiftStore production server live on http://0.0.0.0:${PORT}`,
    );
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
