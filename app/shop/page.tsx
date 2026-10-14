
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import { ProductCard } from "../../components/ProductCard";

export interface MockProduct {
  id: string;
  title: string;
  slug: string;
  category:
    | "Vases"
    | "Wall Art"
    | "Tabletop"
    | "Sculptures"
    | "Festive"
    | "Lighting";
  price: number;
  originalPrice: number;
  image: string;
  badge?: string;
  inStock: boolean;
  salesCount: number;
}

export const SHOP_PRODUCTS: MockProduct[] = [
  {
    id: "p1",
    title: "Zen Buddha Head Ceramic Sculpture in Sand Matte",
    slug: "zen-buddha-decor",
    category: "Sculptures",
    price: 1499,
    originalPrice: 2249,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    inStock: true,
    salesCount: 420,
  },
  {
    id: "p2",
    title: "Artisan Ribbed Ceramic Urn Vase in Warm Off-White",
    slug: "minimal-ceramic-vase",
    category: "Vases",
    price: 999,
    originalPrice: 1499,
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    badge: "Handpicked",
    inStock: true,
    salesCount: 295,
  },
  {
    id: "p3",
    title: "Amber Glass Aromatherapy Diffuser with Rattan Reeds",
    slug: "luxury-aroma-set",
    category: "Tabletop",
    price: 799,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    badge: "Festive Pick",
    inStock: true,
    salesCount: 180,
  },
  {
    id: "p4",
    title: "Architectural Fluted Matte Stoneware Planter",
    slug: "modern-planter",
    category: "Tabletop",
    price: 899,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    salesCount: 150,
  },
  {
    id: "p5",
    title: "Textured Arch Plaster Wall Canvas in Ochre & Clay",
    slug: "textured-arch-wall-canvas",
    category: "Wall Art",
    price: 1899,
    originalPrice: 2799,
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    badge: "New Arrival",
    inStock: true,
    salesCount: 95,
  },
  {
    id: "p6",
    title: "Brushed Brass & Smoked Amber Glow Table Lamp",
    slug: "brass-amber-glow-lamp",
    category: "Lighting",
    price: 2499,
    originalPrice: 3499,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    badge: "Limited Stock",
    inStock: false,
    salesCount: 310,
  },
  {
    id: "p7",
    title: "Minimalist Terrazzo Oval Catchall Vanity Tray",
    slug: "terrazzo-catchall-tray",
    category: "Tabletop",
    price: 649,
    originalPrice: 999,
    image:
      "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    salesCount: 220,
  },
  {
    id: "p8",
    title: "Ceramic Dough Donut Sculptural Vase in Beige Stone",
    slug: "donut-sculptural-vase",
    category: "Vases",
    price: 1199,
    originalPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    inStock: true,
    salesCount: 380,
  },
  {
    id: "p9",
    title: "Handcrafted Festive Brass Diya Set with Pedestal",
    slug: "festive-brass-diya-set",
    category: "Festive",
    price: 1399,
    originalPrice: 1999,
    image:
      "https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=800&q=80",
    badge: "Festive",
    inStock: true,
    salesCount: 510,
  },
];

