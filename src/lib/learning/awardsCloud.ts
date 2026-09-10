"use client";

import { getCurrentUserId } from "@/lib/auth/supabase-auth";
import { getBrowserClient } from "@/lib/auth/supabase-client";
import type { LearningSubjectId } from "./system";

export interface PersistedLearningAchievement {
  key: string;
  awardedAt: string;
  evidence: Record<string, unknown>;
}

export interface PersistedLearningCertificate {
  id: string;
  subjectId: LearningSubjectId;
  criteriaVersion: string;
  issuedAt: string;
  evidenceSnapshot: Record<string, unknown>;
}

export interface PersistedLearningAwards {
  achievements: PersistedLearningAchievement[];
  certificates: PersistedLearningCertificate[];
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export async function readCloudLearningAwards(childId: string): Promise<PersistedLearningAwards | null> {
  const client = getBrowserClient();
  if (!client || !await getCurrentUserId()) return null;
  try {
    const [achievementResult, certificateResult] = await Promise.all([
      client
        .from("child_learning_achievements")
        .select("achievement_key,awarded_at,evidence")
        .eq("child_key", childId)
        .order("awarded_at", { ascending: true }),
      client
        .from("learning_certificates")
        .select("id,subject_id,criteria_version,issued_at,evidence_snapshot")
        .eq("child_key", childId)
        .order("issued_at", { ascending: false })
    ]);
    if (achievementResult.error || certificateResult.error) return null;

    return {
      achievements: (achievementResult.data ?? []).flatMap((row) => {
        if (typeof row.achievement_key !== "string" || typeof row.awarded_at !== "string") return [];
        return [{
          key: row.achievement_key,
          awardedAt: row.awarded_at,
          evidence: objectValue(row.evidence)
        }];
      }),
      certificates: (certificateResult.data ?? []).flatMap((row) => {
        if (
          typeof row.id !== "string"
          || typeof row.subject_id !== "string"
          || typeof row.criteria_version !== "string"
          || typeof row.issued_at !== "string"
        ) return [];
        if (!["bahasa", "english", "math", "iqro", "color"].includes(row.subject_id)) return [];
        return [{
          id: row.id,
          subjectId: row.subject_id as LearningSubjectId,
          criteriaVersion: row.criteria_version,
          issuedAt: row.issued_at,
          evidenceSnapshot: objectValue(row.evidence_snapshot)
        }];
      })
    };
  } catch {
    return null;
  }
}
