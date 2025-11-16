// components/ProductCard/components/ProductCardStock.tsx
import React from 'react';
import { Product } from '../../../types';

interface ProductCardStockProps {
  product: Product;
  wrapperClassName?: string;
  stockClassName?: string; // Add this line
  showQuantity?: boolean;
  stockAvailableClassName?: string;
  stockUnavailableClassName?: string;
  lowStockClassName?: string;
  lowStockThreshold?: number;
  inStockClassName?: string; // Add this line (alternative name)
  outOfStockClassName?: string; // Add this line (alternative name)
  stockTextAvailable?: string;
  stockTextUnavailable?: string;
  stockTextLowStock?: string;
}

export const ProductCardStock: React.FC<ProductCardStockProps> = ({
  product,
  wrapperClassName = 'product-card__stock-wrapper',
  stockClassName = 'product-card__stock', // Add this line
  showQuantity = true,
  stockAvailableClassName = 'product-card__stock--available',
  stockUnavailableClassName = 'product-card__stock--unavailable',
  lowStockClassName = 'product-card__stock--low',
  inStockClassName, // Add this line
  outOfStockClassName, // Add this line
  lowStockThreshold = 10,
  stockTextAvailable = 'In Stock',
  stockTextUnavailable = 'Out of Stock',
  stockTextLowStock = 'Low Stock',
}) => {
  const isInStock = (product.quantity ?? 0) > 0;
  const isLowStock = (product.quantity ?? 0) > 0 && (product.quantity ?? 0) <= lowStockThreshold;

  // Use inStock/outOfStock class names if provided, otherwise fall back to available/unavailable
  const availableClass = inStockClassName || stockAvailableClassName;
  const unavailableClass = outOfStockClassName || stockUnavailableClassName;

  const getStockClassName = () => {
    if (!isInStock) return unavailableClass;
    if (isLowStock) return lowStockClassName;
    return availableClass;
  };

  const getStockText = () => {
    if (!isInStock) return stockTextUnavailable;
    if (isLowStock) return stockTextLowStock;
    return stockTextAvailable;
  };

  return (
    <div className={wrapperClassName}>
      <span className={`${stockClassName} ${getStockClassName()}`}>
        {getStockText()}
        {showQuantity && isInStock && ` (${product.quantity} available)`}
      </span>
    </div>
  );
};