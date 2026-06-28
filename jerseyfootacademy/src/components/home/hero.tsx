import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Sparkles } from "lucide-react";

export async function Hero() {
  const t = await getTranslations("home");

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* Decorative pitch glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-red/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container-page relative grid min-h-[78vh] items-center gap-10 py-16 lg:grid-cols-2">
        <div className="animate-fade-up">
          <span className="badge bg-gold/15 text-gold ring-1 ring-gold/30">
            <Sparkles size={14} className="mr-1" /> {t("worldCupPromo")}
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/70">{t("heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/world-cup" className="btn-primary">
              {t("shopWorldCup")} <ArrowRight size={16} />
            </Link>
            <Link href="/catalog" className="btn-outline border-white/20 bg-white/5 text-white hover:border-white/50">
              {t("popularCategories")}
            </Link>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            <div>
              <p className="font-display text-2xl font-bold gold-text">120+</p>
              <p className="text-white/50">Clubs & Nations</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold gold-text">6</p>
              <p className="text-white/50">Continents shipped</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold gold-text">4.8★</p>
              <p className="text-white/50">Fan rating</p>
            </div>
          </div>
        </div>

        {/* Floating jersey crest mark */}
        <div className="relative hidden justify-center lg:flex">
          <div className="animate-float relative aspect-square w-[26rem] rounded-full bg-gradient-to-br from-navy-700 to-navy-800 ring-1 ring-gold/30 shadow-soft">
            <div className="absolute inset-8 rounded-full border-2 border-dashed border-gold/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Big crest */}
              <svg width="180" height="200" viewBox="0 0 64 70" aria-hidden>
                <path d="M32 3 L57 11 V31 C57 47 46 56 32 61 C18 56 7 47 7 31 V11 Z" fill="#13204A" stroke="#D4AF37" strokeWidth="2"/>
                <path d="M32 16 L46 22 V31 C46 40 40 46 32 50 C24 46 18 40 18 31 V22 Z" fill="#C8102E"/>
                <circle cx="32" cy="31" r="10" fill="#fff"/>
                <path d="M32 24 l5 3.6 -2 6 h-6 l-2 -6 Z" fill="#0B132B"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
