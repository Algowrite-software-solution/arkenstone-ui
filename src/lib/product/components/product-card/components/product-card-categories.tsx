// components/ProductCard/components/ProductCardCategories.tsx
import React from 'react';
import { Product } from '../../../types'; // Adjust path as needed


interface ProductCardCategoriesProps {
  product: Product;
  maxCategories?: number;
  categoryClassName?: string;
  wrapperClassName?: string;
  showRemainingCount?: boolean;
  remainingCountClassName?: string;
}

export const ProductCardCategories: React.FC<ProductCardCategoriesProps> = ({
  product,
  maxCategories = 1,
  categoryClassName = 'bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm hover:bg-white transition-colors',
  wrapperClassName = 'flex flex-wrap gap-2',
  showRemainingCount = true,
  remainingCountClassName = 'bg-gray-800/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm',
}) => {
  if (!product.categories || product.categories.length === 0 ) {
    return null;
  }

  const categoriesToDisplay = product.categories.slice(0, maxCategories);
  const remainingCount = product.categories.length - maxCategories;

  return (
    <div className={wrapperClassName}>
          <div className="flex flex-wrap gap-2">
            {categoriesToDisplay.map((category) => (
              <span
                key={category.id}
                className={`inline-block ${categoryClassName}`}
              >
                {category.name}
              </span>
            ))}
            
            {showRemainingCount && remainingCount > 0 && (
              <span
                className={`inline-block ${remainingCountClassName}`}
              >
                +{remainingCount}
              </span>
            )}
          </div>
        </div>
  );
};