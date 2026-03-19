# Sidebar Components

Sidebar navigation components for building application layouts.

---

## Components

| Component | Description |
|-----------|-------------|
| `AppSidebar` | Main sidebar container |
| `NavMain` | Primary navigation items |
| `NavSecondary` | Secondary/floating navigation |
| `NavSlot2` | Customizable slot for additional nav items |
| `NavUser` | User profile section |

---

## Import

```tsx
import {
  AppSidebar,
  NavMain,
  NavSecondary,
  NavUser,
} from '@/lib/components/sidebar';
```

---

## AppSidebar

The main container for sidebar navigation.

```tsx
<AppSidebar>
  <NavMain items={mainNavItems} />
  <NavSecondary>
    <SettingsLink />
  </NavSecondary>
  <NavUser
    user={{
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/avatar.jpg',
    }}
  />
</AppSidebar>
```

---

## NavMain

Primary navigation items with icons and collapsible sections.

```tsx
import { NavMain } from '@/lib/components/sidebar';

const mainNavItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Products',
    icon: Package,
    href: '/products',
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    href: '/orders',
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      { title: 'General', href: '/settings/general' },
      { title: 'Security', href: '/settings/security' },
    ],
  },
];

<NavMain items={mainNavItems} />
```

### NavItem Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Navigation item label |
| `icon` | `LucideIcon` | Icon component |
| `href` | `string` | Link URL |
| `items` | `NavItem[]` | Nested items (creates collapsible) |
| `onClick` | `function` | Custom click handler |

---

## NavUser

User profile section in the sidebar.

```tsx
import { NavUser } from '@/lib/components/sidebar';

<NavUser
  user={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg',
  }}
  onSignOut={() => signOut()}
/>
```

### NavUser Properties

| Property | Type | Description |
|----------|------|-------------|
| `user.name` | `string` | User's display name |
| `user.email` | `string` | User's email |
| `user.avatar` | `string` | Avatar image URL |
| `onSignOut` | `function` | Sign out handler |

---

## Complete Sidebar Example

```tsx
import { AppSidebar } from '@/lib/components/sidebar';
import { NavMain } from '@/lib/components/sidebar';
import { NavSecondary } from '@/lib/components/sidebar';
import { NavUser } from '@/lib/components/sidebar';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Products',
    icon: Package,
    href: '/products',
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    href: '/orders',
  },
  {
    title: 'Customers',
    icon: Users,
    href: '/customers',
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      { title: 'General', href: '/settings' },
      { title: 'Security', href: '/settings/security' },
      { title: 'Notifications', href: '/settings/notifications' },
    ],
  },
];

export function Sidebar() {
  return (
    <AppSidebar>
      <NavMain items={navItems} />
      <NavSecondary>
        <NavUser
          user={{
            name: 'John Doe',
            email: 'john@example.com',
          }}
          onSignOut={() => console.log('Sign out')}
        />
      </NavSecondary>
    </AppSidebar>
  );
}
```

---

## Styling

Sidebar components use Tailwind CSS classes. To customize:

```tsx
<NavMain
  className="px-2"
  items={navItems}
/>
```

---

## State Management

Sidebar state is typically managed at the app level:

```tsx
import { useSidebar } from '@/lib/stores/sidebar-store';

// Get sidebar state
const { isCollapsed, toggle } = useSidebar();

// Or in a component
const sidebarState = useSidebar();
```
