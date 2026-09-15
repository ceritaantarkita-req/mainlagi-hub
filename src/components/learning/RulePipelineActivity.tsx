"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isRulePipelineActivity } from "@/lib/learning/gameplayPresentation";
import { rulePipelineConfig } from "@/lib/learning/rulePipelineConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./RulePipelineActivity.module.css";

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

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.rulePipelineReady = "true";
  }, []);

  if (!activity || !config || !isRulePipelineActivity(activity) || !activity.correctChoice) return null;

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
        data-rule-pipeline
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧠</span>
          <div><h1>Jalankan dua aturan</h1><p>Ikuti aturan pertama, lihat hasil sementara, lalu gunakan aturan kedua.</p></div>
        </div>

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
          <span className={styles.choiceHeading}>Hasil akhirnya apa?</span>
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
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "💡 Belum tepat. Mulai dari hasil sementara, lalu pakai aturan 2 sekali lagi."
              : stepOneApplied
                ? "✨ Hasil sementara sudah terlihat. Sekarang gunakan aturan 2 dan pilih hasil akhir."
                : "💡 Jalankan aturan 1 dulu agar hasil sementara terlihat."}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
