import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email().max(200),
  token: z.string().min(10).max(200),
  password: z.string().min(8).max(100),
});

/** Complete a password reset using a valid, unexpired token. */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { email, token, password } = parsed.data;
  const identifier = email.toLowerCase();

  try {
    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record || record.identifier !== identifier || record.expires.getTime() < Date.now()) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { email: identifier }, data: { passwordHash } });
    // One-time use: remove the token (and any siblings for this email).
    await prisma.verificationToken.deleteMany({ where: { identifier } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not reset password. Try again." }, { status: 500 });
  }
}
