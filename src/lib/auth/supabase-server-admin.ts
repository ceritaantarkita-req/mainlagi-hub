import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-only admin operations (e.g. deleting an auth
 * user). Never expose this client or the service-role key to the browser.
 */
export async function getAdminClient(): Promise<SupabaseClient | null> {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !serviceRole) return null;
  return createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

/**
 * Delete a user and its cascaded rows. Server-only; requires the service-role
 * key. Throws when the key is not configured.
 */
export async function adminDeleteUser(userId: string): Promise<void> {
  const admin = await getAdminClient();
  if (!admin) throw new Error("Service role tidak dikonfigurasi.");
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}
