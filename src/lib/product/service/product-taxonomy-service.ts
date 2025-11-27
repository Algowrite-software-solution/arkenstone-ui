import { apiPost, apiPut, apiDelete, ApiOptions } from '../../hooks/api';
import { ProductTaxonomy } from '../types';

// --- TYPE DEFINITIONS ---

/**
 * Defines the structure of a ProductTaxonomy relationship.
 * This represents the many-to-many relationship between products and taxonomies.
 */
export interface ServiceTypeProductTaxonomy extends ProductTaxonomy {
    
}

/**
 * Defines the payload for attaching taxonomies to a product.
 */
export type ProductTaxonomyAttachPayload = {
    taxonomy_ids: number[];
};

/**
 * Defines the payload for syncing taxonomies with a product.
 * This replaces all existing taxonomies with the provided list.
 */
export type ProductTaxonomySyncPayload = {
    taxonomy_ids: number[];
};

// --- PRODUCT TAXONOMY SERVICE ---

export const productTaxonomyService = {
    /**
     * Attaches taxonomies to a product.
     * This adds the specified taxonomies to the product without removing existing ones.
     * @param {string | number} productId - The ID of the product.
     * @param {ProductTaxonomyAttachPayload} payload - The payload containing taxonomy IDs to attach.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<void>} A promise that resolves when the taxonomies are attached successfully.
     */
    attachTaxonomies(
        productId: string | number, 
        payload: ProductTaxonomyAttachPayload, 
        options: ApiOptions = {}
    ): Promise<void> {
        if (!productId) {
            throw new Error('Product ID must be provided for attaching taxonomies.');
        }
        if (!payload.taxonomy_ids || payload.taxonomy_ids.length === 0) {
            throw new Error('At least one taxonomy ID must be provided.');
        }
        return apiPost(`/products/${productId}/taxonomies/attach`, { 
            data: payload, 
            displaySuccess: true, 
            ...options 
        });
    },

    /**
     * Syncs taxonomies with a product.
     * This replaces all existing taxonomies with the provided list.
     * @param {string | number} productId - The ID of the product.
     * @param {ProductTaxonomySyncPayload} payload - The payload containing taxonomy IDs to sync.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<void>} A promise that resolves when the taxonomies are synced successfully.
     */
    syncTaxonomies(
        productId: string | number, 
        payload: ProductTaxonomySyncPayload, 
        options: ApiOptions = {}
    ): Promise<void> {
        if (!productId) {
            throw new Error('Product ID must be provided for syncing taxonomies.');
        }
        if (!Array.isArray(payload.taxonomy_ids)) {
            throw new Error('Taxonomy IDs must be provided as an array.');
        }
        return apiPut(`/products/${productId}/taxonomies/sync`, { 
            data: payload, 
            displaySuccess: true, 
            ...options 
        });
    },

    /**
     * Detaches a specific taxonomy from a product.
     * @param {string | number} productId - The ID of the product.
     * @param {string | number} taxonomyId - The ID of the taxonomy to detach.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<void>} A promise that resolves when the taxonomy is detached successfully.
     */
    detachTaxonomy(productId: string | number, taxonomyId: string | number, options: ApiOptions = {}): Promise<void> {
        if (!productId) {
            throw new Error('Product ID must be provided for detaching a taxonomy.');
        }
        if (!taxonomyId) {
            throw new Error('Taxonomy ID must be provided for detaching.');
        }
        return apiDelete(`/products/${productId}/taxonomies/${taxonomyId}`, { 
            displaySuccess: true, 
            ...options 
        });
    },
};