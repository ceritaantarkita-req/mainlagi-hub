"use server";

import { getServerClient } from "@/lib/auth/supabase-server";
import { adminDeleteUser } from "@/lib/auth/supabase-server-admin";

/**
 * Deletes the currently authenticated user and its cascaded rows.
 * Requires the service-role key (server-only).
 */
export async function deleteAccountAction(): Promise<void> {
  const supabase = await getServerClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
  const { data } = await supabase.auth.getUser();
  const id = data?.user?.id;
  if (!id) throw new Error("Belum login.");
  await adminDeleteUser(id);
}

/**
 * Updates the current user's display name (profiles row only).
 */
export async function updateDisplayNameAction(displayName: string): Promise<void> {
  const supabase = await getServerClient();
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
  const { data } = await supabase.auth.getUser();
  const id = data?.user?.id;
  if (!id) throw new Error("Belum login.");
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
