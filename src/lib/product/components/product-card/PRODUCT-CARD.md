Here is a comprehensive technical documentation draft for the `product-card` package. This document is designed to help other developers install, understand, and utilize the components effectively.

---

# Product Card Component Library

## Overview
The `product-card` package provides a highly modular, responsive, and composable product card system for React e-commerce applications. It is built with **atomic design principles**, separating logic, layout, and UI components.

It comes with:
1.  **Smart Components:** Pre-wired with state management (Zustand) for wishlist and cart actions.
2.  **Layout System:** Flexible "Compact" (Grid) and "Detailed" (List) views.
3.  **Slot-Based Image Layout:** Easy positioning of badges (Discount, Wishlist) over product images.
4.  **Atomic UI Components:** Reusable buttons, badges, and price displays.

---

## 1. Quick Start

The easiest way to use the library is via the high-level `ProductCard` component. It handles data parsing, state logic, and layout assembly automatically.

```tsx
import React from "react";
import { ProductCard } from "product-card"; // Hypothetical import path
import { dummyProducts } from "./data";

export function ShopGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {dummyProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout="compact"   // 'compact' | 'detailed'
          showWishlist={true}
          showDiscount={true}
          showPrice={true}
          showBrand={true}
          onAddToCart={(id) => console.log("Added:", id)}
        />
      ))}
    </div>
  );
}
```

---

## 2. Core Component: `<ProductCard />`

This is the main orchestrator. It connects the raw `Product` data to the UI components and hooks into the internal Zustand stores (Cart, Wishlist, Category).

### Props API

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `product` | `Product` | **Required** | The full product data object (see Types section). |
| `layout` | `"compact" \| "detailed"` | `"compact"` | Switches between vertical (grid) and horizontal (list) layouts. |
| `showWishlist` | `boolean` | `true` | Toggles the heart icon on the image. |
| `showDiscount` | `boolean` | `true` | Toggles the percentage/fixed discount badge. |
| `showViewDetails` | `boolean` | `true` | Toggles the view details button/icon. |
| `showBrand` | `boolean` | `true` | Displays the brand name above/next to the title. |
| `showPrice` | `boolean` | `true` | Displays the price block (Current, Original, Discount). |
| `containerClassName`| `string` | `undefined` | Override the root container styles. |
| `imageHeight` | `number \| string` | `undefined` | Force a specific image height. |
| `onToggleWishlist` | `(id, bool) => void` | `store.toggle` | Callback override for wishlist action. |
| `onAddToCart` | `(id) => void` | `store.add` | Callback override for add to cart action. |

### Automatic State Handling
By default, `<ProductCard />` connects to:
*   **`useProductCardStore`**: Checks if the item is in the wishlist.
*   **`useCartStore`**: Checks quantity to update button state (e.g., "In Cart").
*   **`useCategoryStore`**: Handles clicks on category badges.

---

## 3. Layout Architecture

If you need to build a custom card distinct from the default one, you can use the Layout components directly.

### 3.1 `ProductCardLayout`
The structural shell. It accepts two main slots: `ImageComponent` and `DetailsComponent`.

```tsx
import { ProductCardLayout } from "product-card/layouts";

<ProductCardLayout
  layout="detailed" // Side-by-side view
  ImageComponent={<MyCustomImage />}
  DetailsComponent={<MyCustomDetails />}
  containerClassName="border-blue-500 border-2"
/>
```

### 3.2 `ProductImageLayout`
A powerful slot-based image wrapper. It divides the image area into regions (Corners, Center, Top/Bottom Rows) for overlaying badges.

**Visual Guide:**
```
+-------------------------------------------------+
| [TopLeft]                           [TopRight]  |  <-- TopRow
|                                                 |
|                   [Center]                      |
|                                                 |
| [BottomLeft]                     [BottomRight]  |  <-- BottomRow
+-------------------------------------------------+
```

**Usage:**
```tsx
import { ProductImageLayout } from "product-card/layouts";

<ProductImageLayout
  imageUrl="https://example.com/shoe.jpg"
  height={300}
  // Slots
  topRight={<DiscountBadge discount={50} />}
  topLeft={<WishlistButton isWishlisted={true} />}
  bottomPlaceholder={<CategoryBadgeList categories={...} />}
/>
```

