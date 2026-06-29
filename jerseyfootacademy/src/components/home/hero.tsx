import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Sparkles } from "lucide-react";

export async function Hero() {
  const t = await getTranslations("home");
  const tu = await getTranslations("ui");

  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-navy text-white">
      {/* Layered background: gradient + glows + faded club-badge wall */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-800 to-black" />
        <div className="absolute -left-40 -top-32 h-[28rem] w-[28rem] rounded-full bg-red/30 blur-[110px]" />
        <div className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gold/25 blur-[110px]" />
        {/* Faded wall of team crests */}
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: "url(/crest-wall.svg)",
            backgroundSize: "780px auto",
            backgroundRepeat: "repeat",
            maskImage: "linear-gradient(90deg, black 0%, black 55%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(90deg, black 0%, black 55%, transparent 95%)",
          }}
        />
      </div>

      <div className="container-page relative py-14 sm:py-16">
        <span className="badge bg-white/10 text-gold ring-1 ring-gold/40 backdrop-blur">
          <Sparkles size={14} className="mr-1" /> {t("worldCupPromo")}
        </span>

        <h1 className="mt-5 max-w-4xl font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          {t("heroTitle")}
        </h1>

        <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">{t("heroSubtitle")}</p>

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
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
}
