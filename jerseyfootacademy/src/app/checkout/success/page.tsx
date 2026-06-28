"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export default function CheckoutSuccessPage() {
  const t = useTranslations("ui");
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="container-page py-24 text-center">
      <CheckCircle2 className="mx-auto text-green-500" size={64} />
      <h1 className="mt-6 font-display text-3xl font-extrabold">{t("successTitle")}</h1>
      <p className="mx-auto mt-3 max-w-md text-navy/60">{t("successText")}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/account" className="btn-primary">
          {t("viewOrders")}
        </Link>
        <Link href="/catalog" className="btn-outline">
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
}
