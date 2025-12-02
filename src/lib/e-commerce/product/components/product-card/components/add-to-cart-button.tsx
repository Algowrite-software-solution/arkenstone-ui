import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AddToCartButtonProps {
  /** Triggered when user clicks add-to-cart */
  onAddToCart?: () => void;

  iconOnly?: boolean;
  showIconWithText?: boolean;

  /** Icon Node */
  icon?: React.ReactNode;

  className?: string;

  /** Labels */
  labels?: {
    addToCartText?: string;
    inCartText?: string;
  }

  state?:{
    isOutOfStock?: boolean;
    isInCart?: boolean;
  }
}

export function AddToCart({
  onAddToCart,

  iconOnly = false,
  showIconWithText = true,

  icon = <ShoppingCart size={20} />,
  className,

  labels = {
    addToCartText: "Add to Cart",
    inCartText: "In Cart"
  },
  state = {
    isOutOfStock : false,
    isInCart : false,
  }

}: AddToCartButtonProps) {

  const disabled = state.isOutOfStock;

  const handleClick = () => {
    if (!disabled && onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <button
      className={cn("flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2",className)}
      onClick={handleClick}
      disabled={disabled}
      aria-label={iconOnly ? (state.isInCart ? labels.inCartText : labels.addToCartText) : undefined}
      title={disabled ? 'Out of stock' : (state.isInCart ? labels.inCartText : labels.addToCartText)}
    >
      {iconOnly ? (
        icon
      ) : showIconWithText ? (
        <>
          {icon}
          <span>{state.isInCart ? labels.inCartText : labels.addToCartText}</span>
        </>
      ) : (
        <span>{state.isInCart ? labels.inCartText : labels.addToCartText}</span>
      )}
    </button>
  );
}
