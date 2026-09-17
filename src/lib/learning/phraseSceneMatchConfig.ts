import type { LearningActivity } from "./system";

export type PhraseSceneFeatureKind = "color" | "quantity" | "size" | "noun";
export type PhraseSceneNoun = "ball" | "book" | "cat" | "dog" | "banana" | "apple";
export type PhraseSceneColor = "red" | "blue" | "green" | "yellow";
export type PhraseSceneSize = "small" | "big";

export type PhraseSceneVisual = {
  label: string;
  noun: PhraseSceneNoun;
  quantity: 1 | 2 | 3;
  color?: PhraseSceneColor;
  size?: PhraseSceneSize;
  accessibleLabel: string;
};

export type PhraseSceneMatchConfig = {
  targetPhrase: string;
  featureKinds: PhraseSceneFeatureKind[];
  expectedPrompt: string;
  expectedChoices: [string, string, string];
  expectedCorrectChoice: string;
  scenes: [PhraseSceneVisual, PhraseSceneVisual, PhraseSceneVisual];
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, PhraseSceneMatchConfig> = {
  "english-phrase-red-ball": {
    targetPhrase: "A RED BALL",
    featureKinds: ["color", "noun", "quantity"],
    expectedPrompt: "Which picture matches A RED BALL?",
    expectedChoices: ["🔴⚽", "🔵⚽", "🔴📘"],
    expectedCorrectChoice: "🔴⚽",
    scenes: [
      { label: "🔴⚽", noun: "ball", quantity: 1, color: "red", accessibleLabel: "one red ball" },
      { label: "🔵⚽", noun: "ball", quantity: 1, color: "blue", accessibleLabel: "one blue ball" },
      { label: "🔴📘", noun: "book", quantity: 1, color: "red", accessibleLabel: "one red book" }
    ],
    cue: "Cocokkan warna dan bendanya.",
    successText: "A RED BALL cocok dengan satu bola merah."
  },
  "english-phrase-two-books": {
    targetPhrase: "TWO BOOKS",
    featureKinds: ["quantity", "noun"],
    expectedPrompt: "Which choice shows TWO BOOKS?",
    expectedChoices: ["📘", "📘📘", "📘📘📘"],
    expectedCorrectChoice: "📘📘",
    scenes: [
      { label: "📘", noun: "book", quantity: 1, accessibleLabel: "one book" },
      { label: "📘📘", noun: "book", quantity: 2, accessibleLabel: "two books" },
      { label: "📘📘📘", noun: "book", quantity: 3, accessibleLabel: "three books" }
    ],
    cue: "Hitung jumlah bukunya, lalu cocokkan dengan frasa.",
    successText: "TWO BOOKS berarti dua buku."
  },
  "english-phrase-small-cat": {
    targetPhrase: "A SMALL CAT",
    featureKinds: ["size", "noun", "quantity"],
    expectedPrompt: "Which phrase means a small cat?",
    expectedChoices: ["A SMALL CAT", "A BIG DOG", "TWO CATS"],
    expectedCorrectChoice: "A SMALL CAT",
    scenes: [
      { label: "A SMALL CAT", noun: "cat", quantity: 1, size: "small", accessibleLabel: "one small cat" },
      { label: "A BIG DOG", noun: "dog", quantity: 1, size: "big", accessibleLabel: "one big dog" },
      { label: "TWO CATS", noun: "cat", quantity: 2, accessibleLabel: "two cats" }
    ],
    cue: "Perhatikan ukuran, jumlah, dan hewannya.",
    successText: "A SMALL CAT berarti satu kucing kecil."
  },
  "english-phrase-yellow-banana": {
    targetPhrase: "A YELLOW BANANA",
    featureKinds: ["color", "noun", "quantity"],
    expectedPrompt: "Which phrase matches 🍌?",
    expectedChoices: ["A GREEN APPLE", "A YELLOW BANANA", "A RED BALL"],
    expectedCorrectChoice: "A YELLOW BANANA",
    scenes: [
      { label: "A GREEN APPLE", noun: "apple", quantity: 1, color: "green", accessibleLabel: "one green apple" },
      { label: "A YELLOW BANANA", noun: "banana", quantity: 1, color: "yellow", accessibleLabel: "one yellow banana" },
      { label: "A RED BALL", noun: "ball", quantity: 1, color: "red", accessibleLabel: "one red ball" }
    ],
    cue: "Cocokkan warna dan bendanya dengan gambar pada pertanyaan.",
    successText: "A YELLOW BANANA cocok dengan satu pisang kuning."
  }
};

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sceneMatchesTarget(config: PhraseSceneMatchConfig, scene: PhraseSceneVisual): boolean {
  const correctScene = config.scenes.find((item) => item.label === config.expectedCorrectChoice);
  if (!correctScene) return false;
  return config.featureKinds.every((kind) => {
    if (kind === "noun") return scene.noun === correctScene.noun;
    if (kind === "quantity") return scene.quantity === correctScene.quantity;
    if (kind === "color") return scene.color === correctScene.color;
    return scene.size === correctScene.size;
  });
}

export function phraseSceneMatchConfig(activity: LearningActivity | undefined): PhraseSceneMatchConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "english" || activity.stageId !== "english-phrases-review" || activity.runtime !== "tap_choice") return null;

  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  if (activity.prompt !== config.expectedPrompt) return null;
  if (!sameStrings(choices, config.expectedChoices)) return null;
  if (activity.correctChoice !== config.expectedCorrectChoice) return null;
  if (new Set(choices).size !== 3 || !choices.includes(config.expectedCorrectChoice)) return null;
  if (config.scenes.length !== 3 || !sameStrings(config.scenes.map((scene) => scene.label), choices)) return null;
  if (new Set(config.featureKinds).size !== config.featureKinds.length || !config.featureKinds.includes("noun")) return null;
  if (config.scenes.some((scene) => scene.quantity < 1 || scene.quantity > 3 || !scene.accessibleLabel)) return null;

  const correctScene = config.scenes.find((scene) => scene.label === config.expectedCorrectChoice);
  if (!correctScene || !sceneMatchesTarget(config, correctScene)) return null;
  if (config.scenes.filter((scene) => sceneMatchesTarget(config, scene)).length !== 1) return null;
  if (!config.targetPhrase || !config.cue || !config.successText) return null;

  return config;
}

export function isPhraseSceneMatchActivity(activity: LearningActivity | undefined): boolean {
  return phraseSceneMatchConfig(activity) !== null;
}
