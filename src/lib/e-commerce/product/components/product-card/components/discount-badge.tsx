import React from "react";
import resolveCurrencySymbol from "../../../../../util/currency-code";

export type DiscountType = "percentage" | "fixed" | null;

export interface DiscountBadgeProps {
  /** Example: 25 will render "25% OFF" */
  discount?: number;
  discountType?: DiscountType;
  /** ISO code or symbol (e.g. "USD" or "$") */
  currency?: string;
  fractionDigits?: number;

  renderLabel?: (value: number, type: DiscountType) => React.ReactNode;

  className?: string;
}

export function DiscountBadge({
  discount = 25,
  discountType = "fixed",
  currency = "$",
  fractionDigits = 2,
  renderLabel,
  className = "bg-black text-white inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md",
}: DiscountBadgeProps) {
  if (!isFinite(Number(discount)) || discount <= 0) return null;

  const formatCurrency = (v: number) => {
    const code = resolveCurrencySymbol(currency);
    return new Intl.NumberFormat(undefined, { style: "currency", currency: code, maximumFractionDigits: fractionDigits }).format(v);
  };

  const defaultLabel = () => {
    if (discountType === "fixed") return `${formatCurrency(discount)} OFF`;
    return `${discount}% OFF`;
  };

  const label = renderLabel ? renderLabel(discount, discountType) : defaultLabel();

  return (
    <span
      className={` ${className}`.trim()}
      role="status"
      aria-label={typeof label === "string" ? label : "discount"}
    >
      {label}
    </span>
  );
}
