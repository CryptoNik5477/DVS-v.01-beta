import { prisma } from "@/lib/prisma";
import { Price } from "@/components/ui/price";
import { formatDate } from "@/lib/utils";
import { PromoForm } from "./promo-form";
import { DeletePromoButton } from "./delete-promo-button";

export const metadata = { title: "Admin · Promo Codes" };

export default async function AdminPromosPage() {
  let promos: Awaited<ReturnType<typeof prisma.promoCode.findMany>> = [];
  let dbAvailable = true;
  try {
    promos = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    dbAvailable = false;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Promo Codes</h1>
      <p className="text-sm text-navy/60">{promos.length} codes.</p>

      {!dbAvailable && (
        <p className="mt-4 rounded-lg bg-gold/10 px-3 py-2 text-xs text-navy/70 ring-1 ring-gold/30">
          ⓘ Database not connected. Connect it to manage live promo codes. The storefront also accepts
          the offline demo codes in <code>src/config/promos.ts</code>.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-xs uppercase text-navy/50">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Min</th>
                <th className="px-4 py-3">Used</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {promos.length ? (
                promos.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-semibold">{p.code}</td>
                    <td className="px-4 py-3">
                      {p.type === "PERCENT" ? `${p.value}%` : <Price cents={p.value} />}
                    </td>
                    <td className="px-4 py-3 text-navy/60">{p.minOrder ? <Price cents={p.minOrder} /> : "—"}</td>
                    <td className="px-4 py-3 text-navy/60">
                      {p.usageCount}{p.usageLimit ? `/${p.usageLimit}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.active ? "bg-green-100 text-green-700" : "bg-navy/5 text-navy/50"}`}>
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-navy/60">{p.expiresAt ? formatDate(p.expiresAt) : "—"}</td>
                    <td className="px-4 py-3 text-right"><DeletePromoButton id={p.id} code={p.code} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-navy/50">
                    No promo codes yet. Create one →
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="h-fit"><PromoForm /></div>
      </div>
    </div>
  );
}
