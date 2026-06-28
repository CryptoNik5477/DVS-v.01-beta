"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", company: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("ok");
      setForm({ name: "", email: "", subject: "", message: "", company: "" });
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      setStatus("error");
    }
  }

  const input = "w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-red";

  if (status === "ok") {
    return (
      <div className="rounded-xl bg-green-50 p-5 text-sm text-green-700 ring-1 ring-green-200">
        ✅ Thanks for reaching out! We&apos;ll get back to you within one business day.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
      <h2 className="font-display text-lg font-extrabold">Send us a message</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Your name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
        <input type="email" required placeholder="Your email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
      </div>
      <input placeholder="Subject (optional)" value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })} className={input} />
      <textarea required rows={5} placeholder="How can we help?" value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })} className={input} />
      {/* Honeypot (hidden from humans) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        className="hidden"
        aria-hidden="true"
      />
      {error && <p className="text-sm text-red">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary">
        <Send size={16} /> {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
