# Arkenstone UI

A React + TypeScript component library for building modern web applications with support for both **general purpose** and **e-commerce** use cases.

**Version:** v0.0.1

---

## Features

- **35+ UI Components** - Built on Radix UI primitives with Tailwind CSS styling
- **E-Commerce Ready** - Product cards, catalog, filters, cart, and wishlist
- **Data Management** - Generic CRUD interfaces with ServiceFactory and DataManager
- **State Management** - Zustand stores with persistence and Immer integration
- **Access Control** - Role-based access control (RBAC) with AccessGate
- **Theming** - Light/Dark mode with CSS variables
- **TypeScript** - Full type safety throughout

---

## Quick Start

```tsx
import { Button, Card, ThemeProvider } from '@/lib';
import { Arkenstone } from '@/lib/components/arkestone';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
      <Arkenstone
        config={{
          api: { url: '/api/v1' }
        }}
      >
        <Card>
          <Card.Header>
            <Card.Title>Welcome</Card.Title>
          </Card.Header>
          <Card.Content>
            <Button>Get Started</Button>
          </Card.Content>
        </Card>
      </Arkenstone>
    </ThemeProvider>
  );
}
```

---

## Documentation Structure

### Getting Started
- [Installation](./getting-started/installation.md)
- [Setup](./getting-started/setup.md)
- [Configuration](./getting-started/configuration.md)

### Components
- [Components Overview](./components/README.md)
- [Access Gate](./components/access-gate.md)
- [Sidebar](./components/sidebar.md)
- [Tables](./components/tables.md)

### E-Commerce
- [Product Card](./e-commerce/product-card.md)
- [Catalog](./e-commerce/catalog.md)
- [Cart](./e-commerce/cart.md)
- [Wishlist](./e-commerce/wishlist.md)

### Data Management
- [Data Manager](./data-management/data-manager.md)
- [Service Factory](./data-management/service-factory.md)

### State Management
- [Stores](./state-management/stores.md)
- [Store Factory](./state-management/store-factory.md)

### Services
- [Service Factory](./services/service-factory.md)
- [API Utilities](./services/api-utilities.md)

### Access Control
- [Access Gate](./access-control/access-gate.md)
- [useAccess Hook](./access-control/use-access.md)

### Theming
- [Theme Provider](./theming/theme-provider.md)
- [CSS Variables](./theming/css-variables.md)

### API Reference
- [Response Protocol](./api-reference/response-protocol.md)
- [Types](./api-reference/types.md)

### Hooks
- [useAccess](./hooks/use-access.md)
- [useMobile](./hooks/use-mobile.md)
- [API Utilities](./hooks/api.md)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS v4 | Styling |
| Radix UI | Accessible Primitives |
| Zustand | State Management |
| Axios | HTTP Client |
| React Hook Form | Form Handling |

---

## License

MIT
