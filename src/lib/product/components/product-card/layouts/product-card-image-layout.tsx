import React from "react";


export interface ProductImageLayoutProps {
  imageUrl?: string;
  imageAlt?: string;
  width?: string | number;
  height?: string | number;

  // optional custom background node (img, video, carousel, animated component...)
  background?: React.ReactNode;

  // Classname overrides
  className?: {
    container?: string;
    image?: string;
    overlay?: string;
    corner?: string;
    center?: string;
    background?: string;
    backgroundWrapper?: string;
  }

  // custom nodes (take precedence over built-ins)
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  center?: React.ReactNode;

  // placeholders shown when both left & right for a region are missing
  topPlaceholder?: React.ReactNode;
  bottomPlaceholder?: React.ReactNode;

  placeholderClassName?: {
    top?: string;
    bottom?: string;
  }

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
  background,
  className = {
    container: "relative rounded-lg overflow-hidden bg-gray-100",
    image: "absolute inset-0 bg-center bg-cover z-0",
    overlay: "absolute inset-0 pointer-events-none z-10",
    corner: "p-2 pointer-events-auto",
    center: "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto",
    background: "absolute inset-0 z-0",
    backgroundWrapper: "absolute inset-0 overflow-hidden z-0",
  },

  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  center,

  topPlaceholder,
  bottomPlaceholder,

  placeholderClassName = {
    top: "absolute left-0 right-0 top-2 px-2 flex items-center",
    bottom: "absolute left-0 right-0 bottom-2 px-2 flex items-center",
  },
}: ProductImageLayoutProps) {
  const placeholder =
    "linear-gradient(135deg,#f3f4f6 0%, #e5e7eb 50%, #f8fafc 100%)";

  const rootStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : String(width),
    height: typeof height === "number" ? `${height}px` : String(height),
  };

  const renderTopRow = () => {
    const hasAny = !!topLeft || !!topRight;
    if (!hasAny && topPlaceholder) {
      return <div className="w-full flex justify-center">{topPlaceholder}</div>;
    }

    return (
      <>
        <div className="flex-1 flex items-start">
          {topLeft ? <div className={className.corner}>{topLeft}</div> : null}
        </div>
        <div className="flex-1 flex items-end justify-end">
          {topRight ? <div className={className.corner}>{topRight}</div> : null}
        </div>
      </>
    );
  };

  const renderBottomRow = () => {
    const hasAny = !!bottomLeft || !!bottomRight;
    if (!hasAny && bottomPlaceholder) {
      return <div className="w-full flex justify-center">{bottomPlaceholder}</div>;
    }

    return (
      <>
        <div className="flex-1 flex items-start">
          {bottomLeft ? <div className={className.corner}>{bottomLeft}</div> : null}
        </div>
        <div className="flex-1 flex items-end justify-end">
          {bottomRight ? <div className={className.corner}>{bottomRight}</div> : null}
        </div>
      </>
    );
  };

  return (
    <div className={className.container} style={rootStyle}>
      {/* background slot: if provided render it; otherwise render built-in background image */}
      <div className={className.backgroundWrapper} aria-hidden>
        {background ? (
          <div className={className.background}>{background}</div>
        ) : (
          <div
            className={className.image}
            style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : placeholder }}
            role="img"
            aria-label={imageAlt}
          />
        )}
      </div>

      {/* Overlay container (above background) */}
      <div className={className.overlay}>
        {/* Top row: shows left & right; if both missing uses topPlaceholder centered */}
        <div className={placeholderClassName.top}>{renderTopRow()}</div>

        {/* Bottom row: shows left & right; if both missing uses bottomPlaceholder centered */}
        <div className={placeholderClassName.bottom}>{renderBottomRow()}</div>

        {center && <div className={className.center}>{center}</div>}
      </div>
    </div>
  );
}