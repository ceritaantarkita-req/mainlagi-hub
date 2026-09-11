import { ACTIVITY_LEARNING_SPECS, getLearningSkill, getSkillsForSubject, type LearningSubjectKey } from "./catalog";
import { adaptiveReasonLabel, rankAdaptiveLearningV2, type AdaptiveRecommendationReason } from "./adaptive";
import { buildWeeklyLearningReport } from "./reporting";
import { getSubjectLearningSummary, getSubjectSkillRows, getSubjectStageReadiness } from "./insights";
import { summarizeSubjectMastery } from "./mastery";
import { ACTIVITIES, SUBJECTS, getActivity, type LearningProgress, type LearningSubjectId } from "./system";
import type { LearningAnalyticsSnapshot, LearningAttemptRecord } from "./attempts";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface Batch15RecommendationSummary {
  activityId: string;
  activityTitle: string;
  reason: AdaptiveRecommendationReason;
  reasonLabel: string;
  targetSkillId: string | null;
  targetSkillTitle: string | null;
  assessment: "assessed" | "practice";
}

export interface Batch15SubjectReport {
  subjectId: LearningSubjectId;
  title: string;
  attempts: number;
  assessedAttempts: number;
  practiceAttempts: number;
  averageAccuracy: number | null;
  qualifyingEvidence: number;
  completion: {
    completedActivities: number;
    requiredActivities: number;
    ratio: number;
  };
  mastery: null | {
    score: number;
    coverage: number;
    masteredSkills: number;
    proficientSkills: number;
    totalAssessedSkills: number;
  };
  stages: {
    total: number;
    ready: number;
    inProgress: number;
    evidenceNeeded: number;
    locked: number;
  };
  needsPractice: null | {
    skillId: string;
    title: string;
    score: number;
    confidence: number;
  };
  recommendation: Batch15RecommendationSummary | null;
}

export interface Batch15RecentAttempt {
  id: string;
  activityId: string;
  activityTitle: string;
  subjectId: string;
  assessed: boolean;
  accuracy: number | null;
  retryCount: number;
  completedAt: string;
}

export interface Batch15ParentReport {
  windowStart: string;
  windowEnd: string;
  attempts: number;
  assessedAttempts: number;
  practiceAttempts: number;
  activeDays: number;
  averageAccuracy: number | null;
  qualifyingEvidence: number;
  attemptDelta: number;
  strongestSkill: ReturnType<typeof buildWeeklyLearningReport>["strongestSkill"];
  needsPracticeSkill: ReturnType<typeof buildWeeklyLearningReport>["needsPracticeSkill"];
  subjects: Batch15SubjectReport[];
  recentAttempts: Batch15RecentAttempt[];
}

