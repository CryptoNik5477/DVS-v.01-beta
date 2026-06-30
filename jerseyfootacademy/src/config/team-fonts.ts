/**
 * Per-team flocking fonts.
 *
 * These are open-license (SIL OFL) Google Fonts — 100% free for commercial use —
 * chosen to evoke each team's flocking style. Swap any entry with an exact
 * official / lookalike font file when you have the licence (drop the file in
 * /public/fonts, add an @font-face, and change the `css` here).
 *
 * Keyed by the product's `categorySlug`. When a team isn't listed, the preview
 * falls back to the generic flocking font — so no per-product config is needed.
 */
export const TEAM_FONTS: Record<string, { label: string; css: string }> = {
  // ── National teams ─────────────────────────────────────────────
  "france-nt": { label: "France", css: "'Saira Condensed', sans-serif" },
  "england-nt": { label: "England", css: "'Oswald', sans-serif" },
  "spain-nt": { label: "España", css: "'Teko', sans-serif" },
  "germany-nt": { label: "Deutschland", css: "'Rajdhani', sans-serif" },
  "italy-nt": { label: "Italia", css: "'Teko', sans-serif" },
  "netherlands-nt": { label: "Nederland", css: "'Oswald', sans-serif" },
  portugal: { label: "Portugal", css: "'Rajdhani', sans-serif" },
  brazil: { label: "Brasil", css: "'Saira Stencil One', sans-serif" },
  argentina: { label: "Argentina", css: "'Oswald', sans-serif" },
  usa: { label: "USA", css: "'Russo One', sans-serif" },
  mexico: { label: "México", css: "'Bebas Neue', sans-serif" },
  japan: { label: "Japan", css: "'Rajdhani', sans-serif" },
  morocco: { label: "Maroc", css: "'Teko', sans-serif" },
  norway: { label: "Norge", css: "'Oswald', sans-serif" },
  sweden: { label: "Sverige", css: "'Oswald', sans-serif" },
  scotland: { label: "Scotland", css: "'Oswald', sans-serif" },
  austria: { label: "Österreich", css: "'Archivo Black', sans-serif" },
  switzerland: { label: "Suisse", css: "'Archivo Black', sans-serif" },
  croatia: { label: "Hrvatska", css: "'Saira Condensed', sans-serif" },
  belgium: { label: "Belgium", css: "'Teko', sans-serif" },
  "saudi-arabia": { label: "السعودية", css: "'Rajdhani', sans-serif" },
  "south-korea": { label: "Korea", css: "'Rajdhani', sans-serif" },
  canada: { label: "Canada", css: "'Russo One', sans-serif" },
  uruguay: { label: "Uruguay", css: "'Oswald', sans-serif" },
  colombia: { label: "Colombia", css: "'Bebas Neue', sans-serif" },
  senegal: { label: "Sénégal", css: "'Teko', sans-serif" },

  // ── Clubs ──────────────────────────────────────────────────────
  psg: { label: "Paris", css: "'Archivo Black', sans-serif" },
  "real-madrid": { label: "Real Madrid", css: "'Saira Condensed', sans-serif" },
  barcelona: { label: "Barça", css: "'Oswald', sans-serif" },
  "manchester-united": { label: "Man United", css: "'Oswald', sans-serif" },
  "manchester-city": { label: "Man City", css: "'Teko', sans-serif" },
  liverpool: { label: "Liverpool", css: "'Oswald', sans-serif" },
  arsenal: { label: "Arsenal", css: "'Rajdhani', sans-serif" },
  chelsea: { label: "Chelsea", css: "'Saira Condensed', sans-serif" },
  tottenham: { label: "Tottenham", css: "'Teko', sans-serif" },
  "bayern-munich": { label: "Bayern", css: "'Archivo Black', sans-serif" },
  "borussia-dortmund": { label: "Dortmund", css: "'Bebas Neue', sans-serif" },
  juventus: { label: "Juventus", css: "'Russo One', sans-serif" },
  "ac-milan": { label: "Milan", css: "'Oswald', sans-serif" },
  "inter-milan": { label: "Inter", css: "'Rajdhani', sans-serif" },
  napoli: { label: "Napoli", css: "'Teko', sans-serif" },
  "as-roma": { label: "Roma", css: "'Saira Condensed', sans-serif" },
  "atletico-madrid": { label: "Atlético", css: "'Bebas Neue', sans-serif" },
  ajax: { label: "Ajax", css: "'Oswald', sans-serif" },
  "marseille-fc": { label: "Marseille", css: "'Teko', sans-serif" },
};

/** Resolve the flocking font CSS for a given category slug (undefined if none). */
export function teamFontCss(slug: string | undefined): string | undefined {
  return slug ? TEAM_FONTS[slug]?.css : undefined;
}

/** Human label for the team's official font option (undefined if none). */
export function teamFontLabel(slug: string | undefined): string | undefined {
  return slug ? TEAM_FONTS[slug]?.label : undefined;
}
