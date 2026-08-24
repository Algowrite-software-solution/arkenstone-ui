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

### 3. Import Stylesheet & Wrap Layout

Import the compiled library stylesheet in your main CSS file (or application entry point):

```css
@import "arkenstone-ui/index.css";
```

To prevent variables from conflicting with your customer-facing pages, the library's theme variables are scoped. You must wrap the root container of your admin panel layout in a `div` with the `ark-ui-root` class:

```html
<div class="ark-ui-root">
    <!-- Admin panel dashboard / components go here -->
</div>
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
