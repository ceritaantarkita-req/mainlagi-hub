"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityCompletion } from "./ActivityCompletion";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isOddOneOutActivity } from "@/lib/learning/gameplayPresentation";
import { oddOneOutConfig } from "@/lib/learning/oddOneOutConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./OddOneOutActivity.module.css";

export function OddOneOutActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = oddOneOutConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.oddOneOutReady = "true";
  }, []);

  if (!activity || !config || !isOddOneOutActivity(activity) || !activity.correctChoice) return null;

  const choose = (choice: string) => {
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
          source: "odd-one-out-runtime",
          evidenceFidelity: assessed ? "choice_odd_one_out_interaction" : "completion_only",
          commonTrait: config.commonTrait,
          outsiderChoice: activity.correctChoice,
          selectedChoice: choice,
          comparedItemCount: 3
        }
      }
    });
    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const restart = () => {
    incorrectRef.current = 0;
    retryRef.current = 0;
    setSelected(null);
    setFeedback("idle");
  };

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      narration="Mana yang beda? Pilih satu gambar yang berbeda."
      lang="id-ID"
      spacious
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`}
        data-odd-one-out
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔎</span>
          <h1>Mana yang beda?</h1>
        </div>

        <div className={styles.trio} role="group" aria-label="Tiga pilihan: cari yang berbeda">
          {(activity.choices ?? []).map((choice) => {
            const visual = config.choiceVisuals[choice];
            const active = selected === choice;
            const correct = feedback === "good" && choice === activity.correctChoice;
            const wrong = feedback === "try" && active;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceCard} ${active ? styles.selected : ""} ${wrong ? styles.wrong : ""} ${correct ? styles.correct : ""}`}
                aria-label={`Pilih yang berbeda: ${visual.label}`}
                aria-pressed={active}
                data-odd-one-out-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <span className={styles.choiceIcon} aria-hidden>{visual.icon}</span>
                <span className={styles.choiceLabel}>{visual.label}</span>
                {correct ? <span className={styles.resultBadge} aria-hidden>✓</span> : null}
              </button>
            );
          })}
        </div>

        <div
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? `${styles.statusGood} ${styles.srOnly}` : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? "⭐ Tepat! Hebat!"
            : feedback === "try"
              ? "Belum tepat. Coba lagi!"
              : ""}
        </div>

        {feedback === "good" ? (
          <span className={styles.srOnly} data-odd-one-out-summary>{config.successText}</span>
        ) : null}

      </section>

      {feedback === "good" ? (
        <ActivityCompletion
          childId={childId}
          activity={activity}
          onTryAgain={restart}
          concise
        />
      ) : null}
    </GardenActivityFrame>
  );
}
