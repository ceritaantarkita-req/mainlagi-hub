import type { LearningSkillDefinition } from "./catalog";
import type { ContentPackDefinition } from "./contentManifest";
import type { LearningActivity, LearningStage } from "./system";

export interface MathBatch7SkillDefinition extends LearningSkillDefinition {}

export interface MathBatch7LessonCore {
  id: string;
  subjectId: "math";
  pathId: "math-fondasi-numerasi";
  stageId: string;
  title: string;
  objective: string;
  ageMin: number;
  ageMax: number;
}

export interface MathBatch7PackMeta {
  id: string;
  title: string;
  lessonId: string;
  ageMin: number;
  ageMax: number;
}

interface MathBatch7SeedBase {
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

export interface MathBatch7ChoiceSeed extends MathBatch7SeedBase {
  kind: "choice";
  choices: string[];
  correctChoice: string;
}

export interface MathBatch7MatchingSeed extends MathBatch7SeedBase {
  kind: "matching";
  matchItems: Array<{ label: string; pair: string }>;
}

export type MathBatch7ActivitySeed = MathBatch7ChoiceSeed | MathBatch7MatchingSeed;

export interface MathBatch7WaveDefinition {
  wave: "A" | "B" | "C" | "D";
  stage: Omit<LearningStage, "activityIds">;
  lessons: MathBatch7LessonCore[];
  packs: MathBatch7PackMeta[];
  skills: MathBatch7SkillDefinition[];
  activities: MathBatch7ActivitySeed[];
}

export interface MaterializedMathBatch7Wave {
  stage: LearningStage;
  lessons: MathBatch7LessonCore[];
  packs: ContentPackDefinition[];
  skills: MathBatch7SkillDefinition[];
  activities: LearningActivity[];
}

export function materializeMathBatch7Wave(definition: MathBatch7WaveDefinition): MaterializedMathBatch7Wave {
  const packById = new Map(definition.packs.map((pack) => [pack.id, pack]));

  const activities: LearningActivity[] = definition.activities.map((seed) => ({
    id: seed.id,
    subjectId: "math",
    stageId: definition.stage.id,
    title: seed.title,
    description: seed.description,
    emoji: seed.emoji,
    runtime: seed.kind === "choice" ? "tap_choice" : "matching",
    ageMin: seed.ageMin,
    ageMax: seed.ageMax,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: seed.difficulty === 1 ? 2 : 3,
    prompt: seed.prompt,
    ...(seed.kind === "choice"
      ? { choices: [...seed.choices], correctChoice: seed.correctChoice }
      : { matchItems: seed.matchItems.map((item) => ({ ...item })) })
  }));

  const packs: ContentPackDefinition[] = definition.packs.map((packMeta) => {
    const seeds = definition.activities.filter((seed) => seed.packId === packMeta.id);
    if (!seeds.length) throw new Error(`Batch 7 ${definition.wave}: empty math pack ${packMeta.id}`);
    if (seeds.some((seed) => seed.lessonId !== packMeta.lessonId)) {
      throw new Error(`Batch 7 ${definition.wave}: pack ${packMeta.id} spans more than one lesson`);
    }
    return {
      id: packMeta.id,
      version: "1.0.0",
      subjectId: "math",
      pathId: "math-fondasi-numerasi",
      stageId: definition.stage.id,
      title: packMeta.title,
      ageMin: packMeta.ageMin,
      ageMax: packMeta.ageMax,
      reviewStatus: "internal",
      activities: seeds.map((seed) => ({
        localId: seed.id.replace(/^math-/, ""),
        activityId: seed.id,
        lessonId: seed.lessonId,
        mechanicId: seed.kind === "choice" ? "tap_choice" : "matching",
        difficulty: seed.difficulty,
        assessment: "assessed",
        requiredForStage: seed.requiredForStage,
        evidenceContractId: seed.kind === "choice" ? "choice_accuracy_v1" : "matching_accuracy_v1",
        skills: [{ skillId: seed.skillId, weight: 1 }]
      }))
    };
  });

  for (const seed of definition.activities) {
    if (!packById.has(seed.packId)) throw new Error(`Batch 7 ${definition.wave}: ${seed.id} references unknown pack ${seed.packId}`);
    if (!definition.lessons.some((lesson) => lesson.id === seed.lessonId)) throw new Error(`Batch 7 ${definition.wave}: ${seed.id} references unknown lesson ${seed.lessonId}`);
    if (!definition.skills.some((skill) => skill.id === seed.skillId)) throw new Error(`Batch 7 ${definition.wave}: ${seed.id} references unknown skill ${seed.skillId}`);
  }

  return {
    stage: { ...definition.stage, activityIds: definition.activities.map((seed) => seed.id) },
    lessons: definition.lessons.map((lesson) => ({ ...lesson })),
    packs,
    skills: definition.skills.map((skill) => ({ ...skill })),
    activities
  };
}
