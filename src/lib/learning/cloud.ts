"use client";

import { getValidAccessToken, isSupabaseConfigured } from "@/lib/auth/supabase-auth";
import type { LearningAttemptRecord } from "./attempts";

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
