import Image from "next/image";
import Link from "next/link";
import type { ProductSeed } from "@/data/types";
import { ProductBadges } from "@/components/ui/badges";
import { Price } from "@/components/ui/price";
import { Stars } from "@/components/ui/stars";
import { ratingFor } from "@/data/reviews";
import { categoryBySlug } from "@/data/categories";

export function ProductCard({ product }: { product: ProductSeed }) {
  const rating = ratingFor(product.slug);
  const club = categoryBySlug.get(product.categorySlug);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <ProductBadges product={product} className="absolute left-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {club && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gold">
            {club.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-navy">{product.name}</h3>
        {rating.count > 0 && <Stars value={rating.average} count={rating.count} />}
        <div className="mt-auto pt-2">
          <Price
            cents={product.salePrice ?? product.basePrice}
            original={product.salePrice ? product.basePrice : undefined}
          />
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: ProductSeed[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
