import { Product } from "../../types";
import { ProductCardLayout } from "./layouts/product-card-layout";
import { DefaultProductImage } from "./components/product-image/default-product-image";
import { WishlistButton } from "./components/wishlist-button";
import { DiscountBadge } from "./components/discount-badge";
import { ViewDetailsButton } from "./components/view-details-button";
import { BrandTitle } from "./components/brand-title";
import { PriceCard } from "./components/price-card";

export interface ProductCardProps {
  product: Product;
  layout?: "compact" | "detailed";

  // Toggles / handlers
  showWishlist?: boolean;
  showDiscount?: boolean;
  showViewDetails?: boolean;
  showBrand?: boolean;
  showPrice?: boolean;

  onToggleWishlist?: (productId: number, wishlisted: boolean) => void;
  onViewDetails?: (productId: number) => void;
  onAddToCart?: (productId: number) => void;

  // Class overrides (passes through to layout/components)
  containerClassName?: string;
  imageHeight?: number | string;
}

export function ProductCard({
  product,
  layout = "compact",
  showWishlist = true,
  showDiscount = true,
  showViewDetails = true,
  showBrand = true,
  showPrice = true,
  onToggleWishlist,
  onViewDetails,
  onAddToCart,
  containerClassName,
  imageHeight = 280,
}: ProductCardProps) {
  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
  const imageUrl = primaryImage?.url;
  const imageAlt = primaryImage?.alt_text ?? product.name;

  const wishlistNode = showWishlist ? (
    <WishlistButton
      isWishlisted={false}
      onToggle={() => onToggleWishlist?.(product.id, true)}
      size={20}
      ariaLabel="Wishlist"
    />
  ) : null;

  const discountNode =
    showDiscount && (product.discount_value || product.final_price !== product.price) ? (
      <DiscountBadge
        discount={product.discount_value || 0}
        discountType={product.discount_type === "fixed" ? "fixed" : "percentage"}
      />
    ) : null;

  const viewDetailsNode = showViewDetails ? (
    <ViewDetailsButton onClick={() => onViewDetails?.(product.id)} />
  ) : null;

  const brandNode = showBrand && product.brand ? (
    <BrandTitle brand={product.brand_id} title={product.name} showBrand={true} />
  ) : null;

  const priceNode = showPrice ? (
    <PriceCard
      finalPrice={product.final_price ?? product.price ?? 0}
      price={product.price ?? 0}
      discountType={product.discount_type}
      currency="USD"
    />
  ) : null;

  const imageComponent = (
    <DefaultProductImage
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      height={imageHeight}
      topLeft={wishlistNode}
      topRight={discountNode}
      bottomLeft={
        <>
          {brandNode}
          {priceNode}
        </>
      }
      bottomRight={viewDetailsNode}
    />
  );

  const detailsComponent = (
    <div className="p-3">
      <div className="text-sm text-gray-500 mb-1">{product.brand?.name}</div>
    </div>
  );

  return (
    <ProductCardLayout
      layout={layout}
      ImageComponent={imageComponent}
      DetailsComponent={detailsComponent}
      containerClassName={containerClassName}
    />
  );
}