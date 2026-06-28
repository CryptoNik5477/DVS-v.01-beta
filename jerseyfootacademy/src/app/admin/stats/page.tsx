import { BarChart3, DollarSign, Receipt, TrendingUp, Users } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Price } from "@/components/ui/price";
import { ScaffoldNotice } from "@/components/admin/scaffold-notice";

export const metadata = { title: "Admin · Statistics" };

const PAID_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}
function monthLabel(d: Date) {
  return d.toLocaleString("en-US", { month: "short" });
}

export default async function AdminStatsPage() {
  let dbAvailable = true;
  let paidOrders: { total: number; createdAt: Date }[] = [];
  let items: { name: string; quantity: number; unitPrice: number }[] = [];
  let statusGroups: { status: OrderStatus; _count: number }[] = [];
  let customers = 0;
  let subscribers = 0;

  try {
    [paidOrders, items, statusGroups, customers, subscribers] = await Promise.all([
      prisma.order.findMany({
        where: { status: { in: PAID_STATUSES } },
        select: { total: true, createdAt: true },
      }),
      prisma.orderItem.findMany({
        where: { order: { status: { in: PAID_STATUSES } } },
        select: { name: true, quantity: true, unitPrice: true },
      }),
      prisma.order
        .groupBy({ by: ["status"], _count: true })
        .then((g) => g.map((x) => ({ status: x.status, _count: x._count }))),
      prisma.user.count(),
      prisma.newsletterSubscriber.count(),
    ]);
  } catch {
    dbAvailable = false;
  }

  if (!dbAvailable) {
    return (
      <ScaffoldNotice title="Statistics">
        Connect a database (and process a few orders) to see live revenue, order and best-seller
        charts here. The queries are ready — they aggregate the <code>Order</code> and{" "}
        <code>OrderItem</code> tables.
      </ScaffoldNotice>
    );
  }

  const revenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const orderCount = paidOrders.length;
  const aov = orderCount ? Math.round(revenue / orderCount) : 0;

  // Revenue for the last 6 months.
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: monthKey(d), label: monthLabel(d), total: 0 };
  });
  const monthIndex = new Map(months.map((m, i) => [m.key, i]));
  for (const o of paidOrders) {
    const idx = monthIndex.get(monthKey(new Date(o.createdAt)));
    if (idx !== undefined) months[idx].total += o.total;
  }
  const maxMonth = Math.max(1, ...months.map((m) => m.total));

  // Top products by units sold.
  const byProduct = new Map<string, { qty: number; revenue: number }>();
  for (const it of items) {
    const cur = byProduct.get(it.name) ?? { qty: 0, revenue: 0 };
    cur.qty += it.quantity;
    cur.revenue += it.unitPrice * it.quantity;
    byProduct.set(it.name, cur);
  }
  const topProducts = [...byProduct.entries()]
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 8);
  const maxQty = Math.max(1, ...topProducts.map(([, v]) => v.qty));

  const totalOrders = statusGroups.reduce((s, g) => s + g._count, 0);

  const kpis = [
    { icon: DollarSign, label: "Revenue (paid)", node: <Price cents={revenue} /> },
    { icon: Receipt, label: "Paid orders", node: orderCount },
    { icon: TrendingUp, label: "Avg. order value", node: <Price cents={aov} /> },
    { icon: Users, label: "Customers", node: customers },
  ];

  return (
    <div>
      <h1 className="flex items-center gap-2 font-display text-3xl font-extrabold">
        <BarChart3 className="text-gold" /> Statistics
      </h1>
      <p className="text-sm text-navy/60">{subscribers} newsletter subscribers.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5">
            <k.icon className="text-gold" size={22} />
            <p className="mt-3 text-2xl font-bold">{k.node}</p>
            <p className="text-xs text-navy/50">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Revenue bar chart */}
        <div className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
          <h2 className="mb-4 font-display text-lg font-extrabold">Revenue — last 6 months</h2>
          <div className="flex h-48 items-end gap-3">
            {months.map((m) => (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-navy to-navy-600 transition-all"
                    style={{ height: `${Math.round((m.total / maxMonth) * 100)}%`, minHeight: m.total > 0 ? 4 : 0 }}
                    title={`$${(m.total / 100).toFixed(2)}`}
                  />
                </div>
                <span className="text-[11px] text-navy/50">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by status */}
        <div className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
          <h2 className="mb-4 font-display text-lg font-extrabold">Orders by status</h2>
          {totalOrders === 0 ? (
            <p className="text-sm text-navy/50">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {statusGroups
                .sort((a, b) => b._count - a._count)
                .map((g) => (
                  <li key={g.status}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-semibold">{g.status}</span>
                      <span className="text-navy/50">{g._count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-navy/5">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${Math.round((g._count / totalOrders) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Top products */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
        <h2 className="mb-4 font-display text-lg font-extrabold">Best sellers (units sold)</h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-navy/50">No sales yet.</p>
        ) : (
          <ul className="space-y-3">
            {topProducts.map(([name, v]) => (
              <li key={name} className="flex items-center gap-3">
                <span className="w-48 flex-none truncate text-sm font-medium">{name}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-navy/5">
                  <div className="h-full rounded-full bg-red" style={{ width: `${Math.round((v.qty / maxQty) * 100)}%` }} />
                </div>
                <span className="w-10 flex-none text-right text-sm font-semibold">{v.qty}</span>
                <span className="w-20 flex-none text-right text-xs text-navy/50">
                  <Price cents={v.revenue} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
