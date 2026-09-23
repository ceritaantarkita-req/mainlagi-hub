"use client";

import { getCurrentUserId } from "@/lib/auth/supabase-auth";
import { getBrowserClient } from "@/lib/auth/supabase-client";
import { MONEY_WORLD_ID, MONEY_WORLD_STAGES } from "./moneyWorld";
import type { MoneyWorldProgress } from "./progress";

const VALID_STAGE_IDS = new Set(MONEY_WORLD_STAGES.map((stage) => stage.id));

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && VALID_STAGE_IDS.has(item));
}

function emptyCloudProgress(): MoneyWorldProgress {
  return {
    worldId: MONEY_WORLD_ID,
    completedStageIds: [],
    currentStageId: null,
    currentSegmentIndex: 0,
    updatedAt: ""
  };
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
 * null means there is no authenticated/configured cloud context or the read
 * failed. A valid authenticated child with no row returns explicit empty
 * progress so newer local checkpoints can seed cloud on reconciliation.
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

    if (error) return null;
    if (!data) return emptyCloudProgress();
    return normalizeCloudWorldProgress(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

/**
 * Persists only World narrative/stage progress through the server-owned RPC.
 * It is deliberately separate from learning attempts, mastery, achievements,
 * certificates, and canonical Belajar stars.
 */
export async function syncMoneyWorldProgressCloud(
  childId: string,
  progress: MoneyWorldProgress
): Promise<boolean> {
  if (progress.worldId !== MONEY_WORLD_ID) return false;

  const client = getBrowserClient();
  if (!client || !await getCurrentUserId()) return false;

  try {
    const { error } = await client.rpc("save_world_progress", {
      p_child_key: childId,
      p_world_id: MONEY_WORLD_ID,
      p_completed_stage_ids: progress.completedStageIds,
      p_current_stage_id: progress.currentStageId,
      p_current_segment_index: progress.currentSegmentIndex
    });
    return !error;
  } catch {
    return false;
  }
}
