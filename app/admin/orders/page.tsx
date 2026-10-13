"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowLeft, Search, Filter } from "lucide-react";
import { INITIAL_ORDERS } from "../../../prisma/seed.ts";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o)),
    );
  };

  const filtered = orders.filter((o) => {
    const matchesFilter =
      filter === "ALL" ||
      (filter === "COD_PENDING" &&
        o.paymentMethod === "COD" &&
        o.orderStatus === "NEW") ||
      (filter === "SHIPPED" && o.orderStatus === "SHIPPED");
    const matchesSearch =
      search === "" ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412] p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#e7e1d6]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="p-1.5 text-[#6b6963] hover:text-[#141412] rounded-lg hover:bg-[#e7e1d6]/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#141412]">
              Orders Fulfillment
            </h1>
            <p className="text-xs text-[#6b6963]">
              Real-time status updates & 1-click WhatsApp customer contact
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, phone, customer..."
          className="px-3.5 py-2 text-xs bg-white border border-[#e7e1d6] rounded-lg flex-1 focus:outline-none focus:border-[#b48849]"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 text-xs bg-white border border-[#e7e1d6] rounded-lg focus:outline-none focus:border-[#b48849]"
        >
          <option value="ALL">All Orders</option>
          <option value="COD_PENDING">COD Pending</option>
          <option value="SHIPPED">Shipped</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white border border-[#e7e1d6] rounded-xl shadow-xs">
        <table className="w-full text-left text-xs divide-y divide-[#e7e1d6]">
          <thead className="bg-[#f0ece1]/70 text-[#6b6963] uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Order Number</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Address & PIN</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Order Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e1d6]/70">
            {filtered.map((order) => {
              const waText = encodeURIComponent(
                `Namaste ${order.customerName}! Your ShiftStore order #${order.orderNumber} for ₹${order.totalAmount} is confirmed for express festive dispatch.`,
              );
              return (
                <tr key={order.id} className="hover:bg-[#fbf9f4]">
                  <td className="px-4 py-3 font-mono font-bold text-[#141412]">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#141412]">
                      {order.customerName}
                    </div>
                    <div className="text-[11px] text-[#6b6963]">
                      +91 {order.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="truncate text-[#141412]">
                      {order.address}
                    </div>
                    <div className="text-[11px] text-[#6b6963]">
                      PIN: {order.pincode}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold tabular-nums text-[#141412]">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-xs bg-[#f0ece1] uppercase">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="text-xs font-semibold bg-[#f6f3ec] border border-[#e7e1d6] rounded-md px-2 py-1"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`https://wa.me/91${order.phone}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#25D366] text-white rounded-md text-[11px] font-medium"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
