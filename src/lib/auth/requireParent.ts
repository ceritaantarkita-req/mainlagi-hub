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

/**
 * Verifies that a child route belongs to the authenticated account. The demo
 * child is an explicit sandbox sentinel; its learning rows are still scoped by
 * account_id in RLS. All real child profiles must exist, be undeleted, and be
 * owned by the current account.
 */
export async function parentCanAccessChild(childId: string): Promise<boolean> {
  const gate = await requireParentSession();
  if (gate.mode === "unconfigured") return true;
  if (gate.mode !== "authenticated") return false;
  if (childId === "demo-gian") return true;

  try {
    const { data, error } = await gate.supabase
      .from("player_profiles")
      .select("id")
      .eq("id", childId)
      .eq("account_id", gate.userId)
      .is("deleted_at", null)
      .maybeSingle();
    return !error && Boolean(data?.id);
  } catch {
    return false;
  }
}
