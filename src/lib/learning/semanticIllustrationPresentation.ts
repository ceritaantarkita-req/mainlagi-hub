import type { LearningSemanticIllustrationKey } from "./semanticIllustrationRuntime";

const ACTIVITY_PREVIEW_SEMANTIC_KEYS = {
  "bahasa-baca-sari-hujan": "object.umbrella"
} as const satisfies Record<string, LearningSemanticIllustrationKey>;

export function activityPreviewSemanticKey(activityId: string): LearningSemanticIllustrationKey | undefined {
  return ACTIVITY_PREVIEW_SEMANTIC_KEYS[activityId as keyof typeof ACTIVITY_PREVIEW_SEMANTIC_KEYS];
}

export function activityPreviewSemanticBindings(): Readonly<Record<string, LearningSemanticIllustrationKey>> {
  return ACTIVITY_PREVIEW_SEMANTIC_KEYS;
}
