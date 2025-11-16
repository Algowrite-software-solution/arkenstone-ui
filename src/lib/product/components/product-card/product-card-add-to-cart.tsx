// components/ProductCard/components/ProductCardAddToCart.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed
import { ShoppingCart } from 'lucide-react';

interface ProductCardAddToCartProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  buttonText?: string;
  buttonClassName?: string;
  iconOnly?: boolean; // If true, shows a cart icon instead of text
  iconComponent?: React.ReactNode; // Custom icon component
}

export const ProductCardAddToCart: React.FC<ProductCardAddToCartProps> = ({
  product,
  onAddToCart,
  buttonText = 'Add to Cart',
  buttonClassName = 'product-card__button product-card__button--primary',
  iconOnly = false,
  iconComponent = <ShoppingCart size={24} />
}) => {
  const isDisabled = !product.quantity || product.quantity === 0;

  return (
    <button
      className={buttonClassName}
      onClick={() => onAddToCart?.(product)}
      disabled={isDisabled}
      aria-label={iconOnly ? buttonText : undefined}
    >
      {iconOnly ? iconComponent : buttonText}
    </button>
  );
};