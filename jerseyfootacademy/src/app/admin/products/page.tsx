import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { products } from "@/data/products";
import { categoryBySlug } from "@/data/categories";
import { Price } from "@/components/ui/price";
import { ProductBadges } from "@/components/ui/badges";

export const metadata = { title: "Admin · Products" };

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Products</h1>
          <p className="text-sm text-navy/60">{products.length} products in the catalog.</p>
        </div>
        <div className="flex gap-2">
          {/* API download route, not a page — Link is not appropriate here. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/admin/products/export" className="btn-outline text-sm" download>
            <Download size={16} /> Export CSV
          </a>
          <Link href="/admin/products/new" className="btn-primary text-sm">
            <Plus size={16} /> New product
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs uppercase text-navy/50">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Badges</th>
              <th className="px-4 py-3 text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {products.map((p) => (
              <tr key={p.slug}>
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/product/${p.slug}`} className="hover:text-red">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-navy/60">
                  {categoryBySlug.get(p.categorySlug)?.name ?? p.categorySlug}
                </td>
                <td className="px-4 py-3">
                  <ProductBadges product={p} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Price cents={p.salePrice ?? p.basePrice} original={p.salePrice ? p.basePrice : undefined} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-navy/40">
        This list reflects the seed catalog (<code>src/data/products.ts</code>). Full create/edit/delete
        writes to the <code>Product</code> table — wire the form at <code>/admin/products/new</code> to a
        server action once your database is connected.
      </p>
    </div>
  );
}
