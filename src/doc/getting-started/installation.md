# Installation

This guide covers how to install and set up Arkenstone UI in your project.

---

## Prerequisites

- Node.js 18+
- React 18+
- Tailwind CSS v4

---

## Installation

### 1. Install the package

```bash
npm install arkenstone-ui
```

Or using yarn/pnpm:

```bash
yarn add arkenstone-ui
pnpm add arkenstone-ui
```

### 2. Configure Tailwind CSS

Ensure your `tailwind.config.js` (or `tailwind.config.ts`) includes the library path:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ... your other paths
    './node_modules/arkenstone-ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Add CSS Variables

Add the theme CSS variables to your main CSS file:

```css
@import "arkenstone-ui/src/lib/css/theme.css";
```

### 4. Configure Path Aliases

Add the `@` alias to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

For Vite, add to `vite.config.ts`:

```ts
import path from 'path';

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```

---

## Peer Dependencies

The following packages are required peer dependencies:

```bash
npm install react react-dom react-hook-form axios zustand immer
```

---

## Verify Installation

Create a simple test component:

```tsx
import { Button } from '@/lib';

export default function Test() {
  return <Button variant="primary">Hello Arkenstone!</Button>;
}
```

If the button renders correctly with styling, the installation is successful.
