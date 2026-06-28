import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Price } from "@/components/ui/price";
import { shippingZones, FREE_SHIPPING_THRESHOLD } from "@/config/shipping";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "International shipping rates and delivery times. We ship worldwide from Thailand with standard and express options.",
};

export default function ShippingPage() {
  const zones = Object.values(shippingZones);
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/shipping", label: "Shipping" }]} />
      <h1 className="mt-3 font-display text-3xl font-extrabold">Shipping & Delivery</h1>
      <p className="mt-2 max-w-2xl text-navy/70">
        All orders ship from <strong>Thailand</strong> with full tracking. Rates below are modelled
        on Thailand Post international tariffs. Enjoy <strong>free standard shipping</strong> on
        orders over <Price cents={FREE_SHIPPING_THRESHOLD} />.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
        <table className="w-full text-sm">
          <thead className="bg-navy text-left text-white">
            <tr>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Standard</th>
              <th className="px-4 py-3">Std. ETA</th>
              <th className="px-4 py-3">Express</th>
              <th className="px-4 py-3">Exp. ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {zones.map((z) => (
              <tr key={z.id}>
                <td className="px-4 py-3 font-semibold">{z.label}</td>
                <td className="px-4 py-3">
                  <Price cents={z.methods.STANDARD.baseCost} />
                </td>
                <td className="px-4 py-3 text-navy/60">
                  {z.methods.STANDARD.etaDays[0]}–{z.methods.STANDARD.etaDays[1]} days
                </td>
                <td className="px-4 py-3">
                  <Price cents={z.methods.EXPRESS.baseCost} />
                </td>
                <td className="px-4 py-3 text-navy/60">
                  {z.methods.EXPRESS.etaDays[0]}–{z.methods.EXPRESS.etaDays[1]} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-navy/40">
        Prices shown are for the first item; each additional item adds a small per-item fee. Final
        shipping is calculated at checkout based on your destination. Tariffs are configurable in{" "}
        <code>src/config/shipping.ts</code>.
      </p>
    </div>
  );
}
