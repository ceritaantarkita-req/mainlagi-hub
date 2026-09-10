import * as base from "./contentManifestBase";
import {
  MATH_BATCH7_CONTENT_PACKS,
  MATH_BATCH7_LESSON_CORES,
  MATH_BATCH7_STAGE_IDS
} from "./mathBatch7";
import type {
  ContentLessonDefinition,
  ContentPackActivityDefinition,
  ContentPackDefinition,
  ContentPathDefinition
} from "./contentManifestBase";

export type {
  ContentAssessment,
  ContentLessonDefinition,
  ContentMechanicDefinition,
  ContentMechanicId,
  ContentPackActivityDefinition,
  ContentPackDefinition,
  ContentPathDefinition,
  ContentReviewStatus,
  ContentSkillLink,
  EvidenceContractId
} from "./contentManifestBase";

export const CONTENT_MECHANICS = base.CONTENT_MECHANICS;
export const normalizeContentSlug = base.normalizeContentSlug;
export const makeContentPackId = base.makeContentPackId;
export const makeGeneratedActivityId = base.makeGeneratedActivityId;

export const CONTENT_PATHS: ContentPathDefinition[] = base.CONTENT_PATHS.map((path) =>
  path.id === "math-fondasi-numerasi"
    ? { ...path, stageIds: [...path.stageIds, ...MATH_BATCH7_STAGE_IDS] }
    : { ...path, stageIds: [...path.stageIds] }
);

export const CONTENT_PACKS: ContentPackDefinition[] = [
  ...base.CONTENT_PACKS.map((pack) => ({ ...pack, activities: pack.activities.map((activity) => ({ ...activity, skills: activity.skills.map((skill) => ({ ...skill })) })) })),
  ...MATH_BATCH7_CONTENT_PACKS
];

const BATCH7_ACTIVITY_IDS_BY_LESSON = new Map<string, string[]>();
for (const pack of MATH_BATCH7_CONTENT_PACKS) {
  for (const activity of pack.activities) {
    const ids = BATCH7_ACTIVITY_IDS_BY_LESSON.get(activity.lessonId) ?? [];
    ids.push(activity.activityId);
    BATCH7_ACTIVITY_IDS_BY_LESSON.set(activity.lessonId, ids);
  }
}

export const CONTENT_LESSONS: ContentLessonDefinition[] = [
  ...base.CONTENT_LESSONS.map((lesson) => ({ ...lesson, activityIds: [...lesson.activityIds] })),
  ...MATH_BATCH7_LESSON_CORES.map((lesson) => ({
    ...lesson,
    activityIds: [...(BATCH7_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])]
  }))
];

const PACK_MAP = new Map(CONTENT_PACKS.map((pack) => [pack.id, pack]));
const ACTIVITY_META_MAP = new Map(
  CONTENT_PACKS.flatMap((pack) => pack.activities.map((activity) => [activity.activityId, { pack, activity }] as const))
);

export function getContentPack(packId: string): ContentPackDefinition | undefined {
  return PACK_MAP.get(packId);
}

export function getContentForActivity(activityId: string): { pack: ContentPackDefinition; activity: ContentPackActivityDefinition } | undefined {
  return ACTIVITY_META_MAP.get(activityId);
}

export function getContentPacksForStage(stageId: string): ContentPackDefinition[] {
  return CONTENT_PACKS.filter((pack) => pack.stageId === stageId);
}

export function getContentPacksForLesson(lessonId: string): ContentPackDefinition[] {
  return CONTENT_PACKS.filter((pack) => pack.activities.some((activity) => activity.lessonId === lessonId));
}
