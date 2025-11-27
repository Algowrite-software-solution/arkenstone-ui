import symbolMap from "./currency-symbols.json";


/**
 * Resolves a currency code to the symbol from a given currency code.
 * @param code The code string to resolve the currency code from.
 * @returns The resolved currency code.
 */
export default function resolveCurrencySymbol(code?: string): string {
  if (!code) return "USD";
  // already an ISO code (USD, EUR, etc.)
  if (/^[A-Z]{3}$/.test(code)) return code;
  // direct lookup by symbol/text in JSON map
  if (symbolMap && (symbolMap as Record<string, string>)[code]) return (symbolMap as Record<string, string>)[code];
  // try normalize (e.g. "usd", "US$", etc.)
  const cleaned = String(code).replace(/[^A-Za-z]/g, "").toUpperCase();
  if (/^[A-Z]{3}$/.test(cleaned)) return cleaned;
  return "USD";
}