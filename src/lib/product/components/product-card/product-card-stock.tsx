// components/ProductCard/components/ProductCardStock.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed

interface ProductCardStockProps {
  product: Product;
  showQuantity?: boolean;
  stockAvailableClassName?: string;
  stockUnavailableClassName?: string;
  wrapperClassName?: string;
}

export const ProductCardStock: React.FC<ProductCardStockProps> = ({
  product,
  showQuantity = true,
  stockAvailableClassName = 'product-card__stock--available',
  stockUnavailableClassName = 'product-card__stock--unavailable',
  wrapperClassName = 'product-card__stock',
}) => {
  if (product.quantity === null || !showQuantity) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      {product.quantity > 0 ? (
        <span className={stockAvailableClassName}>
          {product.quantity} in stock
        </span>
      ) : (
        <span className={stockUnavailableClassName}>
          Out of stock
        </span>
      )}
    </div>
  );
};