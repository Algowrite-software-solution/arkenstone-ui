# DataManager Detailed Configuration Reference Guide
**API Reference, Parameter Explanations, and Code Snippets for `@/lib/components/data-manager`**

The `DataManager` is a low-code UI engine built on top of React and TanStack Table. It parses a configuration object to automatically generate layout containers, data tables, list views, forms, search fields, tooltips, validation, and API integrations.

---

## 1. Top-Level Integration

To use the `DataManager`, define a type interface representing your records, instantiate a matching `ServiceFactory`, and pass the configuration to the `<DataManager />` component:

```tsx
import { DataManager } from 'arkenstone-ui';
import { ProductService, Product } from '@/services/ProductService';

export default function ProductInventoryPage() {
    return (
        <DataManager<Product>
            config={{
                title: "Product Inventory",
                service: ProductService,
                layout: "split-view", // 'split-view' | 'modal'
                display: {
                    type: 'table',
                    columns: [
                        { accessorKey: 'sku', header: 'SKU' },
                        { accessorKey: 'name', header: 'Name' }
                    ]
                },
                form: {
                    fields: [
                        { name: 'sku', label: 'SKU', type: 'text' },
                        { name: 'name', label: 'Name', type: 'text' }
                    ]
                }
            }}
        />
    );
}
```

---

## 2. Configuration Schema (`DataManagerConfig<T>`)

The configuration object controls layout behavior, local Zustand state stores, views, and CRUD interactions.

### Top-Level Properties

| Property | Type | Required / Optional | Default Value | Description |
| :--- | :--- | :---: | :---: | :--- |
| `title` | `string` | **Required** | - | The main title text rendered in the header toolbar. |
| `service` | `ServiceFactory<T>` | **Required** | - | Zustand store/API service instance managing CRUD state. |
| `serviceConfig` | `ServiceConfig` | Optional | `undefined` | Custom query parameters or parameter mappings for CRUD operations. |
| `layout` | `'split-view' \| 'modal'` | Optional | `'modal'` | Layout model determining how forms and records align. |
| `modalSize` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | Optional | `'md'` | Specifies the size dimensions of the dialog overlay modal. |
| `description` | `string` | Optional | `undefined` | Subtitle/description text rendered under the header. |
| `showDescriptionOnMobile` | `boolean` | Optional | `false` | Controls whether description text is visible on small screen sizes. |
| `devMode` | `boolean` | Optional | `false` | Enables console logging for store actions and API calls. |
| `display` | `DisplayConfig<T>` | **Required** | - | Presentation settings for tables, columns, and search toolbar. |
| `form` | `FormConfig` | **Required** | - | Form schema including inputs, visibility, and validations. |

### Property Descriptions

*   **`title`**: Appears as an `<h1>` tag in the header. On mobile devices, this title automatically centers horizontally if the search tools allow.
*   **`service`**: Links the component directly to your CRUD endpoints. The `DataManager` will trigger `service.getAll()`, `service.create()`, `service.update()`, and `service.delete()` automatically.
*   **`serviceConfig`**: Map static query parameters or options directly to specific CRUD routes (e.g. `serviceConfig: { getAll: { params: { active: true } } }`).
*   **`layout`**: 
    *   `modal`: Renders a full-width table. Editing or creating records opens a popup `<Dialog>`. Ideal for dense data sheets.
    *   `split-view`: Splits the workspace into a left-side list view and a right-side detail/form panel. Centers on mobile into a single view. Ideal for email client interfaces, settings menus, and master-detail dashboards.
*   **`modalSize`**: Sets width boundary dimensions for the popup modal dialog form canvas: `sm` (384px), `md` (448px), `lg` (512px), `xl` (576px), `full` (100vw).
*   **`showDescriptionOnMobile`**: If set to `false`, hides the description text on mobile screens to conserve vertical height.
*   **`devMode`**: Prints store dispatches, API payloads, and query parameters directly into the browser console to simplify debugging.

---

## 3. Display Configuration (`DisplayConfig<T>`)

Controls how data records are represented, paginated, sorted, and filtered.

