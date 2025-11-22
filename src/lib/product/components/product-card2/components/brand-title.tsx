export interface BrandTitleProps {
  brand?: React.ReactNode;
  title?: React.ReactNode;

  showBrand?: boolean;
  showTitle?: boolean;

  brandPlacement?: "before" | "after" | "hidden" | "top" | "bottom";

  brandClassName?: string;
  titleClassName?: string;
  wrapperClassName?: string;
  separatorClassName?: string;
}

export function BrandTitle({
  brand = "test brand",
  title = "test title",
  showBrand = true,
  showTitle = true,

  brandPlacement = "before",

  brandClassName = "",
  titleClassName = "",
  wrapperClassName = "",
  separatorClassName = "px-2 opacity-60",
}: BrandTitleProps) {
  /** Convert brand + title into styled React elements */
  const BrandComponent = showBrand && brand ? (
    <span className={brandClassName}>{brand}</span>
  ) : null;

  const TitleComponent = showTitle && title ? (
    <span className={titleClassName}>{title}</span>
  ) : null;

  /** Render Logic */
  const renderBrandTitleContent = () => {
    // A — Brand BEFORE Title (horizontal)
    if (brandPlacement === "before") {
      return (
        <div className={`flex items-center flex-wrap ${wrapperClassName}`}>
          {BrandComponent}
          {BrandComponent && TitleComponent && (
            <span className={separatorClassName}>-</span>
          )}
          {TitleComponent}
        </div>
      );
    }

    // B — Brand AFTER Title (horizontal)
    if (brandPlacement === "after") {
      return (
        <div className={`flex items-center flex-wrap ${wrapperClassName}`}>
          {TitleComponent}
          {BrandComponent && TitleComponent && (
            <span className={separatorClassName}>-</span>
          )}
          {BrandComponent}
        </div>
      );
    }

    // C — Brand on TOP, Title under
    if (brandPlacement === "top") {
      return (
        <div className={`${wrapperClassName} flex flex-col`}>
          {BrandComponent}
          {TitleComponent}
        </div>
      );
    }

    // D — Title on TOP, Brand under
    if (brandPlacement === "bottom") {
      return (
        <div className={`${wrapperClassName} flex flex-col`}>
          {TitleComponent}
          {BrandComponent}
        </div>
      );
    }

    // E — Brand hidden (only title)
    return (
      <div className={`${wrapperClassName}`}>
        {TitleComponent}
      </div>
    );
  };

  return <>{renderBrandTitleContent()}</>;
}
