import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { createCashfreeProvider } from "../backend/cashfree.ts";
const config = {
  appId: "test-app",
  secret: "test-secret",
  mode: "sandbox" as const,
};
const order = {
  order_id: "order-1",
  order_amount: 123.45,
  order_currency: "INR",
  order_status: "ACTIVE",
  payment_session_id: "sandbox-session",
};
const input = {
  orderId: "order-1",
  amount: 12345,
  currency: "INR",
  idempotencyKey: "key-1",
  customer: { name: "Test", email: "test@example.com", phone: "9999999999" },
  returnUrl: "http://localhost:3000/payment-return",
};
test("Cashfree sends paise as rupees and returns a sandbox session", async () => {
  const provider = createCashfreeProvider({
    ...config,
    fetch: (async (url, init) => {
      assert.equal(url, "https://sandbox.cashfree.com/pg/orders");
      const body = JSON.parse(String(init?.body));
      assert.equal(body.order_amount, 123.45);
      assert.equal(body.customer_details.customer_phone, "9999999999");
      assert.equal((init?.headers as any)["x-idempotency-key"], "key-1");
      return Response.json(order);
    }) as typeof fetch,
  });
  assert.deepEqual(await provider.createPayment(input), {
    reference: "order-1",
    sessionId: "sandbox-session",
    mode: "sandbox",
  });
});
test("Cashfree recovers a timed-out creation using the same order reference", async () => {
  let calls = 0;
  const provider = createCashfreeProvider({
    ...config,
    fetch: (async (url, init) => {
      calls++;
      if (init?.method === "POST") throw new Error("timeout");
      assert.equal(url, "https://sandbox.cashfree.com/pg/orders/order-1");
      return Response.json(order);
    }) as typeof fetch,
  });
  assert.equal((await provider.createPayment(input)).reference, "order-1");
  assert.equal(calls, 2);
});
test("Cashfree rejects mismatched amounts and maps authoritative paid/expired status", async () => {
  const provider = createCashfreeProvider({
    ...config,
    fetch: (async () =>
      Response.json({ ...order, order_amount: 1 })) as typeof fetch,
  });
  await assert.rejects(provider.createPayment(input), /does not match/);
  for (const [remote, local] of [
    ["PAID", "PAID"],
    ["ACTIVE", "PENDING"],
    ["EXPIRED", "EXPIRED"],
  ]) {
    const p = createCashfreeProvider({
      ...config,
      fetch: (async () =>
        Response.json({ ...order, order_status: remote })) as typeof fetch,
    });
    assert.equal((await p.getPayment!("order-1")).status, local);
  }
});
const payload = {
  type: "PAYMENT_SUCCESS_WEBHOOK",
  data: {
    order: { order_id: "order-1", order_amount: 123.45, order_currency: "INR" },
    payment: {
      cf_payment_id: 123,
      payment_status: "SUCCESS",
      payment_amount: 123.45,
      payment_currency: "INR",
    },
  },
};
function signed(value: unknown) {
  const body = Buffer.from(JSON.stringify(value)),
    timestamp = String(Date.now());
  return {
    body,
    headers: {
      "x-webhook-timestamp": timestamp,
      "x-webhook-signature": createHmac("sha256", config.secret)
        .update(timestamp)
        .update(body)
        .digest("base64"),
    },
  };
}
test("Cashfree verifies raw signed success and rejects tampering", async () => {
  const p = createCashfreeProvider(config),
    s = signed(payload);
  assert.deepEqual(await p.verifyWebhook(s.body, s.headers), {
    eventId: "123",
    orderId: "order-1",
    reference: "order-1",
    amount: 12345,
    currency: "INR",
    status: "PAID",
  });
  await assert.rejects(
    p.verifyWebhook(Buffer.from(s.body.toString() + " "), s.headers),
    /signature/,
  );
  await assert.rejects(p.verifyWebhook(s.body, {}), /signature/);
});
test("failed attempts remain retryable; signed mismatching success is rejected", async () => {
  const p = createCashfreeProvider(config);
  let s = signed({ ...payload, type: "PAYMENT_FAILED_WEBHOOK" });
  assert.equal(await p.verifyWebhook(s.body, s.headers), null);
  s = signed({
    ...payload,
    data: {
      ...payload.data,
      payment: { ...payload.data.payment, payment_amount: 1 },
    },
  });
  await assert.rejects(p.verifyWebhook(s.body, s.headers));
});
