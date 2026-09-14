import type { LearningActivity } from "./system";

export type MatchingPresentation = "grid_pairs" | "memory_pairs";
export type ChoiceGameplayPresentation = "default" | "sequence_slot";

/**
 * Case matching is already a pair-memory objective: the child must connect the
 * same Latin letter across upper/lower forms. Route this coherent family to a
 * memory-flip presentation instead of repeating the default all-cards-visible
 * matching board. The canonical runtime, matchItems, pair ids, assessment and
 * completion contract remain unchanged.
 */
export function matchingPresentation(activity: LearningActivity | undefined): MatchingPresentation {
  if (!activity || activity.runtime !== "matching") return "grid_pairs";
  const items = activity.matchItems ?? [];
  const isLatinCaseFamily =
    activity.subjectId === "letters" &&
    activity.id.startsWith("letters-match-case-") &&
    items.length >= 4 &&
    items.every((item) => /^[A-Za-z]$/.test(item.label));

  return isLatinCaseFamily ? "memory_pairs" : "grid_pairs";
}

export function isMemoryPairActivity(activity: LearningActivity | undefined): boolean {
  return matchingPresentation(activity) === "memory_pairs";
}

/**
 * Alphabet before/between/after tasks measure sequence position, so present
 * them as a visible sequence with one empty slot rather than another generic
 * three-button quiz. Canonical tap_choice values and evidence stay unchanged.
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

  return isLetterSequenceFamily ? "sequence_slot" : "default";
}

export function isSequenceSlotActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "sequence_slot";
}
