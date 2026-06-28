import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailLayout } from "@/lib/email";
import { siteConfig } from "@/config/site";

const schema = z.object({ email: z.string().email().max(200) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }
  const { email } = parsed.data;

  // Only send the welcome email on a genuinely new subscription.
  let isNew = true;
  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    isNew = !existing;
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  } catch {
    // DB not configured — still attempt to send a welcome email below.
  }

  if (isNew) {
    // Best-effort: no-ops if RESEND_API_KEY is not configured.
    await sendEmail({
      to: email,
      subject: `Welcome to the ${siteConfig.name} Academy ⚽`,
      html: emailLayout(
        "You're in! 🎉",
        `<p style="font-size:15px;line-height:1.6;color:#3b4252">
           Thanks for joining <strong>${siteConfig.name}</strong>. You'll be first to hear about new
           kits, exclusive World Cup 2026 drops and members-only offers.
         </p>
         <p style="margin:24px 0">
           <a href="${siteConfig.url}/world-cup"
              style="background:#c8102e;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px">
             Shop the World Cup 2026 collection
           </a>
         </p>
         <p style="font-size:13px;color:#8a93a6">Support Your Team. Wear The Passion.</p>`,
      ),
    });
  }

  return NextResponse.json({ ok: true });
}
