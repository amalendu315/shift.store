/**
 * ShiftStore Core Data Layer & Interactive Store
 * Premium Curations • Limited Festive Stock
 */

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  hook?: string;
  description: string;
  details?: string;
  whyItWorks?: string;
  deliveryNote?: string;
  originalPrice: number;
  salePrice: number;
  badge: string;
  stock: number;
  isHeroDrop: boolean;
  isPublished: boolean;
  features: string[];
  imageSvgType: "buddha" | "vase" | "aroma" | "planter";
  bundles: BundleItem[];
}

export interface BundleItem {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  quantity: number;
  price: number;
  discountPercent: number;
  isPopular: boolean;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  totalAmount: number;
  paymentMethod: "COD" | "RAZORPAY";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "NEW" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  notes?: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  verifiedText: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PolicyItem {
  title: string;
  description: string;
}

export const INITIAL_PRODUCTS_DATA: ProductItem[] = [
  {
    id: "prod-hero-zen-buddha",
    title: "The Premium Zen Buddha Décor Piece",
    slug: "zen-buddha-decor",
    subtitle: "Artisanal Matte-Stone Sculpture • Siliguri Hub",
    hook: "Bring a sense of profound calm and architectural elegance to your living room, entryway, or office desk.",
    description:
      "Crafted with a specialized matte-stone finish, this piece catches the ambient light beautifully. It is weighty enough to feel like a high-end gallery piece, yet perfectly sized to fit modern apartment shelves.",
    details:
      "Crafted with a specialized matte-stone finish, this piece catches the ambient light beautifully. It is weighty enough to feel like a high-end gallery piece, yet perfectly sized to fit modern apartment shelves.",
    whyItWorks:
      "It is the ultimate conversation starter. Whether nestled between your favorite books or placed next to your festive marigolds, it instantly upgrades the energy of your room.",
    deliveryNote:
      "Stocked in our Siliguri fulfillment center. Dispatched within 24 hours.",
    originalPrice: 2199,
    salePrice: 1499,
    badge: "✦ LIMITED PUJA STOCK",
    stock: 38,
    isHeroDrop: true,
    isPublished: true,
    imageSvgType: "buddha",
    features: [
      "Specialized tactile matte-stone finish with ambient light reflections",
      "Solid, weighty feel of a gallery-grade piece (fits modern apartment shelves)",
      "Instant conversation starter for foyer, books, or festive marigolds",
      "Packed in custom shock-absorbent protective foam from Siliguri hub",
      "Dispatches within 24 hours with real-time tracking",
    ],
    bundles: [
      {
        id: "b-buddha-1",
        productId: "prod-hero-zen-buddha",
        title: "Buy 1 Unit",
        subtitle: "Best for personal use • Free Fast Shipping",
        quantity: 1,
        price: 1499,
        discountPercent: 33,
        isPopular: false,
      },
      {
        id: "b-buddha-2",
        productId: "prod-hero-zen-buddha",
        title: "Buy 2 Units (Best Value Offer)",
        subtitle: "Keep one, gift one this Puja — Save an extra ₹200!",
        quantity: 2,
        price: 2799,
        discountPercent: 36,
        isPopular: true,
      },
    ],
  },
  {
    id: "prod-minimal-ceramic-vase",
    title: "The Nordic Matte Ceramic Vase",
    slug: "minimal-ceramic-vase",
    subtitle: "Tactile Unglazed Centerpiece in Chalk White",
    hook: "A subtle, striking centerpiece that looks stunning even when empty.",
    description:
      "Moving away from glossy, outdated ceramics, this vase features a tactile, unglazed aesthetic that pairs perfectly with dried pampas grass, fresh festive blooms, or simply stands alone as an artistic sculpture.",
    details:
      "Moving away from glossy, outdated ceramics, this vase features a tactile, unglazed aesthetic that pairs perfectly with dried pampas grass, fresh festive blooms, or simply stands alone as an artistic sculpture.",
    deliveryNote:
      "Packed securely in custom-cut protective foam to ensure it reaches you in immaculate condition. Dispatches from Siliguri within 24 hours.",
    originalPrice: 1299,
    salePrice: 899,
    badge: "BESTSELLER",
    stock: 54,
    isHeroDrop: false,
    isPublished: true,
    imageSvgType: "vase",
    features: [
      "Tactile unglazed matte ceramic aesthetic",
      "Pairs with dried pampas grass, festive blooms, or standalone sculpture",
      "Custom-cut shock-absorbent protective packaging",
      "Dispatches from Siliguri within 24 hours",
    ],
    bundles: [
      {
        id: "b-vase-1",
        productId: "prod-minimal-ceramic-vase",
        title: "Single Vase",
        subtitle: "Save ₹400 • Free Fast Shipping",
        quantity: 1,
        price: 899,
        discountPercent: 31,
        isPopular: false,
      },
      {
        id: "b-vase-2",
        productId: "prod-minimal-ceramic-vase",
        title: "Pair of 2 Vases",
        subtitle: "Save ₹900 • Festive Gifting Duo",
        quantity: 2,
        price: 1699,
        discountPercent: 35,
        isPopular: true,
      },
    ],
  },
  {
    id: "prod-luxury-aroma-set",
    title: "The Luxury Amber Aroma Diffuser",
    slug: "luxury-aroma-set",
    subtitle: "Botanical Scent Throw & Solid Brass Tray",
    hook: "Rich botanical scent throw that fills your home with festive warmth.",
    description:
      "Moving away from artificial room sprays, this pure essential oil formulation diffuses warm Sandalwood, Kashmiri Mogra, and Ambergris continuously for over 60 days.",
    details:
      "120ml pure essential oil formulation with 8 black porous rattan reeds and a hand-finished brushed brass coaster dish.",
    deliveryNote:
      "Dispatches from Siliguri within 24 hours in secure packaging.",
    originalPrice: 1199,
    salePrice: 749,
    badge: "LIMITED BATCH",
    stock: 29,
    isHeroDrop: false,
    isPublished: true,
    imageSvgType: "aroma",
    features: [
      "Pure botanical formulation (Sandalwood & Kashmiri Mogra)",
      "Zero alcohol or harsh synthetic fixatives",
      "Includes solid brushed brass catch-all trinket dish",
      "Dispatches from Siliguri within 24 hours",
    ],
    bundles: [
      {
        id: "b-aroma-1",
        productId: "prod-luxury-aroma-set",
        title: "Single Diffuser Set",
        subtitle: "Save ₹450 • Free Fast Shipping",
        quantity: 1,
        price: 749,
        discountPercent: 38,
        isPopular: false,
      },
      {
        id: "b-aroma-2",
        productId: "prod-luxury-aroma-set",
        title: "Twin Pack (2 Diffusers)",
        subtitle: "Save ₹1,050 • Living Room & Bedroom",
        quantity: 2,
        price: 1349,
        discountPercent: 44,
        isPopular: true,
      },
    ],
  },
  {
    id: "prod-modern-planter",
    title: "The Fluted Sandstone Planter",
    slug: "modern-planter",
    subtitle: "Porous Sandstone with Concealed Drain Tray",
    hook: "Architectural fluted stoneware engineered for modern indoor greenery.",
    description:
      "Natural porous sandstone composite that provides optimal root aeration, featuring an integrated nesting saucer that prevents tabletop water stains.",
    details:
      "Hand-cast architectural fluted exterior with hidden drainage tray. Engineered for succulents, jade plants, and indoor festive greenery.",
    deliveryNote:
      "Dispatches from Siliguri within 24 hours in protective foam.",
    originalPrice: 999,
    salePrice: 649,
    badge: "TRENDING",
    stock: 42,
    isHeroDrop: false,
    isPublished: true,
    imageSvgType: "planter",
    features: [
      "Natural porous sandstone for healthy root vitality",
      "Discreet hidden drainage saucer protects wooden furniture",
      "Modern fluted architectural profile",
      "Dispatches from Siliguri within 24 hours",
    ],
    bundles: [
      {
        id: "b-planter-1",
        productId: "prod-modern-planter",
        title: "Single Planter",
        subtitle: "Save ₹350 • Free Fast Shipping",
        quantity: 1,
        price: 649,
        discountPercent: 35,
        isPopular: false,
      },
      {
        id: "b-planter-2",
        productId: "prod-modern-planter",
        title: "Duo Planter Set",
        subtitle: "Save ₹750 • Balcony & Console Table",
        quantity: 2,
        price: 1249,
        discountPercent: 37,
        isPopular: true,
      },
    ],
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Ananya B.",
    rating: 5,
    comment:
      "The product looks much more premium than I expected at this price. The packaging was excellent and it arrived right on time for the pujas.",
    verifiedText: "Verified Buyer",
  },
  {
    id: "rev-2",
    author: "Rahul S.",
    rating: 5,
    comment:
      "I was tired of buying cheap-looking decor from massive marketplaces. ShiftStore's curation is brilliant. Looks exactly like the photos.",
    verifiedText: "Verified Buyer",
  },
  {
    id: "rev-3",
    author: "Priya M.",
    rating: 5,
    comment:
      "Bought the Buddha decor as a gift. It feels heavy, considered, and presentable straight out of the box. Highly recommend!",
    verifiedText: "Verified Buyer",
  },
];

export const FAQS_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes, COD is available across most serviceable PIN codes in India. We want you to feel completely secure in your purchase. You can also choose to pay via secure UPI or card at checkout for faster, contactless delivery.",
  },
  {
    id: "faq-2",
    question: "How long will my order take to reach me?",
    answer:
      "Because we hold all our inventory physically in our Siliguri warehouse, we don't rely on slow international shipping. Orders are dispatched within 24 hours. Expect delivery within 2–4 days for Eastern India, and 4–7 days for the rest of the country.",
  },
  {
    id: "faq-3",
    question: "What happens if the product gets damaged in transit?",
    answer:
      "We use heavy-duty, shock-proof packaging, but we know accidents happen. Simply record a quick unboxing video when you receive your package. If the item is damaged, message our WhatsApp support team within 48 hours, and we will send a free replacement immediately. No endless email threads, just quick resolutions.",
  },
];

