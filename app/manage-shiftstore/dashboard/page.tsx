import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  Clock,
  Percent,
  ArrowUpRight,
} from "lucide-react";
import { INITIAL_ORDERS } from "../../../prisma/seed.ts";

export default function AdminDashboardPage() {
  const totalRevenue = INITIAL_ORDERS.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0,
  );
  const totalOrders = INITIAL_ORDERS.length;
  const pendingCod = INITIAL_ORDERS.filter(
    (o) => o.paymentMethod === "COD" && o.orderStatus === "NEW",
  ).length;
  const festiveConversionRate = 4.8;

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412] p-6 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e7e1d6]">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#141412]">
            Festive Operations Dashboard
          </h1>
          <p className="text-xs text-[#6b6963] mt-0.5">
            ShiftStore India · Internal Fulfillment Management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/manage-shiftstore/orders"
            className="px-3.5 py-2 bg-white border border-[#e7e1d6] rounded-lg text-xs font-semibold text-[#141412] hover:border-[#b48849]"
          >
            Manage Orders ({totalOrders})
          </Link>
          <Link
            href="/manage-shiftstore/products"
            className="px-3.5 py-2 bg-[#141412] text-[#f6f3ec] rounded-lg text-xs font-semibold hover:bg-[#2b2823]"
          >
            Configure Products
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e7e1d6] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b6963] mb-2">
            <span>Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#b48849]" />
          </div>
          <div className="text-2xl font-bold font-serif tabular-nums text-[#141412]">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            +28.4% Festive lift vs baseline
          </div>
        </div>

        <div className="bg-white border border-[#e7e1d6] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b6963] mb-2">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-[#b48849]" />
          </div>
          <div className="text-2xl font-bold tabular-nums text-[#141412]">
            {totalOrders}
          </div>
          <div className="mt-2 text-[11px] text-[#6b6963]">
            100% address & phone verified
          </div>
        </div>

        <div className="bg-white border border-[#e7e1d6] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b6963] mb-2">
            <span>Pending COD Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold tabular-nums text-amber-700">
            {pendingCod}
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-medium">
            Require dispatch confirmation
          </div>
        </div>

        <div className="bg-white border border-[#e7e1d6] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6b6963] mb-2">
            <span>Festive Conversion Rate</span>
            <Percent className="w-4 h-4 text-[#b48849]" />
          </div>
          <div className="text-2xl font-bold tabular-nums text-[#141412]">
            {festiveConversionRate}%
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            Hero lander + prepaid CRO
          </div>
        </div>
      </div>
    </div>
  );
}
