"use client";

import React, { useState } from "react";
import { ShoppingBag, Check, Heart, Sparkles } from "lucide-react";

export interface ProductCardProps {
  id: string;
  title: string;
  slug?: string;
  price: number; // Discounted Price
  originalPrice: number; // Strikethrough Original Price
  image: string;
  category?: string;
  badge?: string;
  inStock?: boolean;
  rating?: number;
  onAddToCart?: (product: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    image: string;
  }) => void;
  onQuickBuy?: (product: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    image: string;
  }) => void;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  slug,
  price,
  originalPrice,
  image,
  category,
  badge,
  inStock = true,
  rating,
  onAddToCart,
  onQuickBuy,
  onClick,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart({ id, title, price, originalPrice, image });
    }
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (slug && typeof window !== "undefined") {
      window.location.href = `/product/${slug}`;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-[#ffffff] rounded-lg border border-[#e8e1d7] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* 1:1 Aspect Ratio Image Container */}
      <div className="relative w-full aspect-square bg-[#f5f1eb] overflow-hidden flex items-center justify-center">
        {!imgError ? (
          <img
            src={image}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-linear-to-br from-[#f8f5ee] to-[#ebe4d6] text-[#3d281a]/60">
            <Sparkles className="w-8 h-8 text-[#a87c4f] mb-2 opacity-70" />
            <span className="text-xs font-serif font-medium">{title}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {badge && (
            <span className="px-2 py-0.5 bg-[#3d281a] text-[#fcfcf7] text-[10px] font-semibold tracking-wider uppercase rounded-xs shadow-xs">
              {badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-[#a87c4f] text-[#ffffff] text-[10px] font-bold tracking-wider uppercase rounded-xs shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Wishlist Icon Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-[#3d281a] hover:bg-white hover:text-red-600 transition-colors shadow-xs z-10"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-[#3d281a]"
            }`}
          />
        </button>

        {!inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center z-10">
            <span className="px-3 py-1 bg-[#3d281a] text-white text-xs font-bold uppercase tracking-wider rounded-xs">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {category && (
            <span className="text-[10px] uppercase tracking-wider text-[#a87c4f] font-semibold block mb-1">
              {category}
            </span>
          )}
          {/* Truncated Title */}
          <h3
            className="text-sm font-medium text-[#3d281a] truncate group-hover:text-[#a87c4f] transition-colors"
            title={title}
          >
            {title}
          </h3>
        </div>

        {/* Pricing Layout */}
        <div className="mt-2.5 mb-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-[#a87c4f] tabular-nums">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice > price && (
            <span className="text-xs text-[#9c948b] line-through tabular-nums">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* Full-width Solid Dark Brown Button at the Absolute Bottom */}
      <button
        type="button"
        disabled={!inStock}
        onClick={handleAddToCart}
        className={`w-full py-2.5 px-4 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors duration-200 mt-auto select-none ${
          !inStock
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : isAdded
              ? "bg-emerald-700 text-white"
              : "bg-[#3d281a] text-[#fcfcf7] hover:bg-[#a87c4f] active:bg-[#2c1c11]"
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Added to Cart</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
          </>
        )}
      </button>
    </div>
  );
};
export default ProductCard;
