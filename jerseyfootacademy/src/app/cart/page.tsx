"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { useCart, lineTotal } from "@/lib/cart-store";
import { Price } from "@/components/ui/price";
import { quoteShipping, type ShippingMethodId } from "@/config/shipping";
import { countryOptions } from "@/config/countries";
import { customizationSurcharge } from "@/config/customization";

const TAX_RATE = 0; // configurable; many cross-border B2C orders are tax-exempt at source

interface PromoState {
  ok: boolean;
  code?: string;
  discount?: number;
  message: string;
}

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, updateQty, removeItem } = useCart();

  const [country, setCountry] = useState("US");
  const [method, setMethod] = useState<ShippingMethodId>("STANDARD");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<PromoState | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  const shipping = useMemo(
    () => quoteShipping(country, itemCount, subtotal, method),
    [country, itemCount, subtotal, method],
  );

  const discount = promo?.ok ? promo.discount ?? 0 : 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * TAX_RATE);
  const total = taxable + shipping.cost + tax;

  async function applyPromo() {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput, subtotal }),
      });
      const data = (await res.json()) as PromoState;
      setPromo(data);
    } catch {
      setPromo({ ok: false, message: "Could not validate code. Try again." });
    } finally {
      setPromoLoading(false);
    }
  }

  async function checkout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          slug: i.slug,
          name: i.name,
          size: i.size,
          color: i.color,
          unitPrice: i.unitPrice + customizationSurcharge(i.customization),
          quantity: i.quantity,
          image: i.image,
          customization: i.customization,
        })),
        country,
        method,
        promoCode: promo?.ok ? promo.code : undefined,
      }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error ?? "Checkout is not configured. Add Stripe keys to .env.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">{t("title")}</h1>
        <p className="mt-3 text-navy/60">{t("empty")}</p>
        <Link href="/catalog" className="btn-primary mt-6">
          {t("continue")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-extrabold">{t("title")}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.lineId}
              className="flex gap-4 rounded-xl bg-white p-4 shadow-soft ring-1 ring-navy/5"
            >
              <div className="relative h-28 w-24 flex-none overflow-hidden rounded-lg bg-cream">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/product/${item.slug}`} className="text-sm font-semibold hover:text-red">
                  {item.name}
                </Link>
                <p className="text-xs text-navy/50">
                  Size {item.size} · {item.color}
                </p>
                {item.customization && (
                  <p className="mt-1 text-xs text-gold">
                    ✦ {item.customization.name} {item.customization.number}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-navy/15">
                    <button
                      onClick={() => updateQty(item.lineId, item.quantity - 1)}
                      className="p-2"
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.lineId, item.quantity + 1)}
                      className="p-2"
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Price cents={lineTotal(item)} />
                    <button
                      onClick={() => removeItem(item.lineId)}
                      className="text-navy/40 hover:text-red"
                      aria-label={t("remove")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
          {/* Shipping estimate */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Truck size={16} /> {t("shipping")}
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
            >
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="mt-2 flex gap-2">
              {(["STANDARD", "EXPRESS"] as ShippingMethodId[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold ${
                    method === m ? "border-red bg-red/5 text-red" : "border-navy/15"
                  }`}
                >
                  {m === "STANDARD" ? "Standard" : "Express"}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-navy/50">
              {shipping.zoneLabel} · {shipping.etaDays[0]}–{shipping.etaDays[1]} business days
            </p>
          </div>

          {/* Promo */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder={t("promoCode")}
                className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm uppercase"
              />
              <button onClick={applyPromo} disabled={promoLoading} className="btn-outline px-4 py-2 text-xs">
                {promoLoading ? "…" : t("apply")}
              </button>
            </div>
            {promo && (
              <p className={`mt-1 text-xs ${promo.ok ? "text-green-600" : "text-red"}`}>
                {promo.message}
              </p>
            )}
            <p className="mt-1 text-[11px] text-navy/40">Try: WELCOME10 · WORLDCUP26</p>
          </div>

          {/* Totals */}
          <dl className="space-y-2 border-t border-navy/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-navy/60">{t("subtotal")}</dt>
              <dd><Price cents={subtotal} /></dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <dt>Discount</dt>
                <dd>– <Price cents={discount} /></dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-navy/60">{t("shipping")}</dt>
              <dd>{shipping.free ? t("free") : <Price cents={shipping.cost} />}</dd>
            </div>
            {tax > 0 && (
              <div className="flex justify-between">
                <dt className="text-navy/60">{t("tax")}</dt>
                <dd><Price cents={tax} /></dd>
              </div>
            )}
            <div className="flex justify-between border-t border-navy/10 pt-3 text-base font-bold">
              <dt>{t("total")}</dt>
              <dd><Price cents={total} /></dd>
            </div>
          </dl>

          <button onClick={checkout} className="btn-primary mt-5 w-full">
            {t("checkout")}
          </button>
          <Link href="/catalog" className="mt-3 block text-center text-xs text-navy/50 hover:text-red">
            {t("continue")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
