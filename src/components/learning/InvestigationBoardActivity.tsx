"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isInvestigationBoardActivity } from "@/lib/learning/gameplayPresentation";
import { investigationBoardConfig } from "@/lib/learning/investigationBoardConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./InvestigationBoardActivity.module.css";

const PROCESS_STEPS = [
  ["observe", "Amati"],
  ["control", "Jaga tetap"],
  ["predict", "Prediksi"],
  ["conclude", "Simpulkan"]
] as const;

export function InvestigationBoardActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = investigationBoardConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.investigationBoardReady = "true";
  }, []);

  if (!activity || !config || !isInvestigationBoardActivity(activity) || !activity.correctChoice) return null;

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
          source: "investigation-board-runtime",
          evidenceFidelity: assessed ? "choice_investigation_board_interaction" : "completion_only",
          investigationMode: config.mode,
          modeLabel: config.modeLabel,
          scenarioTitle: config.scenarioTitle,
          focusLabel: config.focusLabel,
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
        data-investigation-board
        data-investigation-mode={config.mode}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔎</span>
          <div>
            <h1>Papan penyelidikan</h1>
            <p>Baca bukti yang tersedia, lalu gunakan langkah sains yang tepat.</p>
          </div>
        </div>

        <div className={styles.processRail} role="list" aria-label="Langkah penyelidikan sains">
          {PROCESS_STEPS.map(([mode, label]) => (
            <div
              key={mode}
              role="listitem"
              className={`${styles.processStep} ${config.mode === mode ? styles.processActive : ""}`}
              aria-current={config.mode === mode ? "step" : undefined}
              data-investigation-step={mode}
            >
              {label}
            </div>
          ))}
        </div>

        <div className={styles.board} role="group" aria-label="Bukti penyelidikan">
          <div className={styles.scenarioCard}>
            <span className={styles.cardTag}>Situasi</span>
            <span className={styles.scenarioIcon} aria-hidden>{config.scenarioIcon}</span>
            <strong>{config.scenarioTitle}</strong>
            <ul>
              {config.scenarioLines.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>

          <div className={styles.focusCard} data-investigation-focus>
            <span className={styles.cardTag}>{config.modeLabel}</span>
            <strong>{config.focusLabel}</strong>
            <p>{config.focusHint}</p>
          </div>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label={config.focusLabel}>
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih jawaban: ${choice}`}
                aria-pressed={active}
                data-investigation-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <span className={styles.choiceIcon} aria-hidden>{config.choiceIcons[choice] ?? "🔬"}</span>
                <strong>{choice}</strong>
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
              ? `💡 Belum tepat. Fokus pada langkah “${config.modeLabel}” dan bukti yang benar-benar relevan.`
              : `💡 Langkah aktif: ${config.modeLabel}. Pilih jawaban yang paling didukung situasi di papan.`}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