| Property | Type | Required / Optional | Default Value | Description |
| :--- | :--- | :---: | :---: | :--- |
| `type` | `'table' \| 'list' \| 'grid'` | **Required** | `'table'` | Presentation component style. |
| `columns` | `ColumnDef<T>[]` | Required if `type === 'table'` | `[]` | TanStack Table column definitions. |
| `persistColumnVisibility` | `boolean` | Optional | `false` | If `true`, saves users' column hidden/visible states to localStorage. |
| `actions` | `RowActions` | Optional | `undefined` | Row-level action buttons (edit, delete, view, custom triggers). |
| `viewModalConfig` | `ViewModalConfig` | Optional | `undefined` | Custom title, description, or custom item renderer for the read-only view dialog. |
| `createModalConfig` | `CreateModalConfig` | Optional | `undefined` | Custom button text configurations for the create modal. |
| `searchKeys` | `(keyof T)[]` | Optional | `[]` | Fields targeted during searches and inline filtering. |
| `searchOptions` | `SearchOptions` | Optional | `undefined` | Advanced configuration options for filters. |
| `renderItem` | `(item: T) => React.ReactNode` | Required if `type` list/grid | `undefined` | Custom renderer function to display grid cards or list rows. |
| `pagination` | `PaginationConfig` | Optional | `undefined` | Pagination settings and size/persistency overrides. |
| `disableCreate` | `boolean` | Optional | `false` | Removes the primary "Add Item" button from the header. |
| `disableRefresh` | `boolean` | Optional | `false` | Removes the refresh-arrow toolbar button. |
| `bulkActions` | `BulkActionsConfig` | Optional | `undefined` | Configures checkboxes and custom bulk actions (e.g. bulk deleting). |

### Property Descriptions

*   **`type`**:
    *   `table`: Renders a rich grid of columns with sorting, pagination, and toggleable checkboxes.
    *   `list`: Renders records as rows in a vertical stack using `renderItem`.
    *   `grid`: Renders records as a multi-column responsive grid layout using `renderItem`.
*   **`columns`**: Column definitions matching TanStack Table's spec. You can pass custom accessor cells to render badges, icons, formatted currency, or action buttons.
*   **`persistColumnVisibility`**: If enabled, columns hidden by the user remain hidden on their next visit by saving their preferences to localStorage.
*   **`actions`**: Configures buttons rendered in the final column of the table (or next to items in lists). `edit`, `view`, and `delete` can be simple booleans or configuration objects of type `ActionConfig<T>`:
    *   `edit`: Displays the edit form. Supports async pre-fetching via `resolveData(item)`, and row-level state predicates: `hidden?: (item) => boolean`, `disabled?: (item) => boolean`.
    *   `view`: Opens a read-only details card. Supports `resolveData`, `hidden`, and `disabled` predicates.
    *   `delete`: Triggers deletion. Supports `hidden` and `disabled` predicates.
    *   `custom`: Array of additional custom action buttons defined by `RowAction<T>`.
*   **`viewModalConfig`**: Configures the read-only details modal. You can define custom `title`, `description`, and a custom `renderItem` function to present detailed record fields without edit controls.
*   **`createModalConfig`**: Configures the creation dialog trigger. Allows specifying `createButtonText` to customize the button text (e.g. "Create Product" instead of "Add Item").
*   **`searchKeys`**: Declares which attributes of entity `T` the search filters look at. If empty, the search input fields will not render.
*   **`searchOptions`**: Configures how the search inputs are presented (as a single global bar, specific column inputs, or a toggleable layout). See details below.
*   **`pagination`**: Object holding pagination properties:
    *   `pageSizeOptions`: pagination drop-down size options (defaults to `[15, 25, 50, 100]`).
    *   `persistPagination`: if `true`, persists the active page index and number of items shown per page in localStorage so that navigation states are preserved when the page is refreshed.
*   **`renderItem`**: Required for `list` or `grid` display modes. A callback function that takes a single record of type `T` and returns a custom React component/element (e.g., custom card or list-item component).
*   **`disableCreate`**: Set to `true` to hide the "Add Item" button from the main header. Useful for read-only user views.
*   **`disableRefresh`**: Set to `true` to hide the rotate-refresh button from the toolbar.
*   **`bulkActions`**: Configures multi-row action checkboxes and a floating bottom actions drawer. Requires setting `enabled: true` and specifying a unique `identifierKey` (usually `'id'`).

