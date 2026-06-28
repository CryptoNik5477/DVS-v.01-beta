"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { countryOptions } from "@/config/countries";

export function ReviewForm({ productSlug }: { productSlug: string }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ authorName: "", country: "TH", comment: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating, productSlug }),
    });
    if (res.ok) {
      setStatus("ok");
      setForm({ authorName: "", country: "TH", comment: "" });
      setRating(5);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      setStatus("error");
    }
  }

  const input = "w-full rounded-lg border border-navy/15 px-3 py-2 text-sm outline-none focus:border-red";

  if (status === "ok") {
    return (
      <div className="rounded-xl bg-green-50 p-5 text-sm text-green-700 ring-1 ring-green-200">
        🎉 Thanks for your review! It will appear once approved by our team.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5">
      <h3 className="mb-3 font-display text-lg font-extrabold">Write a review</h3>

      <div className="mb-3 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${i + 1} stars`}
          >
            <Star
              size={24}
              className={(hover || rating) > i ? "fill-gold text-gold" : "text-navy/20"}
            />
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          placeholder="Your name"
          value={form.authorName}
          onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          className={input}
        />
        <select
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className={input}
        >
          {countryOptions.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>
      <textarea
        required
        rows={4}
        placeholder="Share your thoughts about this jersey…"
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        className={`${input} mt-3`}
      />

      {error && <p className="mt-2 text-sm text-red">{error}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary mt-4">
        {status === "loading" ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
