import * as base from "./systemBase";
import { BAHASA_BATCH8_ACTIVITIES, BAHASA_BATCH8_STAGES } from "./bahasaBatch8";
import { ENGLISH_BATCH9_ACTIVITIES, ENGLISH_BATCH9_STAGES } from "./englishBatch9";
import { MATH_BATCH7_ACTIVITIES, MATH_BATCH7_STAGES } from "./mathBatch7";
import type {
  LearningActivity,
  LearningChildProfile,
  LearningProgress,
  LearningStage,
  LearningSubject,
  LearningSubjectId
} from "./systemBase";

export type {
  CharacterId,
  LearningActivity,
  LearningChildProfile,
  LearningInputMode,
  LearningPreferences,
  LearningProgress,
  LearningRuntime,
  LearningStage,
  LearningSubject,
  LearningSubjectId,
  MatchItem
} from "./systemBase";

export const CHARACTERS = base.CHARACTERS;
export const SUBJECTS: LearningSubject[] = base.SUBJECTS;
export const ACTIVITIES: LearningActivity[] = [...base.ACTIVITIES, ...MATH_BATCH7_ACTIVITIES, ...BAHASA_BATCH8_ACTIVITIES, ...ENGLISH_BATCH9_ACTIVITIES];
export const STAGES: LearningStage[] = [...base.STAGES, ...MATH_BATCH7_STAGES, ...BAHASA_BATCH8_STAGES, ...ENGLISH_BATCH9_STAGES];

const SUBJECT_MAP = new Map(SUBJECTS.map((item) => [item.id, item]));
const STAGE_MAP = new Map(STAGES.map((item) => [item.id, item]));
const ACTIVITY_MAP = new Map(ACTIVITIES.map((item) => [item.id, item]));

export function getSubject(id: string): LearningSubject | undefined {
  return SUBJECT_MAP.get(id as LearningSubjectId);
}

export function getStage(id: string): LearningStage | undefined {
  return STAGE_MAP.get(id);
}

export function getActivity(id: string): LearningActivity | undefined {
  return ACTIVITY_MAP.get(id);
}

export function getStagesForSubject(subjectId: LearningSubjectId): LearningStage[] {
  return STAGES.filter((stage) => stage.subjectId === subjectId);
}

export function getActivitiesForStage(stageId: string): LearningActivity[] {
  const stage = getStage(stageId);
  if (!stage) return [];
  return stage.activityIds.map((id) => getActivity(id)).filter((item): item is LearningActivity => Boolean(item));
}

export const DEMO_PROFILE: LearningChildProfile = base.DEMO_PROFILE;
export const readProfiles = base.readProfiles;
export const readProfile = base.readProfile;
export const saveProfile = base.saveProfile;
export const readProgress = base.readProgress;
export const readPreferences = base.readPreferences;
export const savePreferences = base.savePreferences;

const PROGRESS_KEY = "mainlagi-learning-progress-v1";

export function completeActivity(childId: string, activityId: string): LearningProgress {
  const current = readProgress(childId);
  const alreadyDone = current.completedActivityIds.includes(activityId);
  const activity = getActivity(activityId);
  const next: LearningProgress = {
    completedActivityIds: alreadyDone ? current.completedActivityIds : [...current.completedActivityIds, activityId],
    stars: current.stars + (!alreadyDone && activity ? activity.stars : 0),
    lastActivityId: activityId
  };
  if (typeof window !== "undefined") {
    let all: Record<string, LearningProgress> = {};
    try {
      all = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<string, LearningProgress>;
    } catch {
      all = {};
    }
    all[childId] = next;
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("mainlagi-learning-progress", { detail: { childId } }));
  }
  return next;
}

export function getRecommendedActivities(age: number): LearningActivity[] {
  const inAge = ACTIVITIES.filter((activity) => age >= activity.ageMin && age <= activity.ageMax);
  return [
    ...inAge.filter((activity) => activity.runtime !== "motion_game"),
    ...inAge.filter((activity) => activity.runtime === "motion_game")
  ];
}

export function getNextActivity(age: number, progress: LearningProgress): LearningActivity | undefined {
  const recommended = getRecommendedActivities(age);
  return recommended.find((activity) => !progress.completedActivityIds.includes(activity.id)) ?? recommended[0];
}
