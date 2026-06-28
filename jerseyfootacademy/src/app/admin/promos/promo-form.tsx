"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { upsertPromo, type ActionState } from "./actions";

const input = "w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-red";

export function PromoForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionState, FormData>(upsertPromo, {});

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={action} className="space-y-3 rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5">
      <h2 className="font-display text-lg font-extrabold">New promo code</h2>

      <label className="block text-sm font-medium">
        Code
        <input name="code" required placeholder="SUMMER20" className={`${input} uppercase`} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-medium">
          Type
          <select name="type" className={input} defaultValue="PERCENT">
            <option value="PERCENT">Percent (%)</option>
            <option value="FIXED">Fixed (USD)</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Value
          <input name="value" type="number" step="0.01" required placeholder="10" className={input} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-medium">
          Min order (USD)
          <input name="minOrder" type="number" step="0.01" placeholder="optional" className={input} />
        </label>
        <label className="text-sm font-medium">
          Usage limit
          <input name="usageLimit" type="number" placeholder="optional" className={input} />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Expires at
        <input name="expiresAt" type="date" className={input} />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" value="true" defaultChecked className="accent-red" />
        Active
      </label>

      {state.error && <p className="text-sm font-medium text-red">{state.error}</p>}
      {state.ok && <p className="text-sm font-medium text-green-600">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Saving…" : "Create promo"}
      </button>
    </form>
  );
}
