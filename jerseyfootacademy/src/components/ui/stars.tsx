import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(value) ? "fill-gold text-gold" : "text-navy/20"}
          />
        ))}
      </span>
      {count !== undefined && <span className="text-xs text-navy/50">({count})</span>}
    </span>
  );
}
