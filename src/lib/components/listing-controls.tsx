import React from "react";
import { List, Grid, ArrowUpDown } from "lucide-react";

export type SortOrder = "asc" | "desc";
export type ViewMode = "list" | "card" | "table";

interface ListingControlProps {
  /** Sort logic */
  sortOrder?: SortOrder;
  onSortChange?: (order: SortOrder) => void;

  /** View mode logic */
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;

  /** Enable/disable internal default controls */
  enableSort?: boolean;
  enableViewMode?: boolean;

  /** Custom render overrides */
  renderSortButton?: (sortOrder: SortOrder, toggle: () => void) => React.ReactNode;
  renderViewModeButton?: (
    mode: ViewMode,
    isActive: boolean,
    change: (mode: ViewMode) => void
  ) => React.ReactNode;

  /** Replace entire sections */
  renderLeftSection?: React.ReactNode;
  renderRightSection?: React.ReactNode;

  /** Additional custom controls */
  extraLeftControls?: React.ReactNode;
  extraRightControls?: React.ReactNode;

  /** Custom view mode icons */
  viewModeIcons?: Partial<Record<ViewMode, React.ReactNode>>;

  /** Styling */
  className?: string;
}

export function ListingControl({
  sortOrder = "asc",
  onSortChange,
  viewMode = "list",
  onViewModeChange,

  enableSort = true,
  enableViewMode = true,

  renderSortButton,
  renderViewModeButton,
  renderLeftSection,
  renderRightSection,

  extraLeftControls,
  extraRightControls,

  viewModeIcons,

  className,
}: ListingControlProps) {
  /** default sort toggle */
  const toggleSort = () => {
    onSortChange?.(sortOrder === "asc" ? "desc" : "asc");
  };

  /** default view mode icons */
  const icons = {
    list: <List size={18} />,
    card: <Grid size={18} />,
    table: <Grid size={18} />, // You can update with your own icon
    ...viewModeIcons, // override with custom icons
  };

  /** Default sort button */
  const defaultSortButton = (
    <button
      className="px-3 py-2 border rounded-lg flex items-center gap-2"
      onClick={toggleSort}
    >
      <ArrowUpDown size={16} />
      {sortOrder === "asc" ? "Ascending" : "Descending"}
    </button>
  );

  /** Default view mode buttons (list/cards/table) */
  const defaultViewModeButtons = (
    <div className="flex gap-2">
      {(["list", "card", "table"] as ViewMode[]).map((mode) => (
        <button
          key={mode}
          className={`p-2 border rounded-lg ${
            viewMode === mode ? "bg-gray-100" : ""
          }`}
          onClick={() => onViewModeChange?.(mode)}
        >
          {icons[mode]}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`flex items-center justify-between gap-4 p-3 border rounded-lg bg-white ${className}`}>
      
      {/* LEFT SECTION */}
      {renderLeftSection ? (
        renderLeftSection
      ) : (
        <div className="flex items-center gap-3">
          {extraLeftControls}
          
          {enableSort &&
            (renderSortButton
              ? renderSortButton(sortOrder, toggleSort)
              : defaultSortButton)}
        </div>
      )}

      {/* RIGHT SECTION */}
      {renderRightSection ? (
        renderRightSection
      ) : (
        <div className="flex items-center gap-3">
          {extraRightControls}

          {enableViewMode &&
            (renderViewModeButton
              ? renderViewModeButton(viewMode, viewMode === viewMode, onViewModeChange!)
              : defaultViewModeButtons)}
        </div>
      )}
    </div>
  );
}
