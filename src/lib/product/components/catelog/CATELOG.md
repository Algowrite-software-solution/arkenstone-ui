Here is a comprehensive documentation guide for the `product-catelog` package. It is structured to help a developer understand the architecture, the available components, their props, and how to compose them into a functional page.

---

# Product Catalog (`product-catelog`) - Developer Guide

This package provides a modular, layer-based architecture for building e-commerce product catalog pages. It handles layouts, filtering logic, view switching (grid/list/table), sorting, and pagination.

## 1. Architecture & Layers

The package is designed around a **Composition Pattern**. You don't just import one giant component; instead, you assemble "Layers" to fit your specific design needs.

*   **Layout Layer:** Handles the responsive grid, sidebars (filters), and top/bottom areas.
*   **Control Layer:** Handles user inputs like Search, Sorting, and View Modes.
*   **Filter Layer:** A data-driven engine to render complex filter trees, checkboxes, color swatches, and ranges.
*   **Listing Layer:** Displays the actual products and handles the relationship between the list, controls, and pagination.

---

## 2. Component API Reference

### A. Layouts

#### `CatalogContentLayout`
The main skeleton of the page. It divides the screen into Top, Left (Sidebar), Center (Content), Right, and Bottom.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `top` | `ReactNode` | Content spanning the full width at the top (e.g., Search Bar, Breadcrumbs). |
| `left` | `ReactNode` | Left sidebar content (usually **Filters**). |
| `listings` | `ReactNode` | The main content area (usually the **Listing** component). |
| `right` | `ReactNode` | Right sidebar content (optional). |
| `bottom` | `ReactNode` | Full width footer content (optional). |

#### `Listing`
A wrapper component that organizes the controls, product grid, and pagination vertically.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `controls` | `ReactNode` | Place the `ListingControl` component here. |
| `list` | `ReactNode` | Your mapped product cards or table. |
| `pagination`| `ReactNode` | Place the `Pagination` component here. |
| `className` | `string` | Custom styling for the container. |

---

### B. Filters (The Engine)

The `Filters` component is configuration-driven. You pass it an array of objects, and it renders the appropriate UI.

### `Filters` Component

A configuration-driven filters engine. Pass an array of group configs and a value object; the component renders controls and calls onChange with the updated value object.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `filters` | `FilterItemProps[]` | `[]` | Array of filter group configuration objects (see `FilterItemProps` below). |
| `value` | `Record<string, any>` | `{}` | Current filter state keyed by filter id, e.g. `{ color: ['red'], price: [10, 100] }`. |
| `onChange` | `(next: Record<string, any>) => void` | `() => {}` | Called when any filter changes. Receives the full updated `value` object. |
| `direction` | `"vertical" \| "horizontal"` | `"vertical"` | Layout direction for filter groups. |
| `globalClassNames` | `Partial<ClassNamesMap>` | `{}` | Override classes for internal parts (see `ClassNamesMap` below). |
| `collapsibleByDefault` | `boolean` | `false` | Collapse groups by default when true. |
| `compact` | `boolean` | `false` | Render compact UI suitable for narrow sidebars. |

#### `FilterItemProps` (group configuration)
Each `filters` entry describes a group. Minimal example and full TS shape:

```ts
type FilterOption = {
  label: string;
  value: string | number;
  // optional visuals / metadata used by certain types:
  color?: string;           // for `color`
  image?: string;           // for `image`
  min?: number;             // for `range`
  max?: number;             // for `range`
  children?: FilterOption[] // for `tree`
};

interface FilterItemProps {
  id: string;                      // unique key for state lookup
  title?: string;                  // group title shown in UI
  type?: 'checkbox' | 'radio' | 'tree' | 'color' | 'image' | 'chip' | 'tag' | 'rating' | 'range' | 'toggle';
  collapsible?: boolean;           // allow collapsing the group
  collapsed?: boolean;             // initial collapsed state
  placeholder?: string;            // empty state hint
  options?: FilterOption[];        // choices for the group
  multiple?: boolean;              // allows multi-select for applicable types
  step?: number;                   // for range slider step
  min?: number;                    // for range min
  max?: number;                    // for range max
  renderOption?: (opt: FilterOption) => React.ReactNode; // custom option renderer
}
```

Notes on `value` shape
- The `value` prop is a plain object where each key is the filter `id`.
- For checkbox/multi select: value is `Array<value>`.
- For radio/single select: value is single `value` (string/number) or `null`.
- For range: value is `[min, max]` or `{ min, max }` depending on config (component normalizes).
- Example: `{ color: ['red','blue'], size: ['M'], price: [10, 100], in_stock: true }`

