"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSyllableAssemblyActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { getActivity, completeActivity } from "@/lib/learning/system";
import { syllableAssemblyConfig } from "@/lib/learning/syllableAssemblyConfig";
import styles from "./SyllableAssemblyActivity.module.css";

export function SyllableAssemblyActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = syllableAssemblyConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.syllableAssemblyReady = "true";
  }, []);

  if (!activity || !config || !isSyllableAssemblyActivity(activity) || !activity.correctChoice) return null;

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
          source: "syllable-assembly-runtime",
          evidenceFidelity: assessed ? "choice_syllable_assembly_interaction" : "completion_only",
          firstSyllable: config.syllables[0],
          secondSyllable: config.syllables[1],
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
        data-syllable-assembly
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧩</span>
          <div>
            <h1>Satukan suku katanya</h1>
            <p>Baca dua bagian dari kiri ke kanan, lalu pilih kata yang terbentuk.</p>
          </div>
        </div>

        <div className={styles.assemblyCard} role="group" aria-label="Papan gabung suku kata" data-syllable-board>
          <div className={styles.syllablePiece} data-syllable-piece aria-label={`Suku kata pertama: ${config.syllables[0]}`}>
            {config.syllables[0]}
          </div>
          <span className={styles.operator} aria-hidden>+</span>
          <div className={styles.syllablePiece} data-syllable-piece aria-label={`Suku kata kedua: ${config.syllables[1]}`}>
            {config.syllables[1]}
          </div>
          <span className={styles.operator} aria-hidden>=</span>
          <div
            className={`${styles.resultPiece} ${feedback === "good" ? styles.resultGood : ""}`}
            data-syllable-result
            aria-label={feedback === "good" ? `Kata hasil: ${activity.correctChoice}` : "Kata hasil masih disembunyikan"}
          >
            {feedback === "good" ? activity.correctChoice : "?"}
          </div>
        </div>

        <div className={styles.cueCard} data-syllable-cue>
          <span>Petunjuk</span>
          <strong>{config.cue}</strong>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih kata hasil gabungan">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih kata hasil: ${choice}`}
                aria-pressed={active}
                data-syllable-choice
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
