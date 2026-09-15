"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { causeEffectConfig } from "@/lib/learning/causeEffectConfig";
import { isCauseEffectActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./CauseEffectActivity.module.css";

export function CauseEffectActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = causeEffectConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.causeEffectReady = "true";
  }, []);

  if (!activity || !config || !isCauseEffectActivity(activity) || !activity.correctChoice) return null;

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
          source: "cause-effect-runtime",
          evidenceFidelity: assessed ? "choice_cause_effect_interaction" : "completion_only",
          causeKey: config.causeKey,
          effectKind: config.effectKind,
          startState: config.startLabel,
          condition: config.conditionLabel
        }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const selectedIcon = selected ? config.choiceVisuals[selected] ?? "✨" : null;

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
        data-cause-effect
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔎</span>
          <div>
            <h1>Lihat sebab dan hasilnya</h1>
            <p>{config.cue}</p>
          </div>
        </div>

        <div className={styles.flow} role="group" aria-label="Urutan sebab dan akibat">
          <div className={styles.phaseCard} data-cause-start>
            <span className={styles.phaseTag}>Awal</span>
            <span className={styles.bigIcon} aria-hidden>{config.startIcon}</span>
            <strong>{config.startLabel}</strong>
          </div>

          <span className={styles.arrow} aria-hidden>→</span>

          <div className={`${styles.phaseCard} ${styles.causeCard}`} data-cause-condition>
            <span className={styles.phaseTag}>Kondisi</span>
            <span className={styles.bigIcon} aria-hidden>{config.conditionIcon}</span>
            <strong>{config.conditionLabel}</strong>
          </div>

          <span className={styles.arrow} aria-hidden>→</span>

          <div
            className={`${styles.phaseCard} ${styles.resultCard} ${feedback === "try" ? styles.resultTry : ""} ${feedback === "good" ? styles.resultGood : ""}`}
            data-cause-result
            aria-live="polite"
          >
            <span className={styles.phaseTag}>Hasil</span>
            <span className={styles.bigIcon} aria-hidden>{selectedIcon ?? "?"}</span>
            <strong>{selected ?? "Pilih hasil"}</strong>
          </div>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilihan hasil">
          {(activity.choices ?? []).map((choice) => {
            const isSelected = selected === choice;
            const stateClass = isSelected && feedback === "try"
              ? styles.choiceTry
              : isSelected && feedback === "good"
                ? styles.choiceGood
                : "";
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${stateClass}`}
                aria-label={`Pilih hasil: ${choice}`}
                aria-pressed={isSelected}
                data-cause-effect-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <span className={styles.choiceIcon} aria-hidden>{config.choiceVisuals[choice] ?? "✨"}</span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        <div
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "💡 Belum tepat. Perhatikan keadaan awal dan kondisi yang terjadi."
              : "💡 Pilih hasil yang paling masuk akal dari kondisi di atas."}
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
