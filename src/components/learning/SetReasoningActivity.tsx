"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityCompletion } from "./ActivityCompletion";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSetReasoningActivity } from "@/lib/learning/gameplayPresentation";
import { planChildVisualHierarchy } from "@/lib/learning/childVisualHierarchy";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { setReasoningConfig } from "@/lib/learning/setReasoningConfig";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SetReasoningActivity.module.css";
import visualStyles from "./ChildVisualHierarchy.module.css";

export function SetReasoningActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = setReasoningConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.setReasoningReady = "true";
  }, []);

  if (!activity || !config || !isSetReasoningActivity(activity) || !activity.correctChoice) return null;

  // Keep the two rule cards and set operation visible as learning material.
  // Only redundant instruction chrome moves to an optional disclosure.
  const hierarchy = planChildVisualHierarchy({
    mode: "choice",
    activityTitle: activity.title,
    visibleInstruction: "Mana yang cocok?",
    supportingHint: "Baca dua aturan, lalu pilih jawaban yang memenuhi keduanya."
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
          source: "set-reasoning-runtime",
          evidenceFidelity: assessed ? "choice_set_reasoning_interaction" : "completion_only",
          setRules: config.rules,
          operationLabel: config.operationLabel,
          selectedMember: choice,
          ruleCount: 2
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
        data-set-reasoning
        data-child-visual-hierarchy="set-reasoning-vsg06"
        aria-label={hierarchy.contextTitle}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧩</span>
          <h1 className={visualStyles.primaryInstruction} data-set-reasoning-primary-instruction>{hierarchy.primaryInstruction}</h1>
          <button
            type="button"
            className={styles.helpButton}
            aria-label={helpOpen ? "Tutup bantuan" : "Cara main"}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen(value => !value)}
          >{helpOpen ? "×" : "?"}</button>
        </div>
        {helpOpen && hierarchy.onDemandHelp ? (
          <p className={visualStyles.assistance} data-set-reasoning-help>{hierarchy.onDemandHelp}</p>
        ) : null}

        <div className={styles.ruleBoard} role="group" aria-label="Dua aturan">
          {config.rules.map((rule, index) => (
            <div
              key={`${rule.label}-${index}`}
              className={`${styles.ruleCard} ${rule.membership === "in" ? styles.ruleIn : styles.ruleOut}`}
              data-set-rule
              data-membership={rule.membership}
            >
              <span className={styles.ruleIndex}>Aturan {index + 1}</span>
              <span className={styles.ruleState} aria-hidden>{rule.membership === "in" ? "✓" : "✕"}</span>
              <strong>{rule.label}</strong>
              <small>{rule.membership === "in" ? "harus cocok" : "harus tidak cocok"}</small>
            </div>
          ))}
          <div className={styles.operationCard} data-set-operation>
            <span>Target</span>
            <strong>{config.operationLabel}</strong>
          </div>
        </div>

        <div className={styles.targetCard}>
          <span className={styles.targetBadge}>Cari pilihan</span>
          <strong>{config.targetLabel}</strong>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih jawaban">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih jawaban: ${choice}`}
                aria-pressed={active}
                data-set-reasoning-choice
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
