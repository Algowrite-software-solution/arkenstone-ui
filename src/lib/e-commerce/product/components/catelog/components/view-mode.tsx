import { Grid2x2Icon, Grid3x3Icon, Grip, LayoutGrid, List, Table } from "lucide-react";
import { cn } from "@/lib/utils";

/** 
 * Possible view modes 
 * 
 * "list" - Detailed list
 * "grid" - Compact grid
 * "gallery" - Large images
*/
export type ViewMode = "list" | "grid" | "gallery";

export interface ViewModeSwitcherProps {
  /** Current selected view mode */
  mode: ViewMode;

  /** Callback when user selects a different mode */
  onChange: (mode: ViewMode) => void;

  /** Optional: allow developer to pass custom modes or hide some */
  availableModes?: ViewMode[];

  /** Styles */
  classNames?: {
    container?: string;
    button?: string;
    selectedButton?: string;
    unselectedButton?: string;
    gridButton?: string;
    listButton?: string;
    galleryButton?: string;

    /** Icon size */
    iconSize?: number;
  }

}

export function ViewModeSwitcher({
  mode,
  onChange,
  availableModes = [],
  classNames = {}
}: ViewModeSwitcherProps) {
  const btnClasses = (isSelected: boolean, extra = "") =>
    `${cn("p-1 rounded-md transition",classNames.button)} ${isSelected ? cn("bg-gray-200 ",classNames.selectedButton) : cn(classNames.unselectedButton)} ${extra}`.trim();

  return (
    <div className={cn("flex items-center gap-2 p-2 rounded-lg shadow-sm",classNames.container)}>
      {availableModes.includes("grid") && (
        <button
          className={btnClasses(mode === "grid", cn(classNames.gridButton))}
          onClick={() => onChange("grid")}
        >
          <Grid3x3Icon size={cn(16,classNames.iconSize)} />
        </button>
      )}

      {availableModes.includes("list") && (
        <button
          className={btnClasses(mode === "list", cn(classNames.listButton))}
          onClick={() => onChange("list")}
        >
          <List size={cn(16,classNames.iconSize)} />
        </button>
      )}

      {availableModes.includes("gallery") && (
        <button
          className={btnClasses(mode === "gallery", cn(classNames.galleryButton))}
          onClick={() => onChange("gallery")}
        >
          <Grid2x2Icon size={cn(16,classNames.iconSize)} />
        </button>
      )}
    </div>
  );
}
