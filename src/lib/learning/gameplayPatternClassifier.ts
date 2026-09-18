import type { LearningActivity } from "./system";
import { gameplayPattern, type GameplayPattern } from "./gameplayPresentation";
import { isEliminationBoardActivity } from "./eliminationBoardConfig";
import { isGrowthStageTransitionActivity } from "./growthStageTransitionConfig";
import { isPhraseSceneMatchActivity } from "./phraseSceneMatchConfig";
import { isPhenomenonRelationBoardActivity } from "./phenomenonRelationBoardConfig";
import { isShapeAttributeBoardActivity } from "./shapeAttributeBoardConfig";
import { isSingleRuleApplyActivity } from "./singleRuleApplyConfig";
import { isSubitizingGlanceActivity } from "./subitizingGlanceConfig";
import { isSpatialRelationBoardActivity } from "./spatialRelationBoardConfig";

export type CanonicalGameplayPattern = GameplayPattern | "spatial_relation_board" | "phrase_scene_match" | "growth_stage_transition" | "single_rule_apply" | "subitizing_glance" | "elimination_board" | "phenomenon_relation_board" | "shape_attribute_board";

/**
 * Canonical WS-05 gameplay-pattern classifier.
 *
 * New exact-scoped patterns remain isolated here so audited families can be
 * registered without broadening older presentation classifiers. Older pattern
 * logic remains unchanged and is delegated to as the fallback.
 */
export function canonicalGameplayPattern(activity: LearningActivity | undefined): CanonicalGameplayPattern | null {
  if (!activity) return null;
  if (isSingleRuleApplyActivity(activity)) return "single_rule_apply";
  if (isSubitizingGlanceActivity(activity)) return "subitizing_glance";
  if (isEliminationBoardActivity(activity)) return "elimination_board";
  if (isPhenomenonRelationBoardActivity(activity)) return "phenomenon_relation_board";
  if (isShapeAttributeBoardActivity(activity)) return "shape_attribute_board";
  if (isGrowthStageTransitionActivity(activity)) return "growth_stage_transition";
  if (isPhraseSceneMatchActivity(activity)) return "phrase_scene_match";
  if (isSpatialRelationBoardActivity(activity)) return "spatial_relation_board";
  return gameplayPattern(activity);
}
