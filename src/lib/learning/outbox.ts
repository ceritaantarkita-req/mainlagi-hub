"use client";

import { getBrowserClient } from "@/lib/auth/supabase-client";
import { isSupabaseConfigured, syncLearningAttemptCloud } from "./cloud";
import type { LearningAnalyticsSnapshot, LearningAttemptRecord } from "./attempts";

const OUTBOX_KEY = "mainlagi-learning-cloud-outbox-v1";
const MAX_OUTBOX_ITEMS = 300;
const OUTBOX_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const RETRY_BASE_MS = 5_000;
const RETRY_MAX_MS = 5 * 60 * 1000;
const MAX_AUTO_RETRIES = 12;

export const LEARNING_OUTBOX_EVENT = "mainlagi-learning-outbox";

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

function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function readOutbox(): LearningOutboxItem[] {
  const target = storage();
  return target ? parseLearningOutbox(target.getItem(OUTBOX_KEY)) : [];
}

function writeOutbox(items: LearningOutboxItem[]): void {
  const target = storage();
  if (!target) return;
  target.setItem(OUTBOX_KEY, JSON.stringify(items.slice(-MAX_OUTBOX_ITEMS)));
}

async function cachedSessionUserId(): Promise<string | null> {
  const client = getBrowserClient();
  if (!client) return null;
  try {
    // getSession reads the existing browser session and does not require us to
    // persist an access token in the outbox. Only the account id is retained.
    const { data } = await client.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

function dispatchOutbox(result: LearningOutboxFlushResult, childId?: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LEARNING_OUTBOX_EVENT, {
    detail: { ...result, childId }
  }));
}

function summarize(items: readonly LearningOutboxItem[], ownerUserId: string): LearningOutboxFlushResult {
  const owned = items.filter((item) => item.ownerUserId === ownerUserId);
  return {
    synced: 0,
    pending: owned.filter((item) => !item.blocked).length,
    blocked: owned.filter((item) => item.blocked).length
  };
}

function upsertQueuedAttempt(
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

export async function syncOrQueueLearningAttempt(attempt: LearningAttemptRecord): Promise<"synced" | "queued" | "local_only"> {
  if (!isSupabaseConfigured()) return "local_only";
  const ownerUserId = await cachedSessionUserId();
  if (!ownerUserId) return "local_only";

  const synced = await syncLearningAttemptCloud(attempt);
  let items = readOutbox();
  const keyMatches = (item: LearningOutboxItem) => item.ownerUserId === ownerUserId && item.attempt.id === attempt.id;

  if (synced) {
    items = items.filter((item) => !keyMatches(item));
    writeOutbox(items);
    dispatchOutbox({ ...summarize(items, ownerUserId), synced: 1 }, attempt.childId);
    return "synced";
  }

  items = upsertQueuedAttempt(items, ownerUserId, attempt, new Date());
  writeOutbox(items);
  dispatchOutbox(summarize(items, ownerUserId), attempt.childId);
  return "queued";
}

let activeFlush: Promise<LearningOutboxFlushResult> | null = null;

export function flushLearningAttemptOutbox(options: { force?: boolean } = {}): Promise<LearningOutboxFlushResult> {
  if (activeFlush) return activeFlush;
  activeFlush = (async () => {
    const ownerUserId = await cachedSessionUserId();
    if (!ownerUserId || !isSupabaseConfigured()) return { synced: 0, pending: 0, blocked: 0 };

    let items = readOutbox();
    let syncedCount = 0;
    const nowMs = Date.now();
    const candidates = items.filter((item) => {
      if (item.ownerUserId !== ownerUserId || item.blocked) return false;
      if (options.force || !item.nextRetryAt) return true;
      const next = Date.parse(item.nextRetryAt);
      return !Number.isFinite(next) || next <= nowMs;
    });

    for (const candidate of candidates) {
      const synced = await syncLearningAttemptCloud(candidate.attempt);
      const keyMatches = (item: LearningOutboxItem) => item.ownerUserId === ownerUserId && item.attempt.id === candidate.attempt.id;
      if (synced) {
        items = items.filter((item) => !keyMatches(item));
        syncedCount += 1;
        continue;
      }

      items = items.map((item) => {
        if (!keyMatches(item)) return item;
        const retryCount = item.retryCount + 1;
        const blocked = retryCount >= MAX_AUTO_RETRIES;
        return {
          ...item,
          retryCount,
          blocked,
          updatedAt: new Date().toISOString(),
          nextRetryAt: blocked ? null : new Date(Date.now() + learningOutboxRetryDelayMs(retryCount)).toISOString()
        };
      });
    }

    writeOutbox(items);
    const summary = summarize(items, ownerUserId);
    const finalResult = { ...summary, synced: syncedCount };
    dispatchOutbox(finalResult);
    if (syncedCount > 0 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mainlagi-learning-cloud", { detail: {} }));
    }
    return finalResult;
  })().finally(() => {
    activeFlush = null;
  });
  return activeFlush;
}

export async function readPendingLearningAttemptsForCurrentUser(childId: string): Promise<LearningAttemptRecord[]> {
  const ownerUserId = await cachedSessionUserId();
  if (!ownerUserId) return [];
  return readOutbox()
    .filter((item) => item.ownerUserId === ownerUserId && !item.blocked && item.attempt.childId === childId)
    .map((item) => item.attempt)
    .sort((a, b) => Date.parse(a.completedAt) - Date.parse(b.completedAt));
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
