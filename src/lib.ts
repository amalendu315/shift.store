export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  compare_price: number;
  stock: number;
  image: string;
  published: boolean;
  featured: boolean;
}
export interface Settings {
  name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  shippingFee: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  paymentProvider: string;
  shippingPolicy: string;
  returnPolicy: string;
}
export interface Order {
  id: string;
  number: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  tracking: string;
  created_at: string;
}
export interface StoreData {
  settings: Settings;
  products: Product[];
  paymentMethods: {
    id: string;
    label: string;
    mode?: "sandbox" | "production";
  }[];
}
export const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: paise % 100 ? 2 : 0,
  }).format(paise / 100);
export async function api<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch("/api" + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body = await response.json();
  if (!response.ok) {
    const e: any = new Error(body.error || "Request failed.");
    e.status = response.status;
    throw e;
  }
  return body;
}
export const write = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});
export function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}
