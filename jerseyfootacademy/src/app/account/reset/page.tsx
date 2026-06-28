"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/account/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/account/login"), 1500);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not reset password.");
    }
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-soft ring-1 ring-navy/5">
        <h1 className="font-display text-2xl font-extrabold">Set a new password</h1>
        {!token || !email ? (
          <p className="mt-4 text-sm text-red">Invalid reset link. Please request a new one.</p>
        ) : done ? (
          <p className="mt-4 text-sm text-green-600">✓ Password updated! Redirecting to sign in…</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              required
              minLength={8}
              placeholder="New password (min. 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-red"
            />
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-red"
            />
            {error && <p className="text-sm text-red">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Saving…" : "Reset password"}
            </button>
          </form>
        )}
        <Link href="/account/login" className="mt-4 block text-center text-sm text-red hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
