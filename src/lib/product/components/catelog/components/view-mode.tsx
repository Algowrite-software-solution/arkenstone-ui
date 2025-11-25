import { LayoutGrid, List, Table } from "lucide-react";

export type ViewMode = "card" | "list" | "table";

export interface ViewModeSwitcherProps {
  /** Current selected view mode */
  mode: ViewMode;

  /** Callback when user selects a different mode */
  onChange: (mode: ViewMode) => void;

  /** Optional: allow developer to pass custom modes or hide some */
  availableModes?: ViewMode[];

  /** Styles */
  className?: {
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
  className = {
    container : "flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm",
    button : "p-2 rounded-md border transition",
    selectedButton : "bg-gray-200 border-gray-400",
    unselectedButton : "border-gray-300",
    cardButton : "",
    listButton : "",
    tableButton : "",
    iconSize : 16,
  }
}: ViewModeSwitcherProps) {
  const btnClasses = (isSelected: boolean, extra = "") =>
    `${className.button} ${isSelected ? className.selectedButton : className.unselectedButton} ${extra}`.trim();

  return (
    <div className={className.container}>
      {availableModes.includes("card") && (
        <button
          className={btnClasses(mode === "card", className.cardButton)}
          onClick={() => onChange("card")}
        >
          <LayoutGrid size={className.iconSize} />
        </button>
      )}

      {availableModes.includes("list") && (
        <button
          className={btnClasses(mode === "list", className.listButton)}
          onClick={() => onChange("list")}
        >
          <List size={className.iconSize} />
        </button>
      )}

      {availableModes.includes("table") && (
        <button
          className={btnClasses(mode === "table", className.tableButton)}
          onClick={() => onChange("table")}
        >
          <Table size={className.iconSize} />
        </button>
      )}
    </div>
  );
}
