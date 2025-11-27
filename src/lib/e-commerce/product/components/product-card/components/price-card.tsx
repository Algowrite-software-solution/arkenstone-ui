import React from "react";

export interface PriceCardProps {
  price: number | null;           // original/base price
  salePrice: number | null;      // discounted or actual price
  discountType?: string | null;   // "percentage" | "fixed" | null
  discountValue?: number | null;  // value of discount

  /** Visibility */
  showOriginalPrice?: boolean;
  showDiscountPercentage?: boolean;

  /** Currency options */
  currency?: string;
  fractionDigits?: number;

  /** Styles */
  className?: {
    wrapper?: string;
    price?: string;
    originalPrice?: string;
    discount?: string;
  }
 
}

const resolveCurrencyCode = (currency?: string) => currency || "USD";

export const PriceCard: React.FC<PriceCardProps> = ({
  price = null,
  salePrice = null,
  discountType = null,
  discountValue = null,

  showOriginalPrice = true,
  showDiscountPercentage = true,

  currency = "USD",
  fractionDigits = 2,

  className = {
    wrapper : "flex items-center gap-2 flex-wrap",
    price  : "text-lg font-semibold",
    originalPrice : "line-through text-gray-500",
    discount : "text-red-600 font-semibold",
  }
}) => {
  const original = typeof price === "number" ? price : null;
  const finalP = typeof salePrice === "number" ? salePrice : original;

  /** Detect if discount actually exists */
  const hasDiscount = 
    original !== null && 
    finalP !== null &&
    original > finalP;

  /** Compute discount percentage from backend */
  let discountPercent = 0;

  if (discountType === "percentage" && discountValue) {
    discountPercent = discountValue;
  } 
  else if (discountType === "fixed" && discountValue && original) {
    discountPercent = Math.round((discountValue / original) * 100);
  } 
  else if (hasDiscount && original) {
    // fallback: auto compute
    discountPercent = Math.round(((original - finalP!) / original) * 100);
  }

  const formatCurrency = (v: number) => {
    const code = resolveCurrencyCode(currency);
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: fractionDigits,
    }).format(v);
  };

  return (
    <div className={className.wrapper}>
      
      {/* Final Price */}
      <span className={className.price}>
        {finalP !== null ? formatCurrency(finalP) : "---"}
      </span>

      {/* Original Price (strikethrough) */}
      {showOriginalPrice &&
        hasDiscount &&
        original !== null && (
          <span className={className.originalPrice}>
            {formatCurrency(original)}
          </span>
        )}

      {/* Discount % */}
      {showDiscountPercentage &&
        hasDiscount &&
        discountPercent > 0 && (
          <span className={className.discount}>
            {discountPercent}% OFF
          </span>
        )}

    </div>
  );
};
