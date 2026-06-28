import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getContentPage, contentPageKeys } from "@/data/content";

/**
 * Localised content pages (about, contact, privacy, terms).
 * Copy lives in src/data/content.ts for all supported locales.
 */
export function generateStaticParams() {
  return contentPageKeys.map((page) => ({ page }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const locale = await getLocale();
  const data = getContentPage(locale, page);
  return { title: data?.title ?? "Not found" };
}

export default async function ContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const locale = await getLocale();
  const data = getContentPage(locale, page);
  if (!data) notFound();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: `/${page}`, label: data.title }]} />
      <h1 className="mt-3 font-display text-3xl font-extrabold">{data.title}</h1>
      <div className="mt-4 max-w-2xl space-y-4 text-navy/70">
        {data.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
