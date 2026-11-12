import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  Package,
  ArrowLeft,
} from "lucide-react";

export default async function OrderSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xs border border-[#e7e1d6] rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-[#b48849] uppercase">
            ⚡ Durga Puja Express Order Confirmed
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#141412]">
            Thank You For Your Order!
          </h1>
          <p className="text-xs text-[#6b6963]">
            Order Ref:{" "}
            <span className="font-mono font-bold text-[#141412]">
              {orderId}
            </span>
          </p>
        </div>

        <div className="p-4 bg-[#f0ece1]/70 rounded-xl border border-[#e7e1d6] space-y-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-medium">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Parcel Assigned to Priority Express Air Transit</span>
          </div>
          <p className="text-[#6b6963]">
            Estimated Delivery: 2–3 business days. You will receive an SMS and
            WhatsApp tracking notification as soon as the dispatch truck departs
            our warehouse.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <a
            href={`https://wa.me/919876543210?text=Namaste!%20I%20placed%20order%20${orderId}.%20Please%20share%20shipping%20updates.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open WhatsApp for Real-time Dispatch Updates</span>
          </a>

          <Link
            href="/"
            className="w-full py-3 px-4 bg-transparent hover:bg-[#e7e1d6]/50 text-[#141412] rounded-xl font-medium text-xs border border-[#e7e1d6] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to ShiftStore Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
