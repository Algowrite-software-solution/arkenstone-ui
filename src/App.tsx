import { useState } from 'react'
import './App.css'
import { ProductCard } from './lib/product/components/product-card/product-card'
import { ProductCardViewDetails } from './lib/product/components/product-card/product-card-view-details'
import { dummyProducts } from './lib/data/products'
import './lib/css/app.css'
import { Product } from './lib/product/types'

function App() {
  const handleAddToCart = (product: Product) => {
    alert(`Added ${product.name} to cart!`);
  };

  const handleViewDetails = (product: Product) => {
    alert(`Viewing details for ${product.name}`);
  };

  const handleColorSelect = (color: string) => {
    console.log('Selected color:', color);
  };

  return (
    <>
      <div className="app-container">
        <h1>Product Cards</h1>
        <div className="product-cards-grid">
          {dummyProducts.map((product) => (
            <ProductCardViewDetails
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
            >
              <ProductCard
                product={product}
                layout="default"
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
                onColorSelect={handleColorSelect}
                showImage={true}
                showBrandTitle={true}
                showPrice={true}
                showStockAndColor={true}
                showAddToCart={true}
                showViewDetails={false} // Disable inner button since card is clickable
                showCategories={true}
              />
            </ProductCardViewDetails>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
