import type { CategoryNode } from "./types";

/**
 * Hierarchical catalog taxonomy:
 *   Continent → Country → City → Club
 * plus a flat "National Teams" branch (NATIONAL nodes parented to NATIONAL root).
 *
 * Extend freely — slugs must be unique. The seed script and storefront both
 * read from this single source of truth.
 */

// Local SVG tiles (self-contained). Replace with photography before launch.
const img = (slug: string) => `/placeholders/tile-${slug}.svg`;

export const categories: CategoryNode[] = [
  // ── Continents ─────────────────────────────────────────────────────────────
  { type: "CONTINENT", name: "Europe", slug: "europe", image: img("europe") },
  { type: "CONTINENT", name: "South America", slug: "south-america", image: img("south-america") },
  { type: "CONTINENT", name: "North America", slug: "north-america", image: img("north-america") },
  { type: "CONTINENT", name: "Asia", slug: "asia", image: img("asia") },
  { type: "CONTINENT", name: "Africa", slug: "africa", image: img("africa") },
  { type: "CONTINENT", name: "Oceania", slug: "oceania", image: img("oceania") },

  // ── Europe › Countries ───────────────────────────────────────────────────
  { type: "COUNTRY", name: "England", slug: "england", countryCode: "GB", parentSlug: "europe" },
  { type: "COUNTRY", name: "Spain", slug: "spain", countryCode: "ES", parentSlug: "europe" },
  { type: "COUNTRY", name: "Italy", slug: "italy", countryCode: "IT", parentSlug: "europe" },
  { type: "COUNTRY", name: "Germany", slug: "germany", countryCode: "DE", parentSlug: "europe" },
  { type: "COUNTRY", name: "France", slug: "france", countryCode: "FR", parentSlug: "europe" },
  { type: "COUNTRY", name: "Netherlands", slug: "netherlands", countryCode: "NL", parentSlug: "europe" },

  // England › Cities
  { type: "CITY", name: "Manchester", slug: "manchester", parentSlug: "england" },
  { type: "CITY", name: "London", slug: "london", parentSlug: "england" },
  { type: "CITY", name: "Liverpool", slug: "liverpool-city", parentSlug: "england" },
  // Spain › Cities
  { type: "CITY", name: "Madrid", slug: "madrid", parentSlug: "spain" },
  { type: "CITY", name: "Barcelona", slug: "barcelona-city", parentSlug: "spain" },
  // Italy › Cities
  { type: "CITY", name: "Milan", slug: "milan", parentSlug: "italy" },
  { type: "CITY", name: "Turin", slug: "turin", parentSlug: "italy" },
  { type: "CITY", name: "Naples", slug: "naples", parentSlug: "italy" },
  { type: "CITY", name: "Rome", slug: "rome", parentSlug: "italy" },
  // Germany › Cities
  { type: "CITY", name: "Munich", slug: "munich", parentSlug: "germany" },
  { type: "CITY", name: "Dortmund", slug: "dortmund-city", parentSlug: "germany" },
  // France › Cities
  { type: "CITY", name: "Paris", slug: "paris", parentSlug: "france" },
  { type: "CITY", name: "Marseille", slug: "marseille", parentSlug: "france" },
  // Netherlands › Cities
  { type: "CITY", name: "Amsterdam", slug: "amsterdam", parentSlug: "netherlands" },

  // ── Clubs ────────────────────────────────────────────────────────────────
  { type: "CLUB", name: "Manchester United", slug: "manchester-united", countryCode: "GB", parentSlug: "manchester" },
  { type: "CLUB", name: "Manchester City", slug: "manchester-city", countryCode: "GB", parentSlug: "manchester" },
  { type: "CLUB", name: "Arsenal", slug: "arsenal", countryCode: "GB", parentSlug: "london" },
  { type: "CLUB", name: "Chelsea", slug: "chelsea", countryCode: "GB", parentSlug: "london" },
  { type: "CLUB", name: "Tottenham Hotspur", slug: "tottenham", countryCode: "GB", parentSlug: "london" },
  { type: "CLUB", name: "Liverpool FC", slug: "liverpool", countryCode: "GB", parentSlug: "liverpool-city" },
  { type: "CLUB", name: "Real Madrid", slug: "real-madrid", countryCode: "ES", parentSlug: "madrid" },
  { type: "CLUB", name: "Atlético Madrid", slug: "atletico-madrid", countryCode: "ES", parentSlug: "madrid" },
  { type: "CLUB", name: "FC Barcelona", slug: "barcelona", countryCode: "ES", parentSlug: "barcelona-city" },
  { type: "CLUB", name: "AC Milan", slug: "ac-milan", countryCode: "IT", parentSlug: "milan" },
  { type: "CLUB", name: "Inter Milan", slug: "inter-milan", countryCode: "IT", parentSlug: "milan" },
  { type: "CLUB", name: "Juventus", slug: "juventus", countryCode: "IT", parentSlug: "turin" },
  { type: "CLUB", name: "Bayern Munich", slug: "bayern-munich", countryCode: "DE", parentSlug: "munich" },
  { type: "CLUB", name: "Borussia Dortmund", slug: "borussia-dortmund", countryCode: "DE", parentSlug: "dortmund-city" },
  { type: "CLUB", name: "Paris Saint-Germain", slug: "psg", countryCode: "FR", parentSlug: "paris" },
  { type: "CLUB", name: "Olympique de Marseille", slug: "marseille-fc", countryCode: "FR", parentSlug: "marseille" },
  { type: "CLUB", name: "SSC Napoli", slug: "napoli", countryCode: "IT", parentSlug: "naples" },
  { type: "CLUB", name: "AS Roma", slug: "as-roma", countryCode: "IT", parentSlug: "rome" },
  { type: "CLUB", name: "AFC Ajax", slug: "ajax", countryCode: "NL", parentSlug: "amsterdam" },

  // ── National Teams branch ──────────────────────────────────────────────────
  { type: "NATIONAL", name: "National Teams", slug: "national-teams", image: img("national-teams") },
  { type: "NATIONAL", name: "Brazil", slug: "brazil", countryCode: "BR", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Argentina", slug: "argentina", countryCode: "AR", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "France", slug: "france-nt", countryCode: "FR", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "England", slug: "england-nt", countryCode: "GB", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Spain", slug: "spain-nt", countryCode: "ES", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Germany", slug: "germany-nt", countryCode: "DE", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Portugal", slug: "portugal", countryCode: "PT", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "USA", slug: "usa", countryCode: "US", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Mexico", slug: "mexico", countryCode: "MX", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Japan", slug: "japan", countryCode: "JP", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Netherlands", slug: "netherlands-nt", countryCode: "NL", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Italy", slug: "italy-nt", countryCode: "IT", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Morocco", slug: "morocco", countryCode: "MA", parentSlug: "national-teams" },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function childrenOf(slug: string | undefined): CategoryNode[] {
  return categories.filter((c) => c.parentSlug === slug);
}

export function ancestorsOf(slug: string): CategoryNode[] {
  const chain: CategoryNode[] = [];
  let current = categoryBySlug.get(slug);
  while (current) {
    chain.unshift(current);
    current = current.parentSlug ? categoryBySlug.get(current.parentSlug) : undefined;
  }
  return chain;
}

/** All descendant club/national slugs under a given category (for listing). */
export function descendantLeafSlugs(slug: string): string[] {
  const node = categoryBySlug.get(slug);
  if (!node) return [];
  if (node.type === "CLUB" || node.type === "NATIONAL") return [slug];
  const result: string[] = [];
  for (const child of childrenOf(slug)) {
    result.push(...descendantLeafSlugs(child.slug));
  }
  return result;
}
