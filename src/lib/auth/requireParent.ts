import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getServerClient } from "./supabase-server";

export type ParentSessionGate =
  | { mode: "unconfigured" }
  | { mode: "denied" }
  | { mode: "authenticated"; supabase: SupabaseClient; userId: string };

/**
 * Parent routes fail closed whenever the production Supabase backend is
 * configured: a valid server-verified user session is required. Local
 * development without Supabase stays usable for the explicit guest prototype.
 */
export async function requireParentSession(): Promise<ParentSessionGate> {
  const supabase = await getServerClient();
  if (!supabase) return { mode: "unconfigured" };

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return { mode: "denied" };
    return { mode: "authenticated", supabase, userId: data.user.id };
  } catch {
    return { mode: "denied" };
  }
}

async function accountOwnsChild(
  supabase: SupabaseClient,
  userId: string,
  childId: string
): Promise<boolean> {
  if (childId === "demo-gian") return true;
  try {
    const { data, error } = await supabase
      .from("player_profiles")
      .select("id")
      .eq("id", childId)
      .eq("account_id", userId)
      .is("deleted_at", null)
      .maybeSingle();
    return !error && Boolean(data?.id);
  } catch {
    return false;
  }
}

/**
 * Parent child routes always require an authenticated account in configured
 * production and then enforce child ownership. The demo child is an explicit
 * account-scoped sandbox sentinel.
 */
export async function parentCanAccessChild(childId: string): Promise<boolean> {
  const gate = await requireParentSession();
  if (gate.mode === "unconfigured") return true;
  if (gate.mode !== "authenticated") return false;
  return accountOwnsChild(gate.supabase, gate.userId, childId);
}

/**
 * Child mode preserves unauthenticated local/guest play. If an authenticated
 * account is present, however, a real cloud child URL must belong to that
 * account. This prevents direct URL manipulation from exposing another
 * account's child shell while keeping the intentional guest fallback intact.
 */
export async function learningChildCanAccess(childId: string): Promise<boolean> {
  const gate = await requireParentSession();
  if (gate.mode === "unconfigured" || gate.mode === "denied") return true;
  return accountOwnsChild(gate.supabase, gate.userId, childId);
}
