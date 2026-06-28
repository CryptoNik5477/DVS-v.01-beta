import type { ReviewSeed } from "./types";
import { products } from "./products";

/**
 * ⚠️ DEMO REVIEWS — TEST DATA ONLY.
 * Every entry here is fictional and flagged `isDemo: true` in the database.
 * Remove or replace with genuine customer reviews BEFORE going to production:
 *   await prisma.review.deleteMany({ where: { isDemo: true } });
 */

const SAMPLES: Array<Omit<ReviewSeed, "productSlug">> = [
  { authorName: "Lucas M.", country: "FR", rating: 5, comment: "Qualité exceptionnelle, le flocage est parfait. Livraison plus rapide que prévu !", daysAgo: 4 },
  { authorName: "Sophie B.", country: "BE", rating: 5, comment: "Exactly like the stadium version. Sizing is true to fit. Very happy.", daysAgo: 9 },
  { authorName: "James T.", country: "GB", rating: 4, comment: "Great shirt, lovely fabric. Took a couple of weeks to arrive but worth the wait.", daysAgo: 15 },
  { authorName: "Carlos R.", country: "ES", rating: 5, comment: "Calidad premium, los colores son vivos. Volveré a comprar seguro.", daysAgo: 21 },
  { authorName: "Mia K.", country: "DE", rating: 5, comment: "Top Qualität und perfekte Passform. Sehr zu empfehlen!", daysAgo: 6 },
  { authorName: "Nattapong S.", country: "TH", rating: 5, comment: "เสื้อสวยมาก คุณภาพดี ส่งไว แนะนำเลยครับ", daysAgo: 3 },
  { authorName: "Diego F.", country: "AR", rating: 5, comment: "Una locura la calidad. El número y nombre quedaron impecables.", daysAgo: 12 },
  { authorName: "Emma W.", country: "US", rating: 4, comment: "Beautiful jersey, customization looks pro. Shipping to the US was reasonable.", daysAgo: 18 },
  { authorName: "Rafael S.", country: "BR", rating: 5, comment: "Camisa maravilhosa, tecido de altíssima qualidade. Recomendo!", daysAgo: 7 },
  { authorName: "Yuki T.", country: "JP", rating: 5, comment: "とても良い品質です。サイズもぴったりでした。", daysAgo: 5 },
  { authorName: "Olivia P.", country: "AU", rating: 4, comment: "Lovely kit, arrived well packaged. Would order again.", daysAgo: 25 },
  { authorName: "Hassan A.", country: "MA", rating: 5, comment: "Excellente qualité, flocage impeccable. Merci JerseyFootAcademy !", daysAgo: 11 },
];

/**
 * Spread demo reviews across products deterministically so each product gets
 * 2–4 reviews and the homepage ratings look populated.
 */
export const reviews: ReviewSeed[] = products.flatMap((product, pi) => {
  const count = 2 + (pi % 3); // 2..4 reviews per product
  return Array.from({ length: count }, (_, i) => {
    const sample = SAMPLES[(pi * 3 + i) % SAMPLES.length];
    return {
      ...sample,
      productSlug: product.slug,
      // jitter so dates differ per product
      daysAgo: sample.daysAgo + pi,
    };
  });
});

/** Average rating + count for a product slug, computed from demo data. */
export function ratingFor(slug: string): { average: number; count: number } {
  const list = reviews.filter((r) => r.productSlug === slug);
  if (list.length === 0) return { average: 0, count: 0 };
  const sum = list.reduce((a, r) => a + r.rating, 0);
  return { average: Math.round((sum / list.length) * 10) / 10, count: list.length };
}
