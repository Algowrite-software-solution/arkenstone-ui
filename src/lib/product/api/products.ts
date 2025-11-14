import { 
  Product, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';


// Query Parameters for GET /api/v1/products
export interface ProductSearchParams {
  id?: number;
  name?: string;
  brand?: number;
  categories?: number[];
  all_categories?: number[];
  min_price?: number;
  max_price?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  per_page?: number;
  with?: ('categories' | 'brand' | 'images')[];
  page?: number;
}

// Request body for POST /api/v1/products
export interface ProductCreateRequest {
  brand_id?: number | null;
  name: string;
  description?: string | null;
  sku?: string | null;
  price?: number | null;
  discount_type?: 'percentage' | 'fixed' | null;
  discount_value?: number | null;
  quantity?: number | null;
  is_active?: boolean;
  category_ids?: number[];
  images?: { id: number }[];
}

// Request body for PUT/PATCH /api/v1/products/{id}
export interface ProductUpdateRequest {
  brand_id?: number | null;
  name?: string;
  description?: string | null;
  sku?: string | null;
  price?: number | null;
  discount_type?: 'percentage' | 'fixed' | null;
  discount_value?: number | null;
  quantity?: number | null;
  is_active?: boolean;
  category_ids?: number[];
  images?: { id: number }[];
}

// Request body for DELETE /api/v1/products
export interface ProductDeleteRequest {
  id: number;
}

// Response for DELETE /api/v1/products
export interface ProductDeleteResponse {
  id: number;
  brand_id: number;
  name: string;
  deleted_at: string;
}

/**
 * Build query string from params object
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          searchParams.append(`${key}[]`, String(item));
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

/**
 * GET /api/v1/products - List/Search products (Public)
 * Returns paginated list when searching, single product when id is provided
 */
export async function getProducts(
  params?: ProductSearchParams
): Promise<ApiResponse<PaginatedResponse<Product>> | ApiResponse<Product>> {
  const queryString = params ? buildQueryString(params) : '';
  const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * POST /api/v1/products - Create a new product (Protected)
 */
export async function createProduct(
  data: ProductCreateRequest,
  token: string
): Promise<ApiResponse<Product>> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create product: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * GET /api/v1/products/{id} - Get single product by ID (Protected)
 */
export async function getProductById(
  id: number,
  token: string
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * PUT/PATCH /api/v1/products/{id} - Update a product (Protected)
 */
export async function updateProduct(
  id: number,
  data: ProductUpdateRequest,
  token: string,
  method: 'PUT' | 'PATCH' = 'PATCH'
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * DELETE /api/v1/products - Delete a product (Protected)
 */
export async function deleteProduct(
  id: number,
  token: string
): Promise<ApiResponse<ProductDeleteResponse>> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText}`);
  }
  
  return response.json();
}