import { LayoutGrid, List, Table } from "lucide-react";

export type ViewMode = "card" | "list" | "table";

export interface ViewModeSwitcherProps {
  /** Current selected view mode */
  mode: ViewMode;

  /** Callback when user selects a different mode */
  onChange: (mode: ViewMode) => void;

  /** Optional: allow developer to pass custom modes or hide some */
  availableModes?: ViewMode[];
}

export function ViewModeSwitcher({
  mode,
  onChange,
  availableModes = ["card", "list", "table"],
}: ViewModeSwitcherProps) {
  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
      {availableModes.includes("card") && (
        <button
          className={`p-2 rounded-md border transition ${
            mode === "card" ? "bg-gray-200 border-gray-400" : "border-gray-300"
          }`}
          onClick={() => onChange("card")}
        >
          <LayoutGrid size={16} />
        </button>
      )}

      {availableModes.includes("list") && (
        <button
          className={`p-2 rounded-md border transition ${
            mode === "list" ? "bg-gray-200 border-gray-400" : "border-gray-300"
          }`}
          onClick={() => onChange("list")}
        >
          <List size={16} />
        </button>
      )}

      {availableModes.includes("table") && (
        <button
          className={`p-2 rounded-md border transition ${
            mode === "table" ? "bg-gray-200 border-gray-400" : "border-gray-300"
          }`}
          onClick={() => onChange("table")}
        >
          <Table size={16} />
        </button>
      )}
    </div>
  );
}
