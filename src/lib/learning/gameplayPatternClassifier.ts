import type { LearningActivity } from "./system";
import { gameplayPattern, type GameplayPattern } from "./gameplayPresentation";
import { isSpatialRelationBoardActivity } from "./spatialRelationBoardConfig";

export type CanonicalGameplayPattern = GameplayPattern | "spatial_relation_board";

/**
 * Canonical WS-05 gameplay-pattern classifier.
 *
 * Pattern #40 is intentionally isolated here so the audited spatial scope can
 * be registered without broadening any existing presentation family. Older
 * pattern classifiers remain unchanged and are delegated to as the fallback.
 */
export function canonicalGameplayPattern(activity: LearningActivity | undefined): CanonicalGameplayPattern | null {
  if (!activity) return null;
  if (isSpatialRelationBoardActivity(activity)) return "spatial_relation_board";
  return gameplayPattern(activity);
}
