import Link from "next/link";
import { notFound } from "next/navigation";
import type { Size } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductForm, type ProductFormInitial } from "../../product-form";

export const metadata = { title: "Admin · Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product: Awaited<ReturnType<typeof prisma.product.findUnique>> & {
    images?: { url: string }[];
    variants?: { size: Size; stock: number }[];
  } | null = null;
  let categories: { id: string; name: string }[] = [];

  try {
    [product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: { position: "asc" } }, variants: true },
      }),
      prisma.category.findMany({
        where: { type: { in: ["CLUB", "NATIONAL"] } },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);
  } catch {
    // DB unavailable
  }

  if (!product) notFound();

  const stock: ProductFormInitial["stock"] = {};
  for (const v of product.variants ?? []) stock[v.size] = v.stock;

  const initial: ProductFormInitial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.categoryId,
    basePrice: product.basePrice / 100,
    salePrice: product.salePrice != null ? product.salePrice / 100 : null,
    competition: product.competition,
    season: product.season,
    year: product.year,
    images: (product.images ?? []).map((i) => i.url),
    stock,
    flags: {
      isNew: product.isNew,
      isOnSale: product.isOnSale,
      isWorldCup: product.isWorldCup,
      isBestSeller: product.isBestSeller,
      isFeatured: product.isFeatured,
      customizable: product.customizable,
    },
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Edit Product</h1>
      <p className="mb-6 text-sm text-navy/60">{product.name}</p>
      <div className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-navy/5">
        <ProductForm categories={categories} initial={initial} />
      </div>
      <Link href="/admin/products" className="btn-outline mt-4 text-sm">Back to products</Link>
    </div>
  );
}
