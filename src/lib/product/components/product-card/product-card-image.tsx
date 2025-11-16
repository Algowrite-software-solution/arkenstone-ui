// components/ProductCard/components/ProductCardImage.tsx
import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../../types'; // Adjust path as needed

interface ProductCardImageProps {
  product: Product;
  showDiscountBadge?: boolean;
  imageClassName?: string;
  placeholderText?: string;
  badgeClassName?: string;
  imageWrapperClassName?: string;
  showWishlistButton?: boolean;
  wishlistClassName?: string;
}

export const ProductCardImage: React.FC<ProductCardImageProps> = ({
  product,
  showDiscountBadge = false,
  imageClassName = 'product-card__image',
  placeholderText = 'No Image',
  badgeClassName = 'product-card__badge',
  imageWrapperClassName = 'product-card__image-container',
  showWishlistButton = true,
  wishlistClassName = 'product-card__wishlist-button',
}) => {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const hasDiscount = product.discount_type && product.discount_value;
  const discountPercentage = product.discount_type === 'percentage'
    ? (product.discount_value ?? 0)
    : (product.price && product.final_price && product.price > 0)
      ? Math.round(((product.price - product.final_price) / product.price) * 100)
      : 0;

  return (
    <div className={imageWrapperClassName}>
      {showDiscountBadge && hasDiscount && discountPercentage > 0 && (
        <span className={badgeClassName}>
          {discountPercentage}% OFF
        </span>
      )}
      {showWishlistButton && (
        <button aria-label="Add to wishlist">
          <Heart size={24} className={wishlistClassName}/>
        </button>
      )}
      {primaryImage ? (
        <img
          src={primaryImage.url}
          alt={primaryImage.alt_text ?? product.name}
          className={imageClassName}
        />
      ) : (
        <div className="product-card__image-placeholder">
          {placeholderText}
        </div>
      )}
    </div>
  );
};