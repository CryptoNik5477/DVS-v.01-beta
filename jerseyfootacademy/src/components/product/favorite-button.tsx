"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useFavorites } from "@/lib/favorites-store";
import { cn } from "@/lib/utils";

/** Heart toggle to add/remove a product from the wishlist. */
export function FavoriteButton({
  slug,
  className,
  size = 18,
  showLabel = false,
}: {
  slug: string;
  className?: string;
  size?: number;
  showLabel?: boolean;
}) {
  const t = useTranslations("ui");
  const toggle = useFavorites((s) => s.toggle);
  const slugs = useFavorites((s) => s.slugs);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const active = mounted && slugs.includes(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "inline-flex items-center gap-2 rounded-full transition",
        showLabel ? "btn-outline" : "bg-white/90 p-2 shadow-soft hover:bg-white",
        className,
      )}
    >
      <Heart size={size} className={active ? "fill-red text-red" : "text-navy/60"} />
      {showLabel && <span className="text-sm font-semibold">{active ? t("saved") : t("save")}</span>}
    </button>
  );
}
