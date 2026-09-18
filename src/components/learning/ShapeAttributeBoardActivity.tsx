"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  isShapeAttributeBoardActivity,
  shapeAttributeBoardConfig
} from "@/lib/learning/shapeAttributeBoardConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./ShapeAttributeBoardActivity.module.css";

export function ShapeAttributeBoardActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = shapeAttributeBoardConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.shapeAttributeReady = "true";
  }, []);

  if (!activity || !config || !isShapeAttributeBoardActivity(activity) || !activity.correctChoice) return null;

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
          source: "shape-attribute-board-runtime",
          evidenceFidelity: assessed ? "choice_shape_attribute_interaction" : "completion_only",
          shapeMode: config.mode,
          selectedChoice: choice
        }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const resolved = feedback === "good";

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
        className={`${styles.scene} ${resolved ? styles.sceneDone : ""}`}
        data-shape-attribute-board
        data-shape-mode={config.mode}
        data-shape-resolved={resolved ? "true" : "false"}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>📐</span>
          <div>
            <span className={styles.badge}>Kenali bentuk</span>
            <h1>Amati bentuknya</h1>
            <p>{activity.prompt}</p>
          </div>
        </div>

        <div className={styles.cue} data-shape-cue>
          <span aria-hidden>💡</span>
          <span>{config.cue}</span>
        </div>

        <div className={styles.shapeMat} role="group" aria-label="Pilihan bentuk">
          {(activity.choices ?? []).map((choice, index) => {
            const active = selected === choice;
            const visual = config.choiceVisuals[choice];
            const isCorrect = resolved && choice === activity.correctChoice;
            return (
              <button
                key={`${choice}-${index}`}
                type="button"
                className={`${styles.shapeButton} ${active && feedback === "try" ? styles.shapeTry : ""} ${isCorrect ? styles.shapeGood : ""}`}
                aria-label={`Pilih bentuk: ${visual?.accessibleLabel ?? choice}`}
                aria-pressed={active}
                data-shape-attribute-choice
                data-shape-choice-value={choice}
                onClick={() => choose(choice)}
                disabled={resolved}
              >
                <span className={styles.shapeGlyph} aria-hidden>{choice}</span>
                <span className={styles.tileNumber} aria-hidden>{index + 1}</span>
              </button>
            );
          })}
        </div>

        <div
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${resolved ? styles.statusGood : ""}`}
          role="status"
          aria-live="polite"
        >
          {resolved
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "💡 Belum tepat. Amati bentuknya lagi lalu coba pilihan lain."
              : "💡 Pilih satu bentuk yang paling sesuai dengan pertanyaan."}
        </div>

        {resolved ? (
          <div className={styles.successPanel} data-shape-success-detail>
            <span aria-hidden>✨</span>
            <strong>{config.successInsight}</strong>
          </div>
        ) : null}

        {resolved ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>
            Pilih permainan lain
          </Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
