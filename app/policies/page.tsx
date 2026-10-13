"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  FileText,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<
    "shipping" | "returns" | "privacy" | "terms"
  >("shipping");

  const tabs = [
    { id: "shipping", label: "Shipping Policy", icon: Truck },
    { id: "returns", label: "Return & Replacement", icon: RotateCcw },
    { id: "privacy", label: "Privacy Policy", icon: ShieldCheck },
    { id: "terms", label: "Terms of Service", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412] font-sans selection:bg-[#b48849] selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#141412] text-[#f6f3ec] py-2 px-4 text-center text-xs tracking-wider font-medium">
        <span>
          ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
          ACROSS INDIA
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#f6f3ec]/90 backdrop-blur-md border-b border-[#e7e1d6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#6b6963] hover:text-[#141412] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-[#141412]"
            >
              ShiftStore
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#6b6963]">
            <Link
              href="/about"
              className="hover:text-[#141412] transition-colors"
            >
              Our Story
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#141412] transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-xs font-semibold text-[#f6f3ec] bg-[#141412] rounded-lg hover:bg-[#2b2823] transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48849] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparency & Trust</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#141412]">
            Store Policies & Legal Terms
          </h1>
          <p className="text-xs sm:text-sm text-[#6b6963] max-w-lg mx-auto">
            Clear, honest terms crafted to protect your purchases and guarantee
            an immaculate festive shopping experience.
          </p>
        </div>

        {/* Vertical Tabs & Content Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Vertical Navigation Tab Bar (Left Column) */}
          <nav
            aria-label="Policy tabs"
            className="md:col-span-4 bg-white/80 border border-[#e7e1d6] rounded-2xl p-2.5 shadow-xs space-y-1.5 sticky top-24"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? "bg-[#141412] text-[#f6f3ec] shadow-xs"
                      : "text-[#6b6963] hover:text-[#141412] hover:bg-[#f0ece1]/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-[#b48849]" : "text-[#6b6963]"}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Policy Detail Card (Right Column) */}
          <div className="md:col-span-8 bg-white/90 border border-[#e7e1d6] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 text-sm text-[#6b6963] leading-relaxed animate-in fade-in">
            {/* 1. Shipping Policy */}
            {activeTab === "shipping" && (
              <div className="space-y-6">
                <div className="border-b border-[#e7e1d6] pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#b48849] uppercase tracking-wider">
                    <Truck className="w-4 h-4" />
                    <span>Logistics Framework</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#141412] mt-1">
                    Shipping & Delivery Policy
                  </h2>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#141412]">
                    1. Warehouse Dispatch Timelines
                  </h3>
                  <p>
                    Every product displayed as in stock on ShiftStore is
                    physically stored at our primary fulfillment center located
                    in <strong>Siliguri, West Bengal (PIN: 734001)</strong>. We
                    do not operate under third-party international drop-shipping
                    models.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs">
                    <li>
                      Orders placed before <strong>2:00 PM IST</strong> are
                      processed and handed to courier partners on the{" "}
                      <strong>same business day</strong>.
                    </li>
                    <li>
                      Orders placed after 2:00 PM IST dispatch within{" "}
                      <strong>24 hours</strong>.
                    </li>
                  </ul>

                  <h3 className="font-serif font-bold text-base text-[#141412] pt-2">
                    2. Estimated Transit Times
                  </h3>
                  <div className="border border-[#e7e1d6] rounded-xl overflow-hidden divide-y divide-[#e7e1d6] text-xs">
                    <div className="grid grid-cols-2 p-3 bg-[#fbf9f4]">
                      <span className="font-semibold text-[#141412]">
                        Eastern India (West Bengal, Assam, Bihar, Odisha)
                      </span>
                      <span className="text-[#6b6963]">
                        2 to 4 Business Days
                      </span>
                    </div>
                    <div className="grid grid-cols-2 p-3 bg-white">
                      <span className="font-semibold text-[#141412]">
                        Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad)
                      </span>
                      <span className="text-[#6b6963]">
                        3 to 5 Business Days
                      </span>
                    </div>
                    <div className="grid grid-cols-2 p-3 bg-[#fbf9f4]">
                      <span className="font-semibold text-[#141412]">
                        Rest of India (Tier 2 & 3 Cities)
                      </span>
                      <span className="text-[#6b6963]">
                        4 to 7 Business Days
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#141412] pt-2">
                    3. Shipping Charges & COD Convenience Fee
                  </h3>
                  <p>
                    <strong>Prepaid Orders (UPI / Card / Net Banking):</strong>{" "}
                    100% Free Express Shipping nationwide with no minimum cart
                    requirement.
                  </p>
                  <p>
                    <strong>Cash on Delivery (COD):</strong> A nominal logistics
                    handling charge of <strong>₹50</strong> applies to Cash on
                    Delivery orders to offset courier cash-collection fees.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Return & Replacement Policy */}
            {activeTab === "returns" && (
              <div className="space-y-6">
                <div className="border-b border-[#e7e1d6] pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#b48849] uppercase tracking-wider">
                    <RotateCcw className="w-4 h-4" />
                    <span>Quality Assurance</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#141412] mt-1">
                    Return & Free Replacement Policy
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">
                        Mandatory Unboxing Video Requirement
                      </strong>
                      To prevent fraud and maintain the highest hygiene and
                      quality benchmarks during high-volume festive seasons, all
                      damage claims must include a continuous unboxing video
                      recorded from the moment the sealed outer flyer is opened.
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#141412]">
                    1. Transit Damage or Manufacturing Defects
                  </h3>
                  <p>
                    In the rare circumstance that your fragile stoneware,
                    ceramic vase, or diffuser arrives chipped or broken during
                    transit, ShiftStore provides an{" "}
                    <strong>immediate, 100% free replacement</strong>.
                  </p>
                  <p>
                    Simply message our WhatsApp support desk at{" "}
                    <strong>+91 98765 43210</strong> or email{" "}
                    <strong>support@shiftstore.in</strong> within{" "}
                    <strong>48 hours of delivery</strong> with your order number
                    and the unboxing clip. We will dispatch a fresh replacement
                    unit within 24 hours at zero additional cost.
                  </p>

                  <h3 className="font-serif font-bold text-base text-[#141412] pt-2">
                    2. Dislike or Change of Mind
                  </h3>
                  <p>
                    Because home décor items are fragile, handcrafted in limited
                    artisanal batches, and subject to damage during return
                    transit loops, we do not accept returns for change of mind
                    once an undamaged item has been unboxed.
                  </p>
                </div>
              </div>
            )}

            {/* 3. Privacy Policy */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div className="border-b border-[#e7e1d6] pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#b48849] uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Data Protection</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#141412] mt-1">
                    Privacy Policy
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <p>
                    At ShiftStore India, we respect the sanctity of your private
                    information. We collect only what is strictly required to
                    fulfill your order and notify you of courier transit events.
                  </p>
                  <h3 className="font-serif font-bold text-base text-[#141412]">
                    1. Information Collected
                  </h3>
                  <p>
                    When placing an order or registering an account, we collect:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>
                      Recipient Name and complete street delivery address with
                      Postal PIN code.
                    </li>
                    <li>
                      10-digit Indian Mobile Number for WhatsApp dispatch
                      notifications and delivery coordination.
                    </li>
                    <li>
                      Payment method and transactional authorization tokens (via
                      PCI-DSS compliant Razorpay). We never view or store full
                      credit card numbers or banking passwords.
                    </li>
                  </ul>

                  <h3 className="font-serif font-bold text-base text-[#141412] pt-2">
                    2. Absolute Non-Disclosure Guarantee
                  </h3>
                  <p>
                    We <strong>never sell, rent, or trade</strong> your personal
                    contact details to external marketing brokers or third-party
                    telemarketers. Your phone number is strictly utilized for
                    automated order status alerts and delivery verification.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Terms of Service */}
            {activeTab === "terms" && (
              <div className="space-y-6">
                <div className="border-b border-[#e7e1d6] pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#b48849] uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    <span>Legal Agreement</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#141412] mt-1">
                    Terms of Service
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <p>
                    By browsing or transacting on ShiftStore (shiftstore.in),
                    you agree to be bound by the following operational terms
                    governed by the laws of India.
                  </p>
                  <h3 className="font-serif font-bold text-base text-[#141412]">
                    1. Pricing & Stock Availability
                  </h3>
                  <p>
                    All prices are listed in Indian Rupees (INR) and include
                    applicable GST taxes. Due to the limited nature of our
                    festive curations, orders are confirmed subject to stock
                    availability at our Siliguri warehouse.
                  </p>
                  <h3 className="font-serif font-bold text-base text-[#141412]">
                    2. Cash on Delivery Fair Usage
                  </h3>
                  <p>
                    Customers opting for Cash on Delivery are expected to be
                    available at the specified address or nominate a
                    representative with exact change. Repeated refused
                    deliveries without genuine cause may result in restriction
                    of COD payment eligibility on future orders.
                  </p>
                  <h3 className="font-serif font-bold text-base text-[#141412]">
                    3. Jurisdiction
                  </h3>
                  <p>
                    Any disputes arising from transactions conducted on
                    ShiftStore shall be subject to the exclusive jurisdiction of
                    the competent courts in Siliguri, West Bengal, India.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e7e1d6] py-8 text-center text-xs text-[#6b6963] max-w-7xl mx-auto px-6 mt-16">
        <p>
          © 2026 ShiftStore India. All rights reserved. Registered in Siliguri,
          West Bengal.
        </p>
      </footer>
    </div>
  );
}
