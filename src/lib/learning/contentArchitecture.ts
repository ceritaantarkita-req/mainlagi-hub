import { GAME_SLUGS } from "../data/games";
import { ACTIVITY_LEARNING_SPECS, LEARNING_SKILLS, type ActivityLearningSpec, type LearningSkillDefinition } from "./catalog";
import { LEARNING_LESSONS, LEARNING_PATHS, type LearningLessonDefinition, type LearningPathDefinition } from "./curriculum";
import {
  CONTENT_MECHANICS,
  CONTENT_PACKS,
  getContentForActivity,
  type ContentMechanicDefinition,
  type ContentMechanicId,
  type ContentPackDefinition
} from "./contentManifest";
import {
  ACTIVITIES,
  STAGES,
  SUBJECTS,
  type LearningActivity,
  type LearningStage,
  type LearningSubject
} from "./system";

export type ContentValidationSeverity = "error" | "warning";

export interface ContentValidationIssue {
  severity: ContentValidationSeverity;
  code: string;
  message: string;
  entityId?: string;
}

export interface ContentArchitectureStats {
  subjects: number;
  paths: number;
  stages: number;
  lessons: number;
  packs: number;
  activities: number;
  skills: number;
  mechanics: number;
  assessedActivities: number;
  practiceActivities: number;
}

export interface ContentValidationReport {
  errors: ContentValidationIssue[];
  warnings: ContentValidationIssue[];
  stats: ContentArchitectureStats;
}

export interface ContentArchitectureModel {
  subjects: LearningSubject[];
  paths: LearningPathDefinition[];
  stages: LearningStage[];
  lessons: LearningLessonDefinition[];
  packs: ContentPackDefinition[];
  activities: LearningActivity[];
  skills: LearningSkillDefinition[];
  learningSpecs: Record<string, ActivityLearningSpec>;
  mechanics: Record<ContentMechanicId, ContentMechanicDefinition>;
  gameSlugs: readonly string[];
}

export const DEFAULT_CONTENT_ARCHITECTURE_MODEL: ContentArchitectureModel = {
  subjects: SUBJECTS,
  paths: LEARNING_PATHS,
  stages: STAGES,
  lessons: LEARNING_LESSONS,
  packs: CONTENT_PACKS,
  activities: ACTIVITIES,
  skills: LEARNING_SKILLS,
  learningSpecs: ACTIVITY_LEARNING_SPECS,
  mechanics: CONTENT_MECHANICS,
  gameSlugs: GAME_SLUGS
};

function issue(
  collection: ContentValidationIssue[],
  severity: ContentValidationSeverity,
  code: string,
  message: string,
  entityId?: string
): void {
  collection.push({ severity, code, message, entityId });
}

function validAgeRange(ageMin: number, ageMax: number): boolean {
  return Number.isInteger(ageMin) && Number.isInteger(ageMax) && ageMin >= 3 && ageMax <= 7 && ageMin <= ageMax;
}

function overlapsAge(aMin: number, aMax: number, bMin: number, bMax: number): boolean {
  return aMax >= bMin && aMin <= bMax;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function uniqueStrings(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function pushDuplicateIssues<T extends { id: string }>(
  items: readonly T[],
  label: string,
  issues: ContentValidationIssue[]
): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.id || item.id.trim() !== item.id) {
      issue(issues, "error", "INVALID_ID", `${label} ID must be a non-empty trimmed string`, item.id);
      continue;
    }
    if (seen.has(item.id)) issue(issues, "error", "DUPLICATE_ID", `Duplicate ${label} ID: ${item.id}`, item.id);
    seen.add(item.id);
  }
}

function matchingPairCounts(activity: LearningActivity): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of activity.matchItems ?? []) counts.set(item.pair, (counts.get(item.pair) ?? 0) + 1);
  return counts;
}

