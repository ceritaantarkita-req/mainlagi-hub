/**
 * Shared network resilience for Supabase calls.
 *
 * Two problems this solves:
 *  1. A paused/unreachable Supabase project (e.g. free-tier auto-pause after
 *     a period of no activity) can make requests hang far longer than a page
 *     load should wait. `timeoutFetch` bounds every Supabase HTTP call so a
 *     stuck project degrades in seconds, not indefinitely.
 *  2. Callers throughout the app (see `supabase-auth.ts`, `requireOwner.ts`)
 *     wrap Supabase calls with `safeSupabaseCall` so a network failure -- a
 *     paused project, a DNS hiccup, a timeout -- is treated the same as
 *     "not logged in" / "not configured" instead of crashing the page.
 */

const DEFAULT_TIMEOUT_MS = 8000;

/**
 * A `fetch` implementation with a bounded timeout, suitable for the
 * `global.fetch` option of `createBrowserClient` / `createServerClient`.
 */
export function timeoutFetch(timeoutMs = DEFAULT_TIMEOUT_MS): typeof fetch {
  return (input: RequestInfo | URL, init?: RequestInit) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(input, { ...init, signal: init?.signal ?? controller.signal }).finally(() =>
      clearTimeout(timer)
    );
  };
}

/**
 * Runs a Supabase call and swallows any thrown error (network failure,
 * timeout, paused project), returning `fallback` instead. Supabase's own
 * `{ data, error }` results are untouched -- this only guards against the
 * call throwing, which is what happens when the network itself fails.
 */
export async function safeSupabaseCall<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[supabase] call failed, falling back:", error);
    }
    return fallback;
  }
}
