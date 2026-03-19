# Components

Arkenstone UI provides three categories of components:

---

## 1. Base UI Components (`@/lib/components/ui/`)

Built on Radix UI primitives with Tailwind CSS styling. These include:

| Category | Components |
|----------|------------|
| **Forms** | Button, Input, Textarea, Checkbox, Select, Label, Form |
| **Layout** | Card, Dialog, Sheet, Popover, Tabs, Accordion, Collapsible |
| **Navigation** | Breadcrumb, NavigationMenu, DropdownMenu, Tooltip |
| **Display** | Badge, Avatar, Skeleton, Alert, Separator, Table |
| **Feedback** | Toast (Sonner), HoverCard |
| **Data** | Calendar, DatePicker, Chart |
| **Utilities** | Icon, ScrollArea, PlaceholderPattern, Toggle, ToggleGroup |

These components are fully accessible and follow WAI-ARIA guidelines.

**Import Example:**

```tsx
import { Button } from '@/lib/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/components/ui/card';
import { Input } from '@/lib/components/ui/input';
```

---

## 2. Custom Components (`@/lib/components/custom/`)

Extended versions of base components with additional features:

| Component | Description |
|-----------|-------------|
| `Button` | Extended variants (primary, secondary, selected-primary, etc.) |
| `Input` | Circular-styled input with custom variants |
| `Search` | Debounced search input with icon support |
| `Breadcrumbs` | Smart breadcrumbs with collapse for long paths |
| `ModeToggle` | Light/Dark/System theme toggle |

**Import Example:**

```tsx
import { Button } from '@/lib/components/custom/button';
import { Search } from '@/lib/components/custom/search';
import { ModeToggle } from '@/lib/components/custom/mode-toggle';
```

---

## 3. Feature Components

### Access Control
- `AccessGate` - Role-based component visibility

### Layout
- `AppSidebar` - Application sidebar with navigation
- `NavMain`, `NavSecondary`, `NavUser` - Sidebar navigation items

### Data Management
- `DataManager` - Generic CRUD interface generator

### E-Commerce
- `ProductCard` - Product display card
- `Filters`, `SortBar`, `Pagination` - Catalog components

---

## Component Props

### Button Variants

```tsx
import { Button } from '@/lib/components/custom/button';

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="text">Text Only</Button>
<Button variant="selected-primary">Selected State</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

---

## Next Steps

- [Access Gate](./access-gate.md) - Control component visibility
- [Sidebar](./sidebar.md) - Navigation layout
- [Tables](./tables.md) - Data display
