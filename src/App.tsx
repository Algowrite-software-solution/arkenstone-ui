import { useState } from 'react'
import './App.css'
import { ProductCard } from './lib/product/components/product-card/product-card'
import { dummyProducts } from './lib/data/products'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app-container">
        <ProductCard product={dummyProducts[0]} showDiscountBadge={false} />
      </div>
    </>
  )
}

export default App
