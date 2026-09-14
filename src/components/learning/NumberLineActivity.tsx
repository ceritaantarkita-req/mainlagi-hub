"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isNumberLineActivity } from "@/lib/learning/gameplayPresentation";
import { numberLineConfig, numberLineValues } from "@/lib/learning/numberLineConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./NumberLineActivity.module.css";

export function NumberLineActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = numberLineConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.numberLineReady = "true";
  }, []);

  if (!activity || !config || !isNumberLineActivity(activity) || !activity.correctChoice) return null;

  const choiceSet = new Set(activity.choices ?? []);
  const values = numberLineValues(config);

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
          source: "number-line-runtime",
          evidenceFidelity: assessed ? "choice_number_line_interaction" : "completion_only",
          lineDirection: config.direction,
          lineMin: config.min,
          lineMax: config.max,
          contextValues: config.contextValues
        }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const directionLabel =
    config.direction === "right"
      ? "Maju ke kanan →"
      : config.direction === "left"
        ? "← Mundur ke kiri"
        : "Cari yang di antara";

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
        data-number-line
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>↔️</span>
          <div>
            <h1>Temukan posisinya</h1>
            <p>{config.cue}</p>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.directionPill}>{directionLabel}</div>

          <div
            className={styles.numberLine}
            role="group"
            aria-label="Garis bilangan dengan pilihan jawaban"
            data-number-line-rail
          >
            <div className={styles.track} aria-hidden />
            {values.map((value) => {
              const text = String(value);
              const isChoice = choiceSet.has(text);
              const isContext = config.contextValues.includes(value);
              const isSelected = selected === text;
              const stateClass =
                isSelected && feedback === "good"
                  ? styles.tickGood
                  : isSelected && feedback === "try"
                    ? styles.tickTry
                    : "";

              return (
                <div
                  key={value}
                  className={`${styles.tickSlot} ${isContext ? styles.contextSlot : ""}`}
                  data-number-context={isContext ? "true" : undefined}
                >
                  {isChoice ? (
                    <button
                      type="button"
                      className={`${styles.tickButton} ${stateClass}`}
                      aria-label={`Pilih angka ${value}`}
                      aria-pressed={isSelected}
                      onClick={() => choose(text)}
                      disabled={feedback === "good"}
                      data-number-choice
                    >
                      {value}
                    </button>
                  ) : (
                    <span className={styles.tickLabel} aria-label={`Angka ${value}`}>{value}</span>
                  )}
                  <span className={styles.tickMark} aria-hidden />
                </div>
              );
            })}
          </div>

          <div className={styles.contextLegend} aria-label="Angka petunjuk">
            <span className={styles.legendDot} aria-hidden />
            Angka berwarna adalah petunjuk urutan.
          </div>
        </div>

        <div
          className={`${styles.status} ${feedback === "good" ? styles.statusGood : feedback === "try" ? styles.statusTry : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! Angka ${activity.correctChoice} ada di posisi yang benar.`
            : feedback === "try"
              ? "💡 Belum tepat. Lihat arah dan angka petunjuk di garis bilangan."
              : "💡 Pilih salah satu angka yang bisa disentuh di garis bilangan."}
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
