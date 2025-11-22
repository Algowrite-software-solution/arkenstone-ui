import React from "react";

export type ProductLayoutType = "compact" | "detailed";

export interface ProductCardLayoutProps {
  layout?: ProductLayoutType;

  ImageComponent: React.ReactNode;
  DetailsComponent: React.ReactNode;

  /** legacy single-class override for root */
  className?: string;

  /** granular class overrides */
  containerClassName?: string;
  compactWrapperClassName?: string;
  detailedWrapperClassName?: string;
  imageContainerClassName?: string;
  detailsContainerClassName?: string;
}

export function ProductCardLayout({
  layout = "compact",
  ImageComponent,
  DetailsComponent,
  containerClassName,
  compactWrapperClassName,
  detailedWrapperClassName,
  imageContainerClassName,
  detailsContainerClassName,
}: ProductCardLayoutProps) {
  const rootClass = containerClassName ?? "product-card-layout rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden";

  const compactWrapper = compactWrapperClassName ?? "flex flex-col";
  const detailedWrapper = detailedWrapperClassName ?? "flex";

  const imageClass = imageContainerClassName ?? (layout === "compact" ? "image-container w-full" : "image-container w-1/3");
  const detailsClass = detailsContainerClassName ?? (layout === "compact" ? "details-container p-3" : "details-container w-2/3 p-4");

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
