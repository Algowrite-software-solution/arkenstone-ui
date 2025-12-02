import { useEffect } from "react";
import CatalogContentLayout from "../layouts/catelog-content-layout";
import {Search} from "../../../../../components/custom/search";
import Filters from "../components/filter";
import { Listing } from "../layouts/listings-layout";
import { ListingControl } from "../components/listing-controls";
import { Pagination } from "../components/pagination";
import { ProductCard } from "../../product-card/product-card";
import { useCatalogStore } from "../../../../../stores/useStore";

const FILTER_CONFIG = [
  {
    id: "categories",
    title: "Categories",
    type: "tree",
    options: [
      {
        label: "Dresses",
        value: "dresses",
        children: [
          { label: "Short Dresses", value: "short-dresses" },
          { label: "Midi Dresses", value: "midi-dresses" },
          { label: "Maxi Dresses", value: "maxi-dresses" },
        ],
      },
      {
        label: "Tops",
        value: "tops",
        children: [
          { label: "T-shirts", value: "tshirts" },
          { label: "Knitwear", value: "knitwear" },
        ],
      },
    ],
  },
  {
    id: "sizes",
    title: "Sizes",
    type: "checkbox",
    options: [
      { label: "XS", value: "xs" },
      { label: "S", value: "s" },
      { label: "M", value: "m" },
      { label: "L", value: "l" },
      { label: "XL", value: "xl" },
    ],
  },
  {
    id: "price_custom",
    title: "Price",
    type: "price_custom",
    options: [{ label: "Price", value: "price", min: 0, max: 2000, step: 10 }],
  },
];

export default function DefaultCatalogPage() {
  const {
    products,
    total,
    loading,
    searchQuery,
    filters,
    sortOrder,
    sortBy,
    viewMode,
    page,
    pageSize,
    setSearchQuery,
    setFilters,
    setSortOrder,
    setSortBy,
    setViewMode,
    setPage,
    fetchProducts,
  } = useCatalogStore();

  // initial fetch
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderProductList = () => {
    if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
    if (!products || products.length === 0) return <div className="p-10 text-center">No products found.</div>;

    if (viewMode === "table") {
      return (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{(p.categories || []).map((c: any) => c.name).join(", ")}</td>
                <td className="p-2 text-right">{typeof p.sale_price === "number" ? `$${p.sale_price}` : `$${p.price ?? "0"}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    const gridClass = viewMode === "card" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4";

    return (
      <div className={gridClass}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    );
  };

  // basic derived UI (keeps a small search area)
  const top = (
    <div className="w-full max-w-4xl mx-auto mb-4">
      <Search
        placeholder="Search products..."
        value={searchQuery}
        onChange={(q) => {
          setSearchQuery(q);
        }}
        debounce={300}
        buttonType="icon"
      />
    </div>
  );

  const left = (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <div className="p-2 border-b font-semibold">Filters</div>
      <div className="p-3">
        <Filters filters={FILTER_CONFIG} value={filters} onChange={(next) => setFilters(next)} />
      </div>
    </div>
  );

  const controls = (
    <ListingControl
      sortProps={{
        sortOrder: sortOrder ?? "desc",
        sortBy: sortBy ?? "price",
        onSortChange: (order) => setSortOrder(order),
        onSortByChange: (by) => setSortBy(by),
      }}
      viewModeProps={{
        mode: viewMode,
        onChange: (m) => setViewMode(m),
      }}
    />
  );

  const pagination = (
    <Pagination
      page={page}
      total={total}
      pageSize={pageSize}
      onChange={(p) => setPage(p)}
      show={{ summary: true }}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CatalogContentLayout top={top} left={left} listings={<Listing controls={controls} list={renderProductList()} pagination={pagination} />} />
    </div>
  );
}