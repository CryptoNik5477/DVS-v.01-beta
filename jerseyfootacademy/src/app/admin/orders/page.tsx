import { prisma } from "@/lib/prisma";
import { Price } from "@/components/ui/price";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Orders" };

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  try {
    orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  } catch {
    // DB not configured
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Orders</h1>
      <p className="text-sm text-navy/60">{orders.length} orders.</p>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs uppercase text-navy/50">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {orders.length ? (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-semibold">{o.number}</td>
                  <td className="px-4 py-3 text-navy/60">{o.email}</td>
                  <td className="px-4 py-3">{o.shippingZone ?? "—"}</td>
                  <td className="px-4 py-3">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-navy/5 text-navy">{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Price cents={o.total} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-navy/50">
                  No orders yet. Connect a database to start receiving orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
