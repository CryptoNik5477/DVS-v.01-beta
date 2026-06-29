import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Sparkles } from "lucide-react";

// Real club crests dropped into /public/crests
const CRESTS = [
  "psg.jpg", "liverpool.png", "real-madrid.png", "arsenal.png", "barcelona.png",
  "west-ham.png", "nancy.png", "bayern.png", "marseille.png", "bordeaux.png",
  "inter.png", "ajax.png", "lille.png", "juventus.png", "ac-milan.png",
  "saint-etienne.png", "villarreal.png",
];

// Deterministic PRNG so the (server-rendered) scatter is stable.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Build ~34 randomly sized/placed crests (overlaps allowed).
const rng = mulberry32(20260629);
const SCATTER = Array.from({ length: 34 }, (_, i) => {
  const r = () => rng();
  return {
    src: CRESTS[Math.floor(r() * CRESTS.length)],
    left: Math.round(r() * 94),
    top: Math.round(r() * 88),
    size: Math.round(54 + r() * 104), // 54–158px
    rot: Math.round(-24 + r() * 48),
    op: +(0.45 + r() * 0.45).toFixed(2), // 0.45–0.90
    key: i,
  };
});

export async function Hero() {
  const t = await getTranslations("home");
  const tu = await getTranslations("ui");

  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-navy text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-800 to-black" />
        <div className="absolute -left-40 -top-32 h-[28rem] w-[28rem] rounded-full bg-red/25 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[120px]" />

        {/* Scattered club crests (random size/position, may overlap) */}
        <div className="absolute inset-0" style={{ mixBlendMode: "lighten" }}>
          {SCATTER.map((c) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={c.key}
              src={`/crests/${c.src}`}
              alt=""
              aria-hidden
              className="absolute"
              style={{
                left: `${c.left}%`,
                top: `${c.top}%`,
                width: `${c.size}px`,
                opacity: c.op,
                transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
              }}
            />
          ))}
        </div>

        {/* Left scrim keeps the headline legible over the crests */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-navy/10" />
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
