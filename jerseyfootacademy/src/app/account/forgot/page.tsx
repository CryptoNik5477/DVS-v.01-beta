"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-soft ring-1 ring-navy/5">
        <h1 className="font-display text-2xl font-extrabold">Reset password</h1>
        {sent ? (
          <p className="mt-4 text-sm text-navy/70">
            If an account exists for <strong>{email}</strong>, a reset link is on its way.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: wire to a transactional email provider + token in DB.
              setSent(true);
            }}
            className="mt-6 space-y-4"
          >
            <p className="text-sm text-navy/60">
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-red"
            />
            <button type="submit" className="btn-primary w-full">
              Send reset link
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
