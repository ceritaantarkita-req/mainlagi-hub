"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isRelativeOrderTrackActivity } from "@/lib/learning/gameplayPresentation";
import { relativeOrderTrackConfig } from "@/lib/learning/relativeOrderTrackConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./RelativeOrderTrackActivity.module.css";

export function RelativeOrderTrackActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = relativeOrderTrackConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.relativeOrderTrackReady = "true";
  }, []);

  if (!activity || !config || !isRelativeOrderTrackActivity(activity) || !activity.correctChoice) return null;

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
          source: "relative-order-track-runtime",
          evidenceFidelity: assessed ? "choice_relative_order_track_interaction" : "completion_only",
          relationLabel: config.relationLabel,
          targetIndex: config.targetIndex,
          trackLength: config.items.length,
          selectedChoice: choice
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
        data-relative-order-track
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🛤️</span>
          <div>
            <h1>Ikuti jalur urutannya</h1>
            <p>Gunakan posisi yang terlihat. Slot yang ditanya sengaja disembunyikan sampai kamu memilih.</p>
          </div>
        </div>

        <div className={styles.relationCard} data-relative-order-relation>
          <span>Petunjuk posisi</span>
          <strong>{config.relationLabel}</strong>
          <small>{config.cue}</small>
        </div>

        <div className={styles.track} role="group" aria-label={`Jalur urutan: ${config.relationLabel}`} data-relative-order-track-board>
          {config.items.map((item, index) => {
            const hidden = index === config.targetIndex;
            return (
              <div className={styles.trackPart} key={`${item}-${index}`}>
                <div
                  className={`${styles.trackNode} ${hidden ? styles.targetNode : ""}`}
                  data-relative-order-node
                  data-target-slot={hidden ? "true" : "false"}
                  data-track-index={index}
                  aria-label={hidden ? `Posisi ${index + 1} disembunyikan` : `Posisi ${index + 1}: ${item}`}
                >
                  <span>{index + 1}</span>
                  <strong aria-hidden>{hidden ? "?" : item}</strong>
                </div>
                {index < config.items.length - 1 ? <span className={styles.connector} aria-hidden>→</span> : null}
              </div>
            );
          })}
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih isi slot urutan">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih posisi: ${choice}`}
                aria-pressed={active}
                data-relative-order-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <span aria-hidden>{choice}</span>
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
              ? `💡 Belum tepat. ${config.cue}`
              : `💡 ${config.cue}`}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
