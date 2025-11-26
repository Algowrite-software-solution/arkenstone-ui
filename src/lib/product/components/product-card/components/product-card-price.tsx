// components/ProductCard/components/ProductCardPrice.tsx
import React from 'react';
import { Product } from '../../../types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardPriceProps {
  product: Product;
  wrapperClassName?: string;
  priceClassName?: string;
  originalPriceClassName?: string;
  discountClassName?: string;
  showOriginalPrice?: boolean;
  showDiscountPercentage?: boolean;
  pricePrefix?: string;
  priceSuffix?: string;
  showAddToCart?: boolean;
  showAddToCartIcon?: boolean;
  onAddToCart?: (product: Product) => void;
  addToCartButtonClassName?: string;
  addToCartButtonText?: string;
}

export const ProductCardPrice: React.FC<ProductCardPriceProps> = ({
  product,
  wrapperClassName = 'flex items-center gap-2 flex-wrap justify-between',
  priceClassName = 'text-xl font-bold text-gray-900',
  originalPriceClassName = 'text-sm text-gray-500 line-through',
  discountClassName = 'text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded',
  showOriginalPrice = true,
  showDiscountPercentage = true,
  pricePrefix = '$',
  priceSuffix = '',
  showAddToCart = false,
  showAddToCartIcon = true,
  onAddToCart,
  addToCartButtonClassName = 'bg-black hover:bg-gray-800 text-white font-medium py-1.5 px-3 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1',
  addToCartButtonText = 'Add to Cart',
}) => {
  const hasDiscount = product.discount_type && product.discount_value;
  const discountPercentage = product.discount_type === 'percentage'
    ? (product.discount_value ?? 0)
    : (product.price && product.final_price && product.price > 0)
      ? Math.round(((product.price - product.final_price) / product.price) * 100)
      : 0;

  // Safety check for final_price
  const finalPrice = product.final_price ?? product.price ?? 0;
  const originalPrice = product.price ?? 0;
  const isDisabled = !product.quantity || product.quantity === 0;

  const handleAddToCart = () => {
    if (!isDisabled && onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className={wrapperClassName}>
      {/* Price Section */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={priceClassName}>
          {pricePrefix}{finalPrice.toFixed(2)}{priceSuffix}
        </span>
        
        {hasDiscount && showOriginalPrice && originalPrice !== finalPrice && originalPrice > 0 && (
          <span className={originalPriceClassName}>
            {pricePrefix}{originalPrice.toFixed(2)}{priceSuffix}
          </span>
        )}
        
        {hasDiscount && showDiscountPercentage && discountPercentage > 0 && (
          <span className={discountClassName}>
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      {(showAddToCart || showAddToCartIcon) && (
        <button
          className={addToCartButtonClassName}
          onClick={handleAddToCart}
          disabled={isDisabled}
          aria-label={showAddToCartIcon ? 'Add to cart' : undefined}
        >
          {showAddToCartIcon ? (
            <ShoppingCart size={20} />
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>{addToCartButtonText}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};