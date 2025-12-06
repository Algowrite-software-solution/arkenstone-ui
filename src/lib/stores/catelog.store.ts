import { createGenericStore } from "./store-factory";

import type { Product, Category } from "../e-commerce/product/types";
import { dummyProducts } from "../../test/mock/products";

interface CatalogState {
  products: Product[];
  total: number;
  loading: boolean;
  searchQuery: string;
  filters: Record<string, any>;
  sortOrder: "asc" | "desc";
  sortBy: string;
  viewMode: "list" | "card" | "table";
  page: number;
  pageSize: number;
}

interface CatalogActions {
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setSortBy: (by: string) => void;
  setViewMode: (mode: "list" | "card" | "table") => void;
  setPage: (page: number) => void;
  fetchProducts: () => Promise<void>;
}

export const useCatalogStore = createGenericStore<CatalogState, CatalogActions>(
  // Initial state
  {
    products: [],
    total: 0,
    loading: false,
    searchQuery: "",
    filters: {},
    sortOrder: "asc",
    sortBy: "price",
    viewMode: "card",
    page: 1,
    pageSize: 8,
  },
  {
    name: "catalog-store", // Enables localStorage persistence
    methods: (set, get) => ({
      setSearchQuery: (query) => {
        set(state => {
          state.searchQuery = query;
          state.page = 1;
        });
        get().fetchProducts();
      },
      
      setFilters: (filters) => {
        set(state => {
          state.filters = filters;
          state.page = 1;
        });
        get().fetchProducts();
      },
      
      setSortOrder: (order) => {
        set(state => { state.sortOrder = order });
        get().fetchProducts();
      },
      
      setSortBy: (by) => {
        set(state => { state.sortBy = by });
        get().fetchProducts();
      },
      
      setViewMode: (mode) => set(state => { state.viewMode = mode }),
      
      setPage: (page) => {
        set(state => { state.page = page });
        get().fetchProducts();
      },
      
      fetchProducts: async () => {
        set(state => { state.loading = true });
        const { searchQuery, filters, sortOrder, sortBy, page, pageSize } = get();

        setTimeout(() => {
          let result = dummyProducts.slice();

          // Search
          if (searchQuery && typeof searchQuery === "string") {
            const q = searchQuery.toLowerCase();
            result = result.filter((p) => 
              String(p.name ?? "").toLowerCase().includes(q)
            );
          }

          // Category filter
          if (filters?.category && Array.isArray(filters.category) && filters.category.length > 0) {
            result = result.filter((p) =>
              Array.isArray(p.categories) &&
              p.categories.some((c) => filters.category.includes(c.slug))
            );
          }

          // Price filter
          if (filters?.price_custom && typeof filters.price_custom === "object") {
            const { min = -Infinity, max = Infinity } = filters.price_custom;
            result = result.filter((p) => {
              const price = typeof p.sale_price === "number" 
                ? p.sale_price 
                : (typeof p.price === "number" ? p.price : 0);
              return price >= min && price <= max;
            });
          }

          // Sorting logic (keeping your existing implementation)
          const resolveValue = (item: any, key: string | undefined) => {
            if (!key) return undefined;
            if (key === "price") {
              return typeof item.sale_price === "number" 
                ? item.sale_price 
                : (typeof item.price === "number" ? item.price : 0);
            }
            const parts = key.split(".");
            let v: any = item;
            for (const p of parts) {
              if (v == null) return undefined;
              v = v[p];
            }
            return v;
          };

          if (sortBy) {
            result.sort((a, b) => {
              const va = resolveValue(a, sortBy);
              const vb = resolveValue(b, sortBy);

              if (va == null && vb == null) return 0;
              if (va == null) return sortOrder === "asc" ? 1 : -1;
              if (vb == null) return sortOrder === "asc" ? -1 : 1;

              if (typeof va === "number" && typeof vb === "number") {
                return sortOrder === "asc" ? va - vb : vb - va;
              }

              if (va instanceof Date || vb instanceof Date) {
                const da = va instanceof Date ? va.getTime() : Date.parse(String(va));
                const db = vb instanceof Date ? vb.getTime() : Date.parse(String(vb));
                return sortOrder === "asc" ? da - db : db - da;
              }

              if (typeof va === "boolean" && typeof vb === "boolean") {
                const na = va ? 1 : 0;
                const nb = vb ? 1 : 0;
                return sortOrder === "asc" ? na - nb : nb - na;
              }

              const sa = String(va).toLowerCase();
              const sb = String(vb).toLowerCase();
              return sortOrder === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
            });
          } else {
            result.sort((a, b) => {
              const pa = typeof a.sale_price === "number" 
                ? a.sale_price 
                : (typeof a.price === "number" ? a.price : 0);
              const pb = typeof b.sale_price === "number" 
                ? b.sale_price 
                : (typeof b.price === "number" ? b.price : 0);
              return sortOrder === "asc" ? pa - pb : pb - pa;
            });
          }

          set(state => {
            state.products = result;
            state.total = result.length;
            state.loading = false;
          });
        }, 500);
      }
    })
  }
);



