import { Heart } from "lucide-react";
import React from "react";

export interface WishlistButtonProps {

  isWishlisted?: boolean;
  onToggle?: (value: boolean) => void;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;

  className?: string;
  iconClassName?: string;
  ariaLabel?: string;
  size?: number;

  animationDuration?: number;
}

export function WishlistButton({
  isWishlisted = false,
  onToggle,
  icon,
  activeIcon,
  className = "",
  iconClassName = "",
  ariaLabel = "Add to wishlist",
  size = 22,
  animationDuration = 200,
}: WishlistButtonProps) {
  const handleClick = () => {
    onToggle?.(!isWishlisted);       
  };

  const defaultIcon = (
    <Heart
      size={size}
      className={`transition-all ${iconClassName}`}
    />
  );

  const defaultActiveIcon = (
    <Heart
      size={size}
      className={`transition-all ${iconClassName}`}
      fill="currentColor"
    />
  );

  return (
    <button
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`group transition-all duration-${animationDuration} ${className}`}
    >
      {isWishlisted
        ? activeIcon || defaultActiveIcon
        : icon || defaultIcon}
    </button>
  );
}
