import { cn } from "@/util";

export interface BrandTitleProps {
  brand?: React.ReactNode;
  title?: React.ReactNode;

  show?:{
    brand?: boolean;
    title?: boolean;
  }

  brandPlacement?: "before" | "after" | "hidden" | "top" | "bottom";

  className?:{
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

  className = {
    separator : "px-2 opacity-60",
  },
}: BrandTitleProps) {
  /** Convert brand + title into styled React elements */
  const BrandComponent = show.brand && brand ? (
    <span className={className.brand}>{brand}</span>
  ) : null;

  const TitleComponent = show.title && title ? (
    <span className={className.title}>{title}</span>
  ) : null;

  /** Render Logic */
  const renderBrandTitleContent = () => {
    // A — Brand BEFORE Title (horizontal)
    if (brandPlacement === "before") {
      return (
        <div className={cn("flex items-center flex-wrap", className.wrapper)}>
          {BrandComponent}
          {BrandComponent && TitleComponent && (
            <span className={className.separator}>-</span>
          )}
          {TitleComponent}
        </div>
      );
    }

    // B — Brand AFTER Title (horizontal)
    if (brandPlacement === "after") {
      return (
        <div className={`flex items-center flex-wrap ${className.wrapper}`}>
          {TitleComponent}
          {BrandComponent && TitleComponent && (
            <span className={className.separator}>-</span>
          )}
          {BrandComponent}
        </div>
      );
    }

    // C — Brand on TOP, Title under
    if (brandPlacement === "top") {
      return (
        <div className={`${className.wrapper} flex flex-col`}>
          {BrandComponent}
          {TitleComponent}
        </div>
      );
    }

    // D — Title on TOP, Brand under
    if (brandPlacement === "bottom") {
      return (
        <div className={`${className.wrapper} flex flex-col`}>
          {TitleComponent}
          {BrandComponent}
        </div>
      );
    }

    // E — Brand hidden (only title)
    return (
      <div className={`${className.wrapper}`}>
        {TitleComponent}
      </div>
    );
  };

  return <>{renderBrandTitleContent()}</>;
}
