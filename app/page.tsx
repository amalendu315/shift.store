"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Heart,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import HeroSlider from "../components/HeroSlider";

// Mock Data for the 3 Grids
const FESTIVE_COLLECTION = [
  {
    id: "fc-1",
    title: "Handcrafted Festive Brass Diya Set with Pedestal",
    slug: "festive-brass-diya-set",
    category: "Festive",
    price: 1399,
    originalPrice: 1999,
    image:
      "https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=800&q=80",
    badge: "Puja Special",
    inStock: true,
  },
  {
    id: "fc-2",
    title: "Zen Buddha Head Ceramic Sculpture in Sand Matte",
    slug: "zen-buddha-decor",
    category: "Festive",
    price: 1499,
    originalPrice: 2249,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    inStock: true,
  },
  {
    id: "fc-3",
    title: "Lotus Brass Incense Burner & Essential Oil Urli",
    slug: "lotus-brass-incense-burner",
    category: "Festive",
    price: 1199,
    originalPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    badge: "Handcrafted",
    inStock: true,
  },
  {
    id: "fc-4",
    title: "Gilded Floral Marigold Ceramic Accent Plate",
    slug: "gilded-floral-plate",
    category: "Festive",
    price: 899,
    originalPrice: 1399,
    image:
      "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80",
    badge: "Limited Stock",
    inStock: true,
  },
];

const HANDPICKED_COLLECTION = [
  {
    id: "hp-1",
    title: "Artisan Ribbed Ceramic Urn Vase in Warm Off-White",
    slug: "minimal-ceramic-vase",
    category: "Vases",
    price: 999,
    originalPrice: 1499,
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    inStock: true,
  },
  {
    id: "hp-2",
    title: "Ceramic Dough Donut Sculptural Vase in Beige Stone",
    slug: "donut-sculptural-vase",
    category: "Vases",
    price: 1199,
    originalPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80",
    badge: "Curator's Choice",
    inStock: true,
  },
  {
    id: "hp-3",
    title: "Amber Glass Aromatherapy Diffuser with Rattan Reeds",
    slug: "luxury-aroma-set",
    category: "Tabletop",
    price: 799,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    inStock: true,
  },
  {
    id: "hp-4",
    title: "Architectural Fluted Matte Stoneware Planter",
    slug: "modern-planter",
    category: "Tabletop",
    price: 899,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    inStock: true,
  },
];

const PREMIUM_DECOR = [
  {
    id: "pd-1",
    title: "Textured Arch Plaster Wall Canvas in Ochre & Clay",
    slug: "textured-arch-wall-canvas",
    category: "Wall Art",
    price: 1899,
    originalPrice: 2799,
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    badge: "Exclusive",
    inStock: true,
  },
  {
    id: "pd-2",
    title: "Brushed Brass & Smoked Amber Glow Table Lamp",
    slug: "brass-amber-glow-lamp",
    category: "Lighting",
    price: 2499,
    originalPrice: 3499,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    badge: "Signature",
    inStock: true,
  },
  {
    id: "pd-3",
    title: "Minimalist Terrazzo Oval Catchall Vanity Tray",
    slug: "terrazzo-catchall-tray",
    category: "Tabletop",
    price: 649,
    originalPrice: 999,
    image:
      "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80",
    inStock: true,
  },
  {
    id: "pd-4",
    title: "Organic Wavy Travertine Pedestal Centerpiece",
    slug: "travertine-pedestal-centerpiece",
    category: "Sculptures",
    price: 2199,
    originalPrice: 3199,
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    badge: "Hand Carved",
    inStock: true,
  },
];

// Circular Categories Data
const CIRCULAR_CATEGORIES = [
  {
    name: "Wall Art",
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80",
    href: "/shop?cat=Wall%20Art",
  },
  {
    name: "Vases",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80",
    href: "/shop?cat=Vases",
  },
  {
    name: "Festive",
    image:
      "https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=300&q=80",
    href: "/shop?cat=Festive",
  },
  {
    name: "Lighting",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80",
    href: "/shop?cat=Lighting",
  },
  {
    name: "Tabletop",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80",
    href: "/shop?cat=Tabletop",
  },
];

// 6 Shop by Theme Circular Items
const THEMES = [
  {
    name: "Minimalist",
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Traditional",
    image:
      "https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Modern",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bohemian",
    image:
      "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Earth & Clay",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sculptural",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
  },
];

