import type { LearningActivity } from "./system";

export type MatchingPresentation = "grid_pairs" | "memory_pairs" | "drag_targets";
export type ChoiceGameplayPresentation = "default" | "sequence_slot" | "sorting_buckets" | "count_select" | "number_line" | "more_less_balance" | "pattern_completion" | "cause_effect" | "compare_properties";
export type GameplayPattern =
  | "choice_grid"
  | "symbol_hunt"
  | "listen_choose"
  | "visible_matching"
  | "memory_pair"
  | "drag_to_target"
  | "missing_sequence_slot"
  | "sorting_buckets"
  | "count_and_select"
  | "number_line"
  | "more_less_balance"
  | "pattern_completion"
  | "cause_effect"
  | "compare_properties"
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

const SCIENCE_CAUSE_EFFECT_IDS = new Set([
  "science-water-ice-melts",
  "science-water-freezes",
  "science-water-puddle-evaporates",
  "science-water-cold-glass-droplets"
]);

const SCIENCE_COMPARE_PROPERTIES_IDS = new Set([
  "science-measure-longer-pencil",
  "science-measure-hot-cold",
  "science-measure-more-water"
]);

const MATH_COUNT_SELECT_IDS = new Set([
  "math-count-2",
  "math-count-3",
  "math-count-4",
  "math-count-5",
  "math-count-6",
  "math-count-7",
  "math-count-8",
  "math-count-9",
  "math-count-10"
]);

const MATH_NUMBER_LINE_IDS = new Set([
  "math-order-next-1-2",
  "math-order-next-3-4",
  "math-order-before-6",
  "math-order-between-6-8",
  "math-order-descend-5",
  "math-order-descend-10"
]);

const MATH_MORE_LESS_BALANCE_IDS = new Set([
  "math-compare-more-2-4",
  "math-compare-less-5-3",
  "math-compare-equal-4-4",
  "math-compare-more-6-5",
  "math-compare-less-7-9",
  "math-compare-more-10-8"
]);

const MATH_PATTERN_COMPLETION_IDS = new Set([
  "math-pattern-ab-shapes",
  "math-pattern-aab-colors",
  "math-pattern-number-step-one",
  "math-pattern-number-step-two",
  "math-pattern-size"
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
 * three-button quiz.
 *
 * Basic Logic classification tasks ask whether each visible object satisfies
 * one simple rule, so the reviewed starter family uses two-bucket sorting.
 *
 * Reviewed Math count tasks ask the child to inspect a visible set and choose
 * its quantity. Keep the canonical tap_choice payload/evidence contract while
 * presenting the prompt objects as the primary counting surface.
 *
 * Reviewed Math ordering tasks measure relative number position, so expose the
 * canonical three numeric choices directly on a local number line.
 *
 * Reviewed Math comparison tasks measure left/right/equal quantity relations,
 * so present the same canonical choices as two balance pans plus an equal
 * control instead of another generic answer grid.
 *
 * Reviewed Math pattern tasks measure recognition of a repeating or stepping
 * rule. Present the observed run as a pattern strip with one explicit next
 * slot while keeping the canonical three choices and evidence identity.
 *
 * Reviewed Science water-change tasks connect an observable condition with a
 * resulting state change, so present them as an explicit cause/effect flow.
 *
 * Reviewed Science measurement tasks compare two observable properties, so
 * present their qualitative relation directly without inventing numeric data.
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

  const isReviewedMathCountFamily =
    activity.subjectId === "math" &&
    MATH_COUNT_SELECT_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.every((choice) => /^\d+$/.test(choice)) &&
    /^\d+$/.test(correct) &&
    choices.includes(correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathCountFamily) return "count_select";

  const isReviewedMathNumberLineFamily =
    activity.subjectId === "math" &&
    activity.stageId === "math-banding-bentuk" &&
    MATH_NUMBER_LINE_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.every((choice) => /^\d+$/.test(choice)) &&
    /^\d+$/.test(correct) &&
    choices.includes(correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathNumberLineFamily) return "number_line";

  const isReviewedMathComparisonFamily =
    activity.subjectId === "math" &&
    activity.stageId === "math-banding-bentuk" &&
    MATH_MORE_LESS_BALANCE_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.includes(correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathComparisonFamily) return "more_less_balance";

  const isReviewedMathPatternFamily =
    activity.subjectId === "math" &&
    activity.stageId === "math-banding-bentuk" &&
    MATH_PATTERN_COMPLETION_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.includes(correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathPatternFamily) return "pattern_completion";

  const isReviewedScienceCauseEffectFamily =
    activity.subjectId === "science" &&
    activity.stageId === "science-life-material-motion" &&
    SCIENCE_CAUSE_EFFECT_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.includes(correct) &&
    Boolean(activity.prompt);
  if (isReviewedScienceCauseEffectFamily) return "cause_effect";

  const isReviewedScienceComparePropertiesFamily =
    activity.subjectId === "science" &&
    activity.stageId === "science-earth-body-environment" &&
    SCIENCE_COMPARE_PROPERTIES_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.includes(correct) &&
    Boolean(activity.prompt);
  if (isReviewedScienceComparePropertiesFamily) return "compare_properties";

  return "default";
}

export function isSequenceSlotActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "sequence_slot";
}

export function isSortingBucketsActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "sorting_buckets";
}

export function isCountAndSelectActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "count_select";
}

export function isNumberLineActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "number_line";
}

export function isMoreLessBalanceActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "more_less_balance";
}

export function isPatternCompletionActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "pattern_completion";
}

export function isCauseEffectActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "cause_effect";
}

export function isComparePropertiesActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "compare_properties";
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
    if (presentation === "count_select") return "count_and_select";
    if (presentation === "number_line") return "number_line";
    if (presentation === "more_less_balance") return "more_less_balance";
    if (presentation === "pattern_completion") return "pattern_completion";
    if (presentation === "cause_effect") return "cause_effect";
    if (presentation === "compare_properties") return "compare_properties";
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
