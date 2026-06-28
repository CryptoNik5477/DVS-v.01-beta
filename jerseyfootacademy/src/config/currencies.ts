/**
 * Supported display currencies. Prices are stored in USD minor units (cents)
 * and converted at display time using these (editable) rates.
 *
 * ⚠️ Rates are static placeholders. For production, refresh them from a feed
 * (e.g. ECB, openexchangerates) via a cron job and cache the result.
 */
export const currencies = {
  USD: { code: "USD", symbol: "$", label: "US Dollar", rate: 1, locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", label: "Euro", rate: 0.92, locale: "de-DE" },
  THB: { code: "THB", symbol: "฿", label: "Thai Baht", rate: 36.5, locale: "th-TH" },
  GBP: { code: "GBP", symbol: "£", label: "British Pound", rate: 0.79, locale: "en-GB" },
  AUD: { code: "AUD", symbol: "A$", label: "Australian Dollar", rate: 1.52, locale: "en-AU" },
  CAD: { code: "CAD", symbol: "C$", label: "Canadian Dollar", rate: 1.36, locale: "en-CA" },
} as const;

export type CurrencyCode = keyof typeof currencies;
export const currencyCodes = Object.keys(currencies) as CurrencyCode[];
export const defaultCurrency: CurrencyCode = "USD";

/**
 * Format a price given in USD cents into the chosen display currency.
 */
export function formatPrice(usdCents: number, code: CurrencyCode = defaultCurrency): string {
  const { rate, locale, code: cur } = currencies[code];
  const amount = (usdCents / 100) * rate;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
    maximumFractionDigits: cur === "THB" ? 0 : 2,
  }).format(amount);
}
