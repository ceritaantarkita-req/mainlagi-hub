import {
  getMoneyWorldNarrationProductionEntry,
  MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY,
  type MoneyWorldNarrationProductionEntry
} from "./moneyWorldNarrationProduction";
import { MONEY_WORLD_NARRATION_VOICE_POLICY } from "./moneyWorldNarrationPlan";

export const MONEY_WORLD_NARRATION_PROVIDER_PILOT_VERSION =
  "money-world-narration-provider-pilot-v1";

export const MONEY_WORLD_NARRATION_PROVIDER_PILOT_CUE_IDS = [
  "money-s01-narrative-01",
  "money-s01-concept-money",
  "money-s01-activity-01-prompt",
  "money-s01-payoff-01"
] as const;

export interface MoneyWorldNarrationProviderPilot {
  version: typeof MONEY_WORLD_NARRATION_PROVIDER_PILOT_VERSION;
  state: "voice-decision-required";
  providerStatus: "unselected";
  generationAuthorized: false;
  outputRoot: "internal/world-money-narration-pilot";
  publicOutput: false;
  productionOutput: false;
  runtimeActive: false;
  registryAutoApproval: false;
  cueIds: readonly string[];
  cues: readonly MoneyWorldNarrationProductionEntry[];
}

const pilotCues = MONEY_WORLD_NARRATION_PROVIDER_PILOT_CUE_IDS.map((cueId) => {
  const entry = getMoneyWorldNarrationProductionEntry(cueId);
  if (!entry) throw new Error("Narration provider pilot references unknown cue: " + cueId);
  return entry;
});

export const MONEY_WORLD_NARRATION_PROVIDER_PILOT: MoneyWorldNarrationProviderPilot = {
  version: MONEY_WORLD_NARRATION_PROVIDER_PILOT_VERSION,
  state: "voice-decision-required",
  providerStatus: "unselected",
  generationAuthorized: false,
  outputRoot: "internal/world-money-narration-pilot",
  publicOutput: false,
  productionOutput: false,
  runtimeActive: false,
  registryAutoApproval: false,
  cueIds: MONEY_WORLD_NARRATION_PROVIDER_PILOT_CUE_IDS,
  cues: pilotCues
};

export function validateMoneyWorldNarrationProviderPilot(): {
  valid: boolean;
  errors: readonly string[];
} {
  const errors: string[] = [];
  const pilot = MONEY_WORLD_NARRATION_PROVIDER_PILOT;

  if (MONEY_WORLD_NARRATION_VOICE_POLICY.fixedAudioGenerationAuthorized) {
    errors.push("provider pilot must be revisited after fixed-audio generation becomes authorized");
  }
  if (pilot.generationAuthorized) errors.push("provider pilot must remain generation-blocked before voice approval");
  if (pilot.providerStatus !== "unselected") errors.push("provider pilot must not silently select a provider");
  if (pilot.publicOutput || pilot.productionOutput || pilot.runtimeActive || pilot.registryAutoApproval) {
    errors.push("provider pilot outputs must stay internal/non-production/non-runtime/non-auto-approved");
  }
  if (pilot.cueIds.length !== 4 || new Set(pilot.cueIds).size !== 4) {
    errors.push("provider pilot must contain exactly four unique cues");
  }
  if (pilot.cues.length !== pilot.cueIds.length) {
    errors.push("provider pilot cue payload must match exact cue ID scope");
  }

  const speakerCounts = pilot.cues.reduce<Record<string, number>>((counts, cue) => {
    counts[cue.speaker] = (counts[cue.speaker] ?? 0) + 1;
    return counts;
  }, {});
  if (speakerCounts.Gian !== 2 || speakerCounts.Naya !== 2) {
    errors.push("provider pilot must cover exactly two Gian and two Naya canonical-role cues");
  }

  const expectedKinds = ["activity_prompt", "concept", "narrative", "payoff"];
  const kinds = [...new Set(pilot.cues.map((cue) => cue.kind))].sort();
  if (JSON.stringify(kinds) !== JSON.stringify(expectedKinds)) {
    errors.push("provider pilot must cover narrative, concept, activity_prompt, and payoff");
  }

  for (const cue of pilot.cues) {
    if (cue.stageId !== "money-stage-01-money-use") {
      errors.push(cue.cueId + " provider pilot cue must stay in Stage 1");
    }
    if (cue.status !== "pending-review" || cue.productionSrc !== null || cue.approval !== null) {
      errors.push(cue.cueId + " provider pilot cue must remain unapproved before generation");
    }
  }

  if (MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY.approved !== 0) {
    errors.push("provider pilot baseline expects zero approved fixed narration assets");
  }

  return { valid: errors.length === 0, errors };
}

export const MONEY_WORLD_NARRATION_PROVIDER_PILOT_VALIDATION =
  validateMoneyWorldNarrationProviderPilot();
