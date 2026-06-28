"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type { Size } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/utils";

export interface ActionState {
  ok?: boolean;
  error?: string;
  message?: string;
}

async function requireAdmin(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "ADMIN" ? "ok" : null;
}

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(160),
  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens."),
  description: z.string().min(2).max(4000),
  categoryId: z.string().min(1, "Choose a category."),
  basePrice: z.coerce.number().min(1).max(100000), // dollars
  salePrice: z.coerce.number().min(0).max(100000).optional(),
  competition: z.string().max(120).optional(),
  season: z.string().max(40).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  images: z.string().optional(), // newline/comma separated URLs
  isNew: z.coerce.boolean().optional(),
  isOnSale: z.coerce.boolean().optional(),
  isWorldCup: z.coerce.boolean().optional(),
  isBestSeller: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  customizable: z.coerce.boolean().optional(),
});

function parseImages(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//.test(s));
}

/** Create or update a product (and its images + size variants). */
export async function upsertProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized." };

  const raw = Object.fromEntries(formData);
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }
  const d = parsed.data;
  const basePrice = Math.round(d.basePrice * 100);
  const salePrice = d.salePrice ? Math.round(d.salePrice * 100) : null;
  const images = parseImages(d.images);

  // Stock per size from fields stock_XS … stock_XXL
  const variants = SIZES.map((size) => ({
    size,
    stock: Math.max(0, Number(formData.get(`stock_${size}`) ?? 0) || 0),
  }));

  const data = {
    name: sanitizeText(d.name, 160),
    slug: d.slug,
    description: sanitizeText(d.description, 4000),
    categoryId: d.categoryId,
    basePrice,
    salePrice,
    competition: d.competition ? sanitizeText(d.competition, 120) : null,
    season: d.season ? sanitizeText(d.season, 40) : null,
    year: d.year ?? null,
    isNew: !!d.isNew,
    isOnSale: !!d.isOnSale || salePrice != null,
    isWorldCup: !!d.isWorldCup,
    isBestSeller: !!d.isBestSeller,
    isFeatured: !!d.isFeatured,
    customizable: d.customizable ?? true,
  };

  try {
    if (d.id) {
      // Update scalar fields, then replace images + upsert variant stock.
      await prisma.product.update({ where: { id: d.id }, data });
      await prisma.productImage.deleteMany({ where: { productId: d.id } });
      if (images.length) {
        await prisma.productImage.createMany({
          data: images.map((url, position) => ({ productId: d.id!, url, position, alt: data.name })),
        });
      }
      for (const v of variants) {
        await prisma.productVariant.upsert({
          where: { productId_size_color: { productId: d.id, size: v.size, color: "Home" } },
          update: { stock: v.stock },
          create: { productId: d.id, size: v.size, color: "Home", stock: v.stock, sku: `${d.slug}-${v.size}`.toUpperCase() },
        });
      }
    } else {
      await prisma.product.create({
        data: {
          ...data,
          images: { create: images.map((url, position) => ({ url, position, alt: data.name })) },
          variants: {
            create: variants.map((v) => ({
              size: v.size,
              color: "Home",
              stock: v.stock,
              sku: `${d.slug}-${v.size}`.toUpperCase(),
            })),
          },
        },
      });
    }
    revalidatePath("/admin/products");
    return { ok: true, message: d.id ? "Product updated." : "Product created." };
  } catch (e) {
    const msg = (e as { code?: string }).code === "P2002" ? "That slug already exists." : "Database error — is the DB configured?";
    return { error: msg };
  }
}

export async function deleteProductAction(id: string): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized." };
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { ok: true, message: "Product deleted." };
  } catch {
    return { error: "Could not delete product." };
  }
}

/**
 * Bulk import products from CSV. Expected header:
 * slug,name,categorySlug,basePrice,salePrice,description,competition,season,year,image
 * Prices are in major units (dollars). Rows with an existing slug are updated.
 */
export async function importProductsCsv(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized." };

  const text = String(formData.get("csv") ?? "").trim();
  if (!text) return { error: "Paste CSV content or upload a file." };

  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return { error: "CSV needs a header row and at least one data row." };

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);
  const required = ["slug", "name", "categoryslug", "baseprice"];
  for (const r of required) {
    if (idx(r) === -1) return { error: `Missing required column: ${r}` };
  }

  const splitCsv = (line: string) =>
    line.match(/("([^"]|"")*"|[^,]*)/g)?.filter((_, i, a) => i < a.length) ?? [];
  const cell = (cols: string[], name: string) =>
    (cols[idx(name)] ?? "").replace(/^"|"$/g, "").replace(/""/g, '"').trim();

  let created = 0;
  let updated = 0;
  let skipped = 0;

  try {
    const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
    const catBySlug = new Map(categories.map((c) => [c.slug, c.id]));

    for (const line of lines.slice(1)) {
      const cols = splitCsv(line);
      const slug = cell(cols, "slug");
      const categorySlug = cell(cols, "categoryslug");
      const categoryId = catBySlug.get(categorySlug);
      if (!slug || !categoryId) {
        skipped++;
        continue;
      }
      const base = Math.round(parseFloat(cell(cols, "baseprice")) * 100);
      const saleRaw = idx("saleprice") !== -1 ? cell(cols, "saleprice") : "";
      const sale = saleRaw ? Math.round(parseFloat(saleRaw) * 100) : null;
      const yearRaw = idx("year") !== -1 ? cell(cols, "year") : "";

      const payload = {
        name: sanitizeText(cell(cols, "name"), 160),
        description: sanitizeText(idx("description") !== -1 ? cell(cols, "description") : "—", 4000) || "—",
        categoryId,
        basePrice: Number.isFinite(base) ? base : 0,
        salePrice: sale,
        isOnSale: sale != null,
        competition: idx("competition") !== -1 ? cell(cols, "competition") || null : null,
        season: idx("season") !== -1 ? cell(cols, "season") || null : null,
        year: yearRaw ? Number(yearRaw) : null,
      };
      const image = idx("image") !== -1 ? cell(cols, "image") : "";

      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        await prisma.product.update({ where: { slug }, data: payload });
        updated++;
      } else {
        await prisma.product.create({
          data: {
            slug,
            ...payload,
            images: image ? { create: [{ url: image, position: 0, alt: payload.name }] } : undefined,
          },
        });
        created++;
      }
    }
    revalidatePath("/admin/products");
    return { ok: true, message: `Import done — ${created} created, ${updated} updated, ${skipped} skipped.` };
  } catch {
    return { error: "Import failed — is the database configured and seeded with categories?" };
  }
}
