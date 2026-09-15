"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { healthyHabitRoutineConfig } from "@/lib/learning/healthyHabitRoutineConfig";
import { isHealthyHabitRoutineActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./HealthyHabitRoutineActivity.module.css";

export function HealthyHabitRoutineActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = healthyHabitRoutineConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.healthyHabitRoutineReady = "true";
  }, []);

  if (!activity || !config || !isHealthyHabitRoutineActivity(activity) || !activity.correctChoice) return null;

  const chooseHabit = (choice: string) => {
    if (feedback === "good") return;
    setSelected(choice);
    if (choice !== activity.correctChoice) {
      incorrectRef.current += 1;
      retryRef.current += 1;
      setFeedback("try");
      return;
    }

    const incorrectCount = incorrectRef.current;
    const accuracy = 1 / (1 + incorrectCount);
    const assessed = spec?.assessment === "assessed";
    emitLearningRuntimeMeasurement({
      childId,
      activityId: activity.id,
      outcome: {
        status: "completed",
        assessed,
        accuracy: assessed ? accuracy : undefined,
        score: assessed ? accuracy : undefined,
        correctCount: assessed ? 1 : undefined,
        incorrectCount: assessed ? incorrectCount : undefined,
        retryCount: assessed ? retryRef.current : undefined,
        inputMode: activity.preferredMobile,
        metadata: {
          source: "healthy-habit-routine-runtime",
          evidenceFidelity: assessed ? "choice_healthy_habit_routine_interaction" : "completion_only",
          routineLabel: config.routineLabel,
          cueLabel: config.cueLabel,
          selectedHabit: choice
        }
      }
    });
    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  return (
    <GardenActivityFrame backHref={`/child/${childId}/subject/${activity.subjectId}`} title={activity.title} narration={activity.prompt ?? activity.title} lang="id-ID" spacious>
      <section ref={sceneRef} className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`} data-healthy-habit-routine>
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>💚</span>
          <div><h1>Bangun rutinitas sehat</h1><p>{config.contextLabel}</p></div>
        </div>

        <div className={styles.board} role="group" aria-label="Situasi dan pilihan kebiasaan sehat">
          <div className={styles.routineStrip}>
            <div className={styles.routineCard}><span aria-hidden>{config.routineIcon}</span><strong>{config.routineLabel}</strong></div>
            <span className={styles.arrow} aria-hidden>→</span>
            <div className={styles.cueCard}><span aria-hidden>{config.cueIcon}</span><strong>{config.cueLabel}</strong></div>
          </div>
          <div className={styles.choiceColumn}>
            <span className={styles.choiceHeading}>Kebiasaan mana yang cocok?</span>
            {(activity.choices ?? []).map((choice) => {
              const visual = config.choiceVisuals[choice];
              const active = selected === choice;
              return (
                <button key={choice} type="button" className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`} aria-label={`Pilih kebiasaan: ${choice}`} aria-pressed={active} data-healthy-habit-choice onClick={() => chooseHabit(choice)} disabled={feedback === "good"}>
                  <span className={styles.choiceIcon} aria-hidden>{visual?.icon ?? "✨"}</span><span>{visual?.label ?? choice}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`} role="status" aria-live="polite">
          {feedback === "good" ? `⭐ Tepat! ${config.successText}` : feedback === "try" ? "💡 Kebiasaan itu belum paling sesuai. Coba pilih lagi." : "💡 Pilih kebiasaan yang paling membantu tubuh tetap sehat."}
        </div>
        {feedback === "good" ? <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link> : null}
      </section>
    </GardenActivityFrame>
  );
}
