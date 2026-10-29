"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityCompletion } from "./ActivityCompletion";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isRulePipelineActivity } from "@/lib/learning/gameplayPresentation";
import { rulePipelineConfig } from "@/lib/learning/rulePipelineConfig";
import { planChildVisualHierarchy } from "@/lib/learning/childVisualHierarchy";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./RulePipelineActivity.module.css";
import visualStyles from "./ChildVisualHierarchy.module.css";

export function RulePipelineActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = rulePipelineConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [stepOneApplied, setStepOneApplied] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.rulePipelineReady = "true";
  }, []);

  if (!activity || !config || !isRulePipelineActivity(activity) || !activity.correctChoice) return null;

  // A two-step mechanic needs a step-aware question: before running Rule 1,
  // children must not be prompted to pick the still-locked final answer.
  // Both canonical rule texts remain visible in the evidence board.
  const hierarchy = planChildVisualHierarchy({
    mode: "choice",
    activityTitle: activity.title,
    visibleInstruction: stepOneApplied ? "Apa hasil akhirnya?" : "Coba aturan pertama!",
    supportingHint: "Ikuti aturan pertama, lihat hasil sementara, lalu gunakan aturan kedua."
  });

  const chooseResult = (choice: string) => {
    if (!stepOneApplied || feedback === "good") return;
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
          source: "rule-pipeline-runtime",
          evidenceFidelity: assessed ? "choice_rule_pipeline_interaction" : "completion_only",
          startLabel: config.startLabel,
          intermediateLabel: config.intermediateLabel,
          selectedResult: choice,
          pipelineStepsApplied: 2
        }
      }
    });
    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const restart = () => {
    incorrectRef.current = 0;
    retryRef.current = 0;
    setStepOneApplied(false);
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
        data-rule-pipeline
        data-child-visual-hierarchy="rule-pipeline-vsg05"
        aria-label={hierarchy.contextTitle}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧠</span>
          <h1 className={visualStyles.primaryInstruction} data-rule-pipeline-primary-instruction>{hierarchy.primaryInstruction}</h1>
          <button
            className={styles.helpButton}
            type="button"
            aria-label={helpOpen ? "Tutup bantuan" : "Cara main"}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen(value => !value)}
          >{helpOpen ? "×" : "?"}</button>
        </div>
        {helpOpen && hierarchy.onDemandHelp ? (
          <p className={`${visualStyles.assistance} ${visualStyles.assistancePanel}`} data-rule-pipeline-help>{hierarchy.onDemandHelp}</p>
        ) : null}

        <div className={styles.pipeline} role="group" aria-label="Alur dua aturan">
          <div className={styles.stateCard} data-rule-pipeline-start>
            <span className={styles.stateIcon} aria-hidden>{config.startIcon}</span>
            <small>Mulai</small>
            <strong>{config.startLabel}</strong>
          </div>

          <div className={styles.ruleCard}>
            <span className={styles.ruleBadge}>Aturan 1</span>
            <p>{config.ruleOne}</p>
            <button
              type="button"
              className={styles.runButton}
              onClick={() => setStepOneApplied(true)}
              disabled={stepOneApplied}
              data-rule-pipeline-step-one
            >
              {stepOneApplied ? "Aturan 1 selesai ✓" : "Jalankan aturan 1"}
            </button>
          </div>

          <div
            className={`${styles.stateCard} ${stepOneApplied ? styles.stateVisible : styles.statePending}`}
            aria-live="polite"
            data-rule-pipeline-intermediate
          >
            <span className={styles.stateIcon} aria-hidden>{stepOneApplied ? config.intermediateIcon : "?"}</span>
            <small>Hasil sementara</small>
            <strong>{stepOneApplied ? config.intermediateLabel : "Jalankan aturan 1 dulu"}</strong>
          </div>

          <div className={`${styles.ruleCard} ${!stepOneApplied ? styles.rulePending : ""}`}>
            <span className={styles.ruleBadge}>Aturan 2</span>
            <p>{config.ruleTwo}</p>
          </div>
        </div>

        <div className={styles.choiceArea} role="group" aria-label="Pilih hasil akhir">
          <span className={styles.choiceHeading}>Pilihan hasil</span>
          <div className={styles.choiceGrid}>
            {(activity.choices ?? []).map((choice) => {
              const visual = config.choiceVisuals[choice];
              const active = selected === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                  aria-label={`Pilih hasil akhir: ${choice}`}
                  aria-pressed={active}
                  data-rule-pipeline-choice
                  onClick={() => chooseResult(choice)}
                  disabled={!stepOneApplied || feedback === "good"}
                >
                  <span className={styles.choiceIcon} aria-hidden>{visual?.icon ?? choice}</span>
                  <span>{visual?.label ?? choice}</span>
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
