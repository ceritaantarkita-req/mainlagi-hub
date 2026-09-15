import type { LearningActivity } from "./system";

export type MatchingPresentation = "grid_pairs" | "memory_pairs" | "drag_targets";
export type ChoiceGameplayPresentation = "default" | "sequence_slot" | "sorting_buckets" | "count_select" | "number_line" | "more_less_balance" | "pattern_completion" | "cause_effect" | "compare_properties" | "healthy_habit_routine" | "material_lab" | "feature_function_link";
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
  | "healthy_habit_routine"
  | "material_lab"
  | "feature_function_link"
  | "guided_trace"
  | "story_read"
  | "motion_game"
  | "coloring_canvas"
  | "drawing_canvas";

const SCIENCE_DRAG_TARGET_IDS = new Set(["science-match-living-nonliving","science-match-plant-parts","science-match-animal-homes-a","science-match-senses-a","science-match-weather-signs-a"]);
const SCIENCE_CAUSE_EFFECT_IDS = new Set(["science-water-ice-melts","science-water-freezes","science-water-puddle-evaporates","science-water-cold-glass-droplets"]);
const SCIENCE_COMPARE_PROPERTIES_IDS = new Set(["science-measure-longer-pencil","science-measure-hot-cold","science-measure-more-water"]);
const SCIENCE_HEALTHY_HABIT_ROUTINE_IDS = new Set(["science-body-wash-hands","science-body-teeth-brush","science-body-water-drink","science-body-sleep-rest"]);
const SCIENCE_MATERIAL_LAB_IDS = new Set(["science-material-raincoat-waterproof","science-material-window-transparent","science-material-towel-absorbent","science-material-toy-block-rigid"]);
const SCIENCE_FEATURE_FUNCTION_LINK_IDS = new Set(["science-feature-duck-webbed-feet","science-feature-fish-gills","science-feature-bird-beak-seeds","science-feature-cactus-water"]);
const MATH_COUNT_SELECT_IDS = new Set(["math-count-2","math-count-3","math-count-4","math-count-5","math-count-6","math-count-7","math-count-8","math-count-9","math-count-10"]);
const MATH_NUMBER_LINE_IDS = new Set(["math-order-next-1-2","math-order-next-3-4","math-order-before-6","math-order-between-6-8","math-order-descend-5","math-order-descend-10"]);
const MATH_MORE_LESS_BALANCE_IDS = new Set(["math-compare-more-2-4","math-compare-less-5-3","math-compare-equal-4-4","math-compare-more-6-5","math-compare-less-7-9","math-compare-more-10-8"]);
const MATH_PATTERN_COMPLETION_IDS = new Set(["math-pattern-ab-shapes","math-pattern-aab-colors","math-pattern-number-step-one","math-pattern-number-step-two","math-pattern-size"]);

export function matchingPresentation(activity: LearningActivity | undefined): MatchingPresentation {
  if (!activity || activity.runtime !== "matching") return "grid_pairs";
  const items = activity.matchItems ?? [];
  const isLatinCaseFamily = activity.subjectId === "letters" && activity.id.startsWith("letters-match-case-") && items.length >= 4 && items.every((item) => /^[A-Za-z]$/.test(item.label));
  if (isLatinCaseFamily) return "memory_pairs";
  const isReviewedScienceDragFamily = activity.subjectId === "science" && activity.stageId === "science-living-observation-basics" && SCIENCE_DRAG_TARGET_IDS.has(activity.id) && items.length === 6 && new Set(items.map((item) => item.pair)).size === 3 && items.every((item) => Boolean(item.label) && Boolean(item.pair));
  if (isReviewedScienceDragFamily) return "drag_targets";
  return "grid_pairs";
}

export function isMemoryPairActivity(activity: LearningActivity | undefined): boolean { return matchingPresentation(activity) === "memory_pairs"; }
export function isDragTargetActivity(activity: LearningActivity | undefined): boolean { return matchingPresentation(activity) === "drag_targets"; }

