import React from "react";
import { ProductCard } from "../product-card";
import { dummyProducts } from "../../../../data/products";

export function ProductCardListing() {
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
            imageHeight={320}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductCardListing;
