import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CheckCircle2, Circle, Truck } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Price } from "@/components/ui/price";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { formatDate } from "@/lib/utils";
import { countryNames } from "@/config/countries";
import { siteConfig } from "@/config/site";
import { PrintButton } from "../print-button";

export const metadata = { title: "Order details" };

const FLOW = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/account/login?callbackUrl=/account/orders/${id}`);

  const userId = (session.user as { id?: string }).id;
  const isAdmin = (session.user as { role?: string }).role === "ADMIN";

  let order: Awaited<ReturnType<typeof prisma.order.findUnique>> & {
    items?: { id: string; name: string; size: string; color: string; quantity: number; unitPrice: number; customName: string | null; customNumber: string | null }[];
  } | null = null;
  try {
    order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  } catch {
    // DB unavailable
  }
  if (!order) notFound();
  // Owner-only (admins may view any order).
  if (!isAdmin && order.userId && order.userId !== userId) notFound();

  const currentStep = FLOW.indexOf(order.status as (typeof FLOW)[number]);
  const cancelled = order.status === "CANCELLED" || order.status === "REFUNDED";

  return (
    <div className="container-page py-8">
      <div className="no-print">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/account", label: "Account" },
            { href: `/account/orders/${order.id}`, label: order.number },
          ]}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold">Order {order.number}</h1>
        <PrintButton />
      </div>

      {/* Tracking / status */}
      {!cancelled ? (
        <div className="mt-6 rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5 print-card">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
            {FLOW.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i <= currentStep ? (
                  <CheckCircle2 size={18} className="text-green-600" />
                ) : (
                  <Circle size={18} className="text-navy/20" />
                )}
                <span className={i <= currentStep ? "text-sm font-semibold" : "text-sm text-navy/40"}>
                  {step}
                </span>
                {i < FLOW.length - 1 && <span className="mx-1 h-px w-6 bg-navy/15" />}
              </div>
            ))}
          </div>
          {order.trackingNumber && (
            <p className="mt-4 flex items-center gap-2 text-sm">
              <Truck size={16} className="text-gold" />
              Tracking: <span className="font-semibold">{order.trackingNumber}</span>
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-red/5 px-4 py-3 text-sm font-semibold text-red ring-1 ring-red/20">
          This order is {order.status.toLowerCase()}.
        </p>
      )}

      {/* Invoice */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5 print-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-xl font-extrabold">{siteConfig.name}</p>
            <p className="text-xs text-navy/50">Invoice · {formatDate(order.createdAt)}</p>
          </div>
          <div className="text-right text-xs text-navy/60">
            <p className="font-semibold text-navy">{order.number}</p>
            <p>{order.email}</p>
          </div>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead className="border-b border-navy/10 text-left text-xs uppercase text-navy/50">
            <tr>
              <th className="py-2">Item</th>
              <th className="py-2">Qty</th>
              <th className="py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {(order.items ?? []).map((it) => (
              <tr key={it.id}>
                <td className="py-2.5">
                  <p className="font-semibold">{it.name}</p>
                  <p className="text-xs text-navy/50">
                    {it.size} · {it.color}
                    {it.customName || it.customNumber ? ` · ✦ ${it.customName ?? ""} ${it.customNumber ?? ""}` : ""}
                  </p>
                </td>
                <td className="py-2.5">{it.quantity}</td>
                <td className="py-2.5 text-right"><Price cents={it.unitPrice * it.quantity} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
          <div className="flex justify-between"><dt className="text-navy/60">Subtotal</dt><dd><Price cents={order.subtotal} /></dd></div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600"><dt>Discount</dt><dd>– <Price cents={order.discountAmount} /></dd></div>
          )}
          <div className="flex justify-between"><dt className="text-navy/60">Shipping</dt><dd><Price cents={order.shippingCost} /></dd></div>
          {order.taxAmount > 0 && (
            <div className="flex justify-between"><dt className="text-navy/60">Tax</dt><dd><Price cents={order.taxAmount} /></dd></div>
          )}
          <div className="flex justify-between border-t border-navy/10 pt-1 text-base font-bold"><dt>Total</dt><dd><Price cents={order.total} /></dd></div>
        </dl>

        {(order.shipName || order.shipLine1) && (
          <div className="mt-6 border-t border-navy/10 pt-4 text-sm">
            <p className="text-xs uppercase tracking-wide text-navy/40">Ship to</p>
            <p className="mt-1 font-semibold">{order.shipName}</p>
            <p className="text-navy/60">{order.shipLine1}{order.shipLine2 ? `, ${order.shipLine2}` : ""}</p>
            <p className="text-navy/60">{order.shipCity} {order.shipPostal} · {order.shipCountry ? countryNames[order.shipCountry] ?? order.shipCountry : ""}</p>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-navy/40">
          Thank you for shopping with {siteConfig.name}! Ships from {siteConfig.shipsFrom}.
        </p>
      </div>

      <div className="no-print mt-6">
        <Link href="/account" className="btn-outline text-sm">Back to account</Link>
      </div>
    </div>
  );
}
