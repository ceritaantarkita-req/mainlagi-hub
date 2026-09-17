"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { clozeSentenceChoiceConfig } from "@/lib/learning/clozeSentenceChoiceConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./ClozeSentenceChoiceActivity.module.css";

export function ClozeSentenceChoiceActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = clozeSentenceChoiceConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.clozeSentenceChoiceReady = "true";
  }, []);

  if (!activity || !config || !activity.correctChoice) return null;

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
          source: "cloze-sentence-choice-runtime",
          evidenceFidelity: assessed ? "choice_cloze_sentence_interaction" : "completion_only",
          selectedChoice: choice,
          blankCount: 1
        }
      }
    });
    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const blankValue = feedback === "good" ? activity.correctChoice : selected;

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
        data-cloze-sentence-choice
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧩</span>
          <div>
            <h1>Lengkapi kalimat</h1>
            <p>Pilih kata yang membuat kalimat ini lengkap dan masuk akal.</p>
          </div>
        </div>

        <div className={styles.sentenceBoard} data-cloze-sentence-board>
          <p className={styles.sentence} aria-label="Kalimat yang perlu dilengkapi">
            <span>{config.before}</span>
            <span
              className={`${styles.blank} ${feedback === "try" ? styles.blankTry : ""} ${feedback === "good" ? styles.blankGood : ""}`}
              data-cloze-blank
              aria-label={blankValue ? `Kata terpilih ${blankValue}` : "Bagian kalimat belum terisi"}
            >
              {blankValue ?? "___"}
            </span>
            <span>{config.after}</span>
          </p>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilihan kata untuk melengkapi kalimat">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            const wrong = active && feedback === "try";
            const correct = choice === activity.correctChoice && feedback === "good";
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${wrong ? styles.wrong : ""} ${correct ? styles.correct : ""}`}
                aria-label={`Pilih kata ${choice}`}
                aria-pressed={active}
                data-cloze-choice
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
            ? `⭐ Tepat! “${activity.correctChoice}” membuat kalimatnya lengkap.`
            : feedback === "try"
              ? "💡 Belum tepat. Baca lagi seluruh kalimat, lalu coba kata lain."
              : "💡 Baca dari awal sampai akhir, lalu pilih kata yang paling cocok di bagian kosong."}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
