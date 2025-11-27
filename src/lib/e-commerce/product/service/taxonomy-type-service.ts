import { apiGet, apiPost, apiPut, apiDelete, ApiOptions } from '../../../hooks/api';
import { TaxonomyType } from '../types';

// --- TYPE DEFINITIONS ---
/**
 * Defines the structure of a TaxonomyType object.
 * Customize these properties to match your application's data model.
 */
export interface ServiceTypeTaxonomyType extends TaxonomyType {
    taxonomies?: any[];
}

/**
 * Defines the payload for creating a new taxonomy type.
 * It omits server-generated fields like `id`, `created_at`, and `updated_at`.
 */
export type TaxonomyTypeCreationPayload = Omit<ServiceTypeTaxonomyType, 'id' | 'created_at' | 'updated_at' | 'taxonomies'>;

/**
 * Defines the payload for updating an existing taxonomy type.
 * All fields are optional to allow for partial updates.
 */
export type TaxonomyTypeUpdatePayload = Partial<TaxonomyTypeCreationPayload>;

/**
 * Defines the available query parameters for fetching a list of taxonomy types.
 * This is useful for implementing features like pagination, sorting, and searching.
 */
export type TaxonomyTypeListQuery = {
    page?: number;
    per_page?: number;
    sort_by?: keyof TaxonomyType;
    sort_order?: 'asc' | 'desc';
    search?: string;
};

// --- TAXONOMY TYPE SERVICE ---

export const taxonomyTypeService = {
    /**
     * Fetches a list of taxonomy types.
     * @param {TaxonomyTypeListQuery} params - Query parameters for filtering and pagination.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<TaxonomyType[]>} A promise that resolves to an array of taxonomy types.
     */
    getTaxonomyTypes(params: TaxonomyTypeListQuery = {}, options: ApiOptions = {}): Promise<TaxonomyType[]> {
        return apiGet('/taxonomy-types', { params, ...options });
    },

    /**
     * Fetches a single taxonomy type by its unique identifier.
     * @param {string | number} id - The ID of the taxonomy type.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<TaxonomyType>} A promise that resolves to the requested taxonomy type.
     */
    getTaxonomyTypeById(id: string | number, options: ApiOptions = {}): Promise<TaxonomyType> {
        if (!id) {
            throw new Error('Taxonomy type ID must be provided.');
        }
        return apiGet(`/taxonomy-types/${id}`, options);
    },

    /**
     * Creates a new taxonomy type.
     * @param {TaxonomyTypeCreationPayload} taxonomyTypeData - The data for the new taxonomy type.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<TaxonomyType>} A promise that resolves to the newly created taxonomy type.
     */
    createTaxonomyType(taxonomyTypeData: TaxonomyTypeCreationPayload, options: ApiOptions = {}): Promise<TaxonomyType> {
        return apiPost('/taxonomy-types', { data: taxonomyTypeData, displaySuccess: true, ...options });
    },

    /**
     * Updates an existing taxonomy type's information.
     * @param {string | number} id - The ID of the taxonomy type to update.
     * @param {TaxonomyTypeUpdatePayload} taxonomyTypeData - The data to update.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<TaxonomyType>} A promise that resolves to the updated taxonomy type.
     */
    updateTaxonomyType(id: string | number, taxonomyTypeData: TaxonomyTypeUpdatePayload, options: ApiOptions = {}): Promise<TaxonomyType> {
        if (!id) {
            throw new Error('Taxonomy type ID must be provided for an update operation.');
        }
        return apiPut(`/taxonomy-types/${id}`, { data: taxonomyTypeData, displaySuccess: true, ...options });
    },

    /**
     * Deletes a taxonomy type.
     * @param {string | number} id - The ID of the taxonomy type to delete.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<void>} A promise that resolves when the deletion is successful.
     */
    deleteTaxonomyType(id: string | number, options: ApiOptions = {}): Promise<void> {
        if (!id) {
            throw new Error('Taxonomy type ID must be provided for a delete operation.');
        }
        return apiDelete(`/taxonomy-types/${id}`, { displaySuccess: true, ...options });
    },
};