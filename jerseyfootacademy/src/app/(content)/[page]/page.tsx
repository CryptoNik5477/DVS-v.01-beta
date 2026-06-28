import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { siteConfig } from "@/config/site";

/**
 * Simple content pages (about, contact, privacy, terms). Replace the copy with
 * your finalised legal/marketing text before launch.
 */
const PAGES: Record<string, { title: string; body: string[] }> = {
  about: {
    title: "About JerseyFootAcademy",
    body: [
      "JerseyFootAcademy is a premium football jersey store bringing authentic-quality kits from the world's greatest clubs and national teams to fans everywhere.",
      "We ship worldwide from Thailand and offer custom flocking so you can wear your name and number with pride.",
      "Support Your Team. Wear The Passion.",
    ],
  },
  contact: {
    title: "Contact Us",
    body: [
      `Email: ${siteConfig.contact.email}`,
      `Phone: ${siteConfig.contact.phone}`,
      `Location: ${siteConfig.contact.address}`,
      "Our support team typically replies within one business day.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We respect your privacy. We collect only the data necessary to process your orders and improve your experience.",
      "Payment information is handled securely by Stripe and never stored on our servers.",
      "This is placeholder text — replace with your reviewed privacy policy before going live.",
    ],
  },
  terms: {
    title: "Terms of Service",
    body: [
      "By using JerseyFootAcademy you agree to our terms of sale, shipping and returns.",
      "Personalised (flocked) items are final sale unless faulty.",
      "This is placeholder text — replace with your reviewed terms before going live.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((page) => ({ page }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const data = PAGES[page];
  return { title: data?.title ?? "Not found" };
}

export default async function ContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const data = PAGES[page];
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
