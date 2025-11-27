import { Product } from "../../types";
import { ProductCardLayout } from "./layouts/product-card-layout";
import { ProductImageLayout } from "./layouts/product-card-image-layout";
import { WishlistButton } from "./components/wishlist-button";
import { DiscountBadge } from "./components/discount-badge";
import { ViewDetailsButton } from "./components/view-details-button";
import { BrandTitle } from "./components/brand-title";
import { PriceCard } from "./components/price-card";
import { AddToCart } from "./components/add-to-cart-button";
import { CategoriesBadgeList } from "./components/categories";
import { useProductCardStore , useCategoryStore, useCartStore} from "../../../useStore";

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
  containerClassName,
}: ProductCardProps) {
  const primaryImage = product.primary_image || product.images?.[0];
  const imageUrl = primaryImage?.image_url;
  const imageAlt = primaryImage?.alt_text ?? product.name;

  // Zustand selectors/actions
  const isWishlisted = useProductCardStore((s) => s.wishlist.includes(product.id));
  const toggleWishlist = useProductCardStore((s) => s.toggleWishlist);
  const addToCartAction = useCartStore((s) => s.addToCart);
  const getCartQuantity = useCartStore((s) => s.getCartQuantity);
  const viewDetailsAction = useProductCardStore((s) => s.viewDetails);
  const setSelectedCategory = useCategoryStore((s) => s.setSelectedCategory);

  const inCart = (getCartQuantity(product.id) ?? 0) > 0;

  const wishlistNode = showWishlist ? (
    <WishlistButton
      isWishlisted={isWishlisted}
      onToggle={() => {
        toggleWishlist(product.id);

        // ADD YOUR GLOBAL SIDE EFFECTS HERE ↓↓↓
        console.log("Wishlist changed globally!");
      }}
      size={20}
      ariaLabel="Wishlist"
    />
  ) : null;

  const discountNode =
    showDiscount && (product.has_discount) ? (
      <DiscountBadge
        discount={product.discount_value ?? undefined}
        discountType={
          product.discount_type === "fixed"
            ? "fixed"
            : product.discount_type === "percentage"
            ? "percentage"
            : undefined
        }
      />
    ) : null;

  const viewDetailsNode = showViewDetails ? (
    <ViewDetailsButton onClick={() => viewDetailsAction(product.id)} />
  ) : null;

  const brandNode = showBrand && product.brand ? (
    <BrandTitle brand={product.brand?.name} title={product.name} show={{brand: true}} />
  ) : null;

  const priceNode = showPrice ? (
    <PriceCard
      salePrice={product.sale_price ?? product.price ?? 0}
      price={product.price ?? 0}
      discountType={product.discount_type}
      discountValue={product.discount_value ?? null}
      currency="USD"
      showOriginalPrice={false}
      showDiscountPercentage={false}
    />
  ) : null;

  const imageComponent = (
    <ProductImageLayout
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      topLeft={wishlistNode}
      topRight={discountNode}
      bottomPlaceholder={
          <CategoriesBadgeList 
            categories={product.categories || []}
            onCategoryClick={(category) => setSelectedCategory(category)}
            className={{ position: "bottom-3 left-3" }}
          />
      }
    />
  );

  const detailsComponent = (
    <div className="p-3">
      {brandNode}
      {priceNode}
      <AddToCart
        onAddToCart={() => addToCartAction(product.id)}
        labels={{ inCartText: "In Cart" }}
        state={{
          isInCart: inCart,
        }}
      />
    </div>
  );

  return (
    <ProductCardLayout
      layout={layout}
      ImageComponent={imageComponent}
      DetailsComponent={detailsComponent}
      className={{ container: containerClassName }}
    />
  );
}