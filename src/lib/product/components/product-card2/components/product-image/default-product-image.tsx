import { ProductImageLayout , ProductImageLayoutProps } from "../../layouts/product-card-image-layout";
import { WishlistButton, WishlistButtonProps } from "../wishlist-button";
import { DiscountBadge, DiscountBadgeProps } from "../discount-badge";
import { ViewDetailsButton, ViewDetailsButtonProps } from "../view-details-button";
import { BrandTitle, BrandTitleProps } from "../brand-title";
import { PriceCard, PriceCardProps } from "../price-card";

/**
 * Wrapper that uses the layout implementation from layouts/product-card-image-layout.tsx
 * and provides convenient built-in slot defaults (wishlist, discount, brand, price, view details).
 */
export interface DefaultProductImageProps extends ProductImageLayoutProps {
  wishlistProps?: WishlistButtonProps;
  discountProps?: DiscountBadgeProps;
  brandProps?: BrandTitleProps;
  priceProps?: PriceCardProps;
  viewDetailsProps?: ViewDetailsButtonProps;
}

export function DefaultProductImage({
  // built-in passthroughs (optional)
  wishlistProps,
  discountProps,
  brandProps,
  priceProps,
  viewDetailsProps,
  // custom slot nodes and all other layout props
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  center,
  ...rest
}: DefaultProductImageProps) {
  const composedTopLeft = topLeft ?? (wishlistProps ? <WishlistButton {...wishlistProps} /> : null);
  const composedTopRight = topRight ?? (discountProps ? <DiscountBadge {...discountProps} /> : null);

  const composedBottomLeft =
    bottomLeft ??
    (brandProps || priceProps ? (
      <div className="flex flex-col items-start gap-1">
        {brandProps ? <BrandTitle {...brandProps} /> : null}
        {priceProps ? <PriceCard {...priceProps} /> : null}
      </div>
    ) : null);

  const composedBottomRight = bottomRight ?? (viewDetailsProps ? <ViewDetailsButton {...viewDetailsProps} /> : null);

  return (
    <ProductImageLayout
      {...(rest as ProductImageLayoutProps)}
      topLeft={composedTopLeft}
      topRight={composedTopRight}
      bottomLeft={composedBottomLeft}
      bottomRight={composedBottomRight}
      center={center}
    />
  );
}