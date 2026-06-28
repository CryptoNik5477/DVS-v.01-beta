import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Price } from "@/components/ui/price";
import { formatDate } from "@/lib/utils";
import { countryNames } from "@/config/countries";
import { OrderStatusForm } from "../order-status-form";

export const metadata = { title: "Admin · Order" };

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let order: Awaited<ReturnType<typeof prisma.order.findUnique>> & {
    items?: { id: string; name: string; size: string; color: string; quantity: number; unitPrice: number; customName: string | null; customNumber: string | null }[];
  } | null = null;
  try {
    order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  } catch {
    // DB unavailable
  }
  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Order {order.number}</h1>
          <p className="text-sm text-navy/60">
            {formatDate(order.createdAt)} · {order.email}
          </p>
        </div>
        <Link href="/admin/orders" className="btn-outline text-sm">Back to orders</Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Items + totals */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase text-navy/50">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {(order.items ?? []).map((it) => (
                  <tr key={it.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{it.name}</p>
                      <p className="text-xs text-navy/50">
                        {it.size} · {it.color}
                        {it.customName || it.customNumber
                          ? ` · ✦ ${it.customName ?? ""} ${it.customNumber ?? ""}`
                          : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">{it.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      <Price cents={it.unitPrice * it.quantity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-navy/60">Subtotal</dt><dd><Price cents={order.subtotal} /></dd></div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600"><dt>Discount</dt><dd>– <Price cents={order.discountAmount} /></dd></div>
              )}
              <div className="flex justify-between"><dt className="text-navy/60">Shipping ({order.shippingZone ?? "—"} / {order.shippingMethod ?? "—"})</dt><dd><Price cents={order.shippingCost} /></dd></div>
              {order.taxAmount > 0 && (
                <div className="flex justify-between"><dt className="text-navy/60">Tax</dt><dd><Price cents={order.taxAmount} /></dd></div>
              )}
              <div className="flex justify-between border-t border-navy/10 pt-2 text-base font-bold"><dt>Total</dt><dd><Price cents={order.total} /></dd></div>
            </dl>
          </div>

          {(order.shipName || order.shipLine1) && (
            <div className="rounded-xl bg-white p-5 text-sm shadow-soft ring-1 ring-navy/5">
              <h2 className="mb-2 font-display text-lg font-extrabold">Shipping address</h2>
              <p>{order.shipName}</p>
              <p className="text-navy/60">{order.shipLine1}</p>
              {order.shipLine2 && <p className="text-navy/60">{order.shipLine2}</p>}
              <p className="text-navy/60">{order.shipCity} {order.shipPostal}</p>
              <p className="text-navy/60">{order.shipCountry ? countryNames[order.shipCountry] ?? order.shipCountry : ""}</p>
            </div>
          )}
        </div>

        {/* Fulfillment form */}
        <div className="h-fit">
          <OrderStatusForm id={order.id} status={order.status} trackingNumber={order.trackingNumber} />
        </div>
      </div>
    </div>
  );
}
