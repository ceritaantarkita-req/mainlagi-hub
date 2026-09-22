import {
  MONEY_WORLD_NARRATION_PROVIDER_PILOT,
  MONEY_WORLD_NARRATION_PROVIDER_PILOT_CUE_IDS
} from "./moneyWorldNarrationPilot";

export const MONEY_WORLD_NARRATION_REVIEW_VERSION = "money-world-narration-review-v1";

export type MoneyWorldNarrationReviewDimension =
  | "exact_copy"
  | "pronunciation"
  | "child_comprehension"
  | "pacing"
  | "warmth"
  | "role_fit"
  | "loudness_consistency"
  | "artifact_free"
  | "mobile_playback";

export type MoneyWorldNarrationReviewDecision = "pending" | "pass" | "fail";

export interface MoneyWorldNarrationReviewDimensionDefinition {
  id: MoneyWorldNarrationReviewDimension;
  label: string;
  blocking: true;
  acceptance: string;
}

export interface MoneyWorldNarrationCueReviewTemplate {
  cueId: string;
  speaker: "Gian" | "Naya";
  kind: "narrative" | "concept" | "activity_prompt" | "payoff";
  text: string;
  textFingerprint: string;
  requiredDimensions: readonly MoneyWorldNarrationReviewDimension[];
}

export const MONEY_WORLD_NARRATION_REVIEW_DIMENSIONS: readonly MoneyWorldNarrationReviewDimensionDefinition[] = [
  {
    id: "exact_copy",
    label: "Exact copy",
    blocking: true,
    acceptance: "Audio says the canonical cue text without additions, omissions, paraphrase, or repeated words."
  },
  {
    id: "pronunciation",
    label: "Indonesian pronunciation",
    blocking: true,
    acceptance: "Words and numbers are pronounced naturally and clearly for Indonesian child-facing narration."
  },
  {
    id: "child_comprehension",
    label: "Child comprehension",
    blocking: true,
    acceptance: "The cue is understandable without needing the reviewer to infer missing words or intent."
  },
  {
    id: "pacing",
    label: "Pacing",
    blocking: true,
    acceptance: "Delivery is neither rushed nor unnaturally slow and leaves short natural pauses where needed."
  },
  {
    id: "warmth",
    label: "Warmth",
    blocking: true,
    acceptance: "Delivery is friendly and calm enough for the 6–8 pilot without sounding flat, harsh, or over-performed."
  },
  {
    id: "role_fit",
    label: "Role fit",
    blocking: true,
    acceptance: "The sample is consistent with the explicitly approved narration identity for the canonical Gian or Naya role."
  },
  {
    id: "loudness_consistency",
    label: "Loudness consistency",
    blocking: true,
    acceptance: "The sample is not materially quieter/louder than the other pilot samples and has no clipping."
  },
  {
    id: "artifact_free",
    label: "Artifact free",
    blocking: true,
    acceptance: "No clicks, truncated syllables, duplicated phonemes, synthetic glitches, or unintended background sound."
  },
  {
    id: "mobile_playback",
    label: "Mobile playback",
    blocking: true,
    acceptance: "The reviewed file plays end-to-end on the supported mobile QA path."
  }
] as const;

export const MONEY_WORLD_NARRATION_REVIEW_DIMENSION_IDS =
  MONEY_WORLD_NARRATION_REVIEW_DIMENSIONS.map((dimension) => dimension.id);

export const MONEY_WORLD_NARRATION_PROVIDER_PILOT_REVIEW_TEMPLATES:
  readonly MoneyWorldNarrationCueReviewTemplate[] =
  MONEY_WORLD_NARRATION_PROVIDER_PILOT.cues.map((cue) => ({
    cueId: cue.cueId,
    speaker: cue.speaker,
    kind: cue.kind,
    text: cue.text,
    textFingerprint: cue.textFingerprint,
    requiredDimensions: MONEY_WORLD_NARRATION_REVIEW_DIMENSION_IDS
  }));

export interface MoneyWorldNarrationPilotReviewRecord {
  cueId: string;
  textFingerprint: string;
  reviewer: string;
  reviewedAt: string;
  decisions: Readonly<Record<MoneyWorldNarrationReviewDimension, MoneyWorldNarrationReviewDecision>>;
  notes: string;
}

