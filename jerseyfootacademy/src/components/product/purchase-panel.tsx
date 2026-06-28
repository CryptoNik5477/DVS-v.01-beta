"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ShoppingBag } from "lucide-react";
import { JerseyPreview } from "./jersey-preview";
import { Price } from "@/components/ui/price";
import { useCart } from "@/lib/cart-store";
import {
  CUSTOMIZATION_SURCHARGE,
  flockingColors,
  flockingFonts,
  type Customization,
} from "@/config/customization";
import type { ProductSeed, Size } from "@/data/types";

const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

export function PurchasePanel({ product }: { product: ProductSeed }) {
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const addItem = useCart((s) => s.addItem);

  const [size, setSize] = useState<Size | null>(null);
  const [personalise, setPersonalise] = useState(false);
  const [custom, setCustom] = useState<Customization>({ font: "official", color: "white" });
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = product.salePrice ?? product.basePrice;
  const hasCustomContent = Boolean(custom.name?.trim()) || Boolean(custom.number?.trim());
  const surcharge = personalise && hasCustomContent ? CUSTOMIZATION_SURCHARGE : 0;

  function add() {
    if (!size) {
      setError(t("selectSize"));
      return;
    }
    setError(null);
    addItem({
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      size,
      color: product.colors?.[0] ?? "Home",
      unitPrice: price,
      customization: personalise && hasCustomContent ? custom : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl">
        <Price cents={price} original={product.salePrice ? product.basePrice : undefined} />
        {surcharge > 0 && (
          <span className="ml-2 align-middle text-sm font-normal text-navy/50">
            + <Price cents={surcharge} /> flocking
          </span>
        )}
      </div>

      {/* Size selector */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">{t("selectSize")}</span>
          <a href="#size-guide" className="text-xs text-red hover:underline">
            {t("sizeGuide")}
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => {
            const stock = product.stock[s] ?? 0;
            const disabled = stock <= 0;
            return (
              <button
                key={s}
                disabled={disabled}
                onClick={() => setSize(s)}
                className={`h-11 w-14 rounded-lg border text-sm font-semibold transition ${
                  size === s
                    ? "border-red bg-red text-white"
                    : "border-navy/15 bg-white hover:border-navy/40"
                } ${disabled ? "cursor-not-allowed opacity-40 line-through" : ""}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customizer (enabled unless explicitly disabled) */}
      {product.customizable !== false && (
        <div className="rounded-xl border border-navy/10 bg-white p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={personalise}
              onChange={(e) => setPersonalise(e.target.checked)}
              className="h-4 w-4 accent-red"
            />
            {t("customize")} (+<Price cents={CUSTOMIZATION_SURCHARGE} />)
          </label>

          {personalise && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium">
                  {t("addName")}
                  <input
                    maxLength={12}
                    value={custom.name ?? ""}
                    onChange={(e) => setCustom((c) => ({ ...c, name: e.target.value }))}
                    placeholder="MESSI"
                    className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm uppercase outline-none focus:border-red"
                  />
                </label>
                <label className="text-xs font-medium">
                  {t("addNumber")}
                  <input
                    maxLength={2}
                    inputMode="numeric"
                    value={custom.number ?? ""}
                    onChange={(e) =>
                      setCustom((c) => ({ ...c, number: e.target.value.replace(/\D/g, "") }))
                    }
                    placeholder="10"
                    className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-red"
                  />
                </label>
                <label className="text-xs font-medium">
                  {t("font")}
                  <select
                    value={custom.font}
                    onChange={(e) =>
                      setCustom((c) => ({ ...c, font: e.target.value as Customization["font"] }))
                    }
                    className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-red"
                  >
                    {flockingFonts.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="text-xs font-medium">
                  {t("color")}
                  <div className="mt-1 flex gap-2">
                    {flockingColors.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => setCustom((c) => ({ ...c, color: col.id }))}
                        aria-label={col.label}
                        className={`h-7 w-7 rounded-full ring-2 transition ${
                          custom.color === col.id ? "ring-red" : "ring-navy/10"
                        }`}
                        style={{ backgroundColor: col.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg bg-cream p-3">
                <span className="mb-1 text-[11px] uppercase tracking-wide text-navy/40">
                  {t("preview")}
                </span>
                <div className="h-44 w-40">
                  <JerseyPreview customization={custom} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm font-medium text-red">{error}</p>}

      <button onClick={add} className="btn-primary w-full text-base">
        {added ? (
          <>
            <Check size={18} /> Added!
          </>
        ) : (
          <>
            <ShoppingBag size={18} /> {tc("addToCart")}
          </>
        )}
      </button>
    </div>
  );
}
