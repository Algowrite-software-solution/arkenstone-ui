# API Utilities

Wrapper around Axios for standardized API communication with automatic response handling and toast notifications.

---

## Import

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/hooks/api';
```

---

## Configuration

The API client has these defaults:
- **Base URL**: `/api/v1`
- **Headers**: `application/json`, CSRF protection
- **Credentials**: Cookies sent automatically

---

## Options

Every request method accepts this configuration:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `any` | `{}` | Request body |
| `params` | `any` | `{}` | Query parameters |
| `headers` | `any` | `{}` | Custom headers |
| `displayError` | `boolean` | `true` | Show error toast |
| `displaySuccess` | `boolean` | `false` | Show success toast |
| `isMultipart` | `boolean` | `false` | File upload mode |
| `onSuccess` | `function` | - | Success callback |
| `onError` | `function` | - | Error callback |

---

## Methods

### apiGet

```typescript
const data = await apiGet(url, options);
```

**Example:**

```typescript
const user = await apiGet('/user/profile');
const products = await apiGet('/products', {
  params: { category: 'electronics', page: 1 },
});
```

### apiPost

```typescript
await apiPost(url, options);
```

**Example:**

```typescript
await apiPost('/products', {
  data: { name: 'New Product', price: 99.99 },
  displaySuccess: true,
  onSuccess: (product) => console.log('Created:', product),
});
```

### apiPut

```typescript
await apiPut(url, options);
```

**Example:**

```typescript
await apiPut(`/products/${id}`, {
  data: { price: 79.99 },
  displaySuccess: true,
});
```

### apiDelete

```typescript
await apiDelete(url, options);
```

**Example:**

```typescript
await apiDelete(`/products/${id}`, {
  displaySuccess: true,
});
```

---

## File Upload

```typescript
const formData = new FormData();
formData.append('file', selectedFile);

await apiPost('/upload', {
  data: formData,
  isMultipart: true,
  displaySuccess: true,
});
```

---

## Form Validation Errors

Handle field-level validation errors:

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

---

## Complete Example

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/hooks/api';

// Fetch data
const fetchUser = async () => {
  try {
    const user = await apiGet('/user/profile');
    setUser(user);
  } catch (error) {
    console.error(error.message);
  }
};

// Create with success toast
const createProduct = async (data) => {
  try {
    const product = await apiPost('/products', {
      data,
      displaySuccess: true,
    });
    setProducts((prev) => [...prev, product]);
  } catch (error) {
    // Error toast shown automatically
  }
};

// Update
const updateProduct = async (id, updates) => {
  await apiPut(`/products/${id}`, {
    data: updates,
    displaySuccess: true,
  });
};

// Delete with confirmation
const deleteProduct = async (id) => {
  if (confirm('Are you sure?')) {
    await apiDelete(`/products/${id}`, {
      displaySuccess: true,
    });
  }
};
```

---

## Error Response Format

The API expects responses following the [Response Protocol](../api-reference/response-protocol.md):

```json
{
  "status": "success | error",
  "message": "Human readable message",
  "data": { ... },
  "errors": { ... }
}
```