export function getActivityContentFingerprint(activity: LearningActivity): string {
  const common = [activity.subjectId, activity.runtime];
  if (activity.runtime === "tap_choice" || activity.runtime === "listen_and_choose") {
    const choices = [...(activity.choices ?? [])].map(normalizeText).sort();
    return JSON.stringify([...common, normalizeText(activity.prompt ?? ""), choices, normalizeText(activity.correctChoice ?? "")]);
  }
  if (activity.runtime === "matching") {
    const pairs = [...(activity.matchItems ?? [])]
      .map((item) => `${normalizeText(item.pair)}:${normalizeText(item.label)}`)
      .sort();
    return JSON.stringify([...common, pairs]);
  }
  if (activity.runtime === "trace") return JSON.stringify([...common, normalizeText(activity.traceGlyph ?? "")]);
  if (activity.runtime === "story") return JSON.stringify([...common, (activity.storyLines ?? []).map(normalizeText)]);
  if (activity.runtime === "coloring") {
    return JSON.stringify([
      ...common,
      normalizeText(activity.creativePrompt ?? ""),
      normalizeText(activity.coloringCharacter ?? ""),
      (activity.coloringRegions ?? []).map(normalizeText)
    ]);
  }
  if (activity.runtime === "drawing") {
    return JSON.stringify([
      ...common,
      normalizeText(activity.creativePrompt ?? ""),
      normalizeText(activity.drawingGuide ?? "")
    ]);
  }
  return JSON.stringify([...common, activity.gameSlug ?? ""]);
}

function validateActivityPayload(
  activity: LearningActivity,
  mechanic: ContentMechanicDefinition,
  issues: ContentValidationIssue[]
): void {
  if (activity.runtime !== mechanic.runtime) {
    issue(issues, "error", "MECHANIC_RUNTIME_MISMATCH", `${activity.id} runtime ${activity.runtime} does not match mechanic ${mechanic.id}`, activity.id);
  }

  if (!validAgeRange(activity.ageMin, activity.ageMax)) {
    issue(issues, "error", "INVALID_ACTIVITY_AGE", `${activity.id} has invalid age range`, activity.id);
  }
  if (!Number.isInteger(activity.stars) || activity.stars < 0 || activity.stars > 20) {
    issue(issues, "error", "INVALID_STAR_REWARD", `${activity.id} star reward must be an integer from 0 to 20`, activity.id);
  }
  if (!activity.inputModes.includes(activity.preferredMobile)) {
    issue(issues, "error", "PREFERRED_INPUT_MISSING", `${activity.id} preferred input must be included in inputModes`, activity.id);
  }

  if (activity.runtime === "tap_choice" || activity.runtime === "listen_and_choose") {
    const choices = activity.choices ?? [];
    if (!activity.prompt?.trim()) issue(issues, "error", "MISSING_PROMPT", `${activity.id} needs a prompt`, activity.id);
    if (choices.length < 2) issue(issues, "error", "INSUFFICIENT_CHOICES", `${activity.id} needs at least two choices`, activity.id);
    if (!uniqueStrings(choices)) issue(issues, "error", "DUPLICATE_CHOICES", `${activity.id} choices must be unique`, activity.id);
    if (!activity.correctChoice || !choices.includes(activity.correctChoice)) {
      issue(issues, "error", "INVALID_CORRECT_CHOICE", `${activity.id} correctChoice must exist in choices`, activity.id);
    }
  } else if (activity.runtime === "matching") {
    const items = activity.matchItems ?? [];
    if (items.length < 4 || items.length % 2 !== 0) {
      issue(issues, "error", "INVALID_MATCHING_ITEMS", `${activity.id} needs an even matching set with at least four items`, activity.id);
    }
    const pairCounts = matchingPairCounts(activity);
    for (const [pair, count] of pairCounts) {
      if (!pair.trim() || count !== 2) {
        issue(issues, "error", "INVALID_MATCHING_PAIR", `${activity.id} pair ${pair || "<empty>"} must appear exactly twice`, activity.id);
      }
    }
  } else if (activity.runtime === "trace") {
    if (!activity.traceGlyph?.trim()) issue(issues, "error", "MISSING_TRACE_GLYPH", `${activity.id} needs traceGlyph`, activity.id);
  } else if (activity.runtime === "story") {
    if (!(activity.storyLines?.length)) issue(issues, "error", "MISSING_STORY_LINES", `${activity.id} needs story lines`, activity.id);
  } else if (activity.runtime === "coloring") {
    if (!activity.coloringCharacter) issue(issues, "error", "MISSING_COLORING_CHARACTER", `${activity.id} needs a coloring character`, activity.id);
    if (activity.creativePrompt && !(activity.coloringRegions?.length)) {
      issue(issues, "error", "MISSING_COLORING_REGIONS", `${activity.id} creative coloring activity needs interactive regions`, activity.id);
    }
  } else if (activity.runtime === "drawing") {
    if (!activity.creativePrompt?.trim()) issue(issues, "error", "MISSING_DRAWING_PROMPT", `${activity.id} needs a creative drawing prompt`, activity.id);
    if (!activity.drawingGuide?.trim()) issue(issues, "error", "MISSING_DRAWING_GUIDE", `${activity.id} needs a drawing guide`, activity.id);
  } else if (activity.runtime === "motion_game") {
    if (!activity.gameSlug) issue(issues, "error", "MISSING_GAME_SLUG", `${activity.id} needs a gameSlug`, activity.id);
    if (!activity.motionOptional || !activity.inputModes.includes("motion")) {
      issue(issues, "error", "INVALID_MOTION_BOUNDARY", `${activity.id} motion game must remain optional and expose motion input`, activity.id);
    }
  }
}

