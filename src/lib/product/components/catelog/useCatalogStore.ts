import { create } from "zustand";
import type { Product } from "../../../product/types";
import { dummyProducts } from "../../../data/products";

// --- Types ---
interface CatalogState {
  products: Product[];
  total: number;
  loading: boolean;

  // Filter/Control State
  searchQuery: string;
  filters: Record<string, any>;
  sortOrder: "asc" | "desc";
  viewMode: "list" | "card" | "table";

  // Pagination State
  page: number;
  pageSize: number;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setViewMode: (mode: "list" | "card" | "table") => void;
  setPage: (page: number) => void;

  // The "API Call"
  fetchProducts: () => Promise<void>;
}

// --- Store Implementation ---
export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  total: 0,
  loading: false,

  searchQuery: "",
  filters: {},
  sortOrder: "asc",
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
  setViewMode: (mode) => set({ viewMode: mode }),
  setPage: (page) => {
    set({ page });
    get().fetchProducts();
  },

  fetchProducts: async () => {
    set({ loading: true });
    const { searchQuery, filters, sortOrder, page, pageSize } = get();

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

      // 4) Generic fallback: sort by numeric price (final_price > price)
      result.sort((a, b) => {
        const pa = typeof a.final_price === "number" ? a.final_price : (typeof a.price === "number" ? a.price : 0);
        const pb = typeof b.final_price === "number" ? b.final_price : (typeof b.price === "number" ? b.price : 0);
        return sortOrder === "asc" ? pa - pb : pb - pa;
      });

      // 5) Pagination
      const total = result.length;
      const start = (page - 1) * pageSize;
      const paginated = result.slice(start, start + pageSize);

      set({ products: paginated, total, loading: false });
    }, 350);
  },
}));