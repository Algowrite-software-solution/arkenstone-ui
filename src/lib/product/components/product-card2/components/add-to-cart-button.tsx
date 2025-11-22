import { ShoppingCart } from 'lucide-react';

export interface AddToCartButtonProps {
  /** Triggered when user clicks add-to-cart */
  onAddToCart?: () => void;
  text?: string;
  className?: string;
  iconOnly?: boolean;
  icon?: React.ReactNode;
  showIconWithText?: boolean;
  isOutOfStock?: boolean;
}

export function AddToCart<T>({
  onAddToCart,
  text = "Add to Cart",
  className = "flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2",
  iconOnly = false,
  icon = <ShoppingCart size={20} />,
  showIconWithText = true,
  isOutOfStock,
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
      aria-label={iconOnly ? text : undefined}
      title={disabled ? 'Out of stock' : text}
    >
      {iconOnly ? (
        icon
      ) : showIconWithText ? (
        <>
          {icon}
          <span>{text}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
}
