import React from "react";
import { SortBar, SortBarProps } from "./sort-bar";
import { ViewModeSwitcher, ViewMode, ViewModeSwitcherProps } from "./view-mode";

export interface ListingControlProps {

  sortProps?: SortBarProps;
  viewModeProps?: ViewModeSwitcherProps;

  sortComponent?: React.ReactNode;
  viewModeComponent?: React.ReactNode;

  extra?: React.ReactNode[];

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
