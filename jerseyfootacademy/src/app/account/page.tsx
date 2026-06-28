import Link from "next/link";
import { getServerSession } from "next-auth";
import { Heart, MapPin, Package, Receipt } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Price } from "@/components/ui/price";
import { formatDate } from "@/lib/utils";
import { SignOutButton } from "./sign-out-button";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">My Account</h1>
        <p className="mt-3 text-navy/60">Sign in to view your orders, favorites and addresses.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/account/login" className="btn-primary">
            Sign in
          </Link>
          <Link href="/account/register" className="btn-outline">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  const userId = (session.user as { id?: string }).id;
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  } catch {
    // DB unavailable
  }

  const tiles = [
    { icon: Package, label: "Orders", value: orders.length, href: "/account" },
    { icon: Heart, label: "Favorites", value: "♥", href: "/account/favorites" },
    { icon: MapPin, label: "Addresses", value: "—", href: "/account/addresses" },
    { icon: Receipt, label: "Invoices", value: orders.length, href: "/account" },
  ];

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">
            Hi, {session.user.name ?? "Fan"} 👋
          </h1>
          <p className="text-sm text-navy/60">{session.user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <t.icon className="text-gold" size={22} />
            <p className="mt-3 text-2xl font-bold">{t.value}</p>
            <p className="text-xs text-navy/50">{t.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-extrabold">Order history</h2>
        {orders.length ? (
          <div className="overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase text-navy/50">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {orders.map((o) => (
                  <tr key={o.id} className="transition hover:bg-cream/60">
                    <td className="px-4 py-3 font-semibold">
                      <Link href={`/account/orders/${o.id}`} className="hover:text-red">{o.number}</Link>
                    </td>
                    <td className="px-4 py-3">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-navy/5 text-navy">{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Price cents={o.total} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl bg-white p-8 text-center text-navy/60 shadow-soft">
            No orders yet.{" "}
            <Link href="/catalog" className="font-semibold text-red hover:underline">
              Start shopping
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}
