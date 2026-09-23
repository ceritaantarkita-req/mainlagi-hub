import {
  MONEY_WORLD_EVIDENCE_ACTIVATION_SCOPE
} from "./moneyWorldEvidenceActivationDesign";
import {
  MONEY_WORLD_ID,
  MONEY_WORLD_SEGMENTS
} from "./moneyWorld";

export const MONEY_WORLD_EVIDENCE_INGESTION_VERSION =
  "money-world-evidence-ingestion-v1";

export const MONEY_WORLD_EVIDENCE_CONTENT_VERSION =
  "money-world-s08-subtraction-v1";

/**
 * Application-side kill switch. The database function also remains disabled,
 * so changing this constant alone cannot activate evidence writes.
 */
export const MONEY_WORLD_EVIDENCE_INGESTION_ENABLED = false;

const MAX_ANSWER_SEQUENCE = 32;
const MAX_DURATION_MS = 7_200_000;
const VALID_ANSWERS = new Set(["answer-4", "answer-6", "answer-8"]);
const CORRECT_ANSWER = "answer-6";

const FORBIDDEN_CLIENT_CANONICAL_FIELDS = new Set([
  "canonicalSkillId",
  "skillKey",
  "evidenceContract",
  "evidenceWeight",
  "evidenceScore",
  "qualifiesForMastery",
  "accuracy",
  "correctCount",
  "incorrectCount",
  "retryCount",
  "assessment",
  "progressionEffect",
  "rewardEffect",
  "certificateEffect"
]);

export type MoneyWorldEvidenceIngestionBlocker =
  | "ingestion-disabled"
  | "client-canonical-field-forbidden"
  | "invalid-observation-id"
  | "invalid-child-id"
  | "source-identity-mismatch"
  | "content-version-mismatch"
  | "source-mapping-not-approved"
  | "source-activity-not-assessed"
  | "attempt-not-completed"
  | "invalid-answer-sequence"
  | "invalid-timestamps"
  | "invalid-duration";

export interface MoneyWorldEvidenceWritePayload {
  childId: string;
  clientObservationId: string;
  worldId: typeof MONEY_WORLD_ID;
  stageId: "money-stage-08-final-festival";
  worldActivityId: "money-s08-activity-02";
  mechanicId: "tap_choice";
  contentVersion: typeof MONEY_WORLD_EVIDENCE_CONTENT_VERSION;
  answerSequence: string[];
  inputMode: string | null;
  startedAt: string;
  completedAt: string;
  metadata: Record<string, never>;
}

export interface MoneyWorldEvidenceDerivedMetrics {
  correctCount: number;
  incorrectCount: number;
  retryCount: number;
  accuracy: number;
  durationMs: number;
}

export interface MoneyWorldEvidenceIngestionEvaluation {
  disposition: "blocked" | "ready";
  blockers: MoneyWorldEvidenceIngestionBlocker[];
  serverMappedSkillId: "math.operation.subtraction.within_10" | null;
  serverMappedEvidenceContract: "choice_accuracy_v1" | null;
  derivedMetrics: MoneyWorldEvidenceDerivedMetrics | null;
  writePayload: MoneyWorldEvidenceWritePayload | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= max ? trimmed : null;
}

function currentAuthoredAssessment(
  stageId: string,
  activityId: string
): "practice" | "assessed" | null {
  const segments = MONEY_WORLD_SEGMENTS[stageId] ?? [];
  const segment = segments.find(
    (item) => item.type === "activity" && item.activity.id === activityId
  );
  return segment?.type === "activity" ? segment.activity.assessment : null;
}

function selectedMapping() {
  return MONEY_WORLD_EVIDENCE_ACTIVATION_SCOPE.find(
    (entry) =>
      entry.worldActivityId === "money-s08-activity-02" &&
      entry.decision === "approved-future-supplemental-evidence"
  );
}

