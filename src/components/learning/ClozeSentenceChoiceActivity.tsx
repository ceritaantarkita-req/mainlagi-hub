"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  clozeSentenceChoiceConfig,
  isClozeSentenceChoiceActivity
} from "@/lib/learning/clozeSentenceChoiceConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./ClozeSentenceChoiceActivity.module.css";

const copy = {
  "id-ID": {
    heading: "Lengkapi kalimat",
    instruction: "Pilih kata yang membuat kalimat ini lengkap dan masuk akal.",
    sentenceLabel: "Kalimat yang perlu dilengkapi",
    cardLabel: "Kalimat",
    choiceLabel: "Pilihan kata untuk melengkapi kalimat",
    good: "⭐ Tepat! Kata itu membuat kalimatnya lengkap.",
    retry: "💡 Belum tepat. Baca seluruh kalimatnya, lalu coba kata lain.",
    idle: "💡 Baca kalimat lengkapnya dalam hati setelah memilih kata.",
    next: "Pilih permainan lain"
  },
  "en-US": {
    heading: "Complete the sentence",
    instruction: "Choose the word that makes the sentence complete and meaningful.",
    sentenceLabel: "Sentence to complete",
    cardLabel: "Sentence",
    choiceLabel: "Words to complete the sentence",
    good: "⭐ Correct! That word completes the sentence.",
    retry: "💡 Not quite. Read the whole sentence, then try another word.",
    idle: "💡 Read the whole sentence in your head after choosing a word.",
    next: "Choose another activity"
  }
} as const;

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

  if (!activity || !activity.correctChoice || !config || !isClozeSentenceChoiceActivity(activity)) return null;
  const ui = copy[config.locale];

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
          selectedChoice: choice
        }
      }
    });
    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const slotClass = `${styles.slot} ${feedback === "try" && selected ? styles.slotWrong : ""} ${feedback === "good" ? styles.slotCorrect : ""}`;

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      title={activity.title}
      narration={activity.prompt ?? activity.title}
      lang={config.locale}
      spacious
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`}
        data-cloze-sentence-choice
        data-cloze-locale={config.locale}
      >
        <div className={styles.introCard}>
          <span className={styles.introIcon} aria-hidden>✍️</span>
          <div>
            <h1>{ui.heading}</h1>
            <p>{ui.instruction}</p>
          </div>
        </div>

        <div className={styles.sentenceCard} data-cloze-sentence aria-label={ui.sentenceLabel}>
          <span className={styles.cardLabel}>{ui.cardLabel}</span>
          <p className={styles.sentence}>
            <span>{config.before}</span>{" "}
            <span
              className={slotClass}
              data-cloze-slot
              data-slot-state={feedback}
              aria-live="polite"
            >
              {selected ?? "_____"}
            </span>{" "}
            <span>{config.after}</span>
          </p>
        </div>

        <div className={styles.choiceList} role="group" aria-label={ui.choiceLabel}>
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-pressed={active}
                data-cloze-answer
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
          {feedback === "good" ? ui.good : feedback === "try" ? ui.retry : ui.idle}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>{ui.next}</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