export const VALUE_PROPOSITIONS = [
  {
    iconName: "Truck",
    title: "Lightning-Fast Dispatch",
    description:
      "We don't make you wait weeks for international shipping. Every item is stocked in our Siliguri fulfillment center and dispatched within 24 hours.",
  },
  {
    iconName: "ShieldCheck",
    title: "Cash on Delivery (COD)",
    description:
      "Shop with absolute confidence. Inspect your package at your doorstep before handing over your payment.",
  },
  {
    iconName: "Lock",
    title: "Secure Digital Payments",
    description:
      "Prefer paying online? We offer military-grade encrypted checkout via UPI, Credit/Debit cards, and Net Banking.",
  },
  {
    iconName: "RotateCcw",
    title: "7-Day Easy Support",
    description:
      "Real humans, real help. Connect with our dedicated WhatsApp support team instantly if you need assistance.",
  },
];

export const SHIFTSTORE_STORY = {
  headline: "Premium Aesthetics, Delivered Without the Wait.",
  vision: {
    title: "The Vision",
    text: "Finding truly unique, premium home décor online is usually a frustrating experience. You either pay exorbitant prices at luxury boutiques, or you wait 20 to 30 days for overseas drop-shipping, only to receive a product that looks nothing like the picture. ShiftStore was built to change that. Founded in Siliguri, West Bengal, by digital marketer Sandeep Malakar, we set out to bridge the gap between viral global design trends and the modern Indian home.",
  },
  approach: {
    title: "Our Approach",
    text: "As a social media marketer, Sandeep spent years analyzing what makes a living space look spectacular on screen and in real life. By partnering directly with premier overseas manufacturers and importing in bulk to our local warehouse, we bypass the middleman and the agonizing drop-shipping wait times. We don't sell everything. We act as your personal interior curators, selecting only items that pass our strict criteria for build quality, visual appeal, and 'gift-worthiness.'",
  },
  promises: [
    {
      title: "What You See Is What You Get",
      text: "We use high-fidelity, unedited photos. The premium finish you see on your screen is exactly what you will unbox.",
    },
    {
      title: "Local Control, Global Quality",
      text: "Because your order ships directly from our West Bengal hub, we control the packaging, the quality check, and the delivery speed.",
    },
    {
      title: "A Joyful Unboxing",
      text: "We believe opening a package should feel like receiving a gift. Every item is packed safely in custom, shock-absorbent materials to survive Indian logistics flawlessly.",
    },
  ],
};

export const CORE_POLICIES: PolicyItem[] = [
  {
    title: "Shipping Policy",
    description:
      "Free shipping on all prepaid orders. A nominal convenience fee of ₹50 applies to COD orders. All orders placed before 2 PM IST are dispatched the same day from our Siliguri hub.",
  },
  {
    title: "Return Policy",
    description:
      "To maintain our high hygiene and quality standards during the festive rush, returns are strictly processed for items that are defective or damaged upon arrival. An unboxing video is required to process any claims.",
  },
  {
    title: "Privacy Policy",
    description:
      "Your trust is our priority. Your address and phone numbers are encrypted and strictly used for order fulfillment. We never sell your data to third-party marketing agencies.",
  },
];