**Advanced Feature:** You can replace the static background image with a video or carousel using the `background` prop:
```tsx
<ProductImageLayout
  background={<video src="preview.mp4" autoPlay loop className="w-full h-full object-cover" />}
/>
```

---

## 4. Atomic Components

These components are used internally but are exported for custom compositions.

### `PriceCard`
Displays price, original price (strikethrough), and discount percentage.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `price` | `number \| null` | `null` | Base / original price. If null it's treated as absent. |
| `salePrice` | `number \| null` | `null` | Actual selling price. If null `price` is used as fallback. |
| `discountType` | `string \| null` | `null` | `"percentage"` or `"fixed"` (backend hint). If omitted the component will infer discount from price difference. |
| `discountValue` | `number \| null` | `null` | Value of discount: percent when `discountType === "percentage"`, fixed amount when `"fixed"`. |
| `showOriginalPrice` | `boolean` | `true` | When true shows the original price as strikethrough if original > final. |
| `showDiscountPercentage` | `boolean` | `true` | When true shows a computed or provided discount percentage. |
| `currency` | `string` | `"USD"` | ISO currency code used with Intl.NumberFormat. |
| `fractionDigits` | `number` | `2` | Number of fraction digits to format currency with. |
| `wrapperClassName` | `string` | `"flex items-center gap-2 flex-wrap"` | Root container class override. |
| `priceClassName` | `string` | `"text-lg font-semibold"` | Class for the displayed final price. |
| `originalPriceClassName` | `string` | `"line-through text-gray-500"` | Class for the original (struck) price. |
| `discountClassName` | `string` | `"text-red-600 font-semibold"` | Class for the discount percentage label. |

Notes:
- If both `price` and `salePrice` are numbers, the component considers a discount present when `price > salePrice`.
- `discountValue` + `discountType` take precedence for determining the displayed percentage:
  - `"percentage"`: display `discountValue` directly.
  - `"fixed"`: convert fixed amount to percent = round((discountValue / price) * 100) when `price` is available.
  - If no explicit discount fields, percentage is computed from `price` and `salePrice`.
- Null values are handled gracefully — the UI displays `---` for missing final price and hides elements that cannot be computed.

Example
```tsx
import { PriceCard } from "./components/price-card";

// explicit percentage from backend
<PriceCard price={100} salePrice={75} discountType="percentage" discountValue={25} />

// fixed discount (backend provided fixed amount)
<PriceCard price={120} salePrice={90} discountType="fixed" discountValue={30} />

// backend omitted discount, inferred from prices
<PriceCard price={200} salePrice={150} />

// customize styles / currency
<PriceCard
  price={500}
  salePrice={450}
  currency="EUR"
  fractionDigits={2}
  wrapperClassName="flex items-baseline gap-3"
  priceClassName="text-2xl font-bold"
/>
```

### `BrandTitle`
Handles brand and product title layout and styling. Renders brand and title in different arrangements (before/after/top/bottom) and supports simple class overrides.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `brand` | `React.ReactNode` | `"test brand"` | Brand content (string, element, or node). |
| `title` | `React.ReactNode` | `"test title"` | Product title content (string, element, or node). |
| `showBrand` | `boolean` | `true` | Toggle rendering of the brand node. |
| `showTitle` | `boolean` | `true` | Toggle rendering of the title node. |
| `brandPlacement` | `"before" \| "after" \| "top" \| "bottom" \| "hidden"` | `"before"` | Position of brand relative to title: `<brand> - <title>` (`before`), `<title> - <brand>` (`after`), stacked with brand on top (`top`) or below (`bottom`). `hidden` renders only the title. |
| `brandClassName` | `string` | `""` | CSS class(es) applied to the brand element. |
| `titleClassName` | `string` | `""` | CSS class(es) applied to the title element. |
| `wrapperClassName` | `string` | `""` | CSS class(es) applied to the outer wrapper. |
| `separatorClassName` | `string` | `"px-2 opacity-60"` | CSS class(es) for the separator element shown between brand and title in horizontal placements. |

