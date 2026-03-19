# AccessGate Component

The `AccessGate` component controls component visibility based on user roles and permissions.

---

## Import

```tsx
import { AccessGate } from '@/lib/components/access-gate';
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userRoles` | `Role[]` | **Required** | Array of user's roles |
| `accessor` | `Accessor \| Accessor[]` | **Required** | Role, Group, or Permission required |
| `matchAll` | `boolean` | `false` | If true, user must have ALL accessors |
| `behavior` | `'hide' \| 'disable'` | `'hide'` | Action when access denied |
| `fallback` | `ReactNode` | `null` | Content to show when access denied |
| `children` | `ReactNode` | - | Protected content |

---

## Type Definitions

```typescript
type Role = string;
type Accessor = Role | Permission | Group;
type Group = string;
type Permission = string;
```

---

## Usage Examples

### Basic Usage - Hide Content

```tsx
import { AccessGate } from '@/lib/components/access-gate';

<AccessGate userRoles={['editor']} accessor="posts.edit">
  <EditButton />
</AccessGate>
```

### Multiple Roles - Any Match

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

## Permission Patterns

Common permission patterns for e-commerce:

```typescript
// Products
'products.view'
'products.create'
'products.edit'
'products.delete'

// Orders
'orders.view'
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
```

---

## Using with useAccess Hook

Combine with `useAccess` for more control:

```tsx
import { AccessGate } from '@/lib/components/access-gate';
import { useAccess } from '@/lib/hooks/use-access';

function PostActions({ post }) {
  const { can } = useAccess(['editor', 'admin']);
  
  return (
    <>
      <ViewButton />
      
      <AccessGate
        userRoles={['editor', 'admin']}
        accessor="posts.edit"
        fallback={<span className="text-gray-400">View Only</span>}
      >
        <EditButton />
      </AccessGate>
      
      {can('posts.delete') && <DeleteButton />}
    </>
  );
}
```
