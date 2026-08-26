"use client";

import { getBrowserClient, hasSupabaseConfig } from "./supabase-client";

/**
 * Supabase auth facade.
 *
 * Unlike the previous localStorage-JWT approach, the session is held on
 * HttpOnly cookies via `@supabase/ssr` (browser client + middleware). On the
 * client we only read the session; we never persist tokens in localStorage.
 *
 * Every function no-ops / returns null when Supabase is not configured, so the
 * app runs in guest/mock mode without a backend.
 */

export function isSupabaseConfigured(): boolean {
  return hasSupabaseConfig();
}

export async function startGoogleLogin(): Promise<void> {
  const client = getBrowserClient();
  if (!client) {
    window.alert(
      "Google Login belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY pada .env.local."
    );
    return;
  }
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo }
  });
  if (error) window.alert(error.message);
}

export async function exchangeAuthCode(code: string): Promise<void> {
  const client = getBrowserClient();
  if (!client) throw new Error("Supabase belum dikonfigurasi.");
  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<{ email: string; name: string } | null> {
  const client = getBrowserClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  const user = data?.user;
  if (!user) return null;
  const email = user.email ?? "Akun Google";
  const metadataName = user.user_metadata?.full_name;
  const name = typeof metadataName === "string" ? metadataName : email.split("@")[0] ?? "User";
  return { email, name };
}

export async function getCurrentUserId(): Promise<string | null> {
  const client = getBrowserClient();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data?.user?.id ?? null;
}

export async function getValidAccessToken(): Promise<string | null> {
  const client = getBrowserClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function signOut(): Promise<void> {
  const client = getBrowserClient();
  if (client) await client.auth.signOut();
}
