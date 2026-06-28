"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-800 py-2 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api("/settings").then(setS).catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-red-400">Erreur: {err}</p>;
  if (!s) return <p className="text-slate-400">Chargement…</p>;

  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-xl font-semibold">Réglages</h1>
      <p className="mb-4 text-sm text-slate-400">
        Lecture seule (Phase 1). Ces valeurs proviennent des variables
        d'environnement du backend.
      </p>
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-4">
        <Row label="Modèle LLM par défaut" value={s.default_llm_model} />
        <Row label="Intervalle agent News" value={`${s.news_agent_interval_seconds}s`} />
        <Row label="Intervalle polling marché" value={`${s.market_poll_seconds}s`} />
        <Row label="Intensité min. alerte" value={`${s.alert_min_intensity}/5`} />
        <Row label="Confiance min. alerte" value={s.alert_min_confidence} />
        <Row label="Anti-spam (cooldown)" value={`${s.alert_cooldown_minutes} min`} />
        <Row label="Budget mensuel" value={`$${s.monthly_budget_usd}`} />
        <Row
          label="Agents"
          value={s.agents_paused ? `en pause (${s.paused_reason || "?"})` : "actifs"}
        />
      </div>
    </div>
  );
}
