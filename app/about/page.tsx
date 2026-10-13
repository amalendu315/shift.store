import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  Package,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { SHIFTSTORE_STORY } from "../../src/data/store.ts";

export const metadata = {
  title: "About Us | The ShiftStore Story",
  description:
    "Founded in Siliguri, West Bengal by Sandeep Malakar. Premium home decor with 24-hour dispatch and zero drop-shipping delays.",
};

export default function AboutPage() {
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
              href="/contact"
              className="hover:text-[#141412] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/policies"
              className="hover:text-[#141412] transition-colors"
            >
              Store Policies
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

      {/* Hero Header */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48849] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The ShiftStore Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#141412] leading-tight">
            {SHIFTSTORE_STORY.headline}
          </h1>
          <p className="text-base text-[#6b6963] max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between viral global design trends and the modern
            Indian home, with zero drop-shipping delays and local dispatch from
            Siliguri.
          </p>
        </div>

        {/* Narrative Section 1: The Vision */}
        <section className="bg-white/80 border border-[#e7e1d6] rounded-2xl p-8 sm:p-10 space-y-4 shadow-xs">
          <h2 className="text-2xl font-serif font-bold text-[#141412]">
            {SHIFTSTORE_STORY.vision.title}
          </h2>
          <p className="text-sm sm:text-base text-[#6b6963] leading-relaxed">
            {SHIFTSTORE_STORY.vision.text}
          </p>
        </section>

        {/* Narrative Section 2: Our Approach */}
        <section className="bg-white/80 border border-[#e7e1d6] rounded-2xl p-8 sm:p-10 space-y-4 shadow-xs">
          <h2 className="text-2xl font-serif font-bold text-[#141412]">
            {SHIFTSTORE_STORY.approach.title}
          </h2>
          <p className="text-sm sm:text-base text-[#6b6963] leading-relaxed">
            {SHIFTSTORE_STORY.approach.text}
          </p>
        </section>

        {/* The ShiftStore Promise (3 Pillar Cards) */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-semibold tracking-wider text-[#b48849] uppercase">
              Our Core Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141412]">
              The ShiftStore Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SHIFTSTORE_STORY.promises.map((promise, idx) => (
              <div
                key={idx}
                className="bg-white/90 border border-[#e7e1d6] rounded-xl p-6 shadow-2xs space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#f0ece1] flex items-center justify-center text-[#b48849] border border-[#e7e1d6]">
                  {idx === 0 && <ShieldCheck className="w-5 h-5" />}
                  {idx === 1 && <Truck className="w-5 h-5" />}
                  {idx === 2 && <Package className="w-5 h-5" />}
                </div>
                <h3 className="font-serif font-bold text-lg text-[#141412]">
                  {promise.title}
                </h3>
                <p className="text-xs text-[#6b6963] leading-relaxed">
                  {promise.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder & Siliguri Hub Note */}
        <section className="bg-[#f0ece1]/60 border border-[#e7e1d6] rounded-2xl p-8 text-center space-y-4">
          <HeartHandshake className="w-8 h-8 text-[#b48849] mx-auto" />
          <h3 className="font-serif font-bold text-2xl text-[#141412]">
            Direct from Siliguri, West Bengal
          </h3>
          <p className="text-xs sm:text-sm text-[#6b6963] max-w-xl mx-auto leading-relaxed">
            Every package is inspected, wrapped in custom honeycomb protection,
            and handed to express couriers right here in North Bengal.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Explore The Festive Catalog</span>
              <ArrowRight className="w-4 h-4 text-[#b48849]" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e7e1d6] py-8 text-center text-xs text-[#6b6963] max-w-7xl mx-auto px-6 mt-16">
        <p>
          © 2026 ShiftStore India. Founded in Siliguri, West Bengal by Sandeep
          Malakar. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
