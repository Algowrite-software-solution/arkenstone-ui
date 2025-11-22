import React from "react";


export interface ProductImageLayoutProps {
  imageUrl?: string;
  imageAlt?: string;
  width?: string | number;
  height?: string | number;

  // Classname overrides
  containerClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
  cornerClassName?: string;
  centerClassName?: string;

  // custom nodes (take precedence over built-ins)
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  center?: React.ReactNode;
}

/**
 * DefaultProductImage
 * - Renders an image as a background (cover)
 * - Provides 4 corner slots + center slot where you can place components (wishlist, discount badge, brand, price, view details)
 * - Fully customizable via className props and by passing custom nodes
 */
export function ProductImageLayout({
  imageUrl,
  imageAlt = "Product image",
  width = "100%",
  height = 280,

  containerClassName = "relative rounded-lg overflow-hidden bg-gray-100",
  imageClassName = "absolute inset-0 bg-center bg-cover",
  overlayClassName = "absolute inset-0 pointer-events-none",
  cornerClassName = "p-2 pointer-events-auto",
  centerClassName = "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto",

  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  center,
}: ProductImageLayoutProps) {
  const placeholder =
    "linear-gradient(135deg,#f3f4f6 0%, #e5e7eb 50%, #f8fafc 100%)";

  const bgStyle: React.CSSProperties = {
    backgroundImage: imageUrl ? `url(${imageUrl})` : placeholder,
    width: typeof width === "number" ? `${width}px` : String(width),
    height: typeof height === "number" ? `${height}px` : String(height),
  };

  return (
    <div className={`${containerClassName}`} style={bgStyle}>
      {/* background is applied via inline style to the root; keep an overlay layer for gradients */}
      <div className={imageClassName} aria-hidden style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : placeholder }} />

      {/* Overlay container (inset) */}
      <div className={overlayClassName}>

        {/* Top-left slot */}
        <div className={`absolute left-2 top-2 ${cornerClassName}`}>
          {topLeft}
        </div>

        {/* Top-right slot */}
        <div className={`absolute right-2 top-2 ${cornerClassName}`}>
          {topRight}
        </div>

        {/* Bottom-left slot */}
        <div className={`absolute left-2 bottom-2 ${cornerClassName} flex flex-col items-start gap-1`}>
          {bottomLeft}
        </div>

        {/* Bottom-right slot */}
        <div className={`absolute right-2 bottom-2 ${cornerClassName}`}>
          {bottomRight}
        </div>

        {/* Center slot (for badges, quick actions, or children) */}
        {center && <div className={centerClassName}>{center}</div>}
      </div>
    </div>
  );
}