import "server-only";

import { getAdminClient } from "@/lib/auth/supabase-server-admin";
import { GAMES, type GameSlug } from "@/lib/data/games";

export interface DailyPoint {
  key: string;
  label: string;
  value: number;
}

export interface RankedItem {
  label: string;
  value: number;
}

export interface AdminMetrics {
  /** false when SUPABASE_SERVICE_ROLE_KEY is not configured -- every number below is a zeroed placeholder. */
  configured: boolean;
  /** true when one or more count queries failed (e.g. Supabase momentarily unreachable). */
  countsFailed: boolean;
  counts: {
    accounts: number;
    players: number;
    sessions: number;
    articles: number;
    affiliateClicks: number;
  };
  accountsDaily: DailyPoint[];
  sessionsDaily: DailyPoint[];
  clicksDaily: DailyPoint[];
  topGames: RankedItem[];
  topAffiliate: RankedItem[];
}

export const DEFAULT_WINDOW_DAYS = 14;
export const WINDOW_DAY_OPTIONS = [7, 14, 30] as const;
const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildDayBuckets(days: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    out.push({ key: dayKey(d), label: `${d.getUTCDate()} ${MONTHS_ID[d.getUTCMonth()]}` });
  }
  return out;
}

function bucketize(timestamps: string[], days: number): DailyPoint[] {
  const buckets = buildDayBuckets(days);
  const tally = new Map<string, number>();
  for (const at of timestamps) {
    const key = at.slice(0, 10);
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  return buckets.map((b) => ({ key: b.key, label: b.label, value: tally.get(b.key) ?? 0 }));
}

function emptyMetrics(days: number): AdminMetrics {
  return {
    configured: false,
    countsFailed: true,
    counts: { accounts: 0, players: 0, sessions: 0, articles: 0, affiliateClicks: 0 },
    accountsDaily: bucketize([], days),
    sessionsDaily: bucketize([], days),
    clicksDaily: bucketize([], days),
    topGames: [],
    topAffiliate: []
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function safeCount(supabase: any, table: string): Promise<{ value: number; failed: boolean }> {
  try {
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    return { value: count ?? 0, failed: false };
  } catch {
    return { value: 0, failed: true };
  }
}

/**
 * Reads every number the admin dashboard shows using the service-role client,
 * never the session-bound one. `game_sessions`, `game_scores` and
 * `player_profiles` are RLS-restricted to `account_id = auth.uid()` with no
 * admin bypass (see the policy list in docs/adr-0001-architecture.md), so a
 * session-scoped read here would only ever show the signed-in owner's own
 * rows -- silently wrong, not merely incomplete. Never throws: any failure
 * degrades to zeroed data plus a flag, same convention as requireOwner().
 */
export async function getAdminMetrics(days: number = DEFAULT_WINDOW_DAYS): Promise<AdminMetrics> {
  const supabase = await getAdminClient();
  if (!supabase) return emptyMetrics(days);

  const since = new Date(Date.now() - (days - 1) * 86_400_000).toISOString();

  const [accounts, players, sessions, articles, affiliateClicks] = await Promise.all([
    safeCount(supabase, "profiles"),
    safeCount(supabase, "player_profiles"),
    safeCount(supabase, "game_sessions"),
    safeCount(supabase, "articles"),
    safeCount(supabase, "affiliate_clicks")
  ]);
  const countsFailed = [accounts, players, sessions, articles, affiliateClicks].some((c) => c.failed);

  let accountsDaily = bucketize([], days);
  let sessionsDaily = bucketize([], days);
  let clicksDaily = bucketize([], days);
  let topGames: RankedItem[] = [];
  let topAffiliate: RankedItem[] = [];

  try {
    const { data } = await supabase.from("profiles").select("created_at").gte("created_at", since);
    accountsDaily = bucketize((data ?? []).map((r: { created_at: string }) => r.created_at), days);
  } catch {
    // keep zeroed buckets
  }

  try {
    const { data } = await supabase
      .from("game_sessions")
      .select("started_at, game_slug")
      .gte("started_at", since);
    const rows = (data ?? []) as { started_at: string; game_slug: string }[];
    sessionsDaily = bucketize(rows.map((r) => r.started_at), days);

    const tally = new Map<string, number>();
    for (const r of rows) tally.set(r.game_slug, (tally.get(r.game_slug) ?? 0) + 1);
    topGames = [...tally.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([slug, value]) => ({ label: GAMES[slug as GameSlug]?.shortTitle ?? slug, value }));
  } catch {
    // keep zeroed buckets
  }

  try {
    const { data } = await supabase
      .from("affiliate_clicks")
      .select("created_at, affiliate_item_id")
      .gte("created_at", since);
    const rows = (data ?? []) as { created_at: string; affiliate_item_id: string }[];
    clicksDaily = bucketize(rows.map((r) => r.created_at), days);

    const tally = new Map<string, number>();
    for (const r of rows) tally.set(r.affiliate_item_id, (tally.get(r.affiliate_item_id) ?? 0) + 1);
    const topIds = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    if (topIds.length > 0) {
      const { data: items } = await supabase
        .from("affiliate_items")
        .select("id, title")
        .in("id", topIds.map(([id]) => id));
      const titleById = new Map((items ?? []).map((i: { id: string; title: string }) => [i.id, i.title]));
      topAffiliate = topIds.map(([id, value]) => ({ label: titleById.get(id) ?? "Produk", value }));
    }
  } catch {
    // keep zeroed buckets
  }

  return {
    configured: true,
    countsFailed,
    counts: {
      accounts: accounts.value,
      players: players.value,
      sessions: sessions.value,
      articles: articles.value,
      affiliateClicks: affiliateClicks.value
    },
    accountsDaily,
    sessionsDaily,
    clicksDaily,
    topGames,
    topAffiliate
  };
}
