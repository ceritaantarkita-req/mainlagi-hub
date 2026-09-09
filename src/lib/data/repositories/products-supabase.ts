import type { AffiliateItem } from "../domain";
import type { ProductRepository } from "./contracts";

interface DbAffiliateRow {
  id: string;
  slug: string;
  title: string;
  image_url: string;
  destination_url: string;
  active: boolean;
  sort_order: number;
  disclosure: string | null;
}

const COLUMNS =
  "id,slug,title,image_url,destination_url,active,sort_order,disclosure";

function supabaseEnv(): { url: string; anon: string } {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return { url, anon };
}

function toAffiliateItem(row: DbAffiliateRow): AffiliateItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    imageUrl: row.image_url,
    destinationUrl: row.destination_url,
    active: row.active,
    sortOrder: row.sort_order,
    disclosure: row.disclosure ?? "Tautan afiliasi"
  };
}

async function listFromSupabase(): Promise<AffiliateItem[] | null> {
  const { url, anon } = supabaseEnv();
  if (!url || !anon) return null;

  try {
    const response = await fetch(
      `${url}/rest/v1/affiliate_items?select=${COLUMNS}&active=eq.true&order=sort_order.asc`,
      {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        cache: "no-store"
      }
    );
    if (!response.ok) return null;
    const rows = (await response.json()) as DbAffiliateRow[];
    return rows.map(toAffiliateItem);
  } catch {
    return null;
  }
}

/**
 * Public product reads use the same Supabase rows written by the owner CMS.
 * Static catalog data stays available as an operational fallback for local
 * development or a temporarily unavailable backend.
 *
 * Click recording remains owned by `/go/[slug]`: that server route performs
 * destination validation, rate limiting, and service-role logging. The legacy
 * repository method delegates to the fallback implementation so no client-side
 * service credential or direct click insert is introduced here.
 */
export function createSupabaseProductRepository(
  fallback: ProductRepository
): ProductRepository {
  return {
    async listActive() {
      const rows = await listFromSupabase();
      return rows === null || rows.length === 0 ? fallback.listActive() : rows;
    },
    recordClick(itemId, referrer, userAgentHash) {
      return fallback.recordClick(itemId, referrer, userAgentHash);
    }
  };
}
