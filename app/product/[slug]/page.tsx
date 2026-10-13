/**
 * ShiftStore Next.js 14 Product Details Page (Server Component)
 * File: app/product/[slug]/page.tsx
 */

import React from "react";
import { notFound } from "next/navigation";
import { INITIAL_PRODUCTS_DATA, ProductItem } from "../../../src/data/store.ts";
import { ProductClientView } from "../../../components/ProductClientView";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = params;
  const product = INITIAL_PRODUCTS_DATA.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | ShiftStore India",
    };
  }

  return {
    title: `${product.title} | ShiftStore India`,
    description: product.hook || product.subtitle,
    openGraph: {
      title: `${product.title} | ShiftStore India`,
      description: product.description,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = params;

  // In production with Prisma ORM:
  // const product = await prisma.product.findUnique({
  //   where: { slug },
  //   include: { bundleOffers: true }
  // });
  const product = INITIAL_PRODUCTS_DATA.find((p) => p.slug === slug);

  if (!product) {
    notFound();
    return null;
  }

  // Fetch related products (excluding current item)
  const relatedProducts = INITIAL_PRODUCTS_DATA.filter(
    (p) => p.id !== product.id,
  );

  return (
    <ProductClientView product={product} relatedProducts={relatedProducts} />
  );
}
