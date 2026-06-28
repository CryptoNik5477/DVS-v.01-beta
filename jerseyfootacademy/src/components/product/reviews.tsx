import { getTranslations } from "next-intl/server";
import { Stars } from "@/components/ui/stars";
import { reviews, ratingFor } from "@/data/reviews";
import { formatDate } from "@/lib/utils";

export async function Reviews({ slug }: { slug: string }) {
  const t = await getTranslations("product");
  const list = reviews
    .filter((r) => r.productSlug === slug)
    .sort((a, b) => a.daysAgo - b.daysAgo);
  const { average, count } = ratingFor(slug);

  if (count === 0) return null;

  return (
    <section className="mt-14">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-display text-2xl font-extrabold">{t("reviews")}</h2>
        <Stars value={average} count={count} size={18} />
      </div>

      {/* Demo-data disclaimer */}
      <p className="mb-5 rounded-lg bg-gold/10 px-3 py-2 text-xs text-navy/70 ring-1 ring-gold/30">
        ⓘ {t("demoReviewsNotice")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((r, i) => (
          <div key={i} className="rounded-xl bg-white p-4 shadow-soft ring-1 ring-navy/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{r.authorName}</p>
                <p className="text-xs text-navy/50">{r.country}</p>
              </div>
              <Stars value={r.rating} />
            </div>
            <p className="mt-2 text-sm text-navy/70">{r.comment}</p>
            <p className="mt-2 text-xs text-navy/40">
              {formatDate(new Date(Date.now() - r.daysAgo * 86400000))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
