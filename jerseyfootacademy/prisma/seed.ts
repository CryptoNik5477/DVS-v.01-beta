/**
 * Database seed. Mirrors the canonical storefront data in src/data/* into
 * PostgreSQL so the dynamic features (orders, admin, auth) have content.
 *
 * Run: npm run db:seed
 */
import { PrismaClient, type Size } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories } from "../src/data/categories";
import { products } from "../src/data/products";
import { reviews } from "../src/data/reviews";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding JerseyFootAcademy…");

  // ── Categories (insert respecting parent order) ─────────────────────────────
  const slugToId = new Map<string, string>();
  const pending = [...categories];
  let guard = 0;
  while (pending.length && guard < 50) {
    guard++;
    for (let i = pending.length - 1; i >= 0; i--) {
      const c = pending[i];
      if (c.parentSlug && !slugToId.has(c.parentSlug)) continue; // wait for parent
      const created = await prisma.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: {
          type: c.type,
          name: c.name,
          slug: c.slug,
          countryCode: c.countryCode,
          image: c.image,
          parentId: c.parentSlug ? slugToId.get(c.parentSlug) : undefined,
        },
      });
      slugToId.set(c.slug, created.id);
      pending.splice(i, 1);
    }
  }
  console.log(`  ✓ ${slugToId.size} categories`);

  // ── Products + images + variants ────────────────────────────────────────────
  const productSlugToId = new Map<string, string>();
  for (const p of products) {
    const categoryId = slugToId.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`  ! Skipping ${p.slug}: unknown category ${p.categorySlug}`);
      continue;
    }
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        categoryId,
        competition: p.competition,
        season: p.season,
        year: p.year,
        player: p.player,
        isNew: !!p.isNew,
        isOnSale: !!p.salePrice || !!p.isOnSale,
        isWorldCup: !!p.isWorldCup,
        isBestSeller: !!p.isBestSeller,
        isFeatured: !!p.isFeatured,
        customizable: p.customizable ?? true,
        images: {
          create: p.images.map((url, position) => ({ url, position, alt: p.name })),
        },
        variants: {
          create: Object.entries(p.stock).map(([size, stock]) => ({
            size: size as Size,
            color: p.colors?.[0] ?? "Home",
            sku: `${p.slug}-${size}`.toUpperCase(),
            stock: stock ?? 0,
          })),
        },
      },
    });
    productSlugToId.set(p.slug, product.id);
  }
  console.log(`  ✓ ${productSlugToId.size} products`);

  // ── Demo reviews (flagged isDemo) ───────────────────────────────────────────
  let reviewCount = 0;
  for (const r of reviews) {
    const productId = productSlugToId.get(r.productSlug);
    if (!productId) continue;
    await prisma.review.create({
      data: {
        productSlug: r.productSlug,
        productId,
        authorName: r.authorName,
        country: r.country,
        rating: r.rating,
        comment: r.comment,
        isDemo: true,
        approved: true,
        createdAt: new Date(Date.now() - r.daysAgo * 86400000),
      },
    });
    reviewCount++;
  }
  console.log(`  ✓ ${reviewCount} demo reviews (isDemo=true)`);

  // ── Promo codes ─────────────────────────────────────────────────────────────
  await prisma.promoCode.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENT", value: 10 },
  });
  await prisma.promoCode.upsert({
    where: { code: "WORLDCUP26" },
    update: {},
    create: { code: "WORLDCUP26", type: "PERCENT", value: 15, minOrder: 10000 },
  });
  console.log("  ✓ promo codes");

  // ── Admin user ──────────────────────────────────────────────────────────────
  const adminEmail = "admin@jerseyfootacademy.com";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Store Admin",
      role: "ADMIN",
      passwordHash: await bcrypt.hash("changeme123", 12),
    },
  });
  console.log(`  ✓ admin user (${adminEmail} / changeme123 — change this!)`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
