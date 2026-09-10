import * as base from "./catalogBase";
import { BAHASA_BATCH8_SKILLS } from "./bahasaBatch8";
import { CONTENT_PACKS } from "./contentManifest";
import { ENGLISH_BATCH9_SKILLS } from "./englishBatch9";
import { IQRO_BATCH10_SKILLS } from "./iqroBatch10";
import { LETTERS_BATCH11_SKILLS } from "./lettersBatch11";
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
  ...MATH_BATCH7_SKILLS.map((skill) => ({ ...skill })),
  ...BAHASA_BATCH8_SKILLS.map((skill) => ({ ...skill })),
  ...ENGLISH_BATCH9_SKILLS.map((skill) => ({ ...skill })),
  ...IQRO_BATCH10_SKILLS.map((skill) => ({ ...skill })),
  ...LETTERS_BATCH11_SKILLS.map((skill) => ({ ...skill }))
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
