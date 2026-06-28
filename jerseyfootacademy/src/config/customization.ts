/**
 * Jersey personalisation (flocking) configuration.
 * Surcharge is in USD minor units (cents).
 */

export const CUSTOMIZATION_SURCHARGE = 1200; // $12.00 flat fee when name/number added

export const flockingFonts = [
  { id: "official", label: "Official League", css: "var(--font-display)" },
  { id: "classic", label: "Classic Block", css: "Arial, sans-serif" },
  { id: "modern", label: "Modern Condensed", css: "'Arial Narrow', sans-serif" },
  { id: "serif", label: "Heritage Serif", css: "Georgia, serif" },
] as const;

export const flockingColors = [
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "black", label: "Black", hex: "#0B132B" },
  { id: "gold", label: "Gold", hex: "#D4AF37" },
  { id: "red", label: "Red", hex: "#C8102E" },
  { id: "silver", label: "Silver", hex: "#C0C0C0" },
] as const;

export type FlockingFontId = (typeof flockingFonts)[number]["id"];
export type FlockingColorId = (typeof flockingColors)[number]["id"];

export interface Customization {
  name?: string;
  number?: string;
  font: FlockingFontId;
  color: FlockingColorId;
}

/** Returns the surcharge for a given customization (0 if nothing is flocked). */
export function customizationSurcharge(c?: Partial<Customization> | null): number {
  if (!c) return 0;
  const hasContent = Boolean(c.name?.trim()) || Boolean(c.number?.trim());
  return hasContent ? CUSTOMIZATION_SURCHARGE : 0;
}
