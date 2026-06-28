"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { setUserRole } from "./actions";

export function RoleToggle({ id, role }: { id: string; role: "CUSTOMER" | "ADMIN" }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const next = role === "ADMIN" ? "CUSTOMER" : "ADMIN";

  return (
    <button
      onClick={() =>
        start(async () => {
          const res = await setUserRole(id, next);
          if (res.error) alert(res.error);
          router.refresh();
        })
      }
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-full border border-navy/15 px-3 py-1 text-xs font-semibold transition hover:border-navy/40 disabled:opacity-50"
    >
      {role === "ADMIN" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
      {role === "ADMIN" ? "Make customer" : "Make admin"}
    </button>
  );
}
