// components/ProductCard/components/ProductCardBrandTitle.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed

interface ProductCardBrandTitleProps {
  product: Product;
  showBrand?: boolean;
  showTitle?: boolean;
  brandPlacement?: 'before' | 'after' | 'hidden'; // Controls brand display relative to title
  brandClassName?: string;
  titleClassName?: string;
  wrapperClassName?: string;
}

export const ProductCardBrandTitle: React.FC<ProductCardBrandTitleProps> = ({
  product,
  showBrand = true,
  showTitle = true,
  brandPlacement = 'before',
  brandClassName = 'product-card__brand',
  titleClassName = 'product-card__title',
  wrapperClassName = 'product-card__brand-title-wrapper',
}) => {
  const BrandComponent = showBrand && product.brand ? (
    <div className={brandClassName}>{product.brand.name}</div>
  ) : null;

  const TitleComponent = showTitle ? (
    <p className={titleClassName}>{product.name}</p>
  ) : null;

  return (
    <div className={wrapperClassName}>
      {brandPlacement === 'before' && BrandComponent}
      {TitleComponent}
      {brandPlacement === 'after' && BrandComponent}
    </div>
  );
};