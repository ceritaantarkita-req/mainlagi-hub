"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { LearningVisualToken } from "./LearningVisualToken";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isPictureWordMatchActivity } from "@/lib/learning/gameplayPresentation";
import { pictureWordMatchConfig } from "@/lib/learning/pictureWordMatchConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./PictureWordMatchActivity.module.css";

const copy = {
  "id-ID": {
    heading: "Lihat gambar, cari katanya",
    instruction: "Amati objeknya lalu sentuh kata yang paling cocok.",
    pictureHint: "Objek apa ini?",
    choiceGroup: "Pilih kata yang cocok",
    choiceAria: "Pilih kata",
    pictureAria: "Gambar",
    pendingAnswer: "Kata belum dipilih",
    answerAria: "Kata",
    correctLead: "Tepat!",
    retry: "💡 Belum tepat. Lihat lagi bentuk objeknya lalu cocokkan dengan kata.",
    idle: "💡 Perhatikan gambarnya dulu, lalu baca tiga pilihan kata.",
    next: "Pilih permainan lain"
  },
  "en-US": {
    heading: "Look at the picture, find the word",
    instruction: "Look carefully, then choose the word that matches.",
    pictureHint: "What does the picture show?",
    choiceGroup: "Choose the matching word",
    choiceAria: "Choose word",
    pictureAria: "Picture of",
    pendingAnswer: "Word not chosen yet",
    answerAria: "Word",
    correctLead: "Correct!",
    retry: "💡 Not quite. Look at the picture again, then try another word.",
    idle: "💡 Look at the picture first, then read the three word choices.",
    next: "Choose another activity"
  }
} as const;

export function PictureWordMatchActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = pictureWordMatchConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.pictureWordMatchReady = "true";
  }, []);

  if (!activity || !config || !isPictureWordMatchActivity(activity) || !activity.correctChoice) return null;

  const ui = copy[config.locale];
  const isEnglish = config.locale === "en-US";
  const frameTitle = isEnglish ? "Picture & Word" : activity.title;
  const narration = isEnglish
    ? "Look at the picture and choose the matching word."
    : activity.prompt ?? activity.title;

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
          source: "picture-word-match-runtime",
          evidenceFidelity: assessed ? "choice_picture_word_match_interaction" : "completion_only",
          picture: config.picture,
          word: config.spokenWord,
          selectedChoice: choice,
          domainVariant: config.domainVariant
        }
      }
    });
    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      title={frameTitle}
      narration={narration}
      lang={config.locale}
      spacious
      compactShortDesktop={isEnglish}
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`}
        data-picture-word-match
        data-picture-word-locale={config.locale}
        data-picture-word-variant={config.domainVariant}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>👀</span>
          <div>
            <h1>{ui.heading}</h1>
            <p>{ui.instruction}</p>
          </div>
        </div>

        <div className={styles.pictureBoard} data-picture-word-match-board>
          <LearningVisualToken className={styles.picture} label={`${ui.pictureAria} ${config.spokenWord}`}>{config.picture}</LearningVisualToken>
          <div
            className={styles.answerSlot}
            data-picture-word-match-result
            aria-label={feedback === "good" ? `${ui.answerAria} ${activity.correctChoice}` : ui.pendingAnswer}
          >
            {feedback === "good" ? activity.correctChoice : "?"}
          </div>
          <span className={styles.pictureHint}>{ui.pictureHint}</span>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label={ui.choiceGroup}>
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`${ui.choiceAria} ${choice}`}
                aria-pressed={active}
                data-picture-word-match-choice
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
            ? `⭐ ${ui.correctLead} ${config.successText}`
            : feedback === "try"
              ? ui.retry
              : ui.idle}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>{ui.next}</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
