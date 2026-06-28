import { products } from "./products";
import { descendantLeafSlugs, categoryBySlug } from "./categories";
import { ratingFor } from "./reviews";
import type { ProductSeed } from "./types";

/** Products belonging to a category (or any of its descendants). */
export function productsInCategory(slug: string): ProductSeed[] {
  const leaves = new Set(descendantLeafSlugs(slug));
  return products.filter((p) => leaves.has(p.categorySlug));
}

export interface ProductFilters {
  q?: string;
  competition?: string;
  year?: number;
  onSale?: boolean;
  worldCup?: boolean;
  sort?: "popular" | "price-asc" | "price-desc" | "newest" | "rating";
}

/**
 * Intelligent search + filtering across name, club, country, competition,
 * player and year — the storefront search/catalog use this single function.
 */
export function searchProducts(filters: ProductFilters): ProductSeed[] {
  let result = [...products];
  const q = filters.q?.trim().toLowerCase();

  if (q) {
    result = result.filter((p) => {
      const club = categoryBySlug.get(p.categorySlug);
      const haystack = [
        p.name,
        p.description,
        p.competition,
        p.season,
        p.player,
        p.year?.toString(),
        club?.name,
        club?.countryCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((term) => haystack.includes(term));
    });
  }

  if (filters.competition) result = result.filter((p) => p.competition === filters.competition);
  if (filters.year) result = result.filter((p) => p.year === filters.year);
  if (filters.onSale) result = result.filter((p) => p.salePrice || p.isOnSale);
  if (filters.worldCup) result = result.filter((p) => p.isWorldCup);

  const price = (p: ProductSeed) => p.salePrice ?? p.basePrice;
  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => price(a) - price(b));
      break;
    case "price-desc":
      result.sort((a, b) => price(b) - price(a));
      break;
    case "rating":
      result.sort((a, b) => ratingFor(b.slug).average - ratingFor(a.slug).average);
      break;
    case "newest":
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    default:
      result.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
  }

  return result;
}

/** Distinct competitions and years, for filter dropdowns. */
export function filterFacets() {
  const competitions = [...new Set(products.map((p) => p.competition).filter(Boolean))] as string[];
  const years = [...new Set(products.map((p) => p.year).filter(Boolean))] as number[];
  return { competitions: competitions.sort(), years: years.sort((a, b) => b - a) };
}
