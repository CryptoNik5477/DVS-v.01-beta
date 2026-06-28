"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/favorites-store";
import { productBySlug } from "@/data/products";
import { ProductGrid } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function FavoritesPage() {
  const slugs = useFavorites((s) => s.slugs);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const products = mounted
    ? slugs.map((s) => productBySlug.get(s)).filter((p): p is NonNullable<typeof p> => Boolean(p))
    : [];

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/account", label: "Account" },
          { href: "/account/favorites", label: "Favorites" },
        ]}
      />
      <h1 className="mt-3 flex items-center gap-2 font-display text-3xl font-extrabold">
        <Heart className="fill-red text-red" /> Favorites
      </h1>

      <div className="mt-8">
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="rounded-xl bg-white p-10 text-center text-navy/60 shadow-soft">
            <p>No favorites yet. Tap the ♥ on any jersey to save it here.</p>
            <Link href="/catalog" className="btn-primary mt-5">
              Browse jerseys
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
