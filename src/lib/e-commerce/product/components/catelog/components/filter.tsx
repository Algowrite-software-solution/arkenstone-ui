import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { CategoryFilter } from "./category-filter";
import { cn } from "@/lib/utils";

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

export interface FilterOptionItemProps extends FilterOption {
  type: "checkbox" | "radio" | "chip" | "toggle" | "switch" | "color" | "image" | "rating" | "tag" | "icon" | "range" | string;
  selected: any;

  onCheckboxToggle: (value: string) => void;
  onRadioSelect: (value: any) => void;

  classNames?: ClassNamesMap;
}

export interface FiltersProps {
  filters: (FilterItemProps | FilterItemProps[])[];

  direction?: "vertical" | "horizontal";

  value?: Record<string, string | string[] | boolean | number>;
  onChange?: (values: Record<string, string | string[] | boolean | number>) => void;

  verticalFilterClassName?: string;
  horizontalFilterClassName?: string;

  customRenderers?: Record<string, React.ComponentType<FilterRenderProps>>;

  globalClassNames?: ClassNamesMap;
}

export interface FilterItemProps {
  id: string;
  title: string;
  options: FilterOption[];

  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsibleIconUp?: React.ReactNode;
  collapsibleIconDown?: React.ReactNode;

  // default type: checkbox
  type?: string;

  classNames?: ClassNamesMap;

  // custom renderer component
  component?: React.ComponentType<FilterRenderProps>;

  // render override
  render?: (props: FilterRenderProps) => React.ReactNode;

  // extra
  customProps?: Record<string, any>;

  // wrapper class
  filterItemsClassName?: string;
}

export interface FilterItemInternalProps extends FilterItemProps {
  state: Record<string, any>;
  update: (id: string, value: any) => void;

  customRenderers?: FiltersProps["customRenderers"];
  globalClassNames?: ClassNamesMap;
}

export interface FilterRenderProps {
  filter: FilterItemProps;
  state: Record<string, any>;
  update: (id: string, value: any) => void;
  classNames?: ClassNamesMap;
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
      className={cn("flex", 
        direction === "vertical" ? cn(`flex-col ${verticalFilterClassName}`) : cn(`flex-row ${horizontalFilterClassName}`)
      )}
    >
      {flatFilters.map((filter) => (
        <FilterItem
          key={filter.id}
          options={{...filter, state, update, customRenderers, globalClassNames}}
        />
      ))}
    </div>
  );
}


