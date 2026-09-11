import { materializeScienceBatch13Wave } from "./scienceBatch13Authoring";
import { SCIENCE_BATCH13_WAVE_A } from "./scienceBatch13WaveA";
import { SCIENCE_BATCH13_WAVE_B } from "./scienceBatch13WaveB";
import { SCIENCE_BATCH13_WAVE_C } from "./scienceBatch13WaveC";

export const SCIENCE_BATCH13_WAVES = [SCIENCE_BATCH13_WAVE_A, SCIENCE_BATCH13_WAVE_B, SCIENCE_BATCH13_WAVE_C] as const;

const MATERIALIZED_WAVES = SCIENCE_BATCH13_WAVES.map(materializeScienceBatch13Wave);

export const SCIENCE_BATCH13_ACTIVITIES = MATERIALIZED_WAVES.flatMap((wave) => wave.activities);
export const SCIENCE_BATCH13_STAGES = MATERIALIZED_WAVES.map((wave) => wave.stage);
export const SCIENCE_BATCH13_LESSON_CORES = MATERIALIZED_WAVES.flatMap((wave) => wave.lessons);
export const SCIENCE_BATCH13_CONTENT_PACKS = MATERIALIZED_WAVES.flatMap((wave) => wave.packs);
export const SCIENCE_BATCH13_SKILLS = MATERIALIZED_WAVES.flatMap((wave) => wave.skills);
export const SCIENCE_BATCH13_ACTIVITY_IDS = SCIENCE_BATCH13_ACTIVITIES.map((activity) => activity.id);
export const SCIENCE_BATCH13_STAGE_IDS = SCIENCE_BATCH13_STAGES.map((stage) => stage.id);

export const SCIENCE_BATCH13_WAVE_ACTIVITY_COUNTS = {
  A: SCIENCE_BATCH13_WAVE_A.activities.length,
  B: SCIENCE_BATCH13_WAVE_B.activities.length,
  C: SCIENCE_BATCH13_WAVE_C.activities.length
} as const;
