"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSentenceOrderCardsActivity, sentenceOrderCardsConfig } from "@/lib/learning/sentenceOrderCardsConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SentenceOrderCardsActivity.module.css";

export function SentenceOrderCardsActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = sentenceOrderCardsConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.sentenceOrderCardsReady = "true";
  }, []);

  if (!activity || !activity.correctChoice || !config || !isSentenceOrderCardsActivity(activity)) return null;

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
          source: "sentence-order-cards-runtime",
          evidenceFidelity: assessed ? "choice_sentence_order_cards_interaction" : "completion_only",
          selectedChoice: choice,
          selectedWords: config.choiceTokens[choice] ?? []
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
        data-sentence-order-cards
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧩</span>
          <div>
            <h1>Pilih susunan kata yang benar</h1>
            <p>Baca kartu dari kiri ke kanan, lalu pilih kalimat yang paling masuk akal.</p>
          </div>
        </div>

        <div className={styles.orderGuide} data-sentence-order-guide aria-label="Baca urutan kata dari kiri ke kanan">
          <span>1</span><b aria-hidden>→</b><span>2</span><b aria-hidden>→</b><span>3</span><b aria-hidden>→</b><span>…</span>
          <small>Baca dari kiri ke kanan</small>
        </div>

        <div className={styles.choiceList} role="group" aria-label="Pilih kalimat dengan susunan kata yang benar">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            const tokens = config.choiceTokens[choice] ?? [];
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih kalimat ${choice}`}
                aria-pressed={active}
                data-sentence-order-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <span className={styles.wordRow} aria-hidden>
                  {tokens.map((token, index) => (
                    <span className={styles.wordUnit} key={`${choice}-${index}-${token}`}>
                      <span className={styles.wordCard} data-sentence-order-word>{token}</span>
                      {index < tokens.length - 1 ? <span className={styles.arrow}>→</span> : <span className={styles.period}>.</span>}
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <div className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`} role="status" aria-live="polite">
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "💡 Belum tepat. Coba baca lagi urutan setiap kartu dari kiri ke kanan."
              : "💡 Perhatikan siapa yang melakukan apa, lalu cek urutan katanya."}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