export function validateContentArchitecture(model: ContentArchitectureModel = DEFAULT_CONTENT_ARCHITECTURE_MODEL): ContentValidationReport {
  const errors: ContentValidationIssue[] = [];
  const warnings: ContentValidationIssue[] = [];
  const allIssues: ContentValidationIssue[] = [];

  pushDuplicateIssues(model.subjects, "subject", allIssues);
  pushDuplicateIssues(model.paths, "path", allIssues);
  pushDuplicateIssues(model.stages, "stage", allIssues);
  pushDuplicateIssues(model.lessons, "lesson", allIssues);
  pushDuplicateIssues(model.packs, "content pack", allIssues);
  pushDuplicateIssues(model.activities, "activity", allIssues);
  pushDuplicateIssues(model.skills, "skill", allIssues);

  const subjectMap = new Map(model.subjects.map((item) => [item.id, item]));
  const pathMap = new Map(model.paths.map((item) => [item.id, item]));
  const stageMap = new Map(model.stages.map((item) => [item.id, item]));
  const lessonMap = new Map(model.lessons.map((item) => [item.id, item]));
  const activityMap = new Map(model.activities.map((item) => [item.id, item]));
  const skillMap = new Map(model.skills.map((item) => [item.id, item]));
  const gameSlugs = new Set(model.gameSlugs);

  const stageOwner = new Map<string, string>();
  for (const path of model.paths) {
    if (!subjectMap.has(path.subjectId)) issue(allIssues, "error", "UNKNOWN_PATH_SUBJECT", `${path.id} references unknown subject ${path.subjectId}`, path.id);
    if (!validAgeRange(path.ageMin, path.ageMax)) issue(allIssues, "error", "INVALID_PATH_AGE", `${path.id} has invalid age range`, path.id);
    if (path.stageIds.length === 0) issue(allIssues, "error", "EMPTY_PATH", `${path.id} must contain at least one stage`, path.id);
    for (const stageId of path.stageIds) {
      const stage = stageMap.get(stageId);
      if (!stage) {
        issue(allIssues, "error", "UNKNOWN_PATH_STAGE", `${path.id} references unknown stage ${stageId}`, path.id);
        continue;
      }
      if (stage.subjectId !== path.subjectId) issue(allIssues, "error", "PATH_STAGE_SUBJECT_MISMATCH", `${stageId} subject does not match ${path.id}`, stageId);
      if (stageOwner.has(stageId)) issue(allIssues, "error", "MULTIPLE_STAGE_OWNERS", `${stageId} belongs to more than one path`, stageId);
      stageOwner.set(stageId, path.id);
    }
  }
  for (const stage of model.stages) {
    if (!stageOwner.has(stage.id)) issue(allIssues, "error", "UNOWNED_STAGE", `${stage.id} does not belong to a learning path`, stage.id);
    if (!subjectMap.has(stage.subjectId)) issue(allIssues, "error", "UNKNOWN_STAGE_SUBJECT", `${stage.id} references unknown subject`, stage.id);
    if (!uniqueStrings(stage.activityIds)) issue(allIssues, "error", "DUPLICATE_STAGE_ACTIVITY", `${stage.id} repeats an activity ID`, stage.id);
  }

  const lessonOwner = new Map<string, string>();
  const activityLessonOwner = new Map<string, string>();
  for (const lesson of model.lessons) {
    const path = pathMap.get(lesson.pathId);
    const stage = stageMap.get(lesson.stageId);
    if (!path) issue(allIssues, "error", "UNKNOWN_LESSON_PATH", `${lesson.id} references unknown path ${lesson.pathId}`, lesson.id);
    if (!stage) issue(allIssues, "error", "UNKNOWN_LESSON_STAGE", `${lesson.id} references unknown stage ${lesson.stageId}`, lesson.id);
    if (path && path.subjectId !== lesson.subjectId) issue(allIssues, "error", "LESSON_PATH_SUBJECT_MISMATCH", `${lesson.id} subject does not match its path`, lesson.id);
    if (stage && stage.subjectId !== lesson.subjectId) issue(allIssues, "error", "LESSON_STAGE_SUBJECT_MISMATCH", `${lesson.id} subject does not match its stage`, lesson.id);
    if (path && !path.stageIds.includes(lesson.stageId)) issue(allIssues, "error", "LESSON_STAGE_OUTSIDE_PATH", `${lesson.id} stage is not owned by its path`, lesson.id);
    if (!validAgeRange(lesson.ageMin, lesson.ageMax)) issue(allIssues, "error", "INVALID_LESSON_AGE", `${lesson.id} has invalid age range`, lesson.id);
    if (lesson.activityIds.length === 0) issue(allIssues, "error", "EMPTY_LESSON", `${lesson.id} must contain activities`, lesson.id);
    if (!uniqueStrings(lesson.activityIds)) issue(allIssues, "error", "DUPLICATE_LESSON_ACTIVITY", `${lesson.id} repeats an activity ID`, lesson.id);
    lessonOwner.set(lesson.id, lesson.pathId);
    for (const activityId of lesson.activityIds) {
      if (activityLessonOwner.has(activityId)) issue(allIssues, "error", "MULTIPLE_LESSON_OWNERS", `${activityId} belongs to more than one lesson`, activityId);
      activityLessonOwner.set(activityId, lesson.id);
    }
  }

  const manifestActivityOwner = new Map<string, string>();
  for (const pack of model.packs) {
    const path = pathMap.get(pack.pathId);
    const stage = stageMap.get(pack.stageId);
    if (!/^([a-z0-9]+)\.pack\.[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pack.id)) {
      issue(allIssues, "error", "INVALID_PACK_ID", `${pack.id} must use <subject>.pack.<slug>`, pack.id);
    }
    if (!/^\d+\.\d+\.\d+$/.test(pack.version)) issue(allIssues, "error", "INVALID_PACK_VERSION", `${pack.id} version must be semantic x.y.z`, pack.id);
    if (!validAgeRange(pack.ageMin, pack.ageMax)) issue(allIssues, "error", "INVALID_PACK_AGE", `${pack.id} has invalid age range`, pack.id);
    if (!path) issue(allIssues, "error", "UNKNOWN_PACK_PATH", `${pack.id} references unknown path ${pack.pathId}`, pack.id);
    if (!stage) issue(allIssues, "error", "UNKNOWN_PACK_STAGE", `${pack.id} references unknown stage ${pack.stageId}`, pack.id);
    if (path && path.subjectId !== pack.subjectId) issue(allIssues, "error", "PACK_PATH_SUBJECT_MISMATCH", `${pack.id} subject does not match path`, pack.id);
    if (stage && stage.subjectId !== pack.subjectId) issue(allIssues, "error", "PACK_STAGE_SUBJECT_MISMATCH", `${pack.id} subject does not match stage`, pack.id);
    if (path && !path.stageIds.includes(pack.stageId)) issue(allIssues, "error", "PACK_STAGE_OUTSIDE_PATH", `${pack.id} stage is not owned by path`, pack.id);
    if (pack.activities.length === 0) issue(allIssues, "error", "EMPTY_CONTENT_PACK", `${pack.id} must contain activities`, pack.id);
    if (pack.subjectId === "iqro" && pack.reviewStatus === "internal") {
      issue(allIssues, "error", "IQRO_REVIEW_STATE_MISSING", `${pack.id} must explicitly require or record expert review`, pack.id);
    }
    if (pack.reviewStatus === "expert_required") {
      issue(allIssues, "warning", "EXPERT_REVIEW_REQUIRED", `${pack.id} is explicitly marked for expert review`, pack.id);
    }

    const localIds = new Set<string>();
    for (const content of pack.activities) {
      if (!content.localId.trim() || localIds.has(content.localId)) {
        issue(allIssues, "error", "DUPLICATE_PACK_LOCAL_ID", `${pack.id} has duplicate/empty local activity ID ${content.localId}`, pack.id);
      }
      localIds.add(content.localId);
      if (manifestActivityOwner.has(content.activityId)) {
        issue(allIssues, "error", "MULTIPLE_PACK_OWNERS", `${content.activityId} belongs to more than one content pack`, content.activityId);
      }
      manifestActivityOwner.set(content.activityId, pack.id);

      const activity = activityMap.get(content.activityId);
      const lesson = lessonMap.get(content.lessonId);
      const mechanic = model.mechanics[content.mechanicId];
      if (!activity) {
        issue(allIssues, "error", "UNKNOWN_PACK_ACTIVITY", `${pack.id} references unknown activity ${content.activityId}`, content.activityId);
        continue;
      }
      if (!lesson) issue(allIssues, "error", "UNKNOWN_PACK_LESSON", `${content.activityId} references unknown lesson ${content.lessonId}`, content.activityId);
      if (!mechanic) {
        issue(allIssues, "error", "UNKNOWN_MECHANIC", `${content.activityId} references unknown mechanic ${content.mechanicId}`, content.activityId);
        continue;
      }
      if (activity.subjectId !== pack.subjectId || activity.stageId !== pack.stageId) {
        issue(allIssues, "error", "PACK_ACTIVITY_OWNERSHIP_MISMATCH", `${content.activityId} runtime ownership does not match ${pack.id}`, content.activityId);
      }
      if (lesson && (lesson.subjectId !== pack.subjectId || lesson.pathId !== pack.pathId || lesson.stageId !== pack.stageId)) {
        issue(allIssues, "error", "PACK_LESSON_OWNERSHIP_MISMATCH", `${content.activityId} lesson ownership does not match ${pack.id}`, content.activityId);
      }
      if (lesson && !lesson.activityIds.includes(content.activityId)) {
        issue(allIssues, "error", "PACK_ACTIVITY_MISSING_FROM_LESSON", `${content.activityId} is not projected into ${lesson.id}`, content.activityId);
      }
      if (!overlapsAge(activity.ageMin, activity.ageMax, pack.ageMin, pack.ageMax)) {
        issue(allIssues, "error", "PACK_ACTIVITY_AGE_MISMATCH", `${content.activityId} does not overlap pack age range`, content.activityId);
      }
      if (lesson && !overlapsAge(activity.ageMin, activity.ageMax, lesson.ageMin, lesson.ageMax)) {
        issue(allIssues, "error", "LESSON_ACTIVITY_AGE_MISMATCH", `${content.activityId} does not overlap lesson age range`, content.activityId);
      }
      if (![1, 2, 3].includes(content.difficulty)) issue(allIssues, "error", "INVALID_DIFFICULTY", `${content.activityId} difficulty must be 1-3`, content.activityId);
      if (!mechanic.assessmentModes.includes(content.assessment)) {
        issue(allIssues, "error", "ASSESSMENT_MECHANIC_MISMATCH", `${content.activityId} cannot be ${content.assessment} with ${mechanic.id}`, content.activityId);
      }
      const expectedEvidence = content.assessment === "practice" ? "completion_only_v1" : mechanic.assessedEvidenceContract;
      if (!expectedEvidence || content.evidenceContractId !== expectedEvidence) {
        issue(allIssues, "error", "EVIDENCE_CONTRACT_MISMATCH", `${content.activityId} evidence contract does not match mechanic/assessment`, content.activityId);
      }
      if (content.assessment === "assessed" && activity.motionOptional) {
        issue(allIssues, "error", "ASSESSED_MOTION_OPTIONAL", `${content.activityId} assessed evidence must not depend on optional motion`, content.activityId);
      }
      if (content.skills.length === 0) issue(allIssues, "error", "MISSING_SKILL_LINK", `${content.activityId} needs at least one skill link`, content.activityId);
      const linkedSkillIds = new Set<string>();
      for (const link of content.skills) {
        if (linkedSkillIds.has(link.skillId)) issue(allIssues, "error", "DUPLICATE_SKILL_LINK", `${content.activityId} repeats skill ${link.skillId}`, content.activityId);
        linkedSkillIds.add(link.skillId);
        const skill = skillMap.get(link.skillId);
        if (!skill) issue(allIssues, "error", "UNKNOWN_SKILL", `${content.activityId} references unknown skill ${link.skillId}`, content.activityId);
        else {
          if (skill.subjectId !== pack.subjectId) issue(allIssues, "error", "SKILL_SUBJECT_MISMATCH", `${content.activityId} skill ${link.skillId} belongs to another subject`, content.activityId);
          if (!overlapsAge(activity.ageMin, activity.ageMax, skill.ageMin, skill.ageMax)) issue(allIssues, "error", "SKILL_AGE_MISMATCH", `${content.activityId} does not overlap skill age range`, content.activityId);
        }
        if (!Number.isFinite(link.weight) || link.weight <= 0 || link.weight > 3) {
          issue(allIssues, "error", "INVALID_SKILL_WEIGHT", `${content.activityId} skill weight must be > 0 and <= 3`, content.activityId);
        }
      }
      for (const assetRef of content.assetRefs ?? []) {
        if (!assetRef.startsWith("/") || assetRef.includes("..") || /^https?:/i.test(assetRef)) {
          issue(allIssues, "error", "INVALID_ASSET_REF", `${content.activityId} asset ref must be a safe public-root path`, content.activityId);
        }
      }

      validateActivityPayload(activity, mechanic, allIssues);
      if (activity.runtime === "motion_game" && activity.gameSlug && !gameSlugs.has(activity.gameSlug)) {
        issue(allIssues, "error", "UNKNOWN_GAME_SLUG", `${content.activityId} references unknown game ${activity.gameSlug}`, content.activityId);
      }

      const spec = model.learningSpecs[content.activityId];
      if (!spec) issue(allIssues, "error", "MISSING_LEARNING_SPEC", `${content.activityId} has no learning spec projection`, content.activityId);
      else {
        if (spec.subjectId !== pack.subjectId || spec.stageId !== pack.stageId || spec.difficulty !== content.difficulty || spec.assessment !== content.assessment || spec.requiredForStage !== content.requiredForStage) {
          issue(allIssues, "error", "LEARNING_SPEC_DRIFT", `${content.activityId} learning spec drifted from content manifest`, content.activityId);
        }
        const specLinks = JSON.stringify([...spec.skills].sort((a, b) => a.skillId.localeCompare(b.skillId)));
        const contentLinks = JSON.stringify([...content.skills].sort((a, b) => a.skillId.localeCompare(b.skillId)));
        if (specLinks !== contentLinks) issue(allIssues, "error", "LEARNING_SPEC_SKILL_DRIFT", `${content.activityId} skill links drifted from content manifest`, content.activityId);
      }
    }
  }

  for (const activity of model.activities) {
    if (!manifestActivityOwner.has(activity.id)) issue(allIssues, "error", "UNPACKED_ACTIVITY", `${activity.id} is not owned by a content pack`, activity.id);
    if (!activityLessonOwner.has(activity.id)) issue(allIssues, "error", "UNLESSONED_ACTIVITY", `${activity.id} is not owned by a lesson`, activity.id);
    const stage = stageMap.get(activity.stageId);
    if (!stage) issue(allIssues, "error", "UNKNOWN_ACTIVITY_STAGE", `${activity.id} references unknown stage`, activity.id);
    else if (!stage.activityIds.includes(activity.id)) issue(allIssues, "error", "ACTIVITY_MISSING_FROM_STAGE", `${activity.id} is missing from ${stage.id}`, activity.id);
  }
  for (const activityId of manifestActivityOwner.keys()) {
    if (!activityMap.has(activityId)) issue(allIssues, "error", "MANIFEST_ONLY_ACTIVITY", `${activityId} exists only in content manifest`, activityId);
  }
  for (const specId of Object.keys(model.learningSpecs)) {
    if (!manifestActivityOwner.has(specId)) issue(allIssues, "error", "ORPHAN_LEARNING_SPEC", `${specId} learning spec has no content-pack owner`, specId);
  }

  const fingerprints = new Map<string, string>();
  for (const activity of model.activities) {
    const fingerprint = getActivityContentFingerprint(activity);
    const previous = fingerprints.get(fingerprint);
    if (previous && previous !== activity.id) {
      issue(allIssues, "error", "DUPLICATE_CONTENT", `${activity.id} duplicates playable content from ${previous}; reordering alone is not a new activity`, activity.id);
    } else fingerprints.set(fingerprint, activity.id);
  }

  for (const item of allIssues) (item.severity === "error" ? errors : warnings).push(item);
  const specs = Object.values(model.learningSpecs);
  return {
    errors,
    warnings,
    stats: {
      subjects: model.subjects.length,
      paths: model.paths.length,
      stages: model.stages.length,
      lessons: model.lessons.length,
      packs: model.packs.length,
      activities: model.activities.length,
      skills: model.skills.length,
      mechanics: Object.keys(model.mechanics).length,
      assessedActivities: specs.filter((spec) => spec.assessment === "assessed").length,
      practiceActivities: specs.filter((spec) => spec.assessment === "practice").length
    }
  };
}

export function assertContentArchitectureValid(model: ContentArchitectureModel = DEFAULT_CONTENT_ARCHITECTURE_MODEL): ContentValidationReport {
  const report = validateContentArchitecture(model);
  if (report.errors.length > 0) {
    const summary = report.errors.map((item) => `${item.code}${item.entityId ? `(${item.entityId})` : ""}: ${item.message}`).join("\n");
    throw new Error(`Invalid Mainlagi content architecture:\n${summary}`);
  }
  return report;
}

export function getContentActivityMetadata(activityId: string) {
  return getContentForActivity(activityId);
}
