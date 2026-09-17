import type { LearningActivity } from "./system";
import { gameplayPattern, type GameplayPattern } from "./gameplayPresentation";
import { isGrowthStageTransitionActivity } from "./growthStageTransitionConfig";
import { isPhraseSceneMatchActivity } from "./phraseSceneMatchConfig";
import { isSpatialRelationBoardActivity } from "./spatialRelationBoardConfig";

export type CanonicalGameplayPattern = GameplayPattern | "spatial_relation_board" | "phrase_scene_match" | "growth_stage_transition";

/**
 * Canonical WS-05 gameplay-pattern classifier.
 *
 * New exact-scoped patterns remain isolated here so audited families can be
 * registered without broadening older presentation classifiers. Older pattern
 * logic remains unchanged and is delegated to as the fallback.
 */
export function canonicalGameplayPattern(activity: LearningActivity | undefined): CanonicalGameplayPattern | null {
  if (!activity) return null;
  if (isGrowthStageTransitionActivity(activity)) return "growth_stage_transition";
  if (isPhraseSceneMatchActivity(activity)) return "phrase_scene_match";
  if (isSpatialRelationBoardActivity(activity)) return "spatial_relation_board";
  return gameplayPattern(activity);
}
