import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().min(2).max(120),
  line1: z.string().min(2).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(120),
  state: z.string().max(120).optional(),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2),
  phone: z.string().max(40).optional(),
  isDefault: z.boolean().optional(),
});

async function requireUser() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  return id ?? null;
}

export async function POST(req: Request) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid address." }, { status: 400 });
  const d = parsed.data;

  try {
    // If marked default, clear other defaults first.
    if (d.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const address = await prisma.address.create({
      data: {
        userId,
        fullName: sanitizeText(d.fullName, 120),
        line1: sanitizeText(d.line1, 200),
        line2: d.line2 ? sanitizeText(d.line2, 200) : null,
        city: sanitizeText(d.city, 120),
        state: d.state ? sanitizeText(d.state, 120) : null,
        postalCode: sanitizeText(d.postalCode, 20),
        country: d.country.toUpperCase(),
        phone: d.phone ? sanitizeText(d.phone, 40) : null,
        isDefault: d.isDefault ?? false,
      },
    });
    return NextResponse.json({ ok: true, address });
  } catch {
    return NextResponse.json({ error: "Could not save address. Is the database configured?" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  try {
    // Scope deletion to the owner.
    await prisma.address.deleteMany({ where: { id, userId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete address." }, { status: 500 });
  }
}
