"use client";

import { isSupabaseConfigured } from "@/lib/auth/supabase-auth";
import { getBrowserClient } from "@/lib/auth/supabase-client";
import { syncLearningAttemptCloud } from "./cloud";
import type { LearningAttemptRecord } from "./attempts";
import {
  MAX_AUTO_RETRIES,
  MAX_OUTBOX_ITEMS,
  learningOutboxRetryDelayMs,
  parseLearningOutbox,
  summarizeLearningOutbox,
  upsertLearningOutboxAttempt,
  type LearningOutboxFlushResult,
  type LearningOutboxItem
} from "./outboxCore";

export {
  learningOutboxRetryDelayMs,
  overlayPendingLearningAnalytics,
  parseLearningOutbox,
  summarizeLearningOutbox,
  upsertLearningOutboxAttempt,
  type LearningOutboxFlushResult,
  type LearningOutboxItem
} from "./outboxCore";

const OUTBOX_KEY = "mainlagi-learning-cloud-outbox-v1";
export const LEARNING_OUTBOX_EVENT = "mainlagi-learning-outbox";

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
    // The outbox stores only this stable account id, never the access token.
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
    dispatchOutbox({ ...summarizeLearningOutbox(items, ownerUserId), synced: 1 }, attempt.childId);
    return "synced";
  }

  items = upsertLearningOutboxAttempt(items, ownerUserId, attempt, new Date());
  writeOutbox(items);
  dispatchOutbox(summarizeLearningOutbox(items, ownerUserId), attempt.childId);
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
    const finalResult = { ...summarizeLearningOutbox(items, ownerUserId), synced: syncedCount };
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
