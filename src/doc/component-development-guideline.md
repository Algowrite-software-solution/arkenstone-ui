Here is a comprehensive architectural guideline for your package, **Arkenstone UI**. This document is designed for you (the package developer) to maintain consistency, scalability, and the "Universal" promise as you grow the library.

***

# Arkenstone UI: Architectural Guidelines & Best Practices

## 1. Core Philosophy
**"Works instantly, customizable endlessly."**

1.  **Universal Host Compatibility:** The package must survive in hostile environments (Legacy Tailwind 3, Tailwind 4, Vanilla CSS, Laravel Blade wrappers).
2.  **Inversion of Control:** The package provides defaults, but the host application owns the final decision on rendering and logic.
3.  **Headless + Styled:** We provide "Headless" logic hooks for pure behavior, and "Styled" components for immediate usage.

---

## 2. Build & Distribution Pipeline (The "Universal" Fix)
To ensure the package works in Laravel 12 (T4) and Laravel 10 (T3) without config:

### CSS Strategy
*   **Source:** Write in **Tailwind 4** using `@theme` and `oklch` variables.
*   **Compilation:** Flatten CSS layers during build to support legacy browsers and Tailwind 3 parsers.
*   **Isolation:** NEVER use `@layer base` or global resets (Preflight).
*   **Injection:** Use `vite-plugin-lib-inject-css` to auto-inject styles.

**Build Config Rule:**
```typescript
// vite.config.ts
build: {
  cssTarget: "chrome96", // Flattens @layer for compatibility
  lib: { ... },
  rollupOptions: { ... }
}
```

### Class Merging
Every component **MUST** override default styles using a standardized merge utility.
```typescript
// src/lib/util/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 3. The "Deep Injection" Pattern (Modularity)
This is the core requirement: *Ability to switch any internal component without breaking the parent.*

We will use the **Registry Prop Pattern** combined with **Compound Components**.

### A. The Pattern
Instead of hardcoding sub-components, the parent component accepts a `components` or `slots` prop that defaults to your internal implementations.

### B. Implementation Example
Let's look at a complex `ProductCard`:

```tsx
// 1. Define the Interface for Injectable Parts
export interface ProductCardSlots {
  Image?: React.ComponentType<any>;
  Price?: React.ComponentType<any>;
  Title?: React.ComponentType<any>;
  AddToCart?: React.ComponentType<any>;
}

interface ProductCardProps {
  product: ProductData;
  // The magic prop
  slots?: ProductCardSlots; 
  className?: string;
}

// 2. Default Implementations
const DefaultImage = ({ src }) => <img src={src} className="w-full h-48 object-cover" />;
const DefaultPrice = ({ price }) => <span className="text-lg font-bold">${price}</span>;

// 3. The Main Component
export const ProductCard = ({ product, slots = {}, className }: ProductCardProps) => {
  // Merge user slots with defaults
  const Components = {
    Image: slots.Image || DefaultImage,
    Price: slots.Price || DefaultPrice,
    Title: slots.Title || DefaultTitle,
    AddToCart: slots.AddToCart || DefaultAddToCart,
  };

  return (
    <div className={cn("border rounded p-4", className)}>
      <Components.Image src={product.image} />
      <div className="mt-2">
        <Components.Title>{product.name}</Components.Title>
        <div className="flex justify-between mt-2">
          <Components.Price price={product.price} />
          <Components.AddToCart productId={product.id} />
        </div>
      </div>
    </div>
  );
};
```

### C. Usage in Host App
The user can now replace *just* the price logic (e.g., to add tax calculation) without rebuilding the whole card.

```tsx
<ProductCard 
  product={data} 
  slots={{
    // Inject custom price component, keep everything else default
    Price: ({ price }) => <span className="text-red-500">Sale: ${price * 0.9}</span>
  }} 
