import type { LearningActivity } from "./system";

export const THEMED_SUBJECT_IDS = [
  "bahasa",
  "english",
  "math",
  "iqro",
  "letters",
  "logic",
  "science",
  "color",
  "drawing"
] as const;

export type ThemedSubjectId = (typeof THEMED_SUBJECT_IDS)[number];
export type SceneAssetStatus = "candidate" | "approved";

export interface RuntimeSceneAssets {
  wideSrc: string;
  mobileSrc: string;
}

export interface SceneVariant {
  id: string;
  subjectId: ThemedSubjectId;
  label: string;
  candidateWideName: string;
  candidateMobileName: string;
  assetStatus: SceneAssetStatus;
  runtimeAssets: RuntimeSceneAssets | null;
  fallbackColor: string;
}

export interface SubjectTheme {
  subjectId: ThemedSubjectId;
  defaultSceneId: string;
  scenes: readonly SceneVariant[];
}

export interface ResolvedActivityVisualTheme {
  subjectId: ThemedSubjectId;
  scene: SceneVariant;
  source: "semantic-rule" | "deterministic-fallback";
}

type SceneDefinition = readonly [id: string, label: string, fallbackColor: string];

function candidateFileNames(subjectId: ThemedSubjectId, id: string): readonly [string, string] {
  if (subjectId === "math" || subjectId === "science") {
    return [`${subjectId}-scene-${id}-v1.png`, `${subjectId}-scene-${id}-mobile-v1.png`];
  }
  if (subjectId === "color") {
    return [`coloring-scene-${id}-wide-v1.png`, `coloring-scene-${id}-mobile-v1.png`];
  }
  if (subjectId === "letters") {
    return [`huruf-menulis-scene-${id}-wide-v1.png`, `huruf-menulis-scene-${id}-mobile-v1.png`];
  }
  if (subjectId === "drawing") {
    return [`menggambar-scene-${id}-wide-v1.png`, `menggambar-scene-${id}-mobile-v1.png`];
  }
  return [`${subjectId}-scene-${id}-wide-v1.png`, `${subjectId}-scene-${id}-mobile-v1.png`];
}

function approvedScene(
  subjectId: ThemedSubjectId,
  id: string,
  label: string,
  fallbackColor: string
): SceneVariant {
  const [candidateWideName, candidateMobileName] = candidateFileNames(subjectId, id);
  const assetFolder = subjectId === "color" ? "creative" : subjectId;
  return {
    id,
    subjectId,
    label,
    candidateWideName,
    candidateMobileName,
    assetStatus: "approved",
    runtimeAssets: {
      wideSrc: `/artwork/backgrounds/${assetFolder}/${id}-wide.webp`,
      mobileSrc: `/artwork/backgrounds/${assetFolder}/${id}-mobile.webp`
    },
    fallbackColor
  };
}

function buildScenes(subjectId: ThemedSubjectId, definitions: readonly SceneDefinition[]): readonly SceneVariant[] {
  return definitions.map(([id, label, fallbackColor]) => approvedScene(subjectId, id, label, fallbackColor));
}

const MATH_SCENES = buildScenes("math", [
  ["number-park", "Number Park", "#d8eff8"],
  ["playground-park", "Playground Park", "#d9f0f5"],
  ["mini-market", "Mini Market", "#e4f2dc"],
  ["shape-playground", "Shape Playground", "#dff0f3"],
  ["block-yard", "Block Yard", "#e7f0dd"],
  ["measurement-workshop", "Measurement Workshop", "#e8f0e4"]
]);

const SCIENCE_SCENES = buildScenes("science", [
  ["garden-lab", "Garden Lab", "#d9eff5"],
  ["pond", "Pond", "#d7eff5"],
  ["weather-meadow", "Weather Meadow", "#dbeff6"],
  ["greenhouse", "Greenhouse", "#def1e5"],
  ["nature-trail", "Nature Trail", "#dcefe1"],
  ["material-workshop", "Material Workshop", "#e5efe7"]
]);

