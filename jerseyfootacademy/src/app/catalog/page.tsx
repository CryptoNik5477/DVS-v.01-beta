import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Catalog — All Football Jerseys",
  description:
    "Browse our full catalog of football jerseys by continent, country, city and club, plus national team kits.",
};

export default function CatalogPage() {
  const continents = categories.filter((c) => c.type === "CONTINENT");
  const nationalRoot = categories.find((c) => c.slug === "national-teams");

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/catalog", label: "Catalog" }]} />
      <h1 className="mt-3 font-display text-3xl font-extrabold">Catalog</h1>
      <p className="mt-1 text-navy/60">Browse by continent, then drill down to your club.</p>

      <section className="mt-8">
        <SectionHeader title="By Continent" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {continents.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              {c.image && (
                <Image src={c.image} alt={c.name} fill sizes="200px" className="object-cover transition group-hover:scale-110" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-bold text-white">{c.name}</span>
            </Link>
          ))}
          {nationalRoot && (
            <Link
              href="/catalog/national-teams"
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-navy text-center"
            >
              <span className="p-3 text-sm font-bold text-gold">National Teams →</span>
            </Link>
          )}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader title="All Jerseys" subtitle={`${products.length} products`} />
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
