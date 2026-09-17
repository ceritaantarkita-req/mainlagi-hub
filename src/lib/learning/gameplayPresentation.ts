import type { LearningActivity } from "./system";
import { isClozeSentenceChoiceCandidate } from "./clozeSentenceChoiceConfig";
import { isReadingPassageQuestionActivity } from "./readingPassageQuestionConfig";
import { isSentenceOrderCardsActivity } from "./sentenceOrderCardsConfig";

export type MatchingPresentation = "grid_pairs" | "memory_pairs" | "drag_targets";
export type ChoiceGameplayPresentation =
  | "default"
  | "sequence_slot"
  | "syllable_assembly"
  | "initial_sound"
  | "cloze_sentence_choice"
  | "sorting_buckets"
  | "odd_one_out"
  | "rule_pipeline"
  | "set_reasoning"
  | "transitive_chain"
  | "spatial_transform"
  | "relative_order_track"
  | "count_select"
  | "number_line"
  | "more_less_balance"
  | "pattern_completion"
  | "make_total"
  | "take_away"
  | "cause_effect"
  | "compare_properties"
  | "healthy_habit_routine"
  | "material_lab"
  | "feature_function_link"
  | "investigation_board";

export type GameplayPattern =
  | "choice_grid"
  | "symbol_hunt"
  | "listen_choose"
  | "visible_matching"
  | "memory_pair"
  | "drag_to_target"
  | "missing_sequence_slot"
  | "syllable_assembly"
  | "initial_sound"
  | "cloze_sentence_choice"
  | "picture_word_match"
  | "sentence_order_cards"
  | "reading_passage_question"
  | "sorting_buckets"
  | "odd_one_out"
  | "rule_pipeline"
  | "set_reasoning"
  | "transitive_chain"
  | "spatial_transform"
  | "relative_order_track"
  | "count_and_select"
  | "number_line"
  | "more_less_balance"
  | "pattern_completion"
  | "make_total"
  | "take_away"
  | "equal_groups"
  | "cause_effect"
  | "compare_properties"
  | "healthy_habit_routine"
  | "material_lab"
  | "feature_function_link"
  | "investigation_board"
  | "guided_trace"
  | "story_read"
  | "motion_game"
  | "coloring_canvas"
  | "drawing_canvas";

const BAHASA_SYLLABLE_ASSEMBLY_IDS = new Set([
  "bahasa-gabung-baju",
  "bahasa-gabung-buku",
  "bahasa-gabung-meja",
  "bahasa-gabung-bola",
  "bahasa-gabung-susu"
]);

const BAHASA_INITIAL_SOUND_IDS = new Set([
  "bahasa-awal-bola",
  "bahasa-awal-kucing",
  "bahasa-awal-pisang"
]);

const BAHASA_PICTURE_WORD_MATCH_IDS = new Set([
  "bahasa-gambar-apel",
  "bahasa-gambar-mobil",
  "bahasa-gambar-kucing",
  "bahasa-gambar-rumah",
  "bahasa-gambar-pisang"
]);

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

const SCIENCE_HEALTHY_HABIT_ROUTINE_IDS = new Set([
  "science-body-wash-hands",
  "science-body-teeth-brush",
  "science-body-water-drink",
  "science-body-sleep-rest"
]);

const SCIENCE_MATERIAL_LAB_IDS = new Set([
  "science-material-raincoat-waterproof",
  "science-material-window-transparent",
  "science-material-towel-absorbent",
  "science-material-toy-block-rigid"
]);

const SCIENCE_FEATURE_FUNCTION_LINK_IDS = new Set([
  "science-feature-duck-webbed-feet",
  "science-feature-fish-gills",
  "science-feature-bird-beak-seeds",
  "science-feature-cactus-water"
]);

const SCIENCE_INVESTIGATION_BOARD_IDS = new Set([
  "science-investigate-plant-light",
  "science-investigate-fair-water",
  "science-predict-ice-warm-place",
  "science-evidence-shadow-times"
]);

const LOGIC_ODD_ONE_OUT_IDS = new Set([
  "logic-odd-category-animal-vehicle",
  "logic-odd-shape-angular",
  "logic-odd-direction-right",
  "logic-odd-count-three",
  "logic-odd-pattern-symmetry"
]);

