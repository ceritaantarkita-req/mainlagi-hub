"use client";

import { getStage } from "@/lib/learning/system";
import { StageScreen } from "./ChildLearningPathViews";
import styles from "./LearningPlatform.module.css";

/**
 * Menggambar keeps its canonical route/owner for existing Journey Map links.
 * P1-c presentation delegates to the same stage catalog as eight other subjects:
 * age-gated lessons, canonical progress/evidence, recommendations and activity links.
 *
 * CreativePracticeActivity, drawing canvas, completion and mastery stay independent.
 */
export function DrawingStageScreen({ childId, stageId }: { childId: string; stageId: string }) {
  const stage = getStage(stageId);
  if (stage && stage.subjectId !== "drawing") {
    return <main className={styles.content}><div className={styles.emptyState}>Stage menggambar tidak ditemukan.</div></main>;
  }
  return <StageScreen childId={childId} stageId={stageId} />;
}
