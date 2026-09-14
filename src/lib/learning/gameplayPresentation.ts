import type { LearningActivity } from "./system";

export type MatchingPresentation = "grid_pairs" | "memory_pairs" | "drag_targets";
export type ChoiceGameplayPresentation = "default" | "sequence_slot" | "sorting_buckets";
export type GameplayPattern =
  | "choice_grid"
  | "symbol_hunt"
  | "listen_choose"
  | "visible_matching"
  | "memory_pair"
  | "drag_to_target"
  | "missing_sequence_slot"
  | "sorting_buckets"
  | "guided_trace"
  | "story_read"
  | "motion_game"
  | "coloring_canvas"
  | "drawing_canvas";

const SCIENCE_DRAG_TARGET_IDS = new Set([
  "science-match-living-nonliving",
  "science-match-plant-parts",
  "science-match-animal-homes-a",
  "science-match-senses-a",
  "science-match-weather-signs-a"
]);

/**
 * Presentation classifiers diversify coherent activity families without
 * changing their canonical runtime, activity identity, payload, assessment or
 * progression contract.
 */
export function matchingPresentation(activity: LearningActivity | undefined): MatchingPresentation {
  if (!activity || activity.runtime !== "matching") return "grid_pairs";
  const items = activity.matchItems ?? [];

  const isLatinCaseFamily =
    activity.subjectId === "letters" &&
    activity.id.startsWith("letters-match-case-") &&
    items.length >= 4 &&
    items.every((item) => /^[A-Za-z]$/.test(item.label));
  if (isLatinCaseFamily) return "memory_pairs";

  const isReviewedScienceDragFamily =
    activity.subjectId === "science" &&
    activity.stageId === "science-living-observation-basics" &&
    SCIENCE_DRAG_TARGET_IDS.has(activity.id) &&
    items.length === 6 &&
    new Set(items.map((item) => item.pair)).size === 3 &&
    items.every((item) => Boolean(item.label) && Boolean(item.pair));
  if (isReviewedScienceDragFamily) return "drag_targets";

  return "grid_pairs";
}

export function isMemoryPairActivity(activity: LearningActivity | undefined): boolean {
  return matchingPresentation(activity) === "memory_pairs";
}

export function isDragTargetActivity(activity: LearningActivity | undefined): boolean {
  return matchingPresentation(activity) === "drag_targets";
}

/**
 * Alphabet before/between/after tasks measure sequence position, so present
 * them as a visible sequence with one empty slot rather than another generic
 * three-button quiz. Canonical tap_choice values and evidence stay unchanged.
 *
 * Basic Logic classification tasks ask whether each visible object satisfies
 * one simple rule. Present only that reviewed stage as two-bucket sorting: the
 * canonical correctChoice belongs in the matching bucket and the other choices
 * belong in the non-matching bucket. Later multi-attribute classification
 * stages remain on their existing presentation until reviewed separately.
 */
export function choiceGameplayPresentation(activity: LearningActivity | undefined): ChoiceGameplayPresentation {
  if (!activity || activity.runtime !== "tap_choice") return "default";
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";

  const isLetterSequenceFamily =
    activity.subjectId === "letters" &&
    activity.id.startsWith("letters-order-") &&
    choices.length === 3 &&
    choices.every((choice) => /^[A-Z]$/.test(choice)) &&
    /^[A-Z]$/.test(correct) &&
    choices.includes(correct);
  if (isLetterSequenceFamily) return "sequence_slot";

  const isBasicLogicClassificationFamily =
    activity.subjectId === "logic" &&
    activity.stageId === "logic-classification-rules-basics" &&
    activity.id.startsWith("logic-classify-") &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.includes(correct);
  if (isBasicLogicClassificationFamily) return "sorting_buckets";

  return "default";
}

export function isSequenceSlotActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "sequence_slot";
}

export function isSortingBucketsActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "sorting_buckets";
}

/**
 * Canonical child-facing gameplay-pattern classifier used by the WS-05
 * distribution audit. Every playable learning activity must map to exactly one
 * pattern even when several patterns share the same underlying runtime.
 */
export function gameplayPattern(activity: LearningActivity | undefined): GameplayPattern | null {
  if (!activity) return null;

  if (activity.runtime === "tap_choice") {
    if (activity.choicePresentation === "symbol_hunt") return "symbol_hunt";
    const presentation = choiceGameplayPresentation(activity);
    if (presentation === "sequence_slot") return "missing_sequence_slot";
    if (presentation === "sorting_buckets") return "sorting_buckets";
    return "choice_grid";
  }

  if (activity.runtime === "listen_and_choose") return "listen_choose";

  if (activity.runtime === "matching") {
    const presentation = matchingPresentation(activity);
    if (presentation === "memory_pairs") return "memory_pair";
    if (presentation === "drag_targets") return "drag_to_target";
    return "visible_matching";
  }

  if (activity.runtime === "trace") return "guided_trace";
  if (activity.runtime === "story") return "story_read";
  if (activity.runtime === "motion_game") return "motion_game";
  if (activity.runtime === "coloring") return "coloring_canvas";
  if (activity.runtime === "drawing") return "drawing_canvas";

  return null;
}