interface ProductCardState {
  wishlist: number[];
  activeProductId: number | null;
}

interface ProductCardActions {
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  viewDetails: (productId: number) => void;
  closeDetails: () => void;
}

export const useProductCardStore = createGenericStore<ProductCardState, ProductCardActions>(
  {
    wishlist: [],
    activeProductId: null,
  },
  {
    name: "product-card-store", // Persist wishlist across sessions!
    methods: (set, get) => ({
      toggleWishlist: (productId) => set(state => {
        const index = state.wishlist.indexOf(productId);
        if (index > -1) {
          state.wishlist.splice(index, 1);
        } else {
          state.wishlist.push(productId);
        }
      }),

      isWishlisted: (productId) => {
        return get().wishlist.includes(productId);
      },

      viewDetails: (productId) => set(state => {
        state.activeProductId = productId;
      }),

      closeDetails: () => set(state => {
        state.activeProductId = null;
      }),
    })
  }
);


interface CartState {
  cart: Record<number, number>;
}

interface CartActions {
  addToCart: (productId: number, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  getCartQuantity: (productId: number) => number;
  getTotalItems: () => number;
  clearCart: () => void;
}

export const useCartStore = createGenericStore<CartState, CartActions>(
  {
    cart: {},
  },
  {
    name: "shopping-cart", // Persist cart across sessions!
    methods: (set, get) => ({
      addToCart: (productId, qty = 1) => set(state => {
        state.cart[productId] = (state.cart[productId] ?? 0) + qty;
      }),

      removeFromCart: (productId) => set(state => {
        delete state.cart[productId];
      }),

      updateQuantity: (productId, qty) => set(state => {
        if (qty <= 0) {
          delete state.cart[productId];
        } else {
          state.cart[productId] = qty;
        }
      }),

      getCartQuantity: (productId) => {
        return get().cart[productId] ?? 0;
      },

      getTotalItems: () => {
        const cart = get().cart;
        return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
      },

      clearCart: () => set(state => {
        state.cart = {};
      }),
    })
  }
);


interface CategoryState {
  selectedCategory: Category | null;
}

interface CategoryActions {
  setSelectedCategory: (cat: Category | Record<string, any> | null) => void;
  clearCategory: () => void;
}

export const useCategoryStore = createGenericStore<CategoryState, CategoryActions>(
  {
    selectedCategory: null,
  },
  {
    // No name = no persistence (temporary UI state)
    methods: (set) => ({
      setSelectedCategory: (cat) => set(state => {
        state.selectedCategory = (cat as Category) ?? null;
      }),

      clearCategory: () => set(state => {
        state.selectedCategory = null;
      }),
    })
  }
);
