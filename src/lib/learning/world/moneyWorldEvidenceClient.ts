export const MONEY_WORLD_EVIDENCE_CLIENT_VERSION =
  "money-world-evidence-client-v1";

export const MONEY_WORLD_EVIDENCE_ACTIVE_CONTENT_VERSION =
  "money-world-s08-subtraction-v2-assessed";

export type MoneyWorldEvidenceInputMode =
  | "pointer"
  | "keyboard"
  | "button";

export interface MoneyWorldEvidenceCompletionObservation {
  childId: string;
  answerSequence: string[];
  startedAt: string;
  completedAt: string;
  inputMode: MoneyWorldEvidenceInputMode;
}

export type MoneyWorldEvidenceEmissionResult =
  | { status: "accepted"; evidenceId: string }
  | { status: "rejected"; reason: string; httpStatus: number }
  | { status: "network-error" }
  | { status: "skipped-demo" };

function createObservationId(): string {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    return "world-evidence:" + cryptoApi.randomUUID();
  }
  return "world-evidence:" + Date.now().toString(36) + ":" + Math.random().toString(36).slice(2);
}

async function postObservation(
  observation: Record<string, unknown>
): Promise<Response> {
  return fetch("/api/learning/world-evidence", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(observation)
  });
}

/**
 * Evidence delivery is intentionally non-blocking for World UX.
 *
 * The same clientObservationId is reused for the one network retry, so the
 * server/database idempotency boundary can safely collapse duplicate delivery.
 */
export async function emitMoneyWorldEvidenceObservation(
  input: MoneyWorldEvidenceCompletionObservation
): Promise<MoneyWorldEvidenceEmissionResult> {
  if (input.childId === "demo-gian") return { status: "skipped-demo" };

  const observationId = createObservationId();
  const observation = {
    childId: input.childId,
    clientObservationId: observationId,
    worldId: "money-festival",
    stageId: "money-stage-08-final-festival",
    worldActivityId: "money-s08-activity-02",
    mechanicId: "tap_choice",
    contentVersion: MONEY_WORLD_EVIDENCE_ACTIVE_CONTENT_VERSION,
    status: "completed",
    answerSequence: [...input.answerSequence],
    inputMode: input.inputMode,
    startedAt: input.startedAt,
    completedAt: input.completedAt
  };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await postObservation(observation);
      const payload = await response.json().catch(() => ({})) as {
        accepted?: boolean;
        evidenceId?: string;
        reason?: string;
      };

      if (response.ok && payload.accepted && typeof payload.evidenceId === "string") {
        return { status: "accepted", evidenceId: payload.evidenceId };
      }

      if (attempt === 0 && (response.status === 429 || response.status >= 500)) {
        continue;
      }

      return {
        status: "rejected",
        reason: typeof payload.reason === "string" ? payload.reason : "world-evidence-rejected",
        httpStatus: response.status
      };
    } catch {
      if (attempt === 0) continue;
      return { status: "network-error" };
    }
  }

  return { status: "network-error" };
}