const LOGIC_RULE_PIPELINE_IDS = new Set([
  "logic-compose-red-circle-to-star",
  "logic-compose-small-left-then-up",
  "logic-compose-two-to-blue",
  "logic-compose-triangle-turn-right",
  "logic-compose-swap-then-grow"
]);

const LOGIC_SET_REASONING_IDS = new Set([
  "logic-set-both-red-round",
  "logic-set-animal-not-bird",
  "logic-set-shape-not-square",
  "logic-set-only-blue-triangle",
  "logic-set-outside-round-red"
]);

const LOGIC_TRANSITIVE_CHAIN_IDS = new Set([
  "logic-transitive-height-abc",
  "logic-transitive-shortest-xyz",
  "logic-transitive-most-dots",
  "logic-transitive-lightest",
  "logic-transitive-middle-order"
]);

const LOGIC_SPATIAL_TRANSFORM_IDS = new Set([
  "logic-spatial-halfturn-up",
  "logic-spatial-quarterturn-left",
  "logic-spatial-quarterturn-right-down",
  "logic-spatial-two-right-turns",
  "logic-spatial-mirror-left-right"
]);

const LOGIC_RELATIVE_ORDER_TRACK_IDS = new Set([
  "logic-order-first-after-start",
  "logic-order-before-d",
  "logic-order-between-blue-green",
  "logic-order-third-symbol",
  "logic-order-two-steps-after"
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

const MATH_MAKE_TOTAL_IDS = new Set([
  "math-add-1-1",
  "math-add-2-1",
  "math-add-2-2",
  "math-add-3-2",
  "math-add-4-3"
]);

const MATH_TAKE_AWAY_IDS = new Set([
  "math-sub-3-1",
  "math-sub-4-2",
  "math-sub-5-1",
  "math-sub-6-2",
  "math-sub-7-3"
]);

const MATH_EQUAL_GROUPS_IDS = new Set([
  "math-group-6-by-2",
  "math-group-8-by-2",
  "math-group-9-by-3"
]);

function hasThreeUniqueChoices(activity: LearningActivity, correct: string): boolean {
  const choices = activity.choices ?? [];
  return choices.length === 3 && new Set(choices).size === choices.length && choices.includes(correct);
}

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

  const isReviewedBahasaSyllableAssemblyFamily =
    activity.subjectId === "bahasa" &&
    activity.stageId === "bahasa-suku-kata-kata" &&
    BAHASA_SYLLABLE_ASSEMBLY_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    choices.every((choice) => /^[a-z]+$/.test(choice)) &&
    /^[a-z]+$/.test(correct) &&
    Boolean(activity.prompt);
  if (isReviewedBahasaSyllableAssemblyFamily) return "syllable_assembly";

  const isReviewedBahasaInitialSoundFamily =
    activity.subjectId === "bahasa" &&
    activity.stageId === "bahasa-dasar-huruf" &&
    BAHASA_INITIAL_SOUND_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    choices.every((choice) => /^[A-Z]$/.test(choice)) &&
    /^[A-Z]$/.test(correct) &&
    Boolean(activity.prompt);
  if (isReviewedBahasaInitialSoundFamily) return "initial_sound";

  if (isClozeSentenceChoiceCandidate(activity)) return "cloze_sentence_choice";

  const isBasicLogicClassificationFamily =
    activity.subjectId === "logic" &&
    activity.stageId === "logic-classification-rules-basics" &&
    activity.id.startsWith("logic-classify-") &&
    hasThreeUniqueChoices(activity, correct);
  if (isBasicLogicClassificationFamily) return "sorting_buckets";

  const isReviewedLogicOddOneOutFamily =
    activity.subjectId === "logic" &&
    activity.stageId === "logic-classification-rules-basics" &&
    LOGIC_ODD_ONE_OUT_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedLogicOddOneOutFamily) return "odd_one_out";

  const isReviewedLogicRulePipelineFamily =
    activity.subjectId === "logic" &&
    activity.stageId === "logic-mixed-reasoning-challenge" &&
    LOGIC_RULE_PIPELINE_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedLogicRulePipelineFamily) return "rule_pipeline";

  const isReviewedLogicSetReasoningFamily =
    activity.subjectId === "logic" &&
    activity.stageId === "logic-mixed-reasoning-challenge" &&
    LOGIC_SET_REASONING_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedLogicSetReasoningFamily) return "set_reasoning";

  const isReviewedLogicTransitiveChainFamily =
    activity.subjectId === "logic" &&
    activity.stageId === "logic-mixed-reasoning-challenge" &&
    LOGIC_TRANSITIVE_CHAIN_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedLogicTransitiveChainFamily) return "transitive_chain";

  const isReviewedLogicSpatialTransformFamily =
    activity.subjectId === "logic" &&
    activity.stageId === "logic-mixed-reasoning-challenge" &&
    LOGIC_SPATIAL_TRANSFORM_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedLogicSpatialTransformFamily) return "spatial_transform";

  const isReviewedLogicRelativeOrderTrackFamily =
    activity.subjectId === "logic" &&
    activity.stageId === "logic-conditional-analogy-inference" &&
    LOGIC_RELATIVE_ORDER_TRACK_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedLogicRelativeOrderTrackFamily) return "relative_order_track";

  const isReviewedMathCountFamily =
    activity.subjectId === "math" &&
    MATH_COUNT_SELECT_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    choices.every((choice) => /^\d+$/.test(choice)) &&
    /^\d+$/.test(correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathCountFamily) return "count_select";

  const isReviewedMathNumberLineFamily =
    activity.subjectId === "math" &&
    activity.stageId === "math-banding-bentuk" &&
    MATH_NUMBER_LINE_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    choices.every((choice) => /^\d+$/.test(choice)) &&
    /^\d+$/.test(correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathNumberLineFamily) return "number_line";

  const isReviewedMathComparisonFamily =
    activity.subjectId === "math" &&
    activity.stageId === "math-banding-bentuk" &&
    MATH_MORE_LESS_BALANCE_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathComparisonFamily) return "more_less_balance";

  const isReviewedMathPatternFamily =
    activity.subjectId === "math" &&
    activity.stageId === "math-banding-bentuk" &&
    MATH_PATTERN_COMPLETION_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathPatternFamily) return "pattern_completion";

  const isReviewedMathMakeTotalFamily =
    activity.subjectId === "math" &&
    activity.stageId === "math-operasi-awal" &&
    MATH_MAKE_TOTAL_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    choices.every((choice) => /^\d+$/.test(choice)) &&
    /^\d+$/.test(correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathMakeTotalFamily) return "make_total";

  const isReviewedMathTakeAwayFamily =
    activity.subjectId === "math" &&
    activity.stageId === "math-operasi-awal" &&
    MATH_TAKE_AWAY_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    choices.every((choice) => /^\d+$/.test(choice)) &&
    /^\d+$/.test(correct) &&
    Boolean(activity.prompt);
  if (isReviewedMathTakeAwayFamily) return "take_away";

  const isReviewedScienceCauseEffectFamily =
    activity.subjectId === "science" &&
    activity.stageId === "science-life-material-motion" &&
    SCIENCE_CAUSE_EFFECT_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedScienceCauseEffectFamily) return "cause_effect";

  const isReviewedScienceComparePropertiesFamily =
    activity.subjectId === "science" &&
    activity.stageId === "science-earth-body-environment" &&
    SCIENCE_COMPARE_PROPERTIES_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedScienceComparePropertiesFamily) return "compare_properties";

  const isReviewedScienceHealthyHabitFamily =
    activity.subjectId === "science" &&
    activity.stageId === "science-earth-body-environment" &&
    SCIENCE_HEALTHY_HABIT_ROUTINE_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedScienceHealthyHabitFamily) return "healthy_habit_routine";

  const isReviewedScienceMaterialLabFamily =
    activity.subjectId === "science" &&
    activity.stageId === "science-evidence-review-challenge" &&
    SCIENCE_MATERIAL_LAB_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedScienceMaterialLabFamily) return "material_lab";

  const isReviewedScienceFeatureFunctionLinkFamily =
    activity.subjectId === "science" &&
    activity.stageId === "science-evidence-review-challenge" &&
    SCIENCE_FEATURE_FUNCTION_LINK_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedScienceFeatureFunctionLinkFamily) return "feature_function_link";

  const isReviewedScienceInvestigationBoardFamily =
    activity.subjectId === "science" &&
    activity.stageId === "science-evidence-review-challenge" &&
    SCIENCE_INVESTIGATION_BOARD_IDS.has(activity.id) &&
    hasThreeUniqueChoices(activity, correct) &&
    Boolean(activity.prompt);
  if (isReviewedScienceInvestigationBoardFamily) return "investigation_board";

  return "default";
}

