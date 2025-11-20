import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import CategoryFilter from "./category-filter";

export type ClassNamesMap = Partial<
  Record<"wrapper" | "item" | "title" | "collapseIcon" | "options" | "option" | "input" | "checkbox" | "radio" | "chip" | "toggle" | "color" | "image" | "rating" | "tag" | "icon" | "range" | "tree" | "treeNode" | "treeToggle" | "treeLabel" | "treeChildren" | "button",
    string
  >
>;

export interface FilterOption {
  label: string;
  value: string | number | boolean;
  color?: string;
  image?: string;
  icon?: React.ReactNode;
  rating?: number;

  // range specific
  min?: number;
  max?: number;
  step?: number;

  // tree / nested
  children?: FilterOption[];

  // per-option class override
  className?: string;
}

export interface FilterItemProps {
  id: string;
  title: string;
  options: FilterOption[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsibleIconUp?: React.ReactNode;
  collapsibleIconDown?: React.ReactNode;

  // allow any string so users can plug custom types
  type?: string;

  // optional per-item class names
  classNames?: ClassNamesMap;

  // optional custom renderer/component per filter item
  component?: React.ComponentType<{
    filter: FilterItemProps;
    state: Record<string, any>;
    update: (id: string, value: any) => void;
    classNames?: ClassNamesMap;
  }>;
  render?: (props: {
    filter: FilterItemProps;
    state: Record<string, any>;
    update: (id: string, value: any) => void;
    classNames?: ClassNamesMap;
  }) => React.ReactNode;

  // passthrough custom props (optional)
  customProps?: Record<string, any>;

  // per-item simple wrapper class
  filterItemsClassName?: string;
}

export interface FiltersProps {
  // allow arrays (and arrays-of-arrays) so stories / callers can pass grouped filters
  filters: (FilterItemProps | FilterItemProps[])[];

  // layout
  direction?: "vertical" | "horizontal";

  // state handling
  value?: Record<string, string | string[] | boolean | number>;
  onChange?: (values: Record<string, string | string[] | boolean | number>) => void;

  // UI overrides
  verticalFilterClassName?: string;
  horizontalFilterClassName?: string;

  // registry of custom renderers keyed by type or id
  customRenderers?: Record<
    string,
    React.ComponentType<{
      filter: FilterItemProps;
      state: Record<string, any>;
      update: (id: string, value: any) => void;
      classNames?: ClassNamesMap;
    }>
  >;

