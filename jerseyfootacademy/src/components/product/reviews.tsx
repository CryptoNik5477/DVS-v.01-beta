import { getTranslations } from "next-intl/server";
import { Stars } from "@/components/ui/stars";
import { ReviewForm } from "@/components/product/review-form";
import { reviews as demoReviews } from "@/data/reviews";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

interface DisplayReview {
  authorName: string;
  country: string;
  rating: number;
  comment: string;
  date: Date;
  isDemo: boolean;
}

export async function Reviews({ slug }: { slug: string }) {
  const t = await getTranslations("product");

  // Demo (seed) reviews from static data.
  const demo: DisplayReview[] = demoReviews
    .filter((r) => r.productSlug === slug)
    .map((r) => ({
      authorName: r.authorName,
      country: r.country,
      rating: r.rating,
      comment: r.comment,
      date: new Date(Date.now() - r.daysAgo * 86400000),
      isDemo: true,
    }));

  // Approved customer reviews from the database (best-effort).
  let live: DisplayReview[] = [];
  try {
    const rows = await prisma.review.findMany({
      where: { productSlug: slug, approved: true, isDemo: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    live = rows.map((r) => ({
      authorName: r.authorName,
      country: r.country,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt,
      isDemo: false,
    }));
  } catch {
    // DB unavailable — show demo only.
  }

  const all = [...live, ...demo];
  const count = all.length;
  const average = count ? Math.round((all.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : 0;
  const hasDemo = demo.length > 0;

  return (
    <section className="mt-14">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-display text-2xl font-extrabold">{t("reviews")}</h2>
        {count > 0 && <Stars value={average} count={count} size={18} />}
      </div>

      {hasDemo && (
        <p className="mb-5 rounded-lg bg-gold/10 px-3 py-2 text-xs text-navy/70 ring-1 ring-gold/30">
          ⓘ {t("demoReviewsNotice")}
        </p>
      )}

      {count > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {all.map((r, i) => (
            <div key={i} className="rounded-xl bg-white p-4 shadow-soft ring-1 ring-navy/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {r.authorName}
                    {r.isDemo && <span className="badge ml-2 bg-navy/5 text-navy/50">demo</span>}
                  </p>
                  <p className="text-xs text-navy/50">{r.country}</p>
                </div>
                <Stars value={r.rating} />
              </div>
              <p className="mt-2 text-sm text-navy/70">{r.comment}</p>
              <p className="mt-2 text-xs text-navy/40">{formatDate(r.date)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 max-w-xl">
        <ReviewForm productSlug={slug} />
      </div>
    </section>
  );
}
