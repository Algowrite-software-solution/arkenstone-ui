import { ProductImage } from "../types";
import { ServiceFactory } from "@/services";

const initialState = {
    list: [] as ProductImage[],
    selected: null as ProductImage | null,
    loading: false
}

export const productImageService = new ServiceFactory<ProductImage>({
    endpoint: '/product-images',
    entityName: 'ProductImage',
    syncWithStore: true,
    store: {
        initialState,
        persistName: 'productImageStore', // the key that will be used to store the data in the local storage
    },
});