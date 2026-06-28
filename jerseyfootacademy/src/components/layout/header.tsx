"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, Menu, Search, User, X } from "lucide-react";
import { CartIndicator } from "./cart-indicator";
import { CurrencySwitcher } from "./currency-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { childrenOf } from "@/data/categories";

export function Header() {
  const t = useTranslations("nav");
  const tu = useTranslations("ui");
  const [open, setOpen] = useState(false);
  const continents = childrenOf(undefined).filter((c) => c.type === "CONTINENT");

  const links = [
    { href: "/catalog", label: t("catalog") },
    { href: "/catalog/national-teams", label: t("nationalTeams") },
    { href: "/world-cup", label: t("worldCup") },
    { href: "/sale", label: t("sale") },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="bg-navy text-white/80">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p className="hidden sm:block">✈️ {tu("shipBanner")}</p>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <span className="text-white/20">|</span>
            <CurrencySwitcher />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-navy/10 bg-white/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X /> : <Menu />}
            </button>
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="JerseyFootAcademy" width={200} height={40} priority />
            </Link>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-red">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/search" className="p-2" aria-label={t("search")}>
              <Search size={20} />
            </Link>
            <Link href="/account/favorites" className="hidden p-2 sm:inline-flex" aria-label="Favorites">
              <Heart size={20} />
            </Link>
            <Link href="/account" className="p-2" aria-label={t("account")}>
              <User size={20} />
            </Link>
            <CartIndicator />
          </div>
        </div>

        {/* Continent quick-links */}
        <div className="hidden border-t border-navy/5 bg-cream lg:block">
          <div className="container-page flex h-10 items-center gap-6 text-xs font-medium text-navy/70">
            <span className="font-bold uppercase tracking-wide text-navy/40">{t("clubs")}:</span>
            {continents.map((c) => (
              <Link key={c.slug} href={`/catalog/${c.slug}`} className="hover:text-red">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-b border-navy/10 bg-white lg:hidden">
          <nav className="container-page flex flex-col py-4 text-sm font-semibold">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-navy/5 py-3"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 text-xs uppercase tracking-wide text-navy/40">{t("clubs")}</div>
            {continents.map((c) => (
              <Link
                key={c.slug}
                href={`/catalog/${c.slug}`}
                onClick={() => setOpen(false)}
                className="py-2 font-medium"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
