import { cn } from "@/lib/utils";

export interface ProductImageProps {
  imageUrl?: string | null;
  alt?: string;
  /** "bg" uses background-image, "img" uses an <img> */
  mode?: "bg" | "img";
  height?: number | string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;

  classNames?: {
    wrapper?: string;
    image?: string;
    overlay?: string;
  }
}

export default function ProductImage({
  imageUrl,
  alt = "Product image",
  mode = "bg",
  height = 200,
  classNames = {},
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
    <div className={cn("relative overflow-hidden rounded-lg",classNames.wrapper)} style={style} onClick={onClick}>
      {mode === "img" ? (
        imageUrl ? (
          <img src={imageUrl} alt={alt} className={cn("w-full h-full object-cover",classNames.image)} />
        ) : (
          <div className={`flex items-center justify-center ${cn("w-full h-full object-cover",classNames.image)}`}>No image</div>
        )
      ) : (
        // when using background mode, keep an inner element so overlay children are positioned properly
        <div style={{ width: "100%", height: "100%" }} aria-hidden />
      )}

      {children ? <div className={cn("absolute inset-0 pointer-events-none",classNames.overlay)}>{children}</div> : null}
    </div>
  );
}