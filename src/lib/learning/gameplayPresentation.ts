import type { LearningActivity } from "./system";

export type MatchingPresentation = "grid_pairs" | "memory_pairs" | "drag_targets";
export type ChoiceGameplayPresentation = "default" | "sequence_slot" | "sorting_buckets";

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