### Column Metadata & Responsive Hiding

The DataManager extends TanStack Table's column metadata options to support responsive column hiding:

*   **`meta.hideOnMobile`**: If set to `true`, the column is completely omitted from the layout on mobile viewports. This helps keep tables tidy and readable on narrow phone screens.

**Example Configuration:**
```typescript
display: {
    type: 'table',
    columns: [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'name', header: 'Product Name' },
        // This column will be hidden automatically on mobile screens
        { 
            accessorKey: 'description', 
            header: 'Description',
            meta: {
                hideOnMobile: true
            }
        }
    ]
}
```

---

## 4. Search Configuration & Layout Options

The search toolbar behaves dynamically depending on the `searchKeys` array and the `SearchOptions` config:

```typescript
export interface SearchOptions {
    disableGlobal?: boolean;                // Hides the primary keyword search bar
    disableAdvanced?: boolean;              // Hides individual column-specific search filters
    forceAdvancedVisibleOnMobile?: boolean; // Keeps advanced filters visible on mobile screens
}
```

### The 4 Search Layout Layouts

#### A. Unified Search with Toggle (Default - No `searchOptions` provided)
*   **Behavior:** Displays a single `"Search..."` box. Hovering over the Help Circle (`?`) icon on its right opens a light-bordered themed tooltip showing exactly which fields are scanned. 
*   Displays an **Advanced Filters** button on the right. Clicking it hides the global input and displays inline text boxes for each column filter in the same row.
*   *State Sync:* Toggling into Advanced mode clears the global search filter. Toggling back to Global mode resets all active column filters.
*   *Mobile:* The toggle button and advanced filters hide on mobile to save space.

```tsx
display: {
    type: 'table',
    searchKeys: ['name', 'sku', 'category'],
    // Default search behavior applied automatically
}
```

#### B. Global Search Only
*   **Behavior:** Only the primary keyword search bar is displayed. The "Advanced Filters" button and individual input boxes are hidden.

```tsx
display: {
    type: 'table',
    searchKeys: ['name', 'sku'],
    searchOptions: {
        disableAdvanced: true // Hides advanced toggle and column fields
    }
}
```

#### C. Advanced Column Filters Only
*   **Behavior:** Hides the global search input and toggle button. Column-specific inputs are rendered directly inline in the toolbar.
*   *Mobile:* Filters remain visible on mobile and center cleanly.

```tsx
display: {
    type: 'table',
    searchKeys: ['name', 'sku', 'price'],
    searchOptions: {
        disableGlobal: true // Hides the global search input and toggle button
    }
}
```

#### D. Mobile Visibility Override
*   **Behavior:** By default, advanced filters hide on mobile viewports. Enabling `forceAdvancedVisibleOnMobile` keeps the toggle button and the inline filters fully visible on small mobile screens.

```tsx
display: {
    type: 'table',
    searchKeys: ['name', 'category'],
    searchOptions: {
        forceAdvancedVisibleOnMobile: true // Keeps toggle button visible on mobile
    }
}
```

---

## 5. Layout Design Models & Responsive Rendering

The `layout` parameter governs how the records and forms are presented and arranged across different devices and screen sizes.

### A. Split-View Model (`layout: 'split-view'`)
*   **Workflow Focus:** Master-Detail navigation, inventory checkouts, settings configuration panels, or browsing list dashboards.
*   **Desktop Structure:** Splits the view into two columns. The left-hand panel occupies `1/3` of the horizontal space and renders the data list (using `type: 'list'` or a simplified table). The right-hand panel occupies `2/3` of the space, showing the detail form for the currently selected record.
*   **Reactive URL State:** Selecting a record automatically updates the active record ID state. Toggling records displays the edit form in the details panel instantly without page reloads.
*   **Mobile Viewports:** Automatically collapses into a stacked column. The master records list takes up the full viewport. Clicking an item triggers a slide-in bottom drawer or full-screen overlay for the details form.
*   **Mobile Title Centering:** The DataManager title and subtitle are automatically centered on mobile screens.

