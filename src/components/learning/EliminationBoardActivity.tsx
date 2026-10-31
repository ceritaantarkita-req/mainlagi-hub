"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityCompletion } from "./ActivityCompletion";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { eliminationBoardConfig, isEliminationBoardActivity } from "@/lib/learning/eliminationBoardConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { planChildVisualHierarchy } from "@/lib/learning/childVisualHierarchy";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./EliminationBoardActivity.module.css";
import visualStyles from "./ChildVisualHierarchy.module.css";

export function EliminationBoardActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = eliminationBoardConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const eliminatedRef = useRef<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [eliminatedChoices, setEliminatedChoices] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.eliminationBoardReady = "true";
  }, []);

  if (!activity || !config || !isEliminationBoardActivity(activity) || !activity.correctChoice) return null;

  // Keep the original variant-specific question and core elimination clue.
  // Only the secondary explanation belongs behind optional Help.
  const hierarchy = planChildVisualHierarchy({
    mode: "choice",
    activityTitle: activity.title,
    visibleInstruction: activity.prompt,
    supportingHint: config.hint
  });

  const choose = (choice: string) => {
    if (feedback === "good") return;
    setSelected(choice);

    if (choice !== activity.correctChoice) {
      incorrectRef.current += 1;
      retryRef.current += 1;
      if (!eliminatedRef.current.has(choice)) {
        eliminatedRef.current.add(choice);
        setEliminatedChoices([...eliminatedRef.current]);
      }
      setFeedback("try");
      return;
    }

    const incorrectCount = incorrectRef.current;
    const accuracy = 1 / (1 + incorrectCount);
    const assessed = spec?.assessment === "assessed";
    const eliminated = [...eliminatedRef.current];

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
          source: "elimination-board-runtime",
          evidenceFidelity: assessed ? "choice_elimination_board_interaction" : "completion_only",
          eliminationMode: config.mode,
          selectedChoice: choice,
          eliminatedChoices: eliminated,
          eliminatedCount: eliminated.length
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
    setEliminatedChoices([]);
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
        data-elimination-board
        data-child-visual-hierarchy="elimination-vsg14"
        aria-label={hierarchy.contextTitle}
        data-elimination-mode={config.mode}
        data-eliminated-count={eliminatedChoices.length}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔎</span>
          <h1 className={visualStyles.primaryInstruction} data-elimination-prompt>{hierarchy.primaryInstruction}</h1>
          <button
            type="button"
            className={styles.helpButton}
            aria-label={helpOpen ? "Tutup bantuan" : "Cara main"}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen(value => !value)}
          >{helpOpen ? "×" : "?"}</button>
        </div>
        <div className={styles.clueCard} data-elimination-clue>
          <span className={styles.clueTag}>Petunjuk</span>
          <strong>{config.clueLabel}</strong>
        </div>
        {helpOpen && hierarchy.onDemandHelp ? (
          <p className={`${visualStyles.assistance} ${visualStyles.assistancePanel}`} data-elimination-help>
            {hierarchy.onDemandHelp}
          </p>
        ) : null}

        <div className={styles.choiceGrid} role="group" aria-label="Pilihan untuk dieliminasi dan disimpulkan">
          {(activity.choices ?? []).map((choice, index) => {
            const eliminated = eliminatedChoices.includes(choice);
            const correct = feedback === "good" && choice === activity.correctChoice;
            const active = selected === choice;
            const state = correct ? "correct" : eliminated ? "eliminated" : "available";
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceCard} ${eliminated ? styles.eliminated : ""} ${correct ? styles.correct : ""} ${active ? styles.active : ""}`}
                aria-label={`Pilih kesimpulan: ${choice}`}
                data-elimination-choice
                data-elimination-state={state}
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <span className={styles.indexBadge} aria-hidden>{index + 1}</span>
                <span className={styles.choiceText}>{choice}</span>
                {eliminated ? <span className={styles.eliminatedBadge}>Tersisih</span> : null}
                {correct ? <span className={styles.correctBadge}>Kesimpulan ✓</span> : null}
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
              ? "Tersisih. Coba pilihan lain!"
              : ""}
        </div>

        {feedback === "good" ? (
          <div className={styles.conclusion} data-elimination-conclusion>
            <span aria-hidden>✅</span>
            <span>Kesimpulan:</span>
            <strong>{activity.correctChoice}</strong>
          </div>
        ) : null}

        {feedback === "good" ? (
          <ActivityCompletion childId={childId} activity={activity} onTryAgain={restart} concise />
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
