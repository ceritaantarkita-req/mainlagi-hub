import {
  MONEY_WORLD_NARRATION_CUES,
  MONEY_WORLD_NARRATION_LOCALE,
  type MoneyWorldNarrationCue,
  type MoneyWorldNarrationKind,
  type MoneyWorldNarrationSpeaker
} from "./moneyWorldNarration";

export const MONEY_WORLD_NARRATION_PRODUCTION_VERSION = "money-world-narration-production-v1";

export type MoneyWorldNarrationProductionStatus = "pending-review" | "approved";
export type MoneyWorldNarrationRightsStatus = "redistribution-approved";

export interface MoneyWorldNarrationApproval {
  cueId: string;
  src: string;
  textFingerprint: string;
  speaker: MoneyWorldNarrationSpeaker;
  locale: typeof MONEY_WORLD_NARRATION_LOCALE;
  providerOrSource: string;
  rightsStatus: MoneyWorldNarrationRightsStatus;
  reviewedBy: string;
  reviewedAt: string;
  pronunciationReviewed: true;
  pacingReviewed: true;
  loudnessReviewed: true;
  mobilePlaybackReviewed: true;
}

export interface MoneyWorldNarrationProductionEntry {
  cueId: string;
  stageId: string;
  kind: MoneyWorldNarrationKind;
  speaker: MoneyWorldNarrationSpeaker;
  locale: typeof MONEY_WORLD_NARRATION_LOCALE;
  text: string;
  textFingerprint: string;
  expectedSrc: string;
  status: MoneyWorldNarrationProductionStatus;
  productionSrc: string | null;
  fallback: "browser-speech";
  approval: MoneyWorldNarrationApproval | null;
}

export interface MoneyWorldNarrationProductionValidation {
  valid: boolean;
  errors: readonly string[];
}

export interface MoneyWorldNarrationProductionSummary {
  total: number;
  approved: number;
  pending: number;
  productionReady: boolean;
}

/**
 * Fixed narration is fail-closed. A generated file is not activated merely
 * because it exists at the expected path. It must have a matching approval
 * record below after copy, speaker/source, rights, pronunciation, pacing,
 * loudness and mobile playback review.
 *
 * Keep this empty until real audio assets have completed that review.
 */
export const MONEY_WORLD_NARRATION_APPROVALS: readonly MoneyWorldNarrationApproval[] = [];

function fingerprintInput(cue: Pick<MoneyWorldNarrationCue, "locale" | "speaker" | "kind" | "text">): string {
  return [cue.locale, cue.speaker, cue.kind, cue.text.trim()].join("\n");
}

export function fingerprintMoneyWorldNarrationCue(
  cue: Pick<MoneyWorldNarrationCue, "locale" | "speaker" | "kind" | "text">
): string {
  const input = fingerprintInput(cue);
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return "fnv1a32-" + (hash >>> 0).toString(16).padStart(8, "0");
}

function approvalMap(): ReadonlyMap<string, MoneyWorldNarrationApproval> {
  return new Map(MONEY_WORLD_NARRATION_APPROVALS.map((approval) => [approval.cueId, approval]));
}

function isApprovalValidForCue(
  approval: MoneyWorldNarrationApproval,
  cue: MoneyWorldNarrationCue
): boolean {
  return approval.src === cue.expectedProductionSrc
    && approval.textFingerprint === fingerprintMoneyWorldNarrationCue(cue)
    && approval.speaker === cue.speaker
    && approval.locale === cue.locale
    && approval.rightsStatus === "redistribution-approved"
    && Boolean(approval.providerOrSource.trim())
    && Boolean(approval.reviewedBy.trim())
    && Boolean(Date.parse(approval.reviewedAt))
    && approval.pronunciationReviewed
    && approval.pacingReviewed
    && approval.loudnessReviewed
    && approval.mobilePlaybackReviewed;
}

function buildProductionEntries(): MoneyWorldNarrationProductionEntry[] {
  const approvals = approvalMap();

  return MONEY_WORLD_NARRATION_CUES.map((cue) => {
    const approval = approvals.get(cue.id) ?? null;
    const approved = approval ? isApprovalValidForCue(approval, cue) : false;
    return {
      cueId: cue.id,
      stageId: cue.stageId,
      kind: cue.kind,
      speaker: cue.speaker,
      locale: cue.locale,
      text: cue.text,
      textFingerprint: fingerprintMoneyWorldNarrationCue(cue),
      expectedSrc: cue.expectedProductionSrc,
      status: approved ? "approved" : "pending-review",
      productionSrc: approved ? cue.expectedProductionSrc : null,
      fallback: "browser-speech",
      approval: approved ? approval : null
    };
  });
}

