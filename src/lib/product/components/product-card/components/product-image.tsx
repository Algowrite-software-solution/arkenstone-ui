export interface ProductImageProps {
  imageUrl?: string | null;
  alt?: string;
  /** "bg" uses background-image, "img" uses an <img> */
  mode?: "bg" | "img";
  height?: number | string;
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
}

export default function ProductImage({
  imageUrl,
  alt = "Product image",
  mode = "bg",
  height = 200,
  className = "relative overflow-hidden rounded-lg",
  imageClassName = "w-full h-full object-cover",
  overlayClassName = "absolute inset-0 pointer-events-none",
  children,
  onClick,
}: ProductImageProps) {
  const style: React.CSSProperties =
    mode === "bg"
      ? {
          height: typeof height === "number" ? `${height}px` : height,
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { height: typeof height === "number" ? `${height}px` : height };

  return (
    <div className={className} style={style} onClick={onClick}>
      {mode === "img" ? (
        imageUrl ? (
          <img src={imageUrl} alt={alt} className={imageClassName} />
        ) : (
          <div className={`flex items-center justify-center ${imageClassName}`}>No image</div>
        )
      ) : (
        // when using background mode, keep an inner element so overlay children are positioned properly
        <div style={{ width: "100%", height: "100%" }} aria-hidden />
      )}

      {children ? <div className={overlayClassName}>{children}</div> : null}
    </div>
  );
}