import type { Locale } from "@/i18n/config";
import { productBySlug } from "./products";
import type { ProductSeed } from "./types";

/**
 * Per-locale product overrides (name/description). Team names are proper nouns
 * so usually only the description is translated. Any product/locale not listed
 * here gracefully falls back to the base (English) text in products.ts.
 *
 * To translate more products, add their slug here for each locale — the helper
 * and all storefront pages pick it up automatically.
 */
type Override = { name?: string; description?: string };

export const productI18n: Partial<Record<Locale, Record<string, Override>>> = {
  fr: {
    "man-utd-home-2526": { description: "Le maillot domicile emblématique des Red Devils pour la saison 2025/26. Tissu AeroDry anti-transpiration et col rond classique. Affichez votre fierté d'Old Trafford." },
    "liverpool-home-2526": { description: "You'll Never Walk Alone. Le célèbre rouge d'Anfield, avec le blason du Liver bird et des empiècements en mesh respirant." },
    "real-madrid-home-2526": { description: "Le blanc immaculé des Merengues. Le club le plus titré d'Europe — portez la légende. Finitions édition Ligue des champions." },
    "barcelona-home-2526": { description: "Més que un club. Les légendaires rayures blaugrana dans un tissu technique premium. L'icône du Camp Nou." },
    "psg-home-2526": { description: "Ici c'est Paris. Le bleu marine et rouge des champions de France avec la bande Hechter signature." },
    "brazil-home-2026": { description: "Le jaune légendaire de la Canarinho. Le maillot cinq étoiles de la Seleção pour la Coupe du Monde 2026. Ordem e Progresso." },
    "argentina-home-2026": { description: "Champions du monde en titre. Les rayures bleu ciel de l'albiceleste avec trois étoiles. Vamos Argentina !" },
    "usa-home-2026": { description: "La fierté du pays hôte. Le maillot domicile aux étoiles et rayures pour la Coupe du Monde 2026 à domicile." },
  },
  it: {
    "man-utd-home-2526": { description: "La storica maglia casalinga dei Red Devils per la stagione 2025/26. Tessuto traspirante AeroDry e classico collo a girocollo. Mostra il tuo orgoglio di Old Trafford." },
    "liverpool-home-2526": { description: "You'll Never Walk Alone. Il famoso rosso di Anfield, con lo stemma del Liver bird e inserti in mesh traspirante." },
    "real-madrid-home-2526": { description: "Il bianco puro dei Blancos. Il club più titolato d'Europa — indossa la leggenda. Rifiniture edizione Champions League." },
    "barcelona-home-2526": { description: "Més que un club. Le leggendarie strisce blaugrana in tessuto tecnico premium. L'icona del Camp Nou." },
    "psg-home-2526": { description: "Ici c'est Paris. Il blu navy e rosso dei campioni di Francia con la riga Hechter caratteristica." },
    "brazil-home-2026": { description: "Il leggendario giallo Canarinho. La maglia cinque stelle della Seleção per i Mondiali 2026. Ordem e Progresso." },
    "argentina-home-2026": { description: "Campioni del mondo in carica. Le strisce azzurre dell'albiceleste con tre stelle. Vamos Argentina!" },
    "usa-home-2026": { description: "L'orgoglio della nazione ospitante. La maglia con stelle e strisce per i Mondiali 2026 in casa." },
  },
  de: {
    "man-utd-home-2526": { description: "Das ikonische Heimtrikot der Red Devils für die Saison 2025/26. Feuchtigkeitsableitendes AeroDry-Gewebe und klassischer Rundhalsausschnitt. Zeig deinen Old-Trafford-Stolz." },
    "liverpool-home-2526": { description: "You'll Never Walk Alone. Das berühmte Anfield-Rot mit Liver-Bird-Wappen und atmungsaktiven Mesh-Einsätzen." },
    "real-madrid-home-2526": { description: "Das reine Weiß der Königlichen. Der erfolgreichste Klub Europas — trage die Legende. Champions-League-Edition-Details." },
    "barcelona-home-2526": { description: "Més que un club. Die legendären Blaugrana-Streifen aus hochwertigem Funktionsgewebe. Die Ikone des Camp Nou." },
    "psg-home-2526": { description: "Ici c'est Paris. Das Marineblau und Rot der französischen Meister mit dem charakteristischen Hechter-Streifen." },
    "brazil-home-2026": { description: "Das legendäre Canarinho-Gelb. Das Fünf-Sterne-Trikot der Seleção für die WM 2026. Ordem e Progresso." },
    "argentina-home-2026": { description: "Amtierender Weltmeister. Die himmelblauen Streifen der Albiceleste mit drei Sternen. Vamos Argentina!" },
    "usa-home-2026": { description: "Der Stolz des Gastgeberlands. Das Heimtrikot mit Stars and Stripes für die WM 2026 im eigenen Land." },
  },
  es: {
    "man-utd-home-2526": { description: "La icónica camiseta local de los Red Devils para la temporada 2025/26. Tejido transpirable AeroDry y clásico cuello redondo. Muestra tu orgullo de Old Trafford." },
    "liverpool-home-2526": { description: "You'll Never Walk Alone. El famoso rojo de Anfield, con el escudo del Liver bird y paneles de malla transpirable." },
    "real-madrid-home-2526": { description: "El blanco puro de los Blancos. El club más laureado de Europa — viste la leyenda. Acabados edición Champions League." },
    "barcelona-home-2526": { description: "Més que un club. Las legendarias rayas blaugrana en tejido técnico premium. El icono del Camp Nou." },
    "psg-home-2526": { description: "Ici c'est Paris. El azul marino y rojo de los campeones de Francia con la franja Hechter característica." },
    "brazil-home-2026": { description: "El legendario amarillo Canarinho. La camiseta de cinco estrellas de la Seleção para el Mundial 2026. Ordem e Progresso." },
    "argentina-home-2026": { description: "Campeones del mundo vigentes. Las rayas celestes de la albiceleste con tres estrellas. ¡Vamos Argentina!" },
    "usa-home-2026": { description: "El orgullo del país anfitrión. La camiseta local con barras y estrellas para el Mundial 2026 en casa." },
  },
  nl: {
    "man-utd-home-2526": { description: "Het iconische thuisshirt van de Red Devils voor het seizoen 2025/26. Vochtafvoerend AeroDry-weefsel en klassieke ronde hals. Toon je Old Trafford-trots." },
    "liverpool-home-2526": { description: "You'll Never Walk Alone. Het beroemde rood van Anfield, met het Liver bird-embleem en ademende mesh-panelen." },
    "real-madrid-home-2526": { description: "Het pure wit van de Blancos. De meest succesvolle club van Europa — draag de legende. Champions League-editie-details." },
    "barcelona-home-2526": { description: "Més que un club. De legendarische blaugrana-strepen in premium technisch weefsel. Het icoon van Camp Nou." },
    "psg-home-2526": { description: "Ici c'est Paris. Het marineblauw en rood van de Franse kampioenen met de kenmerkende Hechter-baan." },
    "brazil-home-2026": { description: "Het legendarische Canarinho-geel. Het vijfsterrenshirt van de Seleção voor het WK 2026. Ordem e Progresso." },
    "argentina-home-2026": { description: "Regerend wereldkampioen. De lichtblauwe strepen van de albiceleste met drie sterren. Vamos Argentina!" },
    "usa-home-2026": { description: "De trots van het gastland. Het thuisshirt met stars and stripes voor het WK 2026 op eigen bodem." },
  },
};

export interface LocalizedProduct {
  name: string;
  description: string;
}

/** Returns the product's name/description in the given locale, falling back to base. */
export function localizeProduct(product: ProductSeed, locale: string): LocalizedProduct {
  const override = productI18n[locale as Locale]?.[product.slug];
  return {
    name: override?.name ?? product.name,
    description: override?.description ?? product.description,
  };
}

export function localizeBySlug(slug: string, locale: string): LocalizedProduct | undefined {
  const product = productBySlug.get(slug);
  return product ? localizeProduct(product, locale) : undefined;
}
