import symbolMap from "../data/currency-symbols.json";

export function resolveCurrencyCode(input?: string): string {
  if (!input) return "USD";
  // already an ISO code (USD, EUR, etc.)
  if (/^[A-Z]{3}$/.test(input)) return input;
  // direct lookup by symbol/text in JSON map
  if (symbolMap && (symbolMap as Record<string, string>)[input]) return (symbolMap as Record<string, string>)[input];
  // try normalize (e.g. "usd", "US$", etc.)
  const cleaned = String(input).replace(/[^A-Za-z]/g, "").toUpperCase();
  if (/^[A-Z]{3}$/.test(cleaned)) return cleaned;
  return "USD";
}