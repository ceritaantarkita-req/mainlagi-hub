"use client";

import {
  applyMechanicSessionEvent,
  createMechanicSession,
  finalizeReusableMechanicOutcome,
  type MechanicAssessmentMode,
  type MechanicSessionEvent,
  type MechanicSessionState,
  type ReusableMechanicId
} from "./mechanicLibrary";
import { emitLearningRuntimeMeasurement } from "./runtimeMeasurement";
import type { LearningAttemptOutcome } from "./mastery";

export interface ReusableMechanicRuntimeConfig {
  childId: string;
  activityId: string;
  mechanicId: ReusableMechanicId;
  assessment: MechanicAssessmentMode;
  startedAtMs?: number;
}

export interface ReusableMechanicRuntimeController {
  readonly config: ReusableMechanicRuntimeConfig;
  getState(): MechanicSessionState;
  dispatch(event: MechanicSessionEvent): MechanicSessionState;
  publish(completedAtMs?: number): LearningAttemptOutcome;
}

/**
 * Small client adapter used by future reusable mechanic UIs.
 *
 * The controller owns interaction counters only. `publish()` turns those
 * counters into the canonical outcome through mechanicLibrary and emits it
 * before the activity completion event, so LearningAttemptBridge consumes an
 * explicit measured outcome rather than DOM guessing.
 */
export function createReusableMechanicRuntime(
  config: ReusableMechanicRuntimeConfig
): ReusableMechanicRuntimeController {
  let state = createMechanicSession(config.startedAtMs);

  return {
    config,
    getState: () => ({ ...state }),
    dispatch(event) {
      state = applyMechanicSessionEvent(state, event);
      return { ...state };
    },
    publish(completedAtMs) {
      const outcome = finalizeReusableMechanicOutcome({
        mechanicId: config.mechanicId,
        assessment: config.assessment,
        state,
        completedAtMs
      });
      emitLearningRuntimeMeasurement({
        childId: config.childId,
        activityId: config.activityId,
        outcome
      });
      return outcome;
    }
  };
}
