import { materializeIqroBatch10Wave } from "./iqroBatch10Authoring";
import { IQRO_BATCH10_WAVE_A } from "./iqroBatch10WaveA";

export const IQRO_BATCH10_WAVE_DEFINITIONS = [IQRO_BATCH10_WAVE_A] as const;
export const IQRO_BATCH10_WAVES = IQRO_BATCH10_WAVE_DEFINITIONS.map(materializeIqroBatch10Wave);
export const IQRO_BATCH10_ACTIVITIES = IQRO_BATCH10_WAVES.flatMap((wave) => wave.activities);
export const IQRO_BATCH10_STAGES = IQRO_BATCH10_WAVES.map((wave) => wave.stage);
export const IQRO_BATCH10_LESSON_CORES = IQRO_BATCH10_WAVES.flatMap((wave) => wave.lessons);
export const IQRO_BATCH10_CONTENT_PACKS = IQRO_BATCH10_WAVES.flatMap((wave) => wave.packs);
export const IQRO_BATCH10_SKILLS = IQRO_BATCH10_WAVES.flatMap((wave) => wave.skills);
export const IQRO_BATCH10_STAGE_IDS = IQRO_BATCH10_STAGES.map((stage) => stage.id);
export const IQRO_BATCH10_ACTIVITY_IDS = IQRO_BATCH10_ACTIVITIES.map((activity) => activity.id);
export const IQRO_BATCH10_WAVE_ACTIVITY_COUNTS = Object.freeze({ A: IQRO_BATCH10_WAVE_A.activities.length });