import { ACTIVITY_LEARNING_SPECS, getActivityLearningSpec } from "./catalog";
import { rankActivityRecommendations, type RecommendationReason } from "./progression";
import { ACTIVITIES, STAGES, type LearningActivity, type LearningProgress, type LearningSubjectId } from "./system";
import type { LearningAnalyticsSnapshot, LearningAttemptRecord } from "./attempts";

export type AdaptiveRecommendationReason =
  | RecommendationReason
  | "remediate_variant"
  | "build_confidence"
  | "spaced_review";

export interface AdaptiveLearningRecommendation {
  id: string;
  score: number;
  reason: AdaptiveRecommendationReason;
  targetSkillId: string | null;
}

function descriptorFor(activity: LearningActivity) {
  const spec = getActivityLearningSpec(activity.id);
  return {
    id: activity.id,
    subjectId: activity.subjectId,
    stageId: activity.stageId,
    ageMin: activity.ageMin,
    ageMax: activity.ageMax,
    requiredForStage: spec?.requiredForStage ?? (!activity.motionOptional && activity.runtime !== "motion_game"),
    motionOptional: activity.motionOptional || activity.runtime === "motion_game",
    skillIds: spec?.skills.map((item) => item.skillId) ?? [],
    assessed: spec?.assessment === "assessed",
    difficulty: spec?.difficulty ?? 1,
    runtime: activity.runtime
  } as const;
}

// The catalog is static for a loaded application build. Materializing these
// descriptors once avoids rebuilding 900 activity descriptors on every render.
const ALL_ACTIVITY_DESCRIPTORS = ACTIVITIES.map(descriptorFor);
const ALL_STAGE_DESCRIPTORS = STAGES.map((stage) => ({
  id: stage.id,
  subjectId: stage.subjectId,
  activityIds: stage.activityIds
}));

function newestFirst(attempts: LearningAttemptRecord[]): LearningAttemptRecord[] {
  return attempts.slice().sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt));
}

function average(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function recentPerformance(attempts: LearningAttemptRecord[]) {
  const recent = attempts.filter((attempt) => attempt.assessed).slice(0, 8);
  const accuracies = recent.flatMap((attempt) => attempt.accuracy === null ? [] : [attempt.accuracy]);
  const meanAccuracy = average(accuracies);
  const meanRetries = recent.length
    ? recent.reduce((sum, attempt) => sum + attempt.retryCount, 0) / recent.length
    : 0;
  const meanHints = recent.length
    ? recent.reduce((sum, attempt) => sum + attempt.hintCount, 0) / recent.length
    : 0;
  const interruptionRate = recent.length
    ? recent.filter((attempt) => attempt.status !== "completed").length / recent.length
    : 0;
  return { recent, meanAccuracy, meanRetries, meanHints, interruptionRate };
}

function activitySkills(activityId: string): string[] {
  return ACTIVITY_LEARNING_SPECS[activityId]?.skills.map((item) => item.skillId) ?? [];
}

function buildSkillAttemptIndex(attempts: LearningAttemptRecord[]): Map<string, LearningAttemptRecord[]> {
  const bySkill = new Map<string, LearningAttemptRecord[]>();
  for (const attempt of attempts) {
    for (const skillId of activitySkills(attempt.activityId)) {
      const rows = bySkill.get(skillId);
      if (rows) rows.push(attempt);
      else bySkill.set(skillId, [attempt]);
    }
  }
  return bySkill;
}

function sharesSkill(activityId: string, skillId: string | null): boolean {
  return Boolean(skillId && activitySkills(activityId).includes(skillId));
}

function daysSince(value: string | null, nowMs: number): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, (nowMs - parsed) / (24 * 60 * 60 * 1000));
}

function normalizeLimit(value: number | undefined): number | null {
  if (value === undefined) return null;
  if (!Number.isFinite(value)) return null;
  return Math.max(0, Math.floor(value));
}

/**
 * Deterministic Adaptive Learning V2 policy, scaled for the 900-activity
 * catalog in Batch 15.
 *
 * Hard gates remain age, unlocked stage, subject scope, and motion opt-in.
 * Ranking uses recent measured attempts only as soft policy signals. Practice
 * and completion-only creative activities never enter mastery calculations.
 */
