// components/ProductCard/components/ProductCardStockAndColor.tsx
import React from 'react';
import { Product } from '../../types'; // Adjust path as needed

interface ProductCardStockAndColorProps {
  product: Product;
  showQuantity?: boolean;
  showColors?: boolean;
  stockTextAvailable?: string;
  stockTextUnavailable?: string;
  stockClassName?: string;
  colorSwatchClassName?: string;
  selectedColorClassName?: string;
  wrapperClassName?: string;
  onColorSelect?: (color: string) => void;
}

export const ProductCardStockAndColor: React.FC<ProductCardStockAndColorProps> = ({
  product,
  showQuantity = true,
  showColors = true,
  stockTextAvailable = 'In stock',
  stockTextUnavailable = 'Out of stock',
  stockClassName = 'product-card__stock-text',
  colorSwatchClassName = 'product-card__color-swatch',
  selectedColorClassName = 'product-card__color-swatch--selected',
  wrapperClassName = 'product-card__stock-color-wrapper',
  onColorSelect,
}) => {
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].hex_code);
    }
  }, [product.colors, selectedColor]);

  if ((product.quantity === null || !showQuantity) && (!product.colors || !showColors)) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      {showQuantity && product.quantity !== null && (
        <div className={stockClassName}>
          {product.quantity > 0 ? stockTextAvailable : stockTextUnavailable}
        </div>
      )}
      {showColors && product.colors && product.colors.length > 0 && (
        <div className="product-card__color-options">
          {product.colors.map((color, index) => (
            <div
              key={index}
              className={`${colorSwatchClassName} ${selectedColor === color.hex_code ? selectedColorClassName : ''}`}
              style={{ backgroundColor: color.hex_code }}
              onClick={() => {
                setSelectedColor(color.hex_code);
                onColorSelect?.(color.hex_code);
              }}
              title={color.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};