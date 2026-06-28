"use client";

import { flockingColors, flockingFonts, type Customization } from "@/config/customization";

/** Stylised jersey-back SVG showing live name/number flocking. */
export function JerseyPreview({ customization }: { customization: Customization }) {
  const color = flockingColors.find((c) => c.id === customization.color)?.hex ?? "#fff";
  const font = flockingFonts.find((f) => f.id === customization.font)?.css ?? "sans-serif";
  const name = (customization.name ?? "").toUpperCase().slice(0, 12) || "YOUR NAME";
  const number = (customization.number ?? "").slice(0, 2) || "10";

  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" role="img" aria-label="Jersey preview">
      {/* Jersey body */}
      <path
        d="M55 30 L80 18 Q100 30 120 18 L145 30 L168 55 L150 75 L140 65 V200 Q100 210 60 200 V65 L50 75 L32 55 Z"
        fill="#13204A"
        stroke="#0B132B"
        strokeWidth="2"
      />
      {/* Collar */}
      <path d="M80 18 Q100 38 120 18" fill="none" stroke="#D4AF37" strokeWidth="3" />
      {/* Name */}
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
      {/* Number */}
      <text
        x="100"
        y="170"
        textAnchor="middle"
        fontFamily={font}
        fontSize="80"
        fontWeight="800"
        fill={color}
      >
        {number}
      </text>
    </svg>
  );
}
