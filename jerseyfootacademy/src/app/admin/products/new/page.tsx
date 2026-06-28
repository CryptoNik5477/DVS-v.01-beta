import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export const metadata = { title: "Admin · New Product" };

export default async function AdminNewProductPage() {
  let categories: { id: string; name: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { type: { in: ["CLUB", "NATIONAL"] } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  } catch {
    // DB unavailable
  }

  if (categories.length === 0) {
    return (
      <div>
        <h1 className="font-display text-3xl font-extrabold">New Product</h1>
        <p className="mt-4 rounded-xl bg-white p-6 text-sm text-navy/70 shadow-soft">
          No categories found in the database. Run <code>npm run db:seed</code> first so products can
          be attached to a club or national team, then come back here.
        </p>
        <Link href="/admin/products" className="btn-outline mt-4 text-sm">Back to products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">New Product</h1>
      <p className="mb-6 text-sm text-navy/60">Create a product in the live catalog.</p>
      <div className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
