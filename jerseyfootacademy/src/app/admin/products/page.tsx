import Link from "next/link";
import { Download, Pencil, Plus, Upload } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { products as seedProducts } from "@/data/products";
import { categoryBySlug } from "@/data/categories";
import { Price } from "@/components/ui/price";
import { DeleteProductButton } from "./delete-product-button";

export const metadata = { title: "Admin · Products" };

export default async function AdminProductsPage() {
  // Prefer live DB products; fall back to the seed catalog (read-only) when empty.
  let dbProducts: { id: string; name: string; slug: string; basePrice: number; salePrice: number | null; category: { name: string } }[] = [];
  let dbAvailable = true;
  try {
    dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, slug: true, basePrice: true, salePrice: true, category: { select: { name: true } } },
    });
  } catch {
    dbAvailable = false;
  }

  const usingDb = dbAvailable && dbProducts.length > 0;
  const count = usingDb ? dbProducts.length : seedProducts.length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Products</h1>
          <p className="text-sm text-navy/60">
            {count} products {usingDb ? "(live database)" : "(seed catalog — read-only)"}.
          </p>
        </div>
        <div className="flex gap-2">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/admin/products/export" className="btn-outline text-sm" download>
            <Download size={16} /> Export CSV
          </a>
          <Link href="/admin/products/import" className="btn-outline text-sm">
            <Upload size={16} /> Import CSV
          </Link>
          <Link href="/admin/products/new" className="btn-primary text-sm">
            <Plus size={16} /> New product
          </Link>
        </div>
      </div>

      {!usingDb && (
        <p className="mt-4 rounded-lg bg-gold/10 px-3 py-2 text-xs text-navy/70 ring-1 ring-gold/30">
          ⓘ No products in the database yet. Showing the seed catalog. Run <code>npm run db:seed</code>{" "}
          (or create one below) to manage live products with edit/delete.
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs uppercase text-navy/50">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {usingDb
              ? dbProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-semibold">
                      <Link href={`/product/${p.slug}`} className="hover:text-red">{p.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-navy/60">{p.category.name}</td>
                    <td className="px-4 py-3 text-right">
                      <Price cents={p.salePrice ?? p.basePrice} original={p.salePrice ? p.basePrice : undefined} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/products/${p.id}/edit`} className="text-navy/40 hover:text-red" aria-label="Edit">
                          <Pencil size={16} />
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))
              : seedProducts.map((p) => (
                  <tr key={p.slug}>
                    <td className="px-4 py-3 font-semibold">
                      <Link href={`/product/${p.slug}`} className="hover:text-red">{p.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-navy/60">
                      {categoryBySlug.get(p.categorySlug)?.name ?? p.categorySlug}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Price cents={p.salePrice ?? p.basePrice} original={p.salePrice ? p.basePrice : undefined} />
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-navy/30">seed</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
