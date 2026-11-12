import type { Product } from "./lib";
const examples = [
  ["Floral Ceramic Vase Pair", "Home Décor", 799, 1299, "vases"],
  ["Minimal White Reading Lamp", "Lighting", 1299, 1899, "lamp"],
  ["Haworthia in a Mint Ceramic Pot", "Garden & Outdoors", 449, 699, "plants"],
  ["Botanical Still Life Art Print", "Home Décor", 999, 1499, "art"],
  ["Amber Glass Dropper Bottle", "Everyday Essentials", 299, 449, "aroma"],
  ["Celebration Doughnut Gift Box", "Gifts & Seasonal", 599, 799, "festive"],
  ["Natural Rattan Accent Chair", "Home & Living", 4999, 6499, "interior"],
  ["Mustard Cushion Cover Pair", "Home & Living", 649, 999, "living"],
];
export const demoProducts: Product[] = examples.map(
  ([name, category, price, compare, image], index) => ({
    id: "demo-" + index,
    name: String(name),
    slug: String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"),
    category: String(category),
    price: Number(price) * 100,
    compare_price: Number(compare) * 100,
    description:
      "Demonstration product for previewing the shopping experience. Images, specifications and prices are illustrative. This item is not in the real catalog and cannot be ordered.",
    stock: 20,
    image: "/images/" + image + ".jpg",
    published: true,
    featured: index < 5,
  }),
);
export const categoryImages: Record<string, string> = {
  "Home Décor": "vases",
  Lighting: "lamp",
  "Garden & Outdoors": "plants",
  "Gifts & Seasonal": "festive",
  "Everyday Essentials": "aroma",
  "Home & Living": "interior",
};
