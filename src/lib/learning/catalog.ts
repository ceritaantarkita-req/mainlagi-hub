import * as base from "./catalogBase";
import { CONTENT_PACKS } from "./contentManifest";
import { MATH_BATCH7_SKILLS } from "./mathBatch7";
import type { ActivityLearningSpec, LearningSkillDefinition, LearningSubjectKey } from "./catalogBase";

export type {
  ActivityLearningSpec,
  ActivitySkillLink,
  LearningSkillDefinition,
  LearningSubjectKey,
  SkillDomain
} from "./catalogBase";

export const LEARNING_SKILLS: LearningSkillDefinition[] = [
  ...base.LEARNING_SKILLS.map((skill) => ({ ...skill })),
  ...MATH_BATCH7_SKILLS.map((skill) => ({ ...skill }))
];

export const ACTIVITY_LEARNING_SPECS: Record<string, ActivityLearningSpec> = Object.fromEntries(
  CONTENT_PACKS.flatMap((pack) => pack.activities.map((activity) => [
    activity.activityId,
    {
      activityId: activity.activityId,
      subjectId: pack.subjectId,
      stageId: pack.stageId,
      difficulty: activity.difficulty,
      assessment: activity.assessment,
      requiredForStage: activity.requiredForStage,
      skills: activity.skills.map((link) => ({ ...link }))
    }
  ] as const))
);

const SKILL_MAP = new Map(LEARNING_SKILLS.map((skill) => [skill.id, skill]));

export function getLearningSkill(skillId: string): LearningSkillDefinition | undefined {
  return SKILL_MAP.get(skillId);
}

export function getActivityLearningSpec(activityId: string): ActivityLearningSpec | undefined {
  return ACTIVITY_LEARNING_SPECS[activityId];
}

export function getSkillsForSubject(subjectId: LearningSubjectKey): LearningSkillDefinition[] {
  return LEARNING_SKILLS.filter((skill) => skill.subjectId === subjectId);
}
