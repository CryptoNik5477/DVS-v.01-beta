import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { searchProducts } from "@/data/queries";

export const metadata: Metadata = {
  title: "World Cup 2026 Collection",
  description:
    "Official national team jerseys for the 2026 FIFA World Cup. Pre-order kits for all 48 nations.",
};

export default async function WorldCupPage() {
  const tu = await getTranslations("ui");
  const tn = await getTranslations("nav");
  const items = searchProducts({ worldCup: true });
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: tu("home") }, { href: "/world-cup", label: tn("worldCup") }]} />
      <div className="mt-4 rounded-2xl bg-gradient-to-r from-navy to-navy-700 p-8 text-white">
        <span className="badge bg-gold text-navy">{tn("worldCup")}</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold">{tu("worldCupTitle")}</h1>
        <p className="mt-2 max-w-xl text-white/70">{tu("worldCupSubtitle")}</p>
      </div>
      <div className="mt-8">
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
