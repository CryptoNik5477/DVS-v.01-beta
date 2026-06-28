"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";

export function NewsletterForm({ variant = "section" }: { variant?: "section" | "footer" }) {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  }

  const dark = variant === "footer";

  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-md flex-col gap-2">
      {variant === "footer" && (
        <p className="text-center text-sm font-semibold text-white">{t("newsletterTitle")}</p>
      )}
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`flex-1 rounded-full px-4 py-3 text-sm outline-none ring-1 transition focus:ring-2 ${
            dark
              ? "bg-white/10 text-white ring-white/20 placeholder:text-white/40 focus:ring-gold"
              : "bg-white text-navy ring-navy/10 focus:ring-red"
          }`}
        />
        <button type="submit" disabled={status === "loading"} className="btn-gold whitespace-nowrap">
          <Send size={16} /> {t("newsletterCta")}
        </button>
      </div>
      {status === "ok" && (
        <p className="text-center text-xs text-gold">🎉 Thanks for subscribing!</p>
      )}
      {status === "error" && (
        <p className="text-center text-xs text-red-light">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
