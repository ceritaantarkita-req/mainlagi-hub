import type { LearningSkillDefinition } from "./catalog";
import type { ContentPackDefinition } from "./contentManifest";
import type { LearningActivity, LearningStage } from "./system";

export type LettersBatch11SkillDefinition = LearningSkillDefinition;

export interface LettersBatch11LessonCore {
  id: string;
  subjectId: "letters";
  pathId: "letters-writing-foundations";
  stageId: string;
  title: string;
  objective: string;
  ageMin: number;
  ageMax: number;
}

export interface LettersBatch11PackMeta {
  id: string;
  title: string;
  lessonId: string;
  ageMin: number;
  ageMax: number;
}

type LettersBatch11Kind = "choice" | "matching" | "trace";

interface LettersBatch11SeedBase {
  kind: LettersBatch11Kind;
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

export interface LettersBatch11ChoiceSeed extends LettersBatch11SeedBase {
  kind: "choice";
  choices: string[];
  correctChoice: string;
}

export interface LettersBatch11MatchingSeed extends LettersBatch11SeedBase {
  kind: "matching";
  matchItems: Array<{ label: string; pair: string }>;
}

export interface LettersBatch11TraceSeed extends LettersBatch11SeedBase {
  kind: "trace";
  traceGlyph: string;
}

export type LettersBatch11ActivitySeed = LettersBatch11ChoiceSeed | LettersBatch11MatchingSeed | LettersBatch11TraceSeed;

export interface LettersBatch11WaveDefinition {
  wave: "A" | "B" | "C" | "D";
  stage: Omit<LearningStage, "activityIds">;
  lessons: LettersBatch11LessonCore[];
  packs: LettersBatch11PackMeta[];
  skills: LettersBatch11SkillDefinition[];
  activities: LettersBatch11ActivitySeed[];
}

export interface MaterializedLettersBatch11Wave {
  stage: LearningStage;
  lessons: LettersBatch11LessonCore[];
  packs: ContentPackDefinition[];
  skills: LettersBatch11SkillDefinition[];
  activities: LearningActivity[];
}

export function materializeLettersBatch11Wave(definition: LettersBatch11WaveDefinition): MaterializedLettersBatch11Wave {
  const packById = new Map(definition.packs.map((pack) => [pack.id, pack]));

  const activities: LearningActivity[] = definition.activities.map((seed) => ({
    id: seed.id,
    subjectId: "letters",
    stageId: definition.stage.id,
    title: seed.title,
    description: seed.description,
    emoji: seed.emoji,
    runtime: seed.kind === "matching" ? "matching" : seed.kind === "trace" ? "trace" : "tap_choice",
    ageMin: seed.ageMin,
    ageMax: seed.ageMax,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: seed.difficulty === 1 ? 2 : 3,
    prompt: seed.prompt,
    ...(seed.kind === "matching"
      ? { matchItems: seed.matchItems.map((item) => ({ ...item })) }
      : seed.kind === "trace"
        ? { traceGlyph: seed.traceGlyph }
        : { choices: [...seed.choices], correctChoice: seed.correctChoice })
  }));

  const packs: ContentPackDefinition[] = definition.packs.map((packMeta) => {
    const seeds = definition.activities.filter((seed) => seed.packId === packMeta.id);
    if (!seeds.length) throw new Error(`Batch 11 ${definition.wave}: empty Letters pack ${packMeta.id}`);
    if (seeds.some((seed) => seed.lessonId !== packMeta.lessonId)) {
      throw new Error(`Batch 11 ${definition.wave}: pack ${packMeta.id} spans more than one lesson`);
    }
    return {
      id: packMeta.id,
      version: "1.0.0",
      subjectId: "letters",
      pathId: "letters-writing-foundations",
      stageId: definition.stage.id,
      title: packMeta.title,
      ageMin: packMeta.ageMin,
      ageMax: packMeta.ageMax,
      reviewStatus: "internal",
      activities: seeds.map((seed) => {
        const isTrace = seed.kind === "trace";
        if (isTrace && seed.requiredForStage) {
          throw new Error(`Batch 11 ${definition.wave}: completion-only trace ${seed.id} cannot gate stage readiness`);
        }
        return {
          localId: seed.id.replace(/^letters-/, ""),
          activityId: seed.id,
          lessonId: seed.lessonId,
          mechanicId: seed.kind === "matching" ? "matching" : isTrace ? "guided_trace" : "tap_choice",
          difficulty: seed.difficulty,
          assessment: isTrace ? "practice" : "assessed",
          requiredForStage: seed.requiredForStage,
          evidenceContractId: seed.kind === "matching" ? "matching_accuracy_v1" : isTrace ? "completion_only_v1" : "choice_accuracy_v1",
          skills: [{ skillId: seed.skillId, weight: isTrace ? 0.4 : 1 }]
        };
      })
    };
  });

  for (const seed of definition.activities) {
    if (!packById.has(seed.packId)) throw new Error(`Batch 11 ${definition.wave}: ${seed.id} references unknown pack ${seed.packId}`);
    if (!definition.lessons.some((lesson) => lesson.id === seed.lessonId)) throw new Error(`Batch 11 ${definition.wave}: ${seed.id} references unknown lesson ${seed.lessonId}`);
    if (!definition.skills.some((skill) => skill.id === seed.skillId)) throw new Error(`Batch 11 ${definition.wave}: ${seed.id} references unknown skill ${seed.skillId}`);
  }

  return {
    stage: { ...definition.stage, activityIds: definition.activities.map((seed) => seed.id) },
    lessons: definition.lessons.map((lesson) => ({ ...lesson })),
    packs,
    skills: definition.skills.map((skill) => ({ ...skill })),
    activities
  };
}
