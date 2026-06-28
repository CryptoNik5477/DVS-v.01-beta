"use client";

import { Check, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveReview, deleteReview } from "./actions";

export function ReviewActions({ id, approved }: { id: string; approved: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const run = (fn: () => Promise<unknown>) => () =>
    start(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="flex items-center gap-2">
      {!approved && (
        <button
          onClick={run(() => approveReview(id))}
          disabled={pending}
          className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 disabled:opacity-50"
        >
          <Check size={14} /> Approve
        </button>
      )}
      <button
        onClick={() => {
          if (confirm("Delete this review?")) run(() => deleteReview(id))();
        }}
        disabled={pending}
        className="text-navy/40 hover:text-red disabled:opacity-50"
        aria-label="Delete review"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
