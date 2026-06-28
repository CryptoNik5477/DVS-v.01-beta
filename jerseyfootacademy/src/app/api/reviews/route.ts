import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/utils";
import { productBySlug } from "@/data/products";

const schema = z.object({
  productSlug: z.string().min(1).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(4).max(1500),
  authorName: z.string().min(2).max(80),
  country: z.string().min(2).max(60),
});

/** Submit a customer review. Stored pending moderation (approved=false). */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 400 });
  }
  const d = parsed.data;
  if (!productBySlug.has(d.productSlug)) {
    return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  try {
    // Link to the Product row if it exists in the DB (optional).
    const product = await prisma.product.findUnique({ where: { slug: d.productSlug }, select: { id: true } });
    await prisma.review.create({
      data: {
        productSlug: d.productSlug,
        productId: product?.id,
        userId,
        authorName: sanitizeText(d.authorName, 80),
        country: sanitizeText(d.country, 60),
        rating: d.rating,
        comment: sanitizeText(d.comment, 1500),
        isDemo: false,
        approved: false,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not submit review — is the database configured?" }, { status: 500 });
  }
}