Notes:
- When both `brand` and `title` are provided, a separator (`-`) is rendered between them for horizontal placements (`before` / `after`). You can override separator styling via `separatorClassName`.
- Use `showBrand` / `showTitle` to selectively hide parts without removing content.
- `brandPlacement="hidden"` is useful when you want the title only (same as `showBrand = false` but explicit).

Example:
```tsx
<BrandTitle
  brand="ACME"
  title={<strong>Falcon Shoes</strong>}
  brandPlacement="top"
  brandClassName="text-xs text-gray-500"
  titleClassName="text-lg font-semibold"
  wrapperClassName="truncate"
/>
```

### `AddToCart`
Primary action button. Handles "Out of Stock" and "In Cart" states, supports icon-only mode and custom text/styles.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `onAddToCart` | `() => void` | `undefined` | Click handler invoked when button clicked (if not disabled). |
| `addToCartText` | `string` | `"Add to Cart"` | Text shown when item is not in cart. |
| `inCartText` | `string` | `"In Cart"` | Text shown when item is in cart. |
| `className` | `string` | `"flex-1 bg-black ..."` | Root button class (Tailwind default provided). |
| `iconOnly` | `boolean` | `false` | If true renders only the cart icon (no text). |
| `icon` | `React.ReactNode` | `<ShoppingCart size={20} />` | Custom icon node. |
| `showIconWithText` | `boolean` | `true` | When false and `iconOnly` is false, only text is shown; when true shows icon + text. |
| `isOutOfStock` | `boolean` | `undefined` | When true button is disabled and shows tooltip/title "Out of stock". |
| `isInCart` | `boolean` | `false` | When true button displays `inCartText` instead of `addToCartText`. |

Notes:
- Button disables clicks when `isOutOfStock` is truthy.
- Preference: call `onAddToCart` to update store/state; UI consumers can pass `isInCart` based on store selectors.
- Accessibility: `aria-label` and `title` reflect current state (Add / In Cart / Out of stock).

Example
````tsx
// Example: use with Zustand selector
const inCart = useCartStore(s => s.getCartQuantity(product.id) > 0);
const addToCart = useCartStore(s => s.addToCart);

<AddToCart
  onAddToCart={() => addToCart(product.id)}
  isInCart={inCart}
  addToCartText="Buy"
  inCartText="In basket"
/>
`````

### `CategoriesBadgeList`
Renders a list of pill-shaped category tags (lightweight CategoryItem shape).

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `categories` | `CategoryItem[]` | `[]` | Array of category items. Minimal shape: `{ id: string \| number; name: string }`. |
| `maxCategories` | `number` | `1` | Number of categories to show before summarising the rest as `+N`. |
| `showRemainingCount` | `boolean` | `true` | When true shows a `+N` pill for hidden categories. |
| `onCategoryClick` | `(category: CategoryItem) => void` | `() => {}` | Click handler invoked with the clicked category item. |
| `positionClassName` | `string` | `""` | Additional positioning classes for the outer wrapper (eg. `absolute left-2 top-2`). |
| `categoryClassName` | `string` | Tailwind pill default | Classes applied to each category pill. |
| `remainingClassName` | `string` | Tailwind pill default | Classes applied to the `+N` pill. |
| `wrapperClassName` | `string` | `"flex flex-wrap gap-2"` | Inner wrapper classes for layout (flex/grid). |

Notes:
- The component expects lightweight CategoryItem objects (id + name). If you have a richer `Category` type (with slug, parent_id, etc.), map it before passing or in the `onCategoryClick` handler.
- `maxCategories` controls how many items are rendered; remaining items are represented by `+N` when `showRemainingCount` is true.
- Each pill is clickable only when `onCategoryClick` is provided.
- Defaults are chosen to be safe for direct usage in slot overlays; override class names to fit your design system.

Example:
```tsx
import { CategoriesBadgeList } from "./components/categories";

