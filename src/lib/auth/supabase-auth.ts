"use client";

import { getBrowserClient, hasSupabaseConfig } from "./supabase-client";
import { safeSupabaseCall } from "./supabase-fetch";

/**
 * Supabase auth facade.
 *
 * Unlike the previous localStorage-JWT approach, the session is held on
 * HttpOnly cookies via `@supabase/ssr` (browser client + middleware). On the
 * client we only read the session; we never persist tokens in localStorage.
 *
 * Every function no-ops / returns null when Supabase is not configured, so the
 * app runs in guest/mock mode without a backend. Reads (`getCurrentUser`,
 * `getCurrentUserId`, `getValidAccessToken`) also fall back to that same
 * guest state if the network call itself fails -- a paused Supabase project
 * or a timeout degrades to "not logged in" instead of throwing and breaking
 * the page. Actions the user directly triggers (sign in, exchange code) are
 * left to throw/report normally, since the caller shows the real error.
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

/**
 * Verifies an email OTP / token_hash link (signup confirmation, magic link,
 * email change). Used instead of exchangeAuthCode when the email template
 * links straight to our own route with `token_hash` + `type` — this avoids
 * the PKCE code_verifier problem when the link is opened in a different
 * browser/profile than the one that triggered the request (see
 * ResetPasswordForm.tsx for the same pattern on password recovery).
 */
export async function verifyEmailOtp(
  tokenHash: string,
  type: "signup" | "email_change" | "invite" | "magiclink"
): Promise<void> {
  const client = getBrowserClient();
  if (!client) throw new Error("Supabase belum dikonfigurasi.");
  const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type });
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<{ email: string; name: string } | null> {
  const client = getBrowserClient();
  if (!client) return null;
  return safeSupabaseCall(async () => {
    const { data } = await client.auth.getUser();
    const user = data?.user;
    if (!user) return null;
    const email = user.email ?? "Akun Google";
    const metadataName = user.user_metadata?.full_name;
    const name = typeof metadataName === "string" ? metadataName : email.split("@")[0] ?? "User";
    return { email, name };
  }, null);
}

export async function getCurrentUserId(): Promise<string | null> {
  const client = getBrowserClient();
  if (!client) return null;
  return safeSupabaseCall(async () => {
    const { data } = await client.auth.getUser();
    return data?.user?.id ?? null;
  }, null);
}

export async function getValidAccessToken(): Promise<string | null> {
  const client = getBrowserClient();
  if (!client) return null;
  return safeSupabaseCall(async () => {
    const { data } = await client.auth.getSession();
    return data.session?.access_token ?? null;
  }, null);
}

export async function signOut(): Promise<void> {
  const client = getBrowserClient();
  if (!client) return;
  await safeSupabaseCall(async () => {
    await client.auth.signOut();
  }, undefined);
}