export default function ShopPage() {
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [appliedPriceRange, setAppliedPriceRange] = useState<{
    min: number;
    max: number;
  }>({
    min: 0,
    max: 10000,
  });

  // Sort State
  const [sortBy, setSortBy] = useState<
    "featured" | "best-selling" | "price-asc" | "price-desc"
  >("featured");
  const [categoryAccordionOpen, setCategoryAccordionOpen] = useState(true);
  const [availabilityAccordionOpen, setAvailabilityAccordionOpen] =
    useState(true);
  const [priceAccordionOpen, setPriceAccordionOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Cart State for simulation
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categoriesList = [
    "Vases",
    "Wall Art",
    "Tabletop",
    "Sculptures",
    "Festive",
    "Lighting",
  ];

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const min = minPriceInput ? Math.max(0, parseInt(minPriceInput, 10)) : 0;
    const max = maxPriceInput ? parseInt(maxPriceInput, 10) : 10000;
    setAppliedPriceRange({ min, max });
    setMobileFilterOpen(false);
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setMinPriceInput("");
    setMaxPriceInput("");
    setAppliedPriceRange({ min: 0, max: 10000 });
  };

  const handleAddToCart = (item: { title: string }) => {
    setCartCount((c) => c + 1);
    setToastMessage(`Added "${item.title}" to cart`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter((prod) => {
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(prod.category)
      ) {
        return false;
      }
      // Availability filter
      if (inStockOnly && !outOfStockOnly && !prod.inStock) {
        return false;
      }
      if (outOfStockOnly && !inStockOnly && prod.inStock) {
        return false;
      }
      // Price range filter
      if (
        prod.price < appliedPriceRange.min ||
        prod.price > appliedPriceRange.max
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "best-selling") {
        return b.salesCount - a.salesCount;
      }
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      return 0; // featured default
    });
  }, [
    selectedCategories,
    inStockOnly,
    outOfStockOnly,
    appliedPriceRange,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#fcfcf7] text-[#3d281a] flex flex-col font-sans selection:bg-[#a87c4f] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#3d281a] text-[#fcfcf7] px-4 py-3 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-[#a87c4f] animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#a87c4f]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* A. Top Announcement Bar */}
      <div className="bg-[#3d281a] text-[#fcfcf7] text-center text-xs py-2 px-4 tracking-wider uppercase font-medium flex items-center justify-center gap-2 border-b border-[#3d281a]/10">
        <span>
          ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE SHIPPING ACROSS INDIA • COD
          AVAILABLE
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#fcfcf7]/95 backdrop-blur-md border-b border-[#e8e1d7] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#3d281a] group-hover:text-[#a87c4f] transition-colors">
              ShiftStore
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase">
            <Link
              href="/"
              className="text-[#3d281a] hover:text-[#a87c4f] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-[#a87c4f] border-b-2 border-[#a87c4f] pb-1"
            >
              Shop All
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
            <button
              className="p-2 hover:text-[#a87c4f] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:text-[#a87c4f] transition-colors"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (typeof window !== "undefined")
                  window.location.href = "/#checkout";
              }}
              className="p-2 hover:text-[#a87c4f] transition-colors relative"
              aria-label="Cart"
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* A. Breadcrumb & Title */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-[#9c948b] mb-2 font-medium">
            <Link href="/" className="hover:text-[#3d281a] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#9c948b]" />
            <Link
              href="/shop"
              className="hover:text-[#3d281a] transition-colors"
            >
              Shop
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#9c948b]" />
            <span className="text-[#3d281a] font-semibold">All Products</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e1d7] pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3d281a]">
                Curated Home & Living
              </h1>
              <p className="text-xs sm:text-sm text-[#73685e] mt-1 max-w-xl">
                Thoughtfully crafted vases, tabletop accents, artisanal wall
                art, and festive drops designed to elevate everyday rituals.
              </p>
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="flex items-center gap-3 sm:hidden">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex-1 py-2.5 px-4 bg-white border border-[#e8e1d7] rounded-lg text-xs font-semibold text-[#3d281a] flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#a87c4f]" />
                <span>
                  Filters{" "}
                  {selectedCategories.length > 0
                    ? `(${selectedCategories.length})`
                    : ""}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* B. Left Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e1d7]">
              <span className="text-sm font-bold uppercase tracking-wider text-[#3d281a] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#a87c4f]" />
                Filters
              </span>
              {(selectedCategories.length > 0 ||
                inStockOnly ||
                outOfStockOnly ||
                minPriceInput ||
                maxPriceInput) && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-[#a87c4f] hover:underline font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* 1. Categories Accordion */}
            <div className="border-b border-[#e8e1d7] pb-5">
              <button
                onClick={() => setCategoryAccordionOpen(!categoryAccordionOpen)}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#3d281a] py-2 hover:text-[#a87c4f] transition-colors"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoryAccordionOpen ? "rotate-180 text-[#a87c4f]" : ""
                  }`}
                />
              </button>
              {categoryAccordionOpen && (
                <div className="mt-3 space-y-2.5 pl-1">
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    const count = SHOP_PRODUCTS.filter(
                      (p) => p.category === cat,
                    ).length;
                    return (
                      <label
                        key={cat}
                        className="flex items-center justify-between text-xs text-[#52453c] hover:text-[#3d281a] cursor-pointer group select-none"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCategory(cat)}
                            className="w-4 h-4 rounded-xs border-[#e8e1d7] text-[#3d281a] focus:ring-[#a87c4f] accent-[#3d281a]"
                          />
                          <span
                            className={
                              isSelected ? "font-semibold text-[#3d281a]" : ""
                            }
                          >
                            {cat}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#9c948b] group-hover:text-[#a87c4f]">
                          ({count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Availability Checkboxes */}
            <div className="border-b border-[#e8e1d7] pb-5">
              <button
                onClick={() =>
                  setAvailabilityAccordionOpen(!availabilityAccordionOpen)
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#3d281a] py-2 hover:text-[#a87c4f] transition-colors"
              >
                <span>Availability</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    availabilityAccordionOpen ? "rotate-180 text-[#a87c4f]" : ""
                  }`}
                />
              </button>
              {availabilityAccordionOpen && (
                <div className="mt-3 space-y-2.5 pl-1">
                  <label className="flex items-center gap-2.5 text-xs text-[#52453c] hover:text-[#3d281a] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded-xs border-[#e8e1d7] text-[#3d281a] focus:ring-[#a87c4f] accent-[#3d281a]"
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#52453c] hover:text-[#3d281a] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={outOfStockOnly}
                      onChange={(e) => setOutOfStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded-xs border-[#e8e1d7] text-[#3d281a] focus:ring-[#a87c4f] accent-[#3d281a]"
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              )}
            </div>

            {/* 3. Price Filter */}
            <div className="border-b border-[#e8e1d7] pb-5">
              <button
                onClick={() => setPriceAccordionOpen(!priceAccordionOpen)}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#3d281a] py-2 hover:text-[#a87c4f] transition-colors"
              >
                <span>Price (₹)</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    priceAccordionOpen ? "rotate-180 text-[#a87c4f]" : ""
                  }`}
                />
              </button>
              {priceAccordionOpen && (
                <form
                  onSubmit={handleApplyPriceFilter}
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-[#9c948b] block mb-1">
                        Min (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#e8e1d7] rounded-md text-xs text-[#3d281a] focus:outline-none focus:border-[#a87c4f]"
                      />
                    </div>
                    <span className="text-[#9c948b] mt-5">–</span>
                    <div className="flex-1">
                      <label className="text-[10px] text-[#9c948b] block mb-1">
                        Max (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="5000"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#e8e1d7] rounded-md text-xs text-[#3d281a] focus:outline-none focus:border-[#a87c4f]"
                      />
                    </div>
                  </div>
                  {/* Brown Filter Button */}
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#3d281a] hover:bg-[#a87c4f] text-[#fcfcf7] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-xs"
                  >
                    Apply Filter
                  </button>
                </form>
              )}
            </div>
          </aside>

          {/* C. Right Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Bar with Sort Dropdown & Product Count */}
            <div className="bg-white p-3.5 rounded-lg border border-[#e8e1d7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="text-xs text-[#73685e]">
                Showing{" "}
                <strong className="text-[#3d281a]">
                  {filteredProducts.length}
                </strong>{" "}
                items
                {selectedCategories.length > 0 &&
                  ` in ${selectedCategories.join(", ")}`}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <label
                  htmlFor="sort-select"
                  className="text-xs font-semibold uppercase tracking-wider text-[#3d281a]"
                >
                  Sort By:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-[#fcfcf7] border border-[#e8e1d7] rounded-md text-xs text-[#3d281a] font-medium focus:outline-none focus:border-[#a87c4f] cursor-pointer"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* 3-Column Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
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
            ) : (
              <div className="bg-white rounded-xl border border-[#e8e1d7] p-12 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-[#a87c4f] mx-auto opacity-60" />
                <h3 className="text-lg font-serif font-bold text-[#3d281a]">
                  No items match your filter criteria
                </h3>
                <p className="text-xs text-[#73685e] max-w-sm mx-auto">
                  Try clearing your category or price limits to view more pieces
                  from our full decor collection.
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="px-5 py-2.5 bg-[#3d281a] hover:bg-[#a87c4f] text-[#fcfcf7] rounded-md text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs lg:hidden">
          <div className="w-4/5 max-w-sm bg-[#fcfcf7] h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8e1d7]">
                <span className="text-base font-serif font-bold text-[#3d281a]">
                  Filters
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#3d281a]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3d281a] block mb-2">
                  Categories
                </span>
                <div className="space-y-2">
                  {categoriesList.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 text-xs text-[#52453c]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleToggleCategory(cat)}
                        className="w-4 h-4 rounded-xs border-[#e8e1d7] text-[#3d281a] accent-[#3d281a]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3d281a] block mb-2">
                  Price Range (₹)
                </span>
                <form onSubmit={handleApplyPriceFilter} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-[#e8e1d7] rounded-md text-xs text-[#3d281a]"
                    />
                    <span>–</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-[#e8e1d7] rounded-md text-xs text-[#3d281a]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#3d281a] text-[#fcfcf7] text-xs font-semibold uppercase tracking-wider rounded-md"
                  >
                    Apply
                  </button>
                </form>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full py-3 bg-[#a87c4f] text-white text-xs font-bold uppercase tracking-wider rounded-md text-center"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}

      {/* F. Dark Brown Footer (#2c1c11) */}
      <footer className="mt-20 bg-[#2c1c11] text-[#fcfcf7] pt-14 pb-8 border-t border-[#3d281a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#3d281a]/40">
            {/* Col 1: About Us */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#fcfcf7]">
                ShiftStore
              </h4>
              <p className="text-xs text-[#c4b9b0] leading-relaxed">
                Handpicked aesthetic home decor, handcrafted ceramics, and
                festive centerpieces curated to bring warmth and quiet luxury to
                your living space.
              </p>
              <p className="text-[11px] text-[#a87c4f]">
                Dispatched from Siliguri hub within 24 hours.
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
                    Shop All Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?cat=Festive"
                    className="hover:text-white transition-colors"
                  >
                    Festive Puja Drops
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
                Be the first to receive notifications on limited festive drops
                and seasonal curation releases.
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
                  aria-label="Subscribe"
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
            <p>100% Secure Checkout · COD Available · Express Delivery</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
