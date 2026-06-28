import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { searchProducts } from "@/data/queries";

export const metadata: Metadata = {
  title: "Sale — Discounted Football Jerseys",
  description: "Save on premium football jerseys. Limited-time discounts on selected club kits.",
};

export default async function SalePage() {
  const tu = await getTranslations("ui");
  const tn = await getTranslations("nav");
  const items = searchProducts({ onSale: true, sort: "price-asc" });
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: tu("home") }, { href: "/sale", label: tn("sale") }]} />
      <h1 className="mt-3 font-display text-3xl font-extrabold text-red">{tu("saleTitle")}</h1>
      <p className="mt-1 text-navy/60">{tu("saleSubtitle")}</p>
      <div className="mt-8">
        {items.length ? (
          <ProductGrid products={items} />
        ) : (
          <p className="rounded-xl bg-white p-8 text-center text-navy/60 shadow-soft">{tu("saleEmpty")}</p>
        )}
      </div>
    </div>
  );
}
