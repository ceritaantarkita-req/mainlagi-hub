import type { LearningAnalyticsSnapshot, LearningAttemptRecord } from "./attempts";

export const MAX_OUTBOX_ITEMS = 300;
export const OUTBOX_TTL_MS = 14 * 24 * 60 * 60 * 1000;
export const RETRY_BASE_MS = 5_000;
export const RETRY_MAX_MS = 5 * 60 * 1000;
export const MAX_AUTO_RETRIES = 12;

export interface LearningOutboxItem {
  ownerUserId: string;
  attempt: LearningAttemptRecord;
  queuedAt: string;
  updatedAt: string;
  retryCount: number;
  nextRetryAt: string | null;
  blocked: boolean;
}

export interface LearningOutboxFlushResult {
  synced: number;
  pending: number;
  blocked: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isAttempt(value: unknown): value is LearningAttemptRecord {
  if (!isRecord(value)) return false;
  return typeof value.id === "string"
    && typeof value.childId === "string"
    && typeof value.activityId === "string"
    && typeof value.subjectId === "string"
    && typeof value.stageId === "string"
    && typeof value.runtime === "string"
    && typeof value.completedAt === "string";
}

function validItem(value: unknown): LearningOutboxItem | null {
  if (!isRecord(value) || typeof value.ownerUserId !== "string" || !isAttempt(value.attempt)) return null;
  const queuedAt = typeof value.queuedAt === "string" ? value.queuedAt : value.attempt.completedAt;
  const updatedAt = typeof value.updatedAt === "string" ? value.updatedAt : queuedAt;
  const retryCount = Number.isFinite(value.retryCount) ? Math.max(0, Math.round(Number(value.retryCount))) : 0;
  const nextRetryAt = typeof value.nextRetryAt === "string" ? value.nextRetryAt : null;
  return {
    ownerUserId: value.ownerUserId,
    attempt: value.attempt,
    queuedAt,
    updatedAt,
    retryCount,
    nextRetryAt,
    blocked: value.blocked === true || retryCount >= MAX_AUTO_RETRIES
  };
}

export function parseLearningOutbox(raw: string | null, nowMs = Date.now()): LearningOutboxItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const cutoff = nowMs - OUTBOX_TTL_MS;
    return parsed
      .map(validItem)
      .filter((item): item is LearningOutboxItem => Boolean(item))
      .filter((item) => {
        const queuedAt = Date.parse(item.queuedAt);
        return !Number.isFinite(queuedAt) || queuedAt >= cutoff;
      })
      .slice(-MAX_OUTBOX_ITEMS);
  } catch {
    return [];
  }
}

export function learningOutboxRetryDelayMs(retryCount: number): number {
  return Math.min(RETRY_MAX_MS, RETRY_BASE_MS * (2 ** Math.min(8, Math.max(0, retryCount))));
}

export function summarizeLearningOutbox(
  items: readonly LearningOutboxItem[],
  ownerUserId: string
): LearningOutboxFlushResult {
  const owned = items.filter((item) => item.ownerUserId === ownerUserId);
  return {
    synced: 0,
    pending: owned.filter((item) => !item.blocked).length,
    blocked: owned.filter((item) => item.blocked).length
  };
}

export function upsertLearningOutboxAttempt(
  items: LearningOutboxItem[],
  ownerUserId: string,
  attempt: LearningAttemptRecord,
  now: Date
): LearningOutboxItem[] {
  const keyMatches = (item: LearningOutboxItem) => item.ownerUserId === ownerUserId && item.attempt.id === attempt.id;
  const existing = items.find(keyMatches);
  const next: LearningOutboxItem = existing
    ? { ...existing, attempt, updatedAt: now.toISOString() }
    : {
        ownerUserId,
        attempt,
        queuedAt: now.toISOString(),
        updatedAt: now.toISOString(),
        retryCount: 0,
        nextRetryAt: null,
        blocked: false
      };
  return [...items.filter((item) => !keyMatches(item)), next].slice(-MAX_OUTBOX_ITEMS);
}

export function overlayPendingLearningAnalytics(
  cloud: LearningAnalyticsSnapshot,
  pending: readonly LearningAttemptRecord[]
): LearningAnalyticsSnapshot {
  if (pending.length === 0) return cloud;
  const byId = new Map(cloud.attempts.map((attempt) => [attempt.id, attempt]));
  for (const attempt of pending) if (!byId.has(attempt.id)) byId.set(attempt.id, attempt);
  const attempts = [...byId.values()].sort((a, b) => Date.parse(a.completedAt) - Date.parse(b.completedAt));
  return {
    ...cloud,
    attempts,
    totalAttempts: attempts.length,
    assessedAttempts: attempts.filter((item) => item.assessed).length,
    practiceAttempts: attempts.filter((item) => !item.assessed).length,
    lastAttemptAt: attempts.at(-1)?.completedAt ?? null
  };
}
