import type { LearningSkillDefinition } from "./catalog";
import type { ContentPackDefinition } from "./contentManifest";
import type { LearningActivity, LearningStage } from "./system";

export type EnglishBatch9SkillDefinition = LearningSkillDefinition;

export interface EnglishBatch9LessonCore {
  id: string;
  subjectId: "english";
  pathId: "english-first-steps";
  stageId: string;
  title: string;
  objective: string;
  ageMin: number;
  ageMax: number;
}

export interface EnglishBatch9PackMeta {
  id: string;
  title: string;
  lessonId: string;
  ageMin: number;
  ageMax: number;
}

type EnglishBatch9Kind = "choice" | "listen" | "matching";

interface EnglishBatch9SeedBase {
  kind: EnglishBatch9Kind;
  id: string;
  packId: string;
  lessonId: string;
  title: string;
  description: string;
  emoji: string;
  ageMin: number;
  ageMax: number;
  difficulty: 1 | 2 | 3;
  requiredForStage: boolean;
  skillId: string;
  prompt: string;
}

export interface EnglishBatch9ChoiceSeed extends EnglishBatch9SeedBase {
  kind: "choice" | "listen";
  choices: string[];
  correctChoice: string;
}

export interface EnglishBatch9MatchingSeed extends EnglishBatch9SeedBase {
  kind: "matching";
  matchItems: Array<{ label: string; pair: string }>;
}

export type EnglishBatch9ActivitySeed = EnglishBatch9ChoiceSeed | EnglishBatch9MatchingSeed;

export interface EnglishBatch9WaveDefinition {
  wave: "A" | "B" | "C" | "D";
  stage: Omit<LearningStage, "activityIds">;
  lessons: EnglishBatch9LessonCore[];
  packs: EnglishBatch9PackMeta[];
  skills: EnglishBatch9SkillDefinition[];
  activities: EnglishBatch9ActivitySeed[];
}

export interface MaterializedEnglishBatch9Wave {
  stage: LearningStage;
  lessons: EnglishBatch9LessonCore[];
  packs: ContentPackDefinition[];
  skills: EnglishBatch9SkillDefinition[];
  activities: LearningActivity[];
}

export function materializeEnglishBatch9Wave(definition: EnglishBatch9WaveDefinition): MaterializedEnglishBatch9Wave {
  const packById = new Map(definition.packs.map((pack) => [pack.id, pack]));

  const activities: LearningActivity[] = definition.activities.map((seed) => ({
    id: seed.id,
    subjectId: "english",
    stageId: definition.stage.id,
    title: seed.title,
    description: seed.description,
    emoji: seed.emoji,
    runtime: seed.kind === "matching" ? "matching" : seed.kind === "listen" ? "listen_and_choose" : "tap_choice",
    ageMin: seed.ageMin,
    ageMax: seed.ageMax,
    preferredMobile: seed.kind === "listen" ? "audio" : "touch",
    inputModes: seed.kind === "listen" ? ["audio", "touch"] : ["touch"],
    motionOptional: false,
    stars: seed.difficulty === 1 ? 2 : 3,
    prompt: seed.prompt,
    ...(seed.kind === "matching"
      ? { matchItems: seed.matchItems.map((item) => ({ ...item })) }
      : { choices: [...seed.choices], correctChoice: seed.correctChoice })
  }));

  const packs: ContentPackDefinition[] = definition.packs.map((packMeta) => {
    const seeds = definition.activities.filter((seed) => seed.packId === packMeta.id);
    if (!seeds.length) throw new Error(`Batch 9 ${definition.wave}: empty English pack ${packMeta.id}`);
    if (seeds.some((seed) => seed.lessonId !== packMeta.lessonId)) {
      throw new Error(`Batch 9 ${definition.wave}: pack ${packMeta.id} spans more than one lesson`);
    }
    return {
      id: packMeta.id,
      version: "1.0.0",
      subjectId: "english",
      pathId: "english-first-steps",
      stageId: definition.stage.id,
      title: packMeta.title,
      ageMin: packMeta.ageMin,
      ageMax: packMeta.ageMax,
      reviewStatus: "internal",
      activities: seeds.map((seed) => ({
        localId: seed.id.replace(/^english-/, ""),
        activityId: seed.id,
        lessonId: seed.lessonId,
        mechanicId: seed.kind === "matching" ? "matching" : seed.kind === "listen" ? "listen_and_choose" : "tap_choice",
        difficulty: seed.difficulty,
        assessment: "assessed",
        requiredForStage: seed.requiredForStage,
        evidenceContractId: seed.kind === "matching" ? "matching_accuracy_v1" : "choice_accuracy_v1",
        skills: [{ skillId: seed.skillId, weight: 1 }]
      }))
    };
  });

  for (const seed of definition.activities) {
    if (!packById.has(seed.packId)) throw new Error(`Batch 9 ${definition.wave}: ${seed.id} references unknown pack ${seed.packId}`);
    if (!definition.lessons.some((lesson) => lesson.id === seed.lessonId)) throw new Error(`Batch 9 ${definition.wave}: ${seed.id} references unknown lesson ${seed.lessonId}`);
    if (!definition.skills.some((skill) => skill.id === seed.skillId)) throw new Error(`Batch 9 ${definition.wave}: ${seed.id} references unknown skill ${seed.skillId}`);
  }

  return {
    stage: { ...definition.stage, activityIds: definition.activities.map((seed) => seed.id) },
    lessons: definition.lessons.map((lesson) => ({ ...lesson })),
    packs,
    skills: definition.skills.map((skill) => ({ ...skill })),
    activities
  };
}
