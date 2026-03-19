# Setup

This guide covers how to set up Arkenstone UI in your React application.

---

## Basic Setup

### 1. Wrap Your App with Providers

Create a providers component:

```tsx
// components/providers.tsx
import { ThemeProvider } from '@/lib/provider/theme-provider';
import { Arkenstone } from '@/lib/components/arkestone';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
      <Arkenstone
        config={{
          api: { url: '/api/v1' }
        }}
      >
        {children}
      </Arkenstone>
    </ThemeProvider>
  );
}
```

### 2. Update Your App Entry Point

```tsx
// main.tsx or App.tsx
import { Providers } from './components/providers';

export default function App() {
  return (
    <Providers>
      {/* Your app content */}
    </Providers>
  );
}
```

---

## ThemeProvider Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Initial theme |
| `storageKey` | `string` | `'vite-ui-theme'` | LocalStorage key for theme |
| `children` | `ReactNode` | - | App content |

### Using the Theme

```tsx
import { useTheme } from '@/lib/provider/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

---

## Arkenstone Configuration

The `Arkenstone` component initializes the core library features.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `config` | `ArkenstoneConfig` | Configuration object |
| `children` | `ReactNode` | App content |

### Configuration Options

```tsx
<Arkenstone
  config={{
    // Access Control
    aclConfig: {
      mode: 'local', // or 'remote'
      permissions: {
        admin: ['*'],
        editor: ['posts.edit', 'posts.view'],
      },
      groups: {
        moderators: ['admin', 'editor'],
      },
    },
    
    // API Settings
    api: {
      url: '/api/v1',
      isSameOrigin: true,
      withCredentials: false,
    },
    
    // App Features
    features: {
      reviewsEnabled: true,
      wishlistEnabled: true,
      productZoom: true,
    },
    
    // Currency
    currency: 'USD',
  }}
>
  {children}
</Arkenstone>
```

---

## Using Components

### Importing Components

```tsx
// Individual imports (recommended for tree-shaking)
import { Button } from '@/lib/components/ui/button';
import { Card } from '@/lib/components/ui/card';

// Or from the main index
import { Button, Card, Input } from '@/lib';
```

---

## Next Steps

- [Configuration](./configuration.md) - Full configuration reference
- [Components Overview](../components/README.md) - Available components
- [Theming](../theming/theme-provider.md) - Customize the look
