import { create } from "zustand";
import type { Product, Category } from "./product/types";
import { dummyProducts } from "./data/products";

// --- Types ---
interface CatalogState {
  products: Product[];
  total: number;
  loading: boolean;

  // Filter/Control State
  searchQuery: string;
  filters: Record<string, any>;
  sortOrder: "asc" | "desc";
  sortBy: string;
  viewMode: "list" | "card" | "table";

  // Pagination State
  page: number;
  pageSize: number;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setSortBy: (by: string) => void;
  setViewMode: (mode: "list" | "card" | "table") => void;
  setPage: (page: number) => void;

  // The "API Call"
  fetchProducts: () => Promise<void>;
}

interface ProductCardState {
  // wishlist: product ids
  wishlist: number[];
  
  // currently opened product details id (if any)
  activeProductId?: number | null;

  // actions
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  viewDetails: (productId: number) => void;
  closeDetails: () => void;
}

interface CartState {
  // cart: productId => quantity
  cart: Record<number, number>;

  addToCart: (productId: number, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  getCartQuantity: (productId: number) => number;
}

interface CategoryState {
  selectedCategory: Category | null;
  // accept either full Category or a lightweight CategoryItem from UI components
  setSelectedCategory: (cat: Category | Record<string, any>) => void;
}

// --- Store Implementation ---
export const useCatalogStore = create<CatalogState>((set, get) => ({
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

  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1 });
    get().fetchProducts();
  },
  setFilters: (filters) => {
    set({ filters, page: 1 });
    get().fetchProducts();
  },
  setSortOrder: (order) => {
    set({ sortOrder: order });
    get().fetchProducts();
  },
  setSortBy: (by) => {
    set({ sortBy: by });
    get().fetchProducts();
  },
  setViewMode: (mode) => set({ viewMode: mode }),
  setPage: (page) => {
    set({ page });
    get().fetchProducts();
  },

  fetchProducts: async () => {
    set({ loading: true });
    const { searchQuery, filters, sortOrder, sortBy, page, pageSize } = get();

    // --- SIMULATE API CALL ---
    // In a real app, you would replace this block with:
    // const res = await fetch(`/api/products?q=${searchQuery}&page=${page}...`);
    
    setTimeout(() => {
      // create a working copy
      let result = dummyProducts.slice();

      // 1) Search by name (safe guard)
      if (searchQuery && typeof searchQuery === "string") {
        const q = searchQuery.toLowerCase();
        result = result.filter((p) => String(p.name ?? "").toLowerCase().includes(q));
      }

      // 2) Category filter: expect filters.category to be array of slugs/strings
      if (filters?.category && Array.isArray(filters.category) && filters.category.length > 0) {
        result = result.filter((p) =>
          Array.isArray(p.categories) &&
          p.categories.some((c) => filters.category.includes(c.slug))
        );
      }

      // 3) Custom price range filter (example: price_custom stored as {min,max})
      if (filters?.price_custom && typeof filters.price_custom === "object") {
        const { min = -Infinity, max = Infinity } = filters.price_custom;
        result = result.filter((p) => {
          const price = typeof p.final_price === "number" ? p.final_price : (typeof p.price === "number" ? p.price : 0);
          return price >= min && price <= max;
        });
      }

      // 4) Sorting: support any sortBy (generic), with a special-case for "price"
      const resolveValue = (item: any, key: string | undefined) => {
        if (!key) return undefined;
        // special handling for "price" to prefer final_price
        if (key === "price") {
          return typeof item.final_price === "number" ? item.final_price : (typeof item.price === "number" ? item.price : 0);
        }
        // support dot-notation e.g. "manufacturer.name"
        const parts = key.split(".");
        let v: any = item;
        for (const p of parts) {
          if (v == null) return undefined;
          v = v[p];
        }
        return v;
      };

      // if caller provided a sortBy use generic resolver + type-aware comparison,
      // otherwise fall back to numeric price sorting (final_price > price)
      if (sortBy) {
        result.sort((a, b) => {
          const va = resolveValue(a, sortBy);
          const vb = resolveValue(b, sortBy);

          if (va == null && vb == null) return 0;
          if (va == null) return sortOrder === "asc" ? 1 : -1;
          if (vb == null) return sortOrder === "asc" ? -1 : 1;

          // numbers
          if (typeof va === "number" && typeof vb === "number") {
            return sortOrder === "asc" ? va - vb : vb - va;
          }

          // dates (JS Date or ISO strings)
          if (va instanceof Date || vb instanceof Date) {
            const da = va instanceof Date ? va.getTime() : Date.parse(String(va));
            const db = vb instanceof Date ? vb.getTime() : Date.parse(String(vb));
            return sortOrder === "asc" ? da - db : db - da;
          }

          // booleans
          if (typeof va === "boolean" && typeof vb === "boolean") {
            const na = va ? 1 : 0;
            const nb = vb ? 1 : 0;
            return sortOrder === "asc" ? na - nb : nb - na;
          }

          // fallback to string comparison
          const sa = String(va).toLowerCase();
          const sb = String(vb).toLowerCase();
          return sortOrder === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
        });
      } else {
        // default: numeric price sort (preserve previous behaviour)
        result.sort((a, b) => {
          const pa = typeof a.final_price === "number" ? a.final_price : (typeof a.price === "number" ? a.price : 0);
          const pb = typeof b.final_price === "number" ? b.final_price : (typeof b.price === "number" ? b.price : 0);
          return sortOrder === "asc" ? pa - pb : pb - pa;
        });
      }

      set({ products: result, total: result.length, loading: false });
    }, 500);
  }
}));

export const useProductCardStore = create<ProductCardState>((set, get) => ({
  wishlist: [],
  activeProductId: null,

  toggleWishlist: (productId) =>
    set((s) => {
      const exists = s.wishlist.includes(productId);
      return { wishlist: exists ? s.wishlist.filter((id) => id !== productId) : [...s.wishlist, productId] };
    }),

  isWishlisted: (productId) => {
    const s = get();
    return s.wishlist.includes(productId);
  },

  viewDetails: (productId) => set({ activeProductId: productId }),

  closeDetails: () => set({ activeProductId: null }),
}));

export const useCartStore = create<CartState>((set, get) => ({
  cart: {},

  addToCart: (productId, qty = 1) =>
    set((s) => {
      const current = s.cart[productId] ?? 0;
      return { cart: { ...s.cart, [productId]: current + qty } };
    }),

  removeFromCart: (productId) =>
    set((s) => {
      const next = { ...s.cart };
      delete next[productId];
      return { cart: next };
    }),

  getCartQuantity: (productId) => {
    const s = get();
    return s.cart[productId] ?? 0;
  },
}));

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: null,

  setSelectedCategory: (cat) => set({ selectedCategory: (cat as Category) ?? null }),
}));