import { ACTIVITIES, STAGES, type LearningSubjectId } from "./system";
import {
  CONTENT_LESSONS,
  CONTENT_PATHS,
  type ContentLessonDefinition,
  type ContentPathDefinition
} from "./contentManifest";

export interface LearningPathDefinition extends ContentPathDefinition {}
export interface LearningLessonDefinition extends ContentLessonDefinition {}

/**
 * Canonical curriculum navigation layer.
 *
 * Batch 4 moves curriculum ownership into contentManifest.ts so content packs,
 * lessons, assessment metadata, and stable activity IDs share one hierarchy.
 * These exports are compatibility projections used by existing UI/progression
 * code; callers do not need to change routes or stored history.
 *
 * These are Mainlagi product curriculum definitions, not a claim of alignment
 * with a government or third-party curriculum standard.
 */
export const LEARNING_PATHS: LearningPathDefinition[] = CONTENT_PATHS;
export const LEARNING_LESSONS: LearningLessonDefinition[] = CONTENT_LESSONS;

const PATH_MAP = new Map(LEARNING_PATHS.map((item) => [item.id, item]));
const LESSON_MAP = new Map(LEARNING_LESSONS.map((item) => [item.id, item]));
const ACTIVITY_LESSON_MAP = new Map(
  LEARNING_LESSONS.flatMap((lesson) => lesson.activityIds.map((activityId) => [activityId, lesson] as const))
);

export function getLearningPath(pathId: string): LearningPathDefinition | undefined {
  return PATH_MAP.get(pathId);
}

export function getLearningPathsForSubject(subjectId: LearningSubjectId): LearningPathDefinition[] {
  return LEARNING_PATHS.filter((item) => item.subjectId === subjectId);
}

export function getLesson(lessonId: string): LearningLessonDefinition | undefined {
  return LESSON_MAP.get(lessonId);
}

export function getLessonsForStage(stageId: string): LearningLessonDefinition[] {
  return LEARNING_LESSONS.filter((item) => item.stageId === stageId);
}

export function getLessonForActivity(activityId: string): LearningLessonDefinition | undefined {
  return ACTIVITY_LESSON_MAP.get(activityId);
}

export interface CurriculumCoverage {
  stageCount: number;
  lessonCount: number;
  activityCount: number;
  uncoveredStageIds: string[];
  uncoveredActivityIds: string[];
}

export function getCurriculumCoverage(): CurriculumCoverage {
  const coveredStages = new Set(LEARNING_PATHS.flatMap((path) => path.stageIds));
  const coveredActivities = new Set(LEARNING_LESSONS.flatMap((lesson) => lesson.activityIds));
  return {
    stageCount: STAGES.length,
    lessonCount: LEARNING_LESSONS.length,
    activityCount: ACTIVITIES.length,
    uncoveredStageIds: STAGES.filter((stage) => !coveredStages.has(stage.id)).map((stage) => stage.id),
    uncoveredActivityIds: ACTIVITIES.filter((activity) => !coveredActivities.has(activity.id)).map((activity) => activity.id)
  };
}
