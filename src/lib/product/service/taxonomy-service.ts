import { apiGet, apiPost, apiPut, apiDelete, ApiOptions } from '../../hooks/api';
import { Taxonomy } from '../types';

// --- TYPE DEFINITIONS ---
/**
 * Defines the structure of a Taxonomy object.
 * Customize these properties to match your application's data model.
 */
export interface ServiceTypeTaxonomy extends Taxonomy {
    
}

/**
 * Defines the payload for creating a new taxonomy.
 * It omits server-generated fields like `id`, `created_at`, `updated_at`, and relational fields.
 */
export type TaxonomyCreationPayload = Omit<ServiceTypeTaxonomy, 'id' | 'created_at' | 'updated_at' | 'type' | 'parent' | 'children'>;

/**
 * Defines the payload for updating an existing taxonomy.
 * All fields are optional to allow for partial updates.
 */
export type TaxonomyUpdatePayload = Partial<TaxonomyCreationPayload>;

/**
 * Defines the available query parameters for fetching a list of taxonomies.
 * This is useful for implementing features like pagination, sorting, and searching.
 */
export type TaxonomyListQuery = {
    page?: number;
    per_page?: number;
    sort_by?: keyof Taxonomy;
    sort_order?: 'asc' | 'desc';
    search?: string;
    taxonomy_type_id?: number;
    parent_id?: number | null;
};

// --- TAXONOMY SERVICE ---

export const taxonomyService = {
    /**
     * Fetches a hierarchical list of taxonomies.
     * @param {TaxonomyListQuery} params - Query parameters for filtering and pagination.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<Taxonomy[]>} A promise that resolves to an array of taxonomies with nested children.
     */
    getTaxonomies(params: TaxonomyListQuery = {}, options: ApiOptions = {}): Promise<Taxonomy[]> {
        return apiGet('/taxonomies', { params, ...options });
    },

    /**
     * Fetches a single taxonomy by its unique identifier.
     * @param {string | number} id - The ID of the taxonomy.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<Taxonomy>} A promise that resolves to the requested taxonomy.
     */
    getTaxonomyById(id: string | number, options: ApiOptions = {}): Promise<Taxonomy> {
        if (!id) {
            throw new Error('Taxonomy ID must be provided.');
        }
        return apiGet(`/taxonomies/${id}`, options);
    },

    /**
     * Creates a new taxonomy.
     * @param {TaxonomyCreationPayload} taxonomyData - The data for the new taxonomy.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<Taxonomy>} A promise that resolves to the newly created taxonomy.
     */
    createTaxonomy(taxonomyData: TaxonomyCreationPayload, options: ApiOptions = {}): Promise<Taxonomy> {
        return apiPost('/taxonomies', { data: taxonomyData, displaySuccess: true, ...options });
    },

    /**
     * Updates an existing taxonomy's information.
     * @param {string | number} id - The ID of the taxonomy to update.
     * @param {TaxonomyUpdatePayload} taxonomyData - The data to update.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<Taxonomy>} A promise that resolves to the updated taxonomy.
     */
    updateTaxonomy(id: string | number, taxonomyData: TaxonomyUpdatePayload, options: ApiOptions = {}): Promise<Taxonomy> {
        if (!id) {
            throw new Error('Taxonomy ID must be provided for an update operation.');
        }
        return apiPut(`/taxonomies/${id}`, { data: taxonomyData, displaySuccess: true, ...options });
    },

    /**
     * Deletes a taxonomy and its children.
     * @param {string | number} id - The ID of the taxonomy to delete.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<void>} A promise that resolves when the deletion is successful.
     */
    deleteTaxonomy(id: string | number, options: ApiOptions = {}): Promise<void> {
        if (!id) {
            throw new Error('Taxonomy ID must be provided for a delete operation.');
        }
        return apiDelete(`/taxonomies/${id}`, { displaySuccess: true, ...options });
    },
};