// Hero Carousel Slides Data
interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryBtnText: string;
  primaryCategory?: string;
  secondaryBtnText: string;
  image: string;
  imageAlt: string;
  badgeLabel: string;
  productTitle: string;
  productPrice: number;
  productOriginalPrice: number;
  productSlug: string;
  bgColor: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    eyebrow: "✦ Durga Puja Special · Limited Edition Drops",
    title: "Artisan Home Decor",
    subtitle:
      "We source premium, aesthetically striking home décor pieces for spaces that deserve quiet warmth. Dispatched within 24 hours from our Siliguri fulfillment center.",
    primaryBtnText: "Shop Festive Drops",
    primaryCategory: "Festive",
    secondaryBtnText: "Explore All Decor",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Zen Buddha Head Ceramic Sculpture in Sand Matte",
    badgeLabel: "Hero Festive Drop",
    productTitle: "Zen Buddha Head Ceramic",
    productPrice: 1499,
    productOriginalPrice: 2249,
    productSlug: "zen-buddha-decor",
    bgColor: "#f5efe6",
  },
  {
    id: "slide-2",
    eyebrow: "✦ Hand-Thrown Stoneware · Sculptural Silhouettes",
    title: "Sculpted for Everyday Stillness",
    subtitle:
      "Warm off-white ribbed urns and donut ceramic vases designed to elevate sideboards, coffee tables, and mantelpieces with earthy organic textures.",
    primaryBtnText: "Discover Artisan Vases",
    primaryCategory: "Vases",
    secondaryBtnText: "View Tabletop Pieces",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Artisan Ribbed Ceramic Urn Vase in Warm Off-White",
    badgeLabel: "Trending Curation",
    productTitle: "Ribbed Ceramic Urn Vase",
    productPrice: 999,
    productOriginalPrice: 1499,
    productSlug: "minimal-ceramic-vase",
    bgColor: "#f6f1e8",
  },
  {
    id: "slide-3",
    eyebrow: "✦ Ambient Lighting & Aromatherapy · Quiet Luxury",
    title: "Light That Warms Your Sanctuary",
    subtitle:
      "Smoked amber glass table lamps and botanical reed diffuser sets crafted to infuse your living room with golden evening radiance and natural scents.",
    primaryBtnText: "Explore Ambient Lighting",
    primaryCategory: "Lighting",
    secondaryBtnText: "View Fragrance Sets",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Brushed Brass & Smoked Amber Glow Table Lamp",
    badgeLabel: "Signature Glow",
    productTitle: "Smoked Amber Glow Lamp",
    productPrice: 2499,
    productOriginalPrice: 3499,
    productSlug: "brass-amber-glow-lamp",
    bgColor: "#f3ede2",
  },
];

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hero Carousel State
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Autoplay Slider Timer (5.5s)
  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  const handlePrevSlide = () => {
    setCurrentHeroSlide((prev) =>
      prev === 0 ? HERO_SLIDES.length - 1 : prev - 1,
    );
  };

  const handleNextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) handleNextSlide();
    else if (diff < -50) handlePrevSlide();
    setTouchStartX(null);
  };

  const handleAddToCart = (product: { title: string }) => {
    setCartCount((c) => c + 1);
    setToastMessage(`Added "${product.title}" to cart`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fcfcf7] text-[#3d281a] flex flex-col font-sans selection:bg-[#a87c4f] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#3d281a] text-[#fcfcf7] px-4 py-3 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-[#a87c4f] animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#a87c4f]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          A. HEADER & ANNOUNCEMENT
      ======================================================== */}
      {/* Top thin announcement bar with dark brown background and white text */}
      <div className="bg-[#3d281a] text-[#fcfcf7] text-center text-xs py-2 px-4 tracking-wider uppercase font-medium flex items-center justify-center gap-2 border-b border-[#3d281a]/10">
        <span>
          ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
          ACROSS INDIA
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#fcfcf7]/95 backdrop-blur-md border-b border-[#e8e1d7] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#3d281a] group-hover:text-[#a87c4f] transition-colors">
              ShiftStore
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase">
            <Link
              href="/"
              className="text-[#a87c4f] border-b-2 border-[#a87c4f] pb-1"
            >
              Home
            </Link>
            <Link
              href="/shop?cat=Decor"
              className="text-[#3d281a] hover:text-[#a87c4f] transition-colors"
            >
              Decor
            </Link>
            <Link
              href="/shop?cat=Festive"
              className="text-[#3d281a] hover:text-[#a87c4f] transition-colors"
            >
              Festive
            </Link>
            <Link
              href="/shop"
              className="text-[#3d281a] hover:text-[#a87c4f] transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/about"
              className="text-[#3d281a] hover:text-[#a87c4f] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[#3d281a] hover:text-[#a87c4f] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right-side Icons */}
          <div className="flex items-center gap-4 text-[#3d281a]">
            <Link
              href="/shop"
              className="p-2 hover:text-[#a87c4f] transition-colors"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              className="p-2 hover:text-[#a87c4f] transition-colors"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (typeof window !== "undefined")
                  window.location.href = "/#checkout";
              }}
              className="p-2 hover:text-[#a87c4f] transition-colors relative"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#a87c4f] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          B. HERO BANNER CAROUSEL / SLIDER
      ======================================================== */}
      <HeroSlider className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10" />

      {/* ========================================================
          C. CIRCULAR CATEGORIES
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
            Browse By Space
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3d281a] mt-1">
            Explore Categories
          </h2>
        </div>

        {/* Horizontal flex row of circular image thumbnails */}
        <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto pb-4 pt-2 no-scrollbar px-2">
          {CIRCULAR_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="flex flex-col items-center gap-3 shrink-0 group focus:outline-none"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 border-2 border-[#e8e1d7] group-hover:border-[#a87c4f] transition-all duration-300 shadow-2xs group-hover:shadow-md bg-white">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#f5f1eb]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-[#3d281a] group-hover:text-[#a87c4f] transition-colors text-center tracking-wide">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          D. PRODUCT GRIDS / CAROUSELS (3 Distinct Sections)
      ======================================================== */}
      {/* SECTION 1: Festive Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e8e1d7]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
              Durga Puja Specials
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3d281a] mt-1">
              Festive Collection
            </h2>
          </div>
          <Link
            href="/shop?cat=Festive"
            className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] hover:text-[#3d281a] flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
          >
            <span>View All Festive</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FESTIVE_COLLECTION.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              title={prod.title}
              slug={prod.slug}
              category={prod.category}
              price={prod.price}
              originalPrice={prod.originalPrice}
              image={prod.image}
              badge={prod.badge}
              inStock={prod.inStock}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: Our Handpicked Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e8e1d7]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
              Curator’s Choice
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3d281a] mt-1">
              Our Handpicked Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] hover:text-[#3d281a] flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
          >
            <span>Explore Handpicked</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HANDPICKED_COLLECTION.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              title={prod.title}
              slug={prod.slug}
              category={prod.category}
              price={prod.price}
              originalPrice={prod.originalPrice}
              image={prod.image}
              badge={prod.badge}
              inStock={prod.inStock}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3: Premium Decor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e8e1d7]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
              Architectural Statements
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3d281a] mt-1">
              Premium Decor
            </h2>
          </div>
          <Link
            href="/shop?cat=Decor"
            className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] hover:text-[#3d281a] flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
          >
            <span>View All Decor</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PREMIUM_DECOR.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              title={prod.title}
              slug={prod.slug}
              category={prod.category}
              price={prod.price}
              originalPrice={prod.originalPrice}
              image={prod.image}
              badge={prod.badge}
              inStock={prod.inStock}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          E. SHOP BY THEME (Grid of 6 Large Circular Buttons)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 w-full bg-[#f8f5ee] rounded-2xl border border-[#e8e1d7] my-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
            Curated Aesthetics
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#3d281a] mt-1">
            Shop By Theme
          </h2>
          <p className="text-xs text-[#73685e] mt-1">
            Find the pieces that match your home's personality and design
            language.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
          {THEMES.map((theme, idx) => (
            <Link
              key={idx}
              href={`/shop?theme=${encodeURIComponent(theme.name)}`}
              className="flex flex-col items-center gap-3 group focus:outline-none"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 border-2 border-[#e8e1d7] group-hover:border-[#a87c4f] transition-all duration-300 shadow-xs group-hover:shadow-lg bg-white">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#ebe4d6]">
                  <img
                    src={theme.image}
                    alt={theme.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-[#3d281a] group-hover:text-[#a87c4f] transition-colors text-center tracking-wide">
                {theme.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          F. DARK FOOTER (#2c1c11)
      ======================================================== */}
      <footer className="mt-auto bg-[#2c1c11] text-[#fcfcf7] pt-16 pb-8 border-t border-[#3d281a] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#3d281a]/40">
            {/* Col 1: About Us */}
            <div className="space-y-3">
              <h4 className="font-serif text-xl font-bold text-[#fcfcf7]">
                ShiftStore
              </h4>
              <p className="text-xs text-[#c4b9b0] leading-relaxed">
                We design and curate warm, minimalist home decor objects that
                ground your room in quiet beauty. Every parcel is safely wrapped
                and dispatched directly from our Siliguri fulfillment center.
              </p>
              <p className="text-[11px] text-[#a87c4f] font-medium">
                ⚡ Dispatched within 24 Hours across India.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs text-[#c4b9b0]">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-white transition-colors"
                  >
                    Shop All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?cat=Festive"
                    className="hover:text-white transition-colors"
                  >
                    Festive Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Policies */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] mb-4">
                Customer Care & Policies
              </h4>
              <ul className="space-y-2.5 text-xs text-[#c4b9b0]">
                <li>
                  <Link
                    href="/policies"
                    className="hover:text-white transition-colors"
                  >
                    Shipping & Delivery Timeline
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies"
                    className="hover:text-white transition-colors"
                  >
                    7-Day Easy Replacements
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies"
                    className="hover:text-white transition-colors"
                  >
                    Cash on Delivery (COD) Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Newsletter / Connect */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] mb-4">
                Join the Inner Circle
              </h4>
              <p className="text-xs text-[#c4b9b0] leading-relaxed">
                Receive secret previews of limited single-piece hero drops and
                seasonal festive discount codes.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-3 py-2 bg-[#3d281a] border border-[#a87c4f]/30 rounded-md text-xs text-[#fcfcf7] placeholder:text-[#9c948b] flex-1 focus:outline-none focus:border-[#a87c4f]"
                />
                <button
                  type="button"
                  className="p-2 bg-[#a87c4f] hover:bg-[#b88c5f] text-white rounded-md text-xs font-bold transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Copyright Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#9c948b] gap-2">
            <p>
              © 2026 ShiftStore India. All rights reserved. Crafted with care.
            </p>
            <p>
              100% Encrypted Checkout · Cash on Delivery · Express Air Shipping
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
