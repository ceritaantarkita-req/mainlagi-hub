import { NextResponse } from "next/server";
import { AFFILIATE_ITEMS } from "@/lib/data/affiliate";

interface DatabaseAffiliateItem {
  slug: string;
  title: string;
  platform: "Shopee" | "TikTok Shop";
  category: string;
  image_url: string;
  destination_url: string;
}

export async function GET() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anon) return NextResponse.json(AFFILIATE_ITEMS);

  try {
    const response = await fetch(
      `${url}/rest/v1/affiliate_items?select=slug,title,platform,category,image_url,destination_url&active=eq.true&order=sort_order.asc`,
      {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        cache: "no-store"
      }
    );
    if (!response.ok) throw new Error(`Supabase affiliate read failed (${response.status})`);
    const rows = (await response.json()) as DatabaseAffiliateItem[];
    if (!rows.length) return NextResponse.json(AFFILIATE_ITEMS);
    return NextResponse.json(
      rows.map((row) => ({
        slug: row.slug,
        title: row.title,
        platform: row.platform,
        category: row.category,
        image: row.image_url,
        href: row.destination_url,
        note: "Tautan afiliasi"
      }))
    );
  } catch {
    return NextResponse.json(AFFILIATE_ITEMS);
  }
}
