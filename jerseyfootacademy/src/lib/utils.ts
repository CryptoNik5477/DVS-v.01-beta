import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a short, human-friendly order number, e.g. JFA-7K3QX9. */
export function generateOrderNumber(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `JFA-${s}`;
}

export function formatDate(date: Date | string, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(date));
}

/** Basic input sanitiser for free-text fields (defense-in-depth vs. XSS). */
export function sanitizeText(input: string, maxLen = 500): string {
  return input
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}
