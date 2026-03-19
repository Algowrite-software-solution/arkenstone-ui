# Shopping Cart

The shopping cart is managed through the `useCartStore` Zustand store.

---

## Import

```tsx
import { useCartStore } from '@/lib/stores/use-cart-store';
```

---

## Cart Item Type

```typescript
interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}
```

---

## Store Methods

### addToCart

Add a product to the cart.

```typescript
addToCart: (productId: number, quantity: number) => void
```

**Example:**

```tsx
const addToCart = useCartStore((s) => s.addToCart);

// Add 1 item
addToCart(productId, 1);

// Add multiple items
addToCart(productId, 3);
```

### removeFromCart

Remove a product from the cart.

```typescript
removeFromCart: (productId: number) => void
```

**Example:**

```tsx
const removeFromCart = useCartStore((s) => s.removeFromCart);
removeFromCart(productId);
```

### updateQuantity

Update the quantity of a product in the cart.

```typescript
updateQuantity: (productId: number, quantity: number) => void
```

**Example:**

```tsx
const updateQuantity = useCartStore((s) => s.updateQuantity);

// Increase quantity
updateQuantity(productId, 5);

// Set specific quantity
updateQuantity(productId, 2);
```

### clearCart

Clear all items from the cart.

```typescript
clearCart: () => void
```

**Example:**

```tsx
const clearCart = useCartStore((s) => s.clearCart);
clearCart();
```

### getCartQuantity

Get the quantity of a specific product in the cart.

```typescript
getCartQuantity: (productId: number) => number
```

**Example:**

```tsx
const getCartQuantity = useCartStore((s) => s.getCartQuantity);
const qty = getCartQuantity(productId);

if (qty > 0) {
  // Item is in cart
}
```

### getTotalItems

Get the total number of items in the cart.

```typescript
getTotalItems: () => number
```

**Example:**

```tsx
const getTotalItems = useCartStore((s) => s.getTotalItems);
const total = getTotalItems();
```

### getCartTotal

Get the total price of all items in the cart.

```typescript
getCartTotal: () => number
```

**Example:**

```tsx
const getCartTotal = useCartStore((s) => s.getCartTotal);
const total = getCartTotal();
```

---

## Complete Cart Example

```tsx
import { useCartStore } from '@/lib/stores/use-cart-store';
import { Button } from '@/lib/components/custom/button';
import { Card, CardContent } from '@/lib/components/ui/card';

export function CartPage() {
  const cartItems = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getCartTotal = useCartStore((s) => s.getCartTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p>Your cart is empty</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.productId}>
              <CardContent className="flex items-center gap-4 p-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <p className="font-medium">${item.price * item.quantity}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end text-xl font-bold">
            Total: ${getCartTotal().toFixed(2)}
          </div>

          <div className="flex justify-end">
            <Button size="lg">Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Cart Badge in Header

```tsx
import { useCartStore } from '@/lib/stores/use-cart-store';
import { ShoppingCart } from 'lucide-react';

export function Header() {
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const totalItems = getTotalItems();

  return (
    <header>
      <a href="/cart" className="relative">
        <ShoppingCart />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </a>
    </header>
  );
}
```
