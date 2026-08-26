import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getServerClient } from "./supabase-server";

/**
 * Server-side owner gate (docs/tickets.md T-503, docs/adr-0001-architecture.md).
 *
 * Admin access is authorized by `profiles.role === "owner"` in the database,
 * checked here on the server. Never gate an admin page by comparing an email
 * address in client-side JavaScript (NEXT_PUBLIC_* env vars are readable by
 * anyone who opens devtools) -- that pattern was removed from
 * src/app/admin/affiliate/page.tsx on 2026-08-26; see project audit notes.
 *
 * Use this at the top of every /admin/* server component:
 *
 *   const gate = await requireOwner();
 *   if (!gate.ok) return <AdminGate title="..." reason={gate.reason} />;
 *   const { supabase } = gate;
 */
export type OwnerGateResult =
  | { ok: true; supabase: SupabaseClient; userId: string; email: string | null }
  | { ok: false; reason: string };

export async function requireOwner(): Promise<OwnerGateResult> {
  const supabase = await getServerClient();
  if (!supabase) return { ok: false, reason: "Supabase belum dikonfigurasi." };

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return { ok: false, reason: "Login diperlukan." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") {
    return { ok: false, reason: "Hanya owner yang boleh mengakses halaman ini." };
  }

  return { ok: true, supabase, userId: user.id, email: user.email ?? null };
}
