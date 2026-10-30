"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityCompletion } from "./ActivityCompletion";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSpatialTransformActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { spatialTransformConfig } from "@/lib/learning/spatialTransformConfig";
import { planChildVisualHierarchy } from "@/lib/learning/childVisualHierarchy";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SpatialTransformActivity.module.css";
import visualStyles from "./ChildVisualHierarchy.module.css";

export function SpatialTransformActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = spatialTransformConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.spatialTransformReady = "true";
  }, []);

  if (!activity || !config || !isSpatialTransformActivity(activity) || !activity.correctChoice) return null;

  // Child-first question stays answer-safe: the operation label and result
  // slot remain evidence, and the correct direction is never revealed here.
  const hierarchy = planChildVisualHierarchy({
    mode: "choice",
    activityTitle: activity.title,
    visibleInstruction: "Arah akhirnya ke mana?",
    supportingHint: "Lihat arah awal, ikuti putaran atau cermin, lalu pilih hasilnya."
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
          source: "spatial-transform-runtime",
          evidenceFidelity: assessed ? "choice_spatial_transform_interaction" : "completion_only",
          startDirection: config.startDirection,
          transformKind: config.transformKind,
          turnDirection: config.turnDirection,
          quarterTurns: config.quarterTurns,
          mirrorAxis: config.mirrorAxis,
          operationLabel: config.operationLabel,
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

  const transformSymbol = config.transformKind === "mirror"
    ? "⇄"
    : config.turnDirection === "left" ? "↺" : "↻";

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      narration={activity.prompt ?? activity.title}
      lang="id-ID"
      spacious
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`}
        data-spatial-transform
        data-child-visual-hierarchy="spatial-transform-vsg12"
        aria-label={hierarchy.contextTitle}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧭</span>
          <h1 className={visualStyles.primaryInstruction} data-spatial-transform-primary-instruction>{hierarchy.primaryInstruction}</h1>
          <button
            type="button"
            className={styles.helpButton}
            aria-label={helpOpen ? "Tutup bantuan" : "Cara main"}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen((value) => !value)}
          >{helpOpen ? "×" : "?"}</button>
        </div>
        {helpOpen && hierarchy.onDemandHelp ? (
          <p className={visualStyles.assistance} data-spatial-transform-help>{hierarchy.onDemandHelp}</p>
        ) : null

        <div className={styles.transformBoard} role="group" aria-label="Transformasi arah">
          <div className={styles.startCard} data-transform-start={config.startDirection}>
            <span>Mulai</span>
            <strong aria-label={`Arah awal ${config.startDirection}`}>{config.startArrow}</strong>
          </div>

          <div
            className={`${styles.operationCard} ${config.transformKind === "mirror" ? styles.mirrorOperation : ""}`}
            data-transform-operation
            data-transform-kind={config.transformKind}
          >
            <span className={styles.transformSymbol} aria-hidden>{transformSymbol}</span>
            <strong>{config.operationLabel}</strong>
            <small>{config.operationHint}</small>
            {config.transformKind === "mirror" ? <i className={styles.mirrorLine} aria-hidden /> : null}
          </div>

          <div className={styles.resultCard} data-transform-result-slot>
            <span>Hasil</span>
            <strong aria-hidden>?</strong>
            <small>pilih arah akhir</small>
          </div>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih arah akhir">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih arah: ${choice}`}
                aria-pressed={active}
                data-spatial-transform-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <span className={styles.choiceArrow} aria-hidden>{config.choiceArrows[choice] ?? "?"}</span>
                <strong>{choice}</strong>
              </button>
            );
          })}
        </div>

        <div
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.srOnly : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "Belum tepat. Coba lagi!"
              : ""}
        </div>

        {feedback === "good" ? (
          <ActivityCompletion childId={childId} activity={activity} onTryAgain={restart} concise />
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
