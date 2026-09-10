import type { LearningSkillDefinition } from "./catalog";
import type { ContentPackDefinition } from "./contentManifest";
import type { LearningActivity, LearningStage } from "./system";

export type IqroBatch10SkillDefinition = LearningSkillDefinition;
export type IqroDotZone = "above" | "below" | "none";

export interface IqroBatch10Letter {
  slug: string;
  glyph: string;
  latin: string;
  dots: number;
  dotZone: IqroDotZone;
}

// Mirrors the canonical engine registry in src/lib/engine/hijaiyah.ts.
// Keep this metadata minimal so the learning catalog does not pull the motion evaluator into every route.
// Automated Batch 10 tests verify glyph/name/dot metadata against HIJAIYAH_TEMPLATES.
export const IQRO_BATCH10_LETTERS: IqroBatch10Letter[] = [
  { slug: "alif", glyph: "ا", latin: "Alif", dots: 0, dotZone: "none" },
  { slug: "ba", glyph: "ب", latin: "Ba", dots: 1, dotZone: "below" },
  { slug: "ta", glyph: "ت", latin: "Ta", dots: 2, dotZone: "above" },
  { slug: "tsa", glyph: "ث", latin: "Tsa", dots: 3, dotZone: "above" },
  { slug: "jim", glyph: "ج", latin: "Jim", dots: 1, dotZone: "below" },
  { slug: "ha", glyph: "ح", latin: "Ha", dots: 0, dotZone: "none" },
  { slug: "kha", glyph: "خ", latin: "Kha", dots: 1, dotZone: "above" },
  { slug: "dal", glyph: "د", latin: "Dal", dots: 0, dotZone: "none" },
  { slug: "dzal", glyph: "ذ", latin: "Dzal", dots: 1, dotZone: "above" },
  { slug: "ra", glyph: "ر", latin: "Ra", dots: 0, dotZone: "none" },
  { slug: "zai", glyph: "ز", latin: "Zai", dots: 1, dotZone: "above" },
  { slug: "sin", glyph: "س", latin: "Sin", dots: 0, dotZone: "none" },
  { slug: "syin", glyph: "ش", latin: "Syin", dots: 3, dotZone: "above" },
  { slug: "shad", glyph: "ص", latin: "Shad", dots: 0, dotZone: "none" },
  { slug: "dhad", glyph: "ض", latin: "Dhad", dots: 1, dotZone: "above" },
  { slug: "tha", glyph: "ط", latin: "Tha", dots: 0, dotZone: "none" },
  { slug: "zha", glyph: "ظ", latin: "Zha", dots: 1, dotZone: "above" },
  { slug: "ain", glyph: "ع", latin: "Ain", dots: 0, dotZone: "none" },
  { slug: "ghain", glyph: "غ", latin: "Ghain", dots: 1, dotZone: "above" },
  { slug: "fa", glyph: "ف", latin: "Fa", dots: 1, dotZone: "above" },
  { slug: "qaf", glyph: "ق", latin: "Qaf", dots: 2, dotZone: "above" },
  { slug: "kaf", glyph: "ك", latin: "Kaf", dots: 0, dotZone: "none" },
  { slug: "lam", glyph: "ل", latin: "Lam", dots: 0, dotZone: "none" },
  { slug: "mim", glyph: "م", latin: "Mim", dots: 0, dotZone: "none" },
  { slug: "nun", glyph: "ن", latin: "Nun", dots: 1, dotZone: "above" },
  { slug: "ha-besar", glyph: "ه", latin: "Ha besar", dots: 0, dotZone: "none" },
  { slug: "wawu", glyph: "و", latin: "Wawu", dots: 0, dotZone: "none" },
  { slug: "ya", glyph: "ي", latin: "Ya", dots: 2, dotZone: "below" },
  { slug: "hamzah", glyph: "ء", latin: "Hamzah", dots: 0, dotZone: "none" }
];

const LETTER_BY_SLUG = new Map(IQRO_BATCH10_LETTERS.map((letter) => [letter.slug, letter]));

export function iqroLetter(slug: string): IqroBatch10Letter {
  const letter = LETTER_BY_SLUG.get(slug);
  if (!letter) throw new Error(`Unknown Batch 10 Iqro letter: ${slug}`);
  return letter;
}

export interface IqroBatch10LessonCore {
  id: string;
  subjectId: "iqro";
  pathId: "iqro-fondasi-hijaiyah";
  stageId: string;
  title: string;
  objective: string;
  ageMin: number;
  ageMax: number;
}

