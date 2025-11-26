// components/ProductCard/components/ProductCardBrandTitle.tsx
import React from 'react';
import { Product } from '../../../types'; // Adjust path as needed

interface ProductCardBrandTitleProps {
  product: Product;
  showBrand?: boolean;
  showTitle?: boolean;
  brandPlacement?: 'before' | 'after' | 'hidden' | 'top' | 'bottom'; // Controls brand display relative to title
  brandClassName?: string;
  titleClassName?: string;
  wrapperClassName?: string;
  separatorClassName?: string;
  showPrice?: boolean;
  priceClassName?: string;
  pricePrefix?: string;
  priceSuffix?: string;
}

export const ProductCardBrandTitle: React.FC<ProductCardBrandTitleProps> = ({
  product,
  showBrand = true,
  showTitle = true,
  brandPlacement = 'top',
  brandClassName = 'text-base text-black tracking-wide',
  titleClassName = 'text-base text-black font-semibold line-clamp-2',
  wrapperClassName = 'space-y-1',
  separatorClassName = 'text-black mx-1 font-bold',
  showPrice = false,
  priceClassName = 'text-lg font-bold text-black whitespace-nowrap',
  pricePrefix = '$',
  priceSuffix = '',
}) => {
  const BrandComponent = showBrand && product.brand && brandPlacement !== 'hidden' ? (
    <span className={brandClassName}>{product.brand.name}</span>
  ) : null;

  const TitleComponent = showTitle ? (
    <span className={titleClassName}>{product.name}</span>
  ) : null;

  // Fix: Add null safety for final_price
  const finalPrice = product.final_price ?? product.price ?? 0;

  const PriceComponent = showPrice ? (
    <div className={priceClassName}>
      {pricePrefix}{finalPrice.toFixed(2)}{priceSuffix}
    </div>
  ) : null;

  // Render content based on brandPlacement
  const renderBrandTitleContent = () => {
    // Before/After: Single line with dash separator (brand - title OR title - brand)
    if (brandPlacement === 'before') {
      return (
        <div className="flex items-center flex-wrap">
          {BrandComponent}
          {BrandComponent && TitleComponent && <span className={separatorClassName}>-</span>}
          {TitleComponent}
        </div>
      );
    }

    if (brandPlacement === 'after') {
      return (
        <div className="flex items-center flex-wrap">
          {TitleComponent}
          {BrandComponent && TitleComponent && <span className={separatorClassName}>-</span>}
          {BrandComponent}
        </div>
      );
    }

    // Top: Brand on top, title below (two rows)
    if (brandPlacement === 'top') {
      return (
        <div className={wrapperClassName}>
          {BrandComponent}
          {TitleComponent}
        </div>
      );
    }

    // Bottom: Title on top, brand below (two rows)
    if (brandPlacement === 'bottom') {
      return (
        <div className={wrapperClassName}>
          {TitleComponent}
          {BrandComponent}
        </div>
      );
    }

    // Hidden brand - only show title
    return (
      <div className={wrapperClassName}>
        {TitleComponent}
      </div>
    );
  };

  // If showPrice is true, create flex layout with 3/4 for content and 1/4 for price
  if (showPrice) {
    return (
      <div className="flex gap-3 items-start">
        <div className="flex-[3]">
          {renderBrandTitleContent()}
        </div>
        <div className="flex-[1] flex justify-end items-start">
          {PriceComponent}
        </div>
      </div>
    );
  }

  // If showPrice is false, render only the brand/title content
  return renderBrandTitleContent();
};