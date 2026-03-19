# API Hooks

HTTP client utilities for API communication.

---

## Import

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/hooks/api';
```

---

## Configuration

Default configuration:
- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **Credentials**: Cookies sent automatically

---

## Options

All methods accept an optional options object:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` | `any` | `{}` | Request body |
| `params` | `any` | `{}` | Query parameters |
| `headers` | `any` | `{}` | Custom headers |
| `displayError` | `boolean` | `true` | Show error toast |
| `displaySuccess` | `boolean` | `false` | Show success toast |
| `isMultipart` | `boolean` | `false` | File upload mode |
| `onSuccess` | `function` | - | Success callback |
| `onError` | `function` | - | Error callback |

---

## apiGet

GET request.

```typescript
const data = await apiGet(url, options);
```

```typescript
// Simple GET
const user = await apiGet('/user/profile');

// With parameters
const products = await apiGet('/products', {
  params: { category: 'electronics', page: 1 },
});
```

---

## apiPost

POST request.

```typescript
await apiPost(url, options);
```

```typescript
// Create resource
await apiPost('/products', {
  data: { name: 'New Product', price: 99.99 },
  displaySuccess: true,
});

// File upload
const formData = new FormData();
formData.append('file', file);

await apiPost('/upload', {
  data: formData,
  isMultipart: true,
});
```

---

## apiPut

PUT request.

```typescript
await apiPut(url, options);
```

```typescript
// Update resource
await apiPut(`/products/${id}`, {
  data: { price: 79.99 },
  displaySuccess: true,
});
```

---

## apiDelete

DELETE request.

```typescript
await apiDelete(url, options);
```

```typescript
// Delete resource
await apiDelete(`/products/${id}`, {
  displaySuccess: true,
});
```

---

## Error Handling

### Automatic Toast

Errors are displayed automatically by default.

```typescript
// Shows error toast automatically
await apiGet('/invalid-endpoint');
```

### Custom Error Handler

```typescript
await apiPost('/register', {
  data: formData,
  displayError: true,
  onError: (errors) => {
    // errors: { email: ["Invalid"], password: ["Too short"] }
    form.setErrors(errors);
  },
});
```

### Try/Catch

```typescript
try {
  await apiDelete(`/products/${id}`);
} catch (error) {
  console.error(error.message);
  console.error(error.errors);
}
```

---

## Complete Example

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/hooks/api';
import { useState } from 'react';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/products', {
        params: { active: true },
      });
      setProducts(data);
    } catch (error) {
      // Error toast shown automatically
    } finally {
      setLoading(false);
    }
  };

  // Create product
  const createProduct = async (productData) => {
    try {
      const newProduct = await apiPost('/products', {
        data: productData,
        displaySuccess: true,
      });
      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      // Handled
    }
  };

  // Update product
  const updateProduct = async (id, updates) => {
    try {
      await apiPut(`/products/${id}`, {
        data: updates,
        displaySuccess: true,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (error) {
      // Handled
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await apiDelete(`/products/${id}`, {
          displaySuccess: true,
        });
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        // Handled
      }
    }
  };

  return (
    <div>
      {/* Render products */}
    </div>
  );
}
```

---

## Response Protocol

API responses follow the [Response Protocol](../api-reference/response-protocol.md):

```json
{
  "status": "success",
  "message": "Product created",
  "data": { ... }
}
```

The utility returns the `data` portion directly to your code.
