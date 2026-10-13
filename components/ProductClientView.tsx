"use client";

import React, { useState, useMemo } from "react";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Share2,
  Heart,
  ShoppingBag,
  ArrowRight,
  Package,
  Layers,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { ProductItem, BundleItem } from "../src/data/store.ts";
import { ProductVisual } from "../src/components/ProductVisual.tsx";
import { CheckoutModal, CheckoutItem } from "./CheckoutModal.tsx";
import { OrderSuccessModal } from "../src/components/OrderSuccessModal.tsx";
import { checkPincode, PincodeCheckResult } from "../actions/pincode.ts";

interface ProductClientViewProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
  onNavigateProduct?: (slug: string) => void;
  onNavigateHome?: () => void;
}

export const ProductClientView: React.FC<ProductClientViewProps> = ({
  product,
  relatedProducts,
  onNavigateProduct,
  onNavigateHome,
}) => {
  // Image gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Gallery view modes (main view, alternate angle, lifestyle)
  const galleryViews = [
    { id: 0, label: "Studio View", type: product.imageSvgType },
    { id: 1, label: "Ambient Lighting", type: product.imageSvgType },
    { id: 2, label: "Scale & Texture", type: product.imageSvgType },
  ];

  // Bundle offer selection
  const [selectedBundle, setSelectedBundle] = useState<BundleItem>(
    product.bundles.find((b) => b.isPopular) || product.bundles[0],
  );

  // Pincode check state
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeResult, setPincodeResult] = useState<{
    tested: boolean;
    valid: boolean;
    deliveryDate: string;
    isCod: boolean;
    city?: string;
    message: string;
  } | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);

  // Description expand/collapse
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Calculate discount percentage
  const discountPercent = Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
  );

  // Handle Flipkart-style Pincode Lookup
  const handlePincodeCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = pincodeInput.trim();
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setPincodeResult({
        tested: true,
        valid: false,
        deliveryDate: "",
        isCod: false,
        message: "Please enter a valid 6-digit Indian PIN code.",
      });
      return;
    }

    setIsCheckingPin(true);
    try {
      const res: PincodeCheckResult = await checkPincode(clean);
      const days = res.estimatedDays || 3;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      const formattedDate = targetDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

      setPincodeResult({
        tested: true,
        valid: true,
        deliveryDate: formattedDate,
        isCod: res.isCodAvailable,
        city: res.city,
        message: `Delivery by ${formattedDate} | FREE Delivery | Cash on Delivery Available`,
      });
    } catch {
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 3);
      setPincodeResult({
        tested: true,
        valid: true,
        deliveryDate: fallbackDate.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        isCod: true,
        message: "Delivery in 3–4 business days | Cash on Delivery Available",
      });
    } finally {
      setIsCheckingPin(false);
    }
  };

  // Buy Now Trigger
  const handleBuyNow = () => {
    setCheckoutItems([
      {
        productId: product.id,
        title: `${product.title} (${selectedBundle.title})`,
        quantity: selectedBundle.quantity,
        price: Math.round(selectedBundle.price / selectedBundle.quantity),
      },
    ]);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412] font-sans pb-28 lg:pb-16 selection:bg-[#b48849] selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#141412] text-[#f6f3ec] py-2 px-4 text-center text-xs tracking-wider font-medium flex items-center justify-center gap-2">
        <span>
          ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
          ACROSS INDIA
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#f6f3ec]/90 backdrop-blur-md border-b border-[#e7e1d6] px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onNavigateHome ? (
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#6b6963] hover:text-[#141412] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Store</span>
              </button>
            ) : (
              <a
                href="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#6b6963] hover:text-[#141412] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Store</span>
              </a>
            )}
            <a
              href="/"
              className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#141412]"
            >
              ShiftStore
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBuyNow}
              className="px-4 py-2 text-xs font-semibold text-[#f6f3ec] bg-[#141412] rounded-lg hover:bg-[#2b2823] transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#b48849]" />
              <span>Instant Buy</span>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs text-[#6b6963] flex items-center gap-2">
        <a href="/" className="hover:text-[#141412]">
          Home
        </a>
        <span>/</span>
        <span className="text-[#141412] font-medium truncate">
          {product.title}
        </span>
      </div>

      {/* Main PDP Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================
              A. IMAGE GALLERY (Left Column)
          ======================================================== */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Prominent Image */}
            <div className="relative rounded-2xl overflow-hidden border border-[#e7e1d6] shadow-md bg-white">
              <ProductVisual
                type={product.imageSvgType}
                badge={product.badge}
                className="w-full aspect-[4/3] sm:aspect-square"
              />
              <div className="absolute bottom-3 left-3 bg-[#141412]/80 text-[#f6f3ec] text-[10px] tracking-wider font-semibold uppercase px-2.5 py-1 rounded-sm backdrop-blur-xs">
                Siliguri Hub Verified • {galleryViews[selectedImageIndex].label}
              </div>
            </div>

            {/* Clickable Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {galleryViews.map((item, idx) => {
                const isActive = selectedImageIndex === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      isActive
                        ? "border-[#b48849] ring-2 ring-[#b48849]/30"
                        : "border-[#e7e1d6] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <ProductVisual
                      type={item.type}
                      className="w-full h-full object-cover scale-105"
                    />
                    <span className="absolute bottom-1 inset-x-1 bg-[#141412]/80 text-[#f6f3ec] text-[9px] text-center font-medium truncate rounded-xs">
                      {item.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              B. CORE PURCHASE ZONE (Right Column - Above The Fold)
          ======================================================== */}
          <div className="lg:col-span-6 space-y-6 bg-white/70 border border-[#e7e1d6] rounded-2xl p-6 sm:p-8 shadow-xs">
            {/* Title & Ratings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#b48849] uppercase tracking-wider">
                  {product.badge || "✦ Limited Festive Stock"}
                </span>
                <span className="text-[#6b6963] text-xs">·</span>
                <div className="flex items-center gap-1 bg-[#f0ece1] text-[#141412] px-2 py-0.5 rounded text-xs font-bold">
                  <Star className="w-3 h-3 fill-[#b48849] text-[#b48849]" />
                  <span>4.9</span>
                  <span className="text-[10px] text-[#6b6963] font-normal">
                    (480+ Reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#141412] leading-tight">
                {product.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#6b6963] leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* Dynamic Flipkart-Style Pricing */}
            <div className="p-4 bg-[#fbf9f4] border border-[#e7e1d6] rounded-xl flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#141412] tabular-nums">
                ₹{selectedBundle.price.toLocaleString("en-IN")}
              </span>
              <span className="text-base text-[#6b6963] line-through tabular-nums">
                ₹
                {(
                  product.originalPrice * selectedBundle.quantity
                ).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-sm uppercase tracking-wide">
                {selectedBundle.discountPercent || discountPercent}% Off
              </span>
              <span className="text-[11px] text-[#6b6963] ml-auto hidden sm:inline">
                Inclusive of all taxes
              </span>
            </div>

            {/* Bundle Selector */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-[#141412] uppercase tracking-wider block">
                Select Your Package Deal
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.bundles.map((bundle) => {
                  const isSelected = selectedBundle.id === bundle.id;
                  return (
                    <div
                      key={bundle.id}
                      onClick={() => setSelectedBundle(bundle)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#b48849] bg-[#fbf9f4] ring-1 ring-[#b48849] shadow-xs"
                          : "border-[#e7e1d6] bg-white hover:border-[#b48849]/50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-xs text-[#141412]">
                            {bundle.title}
                          </p>
                          <p className="text-[11px] text-[#6b6963] mt-0.5">
                            {bundle.subtitle}
                          </p>
                        </div>
                        <p className="font-bold text-sm tabular-nums text-[#141412]">
                          ₹{bundle.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Flipkart-Style Pincode Checker */}
            <div className="space-y-2 pt-2 border-t border-[#e7e1d6]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#141412] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#b48849]" />
                  Delivery & Serviceability Check
                </label>
                <span className="text-[11px] text-[#6b6963]">
                  Dispatches from Siliguri
                </span>
              </div>

              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) =>
                    setPincodeInput(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit delivery pincode"
                  className="flex-1 px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849] tabular-nums"
                />
                <button
                  type="submit"
                  disabled={isCheckingPin || pincodeInput.trim().length !== 6}
                  className="px-5 py-2.5 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isCheckingPin ? "Checking..." : "Check"}
                </button>
              </form>

              {pincodeResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    pincodeResult.valid
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }`}
                >
                  {pincodeResult.valid ? (
                    <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{pincodeResult.message}</p>
                    {pincodeResult.valid && (
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Shipped via Air Express directly from our Siliguri
                        fulfillment center.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop CTA Action Buttons */}
            <div className="hidden sm:flex items-center gap-3 pt-3">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 px-6 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] uppercase tracking-wider"
              >
                <span>
                  BUY NOW • ₹{selectedBundle.price.toLocaleString("en-IN")} •
                  COD
                </span>
                <ArrowRight className="w-4 h-4 text-[#b48849]" />
              </button>
            </div>

            {/* ========================================================
                D. TRUST & HIGHLIGHTS GRID
            ======================================================== */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#e7e1d6] text-center">
              <div className="p-3 bg-white/60 border border-[#e7e1d6] rounded-xl space-y-1">
                <RotateCcw className="w-4 h-4 text-[#b48849] mx-auto" />
                <p className="text-xs font-bold text-[#141412]">
                  7-Day Support
                </p>
                <p className="text-[10px] text-[#6b6963]">Free Replacements</p>
              </div>
              <div className="p-3 bg-white/60 border border-[#e7e1d6] rounded-xl space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#b48849] mx-auto" />
                <p className="text-xs font-bold text-[#141412]">
                  Cash on Delivery
                </p>
                <p className="text-[10px] text-[#6b6963]">Pay at Doorstep</p>
              </div>
              <div className="p-3 bg-white/60 border border-[#e7e1d6] rounded-xl space-y-1">
                <Truck className="w-4 h-4 text-[#b48849] mx-auto" />
                <p className="text-xs font-bold text-[#141412]">
                  Free Shipping
                </p>
                <p className="text-[10px] text-[#6b6963]">Pan-India Coverage</p>
              </div>
              <div className="p-3 bg-white/60 border border-[#e7e1d6] rounded-xl space-y-1">
                <Star className="w-4 h-4 text-[#b48849] mx-auto fill-[#b48849]" />
                <p className="text-xs font-bold text-[#141412]">Top Rated</p>
                <p className="text-[10px] text-[#6b6963]">
                  4.9★ Festive Rating
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            C. ELABORATIVE PRODUCT DESCRIPTION (EXPANDABLE)
        ======================================================== */}
        <section className="bg-white/80 border border-[#e7e1d6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-[#e7e1d6] pb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#141412]">
              Product Details & Specifications
            </h2>
            <span className="text-xs font-semibold text-[#b48849] uppercase tracking-wider">
              ShiftStore Curated
            </span>
          </div>

          {/* Description Preview (3 lines truncated or expanded) */}
          <div className="space-y-4">
            <div
              className={`text-sm text-[#6b6963] leading-relaxed transition-all duration-300 ${
                isDescriptionExpanded ? "" : "line-clamp-3"
              }`}
            >
              <p className="font-semibold text-[#141412] mb-2">
                {product.hook}
              </p>
              <p className="mb-3">{product.description}</p>
              {product.whyItWorks && (
                <p className="mb-3">{product.whyItWorks}</p>
              )}
            </div>

            {/* Read More / Read Less Toggle */}
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b48849] hover:text-[#141412] uppercase tracking-wider transition-colors"
            >
              <span>{isDescriptionExpanded ? "Read Less" : "Read More"}</span>
              {isDescriptionExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Expanded Sections (Features, Specs, Care) */}
          {isDescriptionExpanded && (
            <div className="space-y-6 pt-4 border-t border-[#e7e1d6] animate-in fade-in">
              {/* Why You'll Love It */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#141412]">
                  Why You'll Love It
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
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

              {/* Technical Specifications Table */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif font-bold text-lg text-[#141412]">
                  Specifications
                </h3>
                <div className="border border-[#e7e1d6] rounded-xl overflow-hidden divide-y divide-[#e7e1d6] text-xs">
                  <div className="grid grid-cols-3 p-3 bg-[#fbf9f4]">
                    <span className="font-semibold text-[#141412]">
                      Material
                    </span>
                    <span className="col-span-2 text-[#6b6963]">
                      Artisanal Earthen Stoneware & Minerals
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-[#141412]">Finish</span>
                    <span className="col-span-2 text-[#6b6963]">
                      Tactile Sand-Matte with Gold Highlights
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-[#fbf9f4]">
                    <span className="font-semibold text-[#141412]">
                      Origin & Dispatch
                    </span>
                    <span className="col-span-2 text-[#6b6963]">
                      Siliguri Hub, West Bengal (Dispatches in 24 Hours)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-[#141412]">
                      Packaging
                    </span>
                    <span className="col-span-2 text-[#6b6963]">
                      5-Ply Molded Shock-Absorbent Honeycomb Foam
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-[#fbf9f4]">
                    <span className="font-semibold text-[#141412]">
                      Care Instructions
                    </span>
                    <span className="col-span-2 text-[#6b6963]">
                      Wipe gently with a soft micro-fiber dry cloth
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================
            E. RELATED PRODUCTS ("Similar Items You Might Like")
        ======================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#b48849] uppercase tracking-wider">
                Curated Recommendations
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#141412]">
                Similar Items You Might Like
              </h2>
            </div>
            <a
              href="/"
              className="text-xs font-semibold text-[#b48849] hover:underline"
            >
              View All →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white/70 border border-[#e7e1d6] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="p-3">
                  <ProductVisual type={item.imageSvgType} badge={item.badge} />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#141412] group-hover:text-[#b48849] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6b6963] line-clamp-2 mt-1">
                      {item.hook || item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold font-serif tabular-nums text-[#141412]">
                      ₹{item.salePrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#6b6963] line-through tabular-nums">
                      ₹{item.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {onNavigateProduct ? (
                    <button
                      onClick={() => onNavigateProduct(item.slug)}
                      className="w-full py-2.5 px-3 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#b48849]" />
                    </button>
                  ) : (
                    <a
                      href={`/product/${item.slug}`}
                      className="w-full py-2.5 px-3 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#b48849]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ========================================================
          STICKY MOBILE ACTION BAR (Fixed Bottom)
      ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#f6f3ec]/95 backdrop-blur-md border-t border-[#e7e1d6] p-3 shadow-lg flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#6b6963] uppercase">
            Festive Deal
          </span>
          <span className="text-lg font-bold font-serif tabular-nums text-[#141412]">
            ₹{selectedBundle.price.toLocaleString("en-IN")}
          </span>
        </div>

        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 px-4 bg-[#141412] active:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-bold text-xs flex items-center justify-center gap-2 uppercase tracking-wider shadow-md"
        >
          <span>BUY NOW • COD AVAILABLE</span>
          <ArrowRight className="w-4 h-4 text-[#b48849]" />
        </button>
      </div>

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
};
