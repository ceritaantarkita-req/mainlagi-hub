import type { LearningSkillDefinition } from "./catalog";
import type { ContentPackDefinition } from "./contentManifest";
import type { LearningActivity, LearningStage } from "./system";

export type BahasaBatch8SkillDefinition = LearningSkillDefinition;

export interface BahasaBatch8LessonCore {
  id: string;
  subjectId: "bahasa";
  pathId: "bahasa-fondasi-literasi";
  stageId: string;
  title: string;
  objective: string;
  ageMin: number;
  ageMax: number;
}

export interface BahasaBatch8PackMeta {
  id: string;
  title: string;
  lessonId: string;
  ageMin: number;
  ageMax: number;
}

type BahasaBatch8Kind = "choice" | "listen" | "matching";

interface BahasaBatch8SeedBase {
  kind: BahasaBatch8Kind;
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

export interface BahasaBatch8ChoiceSeed extends BahasaBatch8SeedBase {
  kind: "choice" | "listen";
  choices: string[];
  correctChoice: string;
}

export interface BahasaBatch8MatchingSeed extends BahasaBatch8SeedBase {
  kind: "matching";
  matchItems: Array<{ label: string; pair: string }>;
}

export type BahasaBatch8ActivitySeed = BahasaBatch8ChoiceSeed | BahasaBatch8MatchingSeed;

export interface BahasaBatch8WaveDefinition {
  wave: "A" | "B" | "C" | "D";
  stage: Omit<LearningStage, "activityIds">;
  lessons: BahasaBatch8LessonCore[];
  packs: BahasaBatch8PackMeta[];
  skills: BahasaBatch8SkillDefinition[];
  activities: BahasaBatch8ActivitySeed[];
}

export interface MaterializedBahasaBatch8Wave {
  stage: LearningStage;
  lessons: BahasaBatch8LessonCore[];
  packs: ContentPackDefinition[];
  skills: BahasaBatch8SkillDefinition[];
  activities: LearningActivity[];
}

export function materializeBahasaBatch8Wave(definition: BahasaBatch8WaveDefinition): MaterializedBahasaBatch8Wave {
  const packById = new Map(definition.packs.map((pack) => [pack.id, pack]));

  const activities: LearningActivity[] = definition.activities.map((seed) => ({
    id: seed.id,
    subjectId: "bahasa",
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
    if (!seeds.length) throw new Error(`Batch 8 ${definition.wave}: empty Bahasa pack ${packMeta.id}`);
    if (seeds.some((seed) => seed.lessonId !== packMeta.lessonId)) {
      throw new Error(`Batch 8 ${definition.wave}: pack ${packMeta.id} spans more than one lesson`);
    }
    return {
      id: packMeta.id,
      version: "1.0.0",
      subjectId: "bahasa",
      pathId: "bahasa-fondasi-literasi",
      stageId: definition.stage.id,
      title: packMeta.title,
      ageMin: packMeta.ageMin,
      ageMax: packMeta.ageMax,
      reviewStatus: "internal",
      activities: seeds.map((seed) => ({
        localId: seed.id.replace(/^bahasa-/, ""),
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
    if (!packById.has(seed.packId)) throw new Error(`Batch 8 ${definition.wave}: ${seed.id} references unknown pack ${seed.packId}`);
    if (!definition.lessons.some((lesson) => lesson.id === seed.lessonId)) throw new Error(`Batch 8 ${definition.wave}: ${seed.id} references unknown lesson ${seed.lessonId}`);
    if (!definition.skills.some((skill) => skill.id === seed.skillId)) throw new Error(`Batch 8 ${definition.wave}: ${seed.id} references unknown skill ${seed.skillId}`);
  }

  return {
    stage: { ...definition.stage, activityIds: definition.activities.map((seed) => seed.id) },
    lessons: definition.lessons.map((lesson) => ({ ...lesson })),
    packs,
    skills: definition.skills.map((skill) => ({ ...skill })),
    activities
  };
}
