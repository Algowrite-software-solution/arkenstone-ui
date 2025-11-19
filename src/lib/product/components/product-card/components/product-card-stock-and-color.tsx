// components/ProductCard/components/ProductCardStockAndColor.tsx
import React from 'react';
import { Product } from '../../../types'; // Adjust path as needed

interface ProductCardStockAndColorProps {
  product: Product;
  showQuantity?: boolean;
  showColors?: boolean;
  stockTextAvailable?: string;
  stockTextUnavailable?: string;
  stockTextLowStock?: string;
  lowStockThreshold?: number;
  stockClassName?: string;
  colorSwatchClassName?: string;
  selectedColorClassName?: string;
  wrapperClassName?: string;
  colorContainerClassName?: string;
  onColorSelect?: (color: string) => void;
  inStockClassName?: string;
  outOfStockClassName?: string;
  lowStockClassName?: string;
}

export const ProductCardStockAndColor: React.FC<ProductCardStockAndColorProps> = ({
  product,
  showQuantity = true,
  showColors = true,
  stockTextAvailable = 'In stock',
  stockTextUnavailable = 'Out of stock',
  stockTextLowStock = 'Low stock',
  lowStockThreshold = 10,
  stockClassName = 'text-sm font-medium mb-2',
  colorSwatchClassName = 'w-7 h-7 rounded-full border-2 cursor-pointer transition-all duration-200 hover:scale-110',
  selectedColorClassName = 'ring-2 ring-offset-2 ring-blue-500 scale-110',
  wrapperClassName = 'space-y-2',
  colorContainerClassName = 'flex flex-wrap gap-2',
  onColorSelect,
  inStockClassName = 'text-green-600',
  outOfStockClassName = 'text-red-600',
  lowStockClassName = 'text-orange-600',
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

  const isInStock = (product.quantity ?? 0) > 0;
  const isLowStock = (product.quantity ?? 0) > 0 && (product.quantity ?? 0) <= lowStockThreshold;

  const getStockClassName = () => {
    if (!isInStock) return outOfStockClassName;
    if (isLowStock) return lowStockClassName;
    return inStockClassName;
  };

  const getStockText = () => {
    if (!isInStock) return stockTextUnavailable;
    if (isLowStock) return stockTextLowStock;
    return stockTextAvailable;
  };

  return (
    <div className={wrapperClassName}>
      {/* Stock Status */}
      {showQuantity && product.quantity !== null && (
        <div className={`${stockClassName} ${getStockClassName()}`}>
          {getStockText()}
          {isInStock && ` (${product.quantity} available)`}
        </div>
      )}

      {/* Color Selection */}
      {showColors && product.colors && product.colors.length > 0 && (
        <div>
          <p className="text-xs text-gray-600 mb-1.5 font-medium">Colors:</p>
          <div className={colorContainerClassName}>
            {product.colors.map((color, index) => (
              <button
                key={index}
                className={`${colorSwatchClassName} ${
                  selectedColor === color.hex_code 
                    ? selectedColorClassName 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.hex_code }}
                onClick={() => {
                  setSelectedColor(color.hex_code);
                  onColorSelect?.(color.hex_code);
                }}
                title={color.name}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};