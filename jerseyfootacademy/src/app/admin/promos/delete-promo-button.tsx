"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePromoAction } from "./actions";

export function DeletePromoButton({ id, code }: { id: string; code: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (!confirm(`Delete promo "${code}"?`)) return;
        start(async () => {
          await deletePromoAction(id);
          router.refresh();
        });
      }}
      disabled={pending}
      className="text-navy/40 hover:text-red disabled:opacity-50"
      aria-label="Delete promo"
    >
      <Trash2 size={16} />
    </button>
  );
}
