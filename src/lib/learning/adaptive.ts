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

const REVIEW_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

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
    difficulty: spec?.difficulty ?? 1
  } as const;
}

function descriptors() {
  return ACTIVITIES.map(descriptorFor);
}

function stageDescriptors() {
  return STAGES.map((stage) => ({ id: stage.id, subjectId: stage.subjectId, activityIds: stage.activityIds }));
}

function newestFirst(attempts: LearningAttemptRecord[]): LearningAttemptRecord[] {
  return attempts.slice().sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt));
}

function average(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function recentPerformance(attempts: LearningAttemptRecord[]) {
  const recent = newestFirst(attempts).filter((attempt) => attempt.assessed).slice(0, 5);
  const accuracies = recent.flatMap((attempt) => attempt.accuracy === null ? [] : [attempt.accuracy]);
  const meanAccuracy = average(accuracies);
  const meanRetries = recent.length
    ? recent.reduce((sum, attempt) => sum + attempt.retryCount, 0) / recent.length
    : 0;
  return { recent, meanAccuracy, meanRetries };
}

function activitySkills(activityId: string): string[] {
  return ACTIVITY_LEARNING_SPECS[activityId]?.skills.map((item) => item.skillId) ?? [];
}

function attemptsForSkill(attempts: LearningAttemptRecord[], skillId: string): LearningAttemptRecord[] {
  return newestFirst(attempts.filter((attempt) => activitySkills(attempt.activityId).includes(skillId)));
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

/**
 * Deterministic Adaptive Learning V2 policy.
 *
 * It keeps the existing hard gates (age, unlocked stage, motion opt-in) and
 * then adjusts ranking using recent measured attempts. The policy prefers a
 * different measured activity for the same weak skill after errors/retries,
 * spaces review for already-strong skills, and uses recent performance only
 * as a soft difficulty signal. It never changes mastery itself.
 */
export function rankAdaptiveLearningV2(args: {
  age: number;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
  allowMotion?: boolean;
  subjectId?: LearningSubjectId;
  nowMs?: number;
}): AdaptiveLearningRecommendation[] {
  const nowMs = args.nowMs ?? Date.now();
  const allDescriptors = descriptors();
  const allowedActivities = args.subjectId
    ? allDescriptors.filter((activity) => activity.subjectId === args.subjectId)
    : allDescriptors;
  const allowedStages = args.subjectId
    ? stageDescriptors().filter((stage) => stage.subjectId === args.subjectId)
    : stageDescriptors();
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
  const latestFourIds = attempts.slice(0, 4).map((attempt) => attempt.activityId);
  const performance = recentPerformance(attempts);

  return base.map((item): AdaptiveLearningRecommendation => {
    const descriptor = descriptorMap.get(item.id);
    if (!descriptor) return { ...item, reason: item.reason };
    let score = item.score;
    let reason: AdaptiveRecommendationReason = item.reason;

    // Repetition control: recent exposure is penalized even when the same
    // activity is not literally the immediately previous one.
    const recentRepeatCount = latestFourIds.filter((id) => id === item.id).length;
    score -= recentRepeatCount * 18;

    const targetSkillId = item.targetSkillId ?? descriptor.skillIds[0] ?? null;
    if (descriptor.assessed && targetSkillId) {
      const skillAttempts = attemptsForSkill(attempts, targetSkillId);
      const latestSkillAttempt = skillAttempts[0];
      const snapshot = args.analytics.masteryBySkill[targetSkillId];

      // Remediation: after weak evidence, prefer another assessed activity
      // targeting the same skill rather than asking the exact same question.
      const weakLatest = Boolean(latestSkillAttempt && (
        (latestSkillAttempt.accuracy !== null && latestSkillAttempt.accuracy < 0.7)
        || latestSkillAttempt.retryCount >= 2
      ));
      if (weakLatest && latestSkillAttempt) {
        if (item.id !== latestSkillAttempt.activityId && sharesSkill(item.id, targetSkillId)) {
          score += 30;
          reason = "remediate_variant";
        } else if (item.id === latestSkillAttempt.activityId) {
          score -= 26;
        }
      }

      // Confidence building: a reasonable score with low confidence should
      // get varied evidence before difficulty pressure rises.
      if (snapshot && snapshot.score >= 0.65 && snapshot.confidence < 0.45 && item.id !== latestSkillAttempt?.activityId) {
        score += 14;
        if (reason !== "remediate_variant") reason = "build_confidence";
      }

      // Spaced review: strong skills are deprioritized while fresh, but can
      // return after a week without evidence.
      if (snapshot && (snapshot.level === "proficient" || snapshot.level === "mastered")) {
        const ageDays = daysSince(snapshot.lastEvidenceAt, nowMs);
        if (ageDays !== null && ageDays >= 7) {
          score += 12;
          if (reason === "practice" || reason === "strengthen_skill") reason = "spaced_review";
        } else {
          score -= 16;
        }
      }
    }

    // Soft difficulty adjustment from recent assessed performance. Age and
    // stage eligibility remain hard boundaries in the base ranker.
    const difficulty = descriptor.difficulty ?? 1;
    if (performance.meanAccuracy !== null) {
      if (performance.meanAccuracy < 0.65 || performance.meanRetries >= 2) {
        score += difficulty === 1 ? 10 : -7 * (difficulty - 1);
      } else if (performance.meanAccuracy >= 0.9 && performance.meanRetries < 1) {
        score += difficulty >= 2 ? 7 : -2;
      }
    }

    return { id: item.id, score, reason, targetSkillId };
  }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
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
