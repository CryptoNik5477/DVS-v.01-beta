"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function CostsPage() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api("/costs").then(setData).catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-red-400">Erreur: {err}</p>;
  if (!data) return <p className="text-slate-400">Chargement…</p>;

  const pct = Math.min(100, data.budget_used_pct);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Coûts LLM</h1>

      <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-400">Mois en cours</span>
          <span className="text-lg font-semibold">
            ${data.month_to_date_usd.toFixed(2)}{" "}
            <span className="text-sm text-slate-400">
              / ${data.monthly_budget_usd.toFixed(2)}
            </span>
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded bg-slate-800">
          <div
            className={`h-full ${pct >= 100 ? "bg-red-500" : "bg-emerald-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 text-right text-xs text-slate-500">{data.budget_used_pct}% du budget</div>
      </div>

      <h2 className="mb-2 text-lg font-semibold">Détail par agent / jour</h2>
      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-slate-400">
            <tr>
              <th className="px-4 py-2">Jour</th>
              <th className="px-4 py-2">Agent</th>
              <th className="px-4 py-2 text-right">Tokens in</th>
              <th className="px-4 py-2 text-right">Tokens out</th>
              <th className="px-4 py-2 text-right">Coût</th>
            </tr>
          </thead>
          <tbody>
            {data.by_agent_day.map((r, i) => (
              <tr key={i} className="border-t border-slate-800">
                <td className="px-4 py-2">{r.day}</td>
                <td className="px-4 py-2">{r.agent}</td>
                <td className="px-4 py-2 text-right">{r.input_tokens.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{r.output_tokens.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">${r.cost_usd.toFixed(4)}</td>
              </tr>
            ))}
            {data.by_agent_day.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                  Pas encore de consommation LLM.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