export function isSequenceSlotActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "sequence_slot";
}

export function isSyllableAssemblyActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "syllable_assembly";
}

export function isInitialSoundActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "initial_sound";
}

export function isClozeSentenceChoiceActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "cloze_sentence_choice";
}

export function isPictureWordMatchActivity(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice") return false;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  return (
    activity.subjectId === "bahasa" &&
    activity.stageId === "bahasa-suku-kata-kata" &&
    BAHASA_PICTURE_WORD_MATCH_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.every((choice) => /^[a-z]+$/.test(choice)) &&
    /^[a-z]+$/.test(correct) &&
    choices.includes(correct) &&
    Boolean(activity.prompt)
  );
}

export function isSortingBucketsActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "sorting_buckets";
}

export function isOddOneOutActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "odd_one_out";
}

export function isRulePipelineActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "rule_pipeline";
}

export function isSetReasoningActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "set_reasoning";
}

export function isTransitiveChainActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "transitive_chain";
}

export function isSpatialTransformActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "spatial_transform";
}

export function isRelativeOrderTrackActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "relative_order_track";
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

export function isMakeTotalActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "make_total";
}

export function isTakeAwayActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "take_away";
}

export function isEqualGroupsActivity(activity: LearningActivity | undefined): boolean {
  if (!activity || activity.runtime !== "tap_choice") return false;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  return (
    activity.subjectId === "math" &&
    activity.stageId === "math-operasi-awal" &&
    MATH_EQUAL_GROUPS_IDS.has(activity.id) &&
    choices.length === 3 &&
    new Set(choices).size === choices.length &&
    choices.every((choice) => /^\d+$/.test(choice)) &&
    /^\d+$/.test(correct) &&
    choices.includes(correct) &&
    Boolean(activity.prompt)
  );
}

