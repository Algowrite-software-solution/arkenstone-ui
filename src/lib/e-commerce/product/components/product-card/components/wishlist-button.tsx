import { Heart } from "lucide-react";
import React from "react";

export interface WishlistButtonProps {

  isWishlisted?: boolean;
  onToggle?: (value: boolean) => void;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;

  ariaLabel?: string;
  size?: number;

  className?:{
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
  className = {
    button: "",
    icon: "",
  },
  animationDuration = 200,
}: WishlistButtonProps) {
  const handleClick = () => {
    onToggle?.(!isWishlisted);       
  };

  const defaultIcon = (
    <Heart
      size={size}
      className={`transition-all ${className?.icon}`}
    />
  );

  const defaultActiveIcon = (
    <Heart
      size={size}
      className={`transition-all ${className?.icon}`}
      fill="currentColor"
    />
  );

  return (
    <button
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`group transition-all duration-${animationDuration} ${className?.button}`}
    >
      {isWishlisted
        ? activeIcon || defaultActiveIcon
        : icon || defaultIcon}
    </button>
  );
}
