import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailLayout } from "@/lib/email";
import { siteConfig } from "@/config/site";

const schema = z.object({ email: z.string().email().max(200) });
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Request a password reset. Always responds ok (no account enumeration).
 * Sends an email with a tokenised link when the account exists.
 */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ ok: true }); // never reveal validity

  const email = parsed.data.email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = randomBytes(32).toString("hex");
      await prisma.verificationToken.create({
        data: { identifier: email, token, expires: new Date(Date.now() + TOKEN_TTL_MS) },
      });
      const url = `${siteConfig.url}/account/reset?token=${token}&email=${encodeURIComponent(email)}`;
      await sendEmail({
        to: email,
        replyTo: siteConfig.contact.email,
        subject: `Reset your ${siteConfig.name} password`,
        html: emailLayout(
          "Reset your password",
          `<p style="font-size:15px;line-height:1.6;color:#3b4252">
             We received a request to reset your password. This link is valid for 1 hour.
           </p>
           <p style="margin:24px 0">
             <a href="${url}" style="background:#c8102e;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px">
               Reset password
             </a>
           </p>
           <p style="font-size:13px;color:#8a93a6">If you didn't request this, you can safely ignore this email.</p>`,
        ),
      });
    }
  } catch {
    // Swallow errors to avoid leaking account existence / DB state.
  }

  return NextResponse.json({ ok: true });
}
