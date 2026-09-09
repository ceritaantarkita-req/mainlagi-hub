import {
  ACTIVITIES,
  STAGES,
  getActivity,
  getStage,
  type LearningActivity,
  type LearningProgress,
  type LearningSubjectId
} from "./system";
import {
  ACTIVITY_LEARNING_SPECS,
  getActivityLearningSpec,
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
  rankNextActivities,
  type ProgressionActivityDescriptor,
  type ProgressionStageDescriptor,
  type StageLearningState
} from "./progression";
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

function activityDescriptors(): ProgressionActivityDescriptor[] {
  return ACTIVITIES.map((activity) => {
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
      assessed: spec?.assessment === "assessed"
    };
  });
}

function stageDescriptors(): ProgressionStageDescriptor[] {
  return STAGES.map((stage) => ({ id: stage.id, subjectId: stage.subjectId, activityIds: stage.activityIds }));
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
    activities: activityDescriptors(),
    completedActivityIds: progress.completedActivityIds,
    masteryBySkill: analytics.masteryBySkill
  });
}

export function getUnlockedStageIds(
  progress: LearningProgress,
  analytics: LearningAnalyticsSnapshot
): Set<string> {
  const activities = activityDescriptors();
  const stages = stageDescriptors();
  return new Set(stages.filter((stage) => isStageUnlocked({
    targetStageId: stage.id,
    stages,
    activities,
    completedActivityIds: progress.completedActivityIds,
    masteryBySkill: analytics.masteryBySkill
  })).map((stage) => stage.id));
}

export function getNextBestLearningActivity(args: {
  age: number;
  progress: LearningProgress;
  analytics: LearningAnalyticsSnapshot;
  allowMotion?: boolean;
}): LearningActivity | undefined {
  const ranked = rankNextActivities({
    age: args.age,
    activities: activityDescriptors(),
    stages: stageDescriptors(),
    completedActivityIds: args.progress.completedActivityIds,
    masteryBySkill: args.analytics.masteryBySkill,
    lastActivityId: args.progress.lastActivityId,
    allowMotion: args.allowMotion
  });
  return ranked.map((id) => getActivity(id)).find((item): item is LearningActivity => Boolean(item));
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
  if (exploredSubjects.size >= 5) achievements.push({ id: "all-subjects", title: "Petualang Mainlagi", description: "Mencoba semua area belajar Mainlagi.", icon: "🌈" });
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
  const masteryReady = assessedSkills.length === 0 || assessedSkills.every((skill) => {
    const level = analytics.masteryBySkill[skill.id]?.level;
    return level === "proficient" || level === "mastered";
  });
  return {
    eligible: completionReady && masteryReady,
    subjectId,
    completionReady,
    masteryReady,
    reason: !completionReady
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
