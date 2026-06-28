export const locales = ["en", "fr", "th", "es", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  th: "ไทย",
  es: "Español",
  de: "Deutsch",
};

export const LOCALE_COOKIE = "jfa_locale";