/>
```

---

## 4. Component Levels (Atomic Design for E-commerce)

Organize your library into three tiers to allow different levels of customization.

### Tier 1: Atoms (The Primitives)
*   **Responsibility:** Styling and basic interactivity.
*   **Examples:** `Button`, `Badge`, `PriceFormat`, `Skeleton`.
*   **Rule:** Must accept `className` and `asChild` (Polymorphism via Radix Slot).

### Tier 2: Molecules (The E-commerce Blocks)
*   **Responsibility:** Single feature logic.
*   **Examples:** `AddToCartButton` (handles loading state), `ProductImageGallery` (handles slide logic), `QuantitySelector`.
*   **Rule:** Must export their internal Logic Hook (e.g., `useQuantity`).

### Tier 3: Organisms (The Pre-configured Layouts)
*   **Responsibility:** "Zero Config" usage. Assemblies of Molecules.
*   **Examples:** `ProductCard`, `CartDrawer`, `CheckoutForm`.
*   **Rule:** Must implement the **Deep Injection Pattern** (slots) defined in Section 3.

---

## 5. Logic & Behavior (Headless Hooks)
To support 100% customization of behavior, strictly separate Logic from UI.

**Don't write logic inside the component. Write a hook.**

### Example: Add To Cart
**1. The Hook (Behavior):**
```typescript
// src/lib/hooks/useAddToCart.ts
export const useAddToCart = (product, options) => {
  const [loading, setLoading] = useState(false);
  
  const add = async () => {
    setLoading(true);
    await api.post('/cart', { id: product.id });
    setLoading(false);
    options.onSuccess?.();
  };

  return { add, loading };
};
```

**2. The Component (UI):**
```tsx
// src/lib/components/AddToCart.tsx
export const AddToCart = ({ product, ...props }) => {
  // Use the hook
  const { add, loading } = useAddToCart(product, props);
  
  return (
    <Button onClick={add} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
};
```

**Benefit:** If the Host App uses Redux instead of your API, they can import the `AddToCart` UI component but pass a custom `onClick` handler, OR they can use your `useAddToCart` hook with their own custom UI.

---

## 6. Theming & Design Tokens
Since Tailwind 4 is the engine, we use CSS Variables for runtime theming.

**Required Variables (in `app.css`):**
Define semantic names, not color names.
*   `--primary`: Main brand color.ad
*   `--primary-foreground`: Text on top of primary.
*   `--destructive`: Error/Delete actions.
*   `--radius`: Global border radius.

**Host App Customization:**
The host developer simply overwrites these CSS variables in their global CSS to rebrand the entire UI library instantly.

```css
/* Host App CSS */
:root {
  --primary: oklch(0.6 0.15 200); /* Changes Arkenstone Blue to Teal */
  --radius: 0px; /* Makes everything square */
}
```

---

## 7. Accessibility (A11y) "Zero Config"
The user should not have to think about ARIA attributes.
*   **Interactive Elements:** Use Radix UI primitives internally (Dialogs, Tooltips, Popovers).
*   **Forms:** Ensure `id` and `for` labels are auto-generated if not provided.
*   **Keyboard Nav:** All "Molecules" (Galleries, Dropdowns) must support arrow key navigation out of the box.

---

## 8. E-commerce Specific Features Checklist
To be a true "E-commerce Framework", your package should standardized these prop interfaces:

1.  **Price Object:** consistently handle `{ amount, currency, formatted }`.
2.  **Product Variant Handling:** Standardize how users select "Size: M", "Color: Red".
3.  **Image Optimization:** The `Image` slot should support passing `srcSet` or Next.js `<Image />` component via the injection pattern.
4.  **Internationalization (i18n):**
    *   Do not hardcode symbols like `$`.
    *   Accept a `currency` prop or a `LocaleProvider` context.

---

## 9. Developer Experience (DX) for the Host

### Auto-Import (Tree Shaking)
Ensure `package.json` sideEffects are configured so that unused components (e.g., `CheckoutForm`) are not bundled if the user only imports `Button`.

### Typed Props (TypeScript)
Export all interfaces.
```typescript
export type { ProductCardProps, ProductCardSlots } from './components/ProductCard';
```

### Storybook as Documentation
Your Storybook isn't just for testing. It is the documentation.
*   Create a Story for "Default Usage".
*   Create a Story for "Custom Slot Injection" (Show how to replace the Image).
*   Create a Story for "Theming" (Show it with different CSS variables).

---

## Summary of the "Arkenstone Standard"

1.  **Tailwind 4 Source -> Tailwind 3 Compatible Output.**
2.  **`cn()` wrapper** on every single DOM element for class merging.
3.  **Slots/Registry Pattern** for deep component replacement.
4.  **Hooks-first** architecture for logic reuse.
5.  **CSS Variables** for global branding.
6.  **No Global CSS Resets** (Preflight) in the distribution build.