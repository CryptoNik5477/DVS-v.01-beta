import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Stars } from "@/components/ui/stars";
import { formatDate } from "@/lib/utils";
import { ScaffoldNotice } from "@/components/admin/scaffold-notice";
import { ReviewActions } from "./review-actions";

export const metadata = { title: "Admin · Reviews" };

export default async function AdminReviewsPage() {
  let pending: Awaited<ReturnType<typeof prisma.review.findMany>> = [];
  let approved: Awaited<ReturnType<typeof prisma.review.findMany>> = [];
  let dbAvailable = true;
  try {
    [pending, approved] = await Promise.all([
      prisma.review.findMany({ where: { approved: false }, orderBy: { createdAt: "desc" } }),
      prisma.review.findMany({ where: { approved: true, isDemo: false }, orderBy: { createdAt: "desc" }, take: 50 }),
    ]);
  } catch {
    dbAvailable = false;
  }

  if (!dbAvailable) {
    return (
      <ScaffoldNotice title="Reviews">
        Connect a database to moderate customer reviews. Submissions from product pages land here as
        pending until you approve them.
      </ScaffoldNotice>
    );
  }

  const Card = ({ r }: { r: (typeof pending)[number] }) => (
    <div className="rounded-xl bg-white p-4 shadow-soft ring-1 ring-navy/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            {r.authorName} <span className="text-xs font-normal text-navy/50">· {r.country}</span>
          </p>
          <Link href={`/product/${r.productSlug}`} className="text-xs text-gold hover:underline">
            {r.productSlug}
          </Link>
        </div>
        <Stars value={r.rating} />
      </div>
      <p className="mt-2 text-sm text-navy/70">{r.comment}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-navy/40">{formatDate(r.createdAt)}</span>
        <ReviewActions id={r.id} approved={r.approved} />
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Reviews</h1>
      <p className="text-sm text-navy/60">{pending.length} pending moderation.</p>

      <section className="mt-6">
        <h2 className="mb-3 font-display text-lg font-extrabold">
          Pending {pending.length > 0 && <span className="badge ml-1 bg-red text-white">{pending.length}</span>}
        </h2>
        {pending.length ? (
          <div className="grid gap-4 sm:grid-cols-2">{pending.map((r) => <Card key={r.id} r={r} />)}</div>
        ) : (
          <p className="rounded-xl bg-white p-6 text-center text-sm text-navy/50 shadow-soft">
            Nothing pending. New customer reviews will appear here for approval.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-extrabold">Approved (customer)</h2>
        {approved.length ? (
          <div className="grid gap-4 sm:grid-cols-2">{approved.map((r) => <Card key={r.id} r={r} />)}</div>
        ) : (
          <p className="rounded-xl bg-white p-6 text-center text-sm text-navy/50 shadow-soft">
            No approved customer reviews yet.
          </p>
        )}
      </section>
    </div>
  );
}
