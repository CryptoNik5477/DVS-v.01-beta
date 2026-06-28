"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, localeNames, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [pending, startTransition] = useTransition();

  function onChange(next: Locale) {
    // Persist locale in a cookie read by src/i18n/request.ts, then refresh.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <label className="inline-flex items-center text-xs">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="cursor-pointer rounded-full bg-transparent px-2 py-1 font-semibold outline-none hover:bg-white/10"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="text-navy">
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
