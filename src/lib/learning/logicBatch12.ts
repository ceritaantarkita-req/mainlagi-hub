import { materializeLogicBatch12Wave } from "./logicBatch12Authoring";
import { LOGIC_BATCH12_WAVE_A } from "./logicBatch12WaveA";

export const LOGIC_BATCH12_WAVES = [LOGIC_BATCH12_WAVE_A] as const;

const MATERIALIZED_WAVES = LOGIC_BATCH12_WAVES.map(materializeLogicBatch12Wave);

export const LOGIC_BATCH12_ACTIVITIES = MATERIALIZED_WAVES.flatMap((wave) => wave.activities);
export const LOGIC_BATCH12_STAGES = MATERIALIZED_WAVES.map((wave) => wave.stage);
export const LOGIC_BATCH12_LESSON_CORES = MATERIALIZED_WAVES.flatMap((wave) => wave.lessons);
export const LOGIC_BATCH12_CONTENT_PACKS = MATERIALIZED_WAVES.flatMap((wave) => wave.packs);
export const LOGIC_BATCH12_SKILLS = MATERIALIZED_WAVES.flatMap((wave) => wave.skills);
export const LOGIC_BATCH12_ACTIVITY_IDS = LOGIC_BATCH12_ACTIVITIES.map((activity) => activity.id);
export const LOGIC_BATCH12_STAGE_IDS = LOGIC_BATCH12_STAGES.map((stage) => stage.id);

export const LOGIC_BATCH12_WAVE_ACTIVITY_COUNTS = {
  A: LOGIC_BATCH12_WAVE_A.activities.length
} as const;
