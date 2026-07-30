import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getValue(obj: any, path: string) {
   if (!path) return obj;

  const keys = path
    .replace(/\[(\w+)\]/g, '.$1') // supports a[0].b
    .replace(/^\./, '')
    .split('.');

  let result = obj;

  for (const key of keys) {
    if (result == null) return undefined;
    result = result[key];
  }

  return result;
}

export function toTitleCase(str: string): string {
  if (!str) return "";

  // Replace underscores and hyphens with spaces
  let result = str.replace(/[_-]+/g, " ");

  // Insert a space before uppercase letters (for camelCase)
  result = result.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Capitalize the first letter of each word and convert the rest to lowercase
  return result
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (word.toLowerCase() === "id") return "ID";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}