import { LayoutGrid, List, Table } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "card" | "list" | "table";

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
    cardButton?: string;
    listButton?: string;
    tableButton?: string;

    /** Icon size */
    iconSize?: number;
  }

}

export function ViewModeSwitcher({
  mode,
  onChange,
  availableModes = ["card", "list", "table"],
  classNames = {}
}: ViewModeSwitcherProps) {
  const btnClasses = (isSelected: boolean, extra = "") =>
    `${cn("p-2 rounded-md transition",classNames.button)} ${isSelected ? cn("bg-gray-200 border-gray-400",classNames.selectedButton) : cn("border-gray-300",classNames.unselectedButton)} ${extra}`.trim();

  return (
    <div className={cn("flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm",classNames.container)}>
      {availableModes.includes("card") && (
        <button
          className={btnClasses(mode === "card", cn(classNames.cardButton))}
          onClick={() => onChange("card")}
        >
          <LayoutGrid size={cn(classNames.iconSize)} />
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

      {availableModes.includes("table") && (
        <button
          className={btnClasses(mode === "table", cn(classNames.tableButton))}
          onClick={() => onChange("table")}
        >
          <Table size={cn(classNames.iconSize)} />
        </button>
      )}
    </div>
  );
}