const BAHASA_SCENES = buildScenes("bahasa", [
  ["letter-garden", "Letter Garden", "#e3f4e9"],
  ["sound-garden", "Sound Garden", "#dff2ec"],
  ["word-playground", "Word Playground", "#e8f2df"],
  ["village-market", "Village Market", "#f3ead8"],
  ["reading-garden", "Reading Garden", "#e7f3e4"],
  ["story-garden", "Story Garden", "#f2e8dc"]
]);

const ENGLISH_SCENES = buildScenes("english", [
  ["seaside-learning-cove", "Seaside Learning Cove", "#dff2f6"],
  ["phonics-cove", "Phonics Cove", "#e0f0f5"],
  ["beach-playground", "Beach Playground", "#e5f3ec"],
  ["beach-market", "Beach Market", "#f4ecd9"],
  ["seaside-reading-nook", "Seaside Reading Nook", "#e5eff0"],
  ["storybook-beach", "Storybook Beach", "#eee8df"]
]);

const IQRO_SCENES = buildScenes("iqro", [
  ["mosque-courtyard-01", "Mosque Courtyard 1", "#e6f2ec"],
  ["mosque-courtyard-02", "Mosque Courtyard 2", "#e3f1ec"],
  ["mosque-courtyard-03", "Mosque Courtyard 3", "#e9f2e9"],
  ["mosque-library-04", "Mosque Library", "#eee9df"],
  ["mosque-courtyard-05", "Mosque Courtyard 5", "#e5f0e8"],
  ["mosque-study-06", "Mosque Study Room", "#eee9e1"]
]);

const LOGIC_SCENES = buildScenes("logic", [
  ["space-observatory-01", "Space Observatory", "#e8edf4"],
  ["space-observation-deck-02", "Space Observation Deck", "#e5edf3"],
  ["space-under-stars-03", "Space Under Stars", "#e8ebf3"],
  ["space-maze-04", "Space Maze Room", "#e6edf2"],
  ["space-playroom-05", "Space Playroom", "#e9eef4"],
  ["space-workshop-06", "Space Workshop", "#e8edf1"]
]);

const COLOR_SCENES = buildScenes("color", [
  ["art-gallery-01", "Art Gallery 1", "#f3ede4"],
  ["art-gallery-02", "Art Gallery 2", "#f4eee6"],
  ["art-gallery-03", "Art Gallery 3", "#efece5"],
  ["art-gallery-04", "Art Gallery 4", "#f1ede5"],
  ["art-gallery-05", "Art Gallery 5", "#f2ece4"],
  ["art-gallery-06", "Art Gallery 6", "#f0ece6"]
]);

const LETTERS_SCENES = buildScenes("letters", [
  ["city-plaza-01", "City Plaza", "#e7eff1"],
  ["alphabet-city-02", "Alphabet City", "#e9eff2"],
  ["library-plaza-03", "Library Plaza", "#ecebe4"],
  ["mail-town-04", "Mail Town", "#edf0e6"],
  ["notebook-park-05", "Notebook Park", "#e8f0e7"],
  ["storybook-town-06", "Storybook Town", "#eee9e1"]
]);

const DRAWING_SCENES = buildScenes("drawing", [
  ["meadow-art-01", "Meadow Art", "#e6f1e5"],
  ["woodland-art-02", "Woodland Art", "#e4efe5"],
  ["garden-art-03", "Garden Art", "#e8f2e6"],
  ["lakeside-art-04", "Lakeside Art", "#e4f0ee"],
  ["meadow-activity-05", "Meadow Activity", "#e7f1e5"],
  ["mountain-art-06", "Mountain Art", "#e8eeea"]
]);

