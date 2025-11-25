import React from "react";

export type ProductLayoutType = "compact" | "detailed";

export interface ProductCardLayoutProps {
  layout?: ProductLayoutType;

  ImageComponent: React.ReactNode;
  DetailsComponent: React.ReactNode;

  /** granular class overrides */
  className?: {
    container?: string;
    compactWrapper?: string;
    detailedWrapper?: string;
    imageContainer?: string;
    detailsContainer?: string;
  }
}

export function ProductCardLayout({
  layout = "compact",
  ImageComponent,
  DetailsComponent,
  className = {
    container: "",
    compactWrapper: "",
    detailedWrapper: "",
    imageContainer: "",
    detailsContainer: "",
  },
}: ProductCardLayoutProps) {
  const rootClass = className.container ?? "product-card-layout rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden";

  const compactWrapper = className.compactWrapper ?? "flex flex-col";
  const detailedWrapper = className.detailedWrapper ?? "flex";

  const imageClass = className.imageContainer ?? (layout === "compact" ? "image-container w-full" : "image-container w-1/3");
  const detailsClass = className.detailsContainer ?? (layout === "compact" ? "details-container p-3" : "details-container w-2/3 p-4");

  return (
    <div className={rootClass}>
      {layout === "compact" ? (
        <div className={compactWrapper}>
          <div className={imageClass}>{ImageComponent}</div>
          <div className={detailsClass}>{DetailsComponent}</div>
        </div>
      ) : (
        <div className={detailedWrapper}>
          <div className={imageClass}>{ImageComponent}</div>
          <div className={detailsClass}>{DetailsComponent}</div>
        </div>
      )}
    </div>
  );
}
