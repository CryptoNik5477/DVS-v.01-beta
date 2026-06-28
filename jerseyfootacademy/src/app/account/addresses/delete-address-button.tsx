"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteAddressButton({ id }: { id: string }) {
  const router = useRouter();
  async function remove() {
    await fetch(`/api/account/addresses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    router.refresh();
  }
  return (
    <button onClick={remove} className="text-navy/40 hover:text-red" aria-label="Delete address">
      <Trash2 size={16} />
    </button>
  );
}
