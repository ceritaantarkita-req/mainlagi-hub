export type MoneyWorldAgeBandId = "3-5" | "6-8" | "9-12";

export interface MoneyWorldAgeBandPolicy {
  id: MoneyWorldAgeBandId;
  minAge: number;
  maxAge: number;
  label: string;
  shippingStatus: "pilot" | "future-separate-variant" | "future-separate-series";
  stageMinutes: readonly [number, number];
  maxNarrationWords: number;
  maxVisibleChoices: number;
  interactionSteps: "single-step" | "simple-multi-step" | "multi-step";
  audioMode: "audio-first";
  textMode: "minimal-support" | "short-support";
  notes: readonly string[];
}

export const MONEY_WORLD_PRESENTATION_POLICY = {
  version: "money-world-presentation-v1",
  pilotBandId: "6-8" as MoneyWorldAgeBandId,
  autoMorphSameWorldByAge: false,
  sameWorldSpansAge3To12: false,
  masteryCanTransferAcrossVariantsOnlyWithCompatibleEvidence: true,
  bands: {
    "3-5": {
      id: "3-5",
      minAge: 3,
      maxAge: 5,
      label: "3–5",
      shippingStatus: "future-separate-variant",
      stageMinutes: [2, 4],
      maxNarrationWords: 8,
      maxVisibleChoices: 3,
      interactionSteps: "single-step",
      audioMode: "audio-first",
      textMode: "minimal-support",
      notes: [
        "Use concrete objects before labels or jargon.",
        "Prefer one-step activities with very large touch targets.",
        "Do not unlock this band by making later 6–8 stages easier at runtime."
      ]
    },
    "6-8": {
      id: "6-8",
      minAge: 6,
      maxAge: 8,
      label: "6–8",
      shippingStatus: "pilot",
      stageMinutes: [4, 6],
      maxNarrationWords: 18,
      maxVisibleChoices: 4,
      interactionSteps: "simple-multi-step",
      audioMode: "audio-first",
      textMode: "short-support",
      notes: [
        "This is the current Petualangan Uang pilot presentation.",
        "Audio remains primary while short captions support comprehension.",
        "Introduce abstract terms only after a concrete scene."
      ]
    },
    "9-12": {
      id: "9-12",
      minAge: 9,
      maxAge: 12,
      label: "9–12",
      shippingStatus: "future-separate-series",
      stageMinutes: [5, 8],
      maxNarrationWords: 24,
      maxVisibleChoices: 5,
      interactionSteps: "multi-step",
      audioMode: "audio-first",
      textMode: "short-support",
      notes: [
        "Keep the Mainlagi visual identity but reduce toddler-like presentation.",
        "Use richer causal scenarios rather than stretching the 6–8 Stage sequence.",
        "Create a separate theme series/variant instead of turning Stage 20 into an older-age gate."
      ]
    }
  } satisfies Record<MoneyWorldAgeBandId, MoneyWorldAgeBandPolicy>,
  invariants: {
    oneBubbleOneIdea: true,
    noParagraphChildCopy: true,
    conceptBeforeJargon: true,
    maxNewAbstractTermsPerStage: 2,
    wrongAnswerNeverReducesStars: true,
    completionStarsAreNotMastery: true,
    motionCameraRequired: false
  }
} as const;

export const MONEY_WORLD_PILOT_AGE_BAND =
  MONEY_WORLD_PRESENTATION_POLICY.bands[MONEY_WORLD_PRESENTATION_POLICY.pilotBandId];
