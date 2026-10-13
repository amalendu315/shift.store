/**
 * ShiftStore Next.js 14 Admin Products Management Page
 * File: app/admin/products/page.tsx
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Edit3, Check } from "lucide-react";
import { INITIAL_PRODUCTS } from "../../../prisma/seed.ts";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const toggleHero = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        isHeroDrop: p.id === id ? !p.isHeroDrop : false,
      })),
    );
  };

  const updatePrice = (id: string, salePrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, salePrice } : p)),
    );
  };

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
              Catalog & Hero Drops
            </h1>
            <p className="text-xs text-[#6b6963]">
              Toggle today's hero drop, update pricing, inventory, and badges
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className={`p-6 rounded-xl border bg-white shadow-xs space-y-4 ${
              p.isHeroDrop
                ? "border-[#b48849] ring-1 ring-[#b48849]"
                : "border-[#e7e1d6]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#141412]">
                  {p.title}
                </h3>
                <p className="text-xs text-[#6b6963]">{p.subtitle}</p>
              </div>
              <button
                onClick={() => toggleHero(p.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                  p.isHeroDrop
                    ? "bg-[#b48849] text-white border-[#b48849]"
                    : "bg-white text-[#6b6963] border-[#e7e1d6] hover:border-[#b48849]"
                }`}
              >
                <Star
                  className="w-3.5 h-3.5"
                  fill={p.isHeroDrop ? "currentColor" : "none"}
                />
                <span>
                  {p.isHeroDrop ? "Active Hero Drop" : "Promote to Hero"}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <label className="block text-[11px] text-[#6b6963] mb-1">
                  Sale Price (₹)
                </label>
                <input
                  type="number"
                  value={p.salePrice}
                  onChange={(e) =>
                    updatePrice(p.id, parseInt(e.target.value) || 0)
                  }
                  className="w-full px-2.5 py-1.5 border border-[#e7e1d6] rounded-md font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#6b6963] mb-1">
                  Original Price (₹)
                </label>
                <div className="px-2.5 py-1.5 bg-[#f0ece1]/50 border border-[#e7e1d6] rounded-md text-[#6b6963]">
                  ₹{p.originalPrice}
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#6b6963] mb-1">
                  Stock Left
                </label>
                <div className="px-2.5 py-1.5 bg-[#f0ece1]/50 border border-[#e7e1d6] rounded-md font-bold text-[#b48849]">
                  {p.stock} units
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#b48849] bg-[#fbf9f4] px-2 py-0.5 rounded border border-[#b48849]/30">
                {p.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