function timestamp(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function inWindow(attempt: LearningAttemptRecord, start: number, end: number): boolean {
  const at = timestamp(attempt.completedAt);
  return at !== null && at >= start && at < end;
}

function average(values: number[]): number | null {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function assessedSkillIdsForSubject(subjectId: LearningSubjectId): string[] {
  const ids = new Set<string>();
  for (const spec of Object.values(ACTIVITY_LEARNING_SPECS)) {
    if (spec.subjectId !== subjectId || spec.assessment !== "assessed") continue;
    for (const link of spec.skills) ids.add(link.skillId);
  }
  return [...ids];
}

function recommendationForSubject(args: {
  subjectId: LearningSubjectId;
  age: number;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
  allowMotion?: boolean;
  nowMs: number;
}): Batch15RecommendationSummary | null {
  const top = rankAdaptiveLearningV2({
    age: args.age,
    subjectId: args.subjectId,
    progress: args.progress,
    analytics: args.analytics,
    allowMotion: args.allowMotion,
    nowMs: args.nowMs,
    limit: 1
  })[0];
  if (!top) return null;
  const activity = getActivity(top.id);
  const spec = ACTIVITY_LEARNING_SPECS[top.id];
  if (!activity || !spec) return null;
  const skill = top.targetSkillId ? getLearningSkill(top.targetSkillId) : undefined;
  return {
    activityId: activity.id,
    activityTitle: activity.title,
    reason: top.reason,
    reasonLabel: adaptiveReasonLabel(top.reason, skill?.title ?? null),
    targetSkillId: top.targetSkillId,
    targetSkillTitle: skill?.title ?? null,
    assessment: spec.assessment
  };
}

/**
 * Bounded parent-report projection for Batch 15.
 *
 * The report consumes an already-loaded analytics snapshot and produces one
 * compact row per subject rather than exposing hundreds of raw catalog rows.
 * Creative subjects deliberately return `mastery: null` because completion-
 * only practice is participation evidence, not assessed proficiency.
 */
export function buildBatch15ParentReport(args: {
  age: number;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
  allowMotion?: boolean;
  nowMs?: number;
  recentLimit?: number;
}): Batch15ParentReport {
  const nowMs = args.nowMs ?? Date.now();
  const weekly = buildWeeklyLearningReport(args.analytics, nowMs);
  const currentStart = nowMs - 7 * DAY_MS;
  const currentEnd = nowMs + 1;
  const currentAttempts = args.analytics.attempts.filter((attempt) => inWindow(attempt, currentStart, currentEnd));

  const subjects = SUBJECTS.map((subject): Batch15SubjectReport => {
    const attempts = currentAttempts.filter((attempt) => attempt.subjectId === subject.id);
    const assessed = attempts.filter((attempt) => attempt.assessed);
    const accuracyValues = assessed.flatMap((attempt) => attempt.accuracy === null ? [] : [attempt.accuracy]);
    const qualifyingEvidence = attempts.reduce(
      (sum, attempt) => sum + attempt.evidence.filter((item) => item.qualifiesForMastery).length,
      0
    );
    const learning = getSubjectLearningSummary(subject.id, args.progress, args.analytics);
    const stageRows = getSubjectStageReadiness(subject.id, args.progress, args.analytics);
    const assessedSkillIds = assessedSkillIdsForSubject(subject.id);
    const assessedSkillSet = new Set(assessedSkillIds);
    const assessedMastery = summarizeSubjectMastery(assessedSkillIds, args.analytics.masteryBySkill);
    const skillRows = getSubjectSkillRows(subject.id, args.analytics)
      .filter((row) => assessedSkillSet.has(row.id));
    const needsPractice = skillRows
      .filter((row) => row.level === "exploring" || row.level === "developing")
      .sort((a, b) => a.score - b.score || a.confidence - b.confidence || a.id.localeCompare(b.id))[0] ?? null;

    return {
      subjectId: subject.id,
      title: subject.title,
      attempts: attempts.length,
      assessedAttempts: assessed.length,
      practiceAttempts: attempts.length - assessed.length,
      averageAccuracy: average(accuracyValues),
      qualifyingEvidence,
      completion: {
        completedActivities: learning.completedActivities,
        requiredActivities: learning.requiredActivities,
        ratio: learning.completionRatio
      },
      mastery: assessedSkillIds.length ? {
        score: assessedMastery.score,
        coverage: assessedMastery.coverage,
        masteredSkills: assessedMastery.masteredSkills,
        proficientSkills: assessedMastery.proficientSkills,
        totalAssessedSkills: assessedMastery.totalSkills
      } : null,
      stages: {
        total: stageRows.length,
        ready: stageRows.filter((row) => row.status === "ready").length,
        inProgress: stageRows.filter((row) => row.status === "in_progress").length,
        evidenceNeeded: stageRows.filter((row) => row.status === "evidence_needed").length,
        locked: stageRows.filter((row) => row.status === "locked").length
      },
      needsPractice: needsPractice ? {
        skillId: needsPractice.id,
        title: needsPractice.title,
        score: needsPractice.score,
        confidence: needsPractice.confidence
      } : null,
      recommendation: recommendationForSubject({
        subjectId: subject.id,
        age: args.age,
        progress: args.progress,
        analytics: args.analytics,
        allowMotion: args.allowMotion,
        nowMs
      })
    };
  });

  const recentLimit = Math.max(0, Math.min(12, Math.floor(args.recentLimit ?? 6)));
  const recentAttempts = args.analytics.attempts
    .slice()
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
    .slice(0, recentLimit)
    .map((attempt): Batch15RecentAttempt => ({
      id: attempt.id,
      activityId: attempt.activityId,
      activityTitle: getActivity(attempt.activityId)?.title ?? attempt.activityId,
      subjectId: attempt.subjectId,
      assessed: attempt.assessed,
      accuracy: attempt.accuracy,
      retryCount: attempt.retryCount,
      completedAt: attempt.completedAt
    }));

  return {
    windowStart: weekly.windowStart,
    windowEnd: weekly.windowEnd,
    attempts: weekly.attempts,
    assessedAttempts: weekly.assessedAttempts,
    practiceAttempts: weekly.practiceAttempts,
    activeDays: weekly.activeDays,
    averageAccuracy: weekly.averageAccuracy,
    qualifyingEvidence: weekly.qualifyingEvidence,
    attemptDelta: weekly.attemptDelta,
    strongestSkill: weekly.strongestSkill,
    needsPracticeSkill: weekly.needsPracticeSkill,
    subjects,
    recentAttempts
  };
}

export function batch15CatalogScaleSnapshot() {
  const assessed = ACTIVITIES.filter((activity) => ACTIVITY_LEARNING_SPECS[activity.id]?.assessment === "assessed").length;
  return {
    subjects: SUBJECTS.length,
    activities: ACTIVITIES.length,
    assessedActivities: assessed,
    practiceActivities: ACTIVITIES.length - assessed,
    skills: SUBJECTS.reduce((sum, subject) => sum + getSkillsForSubject(subject.id as LearningSubjectKey).length, 0)
  };
}