export function evaluateMoneyWorldEvidenceIngestion(
  raw: unknown
): MoneyWorldEvidenceIngestionEvaluation {
  const blockers = new Set<MoneyWorldEvidenceIngestionBlocker>();
  if (!MONEY_WORLD_EVIDENCE_INGESTION_ENABLED) blockers.add("ingestion-disabled");

  if (!isRecord(raw)) {
    blockers.add("source-identity-mismatch");
    return {
      disposition: "blocked",
      blockers: [...blockers],
      serverMappedSkillId: null,
      serverMappedEvidenceContract: null,
      derivedMetrics: null,
      writePayload: null
    };
  }

  if ([...FORBIDDEN_CLIENT_CANONICAL_FIELDS].some((field) => field in raw)) {
    blockers.add("client-canonical-field-forbidden");
  }

  const clientObservationId = cleanString(raw.clientObservationId, 160);
  const childId = cleanString(raw.childId, 128);
  if (!clientObservationId) blockers.add("invalid-observation-id");
  if (!childId || childId === "demo-gian") blockers.add("invalid-child-id");

  const worldId = cleanString(raw.worldId, 80);
  const stageId = cleanString(raw.stageId, 120);
  const worldActivityId = cleanString(raw.worldActivityId, 160);
  const mechanicId = cleanString(raw.mechanicId, 80);
  const contentVersion = cleanString(raw.contentVersion, 120);
  const status = cleanString(raw.status, 32);

  const mapping = selectedMapping();
  if (
    worldId !== MONEY_WORLD_ID ||
    stageId !== "money-stage-08-final-festival" ||
    worldActivityId !== "money-s08-activity-02" ||
    mechanicId !== "tap_choice"
  ) {
    blockers.add("source-identity-mismatch");
  }
  if (contentVersion !== MONEY_WORLD_EVIDENCE_CONTENT_VERSION) {
    blockers.add("content-version-mismatch");
  }
  if (
    !mapping ||
    mapping.canonicalSkillId !== "math.operation.subtraction.within_10" ||
    mapping.evidenceContract !== "choice_accuracy_v1"
  ) {
    blockers.add("source-mapping-not-approved");
  }

  if (
    currentAuthoredAssessment(
      "money-stage-08-final-festival",
      "money-s08-activity-02"
    ) !== "assessed"
  ) {
    blockers.add("source-activity-not-assessed");
  }

  if (status !== "completed") blockers.add("attempt-not-completed");

  let derivedMetrics: MoneyWorldEvidenceDerivedMetrics | null = null;
  let answerSequence: string[] | null = null;

  if (
    Array.isArray(raw.answerSequence) &&
    raw.answerSequence.length >= 1 &&
    raw.answerSequence.length <= MAX_ANSWER_SEQUENCE &&
    raw.answerSequence.every(
      (answer): answer is string =>
        typeof answer === "string" && VALID_ANSWERS.has(answer)
    )
  ) {
    answerSequence = [...raw.answerSequence];
    const correctCount = answerSequence.filter(
      (answer) => answer === CORRECT_ANSWER
    ).length;
    const endsCorrect =
      answerSequence[answerSequence.length - 1] === CORRECT_ANSWER;

    if (correctCount === 1 && endsCorrect) {
      const incorrectCount = answerSequence.length - 1;
      const retryCount = Math.max(0, answerSequence.length - 1);
      derivedMetrics = {
        correctCount,
        incorrectCount,
        retryCount,
        accuracy: correctCount / answerSequence.length,
        durationMs: 0
      };
    } else {
      blockers.add("invalid-answer-sequence");
    }
  } else {
    blockers.add("invalid-answer-sequence");
  }

  const startedAt = cleanString(raw.startedAt, 64);
  const completedAt = cleanString(raw.completedAt, 64);
  const startedMs = startedAt ? Date.parse(startedAt) : Number.NaN;
  const completedMs = completedAt ? Date.parse(completedAt) : Number.NaN;
  if (
    !Number.isFinite(startedMs) ||
    !Number.isFinite(completedMs) ||
    completedMs < startedMs
  ) {
    blockers.add("invalid-timestamps");
  } else {
    const durationMs = completedMs - startedMs;
    if (durationMs < 0 || durationMs > MAX_DURATION_MS) {
      blockers.add("invalid-duration");
    } else if (derivedMetrics) {
      derivedMetrics = { ...derivedMetrics, durationMs };
    }
  }

  const inputModeRaw = cleanString(raw.inputMode, 32);
  const inputMode = inputModeRaw ?? null;

  const serverMappedSkillId =
    mapping?.canonicalSkillId === "math.operation.subtraction.within_10"
      ? "math.operation.subtraction.within_10"
      : null;
  const serverMappedEvidenceContract =
    mapping?.evidenceContract === "choice_accuracy_v1"
      ? "choice_accuracy_v1"
      : null;

  const writePayload =
    blockers.size === 0 &&
    clientObservationId &&
    childId &&
    worldId === MONEY_WORLD_ID &&
    stageId === "money-stage-08-final-festival" &&
    worldActivityId === "money-s08-activity-02" &&
    mechanicId === "tap_choice" &&
    contentVersion === MONEY_WORLD_EVIDENCE_CONTENT_VERSION &&
    answerSequence &&
    startedAt &&
    completedAt
      ? {
          childId,
          clientObservationId,
          worldId: "money-festival" as const,
          stageId: "money-stage-08-final-festival" as const,
          worldActivityId: "money-s08-activity-02" as const,
          mechanicId: "tap_choice" as const,
          contentVersion: MONEY_WORLD_EVIDENCE_CONTENT_VERSION,
          answerSequence,
          inputMode,
          startedAt,
          completedAt,
          metadata: {}
        }
      : null;

  return {
    disposition: writePayload ? "ready" : "blocked",
    blockers: [...blockers],
    serverMappedSkillId,
    serverMappedEvidenceContract,
    derivedMetrics,
    writePayload
  };
}
