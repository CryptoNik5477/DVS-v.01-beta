"use client";

import { flockingColors, flockingFonts, type Customization } from "@/config/customization";

/**
 * Live flocking preview. When a real back photo is available, the name/number
 * are overlaid on the actual jersey (vector text → scales crisply at any size).
 * Otherwise it falls back to a stylised jersey-back SVG.
 */
export function JerseyPreview({
  customization,
  backImage,
  fontFamily,
}: {
  customization: Customization;
  backImage?: string;
  /** Resolved CSS font-family override (e.g. the team's official font). */
  fontFamily?: string;
}) {
  const color = flockingColors.find((c) => c.id === customization.color)?.hex ?? "#fff";
  const font = fontFamily ?? flockingFonts.find((f) => f.id === customization.font)?.css ?? "sans-serif";
  const name = (customization.name ?? "").toUpperCase().slice(0, 12) || "YOUR NAME";
  const number = (customization.number ?? "").slice(0, 2) || "10";

  const isPhoto = !!backImage && /\.(jpe?g|png|webp)$/i.test(backImage);

  // Brand logo sits inside the bottom of the number, in the colour that
  // contrasts with the flocking (white number → black mark, dark → white mark).
  const hex = color.replace("#", "");
  const exp = hex.length === 3 ? hex.replace(/(.)/g, "$1$1") : hex;
  const r = parseInt(exp.slice(0, 2) || "ff", 16);
  const g = parseInt(exp.slice(2, 4) || "ff", 16);
  const b = parseInt(exp.slice(4, 6) || "ff", 16);
  const lightFlock = 0.299 * r + 0.587 * g + 0.114 * b > 140;
  const markSrc = lightFlock ? "/logo-mark-black.png" : "/logo-mark-white.png";

  // Overlay on the real jersey-back photo.
  if (isPhoto) {
    return (
      <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={backImage} alt="Jersey back" className="absolute inset-0 h-full w-full object-contain" />
        {/* Vector flocking overlay, aligned to the jersey body */}
        <svg
          viewBox="0 0 100 133"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <text
            x="50"
            y="25"
            textAnchor="middle"
            fontFamily={font}
            fontSize="10"
            fontWeight="800"
            letterSpacing="0.6"
            fill={color}
            stroke="rgba(0,0,0,0.28)"
            strokeWidth="0.4"
            style={{ paintOrder: "stroke" }}
          >
            {name}
          </text>
          {/* Number — raised, stretched vertically and thickened */}
          <text
            x="50"
            y="78"
            textAnchor="middle"
            fontFamily={font}
            fontSize="40"
            fontWeight="800"
            fill={color}
            stroke={color}
            strokeWidth="1.1"
            style={{ paintOrder: "stroke" }}
            transform="matrix(1 0 0 1.28 0 -21.84)"
          >
            {number}
          </text>
          {/* Brand logo embedded at the bottom of the number */}
          <image href={markSrc} x="43.5" y="67" width="13" height="13" opacity="0.92" />
        </svg>
      </div>
    );
  }

  // Fallback: stylised jersey-back SVG.
  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" role="img" aria-label="Jersey preview">
      <path
        d="M55 30 L80 18 Q100 30 120 18 L145 30 L168 55 L150 75 L140 65 V200 Q100 210 60 200 V65 L50 75 L32 55 Z"
        fill="#13204A"
        stroke="#0B132B"
        strokeWidth="2"
      />
      <path d="M80 18 Q100 38 120 18" fill="none" stroke="#D4AF37" strokeWidth="3" />
      <text
        x="100"
        y="95"
        textAnchor="middle"
        fontFamily={font}
        fontSize="18"
        fontWeight="800"
        letterSpacing="1"
        fill={color}
      >
        {name}
      </text>
      <text x="100" y="170" textAnchor="middle" fontFamily={font} fontSize="80" fontWeight="800" fill={color}>
        {number}
      </text>
    </svg>
  );
}