<CategoriesBadgeList
  categories={[
    { id: 1, name: "Shoes" },
    { id: 2, name: "New Arrivals" },
    { id: 3, name: "Sale" },
  ]}
  maxCategories={2}
  onCategoryClick={(c) => console.log("clicked", c)}
  positionClassName="absolute left-2 bottom-2"
/>
```

### `DiscountBadge`
Small badge showing a discount amount.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `discount` | `number` | `25` | Numeric discount value. |
| `discountType` | `"percentage" \| "fixed" \| null` | `"fixed"` | Interpret `discount` as percent or fixed amount. |
| `currency` | `string` | `"USD"` | Currency code for fixed-amount formatting. |
| `fractionDigits` | `number` | `2` | Decimal places for currency formatting. |
| `className` | `string` | Tailwind badge default | Root element CSS classes. |
| `renderLabel` | `(value, type) => ReactNode` | `undefined` | Custom renderer for the badge label. |

Notes:
- Percentage shows as `NN% OFF`; fixed shows formatted currency + `OFF`.
- Renders nothing if `discount` is missing, non-finite, or ≤ 0.

Examples
```tsx
// percentage badge
<DiscountBadge discount={25} discountType="percentage" />

// fixed amount badge ($10 off)
<DiscountBadge discount={10} discountType="fixed" currency="USD" />

// custom label
<DiscountBadge
  discount={5}
  discountType="fixed"
  renderLabel={(v, t) => <span className="px-2 py-1 bg-yellow-500">Save {v} now</span>}
/>
```

### `WishlistButton`
Icon button for adding/removing a product from the wishlist. 

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `isWishlisted` | `boolean` | `false` | Current wishlist state. When true shows the active icon. |
| `onToggle` | `(value: boolean) => void` \| `undefined` | `undefined` | Called with the new boolean state when the button is clicked. Parent/store should update state. |
| `icon` | `React.ReactNode` | `undefined` | Custom icon node when not wishlisted. |
| `activeIcon` | `React.ReactNode` | `undefined` | Custom icon node when wishlisted (rendered instead of `icon`). |
| `className` | `string` | `""` | Root button class(es). |
| `iconClassName` | `string` | `""` | Class(es) applied to the icon element. |
| `ariaLabel` | `string` | `"Add to wishlist"` | Accessible label for the button. |
| `size` | `number` | `22` | Suggested icon size (passed to internal icon components). |
| `animationDuration` | `number` | `200` | Duration in ms used in CSS class name for transition timing. |

Notes
- Keep the component stateless: the parent (or a Zustand store) should own the wishlist array and pass `isWishlisted` + `onToggle`.
- If you prefer store-driven behavior, pass a wrapper that selects from the store and calls the store action inside `onToggle`.
- Accessibility: ensure `ariaLabel` reflects action (e.g., `"Remove from wishlist"` when `isWishlisted` is true).

Example
```tsx
// parent (store)
const isWishlisted = useProductCardStore(s => s.wishlist.includes(product.id));
const toggle = useProductCardStore(s => s.toggleWishlist);

