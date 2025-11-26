// components/ProductCard/components/ProductCardAddToCart.tsx
import React from 'react';
import { Product } from '../../../types'; // Adjust path as needed
import { ShoppingCart } from 'lucide-react';

interface ProductCardAddToCartProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  buttonText?: string;
  buttonClassName?: string;
  iconOnly?: boolean; // If true, shows a cart icon instead of text
  iconComponent?: React.ReactNode; // Custom icon component
  showIconWithText?: boolean; // If true, shows both icon and text
}

export const ProductCardAddToCart: React.FC<ProductCardAddToCartProps> = ({
  product,
  onAddToCart,
  buttonText = 'Add to Cart',
  buttonClassName = 'flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2',
  iconOnly = false,
  iconComponent = <ShoppingCart size={20} />,
  showIconWithText = true,
}) => {
  const isDisabled = !product.quantity || product.quantity === 0;

  const handleClick = () => {
    if (!isDisabled && onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <button
      className={buttonClassName}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={iconOnly ? buttonText : undefined}
      title={isDisabled ? 'Out of stock' : buttonText}
    >
      {iconOnly ? (
        iconComponent
      ) : showIconWithText ? (
        <>
          {iconComponent}
          <span>{buttonText}</span>
        </>
      ) : (
        <span>{buttonText}</span>
      )}
    </button>
  );
};