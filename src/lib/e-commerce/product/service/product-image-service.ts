import { apiGet, apiPost, apiPut, apiDelete, ApiOptions } from '../../../hooks/api';
import { ProductImage } from '../types';

// --- TYPE DEFINITIONS ---
/**
 * Defines the structure of a ProductImage object.
 * Customize these properties to match your application's data model.
 */
export interface ServiceTypeProductImage extends ProductImage {
    
}

/**
 * Defines the payload for creating a new product image.
 * It omits server-generated fields.
 */
export type ProductImageCreationPayload = Omit<ServiceTypeProductImage, 'product_id' | 'url' | 'order'> & {
    image: File;
};

/**
 * Defines the payload for updating an existing product image.
 * All fields are optional to allow for partial updates.
 */
export type ProductImageUpdatePayload = Partial<Omit<ServiceTypeProductImage, 'product_id' | 'url'>>;

/**
 * Defines the available query parameters for fetching a list of product images.
 * This is useful for implementing features like filtering and searching.
 */
export type ProductImageListQuery = {
    product_id?: number;
    is_primary?: boolean;
};

// --- PRODUCT IMAGE SERVICE ---

export const productImageService = {
    /**
     * Uploads a new product image.
     * @param {File} image - The image file to upload.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<ProductImage>} A promise that resolves to the newly uploaded product image.
     */
    uploadImage(image: File, options: ApiOptions = {}): Promise<ProductImage> {
        const formData = new FormData();
        formData.append('image', image);
        
        return apiPost('/products/images', { 
            data: formData, 
            displaySuccess: true, 
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            ...options 
        });
    },

    /**
     * Deletes a product image.
     * @param {number} imageId - The ID of the product image to delete.
     * @param {ApiOptions} options - Custom options for the API request, `displaySuccess` is enabled by default.
     * @returns {Promise<void>} A promise that resolves when the deletion is successful.
     */
    deleteImage(imageId: number, options: ApiOptions = {}): Promise<void> {
        if (!imageId) {
            throw new Error('Image ID must be provided for a delete operation.');
        }
        return apiDelete(`/products/images`, { 
            data: { image_id: imageId },
            displaySuccess: true, 
            ...options 
        });
    },
};