import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { products } from "@/data/products";
import { categoryBySlug } from "@/data/categories";

/** CSV export of the product catalog (admin only). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const headers = ["slug", "name", "category", "basePrice", "salePrice", "competition", "year"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  const rows = products.map((p) =>
    [
      p.slug,
      p.name,
      categoryBySlug.get(p.categorySlug)?.name ?? p.categorySlug,
      (p.basePrice / 100).toFixed(2),
      p.salePrice ? (p.salePrice / 100).toFixed(2) : "",
      p.competition ?? "",
      p.year ?? "",
    ]
      .map(escape)
      .join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="products.csv"',
    },
  });
}
