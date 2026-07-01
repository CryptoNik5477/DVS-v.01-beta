import type { CategoryNode } from "./types";

/**
 * Catalog taxonomy:
 *   Clubs → League → Club   +   National Teams branch.
 * Slugs must be unique. Single source of truth for the storefront.
 */

const img = (slug: string) => `/placeholders/tile-${slug}.svg`;

export const categories: CategoryNode[] = [
  // ── Clubs root ──────────────────────────────────────────────
  { type: "LEAGUE", name: "Clubs", slug: "clubs" },
  // ── Premier League ──
  { type: "LEAGUE", name: "Premier League", slug: "premier-league", countryCode: "GB", parentSlug: "clubs" },
  { type: "CLUB", name: "Arsenal", slug: "arsenal", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Aston Villa", slug: "aston-villa", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "AFC Bournemouth", slug: "bournemouth", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Brentford", slug: "brentford", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Brighton & Hove Albion", slug: "brighton", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Burnley", slug: "burnley", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Chelsea", slug: "chelsea", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Crystal Palace", slug: "crystal-palace", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Everton", slug: "everton", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Fulham", slug: "fulham", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Leeds United", slug: "leeds", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Liverpool FC", slug: "liverpool", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Manchester City", slug: "manchester-city", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Manchester United", slug: "manchester-united", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Newcastle United", slug: "newcastle", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Nottingham Forest", slug: "nottingham-forest", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Sunderland", slug: "sunderland", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Tottenham Hotspur", slug: "tottenham", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "West Ham United", slug: "west-ham", countryCode: "GB", parentSlug: "premier-league" },
  { type: "CLUB", name: "Wolverhampton Wanderers", slug: "wolves", countryCode: "GB", parentSlug: "premier-league" },
  // ── La Liga ──
  { type: "LEAGUE", name: "La Liga", slug: "la-liga", countryCode: "ES", parentSlug: "clubs" },
  { type: "CLUB", name: "Deportivo Alavés", slug: "alaves", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Athletic Club", slug: "athletic-bilbao", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Atlético Madrid", slug: "atletico-madrid", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "FC Barcelona", slug: "barcelona", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Celta Vigo", slug: "celta-vigo", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Elche CF", slug: "elche", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "RCD Espanyol", slug: "espanyol", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Getafe CF", slug: "getafe", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Girona FC", slug: "girona", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Levante UD", slug: "levante", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "RCD Mallorca", slug: "mallorca", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "CA Osasuna", slug: "osasuna", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Rayo Vallecano", slug: "rayo-vallecano", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Real Betis", slug: "real-betis", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Real Madrid", slug: "real-madrid", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Real Oviedo", slug: "real-oviedo", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Real Sociedad", slug: "real-sociedad", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Sevilla FC", slug: "sevilla", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Valencia CF", slug: "valencia", countryCode: "ES", parentSlug: "la-liga" },
  { type: "CLUB", name: "Villarreal CF", slug: "villarreal", countryCode: "ES", parentSlug: "la-liga" },
  // ── Serie A ──
  { type: "LEAGUE", name: "Serie A", slug: "serie-a", countryCode: "IT", parentSlug: "clubs" },
  { type: "CLUB", name: "Atalanta", slug: "atalanta", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Bologna", slug: "bologna", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Cagliari", slug: "cagliari", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Como", slug: "como", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Cremonese", slug: "cremonese", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Fiorentina", slug: "fiorentina", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Genoa", slug: "genoa", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Hellas Verona", slug: "verona", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Inter Milan", slug: "inter-milan", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Juventus", slug: "juventus", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Lazio", slug: "lazio", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Lecce", slug: "lecce", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "AC Milan", slug: "ac-milan", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "SSC Napoli", slug: "napoli", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Parma", slug: "parma", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Pisa", slug: "pisa", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "AS Roma", slug: "as-roma", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Sassuolo", slug: "sassuolo", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Torino", slug: "torino", countryCode: "IT", parentSlug: "serie-a" },
  { type: "CLUB", name: "Udinese", slug: "udinese", countryCode: "IT", parentSlug: "serie-a" },
  // ── Bundesliga ──
  { type: "LEAGUE", name: "Bundesliga", slug: "bundesliga", countryCode: "DE", parentSlug: "clubs" },
  { type: "CLUB", name: "FC Augsburg", slug: "augsburg", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "Bayer Leverkusen", slug: "leverkusen", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "Bayern Munich", slug: "bayern-munich", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "Borussia Dortmund", slug: "borussia-dortmund", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "Borussia Mönchengladbach", slug: "gladbach", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "Eintracht Frankfurt", slug: "eintracht-frankfurt", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "1. FC Köln", slug: "koln", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "SC Freiburg", slug: "freiburg", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "Hamburger SV", slug: "hamburg", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "1. FC Heidenheim", slug: "heidenheim", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "TSG Hoffenheim", slug: "hoffenheim", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "Mainz 05", slug: "mainz", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "RB Leipzig", slug: "rb-leipzig", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "FC St. Pauli", slug: "st-pauli", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "Union Berlin", slug: "union-berlin", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "VfB Stuttgart", slug: "stuttgart", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "Werder Bremen", slug: "werder-bremen", countryCode: "DE", parentSlug: "bundesliga" },
  { type: "CLUB", name: "VfL Wolfsburg", slug: "wolfsburg", countryCode: "DE", parentSlug: "bundesliga" },
  // ── Ligue 1 ──
  { type: "LEAGUE", name: "Ligue 1", slug: "ligue-1", countryCode: "FR", parentSlug: "clubs" },
  { type: "CLUB", name: "Angers SCO", slug: "angers", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "AJ Auxerre", slug: "auxerre", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "Stade Brestois", slug: "brest", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "Le Havre AC", slug: "le-havre", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "RC Lens", slug: "lens", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "LOSC Lille", slug: "lille", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "FC Lorient", slug: "lorient", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "Olympique Lyonnais", slug: "lyon", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "Olympique de Marseille", slug: "marseille-fc", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "FC Metz", slug: "metz", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "AS Monaco", slug: "monaco", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "FC Nantes", slug: "nantes", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "OGC Nice", slug: "nice", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "Paris FC", slug: "paris-fc", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "Paris Saint-Germain", slug: "psg", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "Stade Rennais", slug: "rennes", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "RC Strasbourg", slug: "strasbourg", countryCode: "FR", parentSlug: "ligue-1" },
  { type: "CLUB", name: "Toulouse FC", slug: "toulouse", countryCode: "FR", parentSlug: "ligue-1" },
  // ── Primeira Liga ──
  { type: "LEAGUE", name: "Primeira Liga", slug: "primeira-liga", countryCode: "PT", parentSlug: "clubs" },
  { type: "CLUB", name: "FC Alverca", slug: "alverca", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "FC Arouca", slug: "arouca", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "AVS", slug: "avs", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "SL Benfica", slug: "benfica", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "SC Braga", slug: "braga", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "Casa Pia AC", slug: "casa-pia", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "Estoril Praia", slug: "estoril", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "Estrela da Amadora", slug: "estrela", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "FC Famalicão", slug: "famalicao", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "Gil Vicente FC", slug: "gil-vicente", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "Moreirense FC", slug: "moreirense", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "CD Nacional", slug: "nacional", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "FC Porto", slug: "porto", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "Rio Ave FC", slug: "rio-ave", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "CD Santa Clara", slug: "santa-clara", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "Sporting CP", slug: "sporting-cp", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "CD Tondela", slug: "tondela", countryCode: "PT", parentSlug: "primeira-liga" },
  { type: "CLUB", name: "Vitória SC", slug: "vitoria-sc", countryCode: "PT", parentSlug: "primeira-liga" },
  // ── Eredivisie ──
  { type: "LEAGUE", name: "Eredivisie", slug: "eredivisie", countryCode: "NL", parentSlug: "clubs" },
  { type: "CLUB", name: "AFC Ajax", slug: "ajax", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "AZ Alkmaar", slug: "az-alkmaar", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "Excelsior", slug: "excelsior", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "Feyenoord", slug: "feyenoord", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "Fortuna Sittard", slug: "fortuna-sittard", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "Go Ahead Eagles", slug: "go-ahead-eagles", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "FC Groningen", slug: "groningen", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "SC Heerenveen", slug: "heerenveen", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "Heracles Almelo", slug: "heracles", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "NAC Breda", slug: "nac-breda", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "NEC Nijmegen", slug: "nec", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "PEC Zwolle", slug: "pec-zwolle", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "PSV Eindhoven", slug: "psv", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "Sparta Rotterdam", slug: "sparta-rotterdam", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "Telstar", slug: "telstar", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "FC Twente", slug: "twente", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "FC Utrecht", slug: "utrecht", countryCode: "NL", parentSlug: "eredivisie" },
  { type: "CLUB", name: "FC Volendam", slug: "volendam", countryCode: "NL", parentSlug: "eredivisie" },

  // ── National Teams branch ───────────────────────────────────
  { type: "NATIONAL", name: "National Teams", slug: "national-teams", image: img("national-teams") },
  { type: "NATIONAL", name: "Brazil", slug: "brazil", countryCode: "BR", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Argentina", slug: "argentina", countryCode: "AR", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "France", slug: "france-nt", countryCode: "FR", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "England", slug: "england-nt", countryCode: "GB", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Spain", slug: "spain-nt", countryCode: "ES", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Germany", slug: "germany-nt", countryCode: "DE", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Portugal", slug: "portugal", countryCode: "PT", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "USA", slug: "usa", countryCode: "US", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Mexico", slug: "mexico", countryCode: "MX", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Japan", slug: "japan", countryCode: "JP", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Netherlands", slug: "netherlands-nt", countryCode: "NL", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Italy", slug: "italy-nt", countryCode: "IT", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Morocco", slug: "morocco", countryCode: "MA", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Norway", slug: "norway", countryCode: "NO", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Sweden", slug: "sweden", countryCode: "SE", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Scotland", slug: "scotland", countryCode: "GB", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Austria", slug: "austria", countryCode: "AT", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Switzerland", slug: "switzerland", countryCode: "CH", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Croatia", slug: "croatia", countryCode: "HR", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Belgium", slug: "belgium", countryCode: "BE", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Saudi Arabia", slug: "saudi-arabia", countryCode: "SA", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "South Korea", slug: "south-korea", countryCode: "KR", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Canada", slug: "canada", countryCode: "CA", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Uruguay", slug: "uruguay", countryCode: "UY", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Colombia", slug: "colombia", countryCode: "CO", parentSlug: "national-teams" },
  { type: "NATIONAL", name: "Senegal", slug: "senegal", countryCode: "SN", parentSlug: "national-teams" },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function childrenOf(slug: string | undefined): CategoryNode[] {
  return categories.filter((c) => c.parentSlug === slug);
}

export function ancestorsOf(slug: string): CategoryNode[] {
  const chain: CategoryNode[] = [];
  let current = categoryBySlug.get(slug);
  while (current) {
    chain.unshift(current);
    current = current.parentSlug ? categoryBySlug.get(current.parentSlug) : undefined;
  }
  return chain;
}

/** All descendant club/national slugs under a given category (for listing). */
export function descendantLeafSlugs(slug: string): string[] {
  const node = categoryBySlug.get(slug);
  if (!node) return [];
  if (node.type === "CLUB" || node.type === "NATIONAL") return [slug];
  const result: string[] = [];
  for (const child of childrenOf(slug)) {
    result.push(...descendantLeafSlugs(child.slug));
  }
  return result;
}
