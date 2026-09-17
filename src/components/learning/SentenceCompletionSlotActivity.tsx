"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  isSentenceCompletionSlotActivity,
  sentenceCompletionSlotConfig
} from "@/lib/learning/sentenceCompletionSlotConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SentenceCompletionSlotActivity.module.css";

export function SentenceCompletionSlotActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = sentenceCompletionSlotConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.sentenceCompletionSlotReady = "true";
  }, []);

  if (!activity || !activity.correctChoice || !config || !isSentenceCompletionSlotActivity(activity)) return null;

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
          source: "sentence-completion-slot-runtime",
          evidenceFidelity: assessed ? "choice_sentence_completion_slot_interaction" : "completion_only",
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
      lang="en-US"
      spacious
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`}
        data-sentence-completion-slot
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>✏️</span>
          <div>
            <h1>Complete the sentence</h1>
            <p>Choose the word that makes the sentence complete.</p>
          </div>
        </div>

        <div className={styles.sentenceCard} data-sentence-completion-sentence aria-label="Sentence with one missing word">
          <span>{config.before}</span>
          <span
            className={`${styles.slot} ${selected ? styles.slotFilled : ""} ${feedback === "try" ? styles.slotWrong : ""} ${feedback === "good" ? styles.slotCorrect : ""}`}
            data-sentence-completion-slot-target
          >
            {selected ?? "___"}
          </span>
          <span>{config.after}</span>
        </div>

        <div className={styles.choiceList} role="group" aria-label="Choose the missing word">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Choose ${choice}`}
                aria-pressed={active}
                data-sentence-completion-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                {choice}
              </button>
            );
          })}
        </div>

        <div className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`} role="status" aria-live="polite">
          {feedback === "good"
            ? "⭐ Great! The sentence is complete."
            : feedback === "try"
              ? "💡 Not yet. Read the whole sentence and try another word."
              : "💡 Read the sentence around the blank before choosing."}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Choose another activity</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
