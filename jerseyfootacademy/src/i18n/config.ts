export const locales = ["fr", "en", "it", "de", "es", "nl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  it: "Italiano",
  de: "Deutsch",
  es: "Español",
  nl: "Nederlands",
};

export const LOCALE_COOKIE = "jfa_locale";
