import { LayoutGrid, List, Table } from "lucide-react";

export type ViewMode = "card" | "list" | "table";

export interface ViewModeSwitcherProps {
  /** Current selected view mode */
  mode: ViewMode;

  /** Callback when user selects a different mode */
  onChange: (mode: ViewMode) => void;

  /** Optional: allow developer to pass custom modes or hide some */
  availableModes?: ViewMode[];

  /** Classname overrides */
  containerClassName?: string;
  buttonClassName?: string;
  selectedButtonClassName?: string;
  unselectedButtonClassName?: string;

  /** Per-button extra classnames (optional) */
  cardButtonClassName?: string;
  listButtonClassName?: string;
  tableButtonClassName?: string;

  /** Icon size */
  iconSize?: number;
}

export function ViewModeSwitcher({
  mode,
  onChange,
  availableModes = ["card", "list", "table"],
  containerClassName = "flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm",
  buttonClassName = "p-2 rounded-md border transition",
  selectedButtonClassName = "bg-gray-200 border-gray-400",
  unselectedButtonClassName = "border-gray-300",
  cardButtonClassName = "",
  listButtonClassName = "",
  tableButtonClassName = "",
  iconSize = 16,
}: ViewModeSwitcherProps) {
  const btnClasses = (isSelected: boolean, extra = "") =>
    `${buttonClassName} ${isSelected ? selectedButtonClassName : unselectedButtonClassName} ${extra}`.trim();

  return (
    <div className={containerClassName}>
      {availableModes.includes("card") && (
        <button
          className={btnClasses(mode === "card", cardButtonClassName)}
          onClick={() => onChange("card")}
        >
          <LayoutGrid size={iconSize} />
        </button>
      )}

      {availableModes.includes("list") && (
        <button
          className={btnClasses(mode === "list", listButtonClassName)}
          onClick={() => onChange("list")}
        >
          <List size={iconSize} />
        </button>
      )}

      {availableModes.includes("table") && (
        <button
          className={btnClasses(mode === "table", tableButtonClassName)}
          onClick={() => onChange("table")}
        >
          <Table size={iconSize} />
        </button>
      )}
    </div>
  );
}
