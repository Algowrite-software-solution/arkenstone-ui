// components/ProductCard/ProductCard.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed
import {
  CommonProductCardLayoutProps,
  DefaultProductCardLayout,
  ImageHeavyProductCardLayout,
  // Add other layouts here as you create them
} from './product-card-layouts';

// Define layout types for easy selection
export type ProductCardLayoutType =
  | 'default'
  | 'imageHeavy'
  | 'custom'; // 'custom' implies you pass a custom render function

interface ProductCardProps extends CommonProductCardLayoutProps {
  layout?: ProductCardLayoutType;
  // If 'custom' layout is chosen, provide a render function
  customLayoutRender?: React.FC<CommonProductCardLayoutProps>;
  wrapperClassName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  layout = 'default',
  customLayoutRender,
  wrapperClassName = 'product-card',
  ...rest
}) => {
  const LayoutComponent = React.useMemo(() => {
    switch (layout) {
      case 'default':
        return DefaultProductCardLayout;
      case 'imageHeavy':
        return ImageHeavyProductCardLayout;
      case 'custom':
        if (!customLayoutRender) {
          console.warn("ProductCard: 'custom' layout selected but no 'customLayoutRender' provided. Falling back to 'default'.");
          return DefaultProductCardLayout;
        }
        return customLayoutRender;
      default:
        console.warn(`ProductCard: Unknown layout type "${layout}". Falling back to 'default'.`);
        return DefaultProductCardLayout;
    }
  }, [layout, customLayoutRender]);

  return (
    <div className={wrapperClassName}>
      <LayoutComponent {...rest} />
    </div>
  );
};