Supported `type` values and behaviour
- `checkbox` (default) — renders a list of checkboxes; `value[id]` is an array.
- `radio` — single choice; `value[id]` is a scalar.
- `tree` — nested categories; options use `children` for nesting and selection may return a path or id.
- `color` — swatches; option must include `color` hex and `label`.
- `image` — clickable image tiles; option should include `image` and `label`.
- `chip` / `tag` — pill buttons; behaves like checkbox by default.
- `rating` — star selector; value is numeric.
- `range` — numeric slider; value is `[min, max]` or object `{min,max}`.
- `toggle` / `switch` — boolean toggle; value is `true|false`.

`ClassNamesMap` keys (for `globalClassNames`)
- wrapper, group, title, collapsibleToggle, options, option, optionLabel, optionControl, checkbox, radio, chip, colorSwatch, imageTile, range, toggle, tree, treeNode, button

Examples

Basic filters configuration:
```ts
const FILTERS = [
  {
    id: 'category',
    title: 'Category',
    type: 'tree',
    collapsible: true,
    options: [
      { label: 'Clothing', value: 'clothing', children: [
        { label: 'Shirts', value: 'shirts' },
        { label: 'Pants', value: 'pants' }
      ] }
    ]
  },
  {
    id: 'color',
    title: 'Color',
    type: 'color',
    options: [
      { label: 'Red', value: 'red', color: '#ef4444' },
      { label: 'Blue', value: 'blue', color: '#3b82f6' }
    ]
  },
  {
    id: 'price',
    title: 'Price',
    type: 'range',
    min: 0,
    max: 2000,
    step: 10
  }
];
```

Usage example:
```tsx
const [filtersValue, setFiltersValue] = useState<Record<string, any>>({});

<Filters
  filters={FILTERS}
  value={filtersValue}
  onChange={(next) => setFiltersValue(next)}
  direction="vertical"
  globalClassNames={{ title: 'font-semibold text-sm mb-2' }}
/>
```

Implementation notes
- Filters are intentionally presentation-agnostic: pass `renderOption` for custom visuals.
- The component normalizes input/output so parent stores get predictable shapes.
- For complex integrations (e.g., server-side filtering), call your API in response to `onChange` and update `value` from server results.

If you want, I can add a small code example of the internal normalization helpers (range / tree) used by the component.

---

### C. Controls

#### `ListingControl`
A flexible container that composes a SortBar and a ViewModeSwitcher, plus any extra elements.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `sortProps` | `SortBarProps` | `undefined` | Props forwarded to the internal `SortBar`. If omitted you can pass a custom `sortComponent`. |
| `viewModeProps` | `ViewModeSwitcherProps` | `undefined` | Props forwarded to the internal `ViewModeSwitcher`. If omitted you can pass a custom `viewModeComponent`. |
| `sortComponent` | `ReactNode` | `undefined` | Replace the default `SortBar` with a custom node/component. |
| `viewModeComponent` | `ReactNode` | `undefined` | Replace the default `ViewModeSwitcher` with a custom node/component. |
| `extra` | `ReactNode[]` | `[]` | Array of extra elements to render (e.g., results count, filters summary). |
| `direction` | `"row" \| "column"` | `"row"` | Layout direction for the control bar. When `"row"` the controls are horizontally aligned.

Usage: provide `sortProps` and `viewModeProps` for the built-in components or pass custom components via `sortComponent` / `viewModeComponent`.

---

#### `SortBar`
Dropdown / controls for sorting list data.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `sortOrder` | `"asc" \| "desc"` | required | Current sort direction. |
| `sortBy` | `string` | required | Current sort field/value (e.g., `"price"`). |
| `sortOptions` | `SortOption[]` | `[{name: "Name", value: "name"}, {name: "Price", value: "price"}]` | Dropdown options for sort field. |
| `onSortChange` | `(order: "asc" \| "desc") => void` | required | Called when user selects ascending/descending. |
| `onSortByChange` | `(val: string) => void` | required | Called when user selects a different sort field. |
| `orderTitle` | `string` | `"Order"` | Title above order options in the dropdown. |
| `orderButtonLabel` | `string \| undefined` | `undefined` | Custom label for the sort button. Falls back to `Sort: {current} · {Asc|Desc}`. |
| `sortByTitle` | `string` | `"Sort By"` | Heading shown above the sort field options. |
| `orderClassName` | `string` | Tailwind default container | Root wrapper classes for the SortBar. |
| `orderDropdownClassName` | `string` | Tailwind default | Wrapper for the dropdown trigger. |
| `orderButtonClassName` | `string` | Tailwind default | Trigger button classes. |
| `dropdownContainerClassName` | `string` | Tailwind default | Classes for the opened dropdown panel. |
| `sortByHeaderClassName` | `string` | Tailwind default | Class for the "Sort By" header inside dropdown. |
| `optionClassName` | `string` | Tailwind default | Class for each sort field option. |
| `optionSelectedClassName` | `string` | Tailwind default | Applied to the currently selected option. |
| `orderHeaderClassName` | `string` | Tailwind default | Header class for order section in dropdown. |
| `orderOptionClassName` | `string` | Tailwind default | Class for each order option (Ascending / Descending). |

