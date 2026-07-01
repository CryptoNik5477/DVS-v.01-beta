/**
 * Supported display currencies. Prices are stored in EUR minor units (cents)
 * and converted at display time using these (editable) rates.
 *
 * ⚠️ Rates are static placeholders. For production, refresh them from a feed
 * (e.g. ECB, openexchangerates) via a cron job and cache the result.
 */
export const currencies = {
  EUR: { code: "EUR", symbol: "€", label: "Euro", rate: 1, locale: "fr-FR" },
  USD: { code: "USD", symbol: "$", label: "US Dollar", rate: 1.09, locale: "en-US" },
  GBP: { code: "GBP", symbol: "£", label: "British Pound", rate: 0.86, locale: "en-GB" },
  THB: { code: "THB", symbol: "฿", label: "Thai Baht", rate: 39.7, locale: "th-TH" },
  AUD: { code: "AUD", symbol: "A$", label: "Australian Dollar", rate: 1.65, locale: "en-AU" },
  CAD: { code: "CAD", symbol: "C$", label: "Canadian Dollar", rate: 1.48, locale: "en-CA" },
} as const;

export type CurrencyCode = keyof typeof currencies;
export const currencyCodes = Object.keys(currencies) as CurrencyCode[];
export const defaultCurrency: CurrencyCode = "EUR";

/**
 * Format a price given in base (EUR) minor units into the chosen currency.
 */
export function formatPrice(baseCents: number, code: CurrencyCode = defaultCurrency): string {
  const { rate, locale, code: cur } = currencies[code];
  const amount = (baseCents / 100) * rate;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
    maximumFractionDigits: cur === "THB" ? 0 : 2,
  }).format(amount);
}
