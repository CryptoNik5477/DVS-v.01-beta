"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/** Product image gallery with thumbnail navigation and hover-to-zoom. */
export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={ref}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-navy/5"
      >
        <div className="absolute inset-4 sm:inset-6">
          <Image
            src={images[active]}
            alt={alt}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-contain transition-transform duration-200"
            style={
              zoom
                ? { transform: "scale(1.9)", transformOrigin: `${pos.x}% ${pos.y}%` }
                : undefined
            }
          />
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 overflow-hidden rounded-lg bg-neutral-100 ring-2 transition ${
                i === active ? "ring-red" : "ring-transparent hover:ring-navy/20"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
