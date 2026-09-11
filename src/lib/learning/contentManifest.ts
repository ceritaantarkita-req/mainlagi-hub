import * as base from "./contentManifestBase";
import {
  BAHASA_BATCH8_CONTENT_PACKS,
  BAHASA_BATCH8_LESSON_CORES,
  BAHASA_BATCH8_STAGE_IDS
} from "./bahasaBatch8";
import {
  CREATIVE_BATCH14_COLOR_STAGE_IDS,
  CREATIVE_BATCH14_CONTENT_PACKS,
  CREATIVE_BATCH14_DRAWING_PATH,
  CREATIVE_BATCH14_LESSON_CORES
} from "./creativeBatch14";
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
  LOGIC_BATCH12_CONTENT_PACKS,
  LOGIC_BATCH12_LESSON_CORES,
  LOGIC_BATCH12_STAGE_IDS
} from "./logicBatch12";
import {
  MATH_BATCH7_CONTENT_PACKS,
  MATH_BATCH7_LESSON_CORES,
  MATH_BATCH7_STAGE_IDS
} from "./mathBatch7";
import {
  SCIENCE_BATCH13_CONTENT_PACKS,
  SCIENCE_BATCH13_LESSON_CORES,
  SCIENCE_BATCH13_STAGE_IDS
} from "./scienceBatch13";
import type {
  ContentLessonDefinition as BaseContentLessonDefinition,
  ContentMechanicDefinition as BaseContentMechanicDefinition,
  ContentMechanicId as BaseContentMechanicId,
  ContentPackActivityDefinition as BaseContentPackActivityDefinition,
  ContentPackDefinition as BaseContentPackDefinition,
  ContentPathDefinition as BaseContentPathDefinition
} from "./contentManifestBase";
import type { LearningRuntime, LearningSubjectId } from "./system";

export type {
  ContentAssessment,
  ContentReviewStatus,
  ContentSkillLink,
  EvidenceContractId
} from "./contentManifestBase";

export type ContentMechanicId = BaseContentMechanicId | "drawing";

export interface ContentMechanicDefinition extends Omit<BaseContentMechanicDefinition, "id" | "runtime"> {
  id: ContentMechanicId;
  runtime: LearningRuntime;
}

export interface ContentPathDefinition extends Omit<BaseContentPathDefinition, "subjectId"> {
  subjectId: LearningSubjectId;
}

export interface ContentLessonDefinition extends Omit<BaseContentLessonDefinition, "subjectId"> {
  subjectId: LearningSubjectId;
}

export interface ContentPackActivityDefinition extends Omit<BaseContentPackActivityDefinition, "mechanicId"> {
  mechanicId: ContentMechanicId;
}

export interface ContentPackDefinition extends Omit<BaseContentPackDefinition, "subjectId" | "activities"> {
  subjectId: LearningSubjectId;
  activities: ContentPackActivityDefinition[];
}

export const CONTENT_MECHANICS: Record<ContentMechanicId, ContentMechanicDefinition> = {
  ...base.CONTENT_MECHANICS,
  drawing: {
    id: "drawing",
    runtime: "drawing",
    assessmentModes: ["practice"],
    requiredPayloadFields: ["drawingGuide"]
  }
};
export const normalizeContentSlug = base.normalizeContentSlug;
export const makeContentPackId = base.makeContentPackId;
export const makeGeneratedActivityId = base.makeGeneratedActivityId;

