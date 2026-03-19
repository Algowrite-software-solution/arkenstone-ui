# Data Manager

A powerful "Low-Code" engine for building complex CRUD (Create, Read, Update, Delete) interfaces. It bridges your Backend API, Zustand state management, and UI components.

---

## Overview

The Data Manager consists of:

1. **ServiceFactory** - A universal base class that standardizes API calls and manages a generic Zustand store
2. **DataManager** - An intelligent component that reads a configuration object to generate Tables, Lists, Forms, and Layouts automatically

---

## Quick Start

### 1. Create a Service

```typescript
// services/ProductService.ts
import { ServiceFactory } from '@/lib/services';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  category: string;
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
});
```

### 2. Use the Data Manager

```tsx
import { DataManager } from '@/lib/components/data-manager';
import { ProductService, Product } from './services/ProductService';

export default function ProductPage() {
  return (
    <DataManager<Product>
      config={{
        title: "Product Inventory",
        service: ProductService,
        layout: 'split-view',
        display: {
          type: 'table',
          columns: [
            { accessorKey: 'name', header: 'Product Name' },
            { accessorKey: 'price', header: 'Price' },
          ],
        },
        form: {
          fields: [
            { name: 'name', label: 'Product Name', type: 'text', validation: { required: true } },
            { name: 'price', label: 'Price', type: 'number' },
          ],
        },
      }}
    />
  );
}
```

---

## Configuration Reference

### Top Level Config

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Page title |
| `description` | `string` | Optional subtitle |
| `service` | `ServiceFactory` | Service instance |
| `layout` | `'split-view' \| 'modal'` | Layout mode |
| `devMode` | `boolean` | Enable console logging |
| `modalSize` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | Modal size |

### Display Configuration

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'table' \| 'list' \| 'grid'` | Visualization mode |
| `columns` | `ColumnDef<T>[]` | Table columns |
| `searchKeys` | `string[]` | Searchable fields |
| `actions` | `{ view?: boolean; edit?: boolean; delete?: boolean }` | Row actions |
| `disableCreate` | `boolean` | Hide create button |
| `renderItem` | `(item: T) => ReactNode` | Custom item renderer |

### Form Configuration

| Property | Type | Description |
|----------|------|-------------|
| `fields` | `FieldConfig[]` | Form fields |
| `liveUpdate` | `boolean` | Auto-save on change |
| `submitLabel` | `string` | Save button label |

---

## Field Configuration

Every form field is defined by a `FieldConfig` object.

```typescript
interface FieldConfig {
  name: string;              // Field key
  label: string;             // UI label
  type: InputType;           // Field type
  validation?: ValidationRule;
  placeholder?: string;
  hidden?: boolean | (values) => boolean;
  disabled?: boolean;
  options?: InputOption[];
  fetchOptions?: () => Promise<InputOption[]>;
  uploadEndpoint?: string;
  renderCustom?: (props) => ReactNode;
}
```

### Supported Field Types

| Type | Description |
|------|-------------|
| `text` | Single line text input |
| `number` | Number input |
| `email` | Email input with validation |
| `password` | Password input |
| `textarea` | Multi-line text |
| `select` | Dropdown (sync or async) |
| `checkbox` | Boolean toggle |
| `date` | Date picker |
| `image` | File upload/preview |
| `custom` | Custom component |

### Validation Rules

```typescript
{
  name: 'email',
  type: 'text',
  validation: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email',
    custom: (value, allValues) => {
      if (value === 'admin' && !allValues.email.includes('@corp.com')) {
        return "Admins must have a corporate email";
      }
      return null;
    }
  }
}
```

---

## Layout Modes

### Split View

Best for: Admin panels, Master-Detail views.

```tsx
<DataManager
  config={{
    layout: 'split-view',
    // ...
  }}
/>
```

Shows list on left, form on right. Collapses on mobile.

### Modal View

Best for: Dense data tables where editing is secondary.

```tsx
<DataManager
  config={{
    layout: 'modal',
    modalSize: 'lg',
    // ...
  }}
/>
```

Table takes full width, editing opens in popup dialog.

---

## Advanced Examples

### Async Select (Dropdown from API)

```typescript
{
  name: 'categoryId',
  label: 'Category',
  type: 'select',
  fetchOptions: async () => {
    const categories = await apiGet('/categories');
    return categories.map(c => ({ label: c.name, value: c.id }));
  }
}
```

### Custom Input Component

```typescript
{
  name: 'color',
  label: 'Product Color',
  type: 'custom',
  renderCustom: ({ value, onChange, error }) => (
    <div className="flex gap-2">
      {['#FF0000', '#00FF00', '#0000FF'].map(c => (
        <div
          key={c}
          onClick={() => onChange(c)}
          className={`w-8 h-8 rounded-full cursor-pointer ${
            value === c ? 'ring-2 ring-black' : ''
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  )
}
```

### Conditional Field Visibility

```typescript
{
  name: 'department',
  label: 'Department',
  type: 'text',
  hidden: (values) => values.role !== 'manager'
}
```

### Image Upload

```typescript
{
  name: 'image',
  label: 'Product Image',
  type: 'image',
  uploadEndpoint: '/api/v1/upload'
}
```

---

## Service Factory Integration

### Using the Store

```tsx
// Reactive hook
const { list, loading } = ProductService.useStore();

// Manual API call
const data = await ProductService.getAll({ params: { active: true } });
```

### CRUD Operations

```typescript
// Get all
const products = await ProductService.getAll();

// Get by ID
const product = await ProductService.getById(1);

// Create
const newProduct = await ProductService.create({ name: 'New Product' });

// Update
const updated = await ProductService.update(1, { price: 99.99 });

// Delete
await ProductService.delete(1);

// Custom action
const result = await ProductService.customAction('/custom-endpoint', {
  method: 'POST',
  data: { custom: 'payload' }
});
```

---

## Best Practices

1. **Type Safety**: Always define your data types with TypeScript interfaces
2. **Validation**: Add validation rules to all required fields
3. **Error Handling**: Use `devMode: true` during development to debug issues
4. **Performance**: Use `searchKeys` for efficient client-side search
5. **UX**: Set appropriate `placeholder` values for form fields
