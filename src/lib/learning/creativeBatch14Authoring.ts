import type { LearningSkillDefinition } from "./catalog";
import type { ContentPackDefinition, ContentPathDefinition } from "./contentManifest";
import type { LearningActivity, LearningStage, LearningSubjectId } from "./system";

export type CreativeBatch14SubjectId = "drawing" | "color";
export type CreativeBatch14SkillDefinition = LearningSkillDefinition;

export interface CreativeBatch14LessonCore {
  id: string;
  subjectId: CreativeBatch14SubjectId;
  pathId: "drawing-creative-studio" | "color-creative-play";
  stageId: string;
  title: string;
  objective: string;
  ageMin: number;
  ageMax: number;
}

export interface CreativeBatch14PackMeta {
  id: string;
  subjectId: CreativeBatch14SubjectId;
  pathId: "drawing-creative-studio" | "color-creative-play";
  stageId: string;
  title: string;
  lessonId: string;
  ageMin: number;
  ageMax: number;
}

interface CreativeBatch14SeedBase {
  id: string;
  subjectId: CreativeBatch14SubjectId;
  stageId: string;
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
  creativePrompt: string;
}

export interface CreativeBatch14DrawingSeed extends CreativeBatch14SeedBase {
  kind: "drawing";
  subjectId: "drawing";
  drawingGuide: string;
}

export interface CreativeBatch14ColoringSeed extends CreativeBatch14SeedBase {
  kind: "coloring";
  subjectId: "color";
  coloringCharacter: string;
  coloringRegions: string[];
}

export type CreativeBatch14ActivitySeed = CreativeBatch14DrawingSeed | CreativeBatch14ColoringSeed;

export interface CreativeBatch14WaveDefinition {
  wave: "A" | "B" | "C" | "D";
  stages: Array<Omit<LearningStage, "activityIds">>;
  lessons: CreativeBatch14LessonCore[];
  packs: CreativeBatch14PackMeta[];
  skills: CreativeBatch14SkillDefinition[];
  activities: CreativeBatch14ActivitySeed[];
}

export interface MaterializedCreativeBatch14Wave {
  stages: LearningStage[];
  lessons: CreativeBatch14LessonCore[];
  packs: ContentPackDefinition[];
  skills: CreativeBatch14SkillDefinition[];
  activities: LearningActivity[];
}

export const DRAWING_BATCH14_PATH: ContentPathDefinition = {
  id: "drawing-creative-studio",
  subjectId: "drawing",
  title: "Studio Menggambar",
  description: "Berlatih garis, bentuk, objek, dan ide gambar dengan kanvas sentuh tanpa penilaian benar-salah.",
  ageMin: 3,
  ageMax: 7,
  stageIds: []
};

function expectedPath(subjectId: CreativeBatch14SubjectId): CreativeBatch14PackMeta["pathId"] {
  return subjectId === "drawing" ? "drawing-creative-studio" : "color-creative-play";
}

export function materializeCreativeBatch14Wave(definition: CreativeBatch14WaveDefinition): MaterializedCreativeBatch14Wave {
  const stageById = new Map(definition.stages.map((stage) => [stage.id, stage]));
  const packById = new Map(definition.packs.map((pack) => [pack.id, pack]));
  const lessonById = new Map(definition.lessons.map((lesson) => [lesson.id, lesson]));
  const skillById = new Map(definition.skills.map((skill) => [skill.id, skill]));

  const activities: LearningActivity[] = definition.activities.map((seed) => ({
    id: seed.id,
    subjectId: seed.subjectId,
    stageId: seed.stageId,
    title: seed.title,
    description: seed.description,
    emoji: seed.emoji,
    runtime: seed.kind,
    ageMin: seed.ageMin,
    ageMax: seed.ageMax,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: seed.difficulty === 1 ? 2 : 3,
    creativePrompt: seed.creativePrompt,
    ...(seed.kind === "drawing"
      ? { drawingGuide: seed.drawingGuide }
      : { coloringCharacter: seed.coloringCharacter, coloringRegions: [...seed.coloringRegions] })
  }));

  const packs: ContentPackDefinition[] = definition.packs.map((packMeta) => {
    const seeds = definition.activities.filter((seed) => seed.packId === packMeta.id);
    if (!seeds.length) throw new Error(`Batch 14 ${definition.wave}: empty creative pack ${packMeta.id}`);
    if (seeds.some((seed) => seed.lessonId !== packMeta.lessonId || seed.stageId !== packMeta.stageId || seed.subjectId !== packMeta.subjectId)) {
      throw new Error(`Batch 14 ${definition.wave}: pack ${packMeta.id} has mixed ownership`);
    }
    return {
      id: packMeta.id,
      version: "1.0.0",
      subjectId: packMeta.subjectId,
      pathId: packMeta.pathId,
      stageId: packMeta.stageId,
      title: packMeta.title,
      ageMin: packMeta.ageMin,
      ageMax: packMeta.ageMax,
      reviewStatus: "internal",
      activities: seeds.map((seed) => ({
        localId: seed.id.replace(/^(drawing|color)-/, ""),
        activityId: seed.id,
        lessonId: seed.lessonId,
        mechanicId: seed.kind,
        difficulty: seed.difficulty,
        assessment: "practice",
        requiredForStage: seed.requiredForStage,
        evidenceContractId: "completion_only_v1",
        skills: [{ skillId: seed.skillId, weight: seed.kind === "drawing" ? 0.4 : 0.3 }]
      }))
    };
  });

  for (const seed of definition.activities) {
    const stage = stageById.get(seed.stageId);
    const pack = packById.get(seed.packId);
    const lesson = lessonById.get(seed.lessonId);
    const skill = skillById.get(seed.skillId);
    if (!stage || stage.subjectId !== seed.subjectId) throw new Error(`Batch 14 ${definition.wave}: ${seed.id} references invalid stage`);
    if (!pack || pack.subjectId !== seed.subjectId || pack.pathId !== expectedPath(seed.subjectId)) throw new Error(`Batch 14 ${definition.wave}: ${seed.id} references invalid pack`);
    if (!lesson || lesson.subjectId !== seed.subjectId || lesson.stageId !== seed.stageId || lesson.pathId !== expectedPath(seed.subjectId)) throw new Error(`Batch 14 ${definition.wave}: ${seed.id} references invalid lesson`);
    if (!skill || skill.subjectId !== (seed.subjectId as LearningSubjectId)) throw new Error(`Batch 14 ${definition.wave}: ${seed.id} references invalid skill`);
  }

  const stages: LearningStage[] = definition.stages.map((stage) => ({
    ...stage,
    activityIds: definition.activities.filter((seed) => seed.stageId === stage.id).map((seed) => seed.id)
  }));

  return {
    stages,
    lessons: definition.lessons.map((lesson) => ({ ...lesson })),
    packs,
    skills: definition.skills.map((skill) => ({ ...skill })),
    activities
  };
}