export function validateMoneyWorldNarrationPilotReviewRecords(
  records: readonly MoneyWorldNarrationPilotReviewRecord[]
): { valid: boolean; accepted: boolean; errors: readonly string[] } {
  const errors: string[] = [];
  const templateByCue = new Map(
    MONEY_WORLD_NARRATION_PROVIDER_PILOT_REVIEW_TEMPLATES.map((template) => [template.cueId, template] as const)
  );

  if (new Set(records.map((record) => record.cueId)).size !== records.length) {
    errors.push("pilot review cue IDs must be unique");
  }

  for (const record of records) {
    const template = templateByCue.get(record.cueId);
    if (!template) {
      errors.push("pilot review references unknown cue: " + record.cueId);
      continue;
    }
    if (record.textFingerprint !== template.textFingerprint) {
      errors.push(record.cueId + " review fingerprint is stale");
    }
    if (!record.reviewer.trim()) errors.push(record.cueId + " reviewer is required");
    if (!record.reviewedAt.trim() || Number.isNaN(Date.parse(record.reviewedAt))) {
      errors.push(record.cueId + " reviewedAt must be a valid timestamp");
    }

    for (const dimension of template.requiredDimensions) {
      const decision = record.decisions[dimension];
      if (!["pending", "pass", "fail"].includes(decision)) {
        errors.push(record.cueId + " missing/invalid review decision for " + dimension);
      }
    }
  }

  const completeScope =
    records.length === MONEY_WORLD_NARRATION_PROVIDER_PILOT_CUE_IDS.length &&
    MONEY_WORLD_NARRATION_PROVIDER_PILOT_CUE_IDS.every((cueId) =>
      records.some((record) => record.cueId === cueId)
    );

  if (!completeScope) {
    errors.push("pilot review must cover the exact four-cue provider pilot scope");
  }

  const accepted =
    errors.length === 0 &&
    records.every((record) =>
      MONEY_WORLD_NARRATION_REVIEW_DIMENSION_IDS.every(
        (dimension) => record.decisions[dimension] === "pass"
      )
    );

  return {
    valid: errors.length === 0,
    accepted,
    errors
  };
}

export function createPendingMoneyWorldNarrationPilotReviewRecords(): MoneyWorldNarrationPilotReviewRecord[] {
  return MONEY_WORLD_NARRATION_PROVIDER_PILOT_REVIEW_TEMPLATES.map((template) => ({
    cueId: template.cueId,
    textFingerprint: template.textFingerprint,
    reviewer: "",
    reviewedAt: "",
    decisions: Object.fromEntries(
      MONEY_WORLD_NARRATION_REVIEW_DIMENSION_IDS.map((dimension) => [dimension, "pending"])
    ) as Record<MoneyWorldNarrationReviewDimension, MoneyWorldNarrationReviewDecision>,
    notes: ""
  }));
}

export function validateMoneyWorldNarrationReviewContract(): {
  valid: boolean;
  errors: readonly string[];
} {
  const errors: string[] = [];

  if (MONEY_WORLD_NARRATION_REVIEW_DIMENSIONS.length !== 9) {
    errors.push("narration pilot review must keep exactly nine blocking dimensions");
  }
  if (new Set(MONEY_WORLD_NARRATION_REVIEW_DIMENSION_IDS).size !== MONEY_WORLD_NARRATION_REVIEW_DIMENSION_IDS.length) {
    errors.push("narration review dimension IDs must be unique");
  }
  if (
    MONEY_WORLD_NARRATION_PROVIDER_PILOT_REVIEW_TEMPLATES.length !==
    MONEY_WORLD_NARRATION_PROVIDER_PILOT_CUE_IDS.length
  ) {
    errors.push("narration review templates must cover the exact pilot cue scope");
  }

  for (const template of MONEY_WORLD_NARRATION_PROVIDER_PILOT_REVIEW_TEMPLATES) {
    if (template.requiredDimensions.length !== MONEY_WORLD_NARRATION_REVIEW_DIMENSION_IDS.length) {
      errors.push(template.cueId + " must require all narration review dimensions");
    }
  }

  const pending = validateMoneyWorldNarrationPilotReviewRecords(
    createPendingMoneyWorldNarrationPilotReviewRecords()
  );
  if (!pending.valid) errors.push(...pending.errors);
  if (pending.accepted) errors.push("pending narration review must never be accepted");

  return { valid: errors.length === 0, errors };
}

export const MONEY_WORLD_NARRATION_REVIEW_VALIDATION =
  validateMoneyWorldNarrationReviewContract();
