/**
 * Server Action: ShiftStore Order Processing
 * Compatible with Next.js 14 App Router (use server) & Express Backend
 */

import crypto from "crypto";

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: "COD" | "RAZORPAY";
  notes?: string;
}

export interface CreateOrderResult {
  success: boolean;
  order?: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    phone: string;
    address: string;
    pincode: string;
    paymentMethod: "COD" | "RAZORPAY";
    paymentStatus: string;
    orderStatus: string;
    items: string;
    createdAt: string;
    whatsappUrl?: string;
  };
  razorpayOrder?: {
    id: string;
    amount: number;
    currency: string;
    keyId: string;
  };
  error?: string;
}

// Validation helpers
export function validateIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\+]/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(cleaned);
}

export function validateIndianPincode(pincode: string): boolean {
  const cleaned = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

export function generateOrderNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SS-PUJA-${randomSuffix}`;
}

export function buildWhatsAppConfirmationUrl(
  phone: string,
  orderNumber: string,
  customerName: string,
  totalAmount: number,
  paymentMethod: string,
  whatsappStoreNumber: string = "919876543210",
): string {
  const message = encodeURIComponent(
    `🙏 Namaste ShiftStore Team!\n\n` +
      `I just placed my festive order #${orderNumber} for ₹${totalAmount.toLocaleString("en-IN")}.\n` +
      `👤 Name: ${customerName}\n` +
      `💳 Payment: ${paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Prepaid UPI / Card"}\n` +
      `⚡ Please confirm my Durga Puja express dispatch dispatch update!`,
  );
  return `https://wa.me/${whatsappStoreNumber}?text=${message}`;
}

/**
 * Server Action implementation for creating an order
 */
export async function createOrder(
  input: CreateOrderInput,
  dbStore?: any,
): Promise<CreateOrderResult> {
  try {
    // 1. Validate customer name
    if (!input.customerName || input.customerName.trim().length < 2) {
      return { success: false, error: "Please enter your full delivery name." };
    }

    // 2. Validate Indian 10-digit mobile number
    const cleanedPhone = input.phone.replace(/[\s\-\+]/g, "").slice(-10);
    if (!validateIndianPhone(cleanedPhone)) {
      return {
        success: false,
        error:
          "Please enter a valid 10-digit Indian mobile number (e.g., 9830123456).",
      };
    }

    // 3. Validate Delivery Address
    if (!input.address || input.address.trim().length < 8) {
      return {
        success: false,
        error: "Please provide a complete address with street/flat details.",
      };
    }

    // 4. Validate 6-digit Indian PIN code
    const cleanedPincode = input.pincode.trim();
    if (!validateIndianPincode(cleanedPincode)) {
      return {
        success: false,
        error: "Please enter a valid 6-digit Indian Postal PIN code.",
      };
    }

    // 5. Validate Cart Items
    if (!input.items || input.items.length === 0) {
      return { success: false, error: "Your order cart is empty." };
    }

    // Compute total
    const computedTotal = input.items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0,
    );

    if (computedTotal <= 0) {
      return { success: false, error: "Invalid order amount calculation." };
    }

    // Enforce 5% prepaid discount server-side
    const isPrepaid = input.paymentMethod === "RAZORPAY";
    const discountAmount = isPrepaid ? Math.round(computedTotal * 0.05) : 0;
    const finalTotal = Math.max(0, computedTotal - discountAmount);
    const discountNote = isPrepaid
      ? ` [5% Instant Prepaid Discount Applied: -₹${discountAmount} off]`
      : "";

    const orderNumber = generateOrderNumber();
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    const orderRecord: {
      id: string;
      orderNumber: string;
      customerName: string;
      phone: string;
      address: string;
      pincode: string;
      totalAmount: number;
      paymentMethod: "COD" | "RAZORPAY";
      paymentStatus: string;
      orderStatus: string;
      items: string;
      notes: string;
      createdAt: string;
      updatedAt: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
    } = {
      id: orderId,
      orderNumber,
      customerName: input.customerName.trim(),
      phone: cleanedPhone,
      address: input.address.trim(),
      pincode: cleanedPincode,
      totalAmount: finalTotal,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "COD" ? "PENDING" : "PENDING",
      orderStatus: input.paymentMethod === "COD" ? "CONFIRMED" : "NEW",
      items: JSON.stringify(input.items),
      notes: (input.notes || "Festive Durga Puja Order") + discountNote,
      createdAt,
      updatedAt: createdAt,
    };

    // If Razorpay payment requested: generate Razorpay order parameters
    let razorpayOrderPayload;
    if (input.paymentMethod === "RAZORPAY") {
      const razorpayKeyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        "rzp_test_ShiftStorePuja2026";
      const rzpOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;
      orderRecord["razorpayOrderId"] = rzpOrderId;

      razorpayOrderPayload = {
        id: rzpOrderId,
        amount: Math.round(computedTotal * 0.95) * 100, // Enforce 5% discount in paisa
        currency: "INR",
        keyId: razorpayKeyId,
      };
    }

    // Generate WhatsApp direct link for quick customer support & confirmation
    const whatsappStoreNumber =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
    const whatsappUrl = buildWhatsAppConfirmationUrl(
      cleanedPhone,
      orderNumber,
      orderRecord.customerName,
      finalTotal,
      input.paymentMethod,
      whatsappStoreNumber,
    );

    return {
      success: true,
      order: {
        ...orderRecord,
        whatsappUrl,
      },
      razorpayOrder: razorpayOrderPayload,
    };
  } catch (err: any) {
    console.error("ShiftStore order creation error:", err);
    return {
      success: false,
      error: err.message || "Failed to process order. Please try again.",
    };
  }
}
