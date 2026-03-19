# Theme Provider

Theme management for light/dark mode with system preference support.

---

## Import

```typescript
import { ThemeProvider, useTheme } from '@/lib/provider/theme-provider';
```

---

## Setup

### 1. Wrap Your App

```tsx
// main.tsx or App.tsx
import { ThemeProvider } from '@/lib/provider/theme-provider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Add CSS

In your main CSS file:

```css
@import "arkenstone-ui/src/lib/css/theme.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Initial theme |
| `storageKey` | `string` | `'vite-ui-theme'` | localStorage key |
| `children` | `ReactNode` | - | App content |

---

## useTheme Hook

Access and control the theme.

### Return Values

```typescript
const { theme, setTheme, themes, resolvedTheme } = useTheme();
```

| Value | Type | Description |
|-------|------|-------------|
| `theme` | `string` | Current theme (`'light' \| 'dark' \| 'system'`) |
| `setTheme` | `function` | Set theme: `(theme) => void` |
| `themes` | `string[]` | Available themes |
| `resolvedTheme` | `string \| null` | Resolved theme (`'light' \| 'dark'`) |

### Examples

#### Basic Usage

```tsx
import { useTheme } from '@/lib/provider/theme-provider';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

#### Icon Toggle

```tsx
import { useTheme } from '@/lib/provider/theme-provider';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
```

---

## ModeToggle Component

Pre-built theme toggle component.

```tsx
import { ModeToggle } from '@/lib/components/custom/mode-toggle';

export function Header() {
  return (
    <header>
      <ModeToggle />
    </header>
  );
}
```

---

## CSS Variables

The theme uses CSS custom properties. See [CSS Variables](./css-variables.md) for customization.

---

## Persistence

The theme preference is stored in localStorage. Users can set their preference once, and it persists across sessions.

---

## System Preference

When `theme` is set to `'system'`, the resolved theme will match the user's OS preference:

```tsx
<ThemeProvider defaultTheme="system">
  {children}
</ThemeProvider>
```

---

## Complete Example

```tsx
import { ThemeProvider } from '@/lib/provider/theme-provider';
import { ModeToggle } from '@/lib/components/custom/mode-toggle';

export default function Layout({ children }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b">
          <div className="container flex items-center justify-between py-4">
            <h1>My App</h1>
            <ModeToggle />
          </div>
        </header>
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
}
```
