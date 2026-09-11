import type { LearningSkillDefinition } from "./catalog";
import type { ContentPackDefinition } from "./contentManifest";
import type { LearningActivity, LearningStage } from "./system";

export type ScienceBatch13SkillDefinition = LearningSkillDefinition;

export interface ScienceBatch13LessonCore {
  id: string;
  subjectId: "science";
  pathId: "science-discovery-foundations";
  stageId: string;
  title: string;
  objective: string;
  ageMin: number;
  ageMax: number;
}

export interface ScienceBatch13PackMeta {
  id: string;
  title: string;
  lessonId: string;
  ageMin: number;
  ageMax: number;
}

type ScienceBatch13Kind = "choice" | "matching";

interface ScienceBatch13SeedBase {
  kind: ScienceBatch13Kind;
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

export interface ScienceBatch13ChoiceSeed extends ScienceBatch13SeedBase {
  kind: "choice";
  choices: string[];
  correctChoice: string;
}

export interface ScienceBatch13MatchingSeed extends ScienceBatch13SeedBase {
  kind: "matching";
  matchItems: Array<{ label: string; pair: string }>;
}

export type ScienceBatch13ActivitySeed = ScienceBatch13ChoiceSeed | ScienceBatch13MatchingSeed;

export interface ScienceBatch13WaveDefinition {
  wave: "A" | "B" | "C" | "D";
  stage: Omit<LearningStage, "activityIds">;
  lessons: ScienceBatch13LessonCore[];
  packs: ScienceBatch13PackMeta[];
  skills: ScienceBatch13SkillDefinition[];
  activities: ScienceBatch13ActivitySeed[];
}

export interface MaterializedScienceBatch13Wave {
  stage: LearningStage;
  lessons: ScienceBatch13LessonCore[];
  packs: ContentPackDefinition[];
  skills: ScienceBatch13SkillDefinition[];
  activities: LearningActivity[];
}

export function materializeScienceBatch13Wave(definition: ScienceBatch13WaveDefinition): MaterializedScienceBatch13Wave {
  const packById = new Map(definition.packs.map((pack) => [pack.id, pack]));

  const activities: LearningActivity[] = definition.activities.map((seed) => ({
    id: seed.id,
    subjectId: "science",
    stageId: definition.stage.id,
    title: seed.title,
    description: seed.description,
    emoji: seed.emoji,
    runtime: seed.kind === "matching" ? "matching" : "tap_choice",
    ageMin: seed.ageMin,
    ageMax: seed.ageMax,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: seed.difficulty === 1 ? 2 : 3,
    prompt: seed.prompt,
    ...(seed.kind === "matching"
      ? { matchItems: seed.matchItems.map((item) => ({ ...item })) }
      : { choices: [...seed.choices], correctChoice: seed.correctChoice })
  }));

  const packs: ContentPackDefinition[] = definition.packs.map((packMeta) => {
    const seeds = definition.activities.filter((seed) => seed.packId === packMeta.id);
    if (!seeds.length) throw new Error(`Batch 13 ${definition.wave}: empty Science pack ${packMeta.id}`);
    if (seeds.some((seed) => seed.lessonId !== packMeta.lessonId)) {
      throw new Error(`Batch 13 ${definition.wave}: pack ${packMeta.id} spans more than one lesson`);
    }
    return {
      id: packMeta.id,
      version: "1.0.0",
      subjectId: "science",
      pathId: "science-discovery-foundations",
      stageId: definition.stage.id,
      title: packMeta.title,
      ageMin: packMeta.ageMin,
      ageMax: packMeta.ageMax,
      reviewStatus: "internal",
      activities: seeds.map((seed) => ({
        localId: seed.id.replace(/^science-/, ""),
        activityId: seed.id,
        lessonId: seed.lessonId,
        mechanicId: seed.kind === "matching" ? "matching" : "tap_choice",
        difficulty: seed.difficulty,
        assessment: "assessed",
        requiredForStage: seed.requiredForStage,
        evidenceContractId: seed.kind === "matching" ? "matching_accuracy_v1" : "choice_accuracy_v1",
        skills: [{ skillId: seed.skillId, weight: 1 }]
      }))
    };
  });

  for (const seed of definition.activities) {
    if (!packById.has(seed.packId)) throw new Error(`Batch 13 ${definition.wave}: ${seed.id} references unknown pack ${seed.packId}`);
    if (!definition.lessons.some((lesson) => lesson.id === seed.lessonId)) throw new Error(`Batch 13 ${definition.wave}: ${seed.id} references unknown lesson ${seed.lessonId}`);
    if (!definition.skills.some((skill) => skill.id === seed.skillId)) throw new Error(`Batch 13 ${definition.wave}: ${seed.id} references unknown skill ${seed.skillId}`);
  }

  return {
    stage: { ...definition.stage, activityIds: definition.activities.map((seed) => seed.id) },
    lessons: definition.lessons.map((lesson) => ({ ...lesson })),
    packs,
    skills: definition.skills.map((skill) => ({ ...skill })),
    activities
  };
}
