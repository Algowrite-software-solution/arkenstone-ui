import { apiGet, apiPost, apiPut, apiDelete, ApiOptions } from '../../../hooks/api';
import { Brand } from '../types';

// --- TYPE DEFINITIONS ---
/**
 * Defines the structure of a Brand object.
 * Customize these properties to match your application's data model.
 */
export interface ServiceTypeBrand extends Brand {
    
}

/**
 * Defines the payload for creating a new brand.
 * It omits server-generated fields like `id`.
 */
export type BrandCreationPayload = Omit<ServiceTypeBrand, 'id'>;

/**
 * Defines the payload for updating an existing brand.
 * All fields are optional to allow for partial updates.
 */
export type BrandUpdatePayload = Partial<BrandCreationPayload>;

/**
 * Defines the available query parameters for fetching a list of brands.
 * This is useful for implementing features like pagination, sorting, and searching.
 */
export type BrandListQuery = {
    page?: number;
    per_page?: number;
    sort_by?: keyof Brand;
    sort_order?: 'asc' | 'desc';
    search?: string;
};

// --- BRAND SERVICE ---

export const brandService = {
    /**
     * Fetches a paginated and filterable list of brands.
     * @param {BrandListQuery} params - Query parameters for filtering and pagination.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<Brand[]>} A promise that resolves to an array of brands.
     */
    getBrands(params: BrandListQuery = {}, options: ApiOptions = {}): Promise<Brand[]> {
        return apiGet('/brands', { params, ...options });
    },

    /**
     * Fetches a single brand by its unique identifier.
     * @param {string | number} id - The ID of the brand.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<Brand>} A promise that resolves to the requested brand.
     */
    getBrandById(id: string | number, options: ApiOptions = {}): Promise<Brand> {
        if (!id) {
            throw new Error('Brand ID must be provided.');
        }
        return apiGet(`/brands/${id}`, options);
    },

    /**
     * Creates a new brand.
     * @param {BrandCreationPayload} brandData - The data for the new brand.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<Brand>} A promise that resolves to the newly created brand.
     */
    createBrand(brandData: BrandCreationPayload, options: ApiOptions = {}): Promise<Brand> {
        return apiPost('/brands', { data: brandData, displaySuccess: true, ...options });
    },

    /**
     * Updates an existing brand's information.
     * @param {string | number} id - The ID of the brand to update.
     * @param {BrandUpdatePayload} brandData - The data to update.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<Brand>} A promise that resolves to the updated brand.
     */
    updateBrand(id: string | number, brandData: BrandUpdatePayload, options: ApiOptions = {}): Promise<Brand> {
        if (!id) {
            throw new Error('Brand ID must be provided for an update operation.');
        }
        return apiPut(`/brands/${id}`, { data: brandData, displaySuccess: true, ...options });
    },

    /**
     * Deletes a brand.
     * @param {string | number} id - The ID of the brand to delete.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<void>} A promise that resolves when the deletion is successful.
     */
    deleteBrand(id: string | number, options: ApiOptions = {}): Promise<void> {
        if (!id) {
            throw new Error('Brand ID must be provided for a delete operation.');
        }
        return apiDelete(`/brands/${id}`, { displaySuccess: true, ...options });
    },
};