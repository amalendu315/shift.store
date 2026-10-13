import React, { useState, useEffect } from "react";
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
  LayoutDashboard,
  Store,
  Lock,
  RotateCcw,
  Info,
  Check,
  HeartHandshake,
  Send,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  ArrowLeft,
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
  OrderRecord,
} from "./data/store.ts";
import { INITIAL_ORDERS } from "../prisma/seed.ts";
import { ProductVisual } from "./components/ProductVisual.tsx";
import { CheckoutModal, CheckoutItem } from "../components/CheckoutModal.tsx";
import { OrderSuccessModal } from "./components/OrderSuccessModal.tsx";
import { AdminDashboardView } from "./components/admin/AdminDashboardView.tsx";
import { ProductClientView } from "../components/ProductClientView.tsx";

export default function App() {
  type PageType = "home" | "pdp" | "about" | "contact" | "policies" | "admin";
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [pdpSlug, setPdpSlug] = useState<string>("zen-buddha-decor");

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminAuthError, setAdminAuthError] = useState("");

  // Storefront state
  const [products, setProducts] = useState<ProductItem[]>(
    INITIAL_PRODUCTS_DATA,
  );
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS as any);
  const [activeFaqId, setActiveFaqId] = useState<string | null>("faq-1");

  // Selected hero product
  const heroProduct = products.find((p) => p.isHeroDrop) || products[0];
  const [selectedBundle, setSelectedBundle] = useState<BundleItem>(
    heroProduct.bundles.find((b) => b.isPopular) || heroProduct.bundles[0],
  );

  // Policies Tab State
  const [activePolicyTab, setActivePolicyTab] = useState<
    "shipping" | "returns" | "privacy" | "terms"
  >("shipping");

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Tracking",
    message: "",
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);

  // Synchronize bundle selection if heroProduct changes
  useEffect(() => {
    const popular =
      heroProduct.bundles.find((b) => b.isPopular) || heroProduct.bundles[0];
    setSelectedBundle(popular);
  }, [heroProduct.id]);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // Trigger Checkout for Hero Bundle
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

  // Trigger Checkout for Catalog Item
  const handleBuyCatalogProduct = (prod: ProductItem) => {
    setCheckoutItems([
      {
        productId: prod.id,
        title: prod.title,
        quantity: 1,
        price: prod.salePrice,
      },
    ]);
    setIsCheckoutOpen(true);
  };

  // Open PDP for any product
  const handleOpenPdp = (slug: string) => {
    setPdpSlug(slug);
    setCurrentPage("pdp");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // On order placed successfully
  const handleOrderSuccess = (order: any) => {
    setConfirmedOrder(order);
    setOrders((prev) => [order, ...prev]);
  };

  // Update order status from Admin
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderRecord["orderStatus"],
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, orderStatus: newStatus } : o,
      ),
    );
  };

  // Update product from Admin
  const handleUpdateProduct = (updatedProduct: ProductItem) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (updatedProduct.isHeroDrop && p.id !== updatedProduct.id) {
          return { ...p, isHeroDrop: false };
        }
        return p.id === updatedProduct.id ? updatedProduct : p;
      }),
    );
  };

  // Admin login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      adminPasswordInput === "PujaSale2026!" ||
      adminPasswordInput === "admin"
    ) {
      setIsAdminAuthenticated(true);
      setAdminAuthError("");
    } else {
      setAdminAuthError(
        "Invalid admin credentials. Use seed password: PujaSale2026!",
      );
    }
  };

  // Contact form submit handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsContactSubmitting(false);
    setIsContactSubmitted(true);
  };

  const currentPdpProduct =
    products.find((p) => p.slug === pdpSlug) || products[0];
  const relatedPdpProducts = products.filter(
    (p) => p.id !== currentPdpProduct.id,
  );

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#141412] flex flex-col font-sans selection:bg-[#b48849] selection:text-white">
      {/* Hidden Administrative Access (Only reveals if URL contains #manage or ?manage=1) */}
      {typeof window !== "undefined" &&
        (window.location.hash === "#manage" ||
          window.location.search.includes("manage")) && (
          <aside
            aria-label="Portal switcher"
            className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1.5 bg-[#141412] text-[#f6f3ec] rounded-full shadow-2xl border border-[#b48849]/40 text-xs"
          >
            <button
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                currentPage === "home"
                  ? "bg-[#b48849] text-white font-semibold"
                  : "text-[#f6f3ec]/80 hover:text-white"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Public Store</span>
            </button>
            <button
              onClick={() => {
                setCurrentPage("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                currentPage === "admin"
                  ? "bg-[#b48849] text-white font-semibold"
                  : "text-[#f6f3ec]/80 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Manage ShiftStore</span>
            </button>
          </aside>
        )}

      {/* ========================================================
          1. ADMIN ROUTE
      ======================================================== */}
      {currentPage === "admin" &&
        (!isAdminAuthenticated ? (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-[#e7e1d6] rounded-2xl shadow-xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#f0ece1] text-[#b48849] rounded-full flex items-center justify-center mx-auto border border-[#e7e1d6]">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#141412]">
                  ShiftStore Admin Login
                </h2>
                <p className="text-xs text-[#6b6963]">
                  Durga Puja Festive Order Fulfillment & Catalog Console
                </p>
              </div>

              {adminAuthError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
                  {adminAuthError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value="admin@shiftstore.in"
                    className="w-full px-3 py-2 bg-[#f0ece1]/50 border border-[#e7e1d6] rounded-lg text-xs text-[#6b6963]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Enter seed password: PujaSale2026!"
                    className="w-full px-3 py-2 bg-white border border-[#e7e1d6] rounded-lg text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                  />
                  <p className="text-[11px] text-[#6b6963] mt-1">
                    Default seed password:{" "}
                    <code className="font-mono bg-[#f0ece1] px-1 py-0.5 rounded">
                      PujaSale2026!
                    </code>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-medium text-xs transition-colors"
                >
                  Enter Operations Console
                </button>
              </form>
            </div>
          </div>
        ) : (
          <AdminDashboardView
            products={products}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateProduct={handleUpdateProduct}
            onLogout={() => {
              setIsAdminAuthenticated(false);
              setCurrentPage("home");
            }}
          />
        ))}

      {/* ========================================================
          2. PRODUCT DETAILS PAGE (PDP) - FLIPKART STYLE
      ======================================================== */}
      {currentPage === "pdp" && (
        <ProductClientView
          product={currentPdpProduct}
          relatedProducts={relatedPdpProducts}
          onNavigateProduct={(slug) => handleOpenPdp(slug)}
          onNavigateHome={() => {
            setCurrentPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* ========================================================
          3. ABOUT US PAGE (The ShiftStore Story)
      ======================================================== */}
      {currentPage === "about" && (
        <div className="min-h-screen flex flex-col">
          <div className="bg-[#141412] text-[#f6f3ec] py-2 px-4 text-center text-xs tracking-wider font-medium">
            <span>
              ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
              ACROSS INDIA
            </span>
          </div>

          <header className="sticky top-0 z-30 bg-[#f6f3ec]/90 backdrop-blur-md border-b border-[#e7e1d6] px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage("home")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#6b6963] hover:text-[#141412] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Store</span>
                </button>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="font-serif text-2xl font-bold tracking-tight text-[#141412]"
                >
                  ShiftStore
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-[#6b6963]">
                <button
                  onClick={() => setCurrentPage("contact")}
                  className="hover:text-[#141412]"
                >
                  Contact
                </button>
                <button
                  onClick={() => setCurrentPage("policies")}
                  className="hover:text-[#141412]"
                >
                  Policies
                </button>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="px-4 py-2 text-xs font-semibold text-[#f6f3ec] bg-[#141412] rounded-lg hover:bg-[#2b2823] transition-colors"
                >
                  Shop Collection
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16 flex-1">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48849] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The ShiftStore Story</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#141412] leading-tight">
                {SHIFTSTORE_STORY.headline}
              </h1>
              <p className="text-base text-[#6b6963] max-w-2xl mx-auto leading-relaxed">
                Bridging the gap between viral global design trends and the
                modern Indian home, with zero drop-shipping delays and local
                dispatch from Siliguri.
              </p>
            </div>

            <section className="bg-white/80 border border-[#e7e1d6] rounded-2xl p-8 sm:p-10 space-y-4 shadow-xs">
              <h2 className="text-2xl font-serif font-bold text-[#141412]">
                {SHIFTSTORE_STORY.vision.title}
              </h2>
              <p className="text-sm sm:text-base text-[#6b6963] leading-relaxed">
                {SHIFTSTORE_STORY.vision.text}
              </p>
            </section>

            <section className="bg-white/80 border border-[#e7e1d6] rounded-2xl p-8 sm:p-10 space-y-4 shadow-xs">
              <h2 className="text-2xl font-serif font-bold text-[#141412]">
                {SHIFTSTORE_STORY.approach.title}
              </h2>
              <p className="text-sm sm:text-base text-[#6b6963] leading-relaxed">
                {SHIFTSTORE_STORY.approach.text}
              </p>
            </section>

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
                      {idx === 2 && <PackageCheck className="w-5 h-5" />}
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

            <section className="bg-[#f0ece1]/60 border border-[#e7e1d6] rounded-2xl p-8 text-center space-y-4">
              <HeartHandshake className="w-8 h-8 text-[#b48849] mx-auto" />
              <h3 className="font-serif font-bold text-2xl text-[#141412]">
                Direct from Siliguri, West Bengal
              </h3>
              <p className="text-xs sm:text-sm text-[#6b6963] max-w-xl mx-auto leading-relaxed">
                Every package is inspected, wrapped in custom honeycomb
                protection, and handed to express couriers right here in North
                Bengal.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage("home")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <span>Explore The Festive Catalog</span>
                  <ArrowRight className="w-4 h-4 text-[#b48849]" />
                </button>
              </div>
            </section>
          </main>

          <footer className="border-t border-[#e7e1d6] py-8 text-center text-xs text-[#6b6963] max-w-7xl mx-auto px-6 mt-16">
            <p>
              © 2026 ShiftStore India. Founded in Siliguri, West Bengal by
              Sandeep Malakar. All rights reserved.
            </p>
          </footer>
        </div>
      )}

      {/* ========================================================
          4. CONTACT PAGE
      ======================================================== */}
      {currentPage === "contact" && (
        <div className="min-h-screen flex flex-col">
          <div className="bg-[#141412] text-[#f6f3ec] py-2 px-4 text-center text-xs tracking-wider font-medium">
            <span>
              ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
              ACROSS INDIA
            </span>
          </div>

          <header className="sticky top-0 z-30 bg-[#f6f3ec]/90 backdrop-blur-md border-b border-[#e7e1d6] px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage("home")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#6b6963] hover:text-[#141412] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Store</span>
                </button>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="font-serif text-2xl font-bold tracking-tight text-[#141412]"
                >
                  ShiftStore
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-[#6b6963]">
                <button
                  onClick={() => setCurrentPage("about")}
                  className="hover:text-[#141412]"
                >
                  Our Story
                </button>
                <button
                  onClick={() => setCurrentPage("policies")}
                  className="hover:text-[#141412]"
                >
                  Policies
                </button>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="px-4 py-2 text-xs font-semibold text-[#f6f3ec] bg-[#141412] rounded-lg hover:bg-[#2b2823] transition-colors"
                >
                  Shop Collection
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 flex-1">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48849] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dedicated Support Hub</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#141412]">
                We're Here to Help.
              </h1>
              <p className="text-sm text-[#6b6963] max-w-lg mx-auto">
                Direct access to real human support in West Bengal. Connect on
                WhatsApp for lightning-fast replies or send us a message below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    "Namaste ShiftStore Team! I have a question regarding my festive order.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">WhatsApp Support</h3>
                      <p className="text-xs text-white/90">
                        Instant Human Chat (Under 5 mins)
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/20 text-xs font-semibold flex items-center justify-between">
                    <span>+91 98765 43210</span>
                    <span>Open Chat →</span>
                  </div>
                </a>

                <div className="p-6 bg-white border border-[#e7e1d6] rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f0ece1] flex items-center justify-center text-[#b48849]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#141412]">
                        Email Concierge
                      </h3>
                      <p className="text-xs text-[#6b6963]">
                        support@shiftstore.in
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#6b6963] leading-relaxed">
                    For order modifications, corporate gifting inquiries, or
                    bulk festive orders.
                  </p>
                </div>

                <div className="p-6 bg-white border border-[#e7e1d6] rounded-2xl shadow-xs space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#b48849] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#141412] block">
                        Operating Hours
                      </span>
                      <span className="text-[#6b6963]">
                        Mon – Sat: 10:00 AM – 7:00 PM IST
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-3 border-t border-[#e7e1d6]/70">
                    <MapPin className="w-4 h-4 text-[#b48849] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#141412] block">
                        Fulfillment Center
                      </span>
                      <span className="text-[#6b6963]">
                        ShiftStore India Logistics Hub, Sevoke Road, Siliguri,
                        West Bengal – 734001
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white/80 border border-[#e7e1d6] rounded-2xl p-6 sm:p-8 shadow-xs">
                {isContactSubmitted ? (
                  <div className="py-12 text-center space-y-4 animate-in fade-in">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-[#141412]">
                      Message Received!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6b6963] max-w-md mx-auto">
                      Thank you for reaching out, {contactForm.name}. Our
                      Siliguri customer support desk will reply via email and
                      WhatsApp shortly.
                    </p>
                    <button
                      onClick={() => {
                        setIsContactSubmitted(false);
                        setContactForm({
                          name: "",
                          email: "",
                          phone: "",
                          subject: "Order Tracking",
                          message: "",
                        });
                      }}
                      className="px-5 py-2.5 bg-[#141412] text-[#f6f3ec] rounded-xl text-xs font-semibold hover:bg-[#2b2823] transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <h2 className="font-serif font-bold text-xl text-[#141412]">
                        Send Us an Inquiry
                      </h2>
                      <p className="text-xs text-[#6b6963] mt-0.5">
                        Have a question regarding shipping times, COD, or custom
                        gifting?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g. Rahul Sen"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              email: e.target.value,
                            })
                          }
                          placeholder="rahul@example.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="10-digit phone for WhatsApp update"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                          Inquiry Topic
                        </label>
                        <select
                          value={contactForm.subject}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              subject: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849]"
                        >
                          <option value="Order Tracking">
                            Order Tracking & Dispatch
                          </option>
                          <option value="COD Inquiry">
                            Cash on Delivery Details
                          </option>
                          <option value="Damage Replacement">
                            Damage Replacement Request
                          </option>
                          <option value="Corporate Gifting">
                            Puja Corporate Gifting
                          </option>
                          <option value="Other">Other Query</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#141412] uppercase tracking-wider mb-1">
                        Your Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            message: e.target.value,
                          })
                        }
                        placeholder="How can our Siliguri team assist you today?"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#e7e1d6] rounded-xl text-xs text-[#141412] focus:outline-none focus:border-[#b48849] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isContactSubmitting}
                      className="w-full py-3.5 px-4 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                    >
                      {isContactSubmitting ? (
                        <span>Submitting Message...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#b48849]" />
                          <span>Submit Inquiry</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </main>

          <footer className="border-t border-[#e7e1d6] py-8 text-center text-xs text-[#6b6963] max-w-7xl mx-auto px-6 mt-16">
            <p>
              © 2026 ShiftStore India. Siliguri Fulfillment Hub. All rights
              reserved.
            </p>
          </footer>
        </div>
      )}

      {/* ========================================================
          5. POLICIES & LEGAL TERMS PAGE
      ======================================================== */}
      {currentPage === "policies" && (
        <div className="min-h-screen flex flex-col">
          <div className="bg-[#141412] text-[#f6f3ec] py-2 px-4 text-center text-xs tracking-wider font-medium">
            <span>
              ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
              ACROSS INDIA
            </span>
          </div>

          <header className="sticky top-0 z-30 bg-[#f6f3ec]/90 backdrop-blur-md border-b border-[#e7e1d6] px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage("home")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#6b6963] hover:text-[#141412] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Store</span>
                </button>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="font-serif text-2xl font-bold tracking-tight text-[#141412]"
                >
                  ShiftStore
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-[#6b6963]">
                <button
                  onClick={() => setCurrentPage("about")}
                  className="hover:text-[#141412]"
                >
                  Our Story
                </button>
                <button
                  onClick={() => setCurrentPage("contact")}
                  className="hover:text-[#141412]"
                >
                  Contact
                </button>
                <button
                  onClick={() => setCurrentPage("home")}
                  className="px-4 py-2 text-xs font-semibold text-[#f6f3ec] bg-[#141412] rounded-lg hover:bg-[#2b2823] transition-colors"
                >
                  Shop Collection
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10 flex-1">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48849] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transparency & Trust</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#141412]">
                Store Policies & Legal Terms
              </h1>
              <p className="text-xs sm:text-sm text-[#6b6963] max-w-lg mx-auto">
                Clear, honest terms crafted to protect your purchases and
                guarantee an immaculate festive shopping experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <nav
                aria-label="Policy tabs"
                className="md:col-span-4 bg-white/80 border border-[#e7e1d6] rounded-2xl p-2.5 shadow-xs space-y-1.5 sticky top-24"
              >
                {[
                  { id: "shipping", label: "Shipping Policy", icon: Truck },
                  {
                    id: "returns",
                    label: "Return & Replacement",
                    icon: RotateCcw,
                  },
                  { id: "privacy", label: "Privacy Policy", icon: ShieldCheck },
                  { id: "terms", label: "Terms of Service", icon: FileText },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activePolicyTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePolicyTab(tab.id as any)}
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

              <div className="md:col-span-8 bg-white/90 border border-[#e7e1d6] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 text-sm text-[#6b6963] leading-relaxed animate-in fade-in">
                {activePolicyTab === "shipping" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-[#141412]">
                      Shipping & Delivery Policy
                    </h2>
                    <p>
                      Every product displayed on ShiftStore is physically stored
                      at our primary fulfillment center located in{" "}
                      <strong>Siliguri, West Bengal (PIN: 734001)</strong>. We
                      do not operate under third-party international
                      drop-shipping models.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs">
                      <li>
                        Orders placed before <strong>2:00 PM IST</strong>{" "}
                        dispatch the <strong>same business day</strong>.
                      </li>
                      <li>
                        Orders placed after 2:00 PM IST dispatch within{" "}
                        <strong>24 hours</strong>.
                      </li>
                    </ul>
                    <p className="text-xs pt-2">
                      <strong>Transit Times:</strong> 2 to 4 days for Eastern
                      India; 3 to 5 days for Metros; 4 to 7 days for rest of
                      India.
                    </p>
                  </div>
                )}

                {activePolicyTab === "returns" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-[#141412]">
                      Return & Free Replacement Policy
                    </h2>
                    <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Mandatory Unboxing Video Requirement:</strong>{" "}
                        All damage claims must include a continuous unboxing
                        video recorded from the moment the sealed outer flyer is
                        opened.
                      </div>
                    </div>
                    <p className="text-xs">
                      In the rare event of transit damage, message our WhatsApp
                      support team at <strong>+91 98765 43210</strong> within{" "}
                      <strong>48 hours of delivery</strong>. We will dispatch a
                      free replacement immediately.
                    </p>
                  </div>
                )}

                {activePolicyTab === "privacy" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-[#141412]">
                      Privacy Policy
                    </h2>
                    <p className="text-xs leading-relaxed">
                      At ShiftStore India, we respect your privacy. Your address
                      and phone numbers are encrypted and strictly used for
                      order fulfillment and courier tracking coordination. We
                      never sell or share your data with third-party marketing
                      brokers.
                    </p>
                  </div>
                )}

                {activePolicyTab === "terms" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-[#141412]">
                      Terms of Service
                    </h2>
                    <p className="text-xs leading-relaxed">
                      All prices are in INR and include GST. All transactions
                      are governed by the laws of India, and any legal disputes
                      shall be subject to the exclusive jurisdiction of the
                      competent courts in Siliguri, West Bengal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>

          <footer className="border-t border-[#e7e1d6] py-8 text-center text-xs text-[#6b6963] max-w-7xl mx-auto px-6 mt-16">
            <p>
              © 2026 ShiftStore India. All rights reserved. Registered in
              Siliguri, West Bengal.
            </p>
          </footer>
        </div>
      )}

      {/* ========================================================
          6. HOME STOREFRONT
      ======================================================== */}
      {currentPage === "home" && (
        <div className="flex-1 flex flex-col pb-24 sm:pb-12">
          {/* Global Announcement Bar */}
          <div className="bg-[#141412] text-[#f6f3ec] py-2 px-4 text-center text-xs tracking-wider font-medium flex items-center justify-center gap-2">
            <span>
              ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
              ACROSS INDIA
            </span>
          </div>

          {/* Top Navigation Bar */}
          <header className="sticky top-0 z-30 bg-[#f6f3ec]/90 backdrop-blur-md border-b border-[#e7e1d6] px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
              <button
                onClick={() => {
                  setCurrentPage("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="font-serif text-2xl font-bold tracking-tight text-[#141412] whitespace-nowrap shrink-0"
              >
                ShiftStore
              </button>

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
                <button
                  onClick={() => setCurrentPage("about")}
                  className="hover:text-[#141412] transition-colors whitespace-nowrap shrink-0 uppercase"
                >
                  Our Story
                </button>
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
                <button
                  onClick={handleBuyHeroBundle}
                  className="px-4 py-2 text-xs font-semibold text-[#f6f3ec] bg-[#141412] rounded-lg hover:bg-[#2b2823] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#b48849]" />
                  <span>Shop Collection</span>
                </button>
              </div>
            </div>
          </header>

          {/* Storefront Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-20 flex-1">
            {/* Hero Section */}
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
                people who want their everyday spaces to feel a little more
                special. No overwhelming catalogs—just carefully selected items
                that look good, feel right, and are worth every rupee.
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

            {/* Single-Product Hero Drop */}
            <section
              id="hero-drop"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4 border-t border-[#e7e1d6]/70"
            >
              <div className="lg:col-span-7 space-y-4">
                <div
                  onClick={() => handleOpenPdp(heroProduct.slug)}
                  className="relative cursor-pointer group"
                  title="Click to view full Flipkart-style product page"
                >
                  <ProductVisual
                    type={heroProduct.imageSvgType}
                    className="shadow-lg group-hover:scale-[1.01] transition-transform"
                  />
                  <div className="absolute top-4 right-4 bg-[#141412]/90 text-[#f6f3ec] px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs border border-[#b48849]/40">
                    <Flame className="w-3.5 h-3.5 text-[#b48849]" />
                    <span>{heroProduct.badge}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 text-[#141412] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-[#e7e1d6] flex items-center gap-1">
                    <span>View Product Page</span>
                    <ArrowRight className="w-3 h-3 text-[#b48849]" />
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

                {/* Bundle Upsell */}
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
                      BUY NOW • ₹{selectedBundle.price.toLocaleString("en-IN")}{" "}
                      • COD AVAILABLE
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#b48849]" />
                  </button>

                  <button
                    onClick={() => handleOpenPdp(heroProduct.slug)}
                    className="w-full py-2.5 px-4 bg-transparent hover:bg-[#e7e1d6]/50 text-[#141412] rounded-xl text-xs font-semibold border border-[#e7e1d6] flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View Full Specs & Flipkart-Style PDP →</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Why Us Grid */}
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

            {/* Festive Catalog */}
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
                      <div
                        onClick={() => handleOpenPdp(prod.slug)}
                        className="p-3 cursor-pointer"
                        title="Click to view Flipkart-style PDP"
                      >
                        <ProductVisual
                          type={prod.imageSvgType}
                          badge={prod.badge}
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3
                          onClick={() => handleOpenPdp(prod.slug)}
                          className="font-serif font-bold text-base text-[#141412] group-hover:text-[#b48849] transition-colors cursor-pointer"
                        >
                          {prod.title}
                        </h3>
                        <p className="text-xs text-[#6b6963] line-clamp-2">
                          {prod.hook || prod.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-serif tabular-nums text-[#141412]">
                          ₹{prod.salePrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-[#6b6963] line-through tabular-nums">
                          ₹{prod.originalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenPdp(prod.slug)}
                          className="py-2 px-2 bg-[#f0ece1] hover:bg-[#e7e1d6] text-[#141412] rounded-lg text-xs font-semibold text-center transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleBuyCatalogProduct(prod)}
                          className="py-2 px-2 bg-[#141412] hover:bg-[#2b2823] text-[#f6f3ec] rounded-lg text-xs font-semibold text-center transition-colors"
                        >
                          Buy COD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Social Proof */}
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

            {/* FAQs */}
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
                  const isOpen = activeFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-white/80 border border-[#e7e1d6] rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
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
          </main>

          {/* Mobile Sticky Bar */}
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

          {/* Footer */}
          <footer className="mt-16 border-t border-[#e7e1d6] py-8 text-center text-xs text-[#6b6963] max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                © 2026 ShiftStore India. Founded in Siliguri, West Bengal. All
                rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentPage("about")}
                  className="hover:text-[#141412] underline"
                >
                  Our Story
                </button>
                <span>·</span>
                <button
                  onClick={() => setCurrentPage("contact")}
                  className="hover:text-[#141412] underline"
                >
                  Contact
                </button>
                <span>·</span>
                <button
                  onClick={() => setCurrentPage("policies")}
                  className="hover:text-[#141412] underline"
                >
                  Policies
                </button>
              </div>
            </div>
          </footer>

          {/* Checkout Modal */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={checkoutItems}
            onOrderSuccess={handleOrderSuccess}
          />

          {/* Order Confirmed Modal */}
          {confirmedOrder && (
            <OrderSuccessModal
              order={confirmedOrder}
              onClose={() => setConfirmedOrder(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
