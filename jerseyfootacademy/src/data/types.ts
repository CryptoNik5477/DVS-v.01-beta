import type { CurrencyCode } from "@/config/currencies";

export type CategoryType = "CONTINENT" | "COUNTRY" | "CITY" | "LEAGUE" | "CLUB" | "NATIONAL";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface CategoryNode {
  type: CategoryType;
  name: string;
  slug: string;
  countryCode?: string;
  parentSlug?: string;
  image?: string;
}

export interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  basePrice: number; // USD cents
  salePrice?: number;
  categorySlug: string; // club or national slug
  competition?: string;
  season?: string;
  year?: number;
  player?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  isWorldCup?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  customizable?: boolean;
  images: string[];
  // size -> stock
  stock: Partial<Record<Size, number>>;
  colors?: string[];
}

export interface ReviewSeed {
  productSlug: string;
  authorName: string;
  country: string;
  rating: number;
  comment: string;
  daysAgo: number;
}

// Re-export for convenience in UI code
export type { CurrencyCode };
