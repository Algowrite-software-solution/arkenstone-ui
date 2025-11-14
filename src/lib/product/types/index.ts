export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

export interface ProductImage {
  product_id: number;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  order: number;
}

export interface Category {
  id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  children?: Category[];
}

export interface TaxonomyType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Taxonomy {
  id: number;
  taxonomy_type_id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  meta: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  type?: TaxonomyType | null;
  parent?: Taxonomy | null;
  children?: Taxonomy[];
}

export interface Product {
  id: number;
  brand_id: number;
  name: string;
  description: string;
  sku: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  price: number;
  discount_type: string | null;
  discount_value: number | null;
  quantity: number;
  final_price: number;
  categories: Category[];
  brand: Brand | null;
  images: ProductImage[];
  taxonomies: Taxonomy[];
}

// API Response Types
export interface ApiResponse<T> {
  status: string;
  message: string | null;
  data: T;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}