Behavior:
- Clicking the button toggles dropdown; selecting a field calls `onSortByChange`; selecting Asc/Desc calls `onSortChange`.
- All className props let you style each part without touching internals.

---

#### `ViewModeSwitcher`
Small control with buttons to switch render mode between card/grid/list/table.

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `mode` | `"card" \| "list" \| "table"` | required | Currently selected view mode. |
| `onChange` | `(mode: ViewMode) => void` | required | Callback invoked when user selects a mode. |
| `availableModes` | `ViewMode[]` | `["card","list","table"]` | Which mode buttons to render. |
| `containerClassName` | `string` | Tailwind default | Wrapper classes for the switcher. |
| `buttonClassName` | `string` | Tailwind default | Base class applied to each button. |
| `selectedButtonClassName` | `string` | Tailwind default | Class applied to the active/selected button. |
| `unselectedButtonClassName` | `string` | Tailwind default | Class applied to inactive buttons. |
| `cardButtonClassName` | `string` | `""` | Extra class for the "card" button. |
| `listButtonClassName` | `string` | `""` | Extra class for the "list" button. |
| `tableButtonClassName` | `string` | `""` | Extra class for the "table" button. |
| `iconSize` | `number` | `16` | Size (px) of the icons inside buttons. |

Behavior:
- Each available mode renders a button; clicking calls `onChange(mode)`.
- Styling props let you customize look for selected/unselected states and per-button overrides.

---

Examples

Minimal ListingControl with built-ins:
```tsx
<ListingControl
  sortProps={{
    sortOrder,
    sortBy,
    onSortChange: setSortOrder,
    onSortByChange: setSortBy,
  }}
  viewModeProps={{ mode: viewMode, onChange: setViewMode }}
  extra={[<div key="count">Showing {total} results</div>]}
/>
```

Replace SortBar with custom component:
```tsx
<ListingControl
  sortComponent={<MyCustomSort />}
  viewModeProps={{ mode: viewMode, onChange: setViewMode }}
/>
```

---

### D. Pagination

#### `Pagination`

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `page` | `number` | required | Current page (1-based). |
| `total` | `number` | required | Total number of items. |
| `pageSize` | `number` | required | Items per page. |
| `onChange` | `(page: number) => void` | required | Called when the user selects a new page. |
| `showArrows` | `boolean` | `true` | Show Prev / Next controls. |
| `showPages` | `boolean` | `true` | Render individual page number buttons. |
| `showSummary` | `boolean` | `false` | Show textual summary like "Showing 1–10 of 50". |
| `showPageSize` | `boolean` | `false` | Render a page-size selector dropdown. |
| `renderPrev` | `React.ReactNode` | `undefined` | Custom node for the Prev control (replaces default). |
| `renderNext` | `React.ReactNode` | `undefined` | Custom node for the Next control (replaces default). |
| `renderPage` | `(page: number, isActive: boolean) => React.ReactNode` | `undefined` | Custom renderer for each page button. |
| `renderPageSize` | `React.ReactNode` | `undefined` | Custom renderer for the page-size control. |
| `containerClassName` | `string` | `"flex items-center justify-center gap-2 p-3"` | Wrapper classes for the pagination bar. |
| `summaryClassName` | `string` | `"text-sm text-gray-600 mr-3"` | Classes for the summary text. |
| `pageClassName` | `string` | `"px-3 py-1 border rounded"` | Base class for page buttons. |
| `activePageClassName` | `string` | `"bg-gray-200 font-semibold"` | Class applied to the active page button. |
| `prevNextClassName` | `string` | `"px-3 py-1 border rounded disabled:opacity-40"` | Class for Prev / Next buttons. |
| `pageSizeSelectClassName` | `string` | `"border rounded px-2 py-1 text-sm mr-3"` | Class for the page-size select. |
| `pageButtonClassName` | `string` | `""` | Extra wrapper class applied to each page button. |
| `disabledClassName` | `string` | `"opacity-40"` | Class applied to disabled controls. |

