import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Market Watcher",
  description: "Real-time market alert aggregator",
};

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/alerts", label: "Alertes" },
  { href: "/costs", label: "Coûts" },
  { href: "/settings", label: "Réglages" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-800 bg-slate-900/60">
            <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
              <span className="font-bold tracking-tight text-emerald-400">
                ⚡ Market Watcher
              </span>
              <nav className="flex gap-4 text-sm">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="text-slate-300 hover:text-white"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