### B. Modal Model (`layout: 'modal'`)
*   **Workflow Focus:** Dense tabular databases, large spreadsheets, analytical log viewing, and batch editing.
*   **Desktop Structure:** Renders the data grid/table across 100% of the container width. Selecting "Add Item" or editing an existing row opens a centered overlay dialog modal containing the form fields.
*   **Mobile Viewports:** The main table features responsive horizontal overflow scrolls (`overflow-x-auto`). Columns shrink and truncate text dynamically. Forms render as a popover overlay that fills the viewport width with comfortable edge margins.

---

## 6. The Form Validation Engine

Form validation is run reactively in the browser. The form blocker intercepts the submission lifecycle and updates visual error states if any values violate configuration rules.

### A. Standard Validation Rules
*   **`required`**: Blocks null/empty strings. For checkbox switches, requires a `true` state.
*   **`min` / `max`**:
    *   *Numbers:* Restricts values within numeric bounds (e.g. `min: 0` for price inputs).
    *   *Text:* Restricts character length bounds (e.g. `min: 8` for password strings).
*   **`pattern`**: A regular expression (RegExp) match constraint (e.g., `/^\S+@\S+\.\S+$/` for standard email addresses).

### B. Custom & Cross-Field Validation Callback
The `custom` function validator is passed the individual field value *and* the current form state object (`allValues`). This enables validations that depend on multiple fields (e.g. validating password confirmation, or pricing parameters):

```typescript
validation: {
    custom: (value, formValues) => {
        if (formValues.status === 'archived' && !value) {
            return "An archiving reason must be specified when status is archived.";
        }
        return null; // Return null if value is valid
    }
}
```

---

## 7. Bulk Actions & Selection Mechanics

When `disableBulkActions` is set to `false`, the Table layout enables checkboxes for selecting multiple rows simultaneously.

### A. Selection Bar UI
*   As soon as 1 or more row checkbox is ticked, a floating **Bulk Actions Drawer** slides up at the bottom of the table.
*   The drawer lists the number of active selections and provides a drop-down action menu (e.g., "Bulk Delete").

### B. Execution Flow
1.  **Checkbox Toggles:** TanStack Table stores selected row IDs in the `rowSelection` state.
2.  **Bulk Operation Trigger:** The user selects a bulk action (e.g., Delete).
3.  **API Dispatch:** The system dispatches a batch promise to the service endpoint:
    ```typescript
    const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
    await Promise.all(selectedIds.map(id => service.delete(id)));
    ```
4.  **State Clean Up:** After resolving, the system refreshes the local Zustand store state, triggers a toast notification, and resets row selection to `[]`.

---

## 8. Sorting & Ordering Mechanics

DataManager integrates client-side column sorting out-of-the-box when using the `'table'` display type.

### A. Core User Interactions & Indicators
*   **Toggle Sort:** Tapping on a column header toggles its sorting state through a cycle: **Ascending** ➔ **Descending** ➔ **Unsorted (Clear)**.
*   **Visual Icons:**
    *   `ArrowUp`: Active Ascending sorting.
    *   `ArrowDown`: Active Descending sorting.
    *   `ArrowUpDown` (50% opacity): Indicates the column is sortable but currently unsorted.

### B. Customizing Column Sorting

You can restrict or customize sorting directly inside the TanStack Table `columns` array:

#### 1. Disabling sorting on specific columns (e.g. actions, description columns)
Set `enableSorting: false` in the column metadata.

```typescript
columns: [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    // Disables sorting for the description column
    { accessorKey: 'description', header: 'Description', enableSorting: false },
    // Actions are usually not sortable
    {
        id: 'actions',
        header: '',
        cell: info => <Button onClick={() => edit(info.row.original)}>Edit</Button>,
        enableSorting: false
    }
]
```

#### 2. Defining a Custom Sorting Function (`sortingFn`)
By default, TanStack Table uses alphanumeric sorting. You can provide a custom `sortingFn` for complex types like formatted strings or priority states:

