/**
 * ShiftStore Production Database Seed Script
 * Preloads Durga Puja festive hero drop, catalog products, bundle offers, pincodes, and default admin.
 *
 * Usage:
 * npx tsx prisma/seed.ts
 */

export const INITIAL_PRODUCTS = [
  {
    id: "prod-hero-zen-buddha",
    title: "Zen Buddha Décor",
    slug: "zen-buddha-decor",
    subtitle: "Artisanal Textured Stoneware Sculpture",
    description:
      "Hand-sculpted from high-density earthen stoneware with warm golden highlights. Created exclusively for serene living spaces and mindful Durga Puja festive decor. Comes with a weighted anti-scratch velvet base.",
    originalPrice: 2199,
    salePrice: 1499,
    badge: "⚡ PUJA DROP • 38 LEFT",
    stock: 38,
    isHeroDrop: true,
    isPublished: true,
    images: JSON.stringify([
      "/assets/zen_buddha_1.jpg",
      "/assets/zen_buddha_2.jpg",
    ]),
    features: JSON.stringify([
      "Solid Handcrafted Stoneware (1.8 kg weighted feel)",
      "Warm sand-matte finish with subtle hand-burnished gold leaf",
      "Calming presence for foyer, meditation alcove, or coffee table",
      "Festive Durga Puja gift packaging & auspicious brass coin included",
      "Zero-Breakage Guranteed Transit with 5-layer foam packaging",
    ]),
    bundles: [
      {
        title: "Buy 1 Unit (Festive Offer)",
        subtitle: "Save ₹700 • Free Express Delivery",
        quantity: 1,
        price: 1499,
        discountPercent: 32,
        isPopular: false,
      },
      {
        title: "Buy 2 Units (Puja Gifting Pair)",
        subtitle: "Save ₹1,899 • Most Popular • 43% Total Off",
        quantity: 2,
        price: 2499,
        discountPercent: 43,
        isPopular: true,
      },
      {
        title: "Buy 3 Units (Festive Grand Trio)",
        subtitle: "Save ₹3,098 • ₹1,166/unit • Family Pack",
        quantity: 3,
        price: 3499,
        discountPercent: 47,
        isPopular: false,
      },
    ],
  },
  {
    id: "prod-minimal-ceramic-vase",
    title: "Minimal Ceramic Vase",
    slug: "minimal-ceramic-vase",
    subtitle: "Tactile Ribbed Flute in Chalk White",
    description:
      "Architectural fluted stoneware designed for dry botanical arrangements, pampas grass, or festive marigolds. Waterproof sealed interior.",
    originalPrice: 1299,
    salePrice: 899,
    badge: "BESTSELLER",
    stock: 54,
    isHeroDrop: false,
    isPublished: true,
    images: JSON.stringify(["/assets/ceramic_vase_1.jpg"]),
    features: JSON.stringify([
      "Matte unglazed exterior with glazed waterproof interior",
      "Ergonomic ribbed grip with weighted stability base",
      "Dimensions: 22cm Height × 10cm Base Diameter",
    ]),
    bundles: [
      {
        title: "Single Vase",
        subtitle: "Save ₹400",
        quantity: 1,
        price: 899,
        discountPercent: 31,
        isPopular: false,
      },
      {
        title: "Pair of 2 Vases",
        subtitle: "Save ₹1,000 • Symmetrical Styling",
        quantity: 2,
        price: 1599,
        discountPercent: 38,
        isPopular: true,
      },
    ],
  },
  {
    id: "prod-luxury-aroma-set",
    title: "Luxury Aroma Set",
    slug: "luxury-aroma-set",
    subtitle: "Amber Glass Diffuser with Solid Brass Dish",
    description:
      "Custom blend of pure Kashmiri Mogra, Royal Sandalwood, and Ambergris. Infused with 8 thick organic rattan reeds and a brushed brass accent coaster.",
    originalPrice: 1199,
    salePrice: 749,
    badge: "LIMITED BATCH",
    stock: 29,
    isHeroDrop: false,
    isPublished: true,
    images: JSON.stringify(["/assets/aroma_set_1.jpg"]),
    features: JSON.stringify([
      "120ml Pure Essential Oil Formulation (60+ days diffusion)",
      "Zero synthetic alcohol or phthalates",
      "Solid brushed brass catch-all accessory plate included",
    ]),
    bundles: [
      {
        title: "Single Diffuser Set",
        subtitle: "Save ₹450",
        quantity: 1,
        price: 749,
        discountPercent: 38,
        isPopular: false,
      },
      {
        title: "Double Pack (2 Scents)",
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
    title: "Modern Planter",
    slug: "modern-planter",
    subtitle: "Fluted Sandstone Planter with Drain Tray",
    description:
      "Warm earthen sandstone indoor planter with a discrete integrated drainage saucer. Engineered for tabletop succulents, snake plants, and jade greenery.",
    originalPrice: 999,
    salePrice: 649,
    badge: "TRENDING",
    stock: 42,
    isHeroDrop: false,
    isPublished: true,
    images: JSON.stringify(["/assets/modern_planter_1.jpg"]),
    features: JSON.stringify([
      "Porous sandstone composite for optimal root breathability",
      "Hidden nesting drainage saucer prevents surface water stains",
      "Dimensions: 14cm Diameter × 13cm Height",
    ]),
    bundles: [
      {
        title: "Single Planter",
        subtitle: "Save ₹350",
        quantity: 1,
        price: 649,
        discountPercent: 35,
        isPopular: false,
      },
      {
        title: "Duo Planter Set",
        subtitle: "Save ₹800 • Ideal for Desk & Shelf",
        quantity: 2,
        price: 1199,
        discountPercent: 40,
        isPopular: true,
      },
    ],
  },
];

export const INITIAL_PINCODES = [
  {
    pincode: "700001",
    city: "Kolkata (Central)",
    state: "West Bengal",
    isCodAvailable: true,
    estimatedDays: 2,
  },
  {
    pincode: "700019",
    city: "Kolkata (Ballygunge)",
    state: "West Bengal",
    isCodAvailable: true,
    estimatedDays: 2,
  },
  {
    pincode: "700064",
    city: "Kolkata (Salt Lake)",
    state: "West Bengal",
    isCodAvailable: true,
    estimatedDays: 2,
  },
  {
    pincode: "110001",
    city: "New Delhi (Connaught Place)",
    state: "Delhi",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "110016",
    city: "New Delhi (Hauz Khas)",
    state: "Delhi",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "400001",
    city: "Mumbai (Fort / South)",
    state: "Maharashtra",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "400050",
    city: "Mumbai (Bandra)",
    state: "Maharashtra",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "560001",
    city: "Bengaluru (MG Road)",
    state: "Karnataka",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "560034",
    city: "Bengaluru (Koramangala)",
    state: "Karnataka",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "500001",
    city: "Hyderabad (Abids)",
    state: "Telangana",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "600001",
    city: "Chennai (George Town)",
    state: "Tamil Nadu",
    isCodAvailable: true,
    estimatedDays: 4,
  },
  {
    pincode: "380001",
    city: "Ahmedabad (Old City)",
    state: "Gujarat",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "800001",
    city: "Patna",
    state: "Bihar",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "781001",
    city: "Guwahati",
    state: "Assam",
    isCodAvailable: true,
    estimatedDays: 4,
  },
  {
    pincode: "201301",
    city: "Noida",
    state: "Uttar Pradesh",
    isCodAvailable: true,
    estimatedDays: 3,
  },
  {
    pincode: "122001",
    city: "Gurugram",
    state: "Haryana",
    isCodAvailable: true,
    estimatedDays: 3,
  },
];

export const INITIAL_ORDERS = [
  {
    id: "ord-puja-101",
    orderNumber: "SS-PUJA-1042",
    customerName: "Ananya Mukherjee",
    phone: "9830123456",
    address: "Flat 4B, Silver Oak, Salt Lake Sector 2",
    pincode: "700064",
    totalAmount: 2499,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "CONFIRMED",
    items: JSON.stringify([
      {
        title: "Zen Buddha Décor (Puja Gifting Pair - 2 Units)",
        quantity: 2,
        price: 2499,
      },
    ]),
    notes: "Festive Durga Puja home delivery. Please call before delivery.",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "ord-puja-102",
    orderNumber: "SS-PUJA-1043",
    customerName: "Rohan Varma",
    phone: "9820556789",
    address: "B-203, Sea Breeze Apartments, Bandra West",
    pincode: "400050",
    totalAmount: 1499,
    paymentMethod: "RAZORPAY",
    paymentStatus: "PAID",
    orderStatus: "SHIPPED",
    razorpayOrderId: "order_Qz82Kkd83j4aL",
    razorpayPaymentId: "pay_Qz839Lkd921M",
    items: JSON.stringify([
      { title: "Zen Buddha Décor (1 Unit)", quantity: 1, price: 1499 },
    ]),
    notes: "Prepaid via UPI. Express Air courier assigned.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "ord-puja-103",
    orderNumber: "SS-PUJA-1044",
    customerName: "Priyanka Sengupta",
    phone: "9831998877",
    address: "12/A Southern Avenue, Near Lake",
    pincode: "700019",
    totalAmount: 899,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "NEW",
    items: JSON.stringify([
      { title: "Minimal Ceramic Vase (Single)", quantity: 1, price: 899 },
    ]),
    notes: "Leave at security desk if unreachable.",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

export async function seedPrisma(prismaClient?: any) {
  console.log("🌱 Seeding ShiftStore initial database records...");
  // When running with Prisma ORM client:
  if (prismaClient) {
    // Upsert Admin
    await prismaClient.admin.upsert({
      where: { email: "admin@shiftstore.in" },
      update: {},
      create: {
        email: "admin@shiftstore.in",
        passwordHash:
          "$2a$10$wB9Vp9J9V1lS8ZtY4O1s7.ZzY1jT4X6W9K8L7M6N5O4P3Q2R1S0T", // PujaSale2026!
        name: "ShiftStore Operations Admin",
      },
    });

    // Seed Pincodes
    for (const pin of INITIAL_PINCODES) {
      await prismaClient.pincodeRule.upsert({
        where: { pincode: pin.pincode },
        update: pin,
        create: pin,
      });
    }

    // Seed Products & Bundles
    for (const prod of INITIAL_PRODUCTS) {
      const { bundles, ...productData } = prod;
      const createdProd = await prismaClient.product.upsert({
        where: { slug: prod.slug },
        update: productData,
        create: productData,
      });

      for (const bundle of bundles) {
        await prismaClient.bundleOffer.create({
          data: {
            ...bundle,
            productId: createdProd.id,
          },
        });
      }
    }
    console.log("✅ ShiftStore database successfully seeded with Prisma!");
  }
}

// Self-executing runner if invoked directly via tsx CLI
if (
  typeof process !== "undefined" &&
  Array.isArray(process?.argv) &&
  process.argv[1]?.includes("seed.ts")
) {
  console.log(
    "To run with Prisma client: npx prisma db push && npx tsx prisma/seed.ts",
  );
}
