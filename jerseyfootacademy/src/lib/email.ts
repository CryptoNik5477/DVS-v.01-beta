import { siteConfig } from "@/config/site";

/**
 * Lightweight email sender using the Resend REST API (no SDK dependency).
 * If RESEND_API_KEY is not set, it no-ops gracefully so the app still works
 * in development / demo mode.
 *
 * Setup: create a key at https://resend.com, verify your sending domain, and
 * set RESEND_API_KEY + EMAIL_FROM (e.g. "JerseyFootAcademy <hello@yourdomain>").
 */
export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput): Promise<SendEmailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, skipped: true };

  const from = process.env.EMAIL_FROM ?? `${siteConfig.name} <onboarding@resend.dev>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
    });
    if (!res.ok) {
      return { ok: false, error: `Resend responded ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Shared branded email wrapper (inline styles for max client compatibility). */
export function emailLayout(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f8f7f3;font-family:Arial,Helvetica,sans-serif;color:#0b132b">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f3;padding:24px 0">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #eceae2">
        <tr><td style="background:#0b132b;padding:22px 28px">
          <span style="color:#fff;font-size:20px;font-weight:800">Jersey<span style="color:#ff4d6d">Foot</span></span>
          <span style="color:#d4af37;font-size:12px;letter-spacing:3px;font-weight:700;margin-left:6px">ACADEMY</span>
        </td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 14px;font-size:22px;color:#0b132b">${title}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="background:#0b132b;padding:18px 28px;color:#9aa3b8;font-size:12px">
          © ${new Date().getFullYear()} ${siteConfig.name} · Ships from ${siteConfig.shipsFrom}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
