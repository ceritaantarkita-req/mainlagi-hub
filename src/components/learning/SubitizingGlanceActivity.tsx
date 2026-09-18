"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSubitizingGlanceActivity, subitizingGlanceConfig } from "@/lib/learning/subitizingGlanceConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SubitizingGlanceActivity.module.css";

export function SubitizingGlanceActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = subitizingGlanceConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.subitizingGlanceReady = "true";
  }, []);

  if (!activity || !config || !isSubitizingGlanceActivity(activity) || !activity.correctChoice) return null;

  const visibleCells = new Set(config.dotCells);

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
          source: "subitizing-glance-runtime",
          evidenceFidelity: assessed ? "choice_subitizing_interaction" : "completion_only",
          patternMode: config.mode,
          selectedChoice: choice,
          visibleDotCount: config.dotCells.length
        }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      title={activity.title}
      narration={activity.prompt ?? activity.title}
      lang="id-ID"
      spacious
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`}
        data-subitizing-glance
        data-pattern-mode={config.mode}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>👀</span>
          <div>
            <span className={styles.badge}>Jumlah sekilas</span>
            <h1>Lihat polanya</h1>
            <p data-subitizing-prompt>{activity.prompt}</p>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.patternLabel}>Kenali pola titiknya</div>
          <div
            className={styles.dotGrid}
            role="img"
            aria-label={config.accessiblePatternLabel}
            data-subitizing-pattern
          >
            {Array.from({ length: 9 }, (_, cellIndex) => (
              <span
                key={cellIndex}
                className={styles.dotCell}
                data-cell-index={cellIndex}
                data-subitizing-dot={visibleCells.has(cellIndex) ? "true" : "false"}
              >
                {visibleCells.has(cellIndex) ? <span className={styles.dot} aria-hidden /> : null}
              </span>
            ))}
          </div>

          <div className={styles.choiceLabel}>Berapa jumlahnya?</div>
          <div className={styles.choices} role="group" aria-label="Pilihan jumlah">
            {(activity.choices ?? []).map((choice) => {
              const active = selected === choice;
              const stateClass = active && feedback === "try"
                ? styles.choiceTry
                : active && feedback === "good"
                  ? styles.choiceGood
                  : "";

              return (
                <button
                  key={choice}
                  type="button"
                  className={`${styles.choiceTile} ${stateClass}`}
                  aria-label={`Pilih jumlah ${choice}`}
                  aria-pressed={active}
                  data-subitizing-choice
                  onClick={() => choose(choice)}
                  disabled={feedback === "good"}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? `💡 Belum tepat. ${config.cue}`
              : "💡 Lihat susunannya sebagai satu pola. Coba kenali jumlahnya tanpa menghitung satu-satu."}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>
            Pilih permainan lain
          </Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
