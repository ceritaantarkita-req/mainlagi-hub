"use client";

import type { BelajarCharacterMoment } from "./characterPresentation";

export const LEARNING_CHARACTER_PRESENTATION_EVENT = "mainlagi-learning-character-presentation";

export interface LearningCharacterPresentationDetail {
  childId: string;
  activityId: string;
  moment: BelajarCharacterMoment;
}

export function emitLearningCharacterPresentation(
  detail: LearningCharacterPresentationDetail
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<LearningCharacterPresentationDetail>(
      LEARNING_CHARACTER_PRESENTATION_EVENT,
      { detail }
    )
  );
}
