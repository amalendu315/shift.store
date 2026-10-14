import React, { useState, useEffect, useMemo } from "react";
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
  ChevronDown,
  Filter,
  SlidersHorizontal,
  X,
  Store,
  LayoutDashboard,
  Mail,
  MapPin,
  Send,
  FileText,
  Lock,
  ArrowLeft,
  MessageCircle,
  Package,
} from "lucide-react";
import {
  INITIAL_PRODUCTS_DATA,
  CORE_POLICIES,
  ProductItem,
  OrderRecord,
} from "./data/store.ts";
import { INITIAL_ORDERS } from "../prisma/seed.ts";
import { ProductCard } from "../components/ProductCard.tsx";
import HeroSlider from "../components/HeroSlider.tsx";
import { CheckoutModal, CheckoutItem } from "../components/CheckoutModal.tsx";
import { OrderSuccessModal } from "./components/OrderSuccessModal.tsx";
import { AdminDashboardView } from "./components/admin/AdminDashboardView.tsx";
import { ProductClientView } from "../components/ProductClientView.tsx";

// Mock Collections for Homepage 4-Column Grids
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

// 5 Circular Categories
const CIRCULAR_CATEGORIES = [
  {
    name: "Wall Art",
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80",
    cat: "Wall Art",
  },
  {
    name: "Vases",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80",
    cat: "Vases",
  },
  {
    name: "Festive",
    image:
      "https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=300&q=80",
    cat: "Festive",
  },
  {
    name: "Lighting",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80",
    cat: "Lighting",
  },
  {
    name: "Tabletop",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80",
    cat: "Tabletop",
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

// Full catalog for Shop PLP
const ALL_SHOP_PRODUCTS = [
  ...FESTIVE_COLLECTION.map((p, i) => ({ ...p, salesCount: 500 - i * 40 })),
  ...HANDPICKED_COLLECTION.map((p, i) => ({ ...p, salesCount: 350 - i * 30 })),
  ...PREMIUM_DECOR.map((p, i) => ({ ...p, salesCount: 200 - i * 20 })),
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

export default function App() {
  type PageType =
    | "home"
    | "shop"
    | "pdp"
    | "about"
    | "contact"
    | "policies"
    | "admin";
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [pdpSlug, setPdpSlug] = useState<string>("zen-buddha-decor");

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

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminAuthError, setAdminAuthError] = useState("");

  // Store data state
  const [products, setProducts] = useState<ProductItem[]>(
    INITIAL_PRODUCTS_DATA,
  );
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS as any);

  // Cart & Checkout State
  const [cartItems, setCartItems] = useState<
    Array<{ id: string; title: string; price: number; quantity: number }>
  >([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shop PLP Filter States
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
  const [sortBy, setSortBy] = useState<
    "featured" | "best-selling" | "price-asc" | "price-desc"
  >("featured");
  const [categoryAccordionOpen, setCategoryAccordionOpen] = useState(true);
  const [availabilityAccordionOpen, setAvailabilityAccordionOpen] =
    useState(true);
  const [priceAccordionOpen, setPriceAccordionOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

  const categoriesList = [
    "Vases",
    "Wall Art",
    "Tabletop",
    "Sculptures",
    "Festive",
    "Lighting",
  ];

  // Helper Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Add to cart handler
  const handleAddToCart = (product: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    image: string;
  }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
        },
      ];
    });
    triggerToast(`Added "${product.title}" to cart`);
  };

  // Instant Checkout for Cart or Direct Buy
  const handleOpenCheckout = (itemsToBuy?: CheckoutItem[]) => {
    if (itemsToBuy && itemsToBuy.length > 0) {
      setCheckoutItems(itemsToBuy);
    } else if (cartItems.length > 0) {
      setCheckoutItems(
        cartItems.map((i) => ({
          productId: i.id,
          title: i.title,
          quantity: i.quantity,
          price: i.price,
        })),
      );
    } else {
      // Default to Hero item if cart is empty
      setCheckoutItems([
        {
          productId: "fc-2",
          title: "Zen Buddha Head Ceramic Sculpture (Festive Special)",
          quantity: 1,
          price: 1499,
        },
      ]);
    }
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
    setCartItems([]);
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

  // Filter & Sort PLP Products
  const filteredShopProducts = useMemo(() => {
    return ALL_SHOP_PRODUCTS.filter((prod) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(prod.category)
      ) {
        return false;
      }
      if (inStockOnly && !outOfStockOnly && !prod.inStock) {
        return false;
      }
      if (outOfStockOnly && !inStockOnly && prod.inStock) {
        return false;
      }
      if (
        prod.price < appliedPriceRange.min ||
        prod.price > appliedPriceRange.max
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "best-selling") return b.salesCount - a.salesCount;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [
    selectedCategories,
    inStockOnly,
    outOfStockOnly,
    appliedPriceRange,
    sortBy,
  ]);

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const currentPdpProduct =
    products.find((p) => p.slug === pdpSlug) || products[0];
  const relatedPdpProducts = products.filter(
    (p) => p.id !== currentPdpProduct.id,
  );

  return (
    <div className="min-h-screen bg-[#fcfcf7] text-[#3d281a] flex flex-col font-sans selection:bg-[#a87c4f] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#3d281a] text-[#fcfcf7] px-4 py-3 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-[#a87c4f] animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#a87c4f]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden Administrative Access (Only reveals if URL contains #manage or ?manage=1) */}
      {typeof window !== "undefined" &&
        (window.location.hash === "#manage" ||
          window.location.search.includes("manage")) && (
          <aside
            aria-label="Portal switcher"
            className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1.5 bg-[#3d281a] text-[#fcfcf7] rounded-full shadow-2xl border border-[#a87c4f]/40 text-xs"
          >
            <button
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                currentPage === "home"
                  ? "bg-[#a87c4f] text-white font-semibold"
                  : "text-[#fcfcf7]/80 hover:text-white"
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
                  ? "bg-[#a87c4f] text-white font-semibold"
                  : "text-[#fcfcf7]/80 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Manage ShiftStore</span>
            </button>
          </aside>
        )}

      {/* ========================================================
          A. GLOBAL ANNOUNCEMENT & HEADER (Universal)
      ======================================================== */}
      {currentPage !== "admin" && (
        <>
          {/* Top Thin Announcement Bar */}
          <div className="bg-[#3d281a] text-[#fcfcf7] text-center text-xs py-2 px-4 tracking-wider uppercase font-medium flex items-center justify-center gap-2 border-b border-[#3d281a]/10">
            <span>
              ⚡ PUJA SPECIAL: FLAT 33% OFF + FREE FAST SHIPPING • COD AVAILABLE
              ACROSS INDIA
            </span>
          </div>

          {/* Main Header with Logo Left, Centered Links, Right Icons */}
          <header className="sticky top-0 z-40 bg-[#fcfcf7]/95 backdrop-blur-md border-b border-[#e8e1d7] transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
              {/* Logo */}
              <button
                onClick={() => {
                  setCurrentPage("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 group text-left"
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#3d281a] group-hover:text-[#a87c4f] transition-colors">
                  ShiftStore
                </span>
              </button>

              {/* Centered Navigation Links */}
              <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase">
                <button
                  onClick={() => {
                    setCurrentPage("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`transition-colors ${
                    currentPage === "home"
                      ? "text-[#a87c4f] border-b-2 border-[#a87c4f] pb-1"
                      : "text-[#3d281a] hover:text-[#a87c4f]"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setSelectedCategories(["Vases", "Tabletop", "Wall Art"]);
                    setCurrentPage("shop");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-[#3d281a] hover:text-[#a87c4f] transition-colors"
                >
                  Decor
                </button>
                <button
                  onClick={() => {
                    setSelectedCategories(["Festive"]);
                    setCurrentPage("shop");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-[#3d281a] hover:text-[#a87c4f] transition-colors"
                >
                  Festive
                </button>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setCurrentPage("shop");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`transition-colors ${
                    currentPage === "shop"
                      ? "text-[#a87c4f] border-b-2 border-[#a87c4f] pb-1"
                      : "text-[#3d281a] hover:text-[#a87c4f]"
                  }`}
                >
                  Shop All
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("about");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`transition-colors ${
                    currentPage === "about"
                      ? "text-[#a87c4f] border-b-2 border-[#a87c4f] pb-1"
                      : "text-[#3d281a] hover:text-[#a87c4f]"
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`transition-colors ${
                    currentPage === "contact"
                      ? "text-[#a87c4f] border-b-2 border-[#a87c4f] pb-1"
                      : "text-[#3d281a] hover:text-[#a87c4f]"
                  }`}
                >
                  Contact
                </button>
              </nav>

              {/* Right-side Icons */}
              <div className="flex items-center gap-3 sm:gap-4 text-[#3d281a]">
                <button
                  onClick={() => {
                    setCurrentPage("shop");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-2 hover:text-[#a87c4f] transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    triggerToast("Account portal: logged in as Guest");
                  }}
                  className="p-2 hover:text-[#a87c4f] transition-colors"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleOpenCheckout()}
                  className="p-2 hover:text-[#a87c4f] transition-colors relative"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalCartCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#a87c4f] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>
        </>
      )}

      {/* ========================================================
          PAGE 1: HOMEPAGE (Exact Vertical Flow)
      ======================================================== */}
      {currentPage === "home" && (
        <div className="flex-1 flex flex-col">
          {/* B. HERO BANNER CAROUSEL / SLIDER */}
          <HeroSlider
            className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10"
            onNavigateShop={(cat) => {
              if (cat) {
                setSelectedCategories([cat]);
              } else {
                setSelectedCategories([]);
              }
              setCurrentPage("shop");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onNavigateProduct={(slug) => handleOpenPdp(slug)}
          />

          {/* C. Circular Categories */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
                Browse By Space
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3d281a] mt-1">
                Explore Categories
              </h2>
            </div>

            <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto pb-4 pt-2 no-scrollbar px-2">
              {CIRCULAR_CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategories([cat.cat]);
                    setCurrentPage("shop");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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
                </button>
              ))}
            </div>
          </section>

          {/* D. Product Grids / Carousels (3 Sections) */}
          {/* Section 1: Festive Collection */}
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
              <button
                onClick={() => {
                  setSelectedCategories(["Festive"]);
                  setCurrentPage("shop");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] hover:text-[#3d281a] flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
              >
                <span>View All Festive</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

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
                  onClick={() => handleOpenPdp(prod.slug)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          {/* Section 2: Our Handpicked Collection */}
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
              <button
                onClick={() => {
                  setCurrentPage("shop");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] hover:text-[#3d281a] flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
              >
                <span>Explore Handpicked</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

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
                  onClick={() => handleOpenPdp(prod.slug)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          {/* Section 3: Premium Decor */}
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
              <button
                onClick={() => {
                  setSelectedCategories(["Wall Art", "Lighting", "Sculptures"]);
                  setCurrentPage("shop");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] hover:text-[#3d281a] flex items-center gap-1 mt-2 sm:mt-0 transition-colors"
              >
                <span>View All Decor</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

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
                  onClick={() => handleOpenPdp(prod.slug)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          {/* E. Shop By Theme (Grid of 6 Large Circular Buttons) */}
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
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentPage("shop");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================
          PAGE 2: PRODUCT LISTING PAGE / PLP (Shop All)
      ======================================================== */}
      {currentPage === "shop" && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
          {/* Breadcrumb & Title */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-xs text-[#9c948b] mb-2 font-medium">
              <button
                onClick={() => {
                  setCurrentPage("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-[#3d281a] transition-colors"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#9c948b]" />
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-[#3d281a] transition-colors"
              >
                Shop
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#9c948b]" />
              <span className="text-[#3d281a] font-semibold">
                {selectedCategories.length === 1
                  ? selectedCategories[0]
                  : "All Products"}
              </span>
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

              {/* Mobile Filter Trigger */}
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

          {/* Two-Column PLP Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar Filters */}
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
                    onClick={() => {
                      setSelectedCategories([]);
                      setInStockOnly(false);
                      setOutOfStockOnly(false);
                      setMinPriceInput("");
                      setMaxPriceInput("");
                      setAppliedPriceRange({ min: 0, max: 10000 });
                    }}
                    className="text-xs text-[#a87c4f] hover:underline font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* 1. Categories Accordion */}
              <div className="border-b border-[#e8e1d7] pb-5">
                <button
                  onClick={() =>
                    setCategoryAccordionOpen(!categoryAccordionOpen)
                  }
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
                      const count = ALL_SHOP_PRODUCTS.filter(
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
                              onChange={() => {
                                setSelectedCategories((prev) =>
                                  prev.includes(cat)
                                    ? prev.filter((c) => c !== cat)
                                    : [...prev, cat],
                                );
                              }}
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
                      availabilityAccordionOpen
                        ? "rotate-180 text-[#a87c4f]"
                        : ""
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

              {/* 3. Price Filter with Brown Button */}
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      const min = minPriceInput
                        ? Math.max(0, parseInt(minPriceInput, 10))
                        : 0;
                      const max = maxPriceInput
                        ? parseInt(maxPriceInput, 10)
                        : 10000;
                      setAppliedPriceRange({ min, max });
                    }}
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
                      Filter
                    </button>
                  </form>
                )}
              </div>
            </aside>

            {/* Right Main Content (Product Grid) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Top Bar with Sort By Dropdown */}
              <div className="bg-white p-3.5 rounded-lg border border-[#e8e1d7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="text-xs text-[#73685e]">
                  Showing{" "}
                  <strong className="text-[#3d281a]">
                    {filteredShopProducts.length}
                  </strong>{" "}
                  items
                  {selectedCategories.length > 0 &&
                    ` in ${selectedCategories.join(", ")}`}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <label
                    htmlFor="sort-dropdown"
                    className="text-xs font-semibold uppercase tracking-wider text-[#3d281a]"
                  >
                    Sort By:
                  </label>
                  <select
                    id="sort-dropdown"
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
              {filteredShopProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredShopProducts.map((prod) => (
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
                      onClick={() => handleOpenPdp(prod.slug)}
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
                    Try clearing your category or price limits to view more
                    pieces from our full decor collection.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setAppliedPriceRange({ min: 0, max: 10000 });
                    }}
                    className="px-5 py-2.5 bg-[#3d281a] hover:bg-[#a87c4f] text-[#fcfcf7] rounded-md text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          PAGE 3: PRODUCT DETAILS PAGE / PDP
      ======================================================== */}
      {currentPage === "pdp" && (
        <div className="flex-1">
          <ProductClientView
            product={currentPdpProduct}
            relatedProducts={relatedPdpProducts}
            onNavigateProduct={(slug) => handleOpenPdp(slug)}
            onNavigateHome={() => setCurrentPage("home")}
          />
        </div>
      )}

      {/* ========================================================
          PAGE 4: ABOUT US
      ======================================================== */}
      {currentPage === "about" && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
              Siliguri, West Bengal
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#3d281a]">
              The Story of ShiftStore
            </h1>
            <p className="text-xs sm:text-sm text-[#73685e] max-w-lg mx-auto">
              Built on a simple realization: your living room doesn’t need 50
              pieces of furniture. It needs three objects that hold stillness.
            </p>
          </div>

          <div className="bg-white border border-[#e8e1d7] rounded-2xl p-8 sm:p-12 space-y-6 text-sm text-[#52453c] leading-relaxed shadow-xs">
            <p className="first-letter:text-4xl first-letter:font-serif first-letter:text-[#3d281a] first-letter:mr-2 first-letter:float-left">
              ShiftStore was born in the foothills of North Bengal, amidst the
              tea gardens of Siliguri. Surrounded by misty mornings and deep
              clay pottery traditions, we grew disillusioned with massive
              marketplaces dumping plastic trinkets into living spaces across
              India.
            </p>
            <p>
              We established our studio with one guiding compass:{" "}
              <strong>Warm Minimalist Architecture</strong>. Every piece we
              release—from our signature Sand Matte Buddha sculpture to our
              fluted ceramic urns—is selected for its tactile heft, matte
              finish, and capacity to invite warmth.
            </p>
            <div className="p-6 bg-[#f8f5ee] rounded-xl border border-[#e8e1d7] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a87c4f] block">
                The 24-Hour Siliguri Promise
              </span>
              <p className="text-xs text-[#73685e] leading-relaxed">
                We maintain our own physical inventory in Siliguri. No
                drop-shipping, no mystery warehouses. When you place an order,
                our hands inspect, pack, and hand it to express air cargo within
                24 hours.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          PAGE 5: CONTACT US
      ======================================================== */}
      {currentPage === "contact" && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
              Reach Out
            </span>
            <h1 className="text-4xl font-serif font-bold text-[#3d281a]">
              Contact Concierge
            </h1>
            <p className="text-xs sm:text-sm text-[#73685e]">
              Have a question regarding shipping times, COD, or custom gifting?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="p-6 bg-white border border-[#e8e1d7] rounded-xl space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#f8f5ee] flex items-center justify-center text-[#a87c4f] mb-3">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#3d281a]">
                  WhatsApp Helpdesk
                </h3>
                <p className="text-xs text-[#73685e]">
                  Instant human assistance for order updates, pin code checks,
                  and replacements.
                </p>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a87c4f] hover:underline pt-2"
                >
                  <span>Chat +91 98765 43210 →</span>
                </a>
              </div>

              <div className="p-6 bg-white border border-[#e8e1d7] rounded-xl space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#f8f5ee] flex items-center justify-center text-[#a87c4f] mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#3d281a]">
                  Email Desk
                </h3>
                <p className="text-xs text-[#73685e]">
                  support@shiftstore.in · Responses typically within 4 business
                  hours.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#e8e1d7] rounded-xl p-6 sm:p-8 shadow-xs">
              {isContactSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif font-bold text-xl text-[#3d281a]">
                    Message Sent
                  </h4>
                  <p className="text-xs text-[#73685e]">
                    Thank you. We will get back to you shortly via WhatsApp and
                    email.
                  </p>
                  <button
                    onClick={() => setIsContactSubmitted(false)}
                    className="mt-4 px-4 py-2 bg-[#3d281a] text-white text-xs rounded-md"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsContactSubmitting(true);
                    setTimeout(() => {
                      setIsContactSubmitting(false);
                      setIsContactSubmitted(true);
                    }, 600);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3d281a] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      placeholder="e.g. Rohini Sen"
                      className="w-full px-3 py-2 bg-[#fcfcf7] border border-[#e8e1d7] rounded-md text-xs text-[#3d281a] focus:outline-none focus:border-[#a87c4f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3d281a] mb-1">
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
                      placeholder="rohini@example.com"
                      className="w-full px-3 py-2 bg-[#fcfcf7] border border-[#e8e1d7] rounded-md text-xs text-[#3d281a] focus:outline-none focus:border-[#a87c4f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#3d281a] mb-1">
                      Inquiry Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      placeholder="How can we assist you with your decor purchase?"
                      className="w-full px-3 py-2 bg-[#fcfcf7] border border-[#e8e1d7] rounded-md text-xs text-[#3d281a] focus:outline-none focus:border-[#a87c4f] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isContactSubmitting}
                    className="w-full py-2.5 bg-[#3d281a] hover:bg-[#a87c4f] text-[#fcfcf7] rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    {isContactSubmitting ? "Sending..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          PAGE 6: POLICIES
      ======================================================== */}
      {currentPage === "policies" && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a87c4f]">
              Customer Protection
            </span>
            <h1 className="text-4xl font-serif font-bold text-[#3d281a]">
              Store Policies
            </h1>
          </div>

          <div className="flex border-b border-[#e8e1d7] gap-4 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
            {[
              { id: "shipping", label: "Shipping" },
              { id: "returns", label: "7-Day Returns" },
              { id: "privacy", label: "Privacy" },
              { id: "terms", label: "Terms" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActivePolicyTab(t.id as any)}
                className={`pb-3 border-b-2 transition-colors ${
                  activePolicyTab === t.id
                    ? "border-[#a87c4f] text-[#a87c4f]"
                    : "border-transparent text-[#73685e] hover:text-[#3d281a]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white border border-[#e8e1d7] rounded-xl p-8 space-y-4 text-xs sm:text-sm text-[#52453c] leading-relaxed shadow-xs">
            {activePolicyTab === "shipping" && (
              <>
                <h3 className="font-serif font-bold text-xl text-[#3d281a]">
                  Shipping & Logistics
                </h3>
                <p>
                  Every order is packed and dispatched directly from our
                  Siliguri fulfillment center within 24 hours of placement. We
                  partner with Bluedart, Delhivery, and DTDC Express.
                </p>
                <p>
                  Metros: 2-4 business days · Rest of India: 3-6 business days.
                  Express tracking link is sent via WhatsApp and SMS upon
                  shipment.
                </p>
              </>
            )}
            {activePolicyTab === "returns" && (
              <>
                <h3 className="font-serif font-bold text-xl text-[#3d281a]">
                  7-Day Easy Replacements
                </h3>
                <p>
                  Home decor is fragile, and we take complete responsibility. If
                  your piece arrives with any damage or discrepancy, simply
                  WhatsApp a photo to our team within 7 days of delivery.
                </p>
                <p>
                  We dispatch an immediate replacement at zero cost—no questions
                  asked, no cumbersome courier pickups required.
                </p>
              </>
            )}
            {activePolicyTab === "privacy" && (
              <>
                <h3 className="font-serif font-bold text-xl text-[#3d281a]">
                  Privacy & Security
                </h3>
                <p>
                  We treat your phone number and delivery address with strict
                  confidentiality. Your data is used exclusively to dispatch
                  parcels and send tracking alerts. We never sell your personal
                  information.
                </p>
              </>
            )}
            {activePolicyTab === "terms" && (
              <>
                <h3 className="font-serif font-bold text-xl text-[#3d281a]">
                  Terms of Purchase
                </h3>
                <p>
                  Cash on Delivery orders are subject to PIN code logistics
                  eligibility. We reserve the right to verify high-value orders
                  via WhatsApp confirmation prior to dispatch.
                </p>
              </>
            )}
          </div>
        </main>
      )}

      {/* ========================================================
          PAGE 7: ADMIN CONSOLE (Obfuscated)
      ======================================================== */}
      {currentPage === "admin" && (
        <div className="flex-1">
          {!isAdminAuthenticated ? (
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white border border-[#e8e1d7] rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-[#f8f5ee] text-[#a87c4f] rounded-full flex items-center justify-center mx-auto border border-[#e8e1d7]">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#3d281a]">
                    ShiftStore Admin Login
                  </h2>
                  <p className="text-xs text-[#73685e]">
                    Durga Puja Festive Order Fulfillment Console
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
                      className="w-full px-3 py-2 bg-[#f8f5ee]/50 border border-[#e8e1d7] rounded-lg text-xs text-[#73685e]"
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
                      placeholder="Enter admin password (PujaSale2026!)"
                      className="w-full px-3 py-2 bg-white border border-[#e8e1d7] rounded-lg text-xs text-[#3d281a] focus:outline-none focus:border-[#a87c4f]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#3d281a] hover:bg-[#a87c4f] text-[#fcfcf7] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                  >
                    Authenticate
                  </button>
                </form>

                <div className="text-center">
                  <button
                    onClick={() => setCurrentPage("home")}
                    className="text-xs text-[#a87c4f] hover:underline"
                  >
                    ← Return to Public Store
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex items-center justify-between pb-6 border-b border-[#e8e1d7] mb-8">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#3d281a]">
                    ShiftStore Console
                  </h1>
                  <p className="text-xs text-[#73685e]">
                    Siliguri Hub Logistics & Catalog Control
                  </p>
                </div>
                <button
                  onClick={() => setIsAdminAuthenticated(false)}
                  className="px-4 py-2 border border-[#e8e1d7] text-xs font-semibold rounded-lg hover:bg-white text-[#3d281a]"
                >
                  Logout
                </button>
              </div>

              <AdminDashboardView
                orders={orders}
                products={products}
                onLogout={() => setIsAdminAuthenticated(false)}
                onUpdateOrderStatus={(id, status) => {
                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === id ? { ...o, orderStatus: status } : o,
                    ),
                  );
                }}
                onUpdateProduct={(prod) => {
                  setProducts((prev) =>
                    prev.map((p) => (p.id === prod.id ? prod : p)),
                  );
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          F. DARK FOOTER (#2c1c11)
      ======================================================== */}
      {currentPage !== "admin" && (
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
                  ground your room in quiet beauty. Every parcel is safely
                  wrapped and dispatched directly from our Siliguri fulfillment
                  center.
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
                    <button
                      onClick={() => {
                        setCurrentPage("home");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        setCurrentPage("shop");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Shop All Products
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setSelectedCategories(["Festive"]);
                        setCurrentPage("shop");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Festive Collection
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setCurrentPage("about");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Our Story
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setCurrentPage("contact");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Contact Us
                    </button>
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
                    <button
                      onClick={() => {
                        setActivePolicyTab("shipping");
                        setCurrentPage("policies");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Shipping & Delivery Timeline
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActivePolicyTab("returns");
                        setCurrentPage("policies");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      7-Day Easy Replacements
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActivePolicyTab("terms");
                        setCurrentPage("policies");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Cash on Delivery (COD) Terms
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActivePolicyTab("privacy");
                        setCurrentPage("policies");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActivePolicyTab("terms");
                        setCurrentPage("policies");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Terms of Service
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 4: Newsletter */}
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
                    onClick={() =>
                      triggerToast("Subscribed to the Inner Circle")
                    }
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
                100% Encrypted Checkout · Cash on Delivery · Express Air
                Shipping
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Checkout Modal (Prepaid 5% discount, Indian phone/pincode, COD & Razorpay) */}
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
  );
}
