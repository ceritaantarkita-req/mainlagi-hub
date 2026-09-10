import { materializeBahasaBatch8Wave } from "./bahasaBatch8Authoring";
import { BAHASA_BATCH8_WAVE_A } from "./bahasaBatch8WaveA";
import { BAHASA_BATCH8_WAVE_B } from "./bahasaBatch8WaveB";
import { BAHASA_BATCH8_WAVE_C } from "./bahasaBatch8WaveC";
import { BAHASA_BATCH8_WAVE_D } from "./bahasaBatch8WaveD";

export const BAHASA_BATCH8_WAVE_DEFINITIONS = [BAHASA_BATCH8_WAVE_A, BAHASA_BATCH8_WAVE_B, BAHASA_BATCH8_WAVE_C, BAHASA_BATCH8_WAVE_D] as const;
export const BAHASA_BATCH8_WAVES = BAHASA_BATCH8_WAVE_DEFINITIONS.map(materializeBahasaBatch8Wave);
export const BAHASA_BATCH8_ACTIVITIES = BAHASA_BATCH8_WAVES.flatMap((wave) => wave.activities);
export const BAHASA_BATCH8_STAGES = BAHASA_BATCH8_WAVES.map((wave) => wave.stage);
export const BAHASA_BATCH8_LESSON_CORES = BAHASA_BATCH8_WAVES.flatMap((wave) => wave.lessons);
export const BAHASA_BATCH8_CONTENT_PACKS = BAHASA_BATCH8_WAVES.flatMap((wave) => wave.packs);
export const BAHASA_BATCH8_SKILLS = BAHASA_BATCH8_WAVES.flatMap((wave) => wave.skills);
export const BAHASA_BATCH8_STAGE_IDS = BAHASA_BATCH8_STAGES.map((stage) => stage.id);
export const BAHASA_BATCH8_ACTIVITY_IDS = BAHASA_BATCH8_ACTIVITIES.map((activity) => activity.id);
export const BAHASA_BATCH8_WAVE_ACTIVITY_COUNTS = Object.freeze({ A: BAHASA_BATCH8_WAVE_A.activities.length, B: BAHASA_BATCH8_WAVE_B.activities.length, C: BAHASA_BATCH8_WAVE_C.activities.length, D: BAHASA_BATCH8_WAVE_D.activities.length });
