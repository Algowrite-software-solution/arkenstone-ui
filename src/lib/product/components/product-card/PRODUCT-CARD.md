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
  className={{
    container: "border-blue-500 border-2",
    imageContainer: "w-1/3",
    detailsContainer: "w-2/3 p-4"
  }}
/>
```

Note: ProductCardLayout now accepts a `className` object with optional keys:
- `container`, `compactWrapper`, `detailedWrapper`, `imageContainer`, `detailsContainer`
use these to override per-part styles instead of a single `containerClassName` prop.

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
Props (high level)
- imageUrl, imageAlt, width, height
- background: ReactNode — render any element behind overlays (carousel, video, <img>, etc.)
- topLeft, topRight, bottomLeft, bottomRight, center — overlay slots
- topPlaceholder, bottomPlaceholder — shown centered when both left+right for the row are missing
- className: { container, image, overlay, corner, center, background, backgroundWrapper } — per-part class overrides
- placeholderClassName: { top, bottom } — wrapper classes for top/bottom rows

**Usage:**
```tsx
import { ProductImageLayout } from "product-card/layouts";

<ProductImageLayout
  imageUrl="https://example.com/shoe.jpg"
  height={300}

  // overlay slots
  topLeft={<WishlistButton isWishlisted />}
  topRight={<DiscountBadge discount={50} />}
  bottomLeft={null}
  bottomRight={null}

  // when both bottomLeft & bottomRight are absent this placeholder is centered
  bottomPlaceholder={<CategoriesBadgeList categories={product.categories} />}

  // replace the CSS background with any node (carousel / video)
  background={<video src="preview.mp4" autoPlay muted loop className="w-full h-full object-cover" />}

  // class overrides (object form)
  className={{
    container: "relative rounded-lg overflow-hidden bg-gray-100",
    image: "absolute inset-0 bg-center bg-cover",
    overlay: "absolute inset-0 pointer-events-none z-10",
    corner: "p-2 pointer-events-auto",
    center: "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto",
    backgroundWrapper: "absolute inset-0 overflow-hidden",
    background: "absolute inset-0",
  }}

  placeholderClassName={{
    top: "absolute left-0 right-0 top-2 px-2 flex items-center",
    bottom: "absolute left-0 right-0 bottom-2 px-2 flex items-center"
  }}
/>
```

---

## 4. Atomic Components

These components are used internally but are exported for custom compositions.

### `PriceCard`
Displays price, original price (strikethrough), and discount percentage.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `price` | `number \| null` | `null` | Original/base price. |
| `salePrice` | `number \| null` | `null` | Final/sale price (falls back to `price` when absent). |
| `discountType` | `"percentage" \| "fixed" \| null` | `null` | Hint for interpreting `discountValue`. |
| `discountValue` | `number \| null` | `null` | Discount amount (percent when `discountType === "percentage"`, fixed amount when `"fixed"`). |
| `showOriginalPrice` | `boolean` | `true` | Show original price as strikethrough when greater than `salePrice`. |
| `showDiscountPercentage` | `boolean` | `true` | Show computed or provided discount percentage. |
| `currency` | `string` | `"USD"` | Currency code used by Intl.NumberFormat. |
| `fractionDigits` | `number` | `2` | Maximum fraction digits for formatting. |
| `className` | `object` | default classes object | Object of per-part class overrides: `{ wrapper?, price?, originalPrice?, discount? }` |

Notes:
- A discount is considered present when both `price` and `salePrice` are numbers and `price > salePrice`.
- Priority for discount display:
  1. If `discountType === "percentage"` and `discountValue` provided → use it.
  2. If `discountType === "fixed"` and `discountValue` + `price` provided → compute percent = round((discountValue / price) * 100).
  3. Else infer percent from `price` and `salePrice`.
- Missing/null values are handled gracefully; when `salePrice` is absent the component displays the `price`.

Example
```tsx
import { PriceCard } from "./components/price-card";

// explicit percentage from backend
<PriceCard price={100} salePrice={75} discountType="percentage" discountValue={25} />

// fixed discount (backend provided fixed amount)
<PriceCard price={120} salePrice={90} discountType="fixed" discountValue={30} />

// fallback (infer from prices)
<PriceCard price={200} salePrice={150} />

// customize styles / currency (use className object)
<PriceCard
  price={500}
  salePrice={450}
  currency="EUR"
  fractionDigits={2}
  className={{
    wrapper: "flex items-baseline gap-3",
    price: "text-2xl font-bold"
  }}
