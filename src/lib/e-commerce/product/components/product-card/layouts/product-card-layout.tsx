import { cn } from "@/lib/utils";

export type ProductLayoutType = "compact" | "detailed";

export interface ProductCardLayoutProps {
  layout?: ProductLayoutType;

  ImageComponent: React.ReactNode;
  DetailsComponent: React.ReactNode;

  /** granular class overrides */
  classNames?: {
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
  classNames = {},
}: ProductCardLayoutProps) {
  return (
    <div className={cn("product-card-layout rounded-xl border-gray-200 bg-white shadow-sm overflow-hidden", classNames.container)}>
      {layout === "compact" ? (
        <div className={cn("flex flex-col", classNames.compactWrapper)}>
          <div className={cn("image-container w-full", classNames.imageContainer)}>{ImageComponent}</div>
          <div className={cn( "details-container p-3", classNames.detailsContainer)}>{DetailsComponent}</div>
        </div>
      ) : (
        <div className={cn("flex flex-row",classNames.detailedWrapper)}>
          <div className={cn("image-container w-1/3", classNames.imageContainer)}>{ImageComponent}</div>
          <div className={cn("details-container w-2/3 p-4")}>{DetailsComponent}</div>
        </div>
      )}
    </div>
  );
}
