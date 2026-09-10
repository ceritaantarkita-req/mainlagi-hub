import { materializeLettersBatch11Wave } from "./lettersBatch11Authoring";
import { LETTERS_BATCH11_WAVE_A } from "./lettersBatch11WaveA";
import { LETTERS_BATCH11_WAVE_B } from "./lettersBatch11WaveB";
import { LETTERS_BATCH11_WAVE_C } from "./lettersBatch11WaveC";
import { LETTERS_BATCH11_WAVE_D } from "./lettersBatch11WaveD";

export const LETTERS_BATCH11_WAVE_DEFINITIONS = [LETTERS_BATCH11_WAVE_A, LETTERS_BATCH11_WAVE_B, LETTERS_BATCH11_WAVE_C, LETTERS_BATCH11_WAVE_D] as const;
export const LETTERS_BATCH11_WAVES = LETTERS_BATCH11_WAVE_DEFINITIONS.map(materializeLettersBatch11Wave);
export const LETTERS_BATCH11_ACTIVITIES = LETTERS_BATCH11_WAVES.flatMap((wave) => wave.activities);
export const LETTERS_BATCH11_STAGES = LETTERS_BATCH11_WAVES.map((wave) => wave.stage);
export const LETTERS_BATCH11_LESSON_CORES = LETTERS_BATCH11_WAVES.flatMap((wave) => wave.lessons);
export const LETTERS_BATCH11_CONTENT_PACKS = LETTERS_BATCH11_WAVES.flatMap((wave) => wave.packs);
export const LETTERS_BATCH11_SKILLS = LETTERS_BATCH11_WAVES.flatMap((wave) => wave.skills);
export const LETTERS_BATCH11_STAGE_IDS = LETTERS_BATCH11_STAGES.map((stage) => stage.id);
export const LETTERS_BATCH11_ACTIVITY_IDS = LETTERS_BATCH11_ACTIVITIES.map((activity) => activity.id);
export const LETTERS_BATCH11_WAVE_ACTIVITY_COUNTS = Object.freeze({
  A: LETTERS_BATCH11_WAVE_A.activities.length,
  B: LETTERS_BATCH11_WAVE_B.activities.length,
  C: LETTERS_BATCH11_WAVE_C.activities.length,
  D: LETTERS_BATCH11_WAVE_D.activities.length
});