export function rankAdaptiveLearningV2(args: {
  age: number;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
  allowMotion?: boolean;
  subjectId?: LearningSubjectId;
  nowMs?: number;
  limit?: number;
}): AdaptiveLearningRecommendation[] {
  const nowMs = args.nowMs ?? Date.now();
  const allowedActivities = args.subjectId
    ? ALL_ACTIVITY_DESCRIPTORS.filter((activity) => activity.subjectId === args.subjectId)
    : ALL_ACTIVITY_DESCRIPTORS;
  const allowedStages = args.subjectId
    ? ALL_STAGE_DESCRIPTORS.filter((stage) => stage.subjectId === args.subjectId)
    : ALL_STAGE_DESCRIPTORS;
  const base = rankActivityRecommendations({
    age: args.age,
    activities: allowedActivities,
    stages: allowedStages,
    completedActivityIds: args.progress.completedActivityIds,
    masteryBySkill: args.analytics.masteryBySkill,
    lastActivityId: args.progress.lastActivityId,
    allowMotion: args.allowMotion
  });
  const descriptorMap = new Map(allowedActivities.map((activity) => [activity.id, activity]));
  const attempts = newestFirst(args.analytics.attempts);
  const skillAttempts = buildSkillAttemptIndex(attempts);
  const completedSet = new Set(args.progress.completedActivityIds);
  const latestSixIds = attempts.slice(0, 6).map((attempt) => attempt.activityId);
  const performance = recentPerformance(attempts);

  const ranked = base.map((item): AdaptiveLearningRecommendation => {
    const descriptor = descriptorMap.get(item.id);
    if (!descriptor) return { ...item, reason: item.reason };
    let score = item.score;
    let reason: AdaptiveRecommendationReason = item.reason;

    // Repetition control applies to both assessed and creative practice. A
    // recently repeated item should not dominate merely because it is open.
    const recentRepeatCount = latestSixIds.filter((id) => id === item.id).length;
    score -= recentRepeatCount * 20;

    const targetSkillId = item.targetSkillId ?? descriptor.skillIds[0] ?? null;
    if (descriptor.assessed && targetSkillId) {
      const relatedAttempts = skillAttempts.get(targetSkillId) ?? [];
      const latestSkillAttempt = relatedAttempts[0];
      const snapshot = args.analytics.masteryBySkill[targetSkillId];

      // Weak measured evidence should lead to another activity for the same
      // skill. A runtime change receives a small additional diversity boost.
      const weakLatest = Boolean(latestSkillAttempt && (
        (latestSkillAttempt.accuracy !== null && latestSkillAttempt.accuracy < 0.7)
        || latestSkillAttempt.retryCount >= 2
        || latestSkillAttempt.hintCount >= 2
      ));
      if (weakLatest && latestSkillAttempt) {
        if (item.id !== latestSkillAttempt.activityId && sharesSkill(item.id, targetSkillId)) {
          score += 30;
          if (descriptor.runtime !== latestSkillAttempt.runtime) score += 8;
          reason = "remediate_variant";
        } else if (item.id === latestSkillAttempt.activityId) {
          score -= 30;
        }
      }

      // Reasonable score + low confidence needs varied evidence, not premature
      // difficulty escalation.
      if (snapshot && snapshot.score >= 0.65 && snapshot.confidence < 0.45 && item.id !== latestSkillAttempt?.activityId) {
        score += 14;
        if (reason !== "remediate_variant") reason = "build_confidence";
      }

      // Proficient/mastered skills are cooled while fresh, then re-enter via
      // spaced review. Mastery itself is not decayed or rewritten here.
      if (snapshot && (snapshot.level === "proficient" || snapshot.level === "mastered")) {
        const ageDays = daysSince(snapshot.lastEvidenceAt, nowMs);
        const spacingDays = snapshot.level === "mastered" ? 7 : 5;
        if (ageDays !== null && ageDays >= spacingDays) {
          score += snapshot.level === "mastered" ? 12 : 9;
          if (reason === "practice" || reason === "strengthen_skill") reason = "spaced_review";
        } else {
          score -= snapshot.level === "mastered" ? 16 : 10;
        }
      }
    } else if (!descriptor.assessed) {
      // Completion-only practice stays recommendation-eligible without looking
      // at mastery snapshots. Prefer unexplored creative items and avoid an
      // exact replay loop; completion is participation, not proficiency.
      if (!completedSet.has(item.id)) score += 4;
      if (item.id === args.progress.lastActivityId) score -= 10;
    }

    // Frustration-aware soft difficulty. Age and stage remain hard gates.
    const difficulty = descriptor.difficulty ?? 1;
    const struggling = performance.meanAccuracy !== null && (
      performance.meanAccuracy < 0.65
      || performance.meanRetries >= 2
      || performance.meanHints >= 1.5
      || performance.interruptionRate >= 0.25
    );
    if (struggling) {
      if (difficulty === 1) score += 12;
      if (difficulty === 3) score -= 12;
    } else if (performance.meanAccuracy !== null && performance.meanAccuracy >= 0.9 && performance.meanRetries < 1 && performance.meanHints < 0.5) {
      score += difficulty >= 2 ? 7 : -2;
    }

    return { id: item.id, score, reason, targetSkillId };
  }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const limit = normalizeLimit(args.limit);
  return limit === null ? ranked : ranked.slice(0, limit);
}

export function adaptiveReasonLabel(reason: AdaptiveRecommendationReason, targetSkillTitle?: string | null): string {
  const skill = targetSkillTitle ? ` ${targetSkillTitle}` : " skill ini";
  switch (reason) {
    case "remediate_variant":
      return `Coba bentuk latihan berbeda untuk memperkuat${skill}, bukan mengulang soal yang sama.`;
    case "build_confidence":
      return `Tambah evidence yang bervariasi untuk${skill} sebelum naik tingkat kesulitan.`;
    case "spaced_review":
      return `Saatnya review singkat${targetSkillTitle ? ` untuk ${targetSkillTitle}` : ""} karena evidence terakhir sudah cukup lama.`;
    case "finish_core":
      return "Selesaikan aktivitas inti yang masih terbuka sebelum maju ke stage berikutnya.";
    case "first_evidence":
      return `Mulai kumpulkan evidence untuk${skill}.`;
    case "strengthen_skill":
      return `Perkuat${skill} dengan latihan terukur berikutnya.`;
    case "new_activity":
      return "Coba aktivitas baru yang sesuai umur dan stage yang sudah terbuka.";
    case "practice":
      return "Latihan ringan untuk menjaga pengalaman belajar tetap bervariasi.";
  }
}
