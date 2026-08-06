"use client";

const STORAGE_KEY = "mainlagi-supabase-session-v1";
const VERIFIER_KEY = "mainlagi-supabase-pkce-verifier";

interface StoredSession {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user?: { email?: string; user_metadata?: Record<string, unknown> };
}

function config() {
  return {
    url: (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, ""),
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  };
}

function base64Url(bytes: Uint8Array): string {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomVerifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(48));
  return base64Url(bytes);
}

async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

export function isSupabaseConfigured(): boolean {
  const { url, anon } = config();
  return Boolean(url && anon);
}

export async function startGoogleLogin(): Promise<void> {
  if (!isSupabaseConfigured()) {
    window.alert("Google Login belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY pada .env.local.");
    return;
  }
  const { url } = config();
  const verifier = randomVerifier();
  const challenge = await challengeFor(verifier);
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  const callback = `${window.location.origin}/auth/callback`;
  const authorize = new URL(`${url}/auth/v1/authorize`);
  authorize.searchParams.set("provider", "google");
  authorize.searchParams.set("redirect_to", callback);
  authorize.searchParams.set("code_challenge", challenge);
  authorize.searchParams.set("code_challenge_method", "s256");
  window.location.assign(authorize.toString());
}

export async function exchangeAuthCode(code: string): Promise<void> {
  const { url, anon } = config();
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!url || !anon || !verifier) throw new Error("Konfigurasi atau PKCE verifier tidak tersedia.");
  const response = await fetch(`${url}/auth/v1/token?grant_type=pkce`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anon },
    body: JSON.stringify({ auth_code: code, code_verifier: verifier })
  });
  if (!response.ok) throw new Error(`Login gagal (${response.status}).`);
  const session = await response.json() as StoredSession;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  sessionStorage.removeItem(VERIFIER_KEY);
}

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as StoredSession : null;
  } catch { return null; }
}

function storeSession(session: StoredSession): StoredSession {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

async function validSession(): Promise<StoredSession | null> {
  const session = readSession();
  if (!session?.access_token) return null;
  const expiresSoon =
    typeof session.expires_at === "number" &&
    session.expires_at <= Math.floor(Date.now() / 1000) + 60;
  if (!expiresSoon || !session.refresh_token || !isSupabaseConfigured()) return session;

  const { url, anon } = config();
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anon },
    body: JSON.stringify({ refresh_token: session.refresh_token })
  });
  if (!response.ok) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
  return storeSession(await response.json() as StoredSession);
}

export async function getCurrentUser(): Promise<{ email: string; name: string } | null> {
  if (typeof window === "undefined") return null;
  const session = await validSession();
  if (!session?.access_token || !isSupabaseConfigured()) return null;
  const { url, anon } = config();
  const response = await fetch(`${url}/auth/v1/user`, { headers: { Authorization: `Bearer ${session.access_token}`, apikey: anon } });
  if (!response.ok) return null;
  const user = await response.json() as { email?: string; user_metadata?: Record<string, unknown> };
  const email = user.email ?? "Akun Google";
  const metadataName = user.user_metadata?.full_name;
  return { email, name: typeof metadataName === "string" ? metadataName : email.split("@")[0] ?? "User" };
}

export function getAccessToken(): string | null { return readSession()?.access_token ?? null; }
export async function getValidAccessToken(): Promise<string | null> { return (await validSession())?.access_token ?? null; }

export async function signOut(): Promise<void> {
  const session = readSession();
  const { url, anon } = config();
  if (session?.access_token && url && anon) {
    await fetch(`${url}/auth/v1/logout`, { method: "POST", headers: { Authorization: `Bearer ${session.access_token}`, apikey: anon } }).catch(() => undefined);
  }
  localStorage.removeItem(STORAGE_KEY);
}
