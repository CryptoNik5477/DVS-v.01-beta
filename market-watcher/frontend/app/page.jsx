"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

function ScoreBadge({ score }) {
  const cls =
    score > 0.5
      ? "bg-emerald-500/20 text-emerald-300"
      : score < -0.5
      ? "bg-red-500/20 text-red-300"
      : "bg-slate-600/30 text-slate-300";
  const label = score > 0 ? `+${score}` : `${score}`;
  return <span className={`rounded px-2 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
}

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = () => api("/assets").then(setAssets).catch((e) => setErr(e.message));
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  if (err) return <p className="text-red-400">Erreur API: {err}</p>;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold">Actifs surveillés</h1>
      <p className="mb-4 text-sm text-slate-400">
        Prix temps réel + score de pression haussière/baissière (fenêtre 24h).
      </p>
      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-slate-400">
            <tr>
              <th className="px-4 py-2">Actif</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2 text-right">Prix</th>
              <th className="px-4 py-2 text-right">24h</th>
              <th className="px-4 py-2 text-right">Pression</th>
              <th className="px-4 py-2 text-right">Signaux</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.symbol} className="border-t border-slate-800 hover:bg-slate-900/50">
                <td className="px-4 py-2 font-medium">
                  <Link href={`/assets/${a.symbol}`} className="text-emerald-400 hover:underline">
                    {a.symbol}
                  </Link>
                  <span className="ml-2 text-slate-500">{a.name}</span>
                </td>
                <td className="px-4 py-2 text-slate-400">{a.kind}</td>
                <td className="px-4 py-2 text-right">
                  {a.price != null ? a.price.toLocaleString() : "—"}
                </td>
                <td
                  className={`px-4 py-2 text-right ${
                    (a.change_24h_pct || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {a.change_24h_pct != null ? `${a.change_24h_pct.toFixed(2)}%` : "—"}
                </td>
                <td className="px-4 py-2 text-right">
                  <ScoreBadge score={a.score} />
                </td>
                <td className="px-4 py-2 text-right text-slate-400">{a.signal_count}</td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                  Aucun actif (en attente du premier polling)…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