export function choiceGameplayPresentation(activity: LearningActivity | undefined): ChoiceGameplayPresentation {
  if (!activity || activity.runtime !== "tap_choice") return "default";
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  const valid = choices.length === 3 && new Set(choices).size === choices.length && choices.includes(correct) && Boolean(activity.prompt);

  const isLetterSequenceFamily = activity.subjectId === "letters" && activity.id.startsWith("letters-order-") && choices.length === 3 && choices.every((choice) => /^[A-Z]$/.test(choice)) && /^[A-Z]$/.test(correct) && choices.includes(correct);
  if (isLetterSequenceFamily) return "sequence_slot";
  const isBasicLogicClassificationFamily = activity.subjectId === "logic" && activity.stageId === "logic-classification-rules-basics" && activity.id.startsWith("logic-classify-") && choices.length === 3 && new Set(choices).size === choices.length && choices.includes(correct);
  if (isBasicLogicClassificationFamily) return "sorting_buckets";
  if (activity.subjectId === "math" && MATH_COUNT_SELECT_IDS.has(activity.id) && valid && choices.every((choice) => /^\d+$/.test(choice)) && /^\d+$/.test(correct)) return "count_select";
  if (activity.subjectId === "math" && activity.stageId === "math-banding-bentuk" && MATH_NUMBER_LINE_IDS.has(activity.id) && valid && choices.every((choice) => /^\d+$/.test(choice)) && /^\d+$/.test(correct)) return "number_line";
  if (activity.subjectId === "math" && activity.stageId === "math-banding-bentuk" && MATH_MORE_LESS_BALANCE_IDS.has(activity.id) && valid) return "more_less_balance";
  if (activity.subjectId === "math" && activity.stageId === "math-banding-bentuk" && MATH_PATTERN_COMPLETION_IDS.has(activity.id) && valid) return "pattern_completion";
  if (activity.subjectId === "science" && activity.stageId === "science-life-material-motion" && SCIENCE_CAUSE_EFFECT_IDS.has(activity.id) && valid) return "cause_effect";
  if (activity.subjectId === "science" && activity.stageId === "science-earth-body-environment" && SCIENCE_COMPARE_PROPERTIES_IDS.has(activity.id) && valid) return "compare_properties";
  if (activity.subjectId === "science" && activity.stageId === "science-earth-body-environment" && SCIENCE_HEALTHY_HABIT_ROUTINE_IDS.has(activity.id) && valid) return "healthy_habit_routine";
  if (activity.subjectId === "science" && activity.stageId === "science-evidence-review-challenge" && SCIENCE_MATERIAL_LAB_IDS.has(activity.id) && valid) return "material_lab";
  if (activity.subjectId === "science" && activity.stageId === "science-evidence-review-challenge" && SCIENCE_FEATURE_FUNCTION_LINK_IDS.has(activity.id) && valid) return "feature_function_link";
  return "default";
}

export function isSequenceSlotActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "sequence_slot"; }
export function isSortingBucketsActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "sorting_buckets"; }
export function isCountAndSelectActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "count_select"; }
export function isNumberLineActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "number_line"; }
export function isMoreLessBalanceActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "more_less_balance"; }
export function isPatternCompletionActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "pattern_completion"; }
export function isCauseEffectActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "cause_effect"; }
export function isComparePropertiesActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "compare_properties"; }
export function isHealthyHabitRoutineActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "healthy_habit_routine"; }
export function isMaterialLabActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "material_lab"; }
export function isFeatureFunctionLinkActivity(activity: LearningActivity | undefined): boolean { return choiceGameplayPresentation(activity) === "feature_function_link"; }

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
    if (presentation === "healthy_habit_routine") return "healthy_habit_routine";
    if (presentation === "material_lab") return "material_lab";
    if (presentation === "feature_function_link") return "feature_function_link";
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