<WishlistButton
  isWishlisted={isWishlisted}
  onToggle={() => toggle(product.id)}
  size={20}
  ariaLabel={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
/>
```

### `ViewDetailsButton`
Simple button to open product details.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `onClick` | `() => void` | `undefined` | Click handler invoked when the button is pressed. |
| `label` | `string` | `"View Details"` | Visible button text. |
| `disabled` | `boolean` | `false` | When true the button is disabled and non-interactive. |
| `className` | `string` | `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-200 transition` | CSS classes applied to the root element; override to customize appearance. |

Notes:
- Use `disabled` to reflect loading / unavailable states.
- Pass a custom `className` to match your design system or to make the button icon-only.
- For accessibility, ensure `label` reflects the action (e.g., `"Open product"`).

Example:
```tsx
<ViewDetailsButton onClick={() => navigate(`/product/${id}`)} />
```

### `ProductImage`
Simple, flexible image component used as a background or an <img>. Supports an overlay slot (children) for badges/buttons and an onClick handler on the root.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `imageUrl` | `string \| null` | `undefined` | Image URL (used as CSS background in `bg` mode, or as `src` in `img` mode). |
| `alt` | `string` | `"Product image"` | Alt text for the image (used for accessibility / when rendering an `<img>`). |
| `mode` | `"bg" \| "img"` | `"bg"` | Render as background (`bg`) or as an actual `<img>` (`img`). |
| `height` | `number \| string` | `200` | Height of the image area (number = px, or any CSS size string). |
| `className` | `string` | `"relative overflow-hidden rounded-lg"` | Classes for the outer container. |
| `imageClassName` | `string` | `"w-full h-full object-cover"` | Classes for the image element or background holder. |
| `overlayClassName` | `string` | `"absolute inset-0 pointer-events-none"` | Classes for the overlay wrapper that holds `children`. |
| `children` | `React.ReactNode` | `undefined` | Nodes rendered on top of the image (badges, buttons, etc.). |
| `onClick` | `React.MouseEventHandler` | `undefined` | Click handler for the image container (e.g. navigate to product). |

Notes
- Background mode (`mode="bg"`) keeps the markup simple and is ideal for decorative/cover images; place interactive overlays as children and give them `pointer-events-auto`.
- Image mode (`mode="img"`) renders a real `<img>` for better accessibility and browser handling of loading/decoding.
- `height` accepts both number and string. If you need responsive aspect-ratio control, wrap the component or supply CSS utilities externally.
- `overlayClassName` default uses `pointer-events-none` so overlay children must opt-in with `pointer-events-auto` to receive pointer events.
- Keep this component presentational; wire interaction state (wishlist/cart) with your Zustand stores from parent components.

Example
```tsx
<ProductImage
  imageUrl={product.images?.[0]?.url}
  mode="bg"
  height={280}
  className="rounded-lg shadow-sm"
  overlayClassName="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none"
  onClick={() => navigate(`/product/${product.id}`)}
>
  <div className="pointer-events-auto self-end">
    <WishlistButton isWishlisted={isWishlisted} onToggle={() => toggleWishlist(product.id)} />
  </div>

  <div className="pointer-events-auto">
    <PriceCard salePrice={product.final_price ?? product.price ?? 0} />
  </div>
</ProductImage>
```

---

## 5. State Management (Zustand)

The package utilizes `zustand` for global state. You can interact with these stores directly if you need to manipulate the cart or wishlist from outside the card (e.g., in a Header component).

### `useCartStore`
```tsx
import { useCartStore } from "product-card/store";

const addToCart = useCartStore((state) => state.addToCart);
const cartQuantity = useCartStore((state) => state.getCartQuantity(productId));
```

### `useProductCardStore`
Manages the wishlist array and active "View Details" product.
```tsx
import { useProductCardStore } from "product-card/store";

const toggleWishlist = useProductCardStore((state) => state.toggleWishlist);
const wishlistIds = useProductCardStore((state) => state.wishlist);
```

### `useCatalogStore`
Handles product fetching, filtering, and sorting.
```tsx
import { useCatalogStore } from "product-card/store";

// Trigger a sort
useCatalogStore.getState().setSortBy("price");
useCatalogStore.getState().setSortOrder("desc");
```

---

## 6. Data Types

Ensure your data matches the `Product` interface for seamless integration.

```typescript
interface Product {
  id: number;
  name: string;
  price: number | null;       // Base price
  final_price: number | null; // Discounted price
  
  images: Array<{
    url: string;
    is_primary: boolean;
    alt_text?: string;
  }>;
  
  brand?: {
    name: string;
  };
  
  categories?: Array<{
    id: number;
    name: string;
  }>;
  
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
}
```

---

## 7. Customization Example

How to style the card using Tailwind overrides without touching the source code:

```tsx
<ProductCard
  product={item}
  // 1. Style the outer container
  containerClassName="bg-slate-900 border-none shadow-xl hover:shadow-2xl transition-all"
  
  // 2. Custom behavior
  showWishlist={false} // Hide default wishlist
  
  // 3. Pass a custom View Details handler
  onViewDetails={(id) => navigate(`/product/${id}`)}
/>
```