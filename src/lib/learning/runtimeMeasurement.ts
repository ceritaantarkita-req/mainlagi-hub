"use client";

import type { LearningAttemptOutcome } from "./attempts";

export const LEARNING_MEASUREMENT_EVENT = "mainlagi-learning-measurement";

export interface LearningRuntimeMeasurementDetail {
  childId: string;
  activityId: string;
  outcome: LearningAttemptOutcome;
}

/**
 * Runtime components that can measure their own result should publish it here
 * before calling completeActivity(). LearningAttemptBridge consumes the
 * explicit outcome and only falls back to DOM interaction inference for older
 * activities. This keeps scoring owned by the runtime that actually knows what
 * happened.
 */
export function emitLearningRuntimeMeasurement(detail: LearningRuntimeMeasurementDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<LearningRuntimeMeasurementDetail>(LEARNING_MEASUREMENT_EVENT, { detail }));
}
