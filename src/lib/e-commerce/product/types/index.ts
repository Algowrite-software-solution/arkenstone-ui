export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  is_active: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface Category {
  id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  description: string | null;
  children?: Category[];
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface TaxonomyType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  taxonomies_count: number;
  taxonomies?: Taxonomy[];
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
  is_active: boolean;
  type?: TaxonomyType | null;
  parent?: Taxonomy | null;
  children?: Taxonomy[];
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductTaxonomy{
  product_id: number;
  taxonomy_id: number;
  product?: Product | null;
  taxonomy?: Taxonomy | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  discount_type: string | null;
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
  created_at: string;
  updated_at: string;
}
