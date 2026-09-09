import { NextResponse } from "next/server";
import { getAffiliateItem } from "@/lib/data/affiliate";

interface DatabaseAffiliateItem {
  id: string;
  destination_url: string;
}

const ALLOWED_AFFILIATE_HOST_SUFFIXES = ["shopee.co.id", "tiktok.com"] as const;
const REDIRECT_WINDOW_MS = 60_000;
const MAX_REDIRECTS_PER_WINDOW = 30;
const MAX_RATE_BUCKETS = 2_000;

interface RateBucket {
  count: number;
  resetAt: number;
}

/**
 * Best-effort isolate-local limiter for the current Cloudflare Workers runtime.
 * It intentionally stores only a one-way client fingerprint, never a raw IP.
 * This is not a globally consistent rate limiter across Worker isolates; move the
 * bucket to a shared Cloudflare primitive (for example Durable Objects) if a
 * stronger cross-isolate enforcement boundary becomes necessary.
 */
const redirectBuckets = new Map<string, RateBucket>();

function isAllowedAffiliateHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return ALLOWED_AFFILIATE_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`)
  );
}

export function safeDestination(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (!isAllowedAffiliateHost(url.hostname)) return null;
    if (url.username || url.password) return null;
    if (url.port && url.port !== "443") return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function clientFingerprint(request: Request): Promise<string> {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const realIp = request.headers.get("x-real-ip")?.trim() ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";
  return sha256Hex(`${forwarded || realIp}|${userAgent}`);
}

async function rateLimitRetryAfter(request: Request): Promise<number | null> {
  const now = Date.now();

  if (redirectBuckets.size >= MAX_RATE_BUCKETS) {
    for (const [key, bucket] of redirectBuckets) {
      if (bucket.resetAt <= now) redirectBuckets.delete(key);
    }
    // Bound memory even if every request comes from a fresh fingerprint.
    while (redirectBuckets.size >= MAX_RATE_BUCKETS) {
      const oldest = redirectBuckets.keys().next().value as string | undefined;
      if (!oldest) break;
      redirectBuckets.delete(oldest);
    }
  }

  const key = await clientFingerprint(request);
  const existing = redirectBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    redirectBuckets.set(key, { count: 1, resetAt: now + REDIRECT_WINDOW_MS });
    return null;
  }

  if (existing.count >= MAX_REDIRECTS_PER_WINDOW) {
    return Math.max(1, Math.ceil((existing.resetAt - now) / 1_000));
  }

  existing.count += 1;
  return null;
}

async function databaseItem(slug: string): Promise<DatabaseAffiliateItem | null> {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anon) return null;
  const response = await fetch(
    `${url}/rest/v1/affiliate_items?select=id,destination_url&slug=eq.${encodeURIComponent(slug)}&active=eq.true&limit=1`,
    { headers: { apikey: anon, Authorization: `Bearer ${anon}` }, cache: "no-store" }
  );
  if (!response.ok) return null;
  const rows = (await response.json()) as DatabaseAffiliateItem[];
  return rows[0] ?? null;
}

async function recordClick(request: Request, itemId: string): Promise<void> {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !serviceRole) return;
  const userAgentHash = await sha256Hex(request.headers.get("user-agent") ?? "");
  await fetch(`${url}/rest/v1/affiliate_clicks`, {
    method: "POST",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      affiliate_item_id: itemId,
      referrer: (request.headers.get("referer") ?? "").slice(0, 500),
      user_agent_hash: userAgentHash
    })
  }).catch(() => undefined);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const retryAfter = await rateLimitRetryAfter(request);
  if (retryAfter !== null) {
    return new NextResponse("Terlalu banyak permintaan. Coba lagi sebentar.", {
      status: 429,
      headers: { "Retry-After": String(retryAfter) }
    });
  }

  const { slug } = await params;
  const database = await databaseItem(slug).catch(() => null);
  const fallback = getAffiliateItem(slug);
  const destination = safeDestination(database?.destination_url ?? fallback?.href ?? "");
  if (!destination) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }
  if (database?.id) await recordClick(request, database.id);
  return NextResponse.redirect(destination, 302);
}