export const MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES: readonly MoneyWorldNarrationProductionEntry[] =
  Object.freeze(buildProductionEntries());

export const MONEY_WORLD_NARRATION_PRODUCTION_BY_ID: ReadonlyMap<string, MoneyWorldNarrationProductionEntry> =
  new Map(MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES.map((entry) => [entry.cueId, entry]));

export function validateMoneyWorldNarrationProduction(): MoneyWorldNarrationProductionValidation {
  const errors: string[] = [];
  const cueById = new Map(MONEY_WORLD_NARRATION_CUES.map((cue) => [cue.id, cue] as const));
  const approvalIds = MONEY_WORLD_NARRATION_APPROVALS.map((approval) => approval.cueId);

  if (new Set(approvalIds).size !== approvalIds.length) {
    errors.push("narration approval cue IDs must be unique");
  }

  for (const approval of MONEY_WORLD_NARRATION_APPROVALS) {
    const cue = cueById.get(approval.cueId);
    if (!cue) {
      errors.push("narration approval references unknown cue: " + approval.cueId);
      continue;
    }
    if (approval.src !== cue.expectedProductionSrc) {
      errors.push(approval.cueId + " approval source must equal deterministic expected path");
    }
    if (approval.textFingerprint !== fingerprintMoneyWorldNarrationCue(cue)) {
      errors.push(approval.cueId + " approval fingerprint is stale");
    }
    if (approval.speaker !== cue.speaker || approval.locale !== cue.locale) {
      errors.push(approval.cueId + " approval speaker/locale does not match cue");
    }
    if (approval.rightsStatus !== "redistribution-approved") {
      errors.push(approval.cueId + " distribution rights are not approved");
    }
    if (!approval.providerOrSource.trim() || !approval.reviewedBy.trim() || !Date.parse(approval.reviewedAt)) {
      errors.push(approval.cueId + " approval provenance/reviewer metadata is incomplete");
    }
    if (
      !approval.pronunciationReviewed ||
      !approval.pacingReviewed ||
      !approval.loudnessReviewed ||
      !approval.mobilePlaybackReviewed
    ) {
      errors.push(approval.cueId + " approval review gates are incomplete");
    }
  }

  if (MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES.length !== MONEY_WORLD_NARRATION_CUES.length) {
    errors.push("production cue sheet must cover every canonical narration cue");
  }

  for (const cue of MONEY_WORLD_NARRATION_CUES) {
    const entry = MONEY_WORLD_NARRATION_PRODUCTION_BY_ID.get(cue.id);
    if (!entry) {
      errors.push("missing production entry: " + cue.id);
      continue;
    }
    if (entry.expectedSrc !== cue.expectedProductionSrc) {
      errors.push(cue.id + " production entry path drifted from canonical cue");
    }
    if (entry.textFingerprint !== fingerprintMoneyWorldNarrationCue(cue)) {
      errors.push(cue.id + " production entry fingerprint mismatch");
    }
    if (entry.status === "approved" && !entry.productionSrc) {
      errors.push(cue.id + " approved entry must expose productionSrc");
    }
    if (entry.status !== "approved" && entry.productionSrc !== null) {
      errors.push(cue.id + " unapproved entry must fail closed to browser speech");
    }
  }

  return { valid: errors.length === 0, errors };
}

export const MONEY_WORLD_NARRATION_PRODUCTION_VALIDATION =
  validateMoneyWorldNarrationProduction();

export const MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY: MoneyWorldNarrationProductionSummary = (() => {
  const total = MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES.length;
  const approved = MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES.filter((entry) => entry.status === "approved").length;
  return {
    total,
    approved,
    pending: total - approved,
    productionReady:
      total > 0 &&
      approved === total &&
      MONEY_WORLD_NARRATION_PRODUCTION_VALIDATION.valid
  };
})();

export function getMoneyWorldNarrationProductionEntry(
  cueId: string
): MoneyWorldNarrationProductionEntry | undefined {
  return MONEY_WORLD_NARRATION_PRODUCTION_BY_ID.get(cueId);
}

export function resolveMoneyWorldNarrationProductionSrc(cueId: string): string | null {
  const entry = getMoneyWorldNarrationProductionEntry(cueId);
  return entry?.status === "approved" ? entry.productionSrc : null;
}
