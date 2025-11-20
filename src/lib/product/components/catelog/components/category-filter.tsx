import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ClassNamesMap } from "./filter";

type CategoryNode = {
  label: string;
  value: string | number | boolean;
  children?: CategoryNode[];
};

export default function CategoryFilter({
  options,
  selected,
  onToggle,
  level = 0,
  classNames,
}: {
  options: CategoryNode[];
  selected: any[];
  onToggle: (values: (string | number | boolean)[]) => void;
  level?: number;
  classNames?: ClassNamesMap;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const isSelectedArray = Array.isArray(selected);

  function getAllValues(node: CategoryNode): (string | number | boolean)[] {
    const vals: (string | number | boolean)[] = [node.value];
    if (node.children) {
      for (const c of node.children) vals.push(...getAllValues(c));
    }
    return vals;
  }

  function toggleNode(node: CategoryNode) {
    if (!isSelectedArray) return;
    const all = getAllValues(node).map(String);
    const selectedSet = new Set((selected || []).map(String));

    const hasAll = all.every((v) => selectedSet.has(v));
    if (hasAll) {
      for (const v of all) selectedSet.delete(v);
    } else {
      for (const v of all) selectedSet.add(v);
    }
    onToggle(Array.from(selectedSet).map((v) => (isNaN(Number(v)) ? v : (Number(v) as any))));
  }

  function toggleLeaf(value: string | number | boolean) {
    if (!isSelectedArray) return;
    const selectedSet = new Set((selected || []).map(String));
    const key = String(value);
    selectedSet.has(key) ? selectedSet.delete(key) : selectedSet.add(key);
    onToggle(Array.from(selectedSet).map((v) => (isNaN(Number(v)) ? v : (Number(v) as any))));
  }

  const indentStyle = (lvl: number) => ({ paddingLeft: `${lvl}rem` });

  return (
    <div className={classNames?.tree ?? "flex flex-col gap-1"}>
      {options.map((opt) => {
        const key = String(opt.value);
        const allValues = getAllValues(opt).map(String);
        const selectedSet = new Set((selected || []).map(String));
        const hasAllChildren = allValues.every((v) => selectedSet.has(v));
        const isPartial = allValues.some((v) => selectedSet.has(v)) && !hasAllChildren;

        return (
          <div key={key} style={indentStyle(level)} className={classNames?.treeNode ?? undefined}>
            <div className={`flex items-center gap-2 ${classNames?.treeLabel ?? ""}`}>
              {opt.children && opt.children.length > 0 && (
                <button
                  className={classNames?.treeToggle ?? "p-1"}
                  onClick={() => setExpanded((s) => ({ ...s, [key]: !s[key] }))}
                  aria-label="Toggle"
                >
                  {expanded[key] ? <ChevronUp /> : <ChevronDown />}
                </button>
              )}

              <label className={`flex items-center gap-2 ${classNames?.option ?? ""}`}>
                <input
                  type="checkbox"
                  checked={hasAllChildren}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartial;
                  }}
                  onChange={() => toggleNode(opt)}
                  className={classNames?.checkbox ?? ""}
                />
                <span
                  className={`cursor-pointer ${hasAllChildren ? "font-semibold" : ""}`}
                  onClick={() => (opt.children && opt.children.length > 0 ? toggleNode(opt) : toggleLeaf(opt.value))}
                >
                  {opt.label}
                </span>
              </label>
            </div>

            {opt.children && opt.children.length > 0 && expanded[key] && (
              <div className={classNames?.treeChildren ?? "ml-6 mt-1"}>
                <CategoryFilter
                  options={opt.children}
                  selected={selected}
                  onToggle={onToggle}
                  level={level + 1}
                  classNames={classNames}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}