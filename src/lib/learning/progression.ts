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

export function rankNextActivities(args: {
  age: number;
  activities: ProgressionActivityDescriptor[];
  stages: ProgressionStageDescriptor[];
  completedActivityIds: string[];
  masteryBySkill: Record<string, SkillMasterySnapshot>;
  lastActivityId?: string | null;
  allowMotion?: boolean;
}): string[] {
  const completedSet = new Set(args.completedActivityIds);
  const scored = args.activities
    .filter((activity) => args.age >= activity.ageMin && args.age <= activity.ageMax)
    .filter((activity) => args.allowMotion || !activity.motionOptional)
    .filter((activity) => isStageUnlocked({
      targetStageId: activity.stageId,
      stages: args.stages,
      activities: args.activities,
      completedActivityIds: args.completedActivityIds,
      masteryBySkill: args.masteryBySkill
    }))
    .map((activity, index) => {
      const snapshots = activity.skillIds
        .map((skillId) => args.masteryBySkill[skillId])
        .filter((item): item is SkillMasterySnapshot => Boolean(item));
      const masteryScore = snapshots.length
        ? snapshots.reduce((sum, item) => sum + item.score, 0) / snapshots.length
        : 0;
      let score = 0;
      if (!completedSet.has(activity.id)) score += 60;
      if (activity.assessed) score += (1 - masteryScore) * 35;
      else if (!completedSet.has(activity.id)) score += 10;
      if (activity.id === args.lastActivityId) score -= 25;
      if (activity.motionOptional) score -= 10;
      score -= index * 0.001;
      return { id: activity.id, score };
    });
  return scored.sort((a, b) => b.score - a.score).map((item) => item.id);
}
