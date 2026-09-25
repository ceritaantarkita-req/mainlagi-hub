"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { LearningVisualToken } from "./LearningVisualToken";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { initialSoundConfig } from "@/lib/learning/initialSoundConfig";
import { isInitialSoundActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./InitialSoundActivity.module.css";

export function InitialSoundActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = initialSoundConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.initialSoundReady = "true";
  }, []);

  if (!activity || !config || !isInitialSoundActivity(activity) || !activity.correctChoice) return null;

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
          source: "initial-sound-runtime",
          evidenceFidelity: assessed ? "choice_initial_sound_interaction" : "completion_only",
          word: config.word,
          initialSound: activity.correctChoice,
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
        data-initial-sound
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>👂</span>
          <div>
            <h1>Dengar bunyi awalnya</h1>
            <p>Lihat gambarnya, ucapkan katanya, lalu pilih huruf pertama.</p>
          </div>
        </div>

        <div className={styles.wordBoard} data-initial-sound-board>
          <LearningVisualToken className={styles.clue} label={`Gambar ${config.word}`} semanticKey={config.semanticKey}>{config.clue}</LearningVisualToken>
          <div className={styles.wordRow} aria-label={`Kata ${config.word}`}>
            <span
              className={`${styles.initialSlot} ${feedback === "good" ? styles.initialSlotGood : ""}`}
              data-initial-sound-result
              aria-label={feedback === "good" ? `Bunyi awal ${activity.correctChoice}` : "Bunyi awal belum terisi"}
            >
              {feedback === "good" ? activity.correctChoice : "?"}
            </span>
            <strong>{config.word.slice(1)}</strong>
          </div>
          <span className={styles.wordHint}>Ucapkan: {config.word}</span>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih huruf awal">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih huruf ${choice}`}
                aria-pressed={active}
                data-initial-sound-choice
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
              ? `💡 Belum tepat. Ucapkan “${config.word}” pelan-pelan dan dengar bunyi pertamanya.`
              : `💡 Ucapkan “${config.word}” pelan-pelan. Bunyi apa yang terdengar pertama?`}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