export const SUBJECT_THEMES: Readonly<Record<ThemedSubjectId, SubjectTheme>> = {
  bahasa: { subjectId: "bahasa", defaultSceneId: "word-playground", scenes: BAHASA_SCENES },
  english: { subjectId: "english", defaultSceneId: "seaside-learning-cove", scenes: ENGLISH_SCENES },
  math: { subjectId: "math", defaultSceneId: "playground-park", scenes: MATH_SCENES },
  iqro: { subjectId: "iqro", defaultSceneId: "mosque-courtyard-01", scenes: IQRO_SCENES },
  letters: { subjectId: "letters", defaultSceneId: "city-plaza-01", scenes: LETTERS_SCENES },
  logic: { subjectId: "logic", defaultSceneId: "space-observatory-01", scenes: LOGIC_SCENES },
  science: { subjectId: "science", defaultSceneId: "garden-lab", scenes: SCIENCE_SCENES },
  color: { subjectId: "color", defaultSceneId: "art-gallery-01", scenes: COLOR_SCENES },
  drawing: { subjectId: "drawing", defaultSceneId: "meadow-art-01", scenes: DRAWING_SCENES }
};

type SemanticRule = {
  sceneId: string;
  activityIdParts: readonly string[];
};

const RULES: Readonly<Record<ThemedSubjectId, readonly SemanticRule[]>> = {
  math: [
    { sceneId: "measurement-workshop", activityIdParts: ["measure", "length", "size", "compare-properties"] },
    { sceneId: "shape-playground", activityIdParts: ["shape", "pattern", "spatial"] },
    { sceneId: "block-yard", activityIdParts: ["group", "equal", "set"] },
    { sceneId: "mini-market", activityIdParts: ["problem", "add", "sub", "mixed", "total", "take-away"] },
    { sceneId: "number-park", activityIdParts: ["recognize", "count", "subitize", "missing", "order", "number", "quantity", "line"] }
  ],
  science: [
    { sceneId: "material-workshop", activityIdParts: ["material", "measure", "force"] },
    { sceneId: "weather-meadow", activityIdParts: ["weather", "earth", "env", "rain", "sun", "cloud"] },
    { sceneId: "pond", activityIdParts: ["water", "fish", "frog", "ice"] },
    { sceneId: "greenhouse", activityIdParts: ["plant", "seed", "sprout", "growth", "cycle", "root"] },
    { sceneId: "nature-trail", activityIdParts: ["animal", "living", "feature", "eco", "bird", "duck", "cactus", "habitat"] },
    { sceneId: "garden-lab", activityIdParts: ["investigate", "evidence", "observe", "sense", "body", "health"] }
  ],
  bahasa: [
    { sceneId: "story-garden", activityIdParts: ["cerita", "story", "tokoh", "kejadian", "urutan"] },
    { sceneId: "reading-garden", activityIdParts: ["baca", "reading", "kalimat", "sentence", "teks", "passage", "lengkap"] },
    { sceneId: "village-market", activityIdParts: ["pasar", "market", "belanja", "kategori", "category"] },
    { sceneId: "word-playground", activityIdParts: ["kata", "word", "suku", "syllable", "pasang", "match"] },
    { sceneId: "sound-garden", activityIdParts: ["bunyi", "sound", "dengar", "awal", "initial", "rima"] },
    { sceneId: "letter-garden", activityIdParts: ["huruf", "letter", "cari", "find", "alphabet"] }
  ],
  english: [
    { sceneId: "storybook-beach", activityIdParts: ["story", "sentence", "cloze", "complete", "phrase"] },
    { sceneId: "seaside-reading-nook", activityIdParts: ["read", "reading", "book", "text"] },
    { sceneId: "beach-market", activityIdParts: ["food", "fruit", "market", "shop", "apple"] },
    { sceneId: "beach-playground", activityIdParts: ["action", "play", "move", "run", "jump", "family"] },
    { sceneId: "phonics-cove", activityIdParts: ["sound", "phonics", "letter", "initial"] },
    { sceneId: "seaside-learning-cove", activityIdParts: ["find", "word", "match", "hello", "color"] }
  ],
  iqro: [
    { sceneId: "mosque-study-06", activityIdParts: ["trace", "write", "harakat", "tanwin", "sukun", "mad", "read"] },
    { sceneId: "mosque-library-04", activityIdParts: ["match", "pasang", "group", "sort"] },
    { sceneId: "mosque-courtyard-05", activityIdParts: ["listen", "dengar", "sound"] },
    { sceneId: "mosque-courtyard-03", activityIdParts: ["middle", "tengah", "akhir", "final"] },
    { sceneId: "mosque-courtyard-02", activityIdParts: ["awal", "initial", "begin"] },
    { sceneId: "mosque-courtyard-01", activityIdParts: ["find", "cari", "recognize", "kenal"] }
  ],
  logic: [
    { sceneId: "space-maze-04", activityIdParts: ["maze", "path", "route", "sequence", "order", "spatial", "relative"] },
    { sceneId: "space-playroom-05", activityIdParts: ["odd", "different", "class", "sort", "group", "set", "elimination"] },
    { sceneId: "space-workshop-06", activityIdParts: ["rule", "pipeline", "build", "apply", "transform"] },
    { sceneId: "space-observation-deck-02", activityIdParts: ["compare", "relation", "more", "less", "transitive"] },
    { sceneId: "space-under-stars-03", activityIdParts: ["pattern", "repeat", "complete"] },
    { sceneId: "space-observatory-01", activityIdParts: ["match", "pair", "memory"] }
  ],
  letters: [
    { sceneId: "alphabet-city-02", activityIdParts: ["find", "letter", "alphabet", "case", "recognize"] },
    { sceneId: "notebook-park-05", activityIdParts: ["trace", "write", "stroke", "line"] },
    { sceneId: "library-plaza-03", activityIdParts: ["match", "word", "sound", "initial"] },
    { sceneId: "mail-town-04", activityIdParts: ["copy", "name", "label"] },
    { sceneId: "storybook-town-06", activityIdParts: ["sentence", "story"] },
    { sceneId: "city-plaza-01", activityIdParts: ["shape", "curve", "circle"] }
  ],
  color: [
    { sceneId: "art-gallery-01", activityIdParts: ["gavi", "cat", "animal"] },
    { sceneId: "art-gallery-02", activityIdParts: ["paca", "robot"] },
    { sceneId: "art-gallery-03", activityIdParts: ["plant", "flower", "leaf", "tree"] },
    { sceneId: "art-gallery-04", activityIdParts: ["house", "home", "room"] },
    { sceneId: "art-gallery-05", activityIdParts: ["vehicle", "car", "boat"] },
    { sceneId: "art-gallery-06", activityIdParts: ["scene", "pattern", "shape"] }
  ],
  drawing: [
    { sceneId: "meadow-activity-05", activityIdParts: ["line", "path", "stroke", "dot"] },
    { sceneId: "garden-art-03", activityIdParts: ["shape", "circle", "square", "triangle"] },
    { sceneId: "woodland-art-02", activityIdParts: ["object", "animal", "tree", "flower"] },
    { sceneId: "lakeside-art-04", activityIdParts: ["scene", "landscape", "boat", "water"] },
    { sceneId: "mountain-art-06", activityIdParts: ["character", "design", "map", "imagination", "creative"] },
    { sceneId: "meadow-art-01", activityIdParts: ["draw", "free", "simple"] }
  ]
};

function isThemedSubjectId(value: string): value is ThemedSubjectId {
  return (THEMED_SUBJECT_IDS as readonly string[]).includes(value);
}

function sceneById(theme: SubjectTheme, sceneId: string): SceneVariant {
  const scene = theme.scenes.find((candidate) => candidate.id === sceneId)
    ?? theme.scenes.find((candidate) => candidate.id === theme.defaultSceneId)
    ?? theme.scenes[0];
  if (!scene) throw new Error(`Subject theme ${theme.subjectId} has no scene variants`);
  return scene;
}

function semanticSceneId(activity: LearningActivity, subjectId: ThemedSubjectId): string | null {
  const normalizedId = activity.id.toLowerCase();
  const rule = RULES[subjectId].find((candidate) =>
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
  if (!activity || !isThemedSubjectId(String(activity.subjectId))) {
    return null;
  }

  const subjectId = activity.subjectId as ThemedSubjectId;
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
