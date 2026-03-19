# Wishlist

The wishlist functionality is managed through the `useProductCardStore` Zustand store.

---

## Import

```tsx
import { useProductCardStore } from '@/lib/stores/use-product-card-store';
```

---

## Store Properties

### wishlist

Array of product IDs in the wishlist.

```typescript
wishlist: number[]
```

---

## Store Methods

### toggleWishlist

Add or remove a product from the wishlist.

```typescript
toggleWishlist: (productId: number) => void
```

**Example:**

```tsx
const toggleWishlist = useProductCardStore((s) => s.toggleWishlist);

// Toggle wishlist status
toggleWishlist(productId);
```

### addToWishlist

Add a product to the wishlist.

```typescript
addToWishlist: (productId: number) => void
```

**Example:**

```tsx
const addToWishlist = useProductCardStore((s) => s.addToWishlist);
addToWishlist(productId);
```

### removeFromWishlist

Remove a product from the wishlist.

```typescript
removeFromWishlist: (productId: number) => void
```

**Example:**

```tsx
const removeFromWishlist = useProductCardStore((s) => s.removeFromWishlist);
removeFromWishlist(productId);
```

### isWishlisted

Check if a product is in the wishlist.

```typescript
isWishlisted: (productId: number) => boolean
```

**Example:**

```tsx
const isWishlisted = useProductCardStore((s) => s.isWishlisted);

if (isWishlisted(productId)) {
  // Product is wishlisted
}
```

### clearWishlist

Clear all items from the wishlist.

```typescript
clearWishlist: () => void
```

**Example:**

```tsx
const clearWishlist = useProductCardStore((s) => s.clearWishlist);
clearWishlist();
```

---

## Complete Wishlist Example

```tsx
import { useProductCardStore } from '@/lib/stores/use-product-card-store';
import { Button } from '@/lib/components/custom/button';
import { Card, CardContent } from '@/lib/components/ui/card';
import { Heart, Trash2 } from 'lucide-react';

export function WishlistPage() {
  const wishlist = useProductCardStore((s) => s.wishlist);
  const removeFromWishlist = useProductCardStore((s) => s.removeFromWishlist);
  const clearWishlist = useProductCardStore((s) => s.clearWishlist);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6" />
          Wishlist ({wishlist.length})
        </h1>
        {wishlist.length > 0 && (
          <Button variant="outline" onClick={clearWishlist}>
            Clear All
          </Button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Your wishlist is empty</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((productId) => (
            <Card key={productId}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Product #{productId}</h3>
                    <p className="text-gray-500">$99.99</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(productId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1">
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## WishlistButton Component

Use the `WishlistButton` component for product cards:

```tsx
import { WishlistButton } from '@/lib/e-commerce/product/components';

export function ProductCard({ product }) {
  const toggleWishlist = useProductCardStore((s) => s.toggleWishlist);
  const isWishlisted = useProductCardStore((s) => s.isWishlisted);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="relative">
      <ProductImage imageUrl={product.image} />
      
      <WishlistButton
        isWishlisted={wishlisted}
        onToggle={() => toggleWishlist(product.id)}
        size={24}
        className={{
          button: "absolute top-2 right-2 bg-white/80 p-2 rounded-full",
          icon: "text-gray-600 hover:text-red-500",
        }}
      />
      
      {/* Rest of product card */}
    </div>
  );
}
```

### WishlistButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isWishlisted` | `boolean` | `false` | Current wishlist state |
| `onToggle` | `() => void` | - | Called when button clicked |
| `icon` | `ReactNode` | - | Icon when not wishlisted |
| `activeIcon` | `ReactNode` | - | Icon when wishlisted |
| `size` | `number` | `22` | Icon size in pixels |
| `ariaLabel` | `string` | `'Add to wishlist'` | Accessibility label |
| `className` | `object` | `{}` | Styling overrides |
