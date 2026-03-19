# CSS Variables

Theme customization using CSS custom properties.

---

## Overview

Arkenstone UI uses CSS variables for theming. Override these in your CSS to customize colors, borders, and more.

---

## Light Theme Variables

```css
:root {
  /* Background */
  --background: #F7F7F7;
  --foreground: #1A1A1A;

  /* Primary */
  --primary: #0287FE;
  --primary-foreground: #FFFFFF;

  /* Secondary */
  --secondary: #E9F4FF;
  --secondary-foreground: #1A1A1A;

  /* Muted */
  --muted: #EBEBEB;
  --muted-foreground: #757575;

  /* Accent */
  --accent: #DCEEFF;
  --accent-foreground: #1A1A1A;

  /* Destructive */
  --destructive: #ff524f;
  --destructive-foreground: #FFFFFF;

  /* Border & Input */
  --border: #4d4d4d;
  --input: #E0E0E0;
  --ring: #0287FE;

  /* Card */
  --card: #FFFFFF;
  --card-foreground: #1A1A1A;

  /* Popover */
  --popover: #FFFFFF;
  --popover-foreground: #1A1A1A;

  /* Sidebar */
  --sidebar: #F3F3F3;
  --sidebar-foreground: #1A1A1A;

  /* Radius */
  --radius: 0.5rem;
}
```

---

## Dark Theme Variables

```css
.dark {
  --background: #1A1A1A;
  --foreground: #F7F7F7;

  --primary: #2B9CFF;
  --primary-foreground: #1A1A1A;

  --secondary: #1F3A5C;
  --secondary-foreground: #F7F7F7;

  --muted: #333333;
  --muted-foreground: #A3A3A3;

  --accent: #1A3A5C;
  --accent-foreground: #F7F7F7;

  --destructive: #ff524f;
  --destructive-foreground: #FFFFFF;

  --border: #404040;
  --input: #333333;
  --ring: #2B9CFF;

  --card: #262626;
  --card-foreground: #F7F7F7;

  --popover: #262626;
  --popover-foreground: #F7F7F7;

  --sidebar: #262626;
  --sidebar-foreground: #F7F7F7;
}
```

---

## Customization

### Override in CSS

```css
/* In your main CSS file */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #6366f1; /* Indigo */
  --primary-foreground: #ffffff;
}

.dark {
  --primary: #818cf8; /* Lighter indigo for dark mode */
  --primary-foreground: #1e1b4b;
}
```

### Custom Theme File

Create a custom theme file:

```css
/* custom-theme.css */
@import "arkenstone-ui/src/lib/css/theme.css";

:root {
  --primary: #8b5cf6;
  --primary-foreground: #ffffff;
  --secondary: #f3e8ff;
  --accent: #ddd6fe;
}

.dark {
  --primary: #a78bfa;
  --primary-foreground: #1e1b4b;
  --secondary: #3b0764;
  --accent: #4c1d95;
}
```

---

## Component-Specific Variables

### Button Radius

```css
:root {
  --radius: 0.75rem; /* Rounder buttons */
}
```

### Sidebar Width

```css
:root {
  --sidebar-width: 16rem; /* 256px */
  --sidebar-width-collapsed: 4rem; /* 64px */
}
```

### Chart Colors

```css
:root {
  --chart-1: #0287FE;
  --chart-2: #10B981;
  --chart-3: #F59E0B;
  --chart-4: #EF4444;
  --chart-5: #8B5CF6;
}
```

---

## Usage with Tailwind

Use CSS variables with Tailwind classes:

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Primary Button
  </button>
</div>
```

---

## Common Patterns

### Custom Brand Colors

```css
/* Corporate Blue Theme */
:root {
  --primary: #0077B6;
  --primary-foreground: #FFFFFF;
  --secondary: #CAF0F8;
  --accent: #ADE8F4;
}

/* Dark Mode */
.dark {
  --primary: #00B4D8;
  --primary-foreground: #03045E;
  --secondary: #023047;
  --accent: #0077B6;
}
```

### Warm Theme

```css
/* Warm Orange Theme */
:root {
  --primary: #EA580C;
  --primary-foreground: #FFFFFF;
  --secondary: #FFF7ED;
  --accent: #FFEDD5;
}
```

### High Contrast

```css
/* High Contrast Theme */
:root {
  --foreground: #000000;
  --background: #FFFFFF;
  --border: #000000;
}

.dark {
  --foreground: #FFFFFF;
  --background: #000000;
  --border: #FFFFFF;
}
```

---

## Applying Themes

### Per-Component

```tsx
<div
  className="p-4 rounded-lg"
  style={{
    backgroundColor: 'var(--card)',
    color: 'var(--card-foreground)',
  }}
>
  Custom styled card
</div>
```

### Using Tailwind

```tsx
<div className="bg-card text-card-foreground">
  Card content
</div>
```

---

## Variable Reference

| Variable | Description |
|----------|-------------|
| `--background` | Page background |
| `--foreground` | Default text color |
| `--primary` | Primary color |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary color |
| `--secondary-foreground` | Text on secondary |
| `--muted` | Muted background |
| `--muted-foreground` | Muted text |
| `--accent` | Accent color |
| `--accent-foreground` | Text on accent |
| `--destructive` | Destructive/error color |
| `--destructive-foreground` | Text on destructive |
| `--border` | Border color |
| `--input` | Input background |
| `--ring` | Focus ring color |
| `--radius` | Border radius |
