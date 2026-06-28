"use client";

import { useActionState, useState } from "react";
import { importProductsCsv, type ActionState } from "../actions";

const SAMPLE = `slug,name,categorySlug,basePrice,salePrice,description,competition,season,year,image
real-madrid-away-2526,Real Madrid Away 2025/26,real-madrid,105.00,,Sleek away kit,La Liga,2025/26,2025,https://example.com/img.jpg`;

export function ImportForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(importProductsCsv, {});
  const [csv, setCsv] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setCsv(await file.text());
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Upload a .csv file</label>
        <input type="file" accept=".csv,text/csv" onChange={onFile} className="mt-1 block text-sm" />
      </div>

      <div>
        <label className="text-sm font-medium">…or paste CSV content</label>
        <textarea
          name="csv"
          rows={10}
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder={SAMPLE}
          className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 font-mono text-xs outline-none focus:border-red"
        />
      </div>

      <p className="text-xs text-navy/50">
        Required columns: <code>slug, name, categorySlug, basePrice</code>. Optional:{" "}
        <code>salePrice, description, competition, season, year, image</code>. Existing slugs are
        updated; prices are in USD. <code>categorySlug</code> must match an existing club/national slug.
      </p>

      {state.error && <p className="text-sm font-medium text-red">{state.error}</p>}
      {state.ok && <p className="text-sm font-medium text-green-600">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Importing…" : "Import products"}
      </button>
    </form>
  );
}
