import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WishlistButtonProps {

  isWishlisted?: boolean;
  onToggle?: (value: boolean) => void;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;

  ariaLabel?: string;
  size?: number;

  classNames?:{
    button?: string;
    icon?: string;
  }

  animationDuration?: number;
}

export function WishlistButton({
  isWishlisted = false,
  onToggle,
  icon,
  activeIcon,
  ariaLabel = "Add to wishlist",
  size = 22,
  classNames = {},
  animationDuration = 200,
}: WishlistButtonProps) {
  const handleClick = () => {
    onToggle?.(!isWishlisted);       
  };

  const defaultIcon = (
    <Heart
      size={size}
      className={cn("transition-all", classNames?.icon)}
    />
  );

  const defaultActiveIcon = (
    <Heart
      size={size}
      className={cn("transition-all", classNames?.icon)}
      fill="currentColor"
    />
  );

  return (
    <button
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn("group transition-all", `duration-${animationDuration}`, classNames?.button)}
    >
      {isWishlisted
        ? activeIcon || defaultActiveIcon
        : icon || defaultIcon}
    </button>
  );
}
