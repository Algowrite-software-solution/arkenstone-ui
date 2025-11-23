import { ShoppingCart } from 'lucide-react';

export interface AddToCartButtonProps {
  /** Triggered when user clicks add-to-cart */
  onAddToCart?: () => void;
  addToCartText?: string;
  inCartText?: string;
  className?: string;
  iconOnly?: boolean;
  icon?: React.ReactNode;
  showIconWithText?: boolean;
  isOutOfStock?: boolean;
  isInCart?: boolean;
}

export function AddToCart({
  onAddToCart,
  addToCartText = "Add to Cart",
  inCartText = "In Cart",
  className = "flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2",
  iconOnly = false,
  icon = <ShoppingCart size={20} />,
  showIconWithText = true,
  isOutOfStock,
  isInCart = false,
}: AddToCartButtonProps) {

  const disabled = isOutOfStock;

  const handleClick = () => {
    if (!disabled && onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={disabled}
      aria-label={iconOnly ? (isInCart ? inCartText : addToCartText) : undefined}
      title={disabled ? 'Out of stock' : (isInCart ? inCartText : addToCartText)}
    >
      {iconOnly ? (
        icon
      ) : showIconWithText ? (
        <>
          {icon}
          <span>{isInCart ? inCartText : addToCartText}</span>
        </>
      ) : (
        <span>{isInCart ? inCartText : addToCartText}</span>
      )}
    </button>
  );
}