```typescript
columns: [
    {
        accessorKey: 'priority',
        header: 'Priority Level',
        // Sort based on a custom priority hierarchy map
        sortingFn: (rowA, rowB, columnId) => {
            const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
            const valA = priorityMap[rowA.getValue(columnId) as string] || 0;
            const valB = priorityMap[rowB.getValue(columnId) as string] || 0;
            return valA - valB;
        }
    }
]
```

---

## 9. Form Configuration (`FormConfig`)

Configures edit, create, and detail view sheets.

| Property | Type | Required / Optional | Default Value | Description |
| :--- | :--- | :---: | :---: | :--- |
| `fields` | `FieldConfig[]` | **Required** | `[]` | Array of form input field schemas. |
| `liveUpdate` | `boolean` | Optional | `false` | If `true`, saves inputs automatically on change (triggers backend updates). |
| `submitLabel` | `string` | Optional | `"Save"` | Text rendered on the submit button. |
| `disablePartialUpdate` | `boolean` | Optional | `false` | If `true`, sends all form values on update (skipping dirty checks for legacy APIs). |

### Property Descriptions

*   **`liveUpdate`**: Ideal for settings/configurations views where you do not want a submit button, and instead expect changes to save immediately to the backend as the user toggles a checkbox or types in a text field.
*   **`disablePartialUpdate`**: Crucial for legacy backend APIs. By default, the DataManager only submits modified fields (partial update) during edits to optimize bandwidth. Enabling this option forces it to send the complete entity object with all fields on every update request.

---

## 10. Field Configuration (`FieldConfig`)

```typescript
export interface FieldConfig {
    name: string;                               // Key in the data object
    label: string;                              // Form label text
    type: InputType;                            // Control component type
    placeholder?: string;                       // Text shown when empty
    defaultValue?: any;                         // Initial default value
    validation?: ValidationRule;                // Client-side validation criteria
    disabled?: boolean | ((values: any) => boolean); // Locks input (boolean or dynamic callback)
    hidden?: boolean | ((values: any) => boolean);   // Omit from form (boolean or dynamic callback)
    className?: string;                         // Tailwind classes to inject into field container
    onChange?: (value: any) => void;            // Reactive change callback trigger

    // For Selects / Radios dropdown controls
    options?: InputOption[];                    // Static list of options
    fetchOptions?: () => Promise<InputOption[]>; // Async list loader function
    defaultOption?: InputOption | (() => InputOption); // Initial selected option fallback
    enableDefaultOption?: boolean;              // Auto-preselect defaultOption if true

    // For Image Uploader controls (type === 'image')
    uploadEndpoint?: string;                    // API route to trigger instant server uploads
    maxCount?: number;                          // Maximum permitted files to upload
    maxSize?: number;                           // Maximum file size in Megabytes (MB)
    accept?: string;                            // MIME types filter (e.g. 'image/png, image/jpeg')
    removeImageOptions?: {                      // Options when user removes/deletes an image
        removedImagesField?: string;
        removeEndpoint?: string;
    };
    previewOptions?: {                          // Options for display previews
        transform?: (file: any) => string;
    };

    // Advanced backend data mapping config
    currentDataLoadConfig?: {
        useObjectKey?: string;                  // Maps from custom nested property key paths
        transform?: (data: any) => any;         // Pre-transforms API field values before form load
    };
    renderCustom?: (props: CustomFieldProps) => React.ReactNode; // Renders custom components
}
```

### Property Descriptions

