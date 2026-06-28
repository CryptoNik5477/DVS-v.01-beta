import Link from "next/link";
import {
  BarChart3,
  Box,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";

// NOTE: Access is enforced by middleware.ts (ADMIN role required).
const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/promos", label: "Promo Codes", icon: Tag },
  { href: "/admin/stats", label: "Statistics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[14rem_1fr]">
      <aside className="h-fit rounded-xl bg-navy p-3 text-white/80 lg:sticky lg:top-28">
        <p className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-gold">Admin</p>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-white/10 hover:text-white"
            >
              <n.icon size={16} /> {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
