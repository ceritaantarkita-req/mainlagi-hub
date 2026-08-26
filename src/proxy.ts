import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function configured(): { url: string; anon: string } | null {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return url && anon ? { url, anon } : null;
}

/**
 * Next 16 "proxy" (formerly middleware). Refreshes the Supabase auth session
 * on eligible requests.
 *
 * When Supabase is not configured (mock/guest mode) it is a no-op, so the app
 * runs without a backend. The session is carried on HttpOnly cookies; no token
 * is persisted in localStorage.
 */
export async function proxy(request: NextRequest) {
  const cfg = configured();

  let response = NextResponse.next({ request });
  if (!cfg) return response;

  const supabase = createServerClient(cfg.url, cfg.anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js|wasm|task|manifest.webmanifest)$).*)"
  ]
};
