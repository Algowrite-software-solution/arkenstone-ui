# Generic Service & Data Manager Architecture
**Documentation & Usage Guide**

## Overview

This package provides a robust, "Low-Code" style engine for building complex CRUD (Create, Read, Update, Delete) interfaces in React. It bridges the gap between your Backend API, Local State Management (Zustand), and UI Components (Tailwind/Shadcn).

**Core Philosophy:**
1.  **ServiceFactory**: A universal base class that standardizes API calls and manages a generic Zustand store.
2.  **DataManager**: An intelligent component that reads a configuration object to generate Tables, Lists, Forms, and Layouts automatically.
3.  **Type Safety**: Heavily relies on TypeScript Generics to ensure your data shapes are respected throughout the application.

---

## 1. The Service Factory

Before building a UI, you must define a **Service**. This service acts as the single source of truth for your data entity.

### Basic Implementation
Create a new file (e.g., `services/ProductService.ts`).

```typescript
import { ServiceFactory } from 'generic-service-factory'; // Import path

// 1. Define your Data Types
export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    category: string;
}

// 2. Instantiate the Service
export const ProductService = new ServiceFactory<Product>({
    // The Base URL for this entity. 
    // Can be a string ('/products') or a function (() => `/shops/${shopId}/products`)
    endpoint: '/api/v1/products',
    
    // Friendly name for logs and toasts
    entityName: 'Product',

    // Store Configuration
    store: {
        // Initial State
        initialState: {
            list: [],
            selected: null,
            loading: false
        },
        // Optional: Persist data to localStorage
        persistName: 'product-store-v1' 
    }
});
```

### Advanced Service Features
You can access the store hook or raw API methods anywhere in your app:

```typescript
// A. Using the React Hook (Reactive)
const MyComponent = () => {
    const { list, loading } = ProductService.useStore();
    return <div>Total Products: {list.length}</div>
}

// B. Using Direct API Calls (Non-Reactive / One-off)
const loadManually = async () => {
    const data = await ProductService.getAll({ params: { active: true } });
};
```

---

## 2. The Data Manager

The `DataManager` is the UI powerhouse. It takes your Service and a Configuration Object and renders the full interface.

### Basic Usage

```tsx
import { DataManager } from 'generic-service-factory';
import { ProductService, Product } from './services/ProductService';

export default function ProductPage() {
    return (
        <DataManager<Product> 
            config={{
                title: "Product Inventory",
                service: ProductService, // Pass the service instance
                layout: 'split-view',    // 'split-view' | 'modal'
                display: { ... },        // View Configuration
                form: { ... }            // Input Configuration
            }}
        />
    )
}
```

---

## 3. Configuration Reference

The `config` prop is the heart of the system. Below is the detailed breakdown.

### Top Level Config
| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The page title. |
| `description` | `string` | Optional subtitle/description. |
| `service` | `ServiceFactory` | The instance created in Step 1. |
| `layout` | `'split-view' \| 'modal'` | **Split View**: Sidebar list, details on right.<br>**Modal**: Full width table, details in popup. |
| `devMode` | `boolean` | If true, logs actions to the console. |

### `display` Configuration
Controls how data is viewed (Table, List, or Grid).

| Property | Type | Description |
| :--- | :--- | :--- |
| `type` | `'table' \| 'list' \| 'grid'` | The visualization mode. |
| `columns` | `ColumnDef<T>[]` | **(Table Only)** Array of TanStack Table definitions. |
| `searchKeys` | `string[]` | Array of object keys to generate search bars for. |
| `renderItem` | `(item: T) => Node` | **(List/Grid Only)** Function to render individual cards. |

**Example (Table):**
```tsx
display: {
    type: 'table',
    searchKeys: ['name', 'sku'],
    columns: [
        { accessorKey: 'name', header: 'Product Name' },
        { accessorKey: 'price', header: 'Price', cell: info => `$${info.getValue()}` }
    ]
}
```

### `form` Configuration
Controls the input fields for Create/Update actions.

