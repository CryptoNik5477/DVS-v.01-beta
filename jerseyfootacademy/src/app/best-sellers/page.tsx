import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Best Sellers — Top Football Jerseys",
  description: "Our most popular football jerseys — the fan favourites and top-selling kits.",
};

export default async function BestSellersPage() {
  const tu = await getTranslations("ui");
  const items = products.filter((p) => p.isBestSeller);

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { href: "/", label: tu("home") },
          { href: "/best-sellers", label: "Best Sellers" },
        ]}
      />
      <div className="mt-4 rounded-2xl bg-gradient-to-r from-red to-red-light p-8 text-white">
        <span className="badge bg-white/15 text-white ring-1 ring-white/30">★ Best Sellers</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase">Meilleures ventes</h1>
        <p className="mt-2 max-w-xl text-white/80">
          Les maillots préférés de nos clients — les kits qui partent le plus vite.
        </p>
      </div>
      <div className="mt-8">
        {items.length ? (
          <>
            <p className="mb-4 text-sm text-navy/50">{items.length} products</p>
            <ProductGrid products={items} />
          </>
        ) : (
          <p className="rounded-xl bg-white p-8 text-center text-navy/60 shadow-soft">
            Aucun maillot en vedette pour le moment — reviens bientôt !
          </p>
        )}
      </div>
    </div>
  );
}
