// components/ProductCard/components/ProductCardViewDetails.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed

interface ProductCardViewDetailsProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  buttonText?: string;
  buttonClassName?: string;
  linkAsButton?: boolean; // If true, renders as an anchor tag with button styling
  customRender?: (props: { product: Product; onClick: () => void }) => React.ReactNode;
  children?: React.ReactNode;
}

export const ProductCardViewDetails: React.FC<ProductCardViewDetailsProps> = ({
  product,
  onViewDetails,
  buttonText = 'View Details',
  buttonClassName = 'product-card__button product-card__button--secondary',
  linkAsButton = false,
  customRender,
  children,
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
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    );
  }

  // Default button/link rendering
  if (linkAsButton) {
    return (
      <a
        href={`/products/${product.id}`}
        className={buttonClassName}
        onClick={handleClick}
      >
        {buttonText}
      </a>
    );
  }

  return (
    <button
      className={buttonClassName}
      onClick={handleClick}
    >
      {buttonText}
    </button>
  );
};