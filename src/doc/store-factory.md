# 🏭 Generic Store Factory

**File:** `arkenstone-ui/stores/store-factory.ts`

This utility allows you to create powerful, type-safe **Zustand** stores with minimal boilerplate. It automatically integrates **Immer** (for easy state updates) and **Persistence** (saving to LocalStorage), so you don't have to configure middleware every time you create a new slice of state.

---

## 🚀 Key Features

1.  **Zero Boilerplate**: No need to manually wrap your store in `immer` or `persist` middleware.
2.  **Immer Built-in**: Mutate state directly (e.g., `state.count++`) without spreading objects manually (`...state`).
3.  **Automatic Persistence**: Just provide a `name`, and the state saves to LocalStorage automatically.
4.  **Smart Merging**: If you add new fields to your code, they won't be overwritten by old LocalStorage data.
5.  **Generic Actions**: Every store comes with `update()` and `reset()` out of the box.

---

## 🛠 API Reference

### `createGenericStore<TState, TActions>(initialState, options)`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **`initialState`** | `TState` | The default values for your store data. |
| **`options`** | `object` | Configuration object (see below). |

### Options Object

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`name`** | `string` | `undefined` | **Unique Key.** If provided, state is saved to `localStorage` under this key. If omitted, state is temporary (memory only). |
| **`methods`** | `function` | `undefined` | A function to define custom actions (e.g., `addItem`, `toggleSidebar`). |

---

## ⚡ Built-in Methods

Every store created with this factory automatically gets these two methods:

### 1. `update(fn)`
A generic setter that exposes the Immer draft. Use this for quick updates without writing specific actions.

```typescript
const { update } = useMyStore();

// modify deep state easily
update((state) => {
  state.user.profile.settings.theme = 'dark';
  state.items.push(newItem);
});
```

### 2. `reset()`
Resets the store back to the `initialState` provided during creation. Great for "Logout" functionality.

```typescript
const { reset } = useMyStore();
reset(); // All data clears/reverts to default
```

---

## 💡 Usage Examples

### Example 1: Simple UI Store (No Persistence)
Useful for modals, sidebars, or temporary session data.

```typescript
// 1. Define State
interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
}

// 2. Create Store
export const useUIStore = createGenericStore<UIState>({
  isSidebarOpen: false,
  activeModal: null
});

// 3. Use in Component
// useUIStore().update(s => s.isSidebarOpen = true);
```

### Example 2: Advanced Store (Persistence + Custom Actions)
Useful for User Settings, Cart, or Auth, where logic is complex and data should survive a page refresh.

```typescript
// 1. Define Data Type
interface CartState {
  items: Array<{ id: number; qty: number }>;
}

// 2. Define Actions Interface
interface CartActions {
  addItem: (id: number) => void;
}

// 3. Create Store
export const useCartStore = createGenericStore<CartState, CartActions>(
  // Initial State
  { items: [] }, 
  
  // Options
  {
    name: "shopping-cart", // Enables LocalStorage
    
    // Define Custom Actions
    methods: (set, get) => ({
      addItem: (id) => 
        set((state) => {
          // Immer allows direct mutation!
          state.items.push({ id, qty: 1 });
        })
    })
  }
);
```

---

## 🛡 Safety & Migrations

### State Merging
If you update your code to include a new field in `initialState`, but the user has old data in LocalStorage, this factory handles it gracefully.
*   It merges the **Old LocalStorage Data** *on top of* your **New Initial State**.
*   **Result:** The user keeps their preferences, but new features (new fields) are initialized correctly instead of being `undefined`.

### Versioning (Advanced)
The factory includes a `version: 0` property.
If you make breaking changes to the data structure (e.g., changing `items: []` to `products: {}`), you can increment the version number in `store-factory.ts` to trigger a migration or a hard reset of the storage.