import * as base from "./contentManifestBase";
import {
  BAHASA_BATCH8_CONTENT_PACKS,
  BAHASA_BATCH8_LESSON_CORES,
  BAHASA_BATCH8_STAGE_IDS
} from "./bahasaBatch8";
import {
  ENGLISH_BATCH9_CONTENT_PACKS,
  ENGLISH_BATCH9_LESSON_CORES,
  ENGLISH_BATCH9_STAGE_IDS
} from "./englishBatch9";
import {
  IQRO_BATCH10_CONTENT_PACKS,
  IQRO_BATCH10_LESSON_CORES,
  IQRO_BATCH10_STAGE_IDS
} from "./iqroBatch10";
import {
  LETTERS_BATCH11_CONTENT_PACKS,
  LETTERS_BATCH11_LESSON_CORES,
  LETTERS_BATCH11_STAGE_IDS
} from "./lettersBatch11";
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

export const CONTENT_PATHS: ContentPathDefinition[] = base.CONTENT_PATHS.map((path) => {
  if (path.id === "math-fondasi-numerasi") return { ...path, stageIds: [...path.stageIds, ...MATH_BATCH7_STAGE_IDS] };
  if (path.id === "bahasa-fondasi-literasi") return { ...path, stageIds: [...path.stageIds, ...BAHASA_BATCH8_STAGE_IDS] };
  if (path.id === "english-first-steps") return { ...path, stageIds: [...path.stageIds, ...ENGLISH_BATCH9_STAGE_IDS] };
  if (path.id === "iqro-fondasi-hijaiyah") return { ...path, stageIds: [...path.stageIds, ...IQRO_BATCH10_STAGE_IDS] };
  if (path.id === "letters-writing-foundations") return { ...path, stageIds: [...path.stageIds, ...LETTERS_BATCH11_STAGE_IDS] };
  return { ...path, stageIds: [...path.stageIds] };
});

export const CONTENT_PACKS: ContentPackDefinition[] = [
  ...base.CONTENT_PACKS.map((pack) => ({ ...pack, activities: pack.activities.map((activity) => ({ ...activity, skills: activity.skills.map((skill) => ({ ...skill })) })) })),
  ...MATH_BATCH7_CONTENT_PACKS,
  ...BAHASA_BATCH8_CONTENT_PACKS,
  ...ENGLISH_BATCH9_CONTENT_PACKS,
  ...IQRO_BATCH10_CONTENT_PACKS,
  ...LETTERS_BATCH11_CONTENT_PACKS
];

const EXPANSION_ACTIVITY_IDS_BY_LESSON = new Map<string, string[]>();
for (const pack of [
  ...MATH_BATCH7_CONTENT_PACKS,
  ...BAHASA_BATCH8_CONTENT_PACKS,
  ...ENGLISH_BATCH9_CONTENT_PACKS,
  ...IQRO_BATCH10_CONTENT_PACKS,
  ...LETTERS_BATCH11_CONTENT_PACKS
]) {
  for (const activity of pack.activities) {
    const ids = EXPANSION_ACTIVITY_IDS_BY_LESSON.get(activity.lessonId) ?? [];
    ids.push(activity.activityId);
    EXPANSION_ACTIVITY_IDS_BY_LESSON.set(activity.lessonId, ids);
  }
}

export const CONTENT_LESSONS: ContentLessonDefinition[] = [
  ...base.CONTENT_LESSONS.map((lesson) => ({ ...lesson, activityIds: [...lesson.activityIds] })),
  ...MATH_BATCH7_LESSON_CORES.map((lesson) => ({
    ...lesson,
    activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])]
  })),
  ...BAHASA_BATCH8_LESSON_CORES.map((lesson) => ({
    ...lesson,
    activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])]
  })),
  ...ENGLISH_BATCH9_LESSON_CORES.map((lesson) => ({
    ...lesson,
    activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])]
  })),
  ...IQRO_BATCH10_LESSON_CORES.map((lesson) => ({
    ...lesson,
    activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])]
  })),
  ...LETTERS_BATCH11_LESSON_CORES.map((lesson) => ({
    ...lesson,
    activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])]
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
