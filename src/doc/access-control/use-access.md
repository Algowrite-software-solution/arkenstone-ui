# useAccess Hook

React hook for programmatic permission checking.

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

### can

Check if user has permission.

```typescript
can: (accessor: Accessor | Accessor[], matchAll?: boolean) => boolean
```

**Examples:**

```typescript
const { can } = useAccess(['editor']);

// Single permission
can('posts.edit'); // true/false

// Multiple - any match (default)
can(['posts.edit', 'posts.delete']); // true if any match

// Multiple - all must match
can(['posts.edit', 'posts.publish'], true); // true only if all match
```

### must

Throw an error if permission denied.

```typescript
must: (accessor: Accessor, message?: string) => void
```

**Example:**

```typescript
const { must } = useAccess(['user']);

// Throws Error with message if denied
must('admin.access', 'Admin access required');

// Use in code
function AdminPanel() {
  must('admin.access');
  return <div>Admin Content</div>;
}
```

### isReady

Check if ACL is initialized.

```typescript
isReady: boolean
```

**Example:**

```typescript
const { isReady } = useAccess(['user']);

if (!isReady) {
  return <LoadingSpinner />;
}
```

### canRender

Conditionally render components.

```typescript
canRender: (component: ReactNode, accessor: Accessor | Accessor[]) => ReactNode
```

**Example:**

```typescript
const { canRender } = useAccess(['editor']);

const EditButton = () => <button>Edit</button>;

return (
  <>
    {canRender(<EditButton />, 'posts.edit')}
    {canRender(<DeleteButton />, 'posts.delete')}
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
    <div className="space-y-2">
      {/* Basic permission check */}
      {can('posts.edit') && <EditButton />}

      {/* Multiple permissions - any match */}
      {can(['posts.edit', 'posts.delete']) && <AdminControls />}

      {/* Multiple permissions - all required */}
      {can(['posts.edit', 'posts.publish'], true) && (
        <PublishButton />
      )}

      {/* Throw on denial */}
      <button onClick={() => must('posts.delete', 'Cannot delete')}>
        Delete
      </button>

      {/* Conditional rendering */}
      {canRender(<QuickEditButton />, 'posts.edit')}
      {canRender(<PublishButton />, 'posts.publish')}

      {/* Disable based on permission */}
      <button disabled={!can('posts.edit')}>
        Edit (Disabled)
      </button>
    </div>
  );
}
```

---

## Integration with AccessGate

Combine hook and component:

```typescript
import { AccessGate } from '@/lib/components/access-gate';
import { useAccess } from '@/lib/hooks/use-access';

function PostList({ posts }) {
  const { can } = useAccess(['editor', 'admin']);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="flex items-center gap-4">
          <span>{post.title}</span>

          <AccessGate
            userRoles={['editor', 'admin']}
            accessor="posts.edit"
          >
            <Button size="sm">Edit</Button>
          </AccessGate>

          {can('posts.delete') && (
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
```
