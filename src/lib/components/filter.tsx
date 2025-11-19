import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterItemProps {
  id: string;
  title: string;
  options: FilterOption[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  type?: "checkbox" | "radio" | "chip";
}

export interface FiltersProps {
  filters: FilterItemProps[];

  // layout
  direction?: "vertical" | "horizontal";

  // state handling
  value?: Record<string, string | string[]>;
  onChange?: (values: Record<string, string | string[]>) => void;

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

  const selected = state[id] ?? (type === "checkbox" ? [] : "");

  function toggleCheckbox(value: string) {
    const arr = new Set(selected);
    arr.has(value) ? arr.delete(value) : arr.add(value);
    update(id, Array.from(arr));
  }

  function selectRadio(value: string) {
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
              key={opt.value}
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
  type: "checkbox" | "radio" | "chip";
  option: FilterOption;
  selected: any;
  onCheckboxToggle: (v: string) => void;
  onRadioSelect: (v: string) => void;
}) {
  if (type === "checkbox")
    return (
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selected.includes(option.value)}
          onChange={() => onCheckboxToggle(option.value.toString())}
        />
        {option.label}
      </label>
    );

  if (type === "radio")
    return (
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={selected === option.value}
          onChange={() => onRadioSelect(option.value.toString())}
        />
        {option.label}
      </label>
    );

  return (
    <button
      className={`px-3 py-1 rounded-full border ${
        selected === option.value
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
      onClick={() => onRadioSelect(option.value.toString())}
    >
      {option.label}
    </button>
  );
}
