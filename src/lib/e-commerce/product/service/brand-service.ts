import { ServiceFactory } from '@/services';
import { Brand } from '../types';

const initialState = {
  list: [] as Brand[],
  selected: null as Brand | null,
  loading: false,
};

export const brandService = new ServiceFactory<Brand>({
  endpoint: '/brands',
  entityName: 'Brand',
  syncWithStore: true,
  store: {
    initialState,
    persistName: 'brandStore', // the key that will be used to store the data in the local storage
  },
});
