# Stores

Zustand stores for state management with persistence and Immer integration.

---

## Available Stores

| Store | Purpose |
|-------|---------|
| `useACLStore` | Access Control List |
| `useConfigStore` | Global app configuration |
| `useCatalogStore` | Product catalog state |
| `useProductCardStore` | Wishlist and view details |
| `useCartStore` | Shopping cart |
| `useCategoryStore` | Selected category |

---

## useCartStore

Shopping cart management.

```typescript
import { useCartStore } from '@/lib/stores/use-cart-store';

// State
const items = useCartStore((s) => s.items);
const getTotalItems = useCartStore((s) => s.getTotalItems);
const getCartTotal = useCartStore((s) => s.getCartTotal);
const getCartQuantity = useCartStore((s) => s.getCartQuantity);

// Actions
const addToCart = useCartStore((s) => s.addToCart);
const removeFromCart = useCartStore((s) => s.removeFromCart);
const updateQuantity = useCartStore((s) => s.updateQuantity);
const clearCart = useCartStore((s) => s.clearCart);
```

See [Cart Documentation](../e-commerce/cart.md) for detailed usage.

---

## useProductCardStore

Wishlist and product card state.

```typescript
import { useProductCardStore } from '@/lib/stores/use-product-card-store';

// State
const wishlist = useProductCardStore((s) => s.wishlist);
const isWishlisted = useProductCardStore((s) => s.isWishlisted);

// Actions
const toggleWishlist = useProductCardStore((s) => s.toggleWishlist);
const addToWishlist = useProductCardStore((s) => s.addToWishlist);
const removeFromWishlist = useProductCardStore((s) => s.removeFromWishlist);
const clearWishlist = useProductCardStore((s) => s.clearWishlist);
```

See [Wishlist Documentation](../e-commerce/wishlist.md) for detailed usage.

---

## useCatalogStore

Product catalog filtering, sorting, and pagination.

```typescript
import { useCatalogStore } from '@/lib/stores/use-catalog-store';

// State
const filters = useCatalogStore((s) => s.filters);
const sortBy = useCatalogStore((s) => s.sortBy);
const sortOrder = useCatalogStore((s) => s.sortOrder);
const viewMode = useCatalogStore((s) => s.viewMode);
const page = useCatalogStore((s) => s.page);

// Actions
const setFilters = useCatalogStore((s) => s.setFilters);
const setSortBy = useCatalogStore((s) => s.setSortBy);
const setSortOrder = useCatalogStore((s) => s.setSortOrder);
const setViewMode = useCatalogStore((s) => s.setViewMode);
const setPage = useCatalogStore((s) => s.setPage);
const resetFilters = useCatalogStore((s) => s.resetFilters);
```

### Example

```tsx
import { useCatalogStore } from '@/lib/stores/use-catalog-store';

function CatalogControls() {
  const sortBy = useCatalogStore((s) => s.sortBy);
  const sortOrder = useCatalogStore((s) => s.sortOrder);
  const viewMode = useCatalogStore((s) => s.viewMode);
  
  const setSortBy = useCatalogStore((s) => s.setSortBy);
  const setSortOrder = useCatalogStore((s) => s.setSortOrder);
  const setViewMode = useCatalogStore((s) => s.setViewMode);

  return (
    <div className="flex gap-4">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="created_at">Date</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <div className="flex gap-2">
        <button onClick={() => setViewMode('grid')}>Grid</button>
        <button onClick={() => setViewMode('list')}>List</button>
      </div>
    </div>
  );
}
```

---

## useConfigStore

Global application configuration.

```typescript
import { useConfigStore } from '@/lib/stores/use-config-store';

// State
const theme = useConfigStore((s) => s.theme);
const currency = useConfigStore((s) => s.currency);
const features = useConfigStore((s) => s.features);

// Actions
const setTheme = useConfigStore((s) => s.setTheme);
const setCurrency = useConfigStore((s) => s.setCurrency);
const toggleFeature = useConfigStore((s) => s.toggleFeature);
```

### Example

```tsx
import { useConfigStore } from '@/lib/stores/use-config-store';

function Settings() {
  const theme = useConfigStore((s) => s.theme);
  const currency = useConfigStore((s) => s.currency);
  const features = useConfigStore((s) => s.features);
  
  const setTheme = useConfigStore((s) => s.setTheme);
  const setCurrency = useConfigStore((s) => s.setCurrency);
  const toggleFeature = useConfigStore((s) => s.toggleFeature);

  return (
    <div className="space-y-4">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="LKR">LKR</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={features.reviewsEnabled}
          onChange={() => toggleFeature('reviewsEnabled')}
        />
        Enable Reviews
      </label>
    </div>
  );
}
```

---

## useCategoryStore

Selected category state.

```typescript
import { useCategoryStore } from '@/lib/stores/use-category-store';

// State
const selectedCategory = useCategoryStore((s) => s.selectedCategory);
const categoryPath = useCategoryStore((s) => s.categoryPath);

// Actions
const setCategory = useCategoryStore((s) => s.setCategory);
const clearCategory = useCategoryStore((s) => s.clearCategory);
```

### Example

```tsx
import { useCategoryStore } from '@/lib/stores/use-category-store';

function CategoryBreadcrumb() {
  const categoryPath = useCategoryStore((s) => s.categoryPath);
  const setCategory = useCategoryStore((s) => s.setCategory);

  return (
    <nav className="flex gap-2">
      <button onClick={() => setCategory(null)}>All</button>
      {categoryPath.map((cat) => (
        <span key={cat.id}>
          &gt; <button onClick={() => setCategory(cat)}>{cat.name}</button>
        </span>
      ))}
    </nav>
  );
}
```

---

## Store Features

### Persistence

Most stores persist to localStorage automatically.

### Immer Integration

Update state directly without spreading:

```typescript
// Direct mutation (Immer handles immutability)
update((state) => {
  state.items.push(newItem);
  state.count++;
});
```

### Reset

Reset stores to initial state:

```typescript
const reset = useCartStore((s) => s.reset);
reset();
```
