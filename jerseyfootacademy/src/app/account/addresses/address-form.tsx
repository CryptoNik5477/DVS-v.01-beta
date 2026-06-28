"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { countryOptions } from "@/config/countries";

const EMPTY = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "TH",
  phone: "",
  isDefault: false,
};

export function AddressForm() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save address.");
      return;
    }
    setForm(EMPTY);
    router.refresh();
  }

  const input =
    "w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-red";

  return (
    <form onSubmit={onSubmit} className="rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5">
      <h2 className="mb-4 font-display text-lg font-extrabold">Add an address</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={input} placeholder="Full name" required value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className={input} placeholder="Phone (optional)" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className={`${input} sm:col-span-2`} placeholder="Address line 1" required value={form.line1}
          onChange={(e) => setForm({ ...form, line1: e.target.value })} />
        <input className={`${input} sm:col-span-2`} placeholder="Address line 2 (optional)" value={form.line2}
          onChange={(e) => setForm({ ...form, line2: e.target.value })} />
        <input className={input} placeholder="City" required value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input className={input} placeholder="State / Province (optional)" value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <input className={input} placeholder="Postal code" required value={form.postalCode}
          onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
        <select className={input} value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}>
          {countryOptions.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input type="checkbox" className="accent-red" checked={form.isDefault}
          onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
        Set as default address
      </label>
      {error && <p className="mt-2 text-sm text-red">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary mt-4">
        {loading ? "Saving…" : "Save address"}
      </button>
    </form>
  );
}
