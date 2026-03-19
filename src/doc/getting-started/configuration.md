# Configuration

Complete reference for all configuration options in Arkenstone UI.

---

## ArkenstoneConfig

The main configuration object passed to the `Arkenstone` component.

```typescript
interface ArkenstoneConfig {
  aclConfig?: ACLConfig;
  api?: APIConfig;
  features?: FeatureConfig;
  currency?: 'USD' | 'LKR' | 'EUR' | string;
}
```

---

## API Configuration

### api

```typescript
interface APIConfig {
  url?: string;           // Base API URL
  isSameOrigin?: boolean; // Same origin request
  withCredentials?: boolean;
}
```

**Example:**

```tsx
<Arkenstone
  config={{
    api: {
      url: '/api/v1',
      withCredentials: true,
    },
  }}
>
  {children}
</Arkenstone>
```

---

## Access Control Configuration

### aclConfig

```typescript
interface ACLConfig {
  mode: 'local' | 'remote';
  permissions?: Record<Role, Permission[]>;
  groups?: Record<string, Role[]>;
  api?: { url: string; isSameOrigin?: boolean };
}
```

### Permission Modes

#### Local Mode

Permissions defined locally in the config:

```tsx
<Arkenstone
  config={{
    aclConfig: {
      mode: 'local',
      permissions: {
        admin: ['*'], // All permissions
        editor: ['posts.edit', 'posts.view', 'posts.create'],
        viewer: ['posts.view'],
      },
      groups: {
        moderators: ['admin', 'editor'],
      },
    },
  }}
>
  {children}
</Arkenstone>
```

#### Remote Mode

Permissions fetched from an API:

```tsx
<Arkenstone
  config={{
    aclConfig: {
      mode: 'remote',
      api: {
        url: '/api/v1/permissions',
      },
    },
  }}
>
  {children}
</Arkenstone>
```

---

## Feature Configuration

### features

```typescript
interface FeatureConfig {
  reviewsEnabled?: boolean;
  wishlistEnabled?: boolean;
  productZoom?: boolean;
}
```

**Example:**

```tsx
<Arkenstone
  config={{
    features: {
      reviewsEnabled: true,
      wishlistEnabled: true,
      productZoom: false,
    },
  }}
>
  {children}
</Arkenstone>
```

---

## Currency Configuration

### currency

Set the default currency for e-commerce components:

```tsx
<Arkenstone
  config={{
    currency: 'USD', // 'USD' | 'LKR' | 'EUR'
  }}
>
  {children}
</Arkenstone>
```

---

## Complete Configuration Example

```tsx
import { Arkenstone, ThemeProvider } from '@/lib';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
      <Arkenstone
        config={{
          // Access Control
          aclConfig: {
            mode: 'local',
            permissions: {
              admin: ['*'],
              manager: [
                'products.view',
                'products.edit',
                'orders.view',
              ],
              customer: ['products.view'],
            },
            groups: {
              staff: ['manager', 'admin'],
            },
          },
          
          // API
          api: {
            url: '/api/v1',
            isSameOrigin: true,
            withCredentials: true,
          },
          
          // Features
          features: {
            reviewsEnabled: true,
            wishlistEnabled: true,
            productZoom: true,
          },
          
          // Currency
          currency: 'USD',
        }}
      >
        <YourApp />
      </Arkenstone>
    </ThemeProvider>
  );
}
```

---

## Type Definitions

```typescript
type Role = string;
type Permission = string;

// Common permission patterns
const permissions = {
  all: '*',
  // Product permissions
  'products.view': 'products.view',
  'products.create': 'products.create',
  'products.edit': 'products.edit',
  'products.delete': 'products.delete',
  // Order permissions
  'orders.view': 'orders.view',
  'orders.create': 'orders.create',
  'orders.edit': 'orders.edit',
  'orders.delete': 'orders.delete',
};
```
