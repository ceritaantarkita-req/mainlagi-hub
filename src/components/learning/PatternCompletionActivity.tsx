"use client";

import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { ActivityCompletion } from "./ActivityCompletion";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isPatternCompletionActivity } from "@/lib/learning/gameplayPresentation";
import { patternCompletionConfig, type PatternCompletionVisualMode } from "@/lib/learning/patternCompletionConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./PatternCompletionActivity.module.css";

function PatternToken({ value, mode, candidate = false }: { value: string; mode: PatternCompletionVisualMode; candidate?: boolean }) {
  if (mode === "size" && (value === "kecil" || value === "besar")) {
    return (
      <span className={styles.sizeTokenWrap} aria-label={value}>
        <span className={`${styles.sizeToken} ${value === "besar" ? styles.sizeLarge : styles.sizeSmall}`} aria-hidden />
        {candidate ? <span className={styles.sizeLabel}>{value}</span> : null}
      </span>
    );
  }

  return <span className={styles.tokenText}>{value}</span>;
}

export function PatternCompletionActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = patternCompletionConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.patternCompletionReady = "true";
  }, []);

  if (!activity || !config || !isPatternCompletionActivity(activity) || !activity.correctChoice) return null;

  const choices = activity.choices ?? [];

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
          source: "pattern-completion-runtime",
          evidenceFidelity: assessed ? "choice_pattern_completion_interaction" : "completion_only",
          patternKind: config.kind,
          visualMode: config.visualMode,
          observedSequence: config.sequence.join("|")
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
        data-pattern-completion
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔁</span>
          <div>
            <h1>Lengkapi polanya</h1>
            <p>{config.cue}</p>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.rulePill}>
            {config.visualMode === "number" ? "Pola angka" : config.visualMode === "size" ? "Pola ukuran" : "Pola berulang"}
          </div>

          <div className={styles.patternStrip} role="group" aria-label="Pola yang perlu dilengkapi" data-pattern-strip>
            {config.sequence.map((value, index) => {
              const endsUnit = Boolean(config.unitLength && (index + 1) % config.unitLength === 0 && index < config.sequence.length - 1);
              return (
                <div
                  key={`${value}-${index}`}
                  className={`${styles.patternTile} ${endsUnit ? styles.unitEnd : ""}`}
                  data-pattern-token={value}
                >
                  <PatternToken value={value} mode={config.visualMode} />
                </div>
              );
            })}

            <div
              className={`${styles.patternTile} ${styles.blankTile} ${feedback === "try" ? styles.blankTry : feedback === "good" ? styles.blankGood : ""}`}
              aria-label={selected ? `Slot berikutnya berisi ${selected}` : "Slot berikutnya masih kosong"}
              data-pattern-slot
            >
              {selected ? <PatternToken value={selected} mode={config.visualMode} /> : <span className={styles.questionMark}>?</span>}
            </div>
          </div>

          <div className={styles.arrowRow} aria-hidden>
            <span>lihat pola</span>
            <span className={styles.arrow}>→</span>
            <span>pilih berikutnya</span>
          </div>

          <div className={styles.candidates} role="group" aria-label="Pilihan untuk melengkapi pola" data-pattern-candidates>
            {choices.map((choice) => {
              const isSelected = selected === choice;
              const stateClass =
                isSelected && feedback === "good"
                  ? styles.candidateGood
                  : isSelected && feedback === "try"
                    ? styles.candidateTry
                    : "";

              return (
                <button
                  key={choice}
                  type="button"
                  className={`${styles.candidate} ${stateClass}`}
                  aria-label={`Pilih ${choice}`}
                  aria-pressed={isSelected}
                  onClick={() => choose(choice)}
                  disabled={feedback === "good"}
                  data-pattern-choice={choice}
                >
                  <PatternToken value={choice} mode={config.visualMode} candidate />
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`${styles.status} ${feedback === "good" ? styles.statusGood : feedback === "try" ? styles.statusTry : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${activity.correctChoice} melanjutkan pola.`
            : feedback === "try"
              ? "💡 Belum tepat. Lihat lagi bagian pola yang berulang atau berubah."
              : "💡 Perhatikan urutannya, lalu pilih yang datang berikutnya."}
        </div>

        {feedback === "good" ? <ActivityCompletion childId={childId} activity={activity} /> : null}
      </section>
    </GardenActivityFrame>
  );
}