/>
```

### `BrandTitle`
Handles brand and product title layout and styling. Renders brand and title in different arrangements (before/after/top/bottom) and supports simple class overrides.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `brand` | `React.ReactNode` | `"test brand"` | Brand content (string, element, or node). |
| `title` | `React.ReactNode` | `"test title"` | Product title content (string, element, or node). |
| `show` | `{ brand?: boolean; title?: boolean }` | `{ brand: true, title: true }` | Toggle rendering of brand/title via an object. |
| `brandPlacement` | `"before" \| "after" \| "top" \| "bottom" \| "hidden"` | `"before"` | Position of brand relative to title: `before` = `<brand> - <title>`, `after` = `<title> - <brand>`, `top`/`bottom` = stacked, `hidden` = title only. |
| `className` | `{ brand?: string; title?: string; wrapper?: string; separator?: string }` | `{ separator: "px-2 opacity-60" }` | Per-part class overrides: brand, title, wrapper and separator. |

Notes:
- Separator (`-`) is rendered for horizontal placements (`before` / `after`) when both brand and title are shown. Override via `className.separator`.
- Use `show` to selectively hide brand or title without changing provided content.
- `brandPlacement="hidden"` renders only the title (equivalent to `show.brand = false` but explicit).

Example:
```tsx
<BrandTitle
  brand="ACME"
  title={<strong>Falcon Shoes</strong>}
  brandPlacement="top"
  show={{ brand: true, title: true }}
  className={{
    brand: "text-xs text-gray-500",
    title: "text-lg font-semibold",
    wrapper: "truncate",
    separator: "px-2 opacity-60"
  }}
/>
```

### `AddToCart`
Primary action button. Handles "Out of Stock" and "In Cart" states, supports icon-only mode and custom text/styles.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `onAddToCart` | `() => void` | `undefined` | Click handler invoked when button clicked (if not disabled). |
| `labels` | `{ addToCartText?: string; inCartText?: string }` | `{ addToCartText: "Add to Cart", inCartText: "In Cart" }` | Text labels for button states. |
| `state` | `{ isOutOfStock?: boolean; isInCart?: boolean }` | `{ isOutOfStock: false, isInCart: false }` | Visual state flags (disable / show "In Cart"). |
| `className` | `string` | Tailwind default | Root button classes. |
| `iconOnly` | `boolean` | `false` | If true renders only the cart icon (no text). |
| `icon` | `React.ReactNode` | `<ShoppingCart size={20} />` | Custom icon node. |
| `showIconWithText` | `boolean` | `true` | When true shows icon alongside text (unless `iconOnly`). |
| `aria / title` | auto | — | `aria-label` and `title` reflect current state (`Add to Cart` / `In Cart` / `Out of stock`). |

Notes:
- Button is disabled when `state.isOutOfStock` is truthy.
- Component is presentational — call `onAddToCart` to update your store; pass `state.isInCart` from your cart selector.
- Use `labels` to localize/customize button text.

Example
```tsx
// using Zustand selectors
const isInCart = useCartStore(s => s.getCartQuantity(product.id) > 0);
const addToCart = useCartStore(s => s.addToCart);

<AddToCart
  onAddToCart={() => addToCart(product.id)}
  state={{ isInCart, isOutOfStock: product.stock === 0 }}
  labels={{ addToCartText: "Buy", inCartText: "In basket" }}
/>
```

### `CategoriesBadgeList`
Renders a list of pill-shaped category tags (lightweight CategoryItem shape).

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `categories` | `CategoryItem[]` | `[]` | Array of category items: `{ id: string \| number; name: string }`. |
| `maxCategories` | `number` | `1` | How many items to show before summarising the rest as `+N`. |
| `showRemainingCount` | `boolean` | `true` | When true shows the `+N` pill for hidden items. |
| `onCategoryClick` | `(category: CategoryItem) => void` | `() => {}` | Click handler called with the clicked category. |
| `className` | `object` | See defaults below | Object of class overrides: `{ position?: string; category?: string; remaining?: string; wrapper?: string }` — controls placement and pill styles. |

Default `className` values used by the component:
- position: `""`
- category: `bg-black text-white px-2 py-1 text-xs font-semibold rounded-full shadow`
- remaining: `bg-black text-white px-2 py-1 text-xs font-semibold rounded-full`
- wrapper: `flex flex-wrap gap-2`

Notes:
- Component returns `null` when `categories` is empty.
- `maxCategories` controls the slice shown; the remaining count = `categories.length - maxCategories`.
- Use `onCategoryClick` to map lightweight items to your fuller `Category` shape (e.g., add `slug`) before updating global store.
- Use `className.position` to place the badge group (e.g., `absolute left-2 bottom-2`).

Example:
```tsx
<CategoriesBadgeList
  categories={[{ id: 1, name: "Shoes" }, { id: 2, name: "Sale" }]}
  maxCategories={2}
  onCategoryClick={(c) => setSelectedCategory({ id: Number(c.id), name: c.name, slug: c.name.toLowerCase().replace(/\s+/g, "-") })}
  className={{
    position: "absolute left-2 bottom-2",
    category: "bg-white text-black px-2 py-1 rounded-full",
  }}
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
| `onToggle` | `(value: boolean) => void \| undefined` | `undefined` | Called with the next boolean state when clicked. Parent/store should update state. |
| `icon` | `React.ReactNode` | `undefined` | Custom icon node when not wishlisted. |
| `activeIcon` | `React.ReactNode` | `undefined` | Custom icon node when wishlisted (rendered instead of `icon`). |
| `ariaLabel` | `string` | `"Add to wishlist"` | Accessible label for the button; update it when state changes (e.g., `"Remove from wishlist"`). |
| `size` | `number` | `22` | Icon size in pixels. |
| `className` | `{ button?: string; icon?: string }` | `{ button: "", icon: "" }` | Per-part class overrides: `button` and `icon`. |
| `animationDuration` | `number` | `200` | Transition duration (ms) used in CSS class utility; adjust to match your animation utilities. |

