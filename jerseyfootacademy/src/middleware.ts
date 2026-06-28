import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Edge middleware:
 *  1. Best-effort in-memory rate limiting for auth & checkout endpoints
 *     (mitigates brute-force / abuse). For multi-instance production, back this
 *     with Upstash Redis or Vercel KV — the interface is intentionally small.
 *  2. Admin route protection (requires an ADMIN-role session).
 */

const WINDOW_MS = 60_000;
const MAX_HITS = 20;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_HITS;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // 1. Rate limit sensitive POST endpoints.
  const rateLimitedPaths = [
    "/api/auth/callback/credentials",
    "/api/register",
    "/api/checkout",
    "/api/reviews",
    "/api/account/forgot",
  ];
  if (req.method === "POST" && rateLimitedPaths.some((p) => pathname.startsWith(p))) {
    if (rateLimited(`${ip}:${pathname}`)) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }
  }

  // 2. Protect the admin dashboard.
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = new URL("/account/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if ((token as { role?: string }).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
