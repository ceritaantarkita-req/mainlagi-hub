import { materializeMathBatch7Wave } from "./mathBatch7Authoring";
import { MATH_BATCH7_WAVE_A } from "./mathBatch7WaveA";
import { MATH_BATCH7_WAVE_B } from "./mathBatch7WaveB";
import { MATH_BATCH7_WAVE_C } from "./mathBatch7WaveC";
import { MATH_BATCH7_WAVE_D } from "./mathBatch7WaveD";

export const MATH_BATCH7_WAVE_DEFINITIONS = [
  MATH_BATCH7_WAVE_A,
  MATH_BATCH7_WAVE_B,
  MATH_BATCH7_WAVE_C,
  MATH_BATCH7_WAVE_D
] as const;

export const MATH_BATCH7_WAVES = MATH_BATCH7_WAVE_DEFINITIONS.map(materializeMathBatch7Wave);

export const MATH_BATCH7_ACTIVITIES = MATH_BATCH7_WAVES.flatMap((wave) => wave.activities);
export const MATH_BATCH7_STAGES = MATH_BATCH7_WAVES.map((wave) => wave.stage);
export const MATH_BATCH7_LESSON_CORES = MATH_BATCH7_WAVES.flatMap((wave) => wave.lessons);
export const MATH_BATCH7_CONTENT_PACKS = MATH_BATCH7_WAVES.flatMap((wave) => wave.packs);
export const MATH_BATCH7_SKILLS = MATH_BATCH7_WAVES.flatMap((wave) => wave.skills);

export const MATH_BATCH7_STAGE_IDS = MATH_BATCH7_STAGES.map((stage) => stage.id);
export const MATH_BATCH7_ACTIVITY_IDS = MATH_BATCH7_ACTIVITIES.map((activity) => activity.id);

export const MATH_BATCH7_WAVE_ACTIVITY_COUNTS = Object.freeze(
  Object.fromEntries(MATH_BATCH7_WAVES.map((wave, index) => [MATH_BATCH7_WAVE_DEFINITIONS[index].wave, wave.activities.length])) as Record<"A" | "B" | "C" | "D", number>
);
