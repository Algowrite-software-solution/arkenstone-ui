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