import type { LearningActivity } from "./system";

export type PilotSubjectId = "math" | "science";

export type MathSceneId =
  | "number-park"
  | "playground-park"
  | "mini-market"
  | "shape-playground"
  | "block-yard"
  | "measurement-workshop";

export type ScienceSceneId =
  | "garden-lab"
  | "pond"
  | "weather-meadow"
  | "greenhouse"
  | "nature-trail"
  | "material-workshop";

export type SceneId = MathSceneId | ScienceSceneId;
export type SceneAssetStatus = "candidate" | "approved";

export interface RuntimeSceneAssets {
  wideSrc: string;
  mobileSrc: string;
}

export interface SceneVariant {
  id: SceneId;
  subjectId: PilotSubjectId;
  label: string;
  candidateWideName: string;
  candidateMobileName: string;
  assetStatus: SceneAssetStatus;
  runtimeAssets: RuntimeSceneAssets | null;
  fallbackColor: string;
}

export interface SubjectTheme {
  subjectId: PilotSubjectId;
  defaultSceneId: SceneId;
  scenes: readonly SceneVariant[];
}

export interface ResolvedActivityVisualTheme {
  subjectId: PilotSubjectId;
  scene: SceneVariant;
  source: "semantic-rule" | "deterministic-fallback";
}

function candidateScene(
  subjectId: PilotSubjectId,
  id: SceneId,
  label: string,
  fallbackColor: string
): SceneVariant {
  const prefix = subjectId === "math" ? "math" : "science";
  return {
    id,
    subjectId,
    label,
    candidateWideName: `${prefix}-scene-${id}-v1.png`,
    candidateMobileName: `${prefix}-scene-${id}-mobile-v1.png`,
    assetStatus: "candidate",
    runtimeAssets: null,
    fallbackColor
  };
}

const MATH_SCENES = [
  candidateScene("math", "number-park", "Number Park", "#d8eff8"),
  candidateScene("math", "playground-park", "Playground Park", "#d9f0f5"),
  candidateScene("math", "mini-market", "Mini Market", "#e4f2dc"),
  candidateScene("math", "shape-playground", "Shape Playground", "#dff0f3"),
  candidateScene("math", "block-yard", "Block Yard", "#e7f0dd"),
  candidateScene("math", "measurement-workshop", "Measurement Workshop", "#e8f0e4")
] as const satisfies readonly SceneVariant[];

const SCIENCE_SCENES = [
  candidateScene("science", "garden-lab", "Garden Lab", "#d9eff5"),
  candidateScene("science", "pond", "Pond", "#d7eff5"),
  candidateScene("science", "weather-meadow", "Weather Meadow", "#dbeff6"),
  candidateScene("science", "greenhouse", "Greenhouse", "#def1e5"),
  candidateScene("science", "nature-trail", "Nature Trail", "#dcefe1"),
  candidateScene("science", "material-workshop", "Material Workshop", "#e5efe7")
] as const satisfies readonly SceneVariant[];

export const SUBJECT_THEMES: Readonly<Record<PilotSubjectId, SubjectTheme>> = {
  math: {
    subjectId: "math",
    defaultSceneId: "playground-park",
    scenes: MATH_SCENES
  },
  science: {
    subjectId: "science",
    defaultSceneId: "garden-lab",
    scenes: SCIENCE_SCENES
  }
};

type SemanticRule = {
  sceneId: SceneId;
  activityIdParts: readonly string[];
};

const MATH_RULES: readonly SemanticRule[] = [
  { sceneId: "measurement-workshop", activityIdParts: ["measure", "length", "size"] },
  { sceneId: "shape-playground", activityIdParts: ["shape", "pattern", "spatial"] },
  { sceneId: "block-yard", activityIdParts: ["group", "equal"] },
  { sceneId: "mini-market", activityIdParts: ["problem", "add", "sub", "mixed"] },
  { sceneId: "number-park", activityIdParts: ["recognize", "count", "subitize", "missing", "order", "number", "quantity"] }
];

const SCIENCE_RULES: readonly SemanticRule[] = [
  { sceneId: "material-workshop", activityIdParts: ["material", "measure", "force"] },
  { sceneId: "weather-meadow", activityIdParts: ["weather", "earth", "env"] },
  { sceneId: "pond", activityIdParts: ["water", "fish", "frog"] },
  { sceneId: "greenhouse", activityIdParts: ["plant", "seed", "sprout", "cycle"] },
  { sceneId: "nature-trail", activityIdParts: ["animal", "living", "feature", "eco", "bird", "duck", "cactus"] },
  { sceneId: "garden-lab", activityIdParts: ["investigate", "evidence", "observe", "sense", "body"] }
];

function sceneById(theme: SubjectTheme, sceneId: SceneId): SceneVariant {
  const scene = theme.scenes.find((candidate) => candidate.id === sceneId)
    ?? theme.scenes.find((candidate) => candidate.id === theme.defaultSceneId)
    ?? theme.scenes[0];
  if (!scene) throw new Error(`Subject theme ${theme.subjectId} has no scene variants`);
  return scene;
}

function semanticSceneId(activity: LearningActivity, subjectId: PilotSubjectId): SceneId | null {
  const rules = subjectId === "math" ? MATH_RULES : SCIENCE_RULES;

  const normalizedId = activity.id.toLowerCase();
  const rule = rules.find((candidate) =>
    candidate.activityIdParts.some((part) => normalizedId.includes(part))
  );
  return rule?.sceneId ?? null;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Presentation-only resolver. It must never inspect choices/correctChoice or
 * alter curriculum, evidence, progression, mastery, or activity identity.
 */
export function resolveActivityVisualTheme(
  activity: LearningActivity | undefined
): ResolvedActivityVisualTheme | null {
  if (!activity || (activity.subjectId !== "math" && activity.subjectId !== "science")) {
    return null;
  }

  const subjectId: PilotSubjectId = activity.subjectId === "math" ? "math" : "science";
  const theme = SUBJECT_THEMES[subjectId];
  const matchedSceneId = semanticSceneId(activity, subjectId);

  if (matchedSceneId) {
    return {
      subjectId,
      scene: sceneById(theme, matchedSceneId),
      source: "semantic-rule"
    };
  }

  const fallbackIndex = stableHash(`${subjectId}:${activity.stageId}:${activity.id}`) % theme.scenes.length;
  return {
    subjectId,
    scene: theme.scenes[fallbackIndex],
    source: "deterministic-fallback"
  };
}
