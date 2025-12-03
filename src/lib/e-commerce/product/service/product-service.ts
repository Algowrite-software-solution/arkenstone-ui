// #REVISION: this is an instantiation of the generic service (ServiceFactory) for the Product entity.
// this will help us to connect with the backend /products API endpoint and perform CRUD operations with ability to perform basic unique API requests.
// more over it support the managing requested data locally storing it in the zustand store (if you pass the store config and syncWithStore: true).
// 

import { ServiceFactory } from "@/services";
import { Product } from "../types";

const initialState = {
    list: [] as Product[],
    filters: {} as any,
    selected: null as Product | null,
    loading: false
}

export const productService = new ServiceFactory<Product>({
    endpoint: '/products',
    entityName: 'Product',
    syncWithStore: true,
    store: {
        initialState,
        persistName: 'productStore', // the key that will be used to store the data in the local storage
    },
});