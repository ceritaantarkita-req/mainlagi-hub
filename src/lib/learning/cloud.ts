"use client";

import { getCurrentUserId, getValidAccessToken, isSupabaseConfigured } from "@/lib/auth/supabase-auth";
import { getBrowserClient } from "@/lib/auth/supabase-client";
import { LEARNING_SKILLS } from "./catalog";
import { emptyLearningAnalytics, type LearningAnalyticsSnapshot, type LearningAttemptRecord } from "./attempts";
import { calculateSkillMastery, type MasteryLevel, type SkillEvidence, type SkillMasterySnapshot } from "./mastery";
import type { CharacterId, LearningChildProfile, LearningProgress } from "./system";

const VALID_GUIDES = new Set<CharacterId>(["naya", "gian", "zia", "paca", "gavi"]);
const VALID_LEVELS = new Set<MasteryLevel>(["not_started", "exploring", "developing", "proficient", "mastered"]);

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function numberOrZero(value: unknown): number {
  return numberOrNull(value) ?? 0;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function metadataObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function masteryLevel(value: unknown): MasteryLevel {
  return typeof value === "string" && VALID_LEVELS.has(value as MasteryLevel)
    ? value as MasteryLevel
    : "not_started";
}

export async function syncLearningAttemptCloud(attempt: LearningAttemptRecord): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const token = await getValidAccessToken();
  if (!token) return false;
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anon) return false;

  try {
    const response = await fetch(`${url}/rest/v1/rpc/record_learning_attempt`, {
      method: "POST",
      headers: {
        apikey: anon,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        p_client_attempt_id: attempt.id,
        p_child_key: attempt.childId,
        p_activity_id: attempt.activityId,
        p_subject_id: attempt.subjectId,
        p_stage_id: attempt.stageId,
        p_runtime: attempt.runtime,
        p_status: attempt.status,
        p_assessed: attempt.assessed,
        p_score: attempt.score,
        p_accuracy: attempt.accuracy,
        p_correct_count: attempt.correctCount,
        p_incorrect_count: attempt.incorrectCount,
        p_hint_count: attempt.hintCount,
        p_retry_count: attempt.retryCount,
        p_duration_ms: attempt.durationMs,
        p_input_mode: attempt.inputMode,
        p_started_at: attempt.startedAt,
        p_completed_at: attempt.completedAt,
        p_metadata: attempt.metadata
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Returns null when there is no authenticated Supabase context or when the
 * cloud read fails. Callers may then use the existing local guest fallback.
 * For authenticated users, RLS remains the ownership boundary; account_id is
 * intentionally not accepted as an argument here.
 */
export async function readCloudLearningAnalytics(childId: string): Promise<LearningAnalyticsSnapshot | null> {
  const client = getBrowserClient();
  if (!client || !await getCurrentUserId()) return null;

  try {
    const [attemptResult, evidenceResult, masteryResult] = await Promise.all([
      client
        .from("learning_attempts")
        .select("id,child_key,client_attempt_id,activity_id,subject_id,stage_id,runtime,status,assessed,score,accuracy,correct_count,incorrect_count,hint_count,retry_count,duration_ms,input_mode,started_at,completed_at,metadata,created_at")
        .eq("child_key", childId)
        .order("created_at", { ascending: true })
        .limit(500),
      client
        .from("learning_attempt_skill_evidence")
        .select("attempt_id,activity_id,skill_key,evidence_score,evidence_weight,qualifies_for_mastery,created_at")
        .eq("child_key", childId)
        .order("created_at", { ascending: true })
        .limit(2000),
      client
        .from("child_skill_mastery")
        .select("skill_key,mastery_score,confidence,mastery_level,evidence_count,qualifying_evidence_count,last_evidence_at")
        .eq("child_key", childId)
    ]);

    if (attemptResult.error || evidenceResult.error || masteryResult.error) return null;

    const evidenceByAttempt = new Map<string, SkillEvidence[]>();
    for (const row of evidenceResult.data ?? []) {
      const attemptId = typeof row.attempt_id === "string" ? row.attempt_id : "";
      const activityId = typeof row.activity_id === "string" ? row.activity_id : "";
      const skillId = typeof row.skill_key === "string" ? row.skill_key : "";
      const score = numberOrNull(row.evidence_score);
      const weight = numberOrNull(row.evidence_weight);
      const createdAt = typeof row.created_at === "string" ? row.created_at : "";
      if (!attemptId || !activityId || !skillId || score === null || weight === null || !createdAt) continue;
      const item: SkillEvidence = {
        attemptId,
        activityId,
        skillId,
        score,
        weight,
        createdAt,
        qualifiesForMastery: row.qualifies_for_mastery === true
      };
      evidenceByAttempt.set(attemptId, [...(evidenceByAttempt.get(attemptId) ?? []), item]);
    }

    const attempts: LearningAttemptRecord[] = (attemptResult.data ?? []).flatMap((row) => {
      if (typeof row.id !== "string" || typeof row.activity_id !== "string") return [];
      const status = row.status === "abandoned" || row.status === "interrupted" ? row.status : "completed";
      const completedAt = typeof row.completed_at === "string"
        ? row.completed_at
        : typeof row.created_at === "string" ? row.created_at : new Date(0).toISOString();
      const startedAt = typeof row.started_at === "string" ? row.started_at : completedAt;
      const evidence = evidenceByAttempt.get(row.id) ?? [];
      return [{
        id: typeof row.client_attempt_id === "string" && row.client_attempt_id ? row.client_attempt_id : row.id,
        childId: typeof row.child_key === "string" ? row.child_key : childId,
        activityId: row.activity_id,
        subjectId: typeof row.subject_id === "string" ? row.subject_id : "",
        stageId: typeof row.stage_id === "string" ? row.stage_id : "",
        runtime: typeof row.runtime === "string" ? row.runtime : "",
        difficulty: 1,
        status,
        assessed: row.assessed === true,
        score: numberOrNull(row.score),
        accuracy: numberOrNull(row.accuracy),
        correctCount: Math.max(0, Math.round(numberOrZero(row.correct_count))),
        incorrectCount: Math.max(0, Math.round(numberOrZero(row.incorrect_count))),
        hintCount: Math.max(0, Math.round(numberOrZero(row.hint_count))),
        retryCount: Math.max(0, Math.round(numberOrZero(row.retry_count))),
        durationMs: numberOrNull(row.duration_ms),
        inputMode: typeof row.input_mode === "string" && row.input_mode ? row.input_mode : null,
        startedAt,
        completedAt,
        metadata: metadataObject(row.metadata),
        evidence,
        masteryEligible: evidence.some((item) => item.qualifiesForMastery)
      } satisfies LearningAttemptRecord];
    });

    const masteryBySkill: Record<string, SkillMasterySnapshot> = Object.fromEntries(
      LEARNING_SKILLS.map((skill) => [skill.id, calculateSkillMastery(skill.id, [])])
    );
    for (const row of masteryResult.data ?? []) {
      if (typeof row.skill_key !== "string" || !row.skill_key) continue;
      const level = masteryLevel(row.mastery_level);
      masteryBySkill[row.skill_key] = {
        skillId: row.skill_key,
        score: Math.max(0, Math.min(1, numberOrZero(row.mastery_score))),
        confidence: Math.max(0, Math.min(1, numberOrZero(row.confidence))),
        level,
        evidenceCount: Math.max(0, Math.round(numberOrZero(row.evidence_count))),
        qualifyingEvidenceCount: Math.max(0, Math.round(numberOrZero(row.qualifying_evidence_count))),
        lastEvidenceAt: typeof row.last_evidence_at === "string" ? row.last_evidence_at : null,
        needsPractice: level !== "proficient" && level !== "mastered"
      };
    }

    return {
      attempts,
      masteryBySkill,
      totalAttempts: attempts.length,
      assessedAttempts: attempts.filter((item) => item.assessed).length,
      practiceAttempts: attempts.filter((item) => !item.assessed).length,
      lastAttemptAt: attempts.at(-1)?.completedAt ?? null
    };
  } catch {
    return null;
  }
}

export async function readCloudLearningProgress(childId: string): Promise<LearningProgress | null> {
  const client = getBrowserClient();
  if (!client || !await getCurrentUserId()) return null;
  try {
    const { data, error } = await client
      .from("child_learning_progress")
      .select("completed_activity_ids,total_stars,last_activity_id")
      .eq("child_key", childId)
      .maybeSingle();
    if (error) return null;
    if (!data) return { completedActivityIds: [], stars: 0, lastActivityId: null };
    return {
      completedActivityIds: stringArray(data.completed_activity_ids),
      stars: Math.max(0, Math.round(numberOrZero(data.total_stars))),
      lastActivityId: typeof data.last_activity_id === "string" && data.last_activity_id ? data.last_activity_id : null
    };
  } catch {
    return null;
  }
}

function cloudProfileFromRow(row: Record<string, unknown>): LearningChildProfile | null {
  if (typeof row.id !== "string" || typeof row.alias !== "string") return null;
  const age = Number(row.age_group);
  if (!Number.isInteger(age) || age < 3 || age > 7) return null;
  const guide = typeof row.avatar_key === "string" && VALID_GUIDES.has(row.avatar_key as CharacterId)
    ? row.avatar_key as CharacterId
    : "gian";
  return { id: row.id, name: row.alias.trim() || "Anak", age, guide, language: "id" };
}

export async function listCloudLearningProfiles(): Promise<LearningChildProfile[] | null> {
  const client = getBrowserClient();
  if (!client || !await getCurrentUserId()) return null;
  try {
    const { data, error } = await client
      .from("player_profiles")
      .select("id,alias,age_group,avatar_key,created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
    if (error) return null;
    return (data ?? []).flatMap((row) => {
      const profile = cloudProfileFromRow(row as Record<string, unknown>);
      return profile ? [profile] : [];
    });
  } catch {
    return null;
  }
}

export async function readCloudLearningProfile(childId: string): Promise<LearningChildProfile | null> {
  const client = getBrowserClient();
  if (!client || !await getCurrentUserId()) return null;
  try {
    const { data, error } = await client
      .from("player_profiles")
      .select("id,alias,age_group,avatar_key")
      .eq("id", childId)
      .is("deleted_at", null)
      .maybeSingle();
    if (error || !data) return null;
    return cloudProfileFromRow(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function createCloudLearningProfile(input: {
  name: string;
  age: number;
  guide: CharacterId;
}): Promise<LearningChildProfile | null> {
  const client = getBrowserClient();
  const accountId = await getCurrentUserId();
  if (!client || !accountId) return null;
  const name = input.name.trim().slice(0, 40);
  if (!name || !Number.isInteger(input.age) || input.age < 3 || input.age > 7 || !VALID_GUIDES.has(input.guide)) {
    throw new Error("Profil anak tidak valid.");
  }
  const { data, error } = await client
    .from("player_profiles")
    .insert({
      account_id: accountId,
      alias: name,
      age_group: String(input.age),
      grade: null,
      avatar_key: input.guide
    })
    .select("id,alias,age_group,avatar_key")
    .single();
  if (error) throw new Error(error.message);
  const profile = cloudProfileFromRow(data as Record<string, unknown>);
  if (!profile) throw new Error("Profil anak dari cloud tidak valid.");
  return profile;
}

export async function removeCloudLearningProfile(childId: string): Promise<boolean> {
  const client = getBrowserClient();
  if (!client || !await getCurrentUserId()) return false;
  const { error } = await client
    .from("player_profiles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", childId)
    .is("deleted_at", null);
  return !error;
}

export function localEmptyAnalytics(): LearningAnalyticsSnapshot {
  return emptyLearningAnalytics();
}
