import { getTranslations } from "next-intl/server";

// Chest / length in cm — representative jersey sizing.
const ROWS: [string, string, string][] = [
  ["XS", "88–92", "66"],
  ["S", "92–98", "68"],
  ["M", "98–104", "70"],
  ["L", "104–110", "72"],
  ["XL", "110–118", "74"],
  ["XXL", "118–126", "76"],
];

export async function SizeGuide() {
  const t = await getTranslations("product");
  return (
    <section id="size-guide" className="mt-14 scroll-mt-24">
      <h2 className="mb-4 font-display text-2xl font-extrabold">{t("sizeGuide")}</h2>
      <div className="overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
        <table className="w-full text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Chest (cm)</th>
              <th className="px-4 py-3 text-left">Length (cm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {ROWS.map((r) => (
              <tr key={r[0]}>
                <td className="px-4 py-2.5 font-semibold">{r[0]}</td>
                <td className="px-4 py-2.5">{r[1]}</td>
                <td className="px-4 py-2.5">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
