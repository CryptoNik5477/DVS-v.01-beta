"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/account");
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-soft ring-1 ring-navy/5">
        <h1 className="font-display text-2xl font-extrabold">Create account</h1>
        <p className="mt-1 text-sm text-navy/60">Join the Academy and track your orders.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-red"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-red"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password (min. 8 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-red"
          />
          {error && <p className="text-sm text-red">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-navy/60">
          Already have an account?{" "}
          <Link href="/account/login" className="font-semibold text-red hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
