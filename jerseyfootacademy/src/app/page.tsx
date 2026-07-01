import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { FeatureBar } from "@/components/home/feature-bar";
import { Faq } from "@/components/home/faq";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { ProductGrid } from "@/components/product/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { siteConfig } from "@/config/site";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tu = await getTranslations("ui");

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const worldCup = products.filter((p) => p.isWorldCup).slice(0, 4);
  const leagues = categories.filter((c) => c.type === "LEAGUE" && c.parentSlug === "clubs");

  return (
    <>
      <Hero />
      <FeatureBar />

      {/* World Cup promo band */}
      <section className="bg-gradient-to-r from-navy via-navy-700 to-navy text-white">
        <div className="container-page grid items-center gap-8 py-12 lg:grid-cols-2">
          <div>
            <span className="badge bg-gold text-navy">World Cup 2026</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              {t("worldCupPromo")}
            </h2>
            <p className="mt-3 max-w-md text-white/70">{tu("worldCupBandText")}</p>
            <Link href="/world-cup" className="btn-gold mt-6">
              {t("shopWorldCup")}
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {worldCup.map((p) => (
              <Link
                key={p.slug}
                href={`/product/${p.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-white/10"
              >
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="120px"
                  className="object-contain p-1 transition group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="container-page py-16">
        <SectionHeader title={t("bestSellers")} href="/catalog" cta={t("popularCategories")} />
        <ProductGrid products={bestSellers} />
      </section>

      {/* Leagues */}
      <section className="container-page py-6">
        <SectionHeader title={t("popularCategories")} />
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
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-page py-16">
        <SectionHeader title={t("newArrivals")} href="/catalog" cta={t("popularCategories")} />
        <ProductGrid products={newArrivals} />
      </section>

      {/* Newsletter */}
      <section className="bg-navy py-16 text-white">
        <div className="container-page text-center">
          <h2 className="font-display text-3xl font-extrabold">{t("newsletterTitle")}</h2>
          <p className="mx-auto mt-2 max-w-md text-white/60">{t("newsletterText")}</p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>

      <Faq />

      {/* Partners */}
      <section className="container-page pb-20">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-navy/40">
          {t("partners")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-lg font-bold text-navy/30">
          <span>Stripe</span>
          <span>Thailand&nbsp;Post</span>
          <span>Visa</span>
          <span>Mastercard</span>
          <span>DHL&nbsp;Express</span>
          <span>Vercel</span>
        </div>
      </section>
    </>
  );
}
