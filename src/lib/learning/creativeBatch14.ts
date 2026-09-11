import { DRAWING_BATCH14_PATH, materializeCreativeBatch14Wave } from "./creativeBatch14Authoring";
import { CREATIVE_BATCH14_WAVE_A } from "./creativeBatch14WaveA";
import { CREATIVE_BATCH14_WAVE_B } from "./creativeBatch14WaveB";

export const CREATIVE_BATCH14_WAVES = [CREATIVE_BATCH14_WAVE_A, CREATIVE_BATCH14_WAVE_B] as const;

const MATERIALIZED_WAVES = CREATIVE_BATCH14_WAVES.map(materializeCreativeBatch14Wave);

export const CREATIVE_BATCH14_ACTIVITIES = MATERIALIZED_WAVES.flatMap((wave) => wave.activities);
export const CREATIVE_BATCH14_STAGES = MATERIALIZED_WAVES.flatMap((wave) => wave.stages);
export const CREATIVE_BATCH14_LESSON_CORES = MATERIALIZED_WAVES.flatMap((wave) => wave.lessons);
export const CREATIVE_BATCH14_CONTENT_PACKS = MATERIALIZED_WAVES.flatMap((wave) => wave.packs);
export const CREATIVE_BATCH14_SKILLS = MATERIALIZED_WAVES.flatMap((wave) => wave.skills);
export const CREATIVE_BATCH14_ACTIVITY_IDS = CREATIVE_BATCH14_ACTIVITIES.map((activity) => activity.id);
export const CREATIVE_BATCH14_DRAWING_ACTIVITY_IDS = CREATIVE_BATCH14_ACTIVITIES.filter((activity) => activity.subjectId === "drawing").map((activity) => activity.id);
export const CREATIVE_BATCH14_COLOR_ACTIVITY_IDS = CREATIVE_BATCH14_ACTIVITIES.filter((activity) => activity.subjectId === "color").map((activity) => activity.id);
export const CREATIVE_BATCH14_DRAWING_STAGE_IDS = CREATIVE_BATCH14_STAGES.filter((stage) => stage.subjectId === "drawing").map((stage) => stage.id);
export const CREATIVE_BATCH14_COLOR_STAGE_IDS = CREATIVE_BATCH14_STAGES.filter((stage) => stage.subjectId === "color").map((stage) => stage.id);
export const CREATIVE_BATCH14_DRAWING_PATH = { ...DRAWING_BATCH14_PATH, stageIds: [...CREATIVE_BATCH14_DRAWING_STAGE_IDS] };

export const CREATIVE_BATCH14_WAVE_ACTIVITY_COUNTS = {
  A: CREATIVE_BATCH14_WAVE_A.activities.length,
  B: CREATIVE_BATCH14_WAVE_B.activities.length
} as const;
