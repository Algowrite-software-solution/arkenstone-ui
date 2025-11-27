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

  labels?: {
    orderTitle?: string;
    orderButtonLabel?: string;
    sortByTitle?: string;
  };

  /** Styling */
  className?: {
    order?: string;
    orderDropdown?: string;
    orderButton?: string;

    dropdownContainer?: string;
    sortByHeader?: string;
    option?: string;
    optionSelected?: string;

    orderHeader?: string;
    orderOption?: string;
  };
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
  labels = {
    orderTitle: "Order",
    orderButtonLabel: undefined,
    sortByTitle: "Sort By",
  },
  className = {
    order: "w-full flex items-center justify-between bg-white rounded-lg shadow-sm p-3 mb-4",
    orderDropdown: "relative",
    orderButton: "px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-100 transition",
    dropdownContainer: "absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg border p-2 w-40 z-50",
    sortByHeader: "text-xs mb-1 font-semibold text-gray-500",
    option: "p-2 rounded cursor-pointer hover:bg-gray-100",
    optionSelected: "bg-gray-100",
    orderHeader: "mt-2 text-xs mb-1 font-semibold text-gray-500",
    orderOption: "p-2 rounded cursor-pointer hover:bg-gray-100",
  },
}: SortBarProps) {
  const [open, setOpen] = useState(false);

  const currentLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? "Default";

  return (
    <div className={className.order}>
      
      {/* Sort dropdown */}
      <div className={className.orderDropdown}>
        <button
          className={className.orderButton}
          onClick={() => setOpen(!open)}
        >
          {labels.orderButtonLabel ?? `Sort: ${currentLabel} · ${sortOrder === "asc" ? "Asc" : "Desc"}`}
        </button>

        {open && (
          <div className={className.dropdownContainer}>
            <div className={className.sortByHeader}>{labels.sortByTitle}</div>

            {sortOptions.map((option) => {
              const isSelected = sortBy === option.value;
              return (
                <div
                  key={option.value}
                  className={`${className.option} ${isSelected ? className.optionSelected : ""}`}
                  onClick={() => {
                    onSortByChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </div>
              );
            })}

            <div className={className.orderHeader}>{labels.orderTitle}</div>

            <div
              className={`${className.orderOption} ${sortOrder === "asc" ? className.optionSelected : ""}`}
              onClick={() => onSortChange("asc")}
            >
              Ascending
            </div>

            <div
              className={`${className.orderOption} ${sortOrder === "desc" ? className.optionSelected : ""}`}
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