*   **`name`**: The exact key path of the data object. Supports nested dot notation if your service supports nested keys (e.g., `'profile.firstName'`).
*   **`type`**: The control type. Supports `'text'`, `'number'`, `'email'`, `'password'`, `'textarea'`, `'select'`, `'checkbox'`, `'date'`, `'image'`, and `'custom'`.
*   **`validation`**: Validation rules evaluated before form submissions (e.g. `required`, `min`, `max`, `pattern`, or a `custom` callback).
*   **`hidden` / `disabled`**: Can be simple booleans, or dynamic callback functions that parse current form values: `(values) => values.role !== 'admin'`.
*   **`className`**: String of Tailwind CSS classes injected directly into the outer container element wrapping this form field. Useful for defining custom widths (e.g., `col-span-2`), margins, or borders.
*   **`onChange`**: Callback triggered whenever the field value changes. Can be used for custom side effects.
*   **`options` / `fetchOptions`**: Configures select options. Use `options` for static local arrays, and `fetchOptions` to fetch arrays asynchronously from your backend.
*   **`defaultOption` / `enableDefaultOption`**: Setup placeholder values or auto-preselected values for select lists (e.g., preset "Select Category..." or default value on load).
*   **`uploadEndpoint`**: The API endpoint used for uploading files in `'image'` fields. Returns the uploaded image URL string back to the form value state.
*   **`maxCount` / `maxSize` / `accept`**: Enforces client-side upload size rules, limit checks, and file type filters inside file uploader fields.
*   **`removeImageOptions` / `previewOptions`**: Configures media deletion API endpoints and custom thumbnail URLs for image previews.
*   **`currentDataLoadConfig`**: Allows mapping and converting API payloads on-the-fly. For example, if the API returns a nested database record, the transform callback extracts the primary ID to populate select lists during updates.
*   **`renderCustom`**: Used when `type === 'custom'` to render any React component (e.g., slider controls, rich-text WYSIWYG editors, color pickers).

---

## 11. Configuration Examples

### A. Dynamic Options from API (`fetchOptions`)
Loads dropdown list options asynchronously when the form renders:

```typescript
{
    name: 'categoryId',
    label: 'Product Category',
    type: 'select',
    fetchOptions: async () => {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        // Return in format: { label: string, value: any }[]
        return categories.map((cat: any) => ({
            label: cat.displayName,
            value: cat.uuid
        }));
    }
}
```

### B. Custom Inputs (`renderCustom`)
Renders a custom React component (like a Color Palette Picker) inside the form layout, hooking into the manager's validation state:

```tsx
{
    name: 'colorHex',
    label: 'Brand Color',
    type: 'custom',
    renderCustom: ({ value, onChange, error }) => {
        const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'];
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    {colors.map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => onChange(c)}
                            style={{ backgroundColor: c }}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                                value === c ? 'border-foreground scale-110 shadow' : 'border-transparent'
                            }`}
                        />
                    ))}
                </div>
                {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>
        );
    }
}
```

### C. Conditional Display & Disabling
Shows or disables inputs depending on the value of another field:

```typescript
// 1. Conditional Visibility: Show extra input ONLY if "User Role" is "Manager"
{
    name: 'departmentId',
    label: 'Target Department',
    type: 'select',
    options: [{ label: 'HR', value: 'hr' }, { label: 'Engineering', value: 'eng' }],
    hidden: (formValues) => formValues.role !== 'manager'
},

