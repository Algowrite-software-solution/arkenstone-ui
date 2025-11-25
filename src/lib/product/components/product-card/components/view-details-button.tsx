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
  className = "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-200 transition",
}: ViewDetailsButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {label}
    </button>
  );
}
