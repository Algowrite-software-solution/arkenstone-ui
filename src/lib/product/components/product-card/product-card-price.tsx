// components/ProductCard/components/ProductCardPrice.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed

interface ProductCardPriceProps {
  product: Product;
  showOriginalPrice?: boolean;
  priceClassName?: string;
  originalPriceClassName?: string;
  finalPriceClassName?: string;
  wrapperClassName?: string;
}

export const ProductCardPrice: React.FC<ProductCardPriceProps> = ({
  product,
  showOriginalPrice = true,
  priceClassName = 'product-card__price',
  originalPriceClassName = 'product-card__price--original',
  finalPriceClassName = 'product-card__price--final',
  wrapperClassName = 'product-card__pricing',
}) => {
  const hasDiscount = product.discount_type && product.discount_value;

  if (!product.price) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      {hasDiscount && product.final_price ? (
        <>
          {showOriginalPrice && (
            <span className={originalPriceClassName}>
              ${product.price.toFixed(2)}
            </span>
          )}
          <span className={finalPriceClassName}>
            ${product.final_price.toFixed(2)}
          </span>
        </>
      ) : (
        <span className={priceClassName}>
          ${product.price.toFixed(2)}
        </span>
      )}
    </div>
  );
};