export const CONTENT_PATHS: ContentPathDefinition[] = [
  ...base.CONTENT_PATHS.map((path) => {
    if (path.id === "math-fondasi-numerasi") return { ...path, stageIds: [...path.stageIds, ...MATH_BATCH7_STAGE_IDS] };
    if (path.id === "bahasa-fondasi-literasi") return { ...path, stageIds: [...path.stageIds, ...BAHASA_BATCH8_STAGE_IDS] };
    if (path.id === "english-first-steps") return { ...path, stageIds: [...path.stageIds, ...ENGLISH_BATCH9_STAGE_IDS] };
    if (path.id === "iqro-fondasi-hijaiyah") return { ...path, stageIds: [...path.stageIds, ...IQRO_BATCH10_STAGE_IDS] };
    if (path.id === "letters-writing-foundations") return { ...path, stageIds: [...path.stageIds, ...LETTERS_BATCH11_STAGE_IDS] };
    if (path.id === "logic-thinking-foundations") return { ...path, stageIds: [...path.stageIds, ...LOGIC_BATCH12_STAGE_IDS] };
    if (path.id === "science-discovery-foundations") return { ...path, stageIds: [...path.stageIds, ...SCIENCE_BATCH13_STAGE_IDS] };
    if (path.id === "color-creative-play") return { ...path, stageIds: [...path.stageIds, ...CREATIVE_BATCH14_COLOR_STAGE_IDS] };
    return { ...path, stageIds: [...path.stageIds] };
  }),
  { ...CREATIVE_BATCH14_DRAWING_PATH, stageIds: [...CREATIVE_BATCH14_DRAWING_PATH.stageIds] }
];

export const CONTENT_PACKS: ContentPackDefinition[] = [
  ...base.CONTENT_PACKS.map((pack) => ({ ...pack, activities: pack.activities.map((activity) => ({ ...activity, skills: activity.skills.map((skill) => ({ ...skill })) })) })),
  ...MATH_BATCH7_CONTENT_PACKS,
  ...BAHASA_BATCH8_CONTENT_PACKS,
  ...ENGLISH_BATCH9_CONTENT_PACKS,
  ...IQRO_BATCH10_CONTENT_PACKS,
  ...LETTERS_BATCH11_CONTENT_PACKS,
  ...LOGIC_BATCH12_CONTENT_PACKS,
  ...SCIENCE_BATCH13_CONTENT_PACKS,
  ...CREATIVE_BATCH14_CONTENT_PACKS
];

const EXPANSION_ACTIVITY_IDS_BY_LESSON = new Map<string, string[]>();
for (const pack of [
  ...MATH_BATCH7_CONTENT_PACKS,
  ...BAHASA_BATCH8_CONTENT_PACKS,
  ...ENGLISH_BATCH9_CONTENT_PACKS,
  ...IQRO_BATCH10_CONTENT_PACKS,
  ...LETTERS_BATCH11_CONTENT_PACKS,
  ...LOGIC_BATCH12_CONTENT_PACKS,
  ...SCIENCE_BATCH13_CONTENT_PACKS,
  ...CREATIVE_BATCH14_CONTENT_PACKS
]) {
  for (const activity of pack.activities) {
    const ids = EXPANSION_ACTIVITY_IDS_BY_LESSON.get(activity.lessonId) ?? [];
    ids.push(activity.activityId);
    EXPANSION_ACTIVITY_IDS_BY_LESSON.set(activity.lessonId, ids);
  }
}

export const CONTENT_LESSONS: ContentLessonDefinition[] = [
  ...base.CONTENT_LESSONS.map((lesson) => ({ ...lesson, activityIds: [...lesson.activityIds] })),
  ...MATH_BATCH7_LESSON_CORES.map((lesson) => ({ ...lesson, activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])] })),
  ...BAHASA_BATCH8_LESSON_CORES.map((lesson) => ({ ...lesson, activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])] })),
  ...ENGLISH_BATCH9_LESSON_CORES.map((lesson) => ({ ...lesson, activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])] })),
  ...IQRO_BATCH10_LESSON_CORES.map((lesson) => ({ ...lesson, activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])] })),
  ...LETTERS_BATCH11_LESSON_CORES.map((lesson) => ({ ...lesson, activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])] })),
  ...LOGIC_BATCH12_LESSON_CORES.map((lesson) => ({ ...lesson, activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])] })),
  ...SCIENCE_BATCH13_LESSON_CORES.map((lesson) => ({ ...lesson, activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])] })),
  ...CREATIVE_BATCH14_LESSON_CORES.map((lesson) => ({ ...lesson, activityIds: [...(EXPANSION_ACTIVITY_IDS_BY_LESSON.get(lesson.id) ?? [])] }))
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
