import React from "react";

interface ListingProps<T> {
  /** Component or element for the controls (search, filters, etc.) */
  controls?: React.ReactNode;

  /** Component or element for rendering the list of items */
  list: React.ReactNode;

  /** Component or element for pagination controls */
  pagination?: React.ReactNode;

  /** Optional className for styling */
  className?: string;
}

export function Listing<T>({ controls, list, pagination, className }: ListingProps<T>) {
  return (
    <div className={`listing-container flex flex-col gap-4 ${className || ""}`}>
      {controls && <div className="listing-controls">{controls}</div>}
      <div className="listing-items">{list}</div>
      {pagination && <div className="listing-pagination">{pagination}</div>}
    </div>
  );
}