  // global classnames applied to every item (can be overridden by item.classNames)
  globalClassNames?: ClassNamesMap;
}

// Main Filters Component
export default function Filters({
  filters,
  direction = "vertical",
  value,
  onChange,
  verticalFilterClassName = "gap-4 border p-2 rounded-sm ",
  horizontalFilterClassName = "gap-6 border p-2 rounded-sm ",
  customRenderers,
  globalClassNames,
}: FiltersProps) {
  const [internal, setInternal] = useState<Record<string, any>>({});

  const state = value ?? internal;

  function update(id: string, newValue: any) {
    const updated = { ...state, [id]: newValue };
    value ? onChange?.(updated) : setInternal(updated);
  }

  // flatten passed filters so callers can pass arrays or grouped filter arrays
  const flatFilters = filters.flatMap((f) => (Array.isArray(f) ? f : [f]));

  return (
    <div
      className={`flex ${
        direction === "vertical" ? `flex-col ${verticalFilterClassName}` : `flex-row ${horizontalFilterClassName}`
      }`}
    >
      {flatFilters.map((filter) => (
        <FilterItem
          key={filter.id}
          {...filter}
          state={state}
          update={update}
          customRenderers={customRenderers}
          globalClassNames={globalClassNames}
        />
      ))}
    </div>
  );
}

// Single Filter Item Component
function FilterItem({
  id,
  title,
  options,
  collapsible = true,
  defaultCollapsed = false,
  type = "checkbox",
  state,
  update,
  component,
  render,
  customProps,
  customRenderers,
  collapsibleIconUp = <ChevronUp />,
  collapsibleIconDown = <ChevronDown />,
  filterItemsClassName = "p-3",
  classNames,
  globalClassNames,
}: FilterItemProps & {
  state: Record<string, any>;
  update: (id: string, value: any) => void;
  customRenderers?: FiltersProps["customRenderers"];
  globalClassNames?: ClassNamesMap;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  // merge class maps: global <- item
  const mergedClassNames: ClassNamesMap = {
    ...(globalClassNames || {}),
    ...(classNames || {}),
  };

  // set sensible defaults depending on type
  let defaultSelected: any;
  if (type === "checkbox" || type === "tag" || type === "tree") defaultSelected = [];
  else if (type === "toggle" || type === "switch") defaultSelected = false;
  else if (type === "range")
    defaultSelected =
      options && options.length > 0 && typeof options[0].min === "number" ? options[0].min : 0;
  else defaultSelected = "";

  const selected = state[id] ?? defaultSelected;

  function toggleCheckbox(value: string) {
    const arr = new Set(Array.isArray(selected) ? selected : []);
    arr.has(value) ? arr.delete(value) : arr.add(value);
    update(id, Array.from(arr));
  }

  function selectRadio(value: any) {
    update(id, value);
  }

  // determine if there's a custom renderer for this item
  const Registered = component ?? (customRenderers && (customRenderers[id] || customRenderers[type]));

  return (
    <div className={filterItemsClassName}>
      <div
        className={`${mergedClassNames.wrapper ?? "flex justify-between items-center cursor-pointer"}`}
        onClick={() => collapsible && setCollapsed(!collapsed)}
      >
        <span className={mergedClassNames.title ?? "font-semibold"}>{title}</span>
        {collapsible && <span className={mergedClassNames.collapseIcon ?? ""}>{collapsed ? collapsibleIconUp : collapsibleIconDown}</span>}
      </div>

      {!collapsed && (
        <div className={mergedClassNames.options ?? "mt-2"}>
          {/* if caller passed a render function for this filter item, use it */}
          {render ? (
            // pass mergedClassNames as `classNames` key (render expects classNames)
            render({
              filter: { id, title, options, collapsible, defaultCollapsed, type, customProps, classNames },
              state,
              update,
              classNames: mergedClassNames,
            })
          ) : Registered ? (
            // render registered/custom component
            <Registered filter={{ id, title, options, collapsible, defaultCollapsed, type, customProps, classNames }} state={state} update={update} classNames={mergedClassNames} />
          ) : // built-in tree handling
          type === "tree" ? (
            <CategoryFilter
              options={options}
              selected={selected}
              onToggle={(vals: (string | number | boolean)[]) => update(id, vals)}
              classNames={mergedClassNames}
            />
          ) : (
            <div className={mergedClassNames.options ?? "flex flex-wrap gap-2"}>
              {options.map((opt) => (
                <FilterOptionItem
                  key={String(opt.value)}
                  type={type}
                  option={opt}
                  selected={selected}
                  onCheckboxToggle={toggleCheckbox}
                  onRadioSelect={selectRadio}
                  classNames={mergedClassNames}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Single Filter Option Component 
function FilterOptionItem({
  type,
  option,
  selected,
  onCheckboxToggle,
  onRadioSelect,
  classNames,
}: {
  type: "checkbox" | "radio" | "chip" | "toggle" | "switch" | "color" | "image" | "rating" | "tag" | "icon" | "range" | string;
  option: FilterOption;
  selected: any;
  onCheckboxToggle: (v: any) => void;
  onRadioSelect: (v: any) => void;
  classNames?: ClassNamesMap;
}) {
  const optClass = option.className ?? classNames?.option ?? "";
  const inputClass = classNames?.input ?? "";
  const checkboxClass = classNames?.checkbox ?? "";
  const radioClass = classNames?.radio ?? "";

  // CHECKBOX
  if (type === "checkbox")
    return (
      <label className={`flex items-center gap-2 ${optClass}`}>
        <input
          className={checkboxClass}
          type="checkbox"
          checked={Array.isArray(selected) ? selected.includes(option.value) : false}
          onChange={() => onCheckboxToggle(String(option.value))}
        />
        {option.label}
      </label>
    );

  // RADIO
  if (type === "radio")
    return (
      <label className={`flex items-center gap-2 ${optClass}`}>
        <input
          className={radioClass}
          type="radio"
          checked={selected === option.value}
          onChange={() => onRadioSelect(option.value)}
        />
        {option.label}
      </label>
    );

  // CHIP
  if (type === "chip")
    return (
      <button
        className={`${optClass} px-3 py-1 rounded-full border ${selected === option.value ? "bg-black text-white" : "bg-white text-black"}`}
        onClick={() => onRadioSelect(option.value)}
      >
        {option.label}
      </button>
    );

  // TOGGLE / SWITCH
  if (type === "toggle" || type === "switch")
    return (
      <label className={`flex items-center gap-2 cursor-pointer ${optClass}`}>
        <div
          className={`${classNames?.toggle ?? "w-10 h-5 flex items-center rounded-full p-1 transition"} ${selected ? "bg-black" : "bg-gray-300"}`}
          onClick={() => onRadioSelect(!selected)}
        >
          <div className={`bg-white w-4 h-4 rounded-full shadow transform transition ${selected ? "translate-x-5" : "translate-x-0"}`} />
        </div>
        {option.label}
      </label>
    );

  // COLOR SWATCH
  if (type === "color")
    return (
      <div
        onClick={() => onRadioSelect(option.value)}
        className={`${classNames?.color ?? "w-6 h-6 rounded-full border cursor-pointer"} ${selected === option.value ? "ring-2 ring-black" : ""} ${optClass}`}
        style={{ backgroundColor: option.color ?? String(option.value) }}
      />
    );

  // IMAGE SELECTOR
  if (type === "image")
    return (
      <div
        className={`${classNames?.image ?? "w-12 h-12 rounded-lg border overflow-hidden cursor-pointer"} ${selected === option.value ? "ring-2 ring-black" : ""} ${optClass}`}
        onClick={() => onRadioSelect(option.value)}
      >
        {option.image ? <img src={option.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-200">No Image</div>}
      </div>
    );

  // RATING
  if (type === "rating")
    return (
      <button onClick={() => onRadioSelect(option.value)} className={`${classNames?.rating ?? "text-xl"} ${selected === option.value ? "text-yellow-500" : "text-gray-400"} ${optClass}`}>
        {"★".repeat(Number(option.rating ?? option.value))}
      </button>
    );

  // TAGS
  if (type === "tag")
    return (
      <button
        className={`${classNames?.tag ?? "px-2 py-1 rounded-md text-xs border"} ${Array.isArray(selected) && selected.includes(option.value) ? "bg-black text-white" : "bg-white text-black"} ${optClass}`}
        onClick={() => onCheckboxToggle(String(option.value))}
      >
        {option.label}
      </button>
    );

  // ICON
  if (type === "icon")
    return (
      <button className={`${classNames?.icon ?? "p-2 rounded-md border"} ${selected === option.value ? "bg-black text-white" : "bg-white text-black"} ${optClass}`} onClick={() => onRadioSelect(option.value)}>
        {option.icon}
      </button>
    );

  // RANGE
  if (type === "range") {
    // use numeric value for range
    const min = typeof option.min === "number" ? option.min : 0;
    const max = typeof option.max === "number" ? option.max : 100;
    const step = typeof option.step === "number" ? option.step : 1;
    const value = typeof selected === "number" ? selected : Number(selected || min);

    return (
      <div className={`flex items-center gap-2 ${classNames?.range ?? ""} ${optClass}`}>
        <input className={classNames?.input ?? ""} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onRadioSelect(Number(e.target.value))} />
        <span className="text-sm w-12 text-right">{value}</span>
      </div>
    );
  }

  // DEFAULT
  return <span className={classNames?.option ?? ""}>{option.label}</span>;
}


