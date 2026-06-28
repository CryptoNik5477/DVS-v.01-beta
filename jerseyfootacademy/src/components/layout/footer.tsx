import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/home/newsletter-form";

export async function Footer() {
  const t = await getTranslations("footer");

  const cols = [
    {
      title: t("shop"),
      links: [
        { href: "/catalog", label: "All Jerseys" },
        { href: "/catalog/national-teams", label: "National Teams" },
        { href: "/world-cup", label: "World Cup 2026" },
        { href: "/sale", label: "Sale" },
      ],
    },
    {
      title: t("help"),
      links: [
        { href: "/shipping", label: "Shipping & Delivery" },
        { href: "/size-guide", label: "Size Guide" },
        { href: "/faq", label: "FAQ" },
        { href: "/account", label: "My Account" },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
      ],
    },
  ];

  return (
    <footer className="mt-20 bg-navy text-white/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Image src="/logo-light.svg" alt={siteConfig.name} width={200} height={40} />
          <p className="mt-4 max-w-sm text-sm text-white/60">{siteConfig.description}</p>
          <p className="mt-4 text-xs text-gold">⚽ {t("shipsFrom")}</p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
              {col.title}
            </h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-8">
          <NewsletterForm variant="footer" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </p>
          <p className="flex items-center gap-3">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple&nbsp;Pay</span>
            <span>Google&nbsp;Pay</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
