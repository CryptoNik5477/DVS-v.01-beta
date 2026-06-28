"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { ProductGrid } from "@/components/product/product-card";
import { searchProducts, filterFacets, type ProductFilters } from "@/data/queries";

export default function SearchPage() {
  const { competitions, years } = useMemo(() => filterFacets(), []);
  const [filters, setFilters] = useState<ProductFilters>({ sort: "popular" });

  const results = useMemo(() => searchProducts(filters), [filters]);

  function set<K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) {
    setFilters((f) => ({ ...f, [key]: value || undefined }));
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-extrabold">Search</h1>
      <p className="mt-1 text-navy/60">
        Search by club, country, competition, player or year.
      </p>

      {/* Search bar */}
      <div className="mt-6 flex items-center gap-2 rounded-full bg-white px-4 py-1 shadow-soft ring-1 ring-navy/5 focus-within:ring-red">
        <SearchIcon size={18} className="text-navy/40" />
        <input
          autoFocus
          value={filters.q ?? ""}
          onChange={(e) => set("q", e.target.value)}
          placeholder="e.g. Real Madrid, Brazil 2026, Champions League…"
          className="w-full bg-transparent py-2.5 text-sm outline-none"
        />
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={filters.competition ?? ""}
          onChange={(e) => set("competition", e.target.value)}
          className="rounded-full border border-navy/15 bg-white px-4 py-2 text-sm"
        >
          <option value="">All competitions</option>
          {competitions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.year ?? ""}
          onChange={(e) => set("year", e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-full border border-navy/15 bg-white px-4 py-2 text-sm"
        >
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={!!filters.onSale}
            onChange={(e) => set("onSale", e.target.checked)}
            className="accent-red"
          />
          On sale
        </label>
        <label className="flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={!!filters.worldCup}
            onChange={(e) => set("worldCup", e.target.checked)}
            className="accent-red"
          />
          World Cup
        </label>

        <select
          value={filters.sort ?? "popular"}
          onChange={(e) => set("sort", e.target.value as ProductFilters["sort"])}
          className="ml-auto rounded-full border border-navy/15 bg-white px-4 py-2 text-sm"
        >
          <option value="popular">Most popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <p className="mt-6 text-sm text-navy/50">{results.length} results</p>
      <div className="mt-3">
        {results.length ? (
          <ProductGrid products={results} />
        ) : (
          <p className="rounded-xl bg-white p-8 text-center text-navy/60 shadow-soft">
            No jerseys match your search. Try a different term.
          </p>
        )}
      </div>
    </div>
  );
}
