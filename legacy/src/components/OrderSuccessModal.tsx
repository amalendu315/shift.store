

import React from "react";
import {
  CheckCircle2,
  MessageCircle,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface OrderSuccessProps {
  order: {
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
    items?: string | any[];
    whatsappUrl?: string;
  };
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessProps> = ({
  order,
  onClose,
}) => {
  const whatsappUrl =
    order.whatsappUrl ||
    `https://wa.me/919876543210?text=${encodeURIComponent(
      `Namaste ShiftStore! I placed order #${order.orderNumber} for ₹${order.totalAmount}. Please share dispatch tracking!`,
    )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141412]/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-[#f6f3ec] text-[#141412] rounded-2xl border border-[#e7e1d6] shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-semibold tracking-wider text-[#b48849] uppercase">
            ⚡ Order Placed Successfully
          </span>
          <h2 className="text-2xl font-bold font-serif text-[#141412]">
            Thank You, {order.customerName.split(" ")[0]}!
          </h2>
          <p className="text-xs text-[#6b6963]">
            Your Durga Puja festive parcel is being prepped for express
            dispatch.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#f0ece1]/70 border border-[#e7e1d6] rounded-xl p-4 space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#e7e1d6]">
            <span className="text-[#6b6963]">Order Reference</span>
            <span className="font-mono font-bold text-sm text-[#141412]">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6b6963]">Payment Mode</span>
            <span className="font-semibold text-[#141412]">
              {order.paymentMethod === "COD"
                ? "Cash on Delivery (Pay at Door)"
                : "Prepaid UPI / Card"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6b6963]">Total Amount</span>
            <span className="font-bold text-sm tabular-nums text-[#141412]">
              ₹{order.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between items-start pt-2 border-t border-[#e7e1d6]">
            <span className="text-[#6b6963]">Shipping To</span>
            <div className="text-right max-w-[200px]">
              <p className="font-medium text-[#141412]">{order.address}</p>
              <p className="text-[#6b6963] mt-0.5">
                PIN: {order.pincode} · +91 {order.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Dispatch Timeline */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-3 text-xs text-amber-900">
          <Truck className="w-5 h-5 text-[#b48849] shrink-0" />
          <div>
            <p className="font-semibold">Priority Air Transit Initiated</p>
            <p className="text-[11px] text-amber-800">
              Estimated delivery in 2–3 business days with live SMS and WhatsApp
              tracking.
            </p>
          </div>
        </div>

        {/* WhatsApp Notification Action */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open WhatsApp for Instant Tracking Updates</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-transparent hover:bg-[#e7e1d6]/50 text-[#141412] rounded-xl font-medium text-xs border border-[#e7e1d6] transition-colors"
          >
            Continue Browsing ShiftStore
          </button>
        </div>
      </div>
    </div>
  );
};
