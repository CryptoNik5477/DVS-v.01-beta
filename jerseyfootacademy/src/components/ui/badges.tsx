import { cn } from "@/lib/utils";
import type { ProductSeed } from "@/data/types";

/** Renders merchandising badges (New / Sale / World Cup / Best Seller). */
export function ProductBadges({ product, className }: { product: ProductSeed; className?: string }) {
  const badges: { label: string; cls: string }[] = [];
  if (product.isWorldCup) badges.push({ label: "World Cup", cls: "bg-gold text-navy" });
  if (product.isNew) badges.push({ label: "New", cls: "bg-navy text-white" });
  if (product.salePrice || product.isOnSale) badges.push({ label: "Sale", cls: "bg-red text-white" });
  if (product.isBestSeller) badges.push({ label: "Best Seller", cls: "bg-white text-navy ring-1 ring-navy/15" });

  if (badges.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((b) => (
        <span key={b.label} className={cn("badge", b.cls)}>
          {b.label}
        </span>
      ))}
    </div>
  );
}
