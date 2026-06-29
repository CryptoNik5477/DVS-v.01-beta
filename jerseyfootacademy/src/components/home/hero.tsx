import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Sparkles } from "lucide-react";

export async function Hero() {
  const t = await getTranslations("home");
  const tu = await getTranslations("ui");

  return (
    <section className="relative flex min-h-[68vh] items-center overflow-hidden bg-navy text-white">
      {/* Full-screen stadium background */}
      <div className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/stadium.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
        {/* Scrims: darken left for headline legibility + bottom fade into page */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/75 to-navy/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-navy/30" />
      </div>

      <div className="container-page relative py-16 sm:py-20">
        <span className="badge bg-white/10 text-gold ring-1 ring-gold/40 backdrop-blur">
          <Sparkles size={14} className="mr-1" /> {t("worldCupPromo")}
        </span>

        <h1 className="mt-5 max-w-4xl font-display text-4xl uppercase leading-[0.95] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
          {t("heroTitle")}
        </h1>

        <p className="mt-4 max-w-xl text-base text-white/80 drop-shadow sm:text-lg">{t("heroSubtitle")}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/world-cup" className="btn-primary text-base">
            {t("shopWorldCup")} <ArrowRight size={18} />
          </Link>
          <Link
            href="/catalog"
            className="btn-outline border-white/25 bg-white/5 text-white backdrop-blur hover:border-white hover:text-white"
          >
            {t("popularCategories")}
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
          <Stat value="120+" label={tu("statClubs")} />
          <Stat value="6" label={tu("statContinents")} />
          <Stat value="4.8★" label={tu("statRating")} />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl text-gold sm:text-3xl">{value}</p>
      <p className="text-sm text-white/60">{label}</p>
    </div>
  );
}
