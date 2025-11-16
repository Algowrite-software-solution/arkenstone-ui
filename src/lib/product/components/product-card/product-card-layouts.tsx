// components/ProductCard/ProductCardLayouts.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed
import { ProductCardImage } from './product-card-image';
import { ProductCardBrandTitle } from './product-card-brand-title';
import { ProductCardPrice } from './product-card-price';
import { ProductCardStock } from './product-card-stock';
import { ProductCardStockAndColor } from './product-card-stock-and-color';
import { ProductCardAddToCart } from './product-card-add-to-cart';
import { ProductCardViewDetails } from './product-card-view-details';
import { ProductCardCategories } from './product-card-categories';

// Define a common interface for all layout props
export interface CommonProductCardLayoutProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  onColorSelect?: (color: string) => void; // Prop for ProductCardStockAndColor
  // General show/hide props for components that can be toggled across layouts
  showImage?: boolean;
  showBrandTitle?: boolean;
  showPrice?: boolean;
  showStock?: boolean; // If true, shows ProductCardStock OR ProductCardStockAndColor
  showStockAndColor?: boolean; // If true, overrides showStock and shows ProductCardStockAndColor
  showAddToCart?: boolean;
  showViewDetails?: boolean;
  showCategories?: boolean;
  // Specific prop customizations
  imageProps?: Omit<React.ComponentProps<typeof ProductCardImage>, 'product'>;
  brandTitleProps?: Omit<React.ComponentProps<typeof ProductCardBrandTitle>, 'product'>;
  priceProps?: Omit<React.ComponentProps<typeof ProductCardPrice>, 'product'>;
  stockProps?: Omit<React.ComponentProps<typeof ProductCardStock>, 'product'>;
  stockAndColorProps?: Omit<React.ComponentProps<typeof ProductCardStockAndColor>, 'product' | 'onColorSelect'>;
  addToCartProps?: Omit<React.ComponentProps<typeof ProductCardAddToCart>, 'product' | 'onAddToCart'>;
  viewDetailsProps?: Omit<React.ComponentProps<typeof ProductCardViewDetails>, 'product' | 'onViewDetails'>;
  categoriesProps?: Omit<React.ComponentProps<typeof ProductCardCategories>, 'product'>;
  // Layout specific class names for the main content wrapper
  contentWrapperClassName?: string;
  actionsWrapperClassName?: string;
}

// --- Layout Definitions ---

// Layout 1: Default (similar to original, but using new components)
export const DefaultProductCardLayout: React.FC<CommonProductCardLayoutProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  onColorSelect,
  showImage = true,
  showBrandTitle = true,
  showPrice = true,
  showStock = true,
  showStockAndColor = false, // Default to false
  showAddToCart = true,
  showViewDetails = true,
  showCategories = true,
  imageProps,
  brandTitleProps,
  priceProps,
  stockProps,
  stockAndColorProps,
  addToCartProps,
  viewDetailsProps,
  categoriesProps,
  contentWrapperClassName = 'product-card__content',
  actionsWrapperClassName = 'product-card__actions',
}) => {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];

  return (
    <>
      {showImage && <ProductCardImage product={product} {...imageProps} />}

      {showCategories && categoriesProps?.placement === 'on-image' && primaryImage && (
        <ProductCardCategories product={product} {...categoriesProps} />
      )}

      <div className={contentWrapperClassName}>
        {showBrandTitle && (
          <ProductCardBrandTitle product={product} {...brandTitleProps} />
        )}

        {showCategories && categoriesProps?.placement !== 'on-image' && (
          <ProductCardCategories product={product} {...categoriesProps} />
        )}

        {showPrice && <ProductCardPrice product={product} {...priceProps} />}

        {showStockAndColor ? (
          <ProductCardStockAndColor
            product={product}
            onColorSelect={onColorSelect}
            {...stockAndColorProps}
          />
        ) : showStock ? (
          <ProductCardStock product={product} {...stockProps} />
        ) : null}

        {(showAddToCart || showViewDetails) && (
          <div className={actionsWrapperClassName}>
            {showAddToCart && (
              <ProductCardAddToCart
                product={product}
                onAddToCart={onAddToCart}
                {...addToCartProps}
              />
            )}
            {showViewDetails && (
              <ProductCardViewDetails
                product={product}
                onViewDetails={onViewDetails}
                {...viewDetailsProps}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

// Layout 2: Image-heavy with actions on image (example)
export const ImageHeavyProductCardLayout: React.FC<CommonProductCardLayoutProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  onColorSelect,
  showImage = true,
  showBrandTitle = true,
  showPrice = true,
  showStock = false, // Not shown in this layout example
  showStockAndColor = false,
  showAddToCart = true,
  showViewDetails = true,
  showCategories = true,
  imageProps,
  brandTitleProps,
  priceProps,
  stockAndColorProps, // Pass if needed for other layouts
  addToCartProps,
  viewDetailsProps,
  categoriesProps,
  contentWrapperClassName = 'product-card__content--image-heavy',
  actionsWrapperClassName = 'product-card__actions--on-image',
}) => {
  return (
    <>
      {showImage && (
        <div className="product-card__image-overlay-container">
          <ProductCardImage product={product} {...imageProps} />
          {/* Categories and actions directly on the image */}
          {showCategories && (
            <ProductCardCategories product={product} placement="on-image" {...categoriesProps} />
          )}
          {(showAddToCart || showViewDetails) && (
            <div className={actionsWrapperClassName}>
              {showAddToCart && (
                <ProductCardAddToCart
                  product={product}
                  onAddToCart={onAddToCart}
                  iconOnly={true} // Example: show icon only for add to cart
                  {...addToCartProps}
                />
              )}
              {showViewDetails && (
                <ProductCardViewDetails
                  product={product}
                  onViewDetails={onViewDetails}
                  linkAsButton={true} // Example: View Details as a link
                  {...viewDetailsProps}
                />
              )}
            </div>
          )}
        </div>
      )}

      <div className={contentWrapperClassName}>
        {showBrandTitle && (
          <ProductCardBrandTitle
            product={product}
            brandPlacement="after" // Example: brand after title
            {...brandTitleProps}
          />
        )}
        {showPrice && (
          <ProductCardPrice
            product={product}
            showOriginalPrice={false} // Example: only show final price
            {...priceProps}
          />
        )}
        {showStockAndColor && ( // Stock & Color shown below content if active
          <ProductCardStockAndColor
            product={product}
            onColorSelect={onColorSelect}
            {...stockAndColorProps}
          />
        )}
        {/* Categories can also be below image for this layout */}
        {showCategories && categoriesProps?.placement !== 'on-image' && (
            <ProductCardCategories product={product} {...categoriesProps} />
        )}
      </div>
    </>
  );
};

// You can add more layouts here, e.g.,
// export const CompactProductCardLayout: React.FC<CommonProductCardLayoutProps> = (...)
// export const FullDetailProductCardLayout: React.FC<CommonProductCardLayoutProps> = (...)