Notes
- Component is stateless — the parent (or a store) must own and update wishlist state.
- `onToggle` receives the new boolean state (the component calls it with `!isWishlisted`).
- Ensure `ariaLabel` reflects the action for accessibility (e.g., `"Remove from wishlist"` when `isWishlisted` is true).

Example
```tsx
// parent (store)
const isWishlisted = useProductCardStore(s => s.wishlist.includes(product.id));
const toggleWishlist = useProductCardStore(s => s.toggleWishlist);

// simple wrapper that calls store.toggle(product.id)
<WishlistButton
  isWishlisted={isWishlisted}
  onToggle={() => toggleWishlist(product.id)}
  size={20}
  ariaLabel={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
  className={{ button: "p-1 rounded-full bg-white/80", icon: "text-red-500" }}
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
Simple, flexible image component used as a CSS background or as a real <img>. Supports overlay children (badges/buttons) and an onClick on the root.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `imageUrl` | `string \| null` | `undefined` | Image URL (used as background in `bg` mode or as `src` in `img` mode). |
| `alt` | `string` | `"Product image"` | Alt text for the `<img>` (when `mode === "img"`) and accessibility label. |
| `mode` | `"bg" \| "img"` | `"bg"` | `"bg"` uses CSS background-image; `"img"` renders an `<img>` element. |
| `height` | `number \| string` | `200` | Height of the image area (number = px, or any CSS size string). |
| `className` | `object` | `{ wrapper: "relative overflow-hidden rounded-lg", image: "w-full h-full object-cover", overlay: "absolute inset-0 pointer-events-none" }` | Per-part class overrides: `{ wrapper?, image?, overlay? }`. |
| `children` | `React.ReactNode` | `undefined` | Overlay nodes rendered above the image (badges, buttons). Use `pointer-events-auto` on interactive children. |
| `onClick` | `React.MouseEventHandler` | `undefined` | Click handler attached to the root container (e.g. navigate to product). |

Notes
- Use `mode="img"` for an actual <img> (better for accessibility / SEO); `mode="bg"` is simpler for decorative/cover images.
- `className.image` is applied to the inner `<img>` or background holder; `className.overlay` defaults to `pointer-events-none` so overlay children must opt into `pointer-events-auto`.
- `height` accepts numbers and strings; numbers are converted to px.
- Keep the component presentational — wire wishlist/cart state from parent stores or callbacks.

Example
```tsx
<ProductImage
  imageUrl={product.images?.[0]?.url}
  mode="bg"
  height={280}
  className={{
    wrapper: "rounded-lg shadow-sm relative overflow-hidden",
    image: "w-full h-full object-cover",
    overlay: "absolute inset-0 flex flex-col justify-between p-2 pointer-events-none"
  }}
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

  // Prices
  price?: number | null;       // Base / original price
  sale_price?: number | null;  // Final / discounted price 

  // Images
  primary_image?: {
    image_url: string;
    alt_text?: string;
  } | null;
  images?: Array<{
    image_url: string;
    is_primary?: boolean;
    alt_text?: string;
  }>;

  // Brand
  brand?: {
    name?: string;
  };

  // Categories (lightweight)
  categories?: Array<{
    id: number | string;
    name: string;
  }>;

  // Discount metadata
  has_discount?: boolean;
  discount_type?: "percentage" | "fixed";
  discount_value?: number | null;
}
```

---

## 7. Customization Example

How to style and wire behavior without modifying library source:

```tsx
<ProductCard
  product={item}
  // 1. Style the outer container
  containerClassName="bg-slate-900 border-none shadow-xl hover:shadow-2xl transition-all"

  // 2. Toggle internals
  showWishlist={false} // Hide default wishlist badge
  showDiscount={true}
  showPrice={true}

  // 3. Override handlers (optional — components use Zustand by default)
  onToggleWishlist={(id, wishlisted) => {
    // custom side-effect + delegate to store if needed
    console.log('wishlist toggled', id, wishlisted);
    // use store action here if you want
  }}
  onAddToCart={(id) => {
    // call your API / store
    console.log('add to cart', id);
  }}
  onViewDetails={(id) => navigate(`/product/${id}`)}
/>
```