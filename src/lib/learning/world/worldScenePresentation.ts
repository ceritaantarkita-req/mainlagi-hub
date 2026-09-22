import type { WorldSceneKind } from "./worldStructure";

export const WORLD_SCENE_PRESENTATION_VERSION = "world-scene-presentation-v1";

export type WorldSceneSurface =
  | "dialogue"
  | "activity"
  | "choice"
  | "recap"
  | "payoff";

export interface WorldScenePresentation {
  kind: WorldSceneKind;
  label: string;
  surface: WorldSceneSurface;
  showAmbientCompanions: boolean;
  emphasizeSceneTitle: boolean;
}

export const WORLD_SCENE_PRESENTATIONS: Readonly<Record<WorldSceneKind, WorldScenePresentation>> = {
  story: {
    kind: "story",
    label: "Cerita",
    surface: "dialogue",
    showAmbientCompanions: false,
    emphasizeSceneTitle: false
  },
  challenge: {
    kind: "challenge",
    label: "Tantangan",
    surface: "activity",
    showAmbientCompanions: true,
    emphasizeSceneTitle: true
  },
  choice: {
    kind: "choice",
    label: "Pilihanmu",
    surface: "choice",
    showAmbientCompanions: true,
    emphasizeSceneTitle: true
  },
  recap: {
    kind: "recap",
    label: "Kita ingat lagi",
    surface: "recap",
    showAmbientCompanions: true,
    emphasizeSceneTitle: true
  },
  closing: {
    kind: "closing",
    label: "Cerita berlanjut",
    surface: "payoff",
    showAmbientCompanions: false,
    emphasizeSceneTitle: false
  }
};

export function getWorldScenePresentation(kind: WorldSceneKind): WorldScenePresentation {
  return WORLD_SCENE_PRESENTATIONS[kind];
}

export function validateWorldScenePresentations(): { valid: boolean; errors: readonly string[] } {
  const errors: string[] = [];
  const kinds: WorldSceneKind[] = ["story", "challenge", "choice", "recap", "closing"];

  for (const kind of kinds) {
    const presentation = WORLD_SCENE_PRESENTATIONS[kind];
    if (!presentation) {
      errors.push("missing presentation for Scene kind: " + kind);
      continue;
    }
    if (presentation.kind !== kind) errors.push(kind + " presentation kind mismatch");
    if (!presentation.label.trim()) errors.push(kind + " presentation label is empty");
  }

  if (WORLD_SCENE_PRESENTATIONS.story.surface !== "dialogue") {
    errors.push("story Scene must use dialogue surface");
  }
  if (WORLD_SCENE_PRESENTATIONS.challenge.surface !== "activity") {
    errors.push("challenge Scene must use activity surface");
  }
  if (WORLD_SCENE_PRESENTATIONS.choice.surface !== "choice") {
    errors.push("choice Scene must use choice surface");
  }
  if (WORLD_SCENE_PRESENTATIONS.recap.surface !== "recap") {
    errors.push("recap Scene must use recap surface");
  }
  if (WORLD_SCENE_PRESENTATIONS.closing.surface !== "payoff") {
    errors.push("closing Scene must use payoff surface");
  }

  return { valid: errors.length === 0, errors };
}

export const WORLD_SCENE_PRESENTATION_VALIDATION = validateWorldScenePresentations();
