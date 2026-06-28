/**
 * Global site configuration. Single source of truth for branding metadata,
 * navigation and feature flags. Keep this free of secrets.
 */
export const siteConfig = {
  name: "JerseyFootAcademy",
  tagline: "Support Your Team. Wear The Passion.",
  description:
    "Premium authentic & replica football jerseys from the world's greatest clubs and national teams. Official-quality kits, custom flocking, worldwide shipping from Thailand.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jerseyfootacademy.com",
  ogImage: "/og-image.png",
  locale: "en",
  // Store base currency — all stored prices are in minor units of this currency.
  baseCurrency: "USD" as const,
  twitter: "@jerseyfootacad",
  contact: {
    email: "hello@jerseyfootacademy.com",
    phone: "+66 83 919 2903",
    address: "Mukdahan, Thailand",
  },
  shipsFrom: "Thailand",
} as const;

export type SiteConfig = typeof siteConfig;
