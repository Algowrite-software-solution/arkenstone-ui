# Access Control

Role-based access control (RBAC) system for component visibility and permission checking.

---

## Overview

The access control system provides:
- `AccessGate` component for conditional rendering
- `useAccess` hook for permission checking
- Support for roles, groups, and individual permissions

---

## Import

```typescript
import { AccessGate } from '@/lib/components/access-gate';
import { useAccess } from '@/lib/hooks/use-access';
```

---

## Configuration

Set up ACL in the Arkenstone provider:

```tsx
<Arkenstone
  config={{
    aclConfig: {
      mode: 'local',
      permissions: {
        admin: ['*'],
        manager: [
          'products.view',
          'products.edit',
          'orders.view',
          'orders.process',
        ],
        viewer: ['products.view'],
      },
      groups: {
        staff: ['manager', 'admin'],
      },
    },
  }}
>
  {children}
</Arkenstone>
```

---

## Permission Patterns

Common permission patterns:

```typescript
// Products
'products.view'
'products.create'
'products.edit'
'products.delete'

// Orders
'orders.view'
'orders.create'
'orders.process'
'orders.refund'

// Users
'users.view'
'users.create'
'users.edit'
'users.delete'

// Settings
'settings.view'
'settings.edit'

// Wildcard
'*'  // All permissions (admin only)
```

---

## useAccess Hook

Check permissions programmatically.

### Basic Usage

```typescript
const { can, must, isReady } = useAccess(['editor', 'admin']);

if (can('posts.edit')) {
  // User can edit posts
}
```

### must - Throw on Denied

```typescript
const { must } = useAccess(['user']);

must('admin.access', 'You must be an admin to access this page');
// Throws error if permission denied
```

### canRender

Conditionally render components:

```typescript
const { canRender } = useAccess(['editor']);

const MyComponent = () => <div>Content</div>;

canRender(<MyComponent />, 'posts.edit');
// Returns null if denied, component if allowed
```

---

## AccessGate Component

Control component visibility based on permissions.

```tsx
<AccessGate
  userRoles={['editor']}
  accessor="posts.edit"
>
  <EditButton />
</AccessGate>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userRoles` | `Role[]` | **Required** | User's roles |
| `accessor` | `Accessor` | **Required** | Required role/permission |
| `matchAll` | `boolean` | `false` | Require ALL if array |
| `behavior` | `'hide' \| 'disable'` | `'hide'` | Action on denial |
| `fallback` | `ReactNode` | `null` | Content on denial |
| `children` | `ReactNode` | - | Protected content |

---

## Examples

### Single Permission

```tsx
<AccessGate userRoles={['editor']} accessor="posts.edit">
  <EditButton />
</AccessGate>
```

### Multiple Roles (Any Match)

```tsx
<AccessGate
  userRoles={['admin', 'manager']}
  accessor={['posts.edit', 'posts.delete']}
>
  <AdminControls />
</AccessGate>
```

### Require All Permissions

```tsx
<AccessGate
  userRoles={['editor']}
  accessor={['posts.edit', 'posts.publish']}
  matchAll={true}
>
  <PublishButton />
</AccessGate>
```

### Disable Instead of Hide

```tsx
<AccessGate
  userRoles={['viewer']}
  accessor="posts.edit"
  behavior="disable"
>
  <EditButton />
</AccessGate>
```

### Custom Fallback

```tsx
<AccessGate
  userRoles={['viewer']}
  accessor="admin.access"
  fallback={<div className="text-red-500">Access Denied</div>}
>
  <AdminPanel />
</AccessGate>
```

---

## Complete Example

```tsx
import { AccessGate } from '@/lib/components/access-gate';
import { useAccess } from '@/lib/hooks/use-access';

function PostActions({ post }) {
  const { can } = useAccess(['editor', 'admin']);

  return (
    <div className="flex gap-2">
      <Button>View</Button>

      <AccessGate
        userRoles={['editor', 'admin']}
        accessor="posts.edit"
        fallback={<span className="text-gray-400">View Only</span>}
      >
        <Button variant="primary">Edit</Button>
      </AccessGate>

      {can('posts.delete') && (
        <Button variant="destructive">Delete</Button>
      )}

      <AccessGate userRoles={['admin']} accessor="posts.publish">
        <Button variant="secondary">Publish</Button>
      </AccessGate>
    </div>
  );
}
```

---

## Type Definitions

```typescript
type Role = string;
type Accessor = Role | Permission | Group;
type Group = string;
type Permission = string;
```
