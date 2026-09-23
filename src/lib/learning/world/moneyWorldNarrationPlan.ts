import { MONEY_WORLD_STAGES } from "./moneyWorld";
import { MONEY_WORLD_RUNTIME_CHARACTER_POLICY } from "./moneyWorldAssets";
import {
  MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES,
  MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY
} from "./moneyWorldNarrationProduction";

export const MONEY_WORLD_NARRATION_PLAN_VERSION = "money-world-narration-plan-v1";

export type MoneyWorldNarrationBatchStatus =
  | "blocked-voice-identity"
  | "ready-for-generation"
  | "partially-approved"
  | "approved";

export interface MoneyWorldNarrationStageBatch {
  id: string;
  stageId: string;
  stageOrder: number;
  cueIds: readonly string[];
  cueCount: number;
  approvedCueCount: number;
  generationAuthorized: boolean;
  status: MoneyWorldNarrationBatchStatus;
}

export const MONEY_WORLD_NARRATION_VOICE_POLICY = {
  version: "money-world-narration-voice-policy-v1",
  canonicalSpeakerRoles: ["Gian", "Naya"] as const,
  runtimePresentationMapping: MONEY_WORLD_RUNTIME_CHARACTER_POLICY.storyRoleToRuntimeCharacter,
  finalHumanCharactersActivated: MONEY_WORLD_RUNTIME_CHARACTER_POLICY.finalHumanCharactersActivated,
  fixedAudioGenerationAuthorized: false,
  blockerId: "voice-identity-not-approved",
  rationale:
    "Canonical story speakers remain Gian/Naya while runtime presentation temporarily uses Gavi/Paca. Character development is paused, so final fixed voice identity must not be generated or approved by implication."
} as const;

function batchStatus(args: {
  cueCount: number;
  approvedCueCount: number;
  generationAuthorized: boolean;
}): MoneyWorldNarrationBatchStatus {
  if (args.approvedCueCount === args.cueCount && args.cueCount > 0) return "approved";
  if (!args.generationAuthorized) return "blocked-voice-identity";
  if (args.approvedCueCount > 0) return "partially-approved";
  return "ready-for-generation";
}

export const MONEY_WORLD_NARRATION_STAGE_BATCHES: readonly MoneyWorldNarrationStageBatch[] =
  MONEY_WORLD_STAGES.map((stage) => {
    const entries = MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES.filter((entry) => entry.stageId === stage.id);
    const approvedCueCount = entries.filter((entry) => entry.status === "approved").length;
    const generationAuthorized = MONEY_WORLD_NARRATION_VOICE_POLICY.fixedAudioGenerationAuthorized;

    return {
      id: "money-world-narration-stage-" + String(stage.order).padStart(2, "0"),
      stageId: stage.id,
      stageOrder: stage.order,
      cueIds: entries.map((entry) => entry.cueId),
      cueCount: entries.length,
      approvedCueCount,
      generationAuthorized,
      status: batchStatus({
        cueCount: entries.length,
        approvedCueCount,
        generationAuthorized
      })
    };
  });

export function validateMoneyWorldNarrationPlan(): { valid: boolean; errors: readonly string[] } {
  const errors: string[] = [];

  if (MONEY_WORLD_NARRATION_VOICE_POLICY.finalHumanCharactersActivated) {
    errors.push("voice policy must be revisited when final human characters are activated");
  }

  if (MONEY_WORLD_NARRATION_VOICE_POLICY.fixedAudioGenerationAuthorized) {
    errors.push("fixed audio generation must stay blocked until voice identity is explicitly approved");
  }

  if (MONEY_WORLD_NARRATION_STAGE_BATCHES.length !== MONEY_WORLD_STAGES.length) {
    errors.push("narration plan must contain one batch per canonical Stage");
  }

  const plannedCueIds = MONEY_WORLD_NARRATION_STAGE_BATCHES.flatMap((batch) => [...batch.cueIds]);
  const canonicalCueIds = MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES.map((entry) => entry.cueId);

  if (new Set(plannedCueIds).size !== plannedCueIds.length) {
    errors.push("narration cue appears in more than one Stage batch");
  }

  if (
    plannedCueIds.length !== canonicalCueIds.length ||
    !canonicalCueIds.every((cueId) => plannedCueIds.includes(cueId))
  ) {
    errors.push("narration Stage batches must cover every canonical production cue exactly once");
  }

  for (const stage of MONEY_WORLD_STAGES) {
    const batch = MONEY_WORLD_NARRATION_STAGE_BATCHES.find((item) => item.stageId === stage.id);
    if (!batch) {
      errors.push("missing narration batch for " + stage.id);
      continue;
    }
    if (batch.stageOrder !== stage.order) errors.push(stage.id + " narration batch order mismatch");
    if (batch.cueCount <= 0) errors.push(stage.id + " narration batch must contain cues");
    if (batch.generationAuthorized) errors.push(stage.id + " generation must remain blocked before voice approval");
    if (batch.status !== "blocked-voice-identity" && batch.status !== "approved") {
      errors.push(stage.id + " has unexpected pre-authorization batch status: " + batch.status);
    }
  }

  if (MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY.approved === 0) {
    const nonBlocked = MONEY_WORLD_NARRATION_STAGE_BATCHES.filter((batch) => batch.status !== "blocked-voice-identity");
    if (nonBlocked.length) errors.push("all unapproved Stage batches must remain voice-blocked");
  }

  return { valid: errors.length === 0, errors };
}

export const MONEY_WORLD_NARRATION_PLAN_VALIDATION = validateMoneyWorldNarrationPlan();

export const MONEY_WORLD_NARRATION_PLAN_SUMMARY = {
  stageBatches: MONEY_WORLD_NARRATION_STAGE_BATCHES.length,
  totalCues: MONEY_WORLD_NARRATION_STAGE_BATCHES.reduce((sum, batch) => sum + batch.cueCount, 0),
  approvedCues: MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY.approved,
  generationAuthorizedCues: MONEY_WORLD_NARRATION_STAGE_BATCHES
    .filter((batch) => batch.generationAuthorized)
    .reduce((sum, batch) => sum + batch.cueCount, 0),
  blockedCues: MONEY_WORLD_NARRATION_STAGE_BATCHES
    .filter((batch) => !batch.generationAuthorized)
    .reduce((sum, batch) => sum + batch.cueCount, 0)
} as const;

export function getMoneyWorldNarrationStageBatch(
  stageId: string
): MoneyWorldNarrationStageBatch | undefined {
  return MONEY_WORLD_NARRATION_STAGE_BATCHES.find((batch) => batch.stageId === stageId);
}
