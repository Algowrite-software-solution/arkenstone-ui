import { Category } from "../types";
import { ServiceFactory } from "@/services";

const initialState = {
    list: [] as Category[],
    selected: null as Category | null,
    loading: false
}

export const categoryService = new ServiceFactory<Category>({
    endpoint: '/categories',
    entityName: 'Category',
    syncWithStore: true,
    store: {
        initialState,
        persistName: 'categoryStore', // the key that will be used to store the data in the local storage
    },
});