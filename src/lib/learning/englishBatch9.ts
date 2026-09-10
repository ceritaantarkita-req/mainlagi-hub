import { materializeEnglishBatch9Wave } from "./englishBatch9Authoring";
import { ENGLISH_BATCH9_WAVE_A } from "./englishBatch9WaveA";
import { ENGLISH_BATCH9_WAVE_B } from "./englishBatch9WaveB";

export const ENGLISH_BATCH9_WAVE_DEFINITIONS = [ENGLISH_BATCH9_WAVE_A, ENGLISH_BATCH9_WAVE_B] as const;
export const ENGLISH_BATCH9_WAVES = ENGLISH_BATCH9_WAVE_DEFINITIONS.map(materializeEnglishBatch9Wave);
export const ENGLISH_BATCH9_ACTIVITIES = ENGLISH_BATCH9_WAVES.flatMap((wave) => wave.activities);
export const ENGLISH_BATCH9_STAGES = ENGLISH_BATCH9_WAVES.map((wave) => wave.stage);
export const ENGLISH_BATCH9_LESSON_CORES = ENGLISH_BATCH9_WAVES.flatMap((wave) => wave.lessons);
export const ENGLISH_BATCH9_CONTENT_PACKS = ENGLISH_BATCH9_WAVES.flatMap((wave) => wave.packs);
export const ENGLISH_BATCH9_SKILLS = ENGLISH_BATCH9_WAVES.flatMap((wave) => wave.skills);
export const ENGLISH_BATCH9_STAGE_IDS = ENGLISH_BATCH9_STAGES.map((stage) => stage.id);
export const ENGLISH_BATCH9_ACTIVITY_IDS = ENGLISH_BATCH9_ACTIVITIES.map((activity) => activity.id);
export const ENGLISH_BATCH9_WAVE_ACTIVITY_COUNTS = Object.freeze({ A: ENGLISH_BATCH9_WAVE_A.activities.length, B: ENGLISH_BATCH9_WAVE_B.activities.length });
