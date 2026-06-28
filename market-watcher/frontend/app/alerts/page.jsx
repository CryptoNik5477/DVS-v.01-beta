"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api("/alerts").then(setAlerts).catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-red-400">Erreur: {err}</p>;

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Historique des alertes</h1>
      <div className="space-y-3">
        {alerts.map((a) => (
          <div key={a.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{a.asset_symbol}</span>
              <span
                className={
                  a.direction === "bullish" ? "text-emerald-400" : "text-red-400"
                }
              >
                {a.direction}
              </span>
              <span className="text-slate-400">score {a.score}</span>
              <span
                className={`ml-auto text-xs ${
                  a.delivered ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {a.delivered ? "envoyée" : "non envoyée"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-300">{a.summary}</p>
            <div className="mt-1 text-xs text-slate-500">
              {new Date(a.created_at).toLocaleString()}
            </div>
          </div>
        ))}
        {alerts.length === 0 && <p className="text-slate-500">Aucune alerte pour l'instant.</p>}
      </div>
    </div>
  );
}
