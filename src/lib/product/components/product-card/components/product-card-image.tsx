// components/ProductCard/components/ProductCardImage.tsx
import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../../../types'; // Adjust path as needed

interface ProductCardImageProps {
  product: Product;
  imageClassName?: string;
  imagePlaceholderText?: string;
  showDiscountBadge?: boolean;
  discountBadgeClassName?: string;
  showWishlistButton?: boolean;
  wishlistClassName?: string;
  showCategoriesButton?: boolean;
  categoriesClassName?: string;
  categoryPosition?: string;
  maxCategories?: number;
  showRemainingCategoriesCount?: boolean;
  remainingCategoriesCountClassName?: string;
}

export const ProductCardImage: React.FC<ProductCardImageProps> = ({
  product,
  imageClassName = 'w-full h-full object-cover',
  imagePlaceholderText = 'No Image',
  showDiscountBadge = true,
  discountBadgeClassName = 'top-3 right-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-sm shadow-md',
  showWishlistButton = false,
  wishlistClassName = 'top-3 right-3 group bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors',
  showCategoriesButton = true,
  categoriesClassName = 'bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm hover:bg-white transition-colors',
  categoryPosition = 'bottom-3 left-3',
  maxCategories = 1,
  showRemainingCategoriesCount = true,
  remainingCategoriesCountClassName = 'bg-gray-800/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm',
}) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const hasDiscount = product.discount_type && product.discount_value;
  const discountPercentage = product.discount_type === 'percentage'
    ? (product.discount_value ?? 0)
    : (product.price && product.final_price && product.price > 0)
      ? Math.round(((product.price - product.final_price) / product.price) * 100)
      : 0;

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
  };

  const hasCategories = product.categories && product.categories.length > 0;
  const categoriesToShow = product.categories?.slice(0, maxCategories) || [];
  const remainingCount = (product.categories?.length || 0) - maxCategories;

  return (
    <div className='relative w-full h-64 overflow-hidden bg-gray-100'>
      {showDiscountBadge && hasDiscount && discountPercentage > 0 && (
        <span className={`absolute z-10 ${discountBadgeClassName}`}>
          {discountPercentage}% OFF
        </span>
      )}
      
      {showWishlistButton && (
        <button 
          className={`absolute z-10 ${wishlistClassName}`}
          aria-label="Add to wishlist"
          onClick={handleWishlistClick}
        >
          <Heart 
            size={20} 
            className={`transition-all duration-200 group-hover:scale-125 ${
              isWishlisted 
                ? 'fill-black text-black' 
                : 'text-gray-400 group-hover:text-black'
            }`}
          />
        </button>
      )}

      {/* Categories Overlay - Always visible when showCategoriesButton is true */}
      {showCategoriesButton && hasCategories && (
        <div className={`absolute ${categoryPosition} z-10`}>
          <div className="flex flex-wrap gap-2">
            {categoriesToShow.map((category) => (
              <span
                key={category.id}
                className={`inline-block ${categoriesClassName}`}
              >
                {category.name}
              </span>
            ))}
            
            {showRemainingCategoriesCount && remainingCount > 0 && (
              <span
                className={`inline-block ${remainingCategoriesCountClassName}`}
              >
                +{remainingCount}
              </span>
            )}
          </div>
        </div>
      )}
      
      {primaryImage ? (
        <img
          src={primaryImage.url}
          alt={primaryImage.alt_text ?? product.name}
          className={imageClassName}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-400">
          <div className="text-center">
            <svg 
              className="w-16 h-16 mx-auto mb-2 text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-sm font-medium">{imagePlaceholderText}</p>
          </div>
        </div>
      )}
    </div>
  );
};