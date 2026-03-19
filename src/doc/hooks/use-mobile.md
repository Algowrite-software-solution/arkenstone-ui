# useMobile Hook

Detect mobile viewport for responsive design.

---

## Import

```typescript
import { useMobile } from '@/lib/hooks/use-mobile';
```

---

## Usage

```typescript
const isMobile = useMobile();
```

---

## Return Value

| Value | Type | Description |
|-------|------|-------------|
| `isMobile` | `boolean` | True if viewport < 768px |

---

## Example

```tsx
import { useMobile } from '@/lib/hooks/use-mobile';

function ResponsiveLayout() {
  const isMobile = useMobile();

  return (
    <div>
      {isMobile ? (
        <MobileNavigation />
      ) : (
        <DesktopNavigation />
      )}
    </div>
  );
}
```

---

## Example with Conditional Rendering

```tsx
import { useMobile } from '@/lib/hooks/use-mobile';

function ProductPage({ product }) {
  const isMobile = useMobile();

  return (
    <div className={isMobile ? 'p-2' : 'p-6'}>
      <h1 className={isMobile ? 'text-lg' : 'text-2xl'}>
        {product.name}
      </h1>
      
      <div className={isMobile ? 'flex-col' : 'flex gap-4'}>
        <ProductImage src={product.image} />
        <ProductDetails details={product.details} />
      </div>
    </div>
  );
}
```

---

## Technical Details

The hook uses a media query breakpoint at 768px (Tailwind's `md` breakpoint).
