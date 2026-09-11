import {
  ACTIVITIES,
  STAGES,
  SUBJECTS,
  getActivity,
  getStage,
  type LearningActivity,
  type LearningProgress,
  type LearningSubjectId
} from "./system";
import {
  ACTIVITY_LEARNING_SPECS,
  getActivityLearningSpec,
  getLearningSkill,
  getSkillsForSubject,
  type LearningSubjectKey
} from "./catalog";
import {
  masteryLabel,
  summarizeSubjectMastery,
  type SkillMasterySnapshot
} from "./mastery";
import {
  calculateStageLearningState,
  isStageUnlocked,
  type ProgressionActivityDescriptor,
  type ProgressionStageDescriptor,
  type StageLearningState
} from "./progression";
import {
  adaptiveReasonLabel,
  rankAdaptiveLearningV2,
  type AdaptiveRecommendationReason
} from "./adaptive";
import type { LearningAnalyticsSnapshot } from "./attempts";

export interface SubjectLearningSummary {
  subjectId: LearningSubjectId;
  completionRatio: number;
  completedActivities: number;
  requiredActivities: number;
  masteryScore: number;
  masteryCoverage: number;
  masteredSkills: number;
  proficientSkills: number;
  totalSkills: number;
}

export interface LearningAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CertificateEligibility {
  eligible: boolean;
  subjectId: LearningSubjectId;
  completionReady: boolean;
  masteryReady: boolean;
  reason: string;
}

export interface NextLearningRecommendation {
  activity: LearningActivity;
  reason: AdaptiveRecommendationReason;
  reasonLabel: string;
  targetSkillId: string | null;
  targetSkillTitle: string | null;
}

export type StageReadinessStatus = "locked" | "in_progress" | "evidence_needed" | "ready";

export interface StageReadinessRow {
  stageId: string;
  title: string;
  subjectId: LearningSubjectId;
  status: StageReadinessStatus;
  statusLabel: string;
  reason: string;
  completionRatio: number;
  completedCount: number;
  requiredCount: number;
  evidenceReadiness: number;
  evidencedSkillCount: number;
  assessedSkillCount: number;
}

export interface RecentLearningAttemptRow {
  id: string;
  activityId: string;
  activityTitle: string;
  subjectId: LearningSubjectId | string;
  assessed: boolean;
  accuracy: number | null;
  retryCount: number;
  completedAt: string;
}

const ACTIVITY_DESCRIPTORS: ProgressionActivityDescriptor[] = ACTIVITIES.map((activity) => {
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
  };
});

const STAGE_DESCRIPTORS: ProgressionStageDescriptor[] = STAGES.map((stage) => ({
  id: stage.id,
  subjectId: stage.subjectId,
  activityIds: stage.activityIds
}));

function recommendationFromAdaptive(top: ReturnType<typeof rankAdaptiveLearningV2>[number] | undefined): NextLearningRecommendation | undefined {
  if (!top) return undefined;
  const activity = getActivity(top.id);
  if (!activity) return undefined;
  const targetSkill = top.targetSkillId ? getLearningSkill(top.targetSkillId) : undefined;
  return {
    activity,
    reason: top.reason,
    reasonLabel: adaptiveReasonLabel(top.reason, targetSkill?.title ?? null),
    targetSkillId: top.targetSkillId,
    targetSkillTitle: targetSkill?.title ?? null
  };
}

export function getStageLearningState(
  stageId: string,
  progress: LearningProgress,
  analytics: LearningAnalyticsSnapshot
): StageLearningState | null {
  const stage = getStage(stageId);
  if (!stage) return null;
  return calculateStageLearningState({
    stage: { id: stage.id, subjectId: stage.subjectId, activityIds: stage.activityIds },
    activities: ACTIVITY_DESCRIPTORS,
    completedActivityIds: progress.completedActivityIds,
    masteryBySkill: analytics.masteryBySkill
  });
}

export function getUnlockedStageIds(
  progress: LearningProgress,
  analytics: LearningAnalyticsSnapshot
): Set<string> {
  return new Set(STAGE_DESCRIPTORS.filter((stage) => isStageUnlocked({
    targetStageId: stage.id,
    stages: STAGE_DESCRIPTORS,
    activities: ACTIVITY_DESCRIPTORS,
    completedActivityIds: progress.completedActivityIds,
    masteryBySkill: analytics.masteryBySkill
  })).map((stage) => stage.id));
}

