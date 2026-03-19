# Types

TypeScript type definitions for Arkenstone UI.

---

## E-Commerce Types

### Product

```typescript
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number | null;
  sale_price: number | null;
  has_discount: boolean;
  sku: string | null;
  quantity: number | null;
  is_active: boolean;
  brand: Brand | null;
  categories: Category[] | null;
  taxonomies: Taxonomy[] | null;
  images: ProductImage[] | null;
  primary_image: ProductImage | null;
}
```

### Brand

```typescript
interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  is_active: boolean;
  product_count: number;
}
```

### Category

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  children?: Category[];
  products_count?: number;
}
```

### ProductImage

```typescript
interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}
```

---

## Cart Types

### CartItem

```typescript
interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}
```

---

## Data Management Types

### DataManagerConfig

```typescript
interface DataManagerConfig<T> {
  title: string;
  description?: string;
  service: ServiceFactory<T>;
  layout: 'split-view' | 'modal';
  devMode?: boolean;
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  display?: {
    type: 'table' | 'grid' | 'list';
    columns?: ColumnDef<T>[];
    searchKeys?: string[];
    actions?: {
      view?: boolean;
      edit?: boolean;
      delete?: boolean;
    };
    disableCreate?: boolean;
    renderItem?: (item: T) => ReactNode;
  };
  
  form?: {
    fields: FieldConfig[];
    liveUpdate?: boolean;
    disablePartialUpdate?: boolean;
    submitLabel?: string;
  };
  
  serviceConfig?: {
    getAll?: { params?: object };
    delete?: { params?: object };
  };
}
```

### FieldConfig

```typescript
interface FieldConfig {
  name: string;
  label: string;
  type: InputType;
  validation?: ValidationRule;
  placeholder?: string;
  hidden?: boolean | ((values: any) => boolean);
  disabled?: boolean;
  options?: InputOption[];
  fetchOptions?: () => Promise<InputOption[]>;
  uploadEndpoint?: string;
  renderCustom?: (props: CustomFieldProps) => ReactNode;
}

type InputType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'password' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'date' 
  | 'image' 
  | 'custom';
```

### InputOption

```typescript
interface InputOption {
  label: string;
  value: string | number;
}
```

### ValidationRule

```typescript
interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  custom?: (value: any, allValues: any) => string | null;
}
```

---

## Access Control Types

```typescript
type Role = string;
type Permission = string;
type Group = string;
type Accessor = Role | Permission | Group;

interface ACLConfig {
  mode: 'local' | 'remote';
  permissions?: Record<Role, Permission[]>;
  groups?: Record<Group, Role[]>;
  api?: { url: string; isSameOrigin?: boolean };
}
```

---

## App Configuration Types

### ArkenstoneConfig

```typescript
interface ArkenstoneConfig {
  aclConfig?: ACLConfig;
  api?: APIConfig;
  features?: FeatureConfig;
  currency?: string;
}

interface APIConfig {
  url?: string;
  isSameOrigin?: boolean;
  withCredentials?: boolean;
}

interface FeatureConfig {
  reviewsEnabled?: boolean;
  wishlistEnabled?: boolean;
  productZoom?: boolean;
}
```

---

## API Response Types

### Success Response

```typescript
interface SuccessResponse<T> {
  status: 'success';
  message?: string;
  data: T;
  errors?: null;
}
```

### Error Response

```typescript
interface ErrorResponse {
  status: 'error';
  message: string;
  data?: null;
  errors: ValidationErrors | string[] | null;
}

type ValidationErrors = Record<string, string[]>;
```

---

## Catalog Types

### FilterItem

```typescript
interface FilterItem {
  id: string;
  title?: string;
  type?: FilterType;
  collapsible?: boolean;
  collapsed?: boolean;
  placeholder?: string;
  options?: FilterOption[];
  multiple?: boolean;
  step?: number;
  min?: number;
  max?: number;
  renderOption?: (option: FilterOption) => ReactNode;
}

type FilterType = 
  | 'checkbox' 
  | 'radio' 
  | 'chip' 
  | 'toggle' 
  | 'switch' 
  | 'color' 
  | 'image' 
  | 'rating' 
  | 'tag' 
  | 'icon' 
  | 'range' 
  | 'tree';
```

### FilterOption

```typescript
interface FilterOption {
  label: string;
  value: string | number;
  color?: string;
  image?: string;
  min?: number;
  max?: number;
  children?: FilterOption[];
}
```

### SortOption

```typescript
interface SortOption {
  label: string;
  value: string;
}
```

---

## Component Props Types

### ButtonProps

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'selected-primary' 
  | 'selected-secondary' 
  | 'text' 
  | 'text-secondary' 
  | 'destructive' 
  | 'ghost' 
  | 'link';

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
```

### CardProps

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

### DialogProps

```typescript
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}
```
