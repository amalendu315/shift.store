import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { api, money, write, type StoreData, type Product } from "./lib";
import { Modal, ErrorBox, Link } from "./ui";
export interface ReceiptKey {
  id: string;
  token: string;
  number: string;
}
export function receipts(): ReceiptKey[] {
  try {
    return JSON.parse(localStorage.getItem("shift-receipts") || "[]");
  } catch {
    return [];
  }
}
export function saveReceipt(value: ReceiptKey) {
  const list = receipts().filter((r) => r.id !== value.id);
  localStorage.setItem(
    "shift-receipts",
    JSON.stringify([value, ...list].slice(0, 30)),
  );
}
let sdkPromise: Promise<void> | null = null;
export async function launchPayment(payment: any) {
  if (payment.provider !== "cashfree")
    throw new Error("Payment provider is not supported by this checkout.");
  if (!(window as any).Cashfree) {
    if (!sdkPromise)
      sdkPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.onload = () => resolve();
        script.onerror = () => {
          script.remove();
          sdkPromise = null;
          reject(
            new Error(
              "Could not load secure checkout. Check your connection and retry from My orders.",
            ),
          );
        };
        document.head.appendChild(script);
      });
    await sdkPromise;
  }
  const cashfree = (window as any).Cashfree({
    mode: payment.mode || "sandbox",
  });
  const result = await cashfree.checkout({
    paymentSessionId: payment.sessionId,
    redirectTarget: "_self",
  });
  if (result?.error)
    throw new Error(
      result.error.message ||
        "Payment could not be opened. Retry from My orders.",
    );
}
export function Checkout({
  data,
  lines,
  total,
  onClose,
  onSuccess,
  demo,
}: {
  data: StoreData;
  lines: { product: Product; quantity: number }[];
  total: number;
  onClose: () => void;
  onSuccess: (o: any) => void;
  demo: boolean;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [key, setKey] = useState(() => crypto.randomUUID()),
    [method, setMethod] = useState(
      data.paymentMethods.find((m) => m.id === "cashfree")?.id ||
        data.paymentMethods[0]?.id ||
        "",
    );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (demo) return;
    setError("");
    setBusy(true);
    try {
      const result = await api("/orders", {
        ...write("POST", {
          ...Object.fromEntries(new FormData(e.currentTarget)),
          paymentMethod: method,
          items: lines.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
        headers: { "Idempotency-Key": key },
      });
      saveReceipt({
        id: result.order.id,
        number: result.order.number,
        token: result.orderToken || key,
      });
      if (result.order.status === "CANCELLED") {
        setKey(crypto.randomUUID());
        throw new Error("This order was cancelled. Please try again.");
      }
      if (result.payment) await launchPayment(result.payment);
      else if (result.redirectUrl) location.assign(result.redirectUrl);
      else onSuccess(result.order);
    } catch (e: any) {
      setError(e.message);
      if (e.status === 502) setKey(crypto.randomUUID());
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={demo ? "Preview checkout" : "Secure checkout"}
      onClose={() => !busy && onClose()}
    >
      <form onSubmit={submit} className="modal-body form">
        <div className="m-checkout-steps">
          <span>
            <CheckCircle2 size={15} /> Cart
          </span>
          <b>2. Delivery & payment</b>
          <span>3. Confirmation</span>
        </div>
        {demo && (
          <div className="notice">
            This is a demo preview. No order or payment will be created. Add
            your real products in admin to start selling.
          </div>
        )}
        <ErrorBox error={error} />
        <h3 className="m-form-title">
          <Truck size={18} /> Delivery details
        </h3>
        <div className="form-grid">
          <label>
            Full name
            <input
              name="customer"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
            />
          </label>
          <label>
            Mobile number
            <input
              name="phone"
              autoComplete="tel-national"
              type="tel"
              required
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              placeholder="10-digit mobile"
            />
          </label>
        </div>
        <label>
          Email address (optional)
          <input name="email" type="email" autoComplete="email" />
        </label>
        <label>
          Delivery address
          <textarea
            name="address"
            autoComplete="street-address"
            required
            minLength={8}
            maxLength={500}
            rows={2}
            placeholder="House / flat, building, street and area"
          />
        </label>
        <div className="form-grid">
          <label>
            City
            <input name="city" required autoComplete="address-level2" />
          </label>
          <label>
            State
            <input name="state" required autoComplete="address-level1" />
          </label>
        </div>
        <label>
          PIN code
          <input
            name="pincode"
            autoComplete="postal-code"
            required
            pattern="[1-9][0-9]{5}"
            maxLength={6}
            inputMode="numeric"
          />
        </label>
        <h3 className="m-form-title">
          <CreditCard size={18} /> Payment method
        </h3>
        <div className="m-payment-options">
          {data.paymentMethods.map((m) => (
            <label key={m.id} className={method === m.id ? "selected" : ""}>
              <input
                type="radio"
                name="paymentChoice"
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
              />
              <span>
                <strong>
                  {m.id === "COD"
                    ? "Cash on delivery"
                    : "Pay online with Cashfree"}
                </strong>
                <small>
                  {m.id === "COD"
                    ? "Pay when your order arrives"
                    : "UPI · Debit / credit cards · Net banking"}
                </small>
              </span>
              {m.mode === "sandbox" && <b className="badge amber">TEST MODE</b>}
            </label>
          ))}
        </div>
        {method === "cashfree" &&
          data.paymentMethods.find((m) => m.id === method)?.mode ===
            "sandbox" && (
            <p className="notice">
              Cashfree sandbox: use test payment details. No real money is
              charged.
            </p>
          )}
        <div className="order-receipt">
          <span>Total, including shipping</span>
          <strong>{money(total)}</strong>
        </div>
        <button
          className="btn full m-primary"
          disabled={busy || demo || !method}
        >
          {demo
            ? "Demo only — ordering disabled"
            : busy
              ? "Preparing your order…"
              : method === "COD"
                ? "Place COD order"
                : "Continue to secure payment"}
          <ArrowRight size={17} />
        </button>
        <p className="form-hint">
          <ShieldCheck
            size={13}
            style={{ display: "inline", verticalAlign: "middle" }}
          />{" "}
          Your payment details are handled by the payment provider.{" "}
          <Link to="/policies">View store policies</Link>.
        </p>
      </form>
    </Modal>
  );
}
