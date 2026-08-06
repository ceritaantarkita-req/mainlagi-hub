import { NextResponse } from "next/server";
import { getAffiliateItem } from "@/lib/data/affiliate";

interface DatabaseAffiliateItem {
  id: string;
  destination_url: string;
}

function safeDestination(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
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
  const userAgent = request.headers.get("user-agent") ?? "";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(userAgent)
  );
  const userAgentHash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
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
