import { cn } from "@/lib/utils";

export interface BrandTitleProps {
  brand?: React.ReactNode;
  title?: React.ReactNode;

  show?:{
    brand?: boolean;
    title?: boolean;
  }

  brandPlacement?: "before" | "after" | "hidden" | "top" | "bottom";

  classNames?:{
    brand?: string;
    title?: string;
    wrapper?: string;
    separator?: string;
  }
}

export function BrandTitle({
  brand = "test brand",
  title = "test title",

  show = {
    brand : true,
    title : true,
  },

  brandPlacement = "before",

  classNames = {
    separator : "px-2 opacity-60",
  },
}: BrandTitleProps) {
  /** Convert brand + title into styled React elements */
  const BrandComponent = show.brand && brand ? (
    <span className={classNames.brand}>{brand}</span>
  ) : null;

  const TitleComponent = show.title && title ? (
    <span className={classNames.title}>{title}</span>
  ) : null;

  /** Render Logic */
  const renderBrandTitleContent = () => {
    // A — Brand BEFORE Title (horizontal)
    if (brandPlacement === "before") {
      return (
        <div className={cn("flex items-center flex-wrap", classNames.wrapper)}>
          {BrandComponent}
          {BrandComponent && TitleComponent && (
            <span className={classNames.separator}>-</span>
          )}
          {TitleComponent}
        </div>
      );
    }

    // B — Brand AFTER Title (horizontal)
    if (brandPlacement === "after") {
      return (
        <div className={`flex items-center flex-wrap ${classNames.wrapper}`}>
          {TitleComponent}
          {BrandComponent && TitleComponent && (
            <span className={classNames.separator}>-</span>
          )}
          {BrandComponent}
        </div>
      );
    }

    // C — Brand on TOP, Title under
    if (brandPlacement === "top") {
      return (
        <div className={`${classNames.wrapper} flex flex-col`}>
          {BrandComponent}
          {TitleComponent}
        </div>
      );
    }

    // D — Title on TOP, Brand under
    if (brandPlacement === "bottom") {
      return (
        <div className={`${classNames.wrapper} flex flex-col`}>
          {TitleComponent}
          {BrandComponent}
        </div>
      );
    }

    // E — Brand hidden (only title)
    return (
      <div className={`${classNames.wrapper}`}>
        {TitleComponent}
      </div>
    );
  };

  return <>{renderBrandTitleContent()}</>;
}
