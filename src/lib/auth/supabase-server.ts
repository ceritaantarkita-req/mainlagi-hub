import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { timeoutFetch } from "./supabase-fetch";

function configured(): { url: string; anon: string } | null {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return url && anon ? { url, anon } : null;
}

/**
 * Server Supabase client for Server Components and Route Handlers.
 *
 * Reads/writes the request cookies so the session is carried on HttpOnly
 * cookies. Returns null when Supabase is not configured (mock/guest mode).
 */
export async function getServerClient(): Promise<SupabaseClient | null> {
  const cfg = configured();
  if (!cfg) return null;

  const cookieStore = await cookies();
  return createServerClient(cfg.url, cfg.anon, {
    global: { fetch: timeoutFetch() },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Setting cookies in a Server Component throws; middleware handles it.
        }
      }
    }
  });
}
