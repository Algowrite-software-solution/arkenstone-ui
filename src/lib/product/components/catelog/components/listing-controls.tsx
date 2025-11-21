import React from "react";
import { SortBar, SortBarProps } from "./sort-bar";
import { ViewModeSwitcher, ViewMode, ViewModeSwitcherProps } from "./view-mode";

interface ListingControlProps {
  /** Sorting */
  sortProps?: SortBarProps;

  /** View mode */
  viewModeProps?: ViewModeSwitcherProps;

  /**
   * Replace the SortBar component completely.
   * Example: <ListingControl sortComponent={<MyCustomSort />} />
   */
  sortComponent?: React.ReactNode;

  /**
   * Replace the ViewModeSwitcher completely.
   */
  viewModeComponent?: React.ReactNode;

  /**
   * Add extra custom components (buttons, filters, actions, etc.)
   * Example: extra={[<Button ... />, <TagSelector ... />]}
   */
  extra?: React.ReactNode[];

  /**
   * Layout direction
   */
  direction?: "row" | "column";
}

export function ListingControl({
  sortProps,
  viewModeProps,
  sortComponent,
  viewModeComponent,
  extra = [],
  direction = "row",
}: ListingControlProps) {
  return (
    <div
      className={`
        flex gap-3 w-full 
        ${direction === "row" ? "flex-row items-center" : "flex-col"}
      `}
    >
      {/* Sort Bar (replaceable) */}
      {sortComponent ? (
        sortComponent
      ) : sortProps ? (
        <SortBar {...sortProps} />
      ) : null}

      {/* View Mode Switcher (replaceable) */}
      {viewModeComponent ? (
        viewModeComponent
      ) : viewModeProps ? (
        <ViewModeSwitcher {...viewModeProps} />
      ) : null}

      {/* Extra user-defined components */}
      {extra.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
}
