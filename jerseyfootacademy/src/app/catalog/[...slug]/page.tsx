import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  categoryBySlug,
  childrenOf,
  ancestorsOf,
} from "@/data/categories";
import { productsInCategory } from "@/data/queries";

interface Params {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const node = categoryBySlug.get(slug[slug.length - 1]);
  if (!node) return { title: "Not found" };
  return {
    title: `${node.name} Jerseys`,
    description: `Shop official ${node.name} football jerseys and kits at JerseyFootAcademy.`,
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const current = slug[slug.length - 1];
  const node = categoryBySlug.get(current);
  if (!node) notFound();

  const subcategories = childrenOf(current);
  const items = productsInCategory(current);

  // Build breadcrumb trail from the category ancestry.
  const trail = ancestorsOf(current);
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    ...trail.map((n) => ({ href: `/catalog/${n.slug}`, label: n.name })),
  ];

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-3 font-display text-3xl font-extrabold">{node.name}</h1>

      {subcategories.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {subcategories.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-soft ring-1 ring-navy/5 transition hover:ring-red"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        {items.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-navy/50">{items.length} products</p>
            <ProductGrid products={items} />
          </>
        ) : (
          <p className="rounded-xl bg-white p-8 text-center text-navy/60 shadow-soft">
            No products here yet — explore the subcategories above.
          </p>
        )}
      </div>
    </div>
  );
}
