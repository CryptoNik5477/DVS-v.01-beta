import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
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

export default async function CatalogPage() {
  const tu = await getTranslations("ui");
  const leagues = categories.filter((c) => c.type === "LEAGUE" && c.parentSlug === "clubs");
  const nationalRoot = categories.find((c) => c.slug === "national-teams");

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: tu("home") }, { href: "/catalog", label: tu("catalogTitle") }]} />
      <h1 className="mt-3 font-display text-3xl font-extrabold">{tu("catalogTitle")}</h1>
      <p className="mt-1 text-navy/60">{tu("catalogIntro")}</p>

      <section className="mt-8">
        <SectionHeader title="Clubs — by League" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {leagues.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="group relative flex aspect-[5/2] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-navy to-navy-700 text-center ring-1 ring-navy/10 transition hover:from-navy-700 hover:to-navy"
            >
              <span className="p-3 font-display text-lg font-bold uppercase tracking-wide text-white">
                {c.name}
              </span>
            </Link>
          ))}
          {nationalRoot && (
            <Link
              href="/catalog/national-teams"
              className="group relative flex aspect-[5/2] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-red to-red-light text-center ring-1 ring-red/20"
            >
              <span className="p-3 font-display text-lg font-bold uppercase tracking-wide text-white">
                {tu("nationalTeamsCta")}
              </span>
            </Link>
          )}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader title={tu("allJerseys")} subtitle={`${products.length} ${tu("products")}`} />
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