export function getSubjectStageReadiness(
  subjectId: LearningSubjectId,
  progress: LearningProgress,
  analytics: LearningAnalyticsSnapshot
): StageReadinessRow[] {
  const subjectStages = STAGE_DESCRIPTORS.filter((stage) => stage.subjectId === subjectId);
  const subjectActivities = ACTIVITY_DESCRIPTORS.filter((activity) => activity.subjectId === subjectId);
  const unlocked = new Set(subjectStages.filter((stage) => isStageUnlocked({
    targetStageId: stage.id,
    stages: subjectStages,
    activities: subjectActivities,
    completedActivityIds: progress.completedActivityIds,
    masteryBySkill: analytics.masteryBySkill
  })).map((stage) => stage.id));

  return STAGES.filter((stage) => stage.subjectId === subjectId).map((stage) => {
    const state = calculateStageLearningState({
      stage: { id: stage.id, subjectId: stage.subjectId, activityIds: stage.activityIds },
      activities: subjectActivities,
      completedActivityIds: progress.completedActivityIds,
      masteryBySkill: analytics.masteryBySkill
    });

    if (!unlocked.has(stage.id)) {
      return {
        stageId: stage.id,
        title: stage.title,
        subjectId,
        status: "locked" as const,
        statusLabel: "Terkunci",
        reason: "Selesaikan aktivitas inti dan evidence readiness stage sebelumnya terlebih dahulu.",
        completionRatio: state.completionRatio,
        completedCount: state.completedCount,
        requiredCount: state.requiredCount,
        evidenceReadiness: state.evidenceReadiness,
        evidencedSkillCount: state.evidencedSkillCount,
        assessedSkillCount: state.assessedSkillCount
      };
    }

    if (state.readyToAdvance) {
      return {
        stageId: stage.id,
        title: stage.title,
        subjectId,
        status: "ready" as const,
        statusLabel: "Siap lanjut",
        reason: state.assessedSkillCount
          ? "Aktivitas inti selesai dan evidence readiness sudah memenuhi syarat progression."
          : "Aktivitas inti selesai; stage practice ini tidak membutuhkan mastery evidence.",
        completionRatio: state.completionRatio,
        completedCount: state.completedCount,
        requiredCount: state.requiredCount,
        evidenceReadiness: state.evidenceReadiness,
        evidencedSkillCount: state.evidencedSkillCount,
        assessedSkillCount: state.assessedSkillCount
      };
    }

    if (state.completed && state.assessedSkillCount > 0) {
      const missingEvidence = state.evidencedSkillCount < state.assessedSkillCount;
      return {
        stageId: stage.id,
        title: stage.title,
        subjectId,
        status: "evidence_needed" as const,
        statusLabel: "Butuh evidence",
        reason: missingEvidence
          ? `Aktivitas inti selesai, tetapi ${state.assessedSkillCount - state.evidencedSkillCount} skill terukur belum punya qualifying evidence.`
          : "Aktivitas inti selesai, tetapi evidence readiness masih perlu diperkuat sebelum stage berikutnya terbuka.",
        completionRatio: state.completionRatio,
        completedCount: state.completedCount,
        requiredCount: state.requiredCount,
        evidenceReadiness: state.evidenceReadiness,
        evidencedSkillCount: state.evidencedSkillCount,
        assessedSkillCount: state.assessedSkillCount
      };
    }

    return {
      stageId: stage.id,
      title: stage.title,
      subjectId,
      status: "in_progress" as const,
      statusLabel: "Sedang berjalan",
      reason: `${Math.max(0, state.requiredCount - state.completedCount)} aktivitas inti masih perlu diselesaikan.`,
      completionRatio: state.completionRatio,
      completedCount: state.completedCount,
      requiredCount: state.requiredCount,
      evidenceReadiness: state.evidenceReadiness,
      evidencedSkillCount: state.evidencedSkillCount,
      assessedSkillCount: state.assessedSkillCount
    };
  });
}

export function getNextBestLearningRecommendation(args: {
  age: number;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
  allowMotion?: boolean;
}): NextLearningRecommendation | undefined {
  return recommendationFromAdaptive(rankAdaptiveLearningV2({
    age: args.age,
    progress: args.progress,
    analytics: args.analytics,
    allowMotion: args.allowMotion,
    limit: 1
  })[0]);
}

export function getSubjectNextLearningRecommendation(args: {
  subjectId: LearningSubjectId;
  age: number;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
  allowMotion?: boolean;
}): NextLearningRecommendation | undefined {
  return recommendationFromAdaptive(rankAdaptiveLearningV2({
    subjectId: args.subjectId,
    age: args.age,
    progress: args.progress,
    analytics: args.analytics,
    allowMotion: args.allowMotion,
    limit: 1
  })[0]);
}

export function getNextBestLearningActivity(args: {
  age: number;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
  allowMotion?: boolean;
}): LearningActivity | undefined {
  return getNextBestLearningRecommendation(args)?.activity;
}

export function getRecentLearningAttempts(
  analytics: LearningAnalyticsSnapshot,
  limit = 5
): RecentLearningAttemptRow[] {
  return analytics.attempts
    .slice()
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
    .slice(0, Math.max(0, limit))
    .map((attempt) => ({
      id: attempt.id,
      activityId: attempt.activityId,
      activityTitle: getActivity(attempt.activityId)?.title ?? attempt.activityId,
      subjectId: attempt.subjectId,
      assessed: attempt.assessed,
      accuracy: attempt.accuracy,
      retryCount: attempt.retryCount,
      completedAt: attempt.completedAt
    }));
}