// 2. Conditional Disabling: Disable password resets unless the record is active
{
    name: 'tempPassword',
    label: 'Temporary Reset Password',
    type: 'password',
    disabled: (formValues) => !formValues.isActive
}
```

### D. Advanced Cross-Field Validation
Validates that two inputs conform to a business rule (e.g. validating that a discount price is not higher than the base retail price):

```typescript
{
    name: 'discountPrice',
    label: 'Discounted Price',
    type: 'number',
    validation: {
        custom: (value, allValues) => {
            if (Number(value) >= Number(allValues.retailPrice)) {
                return "Discounted price must be strictly lower than the retail price.";
            }
            return null; // Return null if valid
        }
    }
}
```

### E. Custom Row Actions

DataManager allows you to inject custom action buttons into the action column of each row. These actions can run custom callbacks, trigger side-effects, or dispatch direct API requests:

```typescript
display: {
    type: 'table',
    columns: [
        { accessorKey: 'sku', header: 'SKU' },
        { accessorKey: 'name', header: 'Product Title' },
        { accessorKey: 'status', header: 'Status' }
    ],
    actions: {
        edit: true,    // Standard edit button (visible)
        delete: true,  // Standard delete button (visible)
        view: false,   // Standard read-only view button (hidden)
        custom: [
            {
                label: "Approve Product",
                variant: "outline",
                // Action is hidden if the product is already active
                hidden: (product) => product.status === 'active',
                // Action is disabled if there is no stock
                disabled: (product) => product.stock <= 0,
                onClick: async (product) => {
                    await fetch(`/api/products/${product.id}/approve`, { method: 'POST' });
                    // Trigger store refresh after action completion
                    ProductService.getAll();
                }
            }
        ]
    }
}
```

### F. Asynchronous Data Resolution & Row-Level Action Configuration

This example highlights configuring `edit` and `view` actions with asynchronous pre-fetching hooks, as well as row-level conditional access constraints:

```typescript
display: {
    type: 'table',
    columns: [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'title', header: 'Title' }
    ],
    actions: {
        // Simple boolean enables standard behavior
        delete: true,
        // Advanced view config with dynamic resolver hook and hidden predicate
        view: {
            enabled: true,
            resolveData: async (post) => {
                // Fetch full details from database before opening the details modal
                const res = await fetch(`/api/posts/${post.id}/details`);
                return await res.json();
            },
            hidden: (post) => post.isPrivate // Hide view details for private posts
        },
        // Advanced edit config with dynamic disabled predicate
        edit: {
            enabled: true,
            resolveData: async (post) => {
                const res = await fetch(`/api/posts/${post.id}/edit-payload`);
                return await res.json();
            },
            disabled: (post) => post.isLockedByAdmin // Disable editing if post is locked
        }
    }
}
```

#### `RowAction<T>` Properties Reference:

| Property | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | The text label displayed on the action button or tooltip. |
| `icon` | `React.ReactNode` | Optional visual React component (e.g. Lucide icon) rendered inside the button. |
| `onClick` | `(item: T, context: ActionContext<T>) => void \| Promise<void>` | Callback function executed when clicked, receiving the specific row's record and control context parameters. |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | Tailwind visual variation style of the button. |
| `hidden` | `boolean \| ((item: T) => boolean)` | Boolean or dynamic function evaluating whether to hide the action for a given record. |
| `disabled` | `boolean \| ((item: T) => boolean)` | Boolean or dynamic function evaluating whether to disable/lock the button. |
| `className` | `string` | Custom Tailwind classes injected into the button element wrapper. |

#### `ActionContext<T>` Properties Reference:

| Property | Type | Description |
| :--- | :--- | :--- |
| `edit` | `(item: T) => void` | Programmatically triggers the edit modal/panel workflow for the specified item. |
| `view` | `(item: T) => void` | Programmatically triggers the view details modal workflow for the specified item. |
| `delete` | `(item: T) => void` | Programmatically triggers the delete confirmation prompt flow for the specified item. |
| `refresh` | `() => Promise<void>` | Re-fetches the current dataset and reloads the table/list state. |

#### `ActionConfig<T>` Properties Reference:

| Property | Type | Description |
| :--- | :--- | :--- |
| `enabled` | `boolean` | Whether the action button is active globally. Defaults to `true`. |
| `resolveData` | `(item: T) => Promise<any> \| any` | Optional async function to fetch full details of the record before mounting the form/details viewer. |
| `hidden` | `boolean \| ((item: T) => boolean)` | Boolean or callback evaluating if the button should be hidden for a given record. |
| `disabled` | `boolean \| ((item: T) => boolean)` | Boolean or callback evaluating if the button should be disabled for a given record. |

---

## 12. DOM Attribute Conventions for Testing & Styling

All interactive action button containers and elements generated inside the `DataManager` are stamped with clean, standardized `data-dm-*` HTML attributes to provide stable targets for automated E2E tests (such as Playwright or Cypress) and custom CSS overrides:

*   **Actions Container Wrapper**: Elements wrapping list or row actions are tagged with `data-dm="actions-wrapper"`.
*   **Action Type Identifier**: Native action buttons are tagged with `data-dm-action="[action_type]"`:
    *   `data-dm-action="view"` (View details action trigger)
    *   `data-dm-action="edit"` (Edit record form trigger)
    *   `data-dm-action="delete"` (Delete confirmation trigger)
    *   `data-dm-action="custom"` (Custom custom action trigger)
*   **Custom Action Label**: Custom actions are stamped with `data-dm-custom-label="[kebab-case-label]"` to uniquely identify each custom button by its title (e.g., `data-dm-custom-label="approve-product"`).

---

## 13. Complete Implementation Demos

### Demo 1: Dense E-Commerce Products (Modal Table View)
A modal-driven grid view featuring search overrides, static column selections, async dropdowns, image uploading, and custom cells.

```tsx
import { DataManager } from 'arkenstone-ui';
import { ProductService, Product } from '@/services/ProductService';

