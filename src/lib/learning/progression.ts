import type { SkillMasterySnapshot } from "./mastery";

export interface ProgressionActivityDescriptor {
  id: string;
  subjectId: string;
  stageId: string;
  ageMin: number;
  ageMax: number;
  requiredForStage: boolean;
  motionOptional: boolean;
  skillIds: string[];
  assessed: boolean;
  difficulty?: 1 | 2 | 3;
}

export interface ProgressionStageDescriptor {
  id: string;
  subjectId: string;
  activityIds: string[];
}

export interface StageLearningState {
  stageId: string;
  requiredCount: number;
  completedCount: number;
  completionRatio: number;
  assessedSkillCount: number;
  evidencedSkillCount: number;
  evidenceReadiness: number;
  completed: boolean;
  readyToAdvance: boolean;
}

export type RecommendationReason =
  | "finish_core"
  | "first_evidence"
  | "strengthen_skill"
  | "new_activity"
  | "practice";

export interface RankedActivityRecommendation {
  id: string;
  score: number;
  reason: RecommendationReason;
  targetSkillId: string | null;
}

export function calculateStageLearningState(args: {
  stage: ProgressionStageDescriptor;
  activities: ProgressionActivityDescriptor[];
  completedActivityIds: string[];
  masteryBySkill: Record<string, SkillMasterySnapshot>;
}): StageLearningState {
  const activityMap = new Map(args.activities.map((item) => [item.id, item]));
  const required = args.stage.activityIds
    .map((id) => activityMap.get(id))
    .filter((item): item is ProgressionActivityDescriptor => Boolean(item?.requiredForStage));
  const completedSet = new Set(args.completedActivityIds);
  const completedCount = required.filter((item) => completedSet.has(item.id)).length;
  const assessedSkills = [...new Set(required.filter((item) => item.assessed).flatMap((item) => item.skillIds))];
  const evidenced = assessedSkills
    .map((skillId) => args.masteryBySkill[skillId])
    .filter((item): item is SkillMasterySnapshot => Boolean(item && item.qualifyingEvidenceCount > 0));
  const evidenceReadiness = evidenced.length
    ? evidenced.reduce((sum, item) => sum + item.score, 0) / evidenced.length
    : 0;
  const completed = required.length === 0 || completedCount === required.length;
  const evidenceComplete = assessedSkills.length === 0 || evidenced.length === assessedSkills.length;
  const readyToAdvance = completed && (assessedSkills.length === 0 || (evidenceComplete && evidenceReadiness >= 0.45));

  return {
    stageId: args.stage.id,
    requiredCount: required.length,
    completedCount,
    completionRatio: required.length ? completedCount / required.length : 1,
    assessedSkillCount: assessedSkills.length,
    evidencedSkillCount: evidenced.length,
    evidenceReadiness,
    completed,
    readyToAdvance
  };
}

export function isStageUnlocked(args: {
  targetStageId: string;
  stages: ProgressionStageDescriptor[];
  activities: ProgressionActivityDescriptor[];
  completedActivityIds: string[];
  masteryBySkill: Record<string, SkillMasterySnapshot>;
}): boolean {
  const target = args.stages.find((stage) => stage.id === args.targetStageId);
  if (!target) return false;
  const subjectStages = args.stages.filter((stage) => stage.subjectId === target.subjectId);
  const index = subjectStages.findIndex((stage) => stage.id === target.id);
  if (index <= 0) return index === 0;
  const previous = subjectStages[index - 1];
  return calculateStageLearningState({
    stage: previous,
    activities: args.activities,
    completedActivityIds: args.completedActivityIds,
    masteryBySkill: args.masteryBySkill
  }).readyToAdvance;
}

function preferredDifficulty(age: number): 1 | 2 | 3 {
  if (age <= 4) return 1;
  if (age <= 6) return 2;
  return 3;
}