Notes
- `totalPages` is computed as Math.ceil(total / pageSize).
- The component exposes render props (`renderPrev`, `renderNext`, `renderPage`, `renderPageSize`) so you can fully control markup.
- When using `showPageSize`, handle page-size changes externally (the component only renders the control by default).
- Styling props let you restyle individual parts without modifying component internals.

Example
```tsx
<Pagination
  page={page}
  total={200}
  pageSize={20}
  onChange={setPage}
  showSummary
  showPageSize
  containerClassName="flex items-center gap-4"
/>
```

---

## 3. Styling & ClassNames

Most components accept a `classNames` or `globalClassNames` prop. This follows a specific map structure allowing you to style deep internal elements without `!important`.

**`ClassNamesMap` keys:**
`wrapper`, `item`, `title`, `options`, `option`, `input`, `checkbox`, `radio`, `chip`, `toggle`, `tree`, `treeNode`, `button`.

Example:
```jsx
<Filters 
  globalClassNames={{
    title: "text-lg font-bold text-gray-800",
    checkbox: "accent-blue-500 rounded",
    option: "hover:text-blue-600"
  }} 
  // ... 
/>
```

---

## 4. Complete Usage Example

Below is a complete implementation showing how to wire all layers together.

```tsx
import React, { useState } from "react";
import {
  CatalogContentLayout,
  Filters,
  Listing,
  ListingControl,
  Pagination,
  ProductCard // Assuming you have a card component
} from "product-catelog"; // Hypothetical import

// 1. Define Filter Configuration
const FILTER_CONFIG = [
  {
    id: "category",
    title: "Categories",
    type: "tree",
    options: [
      { label: "Clothing", value: "clothing", children: [{ label: "Shirts", value: "shirts" }] }
    ]
  },
  {
    id: "color",
    title: "Color",
    type: "color",
    options: [
      { label: "Red", value: "red", color: "#ef4444" },
      { label: "Blue", value: "blue", color: "#3b82f6" }
    ]
  },
  {
    id: "price",
    title: "Price Range",
    type: "range",
    options: [{ label: "Price", value: "price", min: 0, max: 1000, step: 10 }]
  }
];

export default function CatalogPage() {
  // 2. Manage State
  const [filters, setFilters] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("price");
  const [viewMode, setViewMode] = useState("card");
  const [page, setPage] = useState(1);
  
  // Mock Data
  const products = [/* ... your product array ... */];

  // 3. Define UI Sections

  // Top Section (Search)
  const topSection = (
    <div className="mb-4">
       <input type="text" placeholder="Search..." className="w-full border p-2 rounded" />
    </div>
  );

  // Left Section (Filters)
  const leftSection = (
    <div className="bg-white p-4 rounded shadow-sm">
      <Filters
        filters={FILTER_CONFIG}
        value={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        globalClassNames={{ title: "font-semibold mb-2" }}
      />
    </div>
  );

  // Controls (Sort & View)
  const controls = (
    <ListingControl
      sortProps={{
        sortOrder,
        sortBy,
        onSortChange: setSortOrder,
        onSortByChange: setSortBy,
        sortOptions: [
          { label: "Price", value: "price" },
          { label: "Newest", value: "date" }
        ]
      }}
      viewModeProps={{
        mode: viewMode,
        onChange: setViewMode
      }}
    />
  );

  // Render List Logic
  const renderList = () => {
    // Handle "table" view mode
    if (viewMode === "table") {
      return (
        <table>
          <tbody>{products.map(p => <tr key={p.id}><td>{p.name}</td></tr>)}</tbody>
        </table>
      );
    }
    // Handle "card" or "list" view mode
    const gridClass = viewMode === "card" 
      ? "grid grid-cols-1 md:grid-cols-3 gap-6" 
      : "flex flex-col gap-4";
      
    return (
      <div className={gridClass}>
        {products.map(p => <ProductCard key={p.id} data={p} />)}
      </div>
    );
  };

  // Pagination
  const pagination = (
    <Pagination 
      page={page} 
      total={100} 
      pageSize={10} 
      onChange={setPage} 
      showSummary 
    />
  );

  // 4. Assemble Layout
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CatalogContentLayout
        top={topSection}
        left={leftSection}
        listings={
          <Listing
            controls={controls}
            list={renderList()}
            pagination={pagination}
          />
        }
      />
    </div>
  );
}
```