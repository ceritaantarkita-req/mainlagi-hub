"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

function configured(): { url: string; anon: string } | null {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return url && anon ? { url, anon } : null;
}

let browser: SupabaseClient | null = null;

/**
 * Browser Supabase client (cookie-session aware via @supabase/ssr).
 *
 * Returns null when Supabase is not configured (mock/guest mode), so callers
 * can fall back gracefully. Sessions are held on cookies, not localStorage.
 * The cookie name matches the server client and proxy (defaults).
 */
export function getBrowserClient(): SupabaseClient | null {
  const cfg = configured();
  if (!cfg) return null;
  if (browser) return browser;
  browser = createBrowserClient(cfg.url, cfg.anon);
  return browser;
}

export function hasSupabaseConfig(): boolean {
  return configured() !== null;
}