export function isCauseEffectActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "cause_effect";
}

export function isComparePropertiesActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "compare_properties";
}

export function isHealthyHabitRoutineActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "healthy_habit_routine";
}

export function isMaterialLabActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "material_lab";
}

export function isFeatureFunctionLinkActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "feature_function_link";
}

export function isInvestigationBoardActivity(activity: LearningActivity | undefined): boolean {
  return choiceGameplayPresentation(activity) === "investigation_board";
}

export function gameplayPattern(activity: LearningActivity | undefined): GameplayPattern | null {
  if (!activity) return null;

  if (activity.runtime === "tap_choice") {
    if (activity.choicePresentation === "symbol_hunt") return "symbol_hunt";
    if (isEqualGroupsActivity(activity)) return "equal_groups";
    if (isPictureWordMatchActivity(activity)) return "picture_word_match";
    if (isSentenceOrderCardsActivity(activity)) return "sentence_order_cards";
    if (isReadingPassageQuestionActivity(activity)) return "reading_passage_question";
    const presentation = choiceGameplayPresentation(activity);
    if (presentation === "sequence_slot") return "missing_sequence_slot";
    if (presentation === "syllable_assembly") return "syllable_assembly";
    if (presentation === "initial_sound") return "initial_sound";
    if (presentation === "cloze_sentence_choice") return "cloze_sentence_choice";
    if (presentation === "sorting_buckets") return "sorting_buckets";
    if (presentation === "odd_one_out") return "odd_one_out";
    if (presentation === "rule_pipeline") return "rule_pipeline";
    if (presentation === "set_reasoning") return "set_reasoning";
    if (presentation === "transitive_chain") return "transitive_chain";
    if (presentation === "spatial_transform") return "spatial_transform";
    if (presentation === "relative_order_track") return "relative_order_track";
    if (presentation === "count_select") return "count_and_select";
    if (presentation === "number_line") return "number_line";
    if (presentation === "more_less_balance") return "more_less_balance";
    if (presentation === "pattern_completion") return "pattern_completion";
    if (presentation === "make_total") return "make_total";
    if (presentation === "take_away") return "take_away";
    if (presentation === "cause_effect") return "cause_effect";
    if (presentation === "compare_properties") return "compare_properties";
    if (presentation === "healthy_habit_routine") return "healthy_habit_routine";
    if (presentation === "material_lab") return "material_lab";
    if (presentation === "feature_function_link") return "feature_function_link";
    if (presentation === "investigation_board") return "investigation_board";
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
