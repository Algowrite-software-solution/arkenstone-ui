// components/ProductCard/ProductCardLayouts.tsx
import React from 'react';
import { Product } from '../../../types'; // Adjust path as needed
import { ProductCardImage } from '../components/product-card-image';
import { ProductCardBrandTitle } from '../components/product-card-brand-title';
import { ProductCardPrice } from '../components/product-card-price';
import { ProductCardStock } from '../components/product-card-stock';
import { ProductCardAddToCart } from '../components/product-card-add-to-cart';
import { ProductCardViewDetails } from '../components/product-card-view-details';
import { ProductCardCategories } from '../components/product-card-categories';

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
  addToCartProps?: Omit<React.ComponentProps<typeof ProductCardAddToCart>, 'product' | 'onAddToCart'>;
  viewDetailsProps?: Omit<React.ComponentProps<typeof ProductCardViewDetails>, 'product' | 'onViewDetails'>;
  categoriesProps?: Omit<React.ComponentProps<typeof ProductCardCategories>, 'product'>;
  // Layout specific class names for the main content wrapper
  contentWrapperClassName?: string;
  actionsWrapperClassName?: string;
}

// --- Layout Definitions ---

// Layout 1: Default (with Tailwind CSS)
export const DefaultProductCardLayout: React.FC<CommonProductCardLayoutProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  onColorSelect,
  showImage = true,
  showBrandTitle = true,
  showPrice = false,
  showStock = false,
  showStockAndColor = false,
  showAddToCart = false,
  showViewDetails = false,
  showCategories = false,
  imageProps,
  brandTitleProps,
  priceProps,
  stockProps,
  addToCartProps,
  viewDetailsProps,
  categoriesProps,
  contentWrapperClassName = 'p-4 space-y-3',
  actionsWrapperClassName = 'flex gap-2 mt-4',
}) => {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];

  return (
    <div className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200">
      {showImage && (
        <div className="relative">
          <ProductCardImage 
            product={product} 
            imageClassName="w-full h-64 object-cover"
            {...imageProps} 
          />
        </div>
      )}

      <div className={contentWrapperClassName}>
        {showBrandTitle && (
          <ProductCardBrandTitle 
            product={product}
            showBrand={false}
            showTitle={true}
            showPrice={true}
            brandPlacement="bottom"
            {...brandTitleProps} 
          />
        )}

        {showCategories && (
          <div className="mb-2">
            <ProductCardCategories 
              product={product} 
              {...categoriesProps} 
            />
          </div>
        )}

        {showPrice && (
          <ProductCardPrice 
            product={product} 
            showOriginalPrice={true}
            showDiscountPercentage={false}
            {...priceProps} 
          />
        )}

        {(showAddToCart || showViewDetails) && (
          <div className={actionsWrapperClassName}>
            {showAddToCart && (
              <ProductCardAddToCart
                product={product}
                onAddToCart={onAddToCart}
                iconOnly={false}
                {...addToCartProps}
              />
            )}
            {/* {showViewDetails && (
              <ProductCardViewDetails
                product={product}
                onViewDetails={onViewDetails}
                buttonClassName="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                buttonText="View Details"
                {...viewDetailsProps}
              />
            )} */}
          </div>
        )}
      </div>
    </div>
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
  showStock = false,
  showStockAndColor = false,
  showAddToCart = true,
  showViewDetails = true,
  showCategories = true,
  imageProps,
  brandTitleProps,
  priceProps,
  addToCartProps,
  viewDetailsProps,
  categoriesProps,
  contentWrapperClassName = 'p-4 space-y-2',
  actionsWrapperClassName = 'absolute bottom-4 left-4 right-4 flex gap-2 justify-between items-center',
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {showImage && (
        <div className="relative group">
          <ProductCardImage 
            product={product} 
            imageClassName="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            {...imageProps} 
          />
          
          
          {/* Actions overlay on image - appears on hover */}
          {(showAddToCart || showViewDetails) && (
            <div className={`${actionsWrapperClassName} opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`}>
              {showAddToCart && (
                <ProductCardAddToCart
                  product={product}
                  onAddToCart={onAddToCart}
                  iconOnly={true}
                  buttonClassName="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  {...addToCartProps}
                />
              )}
              {showViewDetails && (
                <ProductCardViewDetails
                  product={product}
                  onViewDetails={onViewDetails}
                  linkAsButton={true}
                  buttonClassName="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium"
                  buttonText="Quick View"
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
            brandPlacement="before"
            {...brandTitleProps}
          />
        )}
        
        {showPrice && (
          <ProductCardPrice
            product={product}
            showOriginalPrice={false}
            priceClassName="text-2xl font-bold text-gray-900"
            {...priceProps}
          />
        )}
        
        
        {/* Categories below image for this layout */}
        {showCategories && (
          <div className="mt-3">
            <ProductCardCategories 
              product={product} 
              categoryClassName="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full mr-2 mb-2 hover:bg-gray-200 transition-colors"
              {...categoriesProps} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

// You can add more layouts here, e.g.,
// export const CompactProductCardLayout: React.FC<CommonProductCardLayoutProps> = (...)
// export const FullDetailProductCardLayout: React.FC<CommonProductCardLayoutProps> = (...)