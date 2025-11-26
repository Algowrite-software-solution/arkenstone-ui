// components/ProductCard/ProductCard.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed
import {
  CommonProductCardLayoutProps,
  DefaultProductCardLayout,
  ImageHeavyProductCardLayout,
  // Add other layouts here as you create them
} from './layouts/product-card-layouts';

// Define layout types for easy selection
export type ProductCardLayoutType =
  | 'default'
  | 'imageHeavy';

interface ProductCardProps extends CommonProductCardLayoutProps {
  layout?: ProductCardLayoutType;
  wrapperClassName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  layout = 'default',
  wrapperClassName = 'product-card',
  ...rest
}) => {
  const LayoutComponent = React.useMemo(() => {
    switch (layout) {
      case 'default':
        return DefaultProductCardLayout;
      case 'imageHeavy':
        return ImageHeavyProductCardLayout;

      default:
        console.warn(`ProductCard: Unknown layout type "${layout}". Falling back to 'default'.`);
        return DefaultProductCardLayout;
    }
  }, [layout]);

  return (
    <div className={wrapperClassName}>
      <LayoutComponent {...rest} />
    </div>
  );
};