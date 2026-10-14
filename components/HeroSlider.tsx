"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";

export interface HeroSlideItem {
  id: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  buttonText: string;
  category?: string;
  productSlug?: string;
  productTitle?: string;
  productPrice?: number;
  productOriginalPrice?: number;
  imageUrl: string;
  imageAlt: string;
  badgeText?: string;
  bgColor?: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: "slide-artisan-decor",
    eyebrow: "✦ Artisan Home Decor • Limited Festive Stock",
    headline: "Make Your Space Feel Different.",
    subheadline:
      "We source premium, aesthetically striking home décor pieces for people who want everyday spaces to feel quietly extraordinary. Dispatched within 24 hours from our Siliguri fulfillment center.",
    buttonText: "Shop the Festive Collection",
    category: "Festive",
    productSlug: "zen-buddha-decor",
    productTitle: "Zen Buddha Head Ceramic",
    productPrice: 1499,
    productOriginalPrice: 2249,
    imageUrl:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Zen Buddha Head Ceramic Sculpture in Sand Matte",
    badgeText: "Hero Festive Drop",
    bgColor: "#f7f2eb",
  },
  {
    id: "slide-wall-art",
    eyebrow: "✦ Premium Wall Art • Architectural Textures",
    headline: "Elevate Every Blank Wall with Intention.",
    subheadline:
      "Hand-finished textured plaster canvases and earthy ochre arches designed to bring warmth, depth, and sculptural calm to your modern living room or entryway.",
    buttonText: "Explore Premium Wall Art",
    category: "Wall Art",
    productSlug: "textured-arch-wall-canvas",
    productTitle: "Textured Arch Plaster Canvas",
    productPrice: 1899,
    productOriginalPrice: 2799,
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Minimalist ochre textured plaster wall canvas",
    badgeText: "Curator's Choice",
    bgColor: "#f5eee4",
  },
  {
    id: "slide-festive-lighting",
    eyebrow: "✦ Festive Lighting • Ambient Evening Radiance",
    headline: "Warm Amber Glow for Quiet Evenings.",
    subheadline:
      "Brushed brass accents paired with smoked amber glass and botanical reed diffusers, casting soothing golden warmth that transforms any corner into a cozy sanctuary.",
    buttonText: "Discover Festive Lighting",
    category: "Lighting",
    productSlug: "brass-amber-glow-lamp",
    productTitle: "Smoked Amber Glow Table Lamp",
    productPrice: 2499,
    productOriginalPrice: 3499,
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Brushed brass and warm smoked amber glass lamp",
    badgeText: "Signature Illumination",
    bgColor: "#f3ede3",
  },
];

interface HeroSliderProps {
  slides?: HeroSlideItem[];
  onNavigateShop?: (category?: string) => void;
  onNavigateProduct?: (slug: string) => void;
  className?: string;
}

