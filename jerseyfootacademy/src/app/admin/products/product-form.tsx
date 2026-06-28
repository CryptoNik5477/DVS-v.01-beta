"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { upsertProduct, type ActionState } from "./actions";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export interface ProductFormInitial {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  basePrice?: number; // dollars
  salePrice?: number | null;
  competition?: string | null;
  season?: string | null;
  year?: number | null;
  images?: string[];
  stock?: Partial<Record<(typeof SIZES)[number], number>>;
  flags?: Partial<Record<"isNew" | "isOnSale" | "isWorldCup" | "isBestSeller" | "isFeatured" | "customizable", boolean>>;
}

const input = "w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-red";

export function ProductForm({
  categories,
  initial,
}: {
  categories: { id: string; name: string }[];
  initial?: ProductFormInitial;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionState, FormData>(upsertProduct, {});

  useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => router.push("/admin/products"), 800);
      return () => clearTimeout(t);
    }
  }, [state.ok, router]);

  return (
    <form action={action} className="space-y-5">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Name
          <input name="name" required defaultValue={initial?.name} className={input} />
        </label>
        <label className="text-sm font-medium">
          Slug
          <input name="slug" required defaultValue={initial?.slug} placeholder="real-madrid-home-2526" className={input} />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Description
        <textarea name="description" required rows={4} defaultValue={initial?.description} className={input} />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium">
          Category
          <select name="categoryId" required defaultValue={initial?.categoryId ?? ""} className={input}>
            <option value="" disabled>Choose…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Base price (USD)
          <input name="basePrice" type="number" step="0.01" required defaultValue={initial?.basePrice} className={input} />
        </label>
        <label className="text-sm font-medium">
          Sale price (USD, optional)
          <input name="salePrice" type="number" step="0.01" defaultValue={initial?.salePrice ?? undefined} className={input} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium">
          Competition
          <input name="competition" defaultValue={initial?.competition ?? undefined} className={input} />
        </label>
        <label className="text-sm font-medium">
          Season
          <input name="season" defaultValue={initial?.season ?? undefined} placeholder="2025/26" className={input} />
        </label>
        <label className="text-sm font-medium">
          Year
          <input name="year" type="number" defaultValue={initial?.year ?? undefined} className={input} />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Image URLs (one per line)
        <textarea name="images" rows={3} defaultValue={initial?.images?.join("\n")} placeholder="https://…" className={input} />
      </label>

      <div>
        <p className="mb-2 text-sm font-medium">Stock per size</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SIZES.map((s) => (
            <label key={s} className="text-xs font-medium">
              {s}
              <input
                name={`stock_${s}`}
                type="number"
                min={0}
                defaultValue={initial?.stock?.[s] ?? 0}
                className={input}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {(["isNew", "isOnSale", "isWorldCup", "isBestSeller", "isFeatured", "customizable"] as const).map((flag) => (
          <label key={flag} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={flag}
              value="true"
              defaultChecked={initial?.flags?.[flag] ?? (flag === "customizable")}
              className="accent-red"
            />
            {flag}
          </label>
        ))}
      </div>

      {state.error && <p className="text-sm font-medium text-red">{state.error}</p>}
      {state.ok && <p className="text-sm font-medium text-green-600">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Saving…" : initial?.id ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
