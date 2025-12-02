import { useState } from "react";
import { cn } from "@/lib/utils";

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
  classNames?: {
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
  classNames = {},
}: SortBarProps) {
  const [open, setOpen] = useState(false);

  const currentLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? "Default";

  return (
    <div className={cn("w-full flex items-center justify-between bg-white rounded-lg shadow-sm p-3 mb-4",classNames.order)}>
      
      {/* Sort dropdown */}
      <div className={cn("relative",classNames.orderDropdown)}>
        <button
          className={cn("px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition",classNames.orderButton)}
          onClick={() => setOpen(!open)}
        >
          {labels.orderButtonLabel ?? `Sort: ${currentLabel} · ${sortOrder === "asc" ? "Asc" : "Desc"}`}
        </button>

        {open && (
          <div className={cn("absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-2 w-40 z-50",classNames.dropdownContainer)}>
            <div className={cn("text-xs mb-1 font-semibold text-gray-500",classNames.sortByHeader)}>{labels.sortByTitle}</div>
            {sortOptions.map((option) => {
              const isSelected = sortBy === option.value;
              return (
                <div
                  key={option.value}
                  className={`${cn("p-2 rounded cursor-pointer hover:bg-gray-100",classNames.option)} ${isSelected ? cn("bg-gray-100",classNames.optionSelected) : ""}`}
                  onClick={() => {
                    onSortByChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </div>
              );
            })}

            <div className={cn("mt-2 text-xs mb-1 font-semibold text-gray-500",classNames.orderHeader)}>{labels.orderTitle}</div>

            <div
              className={`${cn("p-2 rounded cursor-pointer hover:bg-gray-100",classNames.orderOption)} ${sortOrder === "asc" ? cn("bg-gray-100",classNames.optionSelected) : ""}`}
              onClick={() => onSortChange("asc")}
            >
              Ascending
            </div>

            <div
              className={`${cn("p-2 rounded cursor-pointer hover:bg-gray-100",classNames.orderOption)} ${sortOrder === "desc" ? cn("bg-gray-100",classNames.optionSelected) : ""}`}
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
