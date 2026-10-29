"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityCompletion } from "./ActivityCompletion";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isTransitiveChainActivity } from "@/lib/learning/gameplayPresentation";
import { planChildVisualHierarchy } from "@/lib/learning/childVisualHierarchy";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import { transitiveChainConfig } from "@/lib/learning/transitiveChainConfig";
import styles from "./TransitiveChainActivity.module.css";
import visual from "./ChildVisualHierarchy.module.css";

export function TransitiveChainActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = transitiveChainConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.transitiveChainReady = "true";
  }, []);

  if (!activity || !config || !isTransitiveChainActivity(activity) || !activity.correctChoice) return null;

  // The canonical question is answer-safe; preserve its variation across
  // height, length, quantity, weight and middle-order examples.
  const hierarchy = planChildVisualHierarchy({
    mode: "choice",
    activityTitle: activity.title,
    visibleInstruction: config.questionLabel,
    supportingHint: "Baca dua hubungan berurutan, lalu tarik kesimpulan yang benar."
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
          source: "transitive-chain-runtime",
          evidenceFidelity: assessed ? "choice_transitive_chain_interaction" : "completion_only",
          chainNodes: config.nodes,
          relationLabel: config.relationLabel,
          selectedConclusion: choice,
          premiseCount: 2
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
        data-transitive-chain
        data-child-visual-hierarchy="transitive-chain-vsg07"
        aria-label={hierarchy.contextTitle}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔗</span>
          <h1 className={visual.primaryInstruction} data-transitive-primary-instruction>{hierarchy.primaryInstruction}</h1>
          <button
            type="button"
            className={styles.helpButton}
            aria-label={helpOpen ? "Tutup bantuan" : "Cara main"}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen(value => !value)}
          >{helpOpen ? "×" : "?"}</button>
        </div>
        {helpOpen && hierarchy.onDemandHelp ? (
          <p className={`${visual.assistance} ${visual.assistancePanel}`} data-transitive-help>{hierarchy.onDemandHelp}</p>
        ) : null}

        <div className={styles.chainCard} role="group" aria-label="Rantai dua premis">
          <div className={styles.node} data-transitive-node><span>1</span><strong>{config.nodes[0]}</strong></div>
          <div className={styles.relation} data-transitive-relation>
            <small>Premis 1</small>
            <strong>{config.relationLabel}</strong>
            <span aria-hidden>→</span>
          </div>
          <div className={styles.node} data-transitive-node><span>2</span><strong>{config.nodes[1]}</strong></div>
          <div className={styles.relation} data-transitive-relation>
            <small>Premis 2</small>
            <strong>{config.relationLabel}</strong>
            <span aria-hidden>→</span>
          </div>
          <div className={styles.node} data-transitive-node><span>3</span><strong>{config.nodes[2]}</strong></div>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih kesimpulan">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih kesimpulan: ${choice}`}
                aria-pressed={active}
                data-transitive-chain-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <span className={styles.choiceMarker} aria-hidden>?</span>
                <strong>{config.choiceLabels[choice] ?? choice}</strong>
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
