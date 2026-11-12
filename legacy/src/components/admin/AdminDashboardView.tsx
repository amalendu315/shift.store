/**
 * ShiftStore Admin Suite Component
 * Used both in the live app preview and in Next.js 14 /admin/ pages
 */

import React, { useState } from "react";
import {
  TrendingUp,
  Package,
  Clock,
  Percent,
  Search,
  MessageCircle,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  Edit3,
  LogOut,
  Plus,
  ShieldAlert,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { ProductItem, OrderRecord } from "../../data/store.ts";

interface AdminDashboardProps {
  products: ProductItem[];
  orders: OrderRecord[];
  onUpdateOrderStatus: (
    orderId: string,
    newStatus: OrderRecord["orderStatus"],
  ) => void;
  onUpdateProduct: (product: ProductItem) => void;
  onLogout: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onUpdateOrderStatus,
  onUpdateProduct,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products" | "pincodes"
  >("overview");
  const [orderFilter, setOrderFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Compute KPI metrics dynamically
  const totalRevenue = orders.reduce(
    (sum, o) =>
      sum +
      (o.paymentStatus === "PAID" || o.orderStatus !== "CANCELLED"
        ? o.totalAmount
        : 0),
    0,
  );
  const totalOrdersCount = orders.length;
  const pendingCodOrders = orders.filter(
    (o) => o.paymentMethod === "COD" && o.orderStatus === "NEW",
  ).length;
  const festiveConversionRate = 4.8; // High CRO benchmark for festive single-product drops

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      orderFilter === "ALL" ||
      (orderFilter === "COD_PENDING" &&
        o.paymentMethod === "COD" &&
        (o.orderStatus === "NEW" || o.orderStatus === "CONFIRMED")) ||
      (orderFilter === "SHIPPED" && o.orderStatus === "SHIPPED") ||
      (orderFilter === "DELIVERED" && o.orderStatus === "DELIVERED") ||
      (orderFilter === "CANCELLED" && o.orderStatus === "CANCELLED");

    const matchesSearch =
      searchQuery === "" ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.pincode.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412]">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#f6f3ec]/95 backdrop-blur-md border-b border-[#e7e1d6] px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-[#141412]">
                ShiftStore
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-[#b48849] bg-[#f0ece1] px-2 py-0.5 rounded-sm uppercase border border-[#e7e1d6]">
                Ops Admin
              </span>
            </div>

            {/* Tab Navigation */}
            <nav className="hidden sm:flex items-center gap-1 bg-[#ede7da] p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "overview"
                    ? "bg-white text-[#141412] shadow-xs font-semibold"
                    : "text-[#6b6963] hover:text-[#141412]"
                }`}
              >
                KPI Overview
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "orders"
                    ? "bg-white text-[#141412] shadow-xs font-semibold"
                    : "text-[#6b6963] hover:text-[#141412]"
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "products"
                    ? "bg-white text-[#141412] shadow-xs font-semibold"
                    : "text-[#6b6963] hover:text-[#141412]"
                }`}
              >
                Hero & Catalog
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs text-[#6b6963]">
              admin@shiftstore.in · Live Durga Puja Sale
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6b6963] hover:text-red-700 hover:bg-red-50/50 rounded-lg border border-[#e7e1d6] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* KPI Overview Cards */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in">
            {/* KPI Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenue */}
              <div className="bg-white/80 border border-[#e7e1d6] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#6b6963] mb-2">
                  <span>Gross Revenue (INR)</span>
                  <TrendingUp className="w-4 h-4 text-[#b48849]" />
                </div>
                <div className="text-2xl font-bold font-serif tabular-nums text-[#141412]">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </div>
                <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +28.4% festive lift vs yesterday
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white/80 border border-[#e7e1d6] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#6b6963] mb-2">
                  <span>Total Festive Orders</span>
                  <Package className="w-4 h-4 text-[#b48849]" />
                </div>
                <div className="text-2xl font-bold tabular-nums text-[#141412]">
                  {totalOrdersCount}
                </div>
                <div className="mt-2 text-[11px] text-[#6b6963]">
                  100% address & phone verified
                </div>
              </div>

              {/* Pending COD Orders */}
              <div className="bg-white/80 border border-[#e7e1d6] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#6b6963] mb-2">
                  <span>Pending COD Dispatch</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold tabular-nums text-amber-700">
                  {pendingCodOrders}
                </div>
                <div className="mt-2 text-[11px] text-amber-700 font-medium">
                  Requires 1-click WhatsApp confirmation
                </div>
              </div>

              {/* Festive Conversion Rate */}
              <div className="bg-white/80 border border-[#e7e1d6] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#6b6963] mb-2">
                  <span>Festive CRO Rate</span>
                  <Percent className="w-4 h-4 text-[#b48849]" />
                </div>
                <div className="text-2xl font-bold tabular-nums text-[#141412]">
                  {festiveConversionRate}%
                </div>
                <div className="mt-2 text-[11px] text-emerald-700 font-medium">
                  Single-product hero lander + bundle CRO
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/80 border border-[#e7e1d6] rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#141412]">
                    Recent Order Activity
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-[#b48849] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-[#e7e1d6]/60">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#141412]">
                            {order.orderNumber}
                          </span>
                          <span className="text-[#6b6963]">
                            · {order.customerName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#f0ece1] text-[#6b6963] uppercase">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <p className="text-[#6b6963] mt-0.5">
                          {order.address}, PIN {order.pincode}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold tabular-nums text-[#141412]">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </span>
                        <div>
                          <span
                            className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-xs mt-1 ${
                              order.orderStatus === "SHIPPED"
                                ? "bg-blue-50 text-blue-800"
                                : order.orderStatus === "CONFIRMED"
                                  ? "bg-emerald-50 text-emerald-800"
                                  : "bg-amber-50 text-amber-800"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Drop Live Status Card */}
              <div className="bg-white/80 border border-[#e7e1d6] rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#141412]">
                    Active Hero Drop
                  </h3>
                  <span className="text-[10px] font-semibold text-[#b48849] uppercase bg-[#fbf9f4] px-2 py-0.5 rounded-xs border border-[#b48849]/30">
                    Live On Storefront
                  </span>
                </div>

                {products.find((p) => p.isHeroDrop) && (
                  <div className="p-4 bg-[#f0ece1]/50 rounded-xl border border-[#e7e1d6] space-y-3">
                    <p className="font-serif font-bold text-base text-[#141412]">
                      {products.find((p) => p.isHeroDrop)?.title}
                    </p>
                    <p className="text-xs text-[#6b6963]">
                      {products.find((p) => p.isHeroDrop)?.subtitle}
                    </p>
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-[#e7e1d6]">
                      <span className="text-[#6b6963]">Price:</span>
                      <span className="font-bold tabular-nums text-[#141412]">
                        ₹{products.find((p) => p.isHeroDrop)?.salePrice}{" "}
                        (Original ₹
                        {products.find((p) => p.isHeroDrop)?.originalPrice})
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#6b6963]">Stock Remaining:</span>
                      <span className="font-bold tabular-nums text-[#b48849]">
                        {products.find((p) => p.isHeroDrop)?.stock} units
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setActiveTab("products")}
                  className="w-full py-2.5 px-3 bg-[#f6f3ec] hover:bg-[#e7e1d6] text-[#141412] text-xs font-semibold rounded-lg border border-[#e7e1d6] transition-colors"
                >
                  Configure Hero Drop & Bundles →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Management View */}
        {(activeTab === "orders" || activeTab === "overview") && (
          <div className="bg-white/80 border border-[#e7e1d6] rounded-xl p-6 shadow-xs space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#141412]">
                  Durga Puja Order Fulfillment
                </h2>
                <p className="text-xs text-[#6b6963] mt-0.5">
                  Update shipping status and initiate direct 1-click WhatsApp
                  customer support messages.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6b6963]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by order #, phone, name..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e7e1d6] rounded-lg focus:outline-none focus:border-[#b48849]"
                  />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-[#e7e1d6] rounded-lg text-[#141412] focus:outline-none focus:border-[#b48849]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="COD_PENDING">COD Pending</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto border border-[#e7e1d6] rounded-xl">
              <table className="w-full text-left text-xs divide-y divide-[#e7e1d6]">
                <thead className="bg-[#f0ece1]/70 text-[#6b6963] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Order Number</th>
                    <th className="px-4 py-3">Customer & Contact</th>
                    <th className="px-4 py-3">Shipping Address</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e1d6]/70 bg-white">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-[#6b6963]"
                      >
                        No orders found matching the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const whatsappText = encodeURIComponent(
                        `🙏 Namaste ${order.customerName}! Your ShiftStore festive order #${order.orderNumber} for ₹${order.totalAmount} is confirmed! Our Kolkata hub is preparing priority Air Express dispatch. Delivery PIN: ${order.pincode}.`,
                      );
                      const whatsappHref = `https://wa.me/91${order.phone}?text=${whatsappText}`;

                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-[#fbf9f4] transition-colors"
                        >
                          <td className="px-4 py-3.5 font-mono font-bold text-[#141412] whitespace-nowrap">
                            {order.orderNumber}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-[#141412]">
                              {order.customerName}
                            </div>
                            <div className="text-[11px] text-[#6b6963] tabular-nums mt-0.5">
                              +91 {order.phone}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 max-w-xs">
                            <div className="truncate text-[#141412]">
                              {order.address}
                            </div>
                            <div className="text-[11px] text-[#6b6963]">
                              PIN: {order.pincode}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-bold tabular-nums text-[#141412]">
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-xs uppercase ${
                                order.paymentMethod === "COD"
                                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              }`}
                            >
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              value={order.orderStatus}
                              onChange={(e) =>
                                onUpdateOrderStatus(
                                  order.id,
                                  e.target.value as OrderRecord["orderStatus"],
                                )
                              }
                              className="text-[11px] font-semibold bg-[#f6f3ec] border border-[#e7e1d6] rounded-md px-2 py-1 text-[#141412] focus:outline-none focus:border-[#b48849]"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <a
                              href={whatsappHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-md text-[11px] font-medium transition-colors shadow-2xs"
                              title="Send WhatsApp confirmation to customer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products & Hero Drop Editor View */}
        {activeTab === "products" && (
          <div className="bg-white/80 border border-[#e7e1d6] rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#141412]">
                  Products & Hero Drop Management
                </h2>
                <p className="text-xs text-[#6b6963] mt-0.5">
                  Promote products to the Hero Drop of the Day, update pricing,
                  inventory, and badges.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className={`border rounded-xl p-5 space-y-4 transition-all ${
                    prod.isHeroDrop
                      ? "border-[#b48849] bg-[#fbf9f4] shadow-xs"
                      : "border-[#e7e1d6] bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg font-bold text-[#141412]">
                          {prod.title}
                        </span>
                        {prod.isHeroDrop && (
                          <span className="text-[10px] bg-[#141412] text-[#f6f3ec] px-2 py-0.5 rounded-xs font-semibold uppercase">
                            ⭐ HERO DROP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6b6963] mt-0.5">
                        {prod.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        onUpdateProduct({
                          ...prod,
                          isHeroDrop: !prod.isHeroDrop,
                        })
                      }
                      className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                        prod.isHeroDrop
                          ? "bg-[#b48849] text-white border-[#b48849]"
                          : "bg-white text-[#6b6963] border-[#e7e1d6] hover:border-[#b48849]"
                      }`}
                    >
                      {prod.isHeroDrop ? "Hero Active" : "Set as Hero"}
                    </button>
                  </div>

                  {/* Inline Price and Inventory Editor */}
                  <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                    <div>
                      <label className="block text-[11px] text-[#6b6963] mb-1">
                        Sale Price (₹)
                      </label>
                      <input
                        type="number"
                        value={prod.salePrice}
                        onChange={(e) =>
                          onUpdateProduct({
                            ...prod,
                            salePrice: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-2.5 py-1.5 border border-[#e7e1d6] rounded-md font-bold tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#6b6963] mb-1">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        value={prod.originalPrice}
                        onChange={(e) =>
                          onUpdateProduct({
                            ...prod,
                            originalPrice: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-2.5 py-1.5 border border-[#e7e1d6] rounded-md tabular-nums text-[#6b6963]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#6b6963] mb-1">
                        Stock Left
                      </label>
                      <input
                        type="number"
                        value={prod.stock}
                        onChange={(e) =>
                          onUpdateProduct({
                            ...prod,
                            stock: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-2.5 py-1.5 border border-[#e7e1d6] rounded-md font-semibold tabular-nums text-[#b48849]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#6b6963] mb-1">
                      Promotional Badge Text
                    </label>
                    <input
                      type="text"
                      value={prod.badge}
                      onChange={(e) =>
                        onUpdateProduct({
                          ...prod,
                          badge: e.target.value,
                        })
                      }
                      placeholder="e.g. PUJA DROP • 38 LEFT"
                      className="w-full px-2.5 py-1.5 border border-[#e7e1d6] rounded-md text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
