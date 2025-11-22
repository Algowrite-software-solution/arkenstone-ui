export interface CategoryItem {
  id: string | number;
  name: string;
}

export interface CategoriesBadgeListProps {
  categories: CategoryItem[];

  /** Max categories to display before "+X" appears */
  maxCategories?: number;

  /** Show +X badge */
  showRemainingCount?: boolean;

  positionClassName?: string;
  categoryClassName?: string;
  remainingClassName?: string;

  onCategoryClick?: (category: CategoryItem) => void;

  wrapperClassName?: string;
}

export function CategoriesBadgeList({
  categories = [{ id: 1, name: "test1" }, { id: 2, name: "test2" }, { id: 3, name: "test3" }],
  maxCategories = 1,
  showRemainingCount = true,
  positionClassName = "",
  categoryClassName = "bg-black text-white px-2 py-1 text-xs font-semibold rounded-full shadow",
  remainingClassName = "bg-black text-white px-2 py-1 text-xs font-semibold rounded-full",
  onCategoryClick = () => console.log('clicked'),
  wrapperClassName = "flex flex-wrap gap-2",
}: CategoriesBadgeListProps) {
  
  if (!categories || categories.length === 0) return null;

  const categoriesToShow = categories.slice(0, maxCategories);
  const remainingCount = categories.length - maxCategories;

  return (
    <div className={`absolute z-10 ${positionClassName}`}>
      <div className={wrapperClassName}>
        {categoriesToShow.map((category) => {
          const isClickable = Boolean(onCategoryClick);

          return (
            <span
              key={category.id}
              className={`inline-block cursor-${isClickable ? "pointer" : "default"} ${categoryClassName}`}
              onClick={() => isClickable && onCategoryClick?.(category)}
            >
              {category.name}
            </span>
          );
        })}

        {showRemainingCount && remainingCount > 0 && (
          <span className={`inline-block ${remainingClassName}`}>
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  );
}
