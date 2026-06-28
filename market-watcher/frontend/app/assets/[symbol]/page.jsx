"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function AssetDetail() {
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api(`/assets/${symbol}`).then(setData).catch((e) => setErr(e.message));
  }, [symbol]);

  if (err) return <p className="text-red-400">Erreur: {err}</p>;
  if (!data) return <p className="text-slate-400">Chargement…</p>;

  const o = data.overview;

  return (
    <div>
      <h1 className="text-xl font-semibold">
        {o.symbol} <span className="text-slate-500">{o.name}</span>
      </h1>
      <div className="mt-3 flex flex-wrap gap-6 text-sm">
        <div>
          <div className="text-slate-400">Prix</div>
          <div className="text-lg">{o.price != null ? o.price.toLocaleString() : "—"}</div>
        </div>
        <div>
          <div className="text-slate-400">Variation 24h</div>
          <div className={(o.change_24h_pct || 0) >= 0 ? "text-emerald-400" : "text-red-400"}>
            {o.change_24h_pct != null ? `${o.change_24h_pct.toFixed(2)}%` : "—"}
          </div>
        </div>
        <div>
          <div className="text-slate-400">Pression (24h)</div>
          <div className="text-lg">{o.score}</div>
        </div>
      </div>

      <h2 className="mb-2 mt-6 text-lg font-semibold">Flux de signaux</h2>
      <div className="space-y-3">
        {data.signals.map((s) => (
          <div key={s.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs">
              <span
                className={`rounded px-2 py-0.5 font-semibold ${
                  s.direction === "bullish"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : s.direction === "bearish"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-slate-600/30 text-slate-300"
                }`}
              >
                {s.direction}
              </span>
              <span className="text-slate-400">
                intensité {s.intensity}/5 · confiance {(s.confidence * 100).toFixed(0)}%
              </span>
              <span className="ml-auto text-slate-500">
                {new Date(s.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm">{s.summary}</p>
            <a
              href={s.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:underline"
            >
              {s.source_title || s.source_url} ↗
            </a>
          </div>
        ))}
        {data.signals.length === 0 && (
          <p className="text-slate-500">Aucun signal pour cet actif pour l'instant.</p>
        )}
      </div>
    </div>
  );
}
