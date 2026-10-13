"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  MessageCircle,
  PackageCheck,
  Star,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Lock,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  INITIAL_PRODUCTS_DATA,
  INITIAL_REVIEWS,
  FAQS_DATA,
  VALUE_PROPOSITIONS,
  SHIFTSTORE_STORY,
  CORE_POLICIES,
  ProductItem,
  BundleItem,
} from "../src/data/store.ts";
import { ProductVisual } from "../src/components/ProductVisual.tsx";
import { CheckoutModal, CheckoutItem } from "../components/CheckoutModal.tsx";
import { OrderSuccessModal } from "../src/components/OrderSuccessModal.tsx";

export default function StorefrontPage() {
  const [products, setProducts] = useState<ProductItem[]>(
    INITIAL_PRODUCTS_DATA,
  );
  const heroProduct = products.find((p) => p.isHeroDrop) || products[0];

  // Selected bundle for Hero Product
  const [selectedBundle, setSelectedBundle] = useState<BundleItem>(
    heroProduct.bundles.find((b) => b.isPopular) || heroProduct.bundles[0],
  );

  // Cart / Checkout Modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // FAQ Accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  // Buy hero bundle now
  const handleBuyHeroBundle = () => {
    setCheckoutItems([
      {
        productId: heroProduct.id,
        title: `${heroProduct.title} (${selectedBundle.title})`,
        quantity: selectedBundle.quantity,
        price: Math.round(selectedBundle.price / selectedBundle.quantity),
      },
    ]);
    setIsCheckoutOpen(true);
  };

  // Buy catalog item
  const handleBuyCatalogItem = (product: ProductItem) => {
    setCheckoutItems([
      {
        productId: product.id,
        title: product.title,
        quantity: 1,
        price: product.salePrice,
      },
    ]);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412] flex flex-col font-sans selection:bg-[#b48849] selection:text-white pb-24 sm:pb-12">
      {/* 1. Global Announcement Bar (Top of screen) */}
      <div className="bg-[#141412] text-[#f6f3ec] py-2 px-4 text-center text-xs tracking-wider font-medium flex items-center justify-center gap-2">
        <span>
          ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
          ACROSS INDIA
        </span>
      </div>

      {/* 2. Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#f6f3ec]/90 backdrop-blur-md border-b border-[#e7e1d6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <a
            href="#"
            className="font-serif text-2xl font-bold tracking-tight text-[#141412] whitespace-nowrap shrink-0"
          >
            ShiftStore
          </a>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#6b6963]">
            <a
              href="#hero-section"
              className="hover:text-[#141412] transition-colors whitespace-nowrap shrink-0"
            >
              Featured
            </a>
            <a
              href="#festive-catalog"
              className="hover:text-[#141412] transition-colors whitespace-nowrap shrink-0"
            >
              Collection
            </a>
            <a
              href="#why-us"
              className="hover:text-[#141412] transition-colors whitespace-nowrap shrink-0"
            >
              Why Us
            </a>
            <a
              href="#about-story"
              className="hover:text-[#141412] transition-colors whitespace-nowrap shrink-0"
            >
              Our Story
            </a>
            <a
              href="#reviews"
              className="hover:text-[#141412] transition-colors whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
            <a
              href="#faqs"
              className="hover:text-[#141412] transition-colors whitespace-nowrap shrink-0"
            >
              FAQs & COD
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#hero-section"
              className="px-4 py-2 text-xs font-semibold text-[#f6f3ec] bg-[#141412] rounded-lg hover:bg-[#2b2823] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#b48849]" />
              <span>Shop Collection</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Storefront Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-20 flex-1">
        {/* 3. Hero Section (Above the Fold) */}
        <section
          id="hero-section"
          className="text-center max-w-4xl mx-auto space-y-6 pt-4 pb-2"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48849] uppercase">
            <span>✦ Premium Curations • Limited Festive Stock</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#141412] leading-[1.15] text-balance">
            Make Your Space Feel Different.
          </h1>

          <p className="text-base sm:text-lg text-[#6b6963] leading-relaxed max-w-2xl mx-auto">
            We source premium, aesthetically striking home décor pieces for
            people who want their everyday spaces to feel a little more special.
            No overwhelming catalogs—just carefully selected items that look
            good, feel right, and are worth every rupee.
          </p>

          <div className="pt-2 space-y-3">
            <button
              onClick={handleBuyHeroBundle}
              className="inline-flex items-center justify-center gap-2 py-4 px-8 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-semibold text-sm transition-all shadow-md active:scale-[0.99]"
            >
              <span>Shop the Festive Collection →</span>
            </button>

            <div className="flex items-center justify-center gap-3 text-xs text-[#6b6963] font-medium pt-1">
              <span>✓ Secure Checkout</span>
              <span>|</span>
              <span>✓ Cash on Delivery</span>
              <span>|</span>
              <span>✓ Easy Replacements</span>
            </div>
          </div>
        </section>

        {/* 4. Single-Product Hero Drop */}
        <section
          id="hero-drop"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4 border-t border-[#e7e1d6]/70"
        >
          <div className="lg:col-span-7 space-y-4">
            <div className="relative">
              <ProductVisual
                type={heroProduct.imageSvgType}
                className="shadow-lg"
              />
              <div className="absolute top-4 right-4 bg-[#141412]/90 text-[#f6f3ec] px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs border border-[#b48849]/40">
                <Flame className="w-3.5 h-3.5 text-[#b48849]" />
                <span>{heroProduct.badge}</span>
              </div>
            </div>

            <div className="bg-white/60 border border-[#e7e1d6] rounded-xl p-5 space-y-3 text-xs sm:text-sm">
              <p className="font-semibold text-[#141412] leading-snug">
                <span className="text-[#b48849] font-bold uppercase tracking-wider text-[11px] block mb-1">
                  The Hook
                </span>
                {heroProduct.hook}
              </p>
              <p className="text-[#6b6963] leading-relaxed">
                <strong className="text-[#141412]">The Details: </strong>
                {heroProduct.details}
              </p>
              <p className="text-[#6b6963] leading-relaxed">
                <strong className="text-[#141412]">Why It Works: </strong>
                {heroProduct.whyItWorks}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {heroProduct.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-[#6b6963]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#b48849] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/70 border border-[#e7e1d6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#b48849] font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hero Product of the Season</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141412] leading-tight">
                {heroProduct.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#6b6963] leading-relaxed">
                {heroProduct.subtitle}
              </p>
            </div>

            <div className="flex items-baseline gap-3 pb-3 border-b border-[#e7e1d6]">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#141412] tabular-nums">
                ₹{selectedBundle.price.toLocaleString("en-IN")}
              </span>
              <span className="text-base text-[#6b6963] line-through tabular-nums">
                ₹
                {(
                  heroProduct.originalPrice * selectedBundle.quantity
                ).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-[#b48849] bg-[#fbf9f4] px-2 py-0.5 rounded border border-[#b48849]/30 uppercase">
                Save {selectedBundle.discountPercent}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#141412] uppercase tracking-wider">
                  Bundle Upsell (The "Best Value" Offer)
                </span>
                <span className="text-[#b48849] font-medium">
                  Free Fast Shipping
                </span>
              </div>

              <div className="space-y-2.5">
                {heroProduct.bundles.map((bundle) => {
                  const isSelected = selectedBundle.id === bundle.id;
                  return (
                    <div
                      key={bundle.id}
                      onClick={() => setSelectedBundle(bundle)}
                      className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#b48849] bg-[#fbf9f4] ring-1 ring-[#b48849] shadow-xs"
                          : "border-[#e7e1d6] bg-white hover:border-[#b48849]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-[#b48849] bg-[#b48849]"
                                : "border-[#6b6963]/50 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#141412]">
                              {bundle.title}
                            </div>
                            <div className="text-[11px] text-[#6b6963]">
                              {bundle.subtitle}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-sm tabular-nums text-[#141412]">
                            ₹{bundle.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {bundle.isPopular && (
                        <div className="absolute -top-2.5 right-4 bg-[#b48849] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                          Best Value Offer
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleBuyHeroBundle}
                className="w-full py-4 px-6 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
              >
                <span>
                  BUY NOW • ₹{selectedBundle.price.toLocaleString("en-IN")} •
                  COD AVAILABLE
                </span>
                <ArrowRight className="w-4 h-4 text-[#b48849]" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[#6b6963]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#b48849]" />
                  Pay on Delivery
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#b48849]" />
                  Dispatches in 24 Hours
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. The "Why Us" Value Proposition Grid */}
        <section id="why-us" className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-semibold tracking-wider text-[#b48849] uppercase">
              The ShiftStore Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141412]">
              Why Discerning Homes Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPOSITIONS.map((prop, idx) => (
              <div
                key={idx}
                className="bg-white/70 border border-[#e7e1d6] rounded-xl p-6 shadow-2xs space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#f0ece1] flex items-center justify-center text-[#b48849] border border-[#e7e1d6]">
                  {idx === 0 && <Truck className="w-5 h-5" />}
                  {idx === 1 && <PackageCheck className="w-5 h-5" />}
                  {idx === 2 && <Lock className="w-5 h-5" />}
                  {idx === 3 && <RotateCcw className="w-5 h-5" />}
                </div>
                <h3 className="font-serif font-bold text-base text-[#141412]">
                  {prop.title}
                </h3>
                <p className="text-xs text-[#6b6963] leading-relaxed">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Curated Catalog Section */}
        <section id="festive-catalog" className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-[#e7e1d6] pb-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#b48849] uppercase">
                Aesthetic Curations
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141412]">
                The Festive Catalog
              </h2>
            </div>
            <p className="text-xs text-[#6b6963]">
              Siliguri fulfillment hub · Dispatched within 24 hours
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white/70 border border-[#e7e1d6] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="p-3">
                    <ProductVisual
                      type={prod.imageSvgType}
                      badge={prod.badge}
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-base text-[#141412] group-hover:text-[#b48849] transition-colors">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-[#6b6963] line-clamp-2">
                      {prod.hook || prod.subtitle}
                    </p>
                    {prod.deliveryNote && (
                      <p className="text-[11px] text-[#b48849] font-medium pt-1">
                        {prod.deliveryNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold font-serif tabular-nums text-[#141412]">
                      ₹{prod.salePrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#6b6963] line-through tabular-nums">
                      ₹{prod.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyCatalogItem(prod)}
                    className="w-full py-2.5 px-3 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#b48849]" />
                    <span>Quick Order · COD</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. The ShiftStore Story (About Us) */}
        <section
          id="about-story"
          className="bg-white/80 border border-[#e7e1d6] rounded-2xl p-6 sm:p-10 space-y-8 shadow-xs"
        >
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold tracking-wider text-[#b48849] uppercase">
              The ShiftStore Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141412]">
              {SHIFTSTORE_STORY.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-[#6b6963] leading-relaxed pt-2">
            <div className="space-y-3 bg-[#f0ece1]/40 p-6 rounded-xl border border-[#e7e1d6]">
              <h3 className="font-serif font-bold text-lg text-[#141412]">
                {SHIFTSTORE_STORY.vision.title}
              </h3>
              <p>{SHIFTSTORE_STORY.vision.text}</p>
            </div>

            <div className="space-y-3 bg-[#f0ece1]/40 p-6 rounded-xl border border-[#e7e1d6]">
              <h3 className="font-serif font-bold text-lg text-[#141412]">
                {SHIFTSTORE_STORY.approach.title}
              </h3>
              <p>{SHIFTSTORE_STORY.approach.text}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#e7e1d6]">
            <h3 className="font-serif font-bold text-xl text-center text-[#141412]">
              The ShiftStore Promise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SHIFTSTORE_STORY.promises.map((p, idx) => (
                <div
                  key={idx}
                  className="space-y-2 p-4 bg-white rounded-xl border border-[#e7e1d6]"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#b48849] shrink-0" />
                    <h4 className="font-semibold text-xs sm:text-sm text-[#141412]">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#6b6963] leading-relaxed">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Customer Reviews Section (Social Proof) */}
        <section id="reviews" className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-semibold tracking-wider text-[#b48849] uppercase">
              Social Proof
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141412]">
              See Why Customers Say Yes.
            </h2>
            <div className="flex items-center justify-center gap-1 text-[#b48849] pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-bold text-[#141412] ml-1.5">
                5.0 / 5.0 Rating from Indian Buyers
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white/70 border border-[#e7e1d6] rounded-xl p-6 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[#b48849]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#141412] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e7e1d6]/70 flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#141412]">
                    — {rev.author}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                    {rev.verifiedText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Customer Trust & FAQs */}
        <section id="faqs" className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-semibold tracking-wider text-[#b48849] uppercase">
              Customer Trust & Policies
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141412]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS_DATA.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white/80 border border-[#e7e1d6] rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-[#141412] hover:bg-[#fbf9f4]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6b6963] transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#b48849]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#6b6963] leading-relaxed border-t border-[#e7e1d6]/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 10. Core Policies Strip */}
        <section className="bg-[#f0ece1]/50 border border-[#e7e1d6] rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="font-serif font-bold text-lg text-center text-[#141412]">
            Core Store Policies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#6b6963]">
            {CORE_POLICIES.map((policy, idx) => (
              <div
                key={idx}
                className="space-y-1.5 p-4 bg-white/70 rounded-xl border border-[#e7e1d6]"
              >
                <h4 className="font-bold text-[#141412] uppercase tracking-wider text-[11px]">
                  {policy.title}
                </h4>
                <p className="leading-relaxed">{policy.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 11. Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#f6f3ec]/95 backdrop-blur-md border-t border-[#e7e1d6] p-3 shadow-lg flex items-center gap-2">
        <a
          href="https://wa.me/919876543210?text=Namaste!%20I%20have%20a%20query%20about%20ordering%20from%20ShiftStore."
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-[#25D366] text-white rounded-xl shadow-xs shrink-0 flex items-center justify-center"
          aria-label="WhatsApp Order Assistance"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        <button
          onClick={handleBuyHeroBundle}
          className="flex-1 py-3 px-4 bg-[#141412] active:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-bold text-xs flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <span>
            BUY NOW • ₹{selectedBundle.price.toLocaleString("en-IN")} • COD
          </span>
        </button>
      </div>

      {/* 12. Footnote */}
      <footer className="mt-16 border-t border-[#e7e1d6] py-8 text-center text-xs text-[#6b6963] max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © 2026 ShiftStore India. Founded in Siliguri, West Bengal. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/admin/login" className="hover:text-[#141412] underline">
              Admin Portal
            </a>
            <span>·</span>
            <span>Siliguri Fulfillment Center</span>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={checkoutItems}
        onOrderSuccess={(ord: any) => setConfirmedOrder(ord)}
      />

      {/* Order Confirmed Modal */}
      {confirmedOrder && (
        <OrderSuccessModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  );
}