| Property | Type | Description |
| :--- | :--- | :--- |
| `fields` | `FieldConfig[]` | Array of field definitions (see below). |
| `liveUpdate` | `boolean` | If true, saves immediately on change (good for Settings pages). |
| `submitLabel` | `string` | Custom label for the save button. |

---

## 4. Field Configuration (`FieldConfig`)

Every input in the form is defined by a `FieldConfig` object.

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | The key of the data object (e.g., `'email'`). |
| `label` | `string` | The UI label. |
| `type` | `InputType` | See "Supported Input Types" below. |
| `validation` | `ValidationRule` | Validation logic. |
| `placeholder` | `string` | Input placeholder. |
| `hidden` | `boolean` OR `func` | Hide field based on logic: `(values) => values.role !== 'admin'`. |
| `disabled` | `boolean` | Disable input. |
| `options` | `InputOption[]` | For `select`: `[{ label: 'A', value: 'a' }]`. |
| `fetchOptions` | `() => Promise` | For **Async Select**. Fetches options dynamically. |
| `uploadEndpoint`| `string` | For `image`. API URL to upload the file to. |
| `renderCustom` | `func` | For `custom`. Render your own React component. |

### Supported Input Types
*   `text`, `number`, `email`, `password`
*   `textarea`
*   `select` (Synchronous or Async)
*   `checkbox`
*   `date` (Standard date picker)
*   `image` (File upload or preview)
*   `custom` (Fully custom component)

### Validation Rules
```typescript
validation: {
    required: true,
    min: 5,               // For numbers
    max: 100,
    pattern: /regex/,
    message: "Custom error message",
    // Custom Logic
    custom: (value, allValues) => {
        if (value === 'admin' && !allValues.email.includes('@corp.com')) {
            return "Admins must have a corporate email";
        }
        return null;
    }
}
```

---

## 5. Feature Examples

### A. Dynamic Async Select (Dropdown from API)
Useful when a dropdown depends on another API (e.g., selecting a User for a Product).

```typescript
{
    name: 'userId',
    label: 'Assign User',
    type: 'select',
    // The form will wait for this promise to resolve before rendering options
    fetchOptions: async () => {
        const users = await apiGet('/users');
        return users.map(u => ({ label: u.name, value: u.id }));
    }
}
```

### B. Custom Input Component
When standard inputs aren't enough (e.g., a Color Picker).

```tsx
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
                    className={`w-8 h-8 rounded-full cursor-pointer ${value === c ? 'ring-2 ring-black' : ''}`}
                    style={{ backgroundColor: c }}
                />
            ))}
            {error && <span className="text-red-500">{error}</span>}
        </div>
    )
}
```

### C. Conditional Visibility
Hide the "Department" field unless the role is "Manager".

```typescript
{
    name: 'department',
    label: 'Department',
    type: 'text',
    hidden: (values) => values.role !== 'manager' 
}
```

---

## 6. Layouts Visualized

### Split View (`layout: 'split-view'`)
*   **Best for:** Admin panels, Email clients, Master-Detail views.
*   **Behavior:** Shows the list on the left (or top on mobile). Clicking an item opens the form on the right.
*   **Mobile:** Automatically collapses into a single column.

### Modal View (`layout: 'modal'`)
*   **Best for:** Dense data tables where editing is secondary.
*   **Behavior:** The Table/Grid takes up 100% width. Clicking "Edit" or "Add" opens a popup dialog.

---

## 7. Troubleshooting & FAQ

**Q: The data isn't loading.**
*   Check your `endpoint` in the `ServiceFactory`.
*   Ensure your backend returns either an array `[]` or a paginated object `{ data: [] }`.

**Q: The form doesn't save.**
*   Check the `validation` rules.
*   Open the console (`devMode: true`) to see if the payload is being generated correctly.
*   Ensure your backend API accepts the payload structure sent by the generic form.

**Q: How do I change the styles?**
*   The system uses `tailwind-merge` (`cn`). pass `className` to `display` or individual `fields` config to override default styles.

**Q: Can I use this without the UI?**
*   Yes. You can import the `Service` alone and use `Service.create()`, `Service.delete()`, etc., in your own custom components.