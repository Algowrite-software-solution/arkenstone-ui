# Store Factory

Create powerful, type-safe Zustand stores with minimal boilerplate.

---

## Overview

The Store Factory provides:
- Zero boilerplate setup
- Immer integration for direct state mutations
- Automatic localStorage persistence
- Built-in `update()` and `reset()` methods

---

## Import

```typescript
import { createGenericStore } from '@/lib/stores';
```

---

## Basic Usage

### Simple UI Store (No Persistence)

```typescript
interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
}

export const useUIStore = createGenericStore<UIState>({
  isSidebarOpen: false,
  activeModal: null,
});

// Use in component
function Sidebar() {
  const { isSidebarOpen, update } = useUIStore();

  return (
    <aside className={isSidebarOpen ? 'open' : 'closed'}>
      <button onClick={() => update((s) => s.isSidebarOpen = !s.isSidebarOpen)}>
        Toggle
      </button>
    </aside>
  );
}
```

---

## Advanced Usage

### Store with Persistence + Custom Actions

```typescript
interface CartState {
  items: Array<{ id: number; qty: number }>;
}

interface CartActions {
  addItem: (id: number) => void;
  removeItem: (id: number) => void;
}

export const useCartStore = createGenericStore<CartState, CartActions>(
  { items: [] },
  {
    name: "shopping-cart", // Enables localStorage persistence

    methods: (set, get) => ({
      addItem: (id) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            existing.qty++;
          } else {
            state.items.push({ id, qty: 1 });
          }
        });
      },

      removeItem: (id) => {
        set((state) => {
          state.items = state.items.filter((i) => i.id !== id);
        });
      },
    }),
  }
);
```

---

## API Reference

### createGenericStore<TState, TActions>(initialState, options)

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialState` | `TState` | Default state values |
| `options.name` | `string` | localStorage key (enables persistence) |
| `options.methods` | `function` | Custom actions: `(set, get) => ({...})` |

---

## Built-in Methods

### update(fn)

Access the Immer draft for mutations:

```typescript
const { update } = useStore();

// Modify deeply nested state
update((state) => {
  state.user.profile.settings.theme = 'dark';
  state.items.push(newItem);
});
```

### reset()

Reset to initial state:

```typescript
const { reset } = useStore();
reset();
```

---

## Custom Actions

Define custom methods:

```typescript
interface UserState {
  name: string;
  email: string;
}

interface UserActions {
  updateProfile: (data: Partial<UserState>) => void;
  clearProfile: () => void;
}

export const useUserStore = createGenericStore<UserState, UserActions>(
  { name: '', email: '' },
  {
    methods: (set, get) => ({
      updateProfile: (data) => {
        set((state) => {
          Object.assign(state, data);
        });
      },

      clearProfile: () => {
        set((state) => {
          state.name = '';
          state.email = '';
        });
      },
    }),
  }
);
```

---

## State Merging

New fields are merged with existing localStorage data:

```typescript
// Old localStorage: { name: 'John' }
// New initialState: { name: '', email: '' }

// After store creation:
// State: { name: 'John', email: '' }
```

---

## Complete Example

```typescript
import { createGenericStore } from '@/lib/stores';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationActions {
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

export const useNotificationStore = createGenericStore<
  NotificationState,
  NotificationActions
>(
  {
    notifications: [],
    unreadCount: 0,
  },
  {
    name: 'notifications',

    methods: (set, get) => ({
      addNotification: (notification) => {
        set((state) => {
          state.notifications.unshift(notification);
          state.unreadCount++;
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (notification && !notification.read) {
            notification.read = true;
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        });
      },

      clearAll: () => {
        set((state) => {
          state.notifications = [];
          state.unreadCount = 0;
        });
      },
    }),
  }
);
```

---

## Best Practices

1. **Type Safety**: Always define TypeScript interfaces for state and actions
2. **Naming**: Use descriptive names for stores and actions
3. **Persistence**: Only enable persistence for data that should survive refresh
4. **Reset**: Implement logout functionality with `reset()`
