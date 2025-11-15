import { apiGet, apiPost, apiPut, apiDelete, ApiOptions } from '../../util/api';
import { Product } from '../types';

// --- TYPE DEFINITIONS ---
/**
 * Defines the structure of a Product object.
 * Customize these properties to match your application's data model.
 */
export interface ServiceTypeProduct extends Product{
    
}

/**
 * Defines the payload for creating a new product.
 * It omits server-generated fields like `id`, `created_at`, and `updated_at`.
 */
export type ProductCreationPayload = Omit<ServiceTypeProduct, 'id' | 'created_at' | 'updated_at'>;

/**
 * Defines the payload for updating an existing product.
 * All fields are optional to allow for partial updates.
 */
export type ProductUpdatePayload = Partial<ProductCreationPayload>;

/**
 * Defines the available query parameters for fetching a list of products.
 * This is useful for implementing features like pagination, sorting, and searching.
 */
export interface ProductListQuery {
    page?: number;
    per_page?: number;
    sort_by?: keyof Product;
    sort_order?: 'asc' | 'desc';
    search?: string;
}

// --- PRODUCT SERVICE ---

export const productService = {
    /**
     * Fetches a paginated and filterable list of products.
     * @param {ProductListQuery} params - Query parameters for filtering and pagination.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<Product[]>} A promise that resolves to an array of products.
     */
    getProducts(params: ProductListQuery = {}, options: ApiOptions = {}): Promise<Product[]> {
        return apiGet('/products', { params, ...options });
    },

    /**
     * Fetches a single product by its unique identifier.
     * @param {string | number} id - The ID of the product.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<Product>} A promise that resolves to the requested product.
     */
    getProductById(id: string | number, options: ApiOptions = {}): Promise<Product> {
        if (!id) {
            throw new Error('Product ID must be provided.');
        }
        return apiGet(`/products/${id}`, options);
    },

    /**
     * Creates a new product.
     * @param {ProductCreationPayload} productData - The data for the new product.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<Product>} A promise that resolves to the newly created product.
     */
    createProduct(productData: ProductCreationPayload, options: ApiOptions = {}): Promise<Product> {
        return apiPost('/products', { data: productData, displaySuccess: true, ...options });
    },

    /**
     * Updates an existing product's information.
     * @param {string | number} id - The ID of the product to update.
     * @param {ProductUpdatePayload} productData - The data to update.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<Product>} A promise that resolves to the updated product.
     */
    updateProduct(id: string | number, productData: ProductUpdatePayload, options: ApiOptions = {}): Promise<Product> {
        if (!id) {
            throw new Error('Product ID must be provided for an update operation.');
        }
        return apiPut(`/products/${id}`, { data: productData, displaySuccess: true, ...options });
    },

    /**
     * Deletes a product.
     * @param {string | number} id - The ID of the product to delete.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<void>} A promise that resolves when the deletion is successful.
     */
    deleteProduct(id: string | number, options: ApiOptions = {}): Promise<void> {
        if (!id) {
            throw new Error('Product ID must be provided for a delete operation.');
        }
        return apiDelete(`/products/${id}`, { displaySuccess: true, ...options });
    },
};