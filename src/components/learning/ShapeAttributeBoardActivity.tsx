"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityCompletion } from "./ActivityCompletion";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  isShapeAttributeBoardActivity,
  shapeAttributeBoardConfig
} from "@/lib/learning/shapeAttributeBoardConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { planChildVisualHierarchy } from "@/lib/learning/childVisualHierarchy";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./ShapeAttributeBoardActivity.module.css";
import visualStyles from "./ChildVisualHierarchy.module.css";

export function ShapeAttributeBoardActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = shapeAttributeBoardConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.shapeAttributeReady = "true";
  }, []);

  if (!activity || !config || !isShapeAttributeBoardActivity(activity) || !activity.correctChoice) return null;

  // Canonical prompt, not a generic replacement heading: each of the four
  // shape questions has a distinct child-facing meaning.
  const hierarchy = planChildVisualHierarchy({
    mode: "choice",
    activityTitle: activity.title,
    visibleInstruction: activity.prompt,
    supportingHint: config.cue
  });

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

  const restart = () => {
    incorrectRef.current = 0;
    retryRef.current = 0;
    setSelected(null);
    setFeedback("idle");
    setHelpOpen(false);
  };

  const resolved = feedback === "good";

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      narration={activity.prompt ?? activity.title}
      lang="id-ID"
      spacious
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${resolved ? styles.sceneDone : ""}`}
        data-shape-attribute-board
        data-child-visual-hierarchy="shape-attribute-vsg13"
        aria-label={hierarchy.contextTitle}
        data-shape-mode={config.mode}
        data-shape-resolved={resolved ? "true" : "false"}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>📐</span>
          <h1 className={visualStyles.primaryInstruction} data-shape-primary-instruction>{hierarchy.primaryInstruction}</h1>
          <button
            type="button"
            className={styles.helpButton}
            aria-label={helpOpen ? "Tutup bantuan" : "Cara main"}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen((value) => !value)}
          >{helpOpen ? "×" : "?"}</button>
        </div>
        {helpOpen && hierarchy.onDemandHelp ? (
          <p className={`${visualStyles.assistance} ${visualStyles.assistancePanel}`} data-shape-cue data-shape-help>
            {hierarchy.onDemandHelp}
          </p>
        ) : null}

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
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${resolved ? styles.srOnly : ""}`}
          role="status"
          aria-live="polite"
        >
          {resolved
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "Belum tepat. Coba lagi!"
              : ""}
        </div>

        {resolved ? (
          <div className={styles.successPanel} data-shape-success-detail>
            <span aria-hidden>✨</span>
            <strong>{config.successInsight}</strong>
          </div>
        ) : null}

        {resolved ? (
          <ActivityCompletion childId={childId} activity={activity} onTryAgain={restart} concise />
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
