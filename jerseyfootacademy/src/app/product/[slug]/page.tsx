import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ImageGallery } from "@/components/product/image-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { Reviews } from "@/components/product/reviews";
import { SizeGuide } from "@/components/product/size-guide";
import { ProductBadges } from "@/components/ui/badges";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { products, productBySlug } from "@/data/products";
import { categoryBySlug, ancestorsOf } from "@/data/categories";
import { ratingFor } from "@/data/reviews";
import { siteConfig } from "@/config/site";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.slice(0, 1),
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) notFound();

  const club = categoryBySlug.get(product.categorySlug);
  const rating = ratingFor(slug);
  const price = (product.salePrice ?? product.basePrice) / 100;

  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    ...(club ? ancestorsOf(club.slug).map((n) => ({ href: `/catalog/${n.slug}`, label: n.name })) : []),
  ];

  // Schema.org Product structured data for rich SEO results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: price.toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/product/${product.slug}`,
    },
    ...(rating.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.average,
        reviewCount: rating.count,
      },
    }),
  };

  return (
    <div className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs items={crumbs} />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} alt={product.name} />

        <div>
          {club && (
            <Link
              href={`/catalog/${club.slug}`}
              className="text-sm font-semibold uppercase tracking-wide text-gold hover:underline"
            >
              {club.name}
            </Link>
          )}
          <h1 className="mt-1 font-display text-3xl font-extrabold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <ProductBadges product={product} />
            {product.competition && (
              <span className="text-xs text-navy/50">{product.competition}</span>
            )}
          </div>

          <div className="mt-6">
            <PurchasePanel product={product} />
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mt-14 max-w-3xl">
        <h2 className="mb-3 font-display text-2xl font-extrabold">Description</h2>
        <p className="text-navy/70">{product.description}</p>
        <ul className="mt-4 grid gap-2 text-sm text-navy/70 sm:grid-cols-2">
          {product.season && <li>📅 Season: {product.season}</li>}
          {product.competition && <li>🏆 Competition: {product.competition}</li>}
          <li>🧵 Premium AeroDry fabric</li>
          <li>✈️ Ships worldwide from Thailand</li>
        </ul>
      </section>

      <SizeGuide />
      <Reviews slug={slug} />
    </div>
  );
}
