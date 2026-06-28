import Link from "next/link";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Price } from "@/components/ui/price";
import { formatDate } from "@/lib/utils";
import { products } from "@/data/products";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let customerCount = 0;
  try {
    [orders, customerCount] = await Promise.all([
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.user.count(),
    ]);
  } catch {
    // DB not configured — show catalog metrics only.
  }

  const revenue = orders
    .filter((o) => o.status === "PAID" || o.status === "DELIVERED" || o.status === "SHIPPED")
    .reduce((s, o) => s + o.total, 0);

  const kpis = [
    { icon: DollarSign, label: "Revenue (paid)", node: <Price cents={revenue} /> },
    { icon: ShoppingCart, label: "Orders", node: orders.length },
    { icon: Package, label: "Products", node: products.length },
    { icon: Users, label: "Customers", node: customerCount },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Dashboard</h1>
      <p className="text-sm text-navy/60">Overview of your store.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5">
            <k.icon className="text-gold" size={22} />
            <p className="mt-3 text-2xl font-bold">{k.node}</p>
            <p className="text-xs text-navy/50">{k.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-red hover:underline">
            View all
          </Link>
        </div>
        {orders.length ? (
          <div className="overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase text-navy/50">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-semibold">{o.number}</td>
                    <td className="px-4 py-3 text-navy/60">{o.email}</td>
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
          <p className="rounded-xl bg-white p-8 text-center text-sm text-navy/60 shadow-soft">
            No orders yet. Connect a database and complete a test checkout to see orders here.
          </p>
        )}
      </section>
    </div>
  );
}