export function ECommerceInventory() {
    return (
        <DataManager<Product>
            config={{
                title: "Product Inventory",
                description: "Manage product stock levels, categories, and retail pricing.",
                service: ProductService,
                layout: "modal", // Dense grid view
                display: {
                    type: 'table',
                    searchKeys: ['name', 'sku', 'category'],
                    searchOptions: {
                        forceAdvancedVisibleOnMobile: true // Search is visible on mobile
                    },
                    columns: [
                        { accessorKey: 'sku', header: 'Product SKU' },
                        { accessorKey: 'name', header: 'Title' },
                        { 
                            accessorKey: 'price', 
                            header: 'Price', 
                            cell: info => `$${Number(info.getValue()).toFixed(2)}` 
                        },
                        {
                            accessorKey: 'stock',
                            header: 'Stock Status',
                            cell: info => {
                                const val = Number(info.getValue());
                                return val > 5 ? (
                                    <span className="text-green-600 font-semibold">In Stock ({val})</span>
                                ) : (
                                    <span className="text-red-500 font-semibold">Low Stock ({val})</span>
                                );
                            }
                        }
                    ]
                },
                form: {
                    submitLabel: "Update Inventory Item",
                    fields: [
                        { name: 'sku', label: 'SKU Code', type: 'text', validation: { required: true } },
                        { name: 'name', label: 'Product Name', type: 'text', validation: { required: true } },
                        { name: 'price', label: 'Retail Price ($)', type: 'number', validation: { required: true, min: 0 } },
                        { name: 'stock', label: 'Quantity in Warehouse', type: 'number', validation: { required: true, min: 0 } },
                        {
                            name: 'category',
                            label: 'Product Category',
                            type: 'select',
                            fetchOptions: async () => {
                                const res = await fetch('/api/categories');
                                const data = await res.json();
                                return data.map((c: any) => ({ label: c.name, value: c.id }));
                            }
                        },
                        {
                            name: 'imageUrl',
                            label: 'Product Image',
                            type: 'image',
                            uploadEndpoint: '/api/v1/media/upload'
                        }
                    ]
                }
            }}
        />
    );
}
```

### Demo 2: User Access Profiles (Split-View Layout)
A master-detail layout showcasing sidebar navigation, dynamic conditional inputs, and validation rules.

```tsx
import { DataManager } from 'arkenstone-ui';
import { UserService, User } from '@/services/UserService';

export function UserProfileSettings() {
    return (
        <DataManager<User>
            config={{
                title: "User Directory",
                description: "Provision system access, configure permission levels, and view profiles.",
                service: UserService,
                layout: "split-view", // Sidebar navigation layout
                display: {
                    type: 'list',
                    searchKeys: ['email', 'fullName'],
                    searchOptions: {
                        disableAdvanced: true // Keeps list search simple (global keywords only)
                    },
                    renderItem: (user) => (
                        <div className="flex flex-col p-2">
                            <span className="font-bold text-sm">{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    )
                },
                form: {
                    fields: [
                        { name: 'email', label: 'Corporate Email', type: 'email', validation: { required: true } },
                        { name: 'fullName', label: 'Full Display Name', type: 'text', validation: { required: true } },
                        {
                            name: 'role',
                            label: 'System Access Role',
                            type: 'select',
                            options: [
                                { label: 'Administrator', value: 'admin' },
                                { label: 'Standard User', value: 'user' }
                            ]
                        },
                        // Hidden unless User Role is "admin"
                        {
                            name: 'adminPermissions',
                            label: 'Admin Permission Levels',
                            type: 'select',
                            options: [
                                { label: 'Full Access (Root)', value: 'root' },
                                { label: 'Read & Write Only', value: 'write' }
                            ],
                            hidden: (values) => values.role !== 'admin'
                        }
                    ]
                }
            }}
        />
    );
}
```
