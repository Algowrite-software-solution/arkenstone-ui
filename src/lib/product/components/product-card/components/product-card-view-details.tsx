// components/ProductCard/components/ProductCardViewDetails.tsx
import React from 'react';
import { Product } from '../../../types'; // Adjust path as needed
import { Eye } from 'lucide-react';

interface ProductCardViewDetailsProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  buttonText?: string;
  buttonClassName?: string;
  linkAsButton?: boolean; // If true, renders as an anchor tag with button styling
  customRender?: (props: { product: Product; onClick: () => void }) => React.ReactNode;
  children?: React.ReactNode;
  showIcon?: boolean;
  iconClassName?: string;
}

export const ProductCardViewDetails: React.FC<ProductCardViewDetailsProps> = ({
  product,
  onViewDetails,
  buttonText = 'View Details',
  buttonClassName = 'bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2',
  linkAsButton = false,
  customRender,
  children,
  showIcon = true,
  iconClassName = 'w-4 h-4',
}) => {
  const handleClick = (e?: React.MouseEvent) => {
    if (linkAsButton && e) {
      e.preventDefault();
    }
    onViewDetails?.(product);
  };

  // If custom render function is provided, use it
  if (customRender) {
    return <>{customRender({ product, onClick: handleClick })}</>;
  }

  // If children are provided, wrap them with click handler
  if (children) {
    return (
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    );
  }

  // Button/Link content
  const ButtonContent = () => (
    <>
      {showIcon && <Eye className={iconClassName} />}
      <span>{buttonText}</span>
    </>
  );

  // Default button/link rendering
  if (linkAsButton) {
    return (
      <a
        href={`/products/${product.id}`}
        className={buttonClassName}
        onClick={handleClick}
      >
        <ButtonContent />
      </a>
    );
  }

  return (
    <button
      className={buttonClassName}
      onClick={handleClick}
      type="button"
    >
      <ButtonContent />
    </button>
  );
};