import { cn } from "@/lib/utils";

export interface ViewDetailsButtonProps {
  /** Called when the button is clicked */
  onClick?: () => void;

  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ViewDetailsButton({
  onClick,
  label = "View Details",
  disabled = false,
  className,
}: ViewDetailsButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(disabled ? "opacity-50 cursor-not-allowed" : "", cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-200 transition", className))}
    >
      {label}
    </button>
  );
}
