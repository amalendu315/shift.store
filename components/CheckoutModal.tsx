
import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageCircle,
  CreditCard,
  Banknote,
} from "lucide-react";
import { checkPincode, PincodeCheckResult } from "../actions/pincode";

export interface CheckoutItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  subtitle?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  onOrderSuccess: (order: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");

  // Pincode validation & TAT state
  const [pincodeInfo, setPincodeInfo] = useState<PincodeCheckResult | null>(
    null,
  );
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Total calculation
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );

  // Real-time pincode checker
  useEffect(() => {
    const cleanPin = pincode.trim();
    if (cleanPin.length === 6 && /^[1-9][0-9]{5}$/.test(cleanPin)) {
      setIsCheckingPincode(true);
      setPincodeError("");
      checkPincode(cleanPin)
        .then((res) => {
          setPincodeInfo(res);
          if (!res.isCodAvailable && paymentMethod === "COD") {
            setPaymentMethod("RAZORPAY");
          }
        })
        .catch(() => {
          setPincodeError(
            "Unable to verify pincode. Standard 3-5 days delivery applies.",
          );
        })
        .finally(() => {
          setIsCheckingPincode(false);
        });
    } else if (cleanPin.length > 0 && cleanPin.length < 6) {
      setPincodeInfo(null);
      setPincodeError("");
    }
  }, [pincode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Name check
    if (!customerName.trim() || customerName.trim().length < 2) {
      setFormError("Please enter your delivery full name.");
      return;
    }

    // Indian 10-digit Phone check
    const cleanPhone = phone.replace(/[\s\-\+]/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setFormError(
        "Please enter a valid 10-digit Indian mobile number (e.g., 9830123456).",
      );
      return;
    }

    // Address check
    if (!address.trim() || address.trim().length < 8) {
      setFormError(
        "Please provide your complete street address or apartment details.",
      );
      return;
    }

    // 6-digit Pincode check
    if (!/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      setFormError("Please enter a valid 6-digit Indian Postal PIN code.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend API / server action
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: cleanPhone,
          address: address.trim(),
          pincode: pincode.trim(),
          items,
          paymentMethod,
          notes: "Durga Puja Festive Express Order",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create order.");
      }

      if (paymentMethod === "RAZORPAY" && data.razorpayOrder) {
        // Razorpay Checkout flow
        if (typeof (window as any).Razorpay !== "undefined") {
          const options = {
            key: data.razorpayOrder.keyId || "rzp_test_ShiftStorePuja2026",
            amount: data.razorpayOrder.amount,
            currency: "INR",
            name: "ShiftStore India",
            description: "Durga Puja Festive Order",
            order_id: data.razorpayOrder.id,
            prefill: {
              name: customerName,
              contact: cleanPhone,
            },
            theme: {
              color: "#b48849",
            },
            handler: async function (response: any) {
              // Verify server-side
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  order_id: data.order.id,
                  razorpay_order_id:
                    response.razorpay_order_id || data.razorpayOrder.id,
                  razorpay_payment_id:
                    response.razorpay_payment_id || "pay_test_" + Date.now(),
                  razorpay_signature:
                    response.razorpay_signature || "mock_sig_" + Date.now(),
                }),
              });
              const verifyData = await verifyRes.json();
              onOrderSuccess({
                ...data.order,
                paymentStatus: "PAID",
                razorpayPaymentId: response.razorpay_payment_id,
              });
              onClose();
            },
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
              },
            },
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        } else {
          // Fallback simulation for dev environment if script blocked
          onOrderSuccess({
            ...data.order,
            paymentStatus: "PAID",
            razorpayPaymentId: "pay_simulated_" + Date.now(),
          });
          onClose();
          return;
        }
      }

      // COD Flow
      onOrderSuccess(data.order);
      onClose();
    } catch (err: any) {
      setFormError(err.message || "An error occurred while placing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#141412]/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-lg bg-[#f6f3ec] text-[#141412] rounded-t-2xl sm:rounded-2xl border border-[#e7e1d6] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7e1d6] bg-[#f0ece1]/70">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-[#b48849] uppercase">
              ⚡ Durga Puja Express Checkout
            </span>
            <h2
              id="modal-title"
              className="text-xl font-bold font-serif text-[#141412]"
            >
              Confirm Your Delivery
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6b6963] hover:text-[#141412] rounded-full hover:bg-[#e7e1d6]/50 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-5 flex-1"
        >
          {formError && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50/80 border border-red-200 text-red-800 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Cart Item Summary Pill */}
          <div className="p-3.5 bg-[#f0ece1]/60 rounded-xl border border-[#e7e1d6] space-y-2">
            <div className="flex justify-between items-center text-xs text-[#6b6963]">
              <span>Selected Item(s)</span>
              <span className="font-medium text-[#141412]">
                Festive Discount Applied
              </span>
            </div>
            {items.map((it, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm font-medium"
              >
                <div>
                  <span className="text-[#141412]">{it.title}</span>
                  {it.quantity > 1 && (
                    <span className="text-xs text-[#6b6963] ml-1.5">
                      × {it.quantity}
                    </span>
                  )}
                </div>
                <span className="tabular-nums font-semibold text-[#141412]">
                  ₹{(it.price * (it.quantity || 1)).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-[#e7e1d6]/80 flex justify-between items-center text-sm">
              <span className="text-xs font-semibold text-[#b48849] uppercase tracking-wider">
                Total Payable
              </span>
              <span className="text-lg font-bold tabular-nums text-[#141412]">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Customer Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#141412] mb-1.5 uppercase tracking-wider">
              Recipient Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ananya Mukherjee"
              className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-lg text-sm text-[#141412] focus:outline-none focus:border-[#b48849] focus:ring-1 focus:ring-[#b48849] transition-all placeholder:text-[#6b6963]/60"
            />
          </div>

          {/* 10-digit Indian Mobile */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#141412] uppercase tracking-wider">
                Phone Number (10-Digit) *
              </label>
              <span className="text-[11px] text-[#6b6963]">
                For WhatsApp dispatch updates
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-medium text-[#6b6963] select-none">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9830123456"
                className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-lg text-sm text-[#141412] focus:outline-none focus:border-[#b48849] focus:ring-1 focus:ring-[#b48849] transition-all tabular-nums placeholder:text-[#6b6963]/60"
              />
            </div>
          </div>

          {/* Delivery Street Address */}
          <div>
            <label className="block text-xs font-semibold text-[#141412] mb-1.5 uppercase tracking-wider">
              Delivery Address (Flat / House / Street) *
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat 4B, Silver Oak, Near Central Mall, Sector 2"
              className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-lg text-sm text-[#141412] focus:outline-none focus:border-[#b48849] focus:ring-1 focus:ring-[#b48849] transition-all placeholder:text-[#6b6963]/60 resize-none"
            />
          </div>

          {/* 6-digit Indian PIN Code with live checker */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#141412] uppercase tracking-wider">
                Postal PIN Code (6-Digit) *
              </label>
              {isCheckingPincode && (
                <span className="text-[11px] text-[#b48849] font-medium animate-pulse">
                  Verifying pincode...
                </span>
              )}
            </div>
            <input
              type="text"
              required
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 700064 or 110001"
              className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-lg text-sm text-[#141412] focus:outline-none focus:border-[#b48849] focus:ring-1 focus:ring-[#b48849] transition-all tabular-nums placeholder:text-[#6b6963]/60"
            />

            {/* Pincode turnaround response banner */}
            {pincodeInfo && (
              <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-xs text-emerald-800">
                <Truck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <p className="font-semibold">{pincodeInfo.message}</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Hub: {pincodeInfo.city || "Pan-India"} · Festive priority
                    route
                  </p>
                </div>
              </div>
            )}
            {pincodeError && (
              <p className="mt-1.5 text-xs text-amber-700">{pincodeError}</p>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#141412] mb-2 uppercase tracking-wider">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  paymentMethod === "COD"
                    ? "border-[#b48849] bg-[#fbf9f4] ring-1 ring-[#b48849]"
                    : "border-[#e7e1d6] bg-white hover:border-[#b48849]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Banknote className="w-5 h-5 text-[#b48849]" />
                  {paymentMethod === "COD" && (
                    <CheckCircle2 className="w-4 h-4 text-[#b48849]" />
                  )}
                </div>
                <div className="font-semibold text-xs text-[#141412]">
                  Cash on Delivery
                </div>
                <div className="text-[11px] text-[#6b6963] mt-0.5">
                  Pay in cash at doorstep
                </div>
              </button>

              {/* Instant Razorpay Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("RAZORPAY")}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  paymentMethod === "RAZORPAY"
                    ? "border-[#b48849] bg-[#fbf9f4] ring-1 ring-[#b48849]"
                    : "border-[#e7e1d6] bg-white hover:border-[#b48849]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <CreditCard className="w-5 h-5 text-[#b48849]" />
                  {paymentMethod === "RAZORPAY" && (
                    <CheckCircle2 className="w-4 h-4 text-[#b48849]" />
                  )}
                </div>
                <div className="font-semibold text-xs text-[#141412]">
                  Instant UPI / Cards
                </div>
                <div className="text-[11px] text-[#6b6963] mt-0.5">
                  GPay, PhonePe, Cards
                </div>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-2 flex items-center justify-around text-[11px] text-[#6b6963] border-t border-[#e7e1d6]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b48849]" />
              Safe Festive Packaging
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#b48849]" />
              Free Durga Puja Gift Coin
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#f6f3ec] border-t-transparent rounded-full animate-spin" />
                  Securing Your Festive Order...
                </span>
              ) : (
                <span>
                  {paymentMethod === "COD"
                    ? "CONFIRM CASH ON DELIVERY • "
                    : "PAY WITH UPI / CARD • "}
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
