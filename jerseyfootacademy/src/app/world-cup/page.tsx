import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { searchProducts } from "@/data/queries";

export const metadata: Metadata = {
  title: "World Cup 2026 Collection",
  description:
    "Official national team jerseys for the 2026 FIFA World Cup. Pre-order kits for all 48 nations.",
};

export default function WorldCupPage() {
  const items = searchProducts({ worldCup: true });
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/world-cup", label: "World Cup 2026" }]} />
      <div className="mt-4 rounded-2xl bg-gradient-to-r from-navy to-navy-700 p-8 text-white">
        <span className="badge bg-gold text-navy">World Cup 2026</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold">The Road to 2026</h1>
        <p className="mt-2 max-w-xl text-white/70">
          48 nations. 3 host countries. One trophy. Wear your colors with official national team kits.
        </p>
      </div>
      <div className="mt-8">
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
