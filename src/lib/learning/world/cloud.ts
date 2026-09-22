"use client";

import { getCurrentUserId, getValidAccessToken, isSupabaseConfigured } from "@/lib/auth/supabase-auth";
import { getBrowserClient } from "@/lib/auth/supabase-client";
import { MONEY_WORLD_ID, MONEY_WORLD_STAGES } from "./moneyWorld";
import type { MoneyWorldProgress } from "./progress";

const VALID_STAGE_IDS = new Set(MONEY_WORLD_STAGES.map((stage) => stage.id));

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && VALID_STAGE_IDS.has(item));
}

function normalizeCloudWorldProgress(row: Record<string, unknown>): MoneyWorldProgress | null {
  if (row.world_id !== MONEY_WORLD_ID) return null;
  const currentStageId = typeof row.current_stage_id === "string" && VALID_STAGE_IDS.has(row.current_stage_id)
    ? row.current_stage_id
    : null;
  const rawIndex = Number(row.current_segment_index);
  return {
    worldId: MONEY_WORLD_ID,
    completedStageIds: stringArray(row.completed_stage_ids),
    currentStageId,
    currentSegmentIndex: Number.isInteger(rawIndex) && rawIndex >= 0 ? rawIndex : 0,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : ""
  };
}

/**
 * Cloud state is optional. null means no authenticated/configured cloud context
 * or a failed read, not "empty progress".
 */
export async function readCloudMoneyWorldProgress(childId: string): Promise<MoneyWorldProgress | null> {
  const client = getBrowserClient();
  const accountId = await getCurrentUserId();
  if (!client || !accountId) return null;

  try {
    const { data, error } = await client
      .from("child_world_progress")
      .select("world_id,completed_stage_ids,current_stage_id,current_segment_index,updated_at")
      .eq("account_id", accountId)
      .eq("child_key", childId)
      .eq("world_id", MONEY_WORLD_ID)
      .maybeSingle();

    if (error || !data) return null;
    return normalizeCloudWorldProgress(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

/**
 * Persists only World narrative/stage progress. This RPC is deliberately
 * separate from record_learning_attempt, child_skill_mastery, achievements,
 * and certificates.
 */
export async function syncMoneyWorldProgressCloud(
  childId: string,
  progress: MoneyWorldProgress
): Promise<boolean> {
  if (!isSupabaseConfigured() || progress.worldId !== MONEY_WORLD_ID) return false;
  const token = await getValidAccessToken();
  if (!token) return false;

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anon) return false;

  try {
    const response = await fetch(`${url}/rest/v1/rpc/save_world_progress`, {
      method: "POST",
      headers: {
        apikey: anon,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        p_child_key: childId,
        p_world_id: MONEY_WORLD_ID,
        p_completed_stage_ids: progress.completedStageIds,
        p_current_stage_id: progress.currentStageId,
        p_current_segment_index: progress.currentSegmentIndex
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}