export function getSubjectLearningSummary(
  subjectId: LearningSubjectId,
  progress: LearningProgress,
  analytics: LearningAnalyticsSnapshot
): SubjectLearningSummary {
  const subjectActivities = ACTIVITIES.filter((activity) => activity.subjectId === subjectId);
  const required = subjectActivities.filter((activity) => {
    const spec = getActivityLearningSpec(activity.id);
    return spec?.requiredForStage ?? (!activity.motionOptional && activity.runtime !== "motion_game");
  });
  const done = required.filter((activity) => progress.completedActivityIds.includes(activity.id)).length;
  const skills = getSkillsForSubject(subjectId as LearningSubjectKey);
  const mastery = summarizeSubjectMastery(skills.map((skill) => skill.id), analytics.masteryBySkill);
  return {
    subjectId,
    completionRatio: required.length ? done / required.length : 1,
    completedActivities: done,
    requiredActivities: required.length,
    masteryScore: mastery.score,
    masteryCoverage: mastery.coverage,
    masteredSkills: mastery.masteredSkills,
    proficientSkills: mastery.proficientSkills,
    totalSkills: mastery.totalSkills
  };
}

export function getSubjectSkillRows(
  subjectId: LearningSubjectId,
  analytics: LearningAnalyticsSnapshot
): Array<{ id: string; title: string; score: number; confidence: number; level: string; levelLabel: string }> {
  return getSkillsForSubject(subjectId as LearningSubjectKey).map((skill) => {
    const snapshot = analytics.masteryBySkill[skill.id];
    return {
      id: skill.id,
      title: skill.title,
      score: snapshot?.score ?? 0,
      confidence: snapshot?.confidence ?? 0,
      level: snapshot?.level ?? "not_started",
      levelLabel: masteryLabel(snapshot?.level ?? "not_started")
    };
  });
}

export function getLearningAchievements(
  progress: LearningProgress,
  analytics: LearningAnalyticsSnapshot
): LearningAchievement[] {
  const achievements: LearningAchievement[] = [];
  if (analytics.totalAttempts >= 1) achievements.push({ id: "first-attempt", title: "Langkah Pertama", description: "Menyelesaikan percobaan belajar pertama.", icon: "🌱" });
  if (progress.completedActivityIds.length >= 5) achievements.push({ id: "five-activities", title: "Penjelajah Belajar", description: "Menyelesaikan lima aktivitas berbeda.", icon: "🧭" });
  const snapshots = Object.values(analytics.masteryBySkill);
  if (snapshots.some((item) => item.level === "proficient" || item.level === "mastered")) achievements.push({ id: "first-proficient", title: "Mulai Mahir", description: "Mencapai level mahir pada satu skill.", icon: "✨" });
  if (snapshots.some((item) => item.level === "mastered")) achievements.push({ id: "first-mastered", title: "Skill Dikuasai", description: "Mengumpulkan evidence konsisten sampai satu skill dikuasai.", icon: "🏆" });
  const exploredSubjects = new Set(analytics.attempts.map((attempt) => attempt.subjectId));
  if (exploredSubjects.size >= SUBJECTS.length) achievements.push({ id: "all-subjects", title: "Petualang Mainlagi", description: "Mencoba semua area belajar Mainlagi.", icon: "🌈" });
  return achievements;
}

export function getCertificateEligibility(
  subjectId: LearningSubjectId,
  progress: LearningProgress,
  analytics: LearningAnalyticsSnapshot
): CertificateEligibility {
  const summary = getSubjectLearningSummary(subjectId, progress, analytics);
  const assessedSkills = getSkillsForSubject(subjectId as LearningSubjectKey).filter((skill) =>
    Object.values(ACTIVITY_LEARNING_SPECS).some((spec) =>
      spec.subjectId === subjectId && spec.assessment === "assessed" && spec.skills.some((link) => link.skillId === skill.id)
    )
  );
  const completionReady = summary.completionRatio >= 1;
  const hasAssessedSkills = assessedSkills.length > 0;
  const masteryReady = hasAssessedSkills && assessedSkills.every((skill) => {
    const level = analytics.masteryBySkill[skill.id]?.level;
    return level === "proficient" || level === "mastered";
  });
  return {
    eligible: completionReady && masteryReady,
    subjectId,
    completionReady,
    masteryReady,
    reason: !hasAssessedSkills
      ? "Sertifikat kompetensi belum tersedia karena area ini bersifat practice/kreatif dan tidak dinilai secara akademik."
      : !completionReady
        ? "Selesaikan semua aktivitas inti pada area ini."
        : !masteryReady
          ? "Kumpulkan evidence latihan yang konsisten sampai skill terukur minimal Mahir."
          : "Syarat completion dan evidence terpenuhi."
  };
}

export function getLowestMasterySkill(
  subjectId: LearningSubjectId,
  analytics: LearningAnalyticsSnapshot
): SkillMasterySnapshot | null {
  const skills = getSkillsForSubject(subjectId as LearningSubjectKey);
  const snapshots = skills
    .map((skill) => analytics.masteryBySkill[skill.id])
    .filter((item): item is SkillMasterySnapshot => Boolean(item));
  return snapshots.sort((a, b) => a.score - b.score)[0] ?? null;
}