function weakestSnapshot(
  activity: ProgressionActivityDescriptor,
  masteryBySkill: Record<string, SkillMasterySnapshot>
): SkillMasterySnapshot | null {
  const snapshots = activity.skillIds
    .map((skillId) => masteryBySkill[skillId])
    .filter((item): item is SkillMasterySnapshot => Boolean(item));
  if (!snapshots.length) return null;
  return [...snapshots].sort((a, b) => {
    if (a.qualifyingEvidenceCount !== b.qualifyingEvidenceCount) return a.qualifyingEvidenceCount - b.qualifyingEvidenceCount;
    if (a.score !== b.score) return a.score - b.score;
    return a.confidence - b.confidence;
  })[0];
}

export function rankActivityRecommendations(args: {
  age: number;
  activities: ProgressionActivityDescriptor[];
  stages: ProgressionStageDescriptor[];
  completedActivityIds: string[];
  masteryBySkill: Record<string, SkillMasterySnapshot>;
  lastActivityId?: string | null;
  allowMotion?: boolean;
}): RankedActivityRecommendation[] {
  const completedSet = new Set(args.completedActivityIds);
  const preferred = preferredDifficulty(args.age);

  // Batch 15 scaling: stage unlock is a stage-level decision. Compute it once
  // for each stage instead of recalculating the same previous-stage readiness
  // for every candidate activity in a 900-item catalog.
  const unlockedStageIds = new Set(
    args.stages
      .filter((stage) => isStageUnlocked({
        targetStageId: stage.id,
        stages: args.stages,
        activities: args.activities,
        completedActivityIds: args.completedActivityIds,
        masteryBySkill: args.masteryBySkill
      }))
      .map((stage) => stage.id)
  );

  const scored = args.activities
    .filter((activity) => args.age >= activity.ageMin && args.age <= activity.ageMax)
    .filter((activity) => args.allowMotion || !activity.motionOptional)
    .filter((activity) => unlockedStageIds.has(activity.stageId))
    .map((activity, index): RankedActivityRecommendation => {
      const weak = weakestSnapshot(activity, args.masteryBySkill);
      const completed = completedSet.has(activity.id);
      const difficulty = activity.difficulty ?? 1;
      let score = 0;

      // Core completion is the strongest product-level priority, but mastery
      // evidence still controls later stage readiness.
      if (activity.requiredForStage && !completed) score += 70;
      else if (!completed) score += 48;

      let reason: RecommendationReason = completed ? "practice" : "new_activity";
      if (activity.assessed) {
        if (!weak || weak.qualifyingEvidenceCount === 0) {
          score += 32;
          reason = "first_evidence";
        } else if (weak.level !== "mastered") {
          score += (1 - weak.score) * 30;
          score += (1 - weak.confidence) * 12;
          reason = "strengthen_skill";
        } else {
          score -= 18;
        }
      } else if (!completed) {
        score += 8;
      }

      if (activity.requiredForStage && !completed) reason = "finish_core";

      // Keep recommendations developmentally gentle. Difficulty is a soft
      // signal only; age eligibility remains the hard boundary.
      score -= Math.abs(difficulty - preferred) * 5;

      // Avoid loops and camera pressure.
      if (activity.id === args.lastActivityId) score -= 35;
      if (activity.motionOptional) score -= 12;

      // Stable deterministic tie-breaker.
      score -= index * 0.001;

      return {
        id: activity.id,
        score,
        reason,
        targetSkillId: weak?.skillId ?? activity.skillIds[0] ?? null
      };
    });

  return scored.sort((a, b) => b.score - a.score);
}

export function rankNextActivities(args: {
  age: number;
  activities: ProgressionActivityDescriptor[];
  stages: ProgressionStageDescriptor[];
  completedActivityIds: string[];
  masteryBySkill: Record<string, SkillMasterySnapshot>;
  lastActivityId?: string | null;
  allowMotion?: boolean;
}): string[] {
  return rankActivityRecommendations(args).map((item) => item.id);
}
