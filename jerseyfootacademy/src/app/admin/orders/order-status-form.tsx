"use client";

import { useActionState } from "react";
import { updateOrder, type ActionState } from "./actions";

const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function OrderStatusForm({
  id,
  status,
  trackingNumber,
}: {
  id: string;
  status: string;
  trackingNumber: string | null;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateOrder, {});
  const input = "w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-red";

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5">
      <h2 className="font-display text-lg font-extrabold">Fulfillment</h2>
      <input type="hidden" name="id" value={id} />

      <label className="block text-sm font-medium">
        Status
        <select name="status" defaultValue={status} className={input}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        Tracking number
        <input name="trackingNumber" defaultValue={trackingNumber ?? ""} placeholder="e.g. EE123456789TH" className={input} />
      </label>

      {state.error && <p className="text-sm font-medium text-red">{state.error}</p>}
      {state.ok && <p className="text-sm font-medium text-green-600">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Saving…" : "Update order"}
      </button>
    </form>
  );
}
