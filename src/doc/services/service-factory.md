# Service Factory

A universal service class for API communication with built-in Zustand store integration.

---

## Overview

The ServiceFactory provides:
- Standard CRUD operations (getAll, getById, create, update, delete)
- Custom action support for RPC-style endpoints
- Automatic store integration
- Middleware hooks (before/after request)

---

## Import

```typescript
import { ServiceFactory } from '@/lib/services';
```

---

## Create a Service

### Basic Service

```typescript
import { ServiceFactory } from '@/lib/services';

export interface Product {
  id: number;
  name: string;
  price: number;
}

export const ProductService = new ServiceFactory<Product>({
  endpoint: '/api/v1/products',
  entityName: 'Product',
  store: {
    initialState: {
      list: [],
      selected: null,
      loading: false,
    },
  },
});
```

### Service with Persistence

```typescript
export const ProductService = new ServiceFactory<Product>({
  endpoint: '/api/v1/products',
  entityName: 'Product',
  store: {
    initialState: {
      list: [],
      selected: null,
      loading: false,
    },
    persistName: 'product-store-v1', // Enables localStorage persistence
  },
});
```

### Service with Dynamic Endpoint

```typescript
export const OrderService = new ServiceFactory<Order>({
  endpoint: (params) => `/api/v1/shops/${params.shopId}/orders`,
  entityName: 'Order',
  store: {
    initialState: {
      list: [],
      selected: null,
      loading: false,
    },
  },
});

// Usage
await OrderService.getAll({ params: { shopId: 1 } });
```

---

## API Methods

### getAll

Fetch all resources.

```typescript
const products = await ProductService.getAll({
  params?: object,        // Query parameters
  storeUpdate?: boolean,  // Update Zustand store (default: true)
});
```

**Example:**

```typescript
const products = await ProductService.getAll({
  params: { category: 'electronics', limit: 20 },
});
```

### getById

Fetch a single resource by ID.

```typescript
const product = await ProductService.getById(id, {
  params?: object,
  storeUpdate?: boolean,
});
```

**Example:**

```typescript
const product = await ProductService.getById(123);
```

### create

Create a new resource.

```typescript
const newProduct = await ProductService.create(data, {
  params?: object,
  storeUpdate?: boolean,
});
```

**Example:**

```typescript
const product = await ProductService.create({
  name: 'New Product',
  price: 99.99,
  category: 'electronics',
});
```

### update

Update an existing resource.

```typescript
const updated = await ProductService.update(id, data, {
  params?: object,
  storeUpdate?: boolean,
});
```

**Example:**

```typescript
const product = await ProductService.update(123, {
  price: 79.99,
});
```

### delete

Delete a resource.

```typescript
await ProductService.delete(id, {
  params?: object,
  storeUpdate?: boolean,
});
```

**Example:**

```typescript
await ProductService.delete(123);
```

### customAction

Execute custom RPC-style endpoints.

```typescript
const result = await ProductService.customAction(endpoint, options);
```

**Example:**

```typescript
// Bulk update
const result = await ProductService.customAction('/bulk-update', {
  method: 'POST',
  data: { ids: [1, 2, 3], action: 'archive' },
});

// Clone product
const clone = await ProductService.customAction(`/${productId}/clone`, {
  method: 'POST',
});
```

---

## Store Integration

### Using the React Hook

```tsx
import { ProductService } from './services/ProductService';

function ProductList() {
  const { list, selected, loading } = ProductService.useStore();

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {list.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Store Actions

```typescript
// Get store state
const store = ProductService.getStore();

// Update store directly
store.update((state) => {
  state.list.push(newProduct);
});

// Reset store
store.reset();
```

---

## Response Handling

The ServiceFactory automatically handles the [Response Protocol](../api-reference/response-protocol.md):

**Success Response:**

```json
{
  "status": "success",
  "message": "Product created",
  "data": { "id": 1, "name": "New Product" }
}
```

Returns the `data` portion to your code.

**Error Response:**

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": { "name": ["Required"] }
}
```

Throws an error with the message and errors object.

---

## Middleware Hooks

### Before Request

```typescript
const ProductService = new ServiceFactory<Product>({
  endpoint: '/api/v1/products',
  entityName: 'Product',
  beforeRequest: (config) => {
    // Add authorization header
    config.headers['Authorization'] = `Bearer ${getToken()}`;
    return config;
  },
});
```

### After Response

```typescript
const ProductService = new ServiceFactory<Product>({
  endpoint: '/api/v1/products',
  entityName: 'Product',
  afterResponse: (response) => {
    // Log response
    console.log('API Response:', response);
    return response;
  },
});
```

---

## Complete Example

```typescript
// services/productService.ts
import { ServiceFactory } from '@/lib/services';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  category: string;
  isActive: boolean;
}

export const ProductService = new ServiceFactory<Product>({
  endpoint: '/api/v1/products',
  entityName: 'Product',
  store: {
    initialState: {
      list: [],
      selected: null,
      loading: false,
    },
    persistName: 'product-store-v1',
  },
  beforeRequest: (config) => {
    config.headers['Authorization'] = `Bearer ${getToken()}`;
    return config;
  },
});

// hooks/useProducts.ts
export function useProducts() {
  const list = ProductService.useStore((s) => s.list);
  const loading = ProductService.useStore((s) => s.loading);

  const fetchProducts = async (category?: string) => {
    await ProductService.getAll({
      params: category ? { category } : undefined,
    });
  };

  return { list, loading, fetchProducts };
}
```

---

## TypeScript Generics

The ServiceFactory is fully typed:

```typescript
// Type-safe CRUD operations
const product: Product = await ProductService.getById(1);
await ProductService.create({ name: 'Test' } as Product);
```

---

## Error Handling

```typescript
try {
  await ProductService.delete(123);
} catch (error) {
  console.error(error.message);    // "Cannot delete product"
  console.error(error.errors);     // { id: ["Not found"] }
}
```
