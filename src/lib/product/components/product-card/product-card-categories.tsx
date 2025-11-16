// components/ProductCard/components/ProductCardCategories.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed

type CategoryPlacement = 'on-image' | 'below-image' | 'hidden';

interface ProductCardCategoriesProps {
  product: Product;
  placement?: CategoryPlacement;
  maxCategories?: number;
  categoryClassName?: string;
  wrapperClassName?: string;
}

export const ProductCardCategories: React.FC<ProductCardCategoriesProps> = ({
  product,
  placement = 'below-image',
  maxCategories = 2,
  categoryClassName = 'product-card__category',
  wrapperClassName = 'product-card__categories',
}) => {
  if (!product.categories || product.categories.length === 0 || placement === 'hidden') {
    return null;
  }

  const categoriesToDisplay = product.categories.slice(0, maxCategories);

  return (
    <div className={`${wrapperClassName} product-card__categories--${placement}`}>
      {categoriesToDisplay.map(category => (
        <span key={category.id} className={categoryClassName}>
          {category.name}
        </span>
      ))}
      {product.categories.length > maxCategories && (
        <span className={`${categoryClassName} product-card__category--more`}>
          +{product.categories.length - maxCategories} more
        </span>
      )}
    </div>
  );
};