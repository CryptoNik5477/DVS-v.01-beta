/**
 * International shipping configuration.
 *
 * Items ship from THAILAND. Rates below are modelled on Thailand Post
 * international parcel pricing tiers but are PLACEHOLDERS — replace `baseCost`
 * and `perItem` with the official Thailand Post tariff before launch.
 * https://www.thailandpost.co.th/
 *
 * Costs are in USD minor units (cents). `etaDays` is [min, max] business days.
 */

export type ShippingZoneId =
  | "ASIA"
  | "EUROPE"
  | "NORTH_AMERICA"
  | "SOUTH_AMERICA"
  | "AFRICA"
  | "OCEANIA";

export type ShippingMethodId = "STANDARD" | "EXPRESS";

interface ZoneRate {
  baseCost: number; // first item
  perItem: number; // each additional item
  etaDays: [number, number];
}

export interface ShippingZone {
  id: ShippingZoneId;
  label: string;
  // ISO 3166-1 alpha-2 country codes belonging to this zone.
  countries: string[];
  methods: Record<ShippingMethodId, ZoneRate>;
}

export const FREE_SHIPPING_THRESHOLD = 15000; // $150.00 — free STANDARD shipping above this subtotal

export const shippingZones: Record<ShippingZoneId, ShippingZone> = {
  ASIA: {
    id: "ASIA",
    label: "Asia",
    countries: ["TH", "SG", "MY", "VN", "ID", "PH", "JP", "KR", "CN", "HK", "TW", "IN", "AE", "SA"],
    methods: {
      STANDARD: { baseCost: 599, perItem: 250, etaDays: [5, 10] },
      EXPRESS: { baseCost: 1599, perItem: 400, etaDays: [2, 4] },
    },
  },
  EUROPE: {
    id: "EUROPE",
    label: "Europe",
    countries: ["FR", "DE", "ES", "IT", "GB", "PT", "NL", "BE", "CH", "SE", "NO", "PL", "AT", "IE"],
    methods: {
      STANDARD: { baseCost: 1290, perItem: 350, etaDays: [8, 15] },
      EXPRESS: { baseCost: 2890, perItem: 500, etaDays: [3, 6] },
    },
  },
  NORTH_AMERICA: {
    id: "NORTH_AMERICA",
    label: "North America",
    countries: ["US", "CA", "MX"],
    methods: {
      STANDARD: { baseCost: 1490, perItem: 400, etaDays: [9, 16] },
      EXPRESS: { baseCost: 3190, perItem: 550, etaDays: [3, 7] },
    },
  },
  SOUTH_AMERICA: {
    id: "SOUTH_AMERICA",
    label: "South America",
    countries: ["BR", "AR", "CL", "CO", "PE", "UY"],
    methods: {
      STANDARD: { baseCost: 1690, perItem: 450, etaDays: [12, 22] },
      EXPRESS: { baseCost: 3490, perItem: 600, etaDays: [5, 9] },
    },
  },
  AFRICA: {
    id: "AFRICA",
    label: "Africa",
    countries: ["ZA", "NG", "EG", "MA", "GH", "SN", "CI", "CM", "DZ", "TN"],
    methods: {
      STANDARD: { baseCost: 1790, perItem: 450, etaDays: [12, 24] },
      EXPRESS: { baseCost: 3690, perItem: 600, etaDays: [5, 10] },
    },
  },
  OCEANIA: {
    id: "OCEANIA",
    label: "Oceania",
    countries: ["AU", "NZ", "FJ"],
    methods: {
      STANDARD: { baseCost: 1390, perItem: 400, etaDays: [8, 16] },
      EXPRESS: { baseCost: 2990, perItem: 550, etaDays: [3, 7] },
    },
  },
};

const COUNTRY_TO_ZONE: Record<string, ShippingZoneId> = Object.values(shippingZones).reduce(
  (acc, zone) => {
    zone.countries.forEach((c) => (acc[c] = zone.id));
    return acc;
  },
  {} as Record<string, ShippingZoneId>,
);

/** Resolve a country code to its shipping zone. Defaults to ASIA (origin region). */
export function zoneForCountry(countryCode: string): ShippingZone {
  const id = COUNTRY_TO_ZONE[countryCode.toUpperCase()] ?? "ASIA";
  return shippingZones[id];
}

export interface ShippingQuote {
  zone: ShippingZoneId;
  zoneLabel: string;
  method: ShippingMethodId;
  cost: number; // USD cents
  etaDays: [number, number];
  free: boolean;
}

/**
 * Compute a shipping quote for a destination, item count and order subtotal.
 */
export function quoteShipping(
  countryCode: string,
  itemCount: number,
  subtotal: number,
  method: ShippingMethodId = "STANDARD",
): ShippingQuote {
  const zone = zoneForCountry(countryCode);
  const rate = zone.methods[method];
  const extras = Math.max(0, itemCount - 1);
  let cost = rate.baseCost + extras * rate.perItem;

  const free = method === "STANDARD" && subtotal >= FREE_SHIPPING_THRESHOLD;
  if (free) cost = 0;

  return {
    zone: zone.id,
    zoneLabel: zone.label,
    method,
    cost,
    etaDays: rate.etaDays,
    free,
  };
}