// Single Filter Item Component
function FilterItem({options}: {options:FilterItemInternalProps}) {
  const [collapsed, setCollapsed] = useState(!!options.defaultCollapsed);

  // merge class maps: global <- item
  const mergedClassNames: ClassNamesMap = {
    ...(options.globalClassNames || {}),
    ...(options.classNames || {}),
  };

  // set sensible defaults depending on type
  let defaultSelected: any;
  if (options.type === "checkbox" || options.type === "tag" || options.type === "tree") defaultSelected = [];
  else if (options.type === "toggle" || options.type === "switch") defaultSelected = false;
  else if (options.type === "range")
    defaultSelected =
      options && options.options.length > 0 && typeof options.options[0].min === "number" ? options.options[0].min : 0;
  else defaultSelected = "";

  const selected = options.state[options.id] ?? defaultSelected;

  function toggleCheckbox(value: string) {
    const arr = new Set(Array.isArray(selected) ? selected : []);
    arr.has(value) ? arr.delete(value) : arr.add(value);
    options.update(options.id, Array.from(arr));
  }

  function selectRadio(value: any) {
    options.update(options.id, value);
  }

  // determine if there's a custom renderer for this item
  const Registered = options.component ?? (options.customRenderers && (options.customRenderers[options.id] || options.customRenderers[options.type || ""]));

  // provide sensible default collapsible icons if caller didn't pass any
  const collapsibleIconUp = options.collapsibleIconUp ?? <ChevronUp />;
  const collapsibleIconDown = options.collapsibleIconDown ?? <ChevronDown />;

  return (
    <div className={options.filterItemsClassName}>
      <div
        className={cn(mergedClassNames.wrapper ?? "flex justify-between items-center cursor-pointer")}
        onClick={() => options.collapsible && setCollapsed(!collapsed)}
      >
        <span className={cn(mergedClassNames.title ?? "font-semibold")}>{options.title}</span>
        {options.collapsible && <span className={cn(mergedClassNames.collapseIcon ?? "")}>{collapsed ? collapsibleIconUp : collapsibleIconDown}</span>}
      </div>

      {!collapsed && (
        <div className={cn(mergedClassNames.options ?? "mt-2")}>
          {/* if caller passed a render function for this filter item, use it */}
          {options.render ? (
            // pass mergedClassNames as `classNames` key (render expects classNames)
            options.render({
              filter: { id: options.id, title: options.title, options: options.options, collapsible: options.collapsible, defaultCollapsed: options.defaultCollapsed, type: options.type, customProps: options.customProps, classNames: mergedClassNames },
              state: options.state,
              update: options.update,
              classNames: mergedClassNames,
            })
          ) : Registered ? (
            // render registered/custom component
            <Registered filter={{ id: options.id, title: options.title, options: options.options, collapsible: options.collapsible, defaultCollapsed: options.defaultCollapsed, type: options.type, customProps: options.customProps, classNames: mergedClassNames }} state={options.state} update={options.update} classNames={mergedClassNames} />
          ) : // built-in tree handling
          options.type === "tree" ? (
            <CategoryFilter
              options={options.options}
              selected={selected}
              onToggle={(vals: (string | number | boolean)[]) => options.update(options.id, vals)}
              classNames={mergedClassNames}
            />
          ) : (
            <div className={cn(mergedClassNames.options ?? "flex flex-wrap gap-2")}>
              {options.options.map((opt) => (
                <FilterOptionItem
                  key={String(opt.value)}
                  {...opt}
                  type={options.type || "checkbox"}
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
  label,
  value,
  color,
  image,
  icon,
  rating,
  min,
  max,
  step,
  className,
  selected,
  onCheckboxToggle,
  onRadioSelect,
  classNames,
}: FilterOptionItemProps) {
  const optClass = className ?? classNames?.option ?? "";
  const inputClass = classNames?.input ?? "";
  const checkboxClass = classNames?.checkbox ?? "";
  const radioClass = classNames?.radio ?? "";

  // CHECKBOX
  if (type === "checkbox")
    return (
      <label className={cn("flex items-center gap-2", optClass)}>
        <input
          className={cn(inputClass, checkboxClass)}
          type="checkbox"
          checked={Array.isArray(selected) ? selected.includes(value) : false}
          onChange={() => onCheckboxToggle(String(value))}
        />
        {label}
      </label>
    );

  // RADIO
  if (type === "radio")
    return (
      <label className={cn("flex items-center gap-2", optClass)}>
        <input
          className={cn(inputClass, radioClass)}
          type="radio"
          checked={selected === value}
          onChange={() => onRadioSelect(value)}
        />
        {label}
      </label>
    );

  // CHIP
  if (type === "chip")
    return (
      <button
        className={cn("px-3 py-1 rounded-full border",optClass, selected === value ? "bg-black text-white" : "bg-white text-black")}
        onClick={() => onRadioSelect(value)}
      >
        {label}
      </button>
    );

  // TOGGLE / SWITCH
  if (type === "toggle" || type === "switch")
    return (
      <label className={cn("flex items-center gap-2 cursor-pointer", optClass)}>
        <div
          className={cn("w-10 h-5 flex items-center rounded-full p-1 transition",classNames?.toggle , selected ? "bg-black" : "bg-gray-300")}
          onClick={() => onRadioSelect(!selected)}
        >
          <div className={cn("bg-white w-4 h-4 rounded-full shadow transform transition", selected ? "translate-x-5" : "translate-x-0")} />
        </div>
        {label}
      </label>
    );

  // COLOR SWATCH
  if (type === "color")
    return (
      <div
        onClick={() => onRadioSelect(value)}
        className={cn("w-6 h-6 rounded-full border cursor-pointer", classNames?.color, selected === value ? "ring-2 ring-black" : "", optClass)}
        style={{ backgroundColor: color ?? String(value) }}
      />
    );

  // IMAGE SELECTOR
  if (type === "image")
    return (
      <div
        className={cn("w-12 h-12 rounded-lg border overflow-hidden cursor-pointer",classNames?.image , selected === value ? "ring-2 ring-black" : "", optClass)}
        onClick={() => onRadioSelect(value)}
      >
        {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-200">No Image</div>}
      </div>
    );

  // RATING
  if (type === "rating")
    return (
      <button onClick={() => onRadioSelect(value)} className={cn(classNames?.rating ?? "text-xl", selected === value ? "text-yellow-500" : "text-gray-400", optClass)}>
        {"★".repeat(Number(rating ?? value))}
      </button>
    );

  // TAGS
  if (type === "tag")
    return (
      <button
        className={cn("px-2 py-1 rounded-md text-xs border",classNames?.tag , Array.isArray(selected) && selected.includes(value) ? "bg-black text-white" : "bg-white text-black", optClass)}
        onClick={() => onCheckboxToggle(String(value))}
      >
        {label}
      </button>
    );

  // ICON
  if (type === "icon")
    return (
      <button className={cn( "p-2 rounded-md border", classNames?.icon, selected === value ? "bg-black text-white" : "bg-white text-black", optClass)} onClick={() => onRadioSelect(value)}>
        {icon}
      </button>
    );

  // RANGE
  if (type === "range") {
    // use numeric value for range
    const minVal = typeof min === "number" ? min : 0;
    const maxVal = typeof max === "number" ? max : 100;
    const stepVal = typeof step === "number" ? step : 1;
    const curr = typeof selected === "number" ? selected : Number(selected || minVal);

    return (
      <div className={cn("flex items-center gap-2", classNames?.range ?? "", optClass)}>
        <input className={classNames?.input ?? ""} type="range" min={minVal} max={maxVal} step={stepVal} value={curr} onChange={(e) => onRadioSelect(Number(e.target.value))} />
        <span className="text-sm w-12 text-right">{curr}</span>
      </div>
    );
  }

  // DEFAULT
  return <span className={classNames?.option ?? ""}>{label}</span>;
}


