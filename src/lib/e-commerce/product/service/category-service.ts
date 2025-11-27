import { apiGet, apiPost, apiPut, apiDelete, ApiOptions } from '../../../hooks/api';
import { Category } from '../types';

// --- TYPE DEFINITIONS ---
/**
 * Defines the structure of a Category object.
 * Customize these properties to match your application's data model.
 */
export interface ServiceTypeCategory extends Category {
    
}

/**
 * Defines the payload for creating a new category.
 * It omits server-generated fields like `id` and `children`.
 */
export type CategoryCreationPayload = Omit<ServiceTypeCategory, 'id' | 'children'>;

/**
 * Defines the payload for updating an existing category.
 * All fields are optional to allow for partial updates.
 */
export type CategoryUpdatePayload = Partial<CategoryCreationPayload>;

/**
 * Defines the available query parameters for fetching a list of categories.
 * This is useful for implementing features like pagination, sorting, and searching.
 */
export type CategoryListQuery = {
    page?: number;
    per_page?: number;
    sort_by?: keyof Category;
    sort_order?: 'asc' | 'desc';
    search?: string;
    parent_id?: number | null;
};

// --- CATEGORY SERVICE ---

export const categoryService = {
    /**
     * Fetches a hierarchical list of categories.
     * @param {CategoryListQuery} params - Query parameters for filtering and pagination.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<Category[]>} A promise that resolves to an array of categories with nested children.
     */
    getCategories(params: CategoryListQuery = {}, options: ApiOptions = {}): Promise<Category[]> {
        return apiGet('/categories', { params, ...options });
    },

    /**
     * Fetches a single category by its unique identifier.
     * @param {string | number} id - The ID of the category.
     * @param {ApiOptions} options - Custom options for the API request.
     * @returns {Promise<Category>} A promise that resolves to the requested category.
     */
    getCategoryById(id: string | number, options: ApiOptions = {}): Promise<Category> {
        if (!id) {
            throw new Error('Category ID must be provided.');
        }
        return apiGet(`/categories/${id}`, options);
    },

    /**
     * Creates a new category.
     * @param {CategoryCreationPayload} categoryData - The data for the new category.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<Category>} A promise that resolves to the newly created category.
     */
    createCategory(categoryData: CategoryCreationPayload, options: ApiOptions = {}): Promise<Category> {
        return apiPost('/categories', { data: categoryData, displaySuccess: true, ...options });
    },

    /**
     * Updates an existing category's information.
     * @param {string | number} id - The ID of the category to update.
     * @param {CategoryUpdatePayload} categoryData - The data to update.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<Category>} A promise that resolves to the updated category.
     */
    updateCategory(id: string | number, categoryData: CategoryUpdatePayload, options: ApiOptions = {}): Promise<Category> {
        if (!id) {
            throw new Error('Category ID must be provided for an update operation.');
        }
        return apiPut(`/categories/${id}`, { data: categoryData, displaySuccess: true, ...options });
    },

    /**
     * Deletes a category.
     * @param {string | number} id - The ID of the category to delete.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<void>} A promise that resolves when the deletion is successful.
     */
    deleteCategory(id: string | number, options: ApiOptions = {}): Promise<void> {
        if (!id) {
            throw new Error('Category ID must be provided for a delete operation.');
        }
        return apiDelete(`/categories/${id}`, { displaySuccess: true, ...options });
    },
};