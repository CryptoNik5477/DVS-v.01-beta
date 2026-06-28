import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Auto-generated Open Graph / social share image (no static asset needed). */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b132b 0%, #13204a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 36, color: "#D4AF37", letterSpacing: 8, fontWeight: 700 }}>
          ⚽ JERSEYFOOTACADEMY
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            textAlign: "center",
            maxWidth: 900,
            marginTop: 24,
            lineHeight: 1.05,
          }}
        >
          Support Your Team.
          <br />
          <span style={{ color: "#C8102E" }}>Wear The Passion.</span>
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.7)", marginTop: 28 }}>
          Premium football jerseys · Worldwide shipping · World Cup 2026
        </div>
      </div>
    ),
    size,
  );
}
