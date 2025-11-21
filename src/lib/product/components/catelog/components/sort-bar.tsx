import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

export interface SortOption {
  label: string;
  value: string;
}

export interface SortBarProps {
  /** asc | desc */
  sortOrder: "asc" | "desc";

  /** Current sorting value */
  sortBy: string;

  /** Sorting options (developer can add more) */
  sortOptions?: SortOption[];

  /** Callbacks */
  onSortChange: (order: "asc" | "desc") => void;
  onSortByChange: (sortBy: string) => void;

  orderTitle?: string;
  orderButtonLabel?: string;
  sortByTitle?: string;

  // className overrides exposed as props
  orderClassName?: string;
  orderDropdownClassName?: string;
  orderButtonClassName?: string;

  // additional className props for items and headers
  dropdownContainerClassName?: string;
  sortByHeaderClassName?: string;
  optionClassName?: string;
  optionSelectedClassName?: string;

  orderHeaderClassName?: string;
  orderOptionClassName?: string;
}

export function SortBar({
  sortOrder,
  sortBy,
  sortOptions = [
    { label: "Name", value: "name" },
    { label: "Price", value: "price" },
  ],
  onSortChange,
  onSortByChange,
  orderTitle = "Order",
  orderButtonLabel,
  sortByTitle = "Sort By",
  orderClassName = "w-full flex items-center justify-between bg-white rounded-lg shadow-sm p-3 mb-4",
  orderDropdownClassName = "relative",
  orderButtonClassName = "px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-100 transition",
  // new defaults for the added props
  dropdownContainerClassName = "absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg border p-2 w-40 z-50",
  sortByHeaderClassName = "text-xs mb-1 font-semibold text-gray-500",
  optionClassName = "p-2 rounded cursor-pointer hover:bg-gray-100",
  optionSelectedClassName = "bg-gray-100",
  orderHeaderClassName = "mt-2 text-xs mb-1 font-semibold text-gray-500",
  orderOptionClassName = "p-2 rounded cursor-pointer hover:bg-gray-100",
}: SortBarProps) {
  const [open, setOpen] = useState(false);

  const currentLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? "Default";

  return (
    <div className={orderClassName}>
      
      {/* Sort dropdown */}
      <div className={orderDropdownClassName}>
        <button
          className={orderButtonClassName}
          onClick={() => setOpen(!open)}
        >
          {orderButtonLabel ?? `Sort: ${currentLabel} · ${sortOrder === "asc" ? "Asc" : "Desc"}`}
        </button>

        {open && (
          <div className={dropdownContainerClassName}>
            <div className={sortByHeaderClassName}>{sortByTitle}</div>

            {sortOptions.map((option) => {
              const isSelected = sortBy === option.value;
              return (
                <div
                  key={option.value}
                  className={`${optionClassName} ${isSelected ? optionSelectedClassName : ""}`}
                  onClick={() => {
                    onSortByChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </div>
              );
            })}

            <div className={orderHeaderClassName}>{orderTitle}</div>

            <div
              className={`${orderOptionClassName} ${sortOrder === "asc" ? optionSelectedClassName : ""}`}
              onClick={() => onSortChange("asc")}
            >
              Ascending
            </div>

            <div
              className={`${orderOptionClassName} ${sortOrder === "desc" ? optionSelectedClassName : ""}`}
              onClick={() => onSortChange("desc")}
            >
              Descending
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
