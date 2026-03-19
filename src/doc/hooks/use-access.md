# useAccess Hook

React hook for programmatic permission checking in access control.

---

## Import

```typescript
import { useAccess } from '@/lib/hooks/use-access';
```

---

## Usage

```typescript
const { can, must, isReady, canRender } = useAccess(['editor', 'admin']);
```

---

## Return Values

| Value | Type | Description |
|-------|------|-------------|
| `can` | `function` | Check if user has permission |
| `must` | `function` | Throw error if permission denied |
| `isReady` | `boolean` | ACL initialization status |
| `canRender` | `function` | Conditionally render components |

---

## can

Check if user has a specific permission.

```typescript
can: (accessor: Accessor | Accessor[], matchAll?: boolean) => boolean
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `accessor` | `Accessor \| Accessor[]` | Permission(s) to check |
| `matchAll` | `boolean` | Require ALL (default: false) |

### Examples

```typescript
const { can } = useAccess(['editor']);

// Single permission
if (can('posts.edit')) {
  // User can edit posts
}

// Multiple - any match
if (can(['posts.edit', 'posts.delete'])) {
  // User can edit OR delete
}

// Multiple - all required
if (can(['posts.edit', 'posts.publish'], true)) {
  // User can edit AND publish
}
```

---

## must

Throw an error if permission is denied.

```typescript
must: (accessor: Accessor, message?: string) => void
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `accessor` | `Accessor` | Permission to check |
| `message` | `string` | Error message if denied |

### Examples

```typescript
const { must } = useAccess(['user']);

// Throws with custom message
must('admin.access', 'Admin access required');

// Use in component
function AdminPanel() {
  must('admin.access'); // Throws if not admin
  return <div>Admin Content</div>;
}
```

---

## isReady

Check if ACL configuration is loaded.

```typescript
isReady: boolean
```

### Example

```typescript
const { isReady } = useAccess(['user']);

if (!isReady) {
  return <LoadingSpinner />;
}
```

---

## canRender

Conditionally render components based on permissions.

```typescript
canRender: (component: ReactNode, accessor: Accessor | Accessor[]) => ReactNode
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `component` | `ReactNode` | Component to render if allowed |
| `accessor` | `Accessor \| Accessor[]` | Required permission(s) |

### Example

```typescript
const { canRender } = useAccess(['editor']);

return (
  <>
    {canRender(<EditButton />, 'posts.edit')}
    {canRender(<DeleteButton />, 'posts.delete')}
    {canRender(<PublishButton />, 'posts.publish')}
  </>
);
```

---

## Complete Example

```typescript
import { useAccess } from '@/lib/hooks/use-access';
import { Button } from '@/lib/components/custom/button';

function PostActions({ post }) {
  const { can, must, canRender } = useAccess(['editor', 'admin']);

  return (
    <div className="flex gap-2">
      <Button>View</Button>

      {can('posts.edit') && <Button variant="primary">Edit</Button>}

      {can(['posts.edit', 'posts.delete']) && (
        <Button variant="destructive">Delete</Button>
      )}

      {canRender(<QuickEditButton />, 'posts.edit')}

      <button
        disabled={!can('posts.edit')}
        onClick={() => must('posts.edit')}
      >
        Edit (Disabled)
      </button>
    </div>
  );
}
```
