"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import { isVisualWordProblemActivity, visualWordProblemConfig } from "@/lib/learning/visualWordProblemConfig";
import styles from "./VisualWordProblemActivity.module.css";

function TokenSet({ count, token, leaving = false }: { count: number; token: string; leaving?: boolean }) {
  return (
    <div className={`${styles.tokens} ${leaving ? styles.tokensLeaving : ""}`} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <span key={`${token}-${count}-${index}`} className={styles.token}>{token}</span>
      ))}
    </div>
  );
}

export function VisualWordProblemActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = visualWordProblemConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.visualWordProblemReady = "true";
  }, []);

  if (!activity || !config || !isVisualWordProblemActivity(activity) || !activity.correctChoice) return null;

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
          source: "visual-word-problem-runtime",
          evidenceFidelity: assessed ? "choice_visual_word_problem_interaction" : "completion_only",
          startCount: config.startCount,
          changeCount: config.changeCount,
          operation: config.operation,
          selectedChoice: choice
        }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const operationSymbol = config.operation === "add" ? "+" : "−";
  const operationLabel = config.operation === "add" ? "bertambah" : "berkurang";

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
        data-visual-word-problem
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>{activity.emoji}</span>
          <div>
            <h1>Cerita jadi hitungan</h1>
            <p>Baca ceritanya, lihat perubahan jumlah, lalu pilih jawabannya.</p>
          </div>
        </div>

        <div className={styles.storyCard} data-visual-word-problem-story>
          <span className={styles.storyLabel}>Cerita</span>
          <p>{activity.prompt}</p>
        </div>

        <div
          className={styles.board}
          role="group"
          aria-label={`Papan cerita jumlah ${operationLabel}`}
          data-visual-word-problem-board
          data-operation={config.operation}
        >
          <div className={styles.quantityCard} aria-label={`${config.startLabel}: ${config.startCount}`}>
            <span className={styles.cardLabel}>Mulai</span>
            <strong>{config.startCount}</strong>
            <TokenSet count={config.startCount} token={config.token} />
            <span className={styles.cardCaption}>{config.startLabel}</span>
          </div>

          <div className={`${styles.changeArrow} ${config.operation === "subtract" ? styles.changeArrowSubtract : ""}`} aria-hidden>
            <span>{operationSymbol}</span>
          </div>

          <div className={`${styles.quantityCard} ${styles.changeCard}`} aria-label={`${config.changeLabel}: ${operationSymbol}${config.changeCount}`}>
            <span className={styles.cardLabel}>{config.operation === "add" ? "Datang" : "Pergi"}</span>
            <strong>{operationSymbol}{config.changeCount}</strong>
            <TokenSet count={config.changeCount} token={config.token} leaving={config.operation === "subtract"} />
            <span className={styles.cardCaption}>{config.changeLabel}</span>
          </div>

          <div className={styles.resultArrow} aria-hidden>→</div>

          <div
            className={`${styles.resultCard} ${feedback === "good" ? styles.resultGood : ""}`}
            aria-label={feedback === "good" ? `Jawaban akhir: ${activity.correctChoice}` : "Jawaban akhir masih belum diketahui"}
            data-visual-word-problem-result
          >
            <span className={styles.cardLabel}>Sekarang</span>
            <strong>{feedback === "good" ? activity.correctChoice : "?"}</strong>
          </div>
        </div>

        <div className={styles.cueCard} data-visual-word-problem-cue>
          <span>Petunjuk</span>
          <strong>{config.cue}</strong>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih jawaban cerita matematika">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih jawaban ${choice}`}
                aria-pressed={active}
                data-visual-word-problem-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                {choice}
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
              ? `💡 Belum tepat. ${config.cue}`
              : `💡 ${config.cue}`}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
