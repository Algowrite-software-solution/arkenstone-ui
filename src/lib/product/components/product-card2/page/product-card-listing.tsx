import { ProductCard } from "../product-card";
import { dummyProducts } from "../../../../data/products";

export function ProductCardListing() {
  const handleToggleWishlist = (productId: number, wishlisted: boolean) => {
    console.log("toggle wishlist", productId, wishlisted);
  };

  const handleViewDetails = (productId: number) => {
    console.log("view details", productId);
  };

  const handleAddToCart = (productId: number) => {
    console.log("add to cart", productId);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dummyProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            layout="compact"
            showWishlist
            showDiscount
            showViewDetails
            showBrand
            showPrice
            onToggleWishlist={handleToggleWishlist}
            onViewDetails={handleViewDetails}
            onAddToCart={handleAddToCart}
            imageHeight={320}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductCardListing;
