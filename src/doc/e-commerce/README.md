# E-Commerce Overview

Arkenstone UI provides a comprehensive e-commerce solution with product display, catalog management, shopping cart, and wishlist functionality.

---

## E-Commerce Components

### Product Display
- [Product Card](./product-card.md) - Product display cards with wishlist, cart, and price display
- [Product Card Layout](./product-card.md) - Customizable product card layouts

### Catalog Management
- [Catalog](./catalog.md) - Complete product catalog with filters, sorting, pagination
- [Filters](./catalog.md) - Configuration-driven filter engine
- [Sort Bar](./catalog.md) - Sorting controls
- [Pagination](./catalog.md) - Page navigation

### Shopping
- [Cart](./cart.md) - Shopping cart state management
- [Wishlist](./wishlist.md) - Wishlist management

---

## State Management

E-commerce features are powered by Zustand stores:

```tsx
import {
  useCartStore,
  useProductCardStore,
  useCatalogStore,
  useCategoryStore,
} from '@/lib/stores';
```

---

## Quick Start - Product Grid

```tsx
import { ProductCard } from '@/lib/e-commerce/product';
import { useProductCardStore, useCartStore } from '@/lib/stores';

export function ProductGrid({ products }) {
  const toggleWishlist = useProductCardStore((s) => s.toggleWishlist);
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onToggleWishlist={(id) => toggleWishlist(id)}
          onAddToCart={(id) => addToCart(id, 1)}
        />
      ))}
    </div>
  );
}
```

---

## Product Data Type

```typescript
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number | null;
  sale_price: number | null;
  has_discount: boolean;
  sku: string | null;
  quantity: number | null;
  is_active: boolean;
  brand: Brand | null;
  categories: Category[] | null;
  images: ProductImage[] | null;
  primary_image: ProductImage | null;
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  children?: Category[];
}

interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
}
```
