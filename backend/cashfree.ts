import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentProvider, PaymentEvent } from "./payments.ts";
interface CashfreeConfig {
  appId: string;
  secret: string;
  mode: "sandbox" | "production";
  notifyUrl?: string;
  fetch?: typeof fetch;
}
export function createCashfreeProvider(
  config: CashfreeConfig,
): PaymentProvider {
  const request = config.fetch || fetch;
  const base =
    config.mode === "sandbox"
      ? "https://sandbox.cashfree.com/pg"
      : "https://api.cashfree.com/pg";
  async function call(
    path: string,
    method = "GET",
    body?: unknown,
    key?: string,
  ) {
    const response = await request(base + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2025-01-01",
        "x-client-id": config.appId,
        "x-client-secret": config.secret,
        ...(key ? { "x-idempotency-key": key } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json();
    if (!response.ok) {
      const error: any = new Error(
        response.status === 401
          ? "Cashfree sandbox credentials were rejected."
          : "Cashfree is unavailable. Please try again.",
      );
      error.status = 502;
      throw error;
    }
    return data;
  }
  function normalized(data: any) {
    if (
      !Number.isFinite(Number(data.order_amount)) ||
      data.order_currency !== "INR" ||
      typeof data.order_id !== "string"
    )
      throw new Error("Invalid Cashfree order response");
    return {
      reference: data.order_id,
      amount: Math.round(Number(data.order_amount) * 100),
      currency: data.order_currency,
      status:
        data.order_status === "PAID"
          ? ("PAID" as const)
          : ["EXPIRED", "TERMINATED"].includes(data.order_status)
            ? ("EXPIRED" as const)
            : ("PENDING" as const),
      sessionId: data.payment_session_id,
    };
  }
  return {
    id: "cashfree",
    label:
      config.mode === "sandbox"
        ? "UPI, cards & net banking · Cashfree test"
        : "UPI, cards & net banking",
    mode: config.mode,
    async createPayment(input) {
      if (!input.customer?.phone || !input.returnUrl)
        throw new Error("Customer and return URL required");
      const payload = {
        order_id: input.orderId,
        order_amount: input.amount / 100,
        order_currency: input.currency,
        customer_details: {
          customer_id: "guest_" + input.orderId,
          customer_name: input.customer.name,
          customer_phone: input.customer.phone,
          ...(input.customer.email
            ? { customer_email: input.customer.email }
            : {}),
        },
        order_meta: {
          return_url: input.returnUrl,
          ...(config.notifyUrl ? { notify_url: config.notifyUrl } : {}),
        },
        order_expiry_time: new Date(Date.now() + 30 * 60000).toISOString(),
        order_note: "ShiftStore order",
      };
      let data: any;
      try {
        data = await call("/orders", "POST", payload, input.idempotencyKey);
      } catch (error) {
        // Recover a remotely created order after a network timeout; never create a second reference.
        try {
          data = await call("/orders/" + encodeURIComponent(input.orderId));
        } catch {
          throw error;
        }
      }
      const verified = normalized(data);
      if (
        verified.reference !== input.orderId ||
        verified.amount !== input.amount ||
        !data.payment_session_id
      )
        throw new Error("Cashfree order does not match checkout");
      return {
        reference: data.order_id,
        sessionId: data.payment_session_id,
        mode: config.mode,
      };
    },
    async getPayment(orderId) {
      return normalized(await call("/orders/" + encodeURIComponent(orderId)));
    },
    async verifyWebhook(rawBody, headers): Promise<PaymentEvent | null> {
      const timestamp = headers["x-webhook-timestamp"],
        signature = headers["x-webhook-signature"];
      const invalid = () => {
        throw Object.assign(new Error("Invalid Cashfree webhook signature."), {
          status: 400,
        });
      };
      if (
        typeof timestamp !== "string" ||
        typeof signature !== "string" ||
        !Buffer.isBuffer(rawBody) ||
        !/^\d+$/.test(timestamp)
      )
        invalid();
      const expected = createHmac("sha256", config.secret)
        .update(String(timestamp))
        .update(rawBody)
        .digest();
      const supplied = Buffer.from(String(signature), "base64");
      if (
        expected.length !== supplied.length ||
        !timingSafeEqual(expected, supplied)
      )
        invalid();
      const parsed = JSON.parse(rawBody.toString("utf8"));
      const payment = parsed.data?.payment,
        order = parsed.data?.order;
      // A failed attempt is not a failed order: Cashfree supports retrying the same session.
      if (
        parsed.type !== "PAYMENT_SUCCESS_WEBHOOK" ||
        payment?.payment_status !== "SUCCESS"
      )
        return null;
      if (
        !order?.order_id ||
        !payment.cf_payment_id ||
        order.order_currency !== "INR" ||
        payment.payment_currency !== "INR" ||
        Math.round(Number(order.order_amount) * 100) !==
          Math.round(Number(payment.payment_amount) * 100)
      )
        invalid();
      const amount = Math.round(Number(payment.payment_amount) * 100);
      if (!Number.isSafeInteger(amount) || amount <= 0) invalid();
      return {
        eventId: String(payment.cf_payment_id),
        orderId: order.order_id,
        reference: order.order_id,
        amount,
        currency: "INR",
        status: "PAID",
      };
    },
  };
}
