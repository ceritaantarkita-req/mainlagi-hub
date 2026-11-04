"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityCompletion } from "./ActivityCompletion";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSubitizingGlanceActivity, subitizingGlanceConfig } from "@/lib/learning/subitizingGlanceConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { planChildVisualHierarchy } from "@/lib/learning/childVisualHierarchy";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SubitizingGlanceActivity.module.css";
import visualStyles from "./ChildVisualHierarchy.module.css";

export function SubitizingGlanceActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = subitizingGlanceConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.subitizingGlanceReady = "true";
  }, []);

  if (!activity || !config || !isSubitizingGlanceActivity(activity) || !activity.correctChoice) return null;

  // Preserve the complete 3x3 stimulus and source narration; only simplify
  // repeated first-action chrome for children on small screens.
  const hierarchy = planChildVisualHierarchy({
    mode: "choice",
    activityTitle: activity.title,
    visibleInstruction: activity.prompt,
    // Original variant-specific cues can literally name the answer (e.g. "dua").
    // Show answer-safe generic Help until the child makes a wrong attempt.
    supportingHint: feedback === "try"
      ? config.cue
      : "Lihat seluruh pola titik, lalu pilih angka yang cocok."
  });
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
    setHelpOpen(false);
    setFeedback("good");
  };

  const restart = () => {
    incorrectRef.current = 0;
    retryRef.current = 0;
    setSelected(null);
    setFeedback("idle");
    setHelpOpen(false);
  };

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
        data-subitizing-glance
        data-child-visual-hierarchy="subitizing-vsg16"
        aria-label={hierarchy.contextTitle}
        data-pattern-mode={config.mode}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>👀</span>
          <h1 className={visualStyles.primaryInstruction} data-subitizing-prompt>
            {hierarchy.primaryInstruction}
          </h1>
          <button
            type="button"
            className={styles.helpButton}
            aria-label={helpOpen ? "Tutup bantuan" : "Cara main"}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen(value => !value)}
          >
            {helpOpen ? "×" : "?"}
          </button>
        </div>
        {helpOpen && hierarchy.onDemandHelp ? (
          <p className={`${visualStyles.assistance} ${visualStyles.assistancePanel}`} data-subitizing-help>
            {hierarchy.onDemandHelp}
          </p>
        ) : null}

        <div className={styles.board}>
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
