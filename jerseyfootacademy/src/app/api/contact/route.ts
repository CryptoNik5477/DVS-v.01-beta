import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail, emailLayout, isEmailConfigured } from "@/lib/email";
import { siteConfig } from "@/config/site";
import { sanitizeText } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  subject: z.string().max(150).optional(),
  message: z.string().min(5).max(3000),
  // Honeypot: bots fill hidden fields; humans leave it empty.
  company: z.string().max(0).optional(),
});

/** Contact form → emails the store inbox with the visitor's address as reply-to. */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all fields correctly." }, { status: 400 });
  }
  const { name, email, subject, message } = parsed.data;

  if (!isEmailConfigured) {
    // No email provider configured yet — accept gracefully so the UI works,
    // but signal that delivery isn't wired (visible only in server logs).
    console.warn("[contact] RESEND_API_KEY not set — message not delivered:", { name, email });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await sendEmail({
    to: siteConfig.contact.email,
    replyTo: email,
    subject: `[Contact] ${subject ? sanitizeText(subject, 150) : "New message"} — ${sanitizeText(name, 100)}`,
    html: emailLayout(
      "New contact message",
      `<p style="font-size:14px;color:#3b4252"><strong>From:</strong> ${sanitizeText(name, 100)} &lt;${email}&gt;</p>
       ${subject ? `<p style="font-size:14px;color:#3b4252"><strong>Subject:</strong> ${sanitizeText(subject, 150)}</p>` : ""}
       <p style="font-size:15px;line-height:1.6;color:#0b132b;white-space:pre-wrap">${sanitizeText(message, 3000)}</p>`,
    ),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
