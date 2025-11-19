import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

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
}

export interface FilterItemProps {
  id: string;
  title: string;
  options: FilterOption[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  type?:
    | "checkbox"
    | "radio"
    | "chip"
    | "toggle"
    | "switch"
    | "color"
    | "image"
    | "rating"
    | "tag"
    | "icon"
    | "range";
}

export interface FiltersProps {
  filters: FilterItemProps[];

  // layout
  direction?: "vertical" | "horizontal";

  // state handling
  value?: Record<string, string | string[] | boolean | number>;
  onChange?: (values: Record<string, string | string[] | boolean | number>) => void;

  // UI overrides
  className?: string;
}

// Main Filters Component
export default function Filters({
  filters,
  direction = "vertical",
  value,
  onChange,
  className = "",
}: FiltersProps) {
  const [internal, setInternal] = useState<Record<string, any>>({});

  const state = value ?? internal;

  function update(id: string, newValue: any) {
    const updated = { ...state, [id]: newValue };
    value ? onChange?.(updated) : setInternal(updated);
  }

  return (
    <div
      className={`flex ${
        direction === "vertical" ? "flex-col gap-4" : "flex-row gap-6"
      } ${className} border p-2 rounded-sm `}
    >
      {filters.map((filter) => (
        <FilterItem key={filter.id} {...filter} state={state} update={update} />
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
}: FilterItemProps & {
  state: Record<string, any>;
  update: (id: string, value: any) => void;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  // set sensible defaults depending on type
  let defaultSelected: any;
  if (type === "checkbox" || type === "tag") defaultSelected = [];
  else if (type === "toggle" || type === "switch") defaultSelected = false;
  else if (type === "range") defaultSelected = (options && options.length > 0 && typeof options[0].min === "number") ? options[0].min : 0;
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

  return (
    <div className="p-3">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => collapsible && setCollapsed(!collapsed)}
      >
        <span className="font-semibold">{title}</span>
        {collapsible && <span>{collapsed ? <ChevronUp /> : <ChevronDown />}</span>}
      </div>

      {!collapsed && (
        <div className="mt-2 flex flex-wrap gap-2">
          {options.map((opt) => (
            <FilterOptionItem
              key={String(opt.value)}
              type={type}
              option={opt}
              selected={selected}
              onCheckboxToggle={toggleCheckbox}
              onRadioSelect={selectRadio}
            />
          ))}
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
}: {
  type:
    | "checkbox"
    | "radio"
    | "chip"
    | "toggle"
    | "switch"
    | "color"
    | "image"
    | "rating"
    | "tag"
    | "icon"
    | "range";
  option: FilterOption;
  selected: any;
  onCheckboxToggle: (v: any) => void;
  onRadioSelect: (v: any) => void;
}) {
  // CHECKBOX
  if (type === "checkbox")
    return (
      <label className="flex items-center gap-2">
        <input
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
      <label className="flex items-center gap-2">
        <input
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
        className={`px-3 py-1 rounded-full border ${
          selected === option.value ? "bg-black text-white" : "bg-white text-black"
        }`}
        onClick={() => onRadioSelect(option.value)}
      >
        {option.label}
      </button>
    );

  // TOGGLE / SWITCH
  if (type === "toggle" || type === "switch")
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <div
          className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
            selected ? "bg-black" : "bg-gray-300"
          }`}
          onClick={() => onRadioSelect(!selected)}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
              selected ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
        {option.label}
      </label>
    );

  // COLOR SWATCH
  if (type === "color")
    return (
      <div
        onClick={() => onRadioSelect(option.value)}
        className={`w-6 h-6 rounded-full border cursor-pointer ${
          selected === option.value ? "ring-2 ring-black" : ""
        }`}
        style={{ backgroundColor: option.color ?? String(option.value) }}
      />
    );

  // IMAGE SELECTOR
  if (type === "image")
    return (
      <div
        className={`w-12 h-12 rounded-lg border overflow-hidden cursor-pointer ${
          selected === option.value ? "ring-2 ring-black" : ""
        }`}
        onClick={() => onRadioSelect(option.value)}
      >
        {option.image ? (
          <img src={option.image} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            No Image
          </div>
        )}
      </div>
    );

  // RATING
  if (type === "rating")
    return (
      <button
        onClick={() => onRadioSelect(option.value)}
        className={`text-xl ${
          selected === option.value ? "text-yellow-500" : "text-gray-400"
        }`}
      >
        {"★".repeat(Number(option.rating ?? option.value))}
      </button>
    );

  // TAGS
  if (type === "tag")
    return (
      <button
        className={`px-2 py-1 rounded-md text-xs border ${
          Array.isArray(selected) && selected.includes(option.value)
            ? "bg-black text-white"
            : "bg-white text-black"
        }`}
        onClick={() => onCheckboxToggle(String(option.value))}
      >
        {option.label}
      </button>
    );

  // ICON
  if (type === "icon")
    return (
      <button
        className={`p-2 rounded-md border ${
          selected === option.value ? "bg-black text-white" : "bg-white text-black"
        }`}
        onClick={() => onRadioSelect(option.value)}
      >
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
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onRadioSelect(Number(e.target.value))}
        />
        <span className="text-sm w-12 text-right">{value}</span>
      </div>
    );
  }

  // DEFAULT
  return <span>{option.label}</span>;
}


