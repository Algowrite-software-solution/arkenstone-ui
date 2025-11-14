import React from 'react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  showDiscountBadge?: boolean;
  showDescription?: boolean;
  showCategories?: boolean;
  showOriginalPrice?: boolean;
  showStock?: boolean;
  showActions?: boolean;
  showAddToCartButton?: boolean;
  showViewDetailsButton?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  onViewDetails,
  showDiscountBadge = true,
  showDescription = true,
  showCategories = true,
  showOriginalPrice = true,
  showStock = true,
  showActions = true,
  showAddToCartButton = true,
  showViewDetailsButton = true
}) => {
  const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
  const hasDiscount = product.discount_type && product.discount_value;
  const discountPercentage = product.discount_type === 'percentage' 
    ? product.discount_value 
    : Math.round(((product.price - product.final_price) / product.price) * 100);

  return (
    <div className="product-card">
      <div className="product-card__image-container">
        {showDiscountBadge && hasDiscount && (
          <span className="product-card__badge">
            {discountPercentage}% OFF
          </span>
        )}
        {primaryImage ? (
          <img 
            src={primaryImage.url} 
            alt={primaryImage.alt_text || product.name} 
            className="product-card__image"
          />
        ) : (
          <div className="product-card__image-placeholder">No Image</div>
        )}
      </div>

      <div className="product-card__content">
        {product.brand && (
          <div className="product-card__brand">
            {product.brand.name}
          </div>
        )}
        
        <p className="product-card__title">{product.name}</p>
        
        {showDescription && (
          <p className="product-card__description">
            {product.description.length > 80 
              ? `${product.description.substring(0, 80)}...` 
              : product.description}
          </p>
        )}

        {showCategories && product.categories.length > 0 && (
          <div className="product-card__categories">
            {product.categories.map(category => (
              <span key={category.id} className="product-card__category">
                {category.name}
              </span>
            ))}
          </div>
        )}

        <div className="product-card__pricing">
          {hasDiscount ? (
            <>
              {showOriginalPrice && (
                <span className="product-card__price--original">
                  ${product.price.toFixed(2)}
                </span>
              )}
              <span className="product-card__price--final">
                ${product.final_price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="product-card__price">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {showStock && (
          <div className="product-card__stock">
            {product.quantity > 0 ? (
              <span className="product-card__stock--available">
                {product.quantity} in stock
              </span>
            ) : (
              <span className="product-card__stock--unavailable">
                Out of stock
              </span>
            )}
          </div>
        )}

        {showActions && (showAddToCartButton || showViewDetailsButton) && (
          <div className="product-card__actions">
            {showAddToCartButton && (
              <button 
                className="product-card__button product-card__button--primary"
                onClick={() => onAddToCart?.(product)}
                disabled={product.quantity === 0}
              >
                Add to Cart
              </button>
            )}
            {showViewDetailsButton && (
              <button 
                className="product-card__button product-card__button--secondary"
                onClick={() => onViewDetails?.(product)}
              >
                View Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};