export default function HeroSlider({
  slides = DEFAULT_HERO_SLIDES,
  onNavigateShop,
  onNavigateProduct,
  className = "",
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const totalSlides = slides.length;

  // Auto-play timer: transitions every 5 seconds (5000ms), pauses when hovered
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  const handleButtonClick = (slide: HeroSlideItem) => {
    if (onNavigateShop) {
      onNavigateShop(slide.category);
    } else if (typeof window !== "undefined") {
      window.location.href = slide.category
        ? `/shop?cat=${slide.category}`
        : "/shop";
    }
  };

  const handleProductBadgeClick = (slug?: string) => {
    if (!slug) return;
    if (onNavigateProduct) {
      onNavigateProduct(slug);
    } else if (typeof window !== "undefined") {
      window.location.href = `/product/${slug}`;
    }
  };

  return (
    <section
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 ${className}`}
    >
      {/* Outer Card Wrapper - spans full width with warm border and rounded aesthetic */}
      <div
        className="relative w-full rounded-2xl md:rounded-3xl border border-[#e8e1d7] overflow-hidden shadow-xs group bg-[#fcfcf7]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
        aria-label="Hero Highlights"
      >
        {/* Slide Track with Smooth Horizontal Transform Transition */}
        <div
          className="flex w-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id}
                className="w-full min-w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 p-6 sm:p-10 md:p-12 lg:p-16"
                style={{ backgroundColor: slide.bgColor || "#f8f3ec" }}
                aria-hidden={!isActive}
              >
                {/* Left Side: Typography, CTAs & Micro-trust markers */}
                <div className="flex flex-col justify-center items-start text-left space-y-5 md:space-y-6 w-full">
                  {/* Eyebrow Label */}
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
                    <Sparkles className="w-3.5 h-3.5 text-[#a87c4f]" />
                    <span>{slide.eyebrow}</span>
                  </span>

                  {/* Primary Headline */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3d281a] leading-[1.12] tracking-tight">
                    {slide.headline}
                  </h1>

                  {/* Descriptive Subheadline */}
                  <p className="text-sm sm:text-base text-[#73685e] leading-relaxed max-w-xl">
                    {slide.subheadline}
                  </p>

                  {/* Call to Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleButtonClick(slide)}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#3d281a] hover:bg-[#a87c4f] text-[#fcfcf7] font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all duration-200 shadow-md hover:shadow-lg group/btn cursor-pointer"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleButtonClick(slide)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#e8e1d7] hover:border-[#a87c4f] hover:text-[#a87c4f] text-[#3d281a] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      <span>View All Decor</span>
                    </button>
                  </div>

                  {/* Micro-Trust Highlights */}
                  <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-[#73685e] border-t border-[#e8e1d7]/60 w-full">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#a87c4f]" />
                      Cash on Delivery Available
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Truck className="w-4 h-4 text-[#a87c4f]" />
                      Fast 24h Dispatch
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-[#a87c4f]" />
                      7-Day Easy Replacements
                    </span>
                  </div>
                </div>

                {/* Right Side: Prominent, Large Image Container with Aspect Ratio and Shadows */}
                <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-square lg:aspect-[4/3] min-h-[350px] sm:min-h-[400px] md:min-h-[480px] lg:min-h-[520px] rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-[#e8e1d7]/80 bg-[#ebe3d5]">
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                  {/* Subtle Warm Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3d281a]/30 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Product Badge */}
                  {slide.productTitle && (
                    <div
                      onClick={() => handleProductBadgeClick(slide.productSlug)}
                      className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#e8e1d7] shadow-lg max-w-[240px] hover:scale-[1.02] transition-transform cursor-pointer group/badge z-10"
                    >
                      {slide.badgeText && (
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#a87c4f] block">
                          {slide.badgeText}
                        </span>
                      )}
                      <p className="text-xs sm:text-sm font-serif font-bold text-[#3d281a] mt-0.5 group-hover/badge:text-[#a87c4f] transition-colors line-clamp-1">
                        {slide.productTitle}
                      </p>
                      {slide.productPrice && (
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-sm sm:text-base font-bold text-[#a87c4f]">
                            ₹{slide.productPrice.toLocaleString("en-IN")}
                          </span>
                          {slide.productOriginalPrice && (
                            <span className="text-xs text-[#9c948b] line-through">
                              ₹
                              {slide.productOriginalPrice.toLocaleString(
                                "en-IN",
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Left Navigation Arrow Button - positioned relative to the full slider width */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-4 md:left-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-[#3d281a] text-[#3d281a] hover:text-[#fcfcf7] border-2 border-[#3d281a] shadow-lg flex items-center justify-center transition-all duration-300 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#a87c4f] z-20 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Navigation Arrow Button - positioned relative to the full slider width */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 md:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-[#3d281a] text-[#3d281a] hover:text-[#fcfcf7] border-2 border-[#3d281a] shadow-lg flex items-center justify-center transition-all duration-300 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#a87c4f] z-20 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Pagination Dots at Bottom Center - positioned relative to full slider width */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#e8e1d7] shadow-sm">
          {slides.map((_, i) => {
            const isActive = currentIndex === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                  isActive
                    ? "w-8 bg-[#a87c4f] shadow-xs"
                    : "w-2.5 bg-[#d6cdc2] hover:bg-[#a87c4f]/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
