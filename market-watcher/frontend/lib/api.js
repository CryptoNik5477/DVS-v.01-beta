// Tiny API client for the dashboard. Reads the backend base URL from env.
// In the browser, NEXT_PUBLIC_API_BASE is inlined at build time.

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "";

export async function api(path) {
  const headers = {};
  if (TOKEN) headers["Authorization"] = `Bearer ${TOKEN}`;
  const res = await fetch(`${BASE}/api${path}`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}