export interface IqroBatch10PackMeta {
  id: string;
  title: string;
  lessonId: string;
  ageMin: number;
  ageMax: number;
}

type IqroBatch10Kind = "choice" | "listen" | "matching" | "trace";

interface IqroBatch10SeedBase {
  kind: IqroBatch10Kind;
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

export interface IqroBatch10ChoiceSeed extends IqroBatch10SeedBase {
  kind: "choice" | "listen";
  choices: string[];
  correctChoice: string;
}

export interface IqroBatch10MatchingSeed extends IqroBatch10SeedBase {
  kind: "matching";
  matchItems: Array<{ label: string; pair: string }>;
}

export interface IqroBatch10TraceSeed extends IqroBatch10SeedBase {
  kind: "trace";
  traceGlyph: string;
}

export type IqroBatch10ActivitySeed = IqroBatch10ChoiceSeed | IqroBatch10MatchingSeed | IqroBatch10TraceSeed;

export interface IqroBatch10WaveDefinition {
  wave: "A" | "B" | "C" | "D";
  stage: Omit<LearningStage, "activityIds">;
  lessons: IqroBatch10LessonCore[];
  packs: IqroBatch10PackMeta[];
  skills: IqroBatch10SkillDefinition[];
  activities: IqroBatch10ActivitySeed[];
}

export interface MaterializedIqroBatch10Wave {
  stage: LearningStage;
  lessons: IqroBatch10LessonCore[];
  packs: ContentPackDefinition[];
  skills: IqroBatch10SkillDefinition[];
  activities: LearningActivity[];
}

export function materializeIqroBatch10Wave(definition: IqroBatch10WaveDefinition): MaterializedIqroBatch10Wave {
  const packById = new Map(definition.packs.map((pack) => [pack.id, pack]));

  const activities: LearningActivity[] = definition.activities.map((seed) => ({
    id: seed.id,
    subjectId: "iqro",
    stageId: definition.stage.id,
    title: seed.title,
    description: seed.description,
    emoji: seed.emoji,
    runtime: seed.kind === "matching" ? "matching" : seed.kind === "listen" ? "listen_and_choose" : seed.kind === "trace" ? "trace" : "tap_choice",
    ageMin: seed.ageMin,
    ageMax: seed.ageMax,
    preferredMobile: seed.kind === "listen" ? "audio" : "touch",
    inputModes: seed.kind === "listen" ? ["audio", "touch"] : ["touch"],
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
    if (!seeds.length) throw new Error(`Batch 10 ${definition.wave}: empty Iqro pack ${packMeta.id}`);
    if (seeds.some((seed) => seed.lessonId !== packMeta.lessonId)) {
      throw new Error(`Batch 10 ${definition.wave}: pack ${packMeta.id} spans more than one lesson`);
    }
    return {
      id: packMeta.id,
      version: "1.0.0",
      subjectId: "iqro",
      pathId: "iqro-fondasi-hijaiyah",
      stageId: definition.stage.id,
      title: packMeta.title,
      ageMin: packMeta.ageMin,
      ageMax: packMeta.ageMax,
      reviewStatus: "expert_required",
      activities: seeds.map((seed) => {
        const isTrace = seed.kind === "trace";
        if (isTrace && seed.requiredForStage) {
          throw new Error(`Batch 10 ${definition.wave}: practice trace ${seed.id} cannot gate stage readiness`);
        }
        return {
          localId: seed.id.replace(/^iqro-/, ""),
          activityId: seed.id,
          lessonId: seed.lessonId,
          mechanicId: seed.kind === "matching" ? "matching" : seed.kind === "listen" ? "listen_and_choose" : isTrace ? "guided_trace" : "tap_choice",
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
    if (!packById.has(seed.packId)) throw new Error(`Batch 10 ${definition.wave}: ${seed.id} references unknown pack ${seed.packId}`);
    if (!definition.lessons.some((lesson) => lesson.id === seed.lessonId)) throw new Error(`Batch 10 ${definition.wave}: ${seed.id} references unknown lesson ${seed.lessonId}`);
    if (!definition.skills.some((skill) => skill.id === seed.skillId)) throw new Error(`Batch 10 ${definition.wave}: ${seed.id} references unknown skill ${seed.skillId}`);
  }

  return {
    stage: { ...definition.stage, activityIds: definition.activities.map((seed) => seed.id) },
    lessons: definition.lessons.map((lesson) => ({ ...lesson })),
    packs,
    skills: definition.skills.map((skill) => ({ ...skill })),
    activities
  };
}