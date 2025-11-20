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

export interface ProductTaxonomy{
  product_id: number;
  taxonomy_id: number;
}

export interface Product {
  id: number;
  brand_id: number | null;
  name: string;
  description: string | null;
  sku: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  price: number | null;
  discount_type: string | null;
  discount_value: number | null;
  quantity: number | null;
  final_price: number | null;
  categories: Category[] | null;
  brand: Brand | null;
  images: ProductImage[] | null;
  taxonomies: any[] | null;
}
