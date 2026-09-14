"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SymbolHuntChoiceActivity.module.css";

function stableVariant(value: string): number {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 3;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  if (!values.length) return [];
  const safe = offset % values.length;
  return [...values.slice(safe), ...values.slice(0, safe)];
}

export function SymbolHuntChoiceActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const variant = useMemo(() => stableVariant(activityId), [activityId]);
  const choices = useMemo(() => rotate(activity?.choices ?? [], variant), [activity?.choices, variant]);
  const variantClass = [styles.variant0, styles.variant1, styles.variant2][variant];

  useEffect(() => {
    if (fieldRef.current) fieldRef.current.dataset.symbolHuntReady = "true";
  }, []);

  if (!activity || activity.choicePresentation !== "symbol_hunt" || !activity.correctChoice) return null;

  const choose = (choice: string) => {
    if (feedback === "good") return;
    if (choice === activity.correctChoice) {
      completeActivity(childId, activity.id);
      setFeedback("good");
    } else {
      setFeedback("try");
    }
  };

  const hint = activity.subjectId === "english"
    ? "Look around and tap the matching letter."
    : "Lihat seluruh taman lalu sentuh huruf yang cocok.";

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      title={activity.title}
      narration={activity.prompt ?? activity.title}
      lang={activity.subjectId === "english" ? "en-US" : "id-ID"}
      spacious
    >
      <section className={`${styles.huntScene} ${variantClass}`} aria-labelledby="symbol-hunt-prompt">
        <span className={`${styles.cloud} ${styles.cloudOne}`} aria-hidden />
        <span className={`${styles.cloud} ${styles.cloudTwo}`} aria-hidden />
        <span className={`${styles.bush} ${styles.bushOne}`} aria-hidden />
        <span className={`${styles.bush} ${styles.bushTwo}`} aria-hidden />
        <span className={styles.path} aria-hidden />

        <div className={styles.promptCard}>
          <span aria-hidden>🔎</span>
          <div>
            <h1 id="symbol-hunt-prompt">{activity.prompt ?? activity.title}</h1>
            <p>{hint}</p>
          </div>
        </div>

        <div ref={fieldRef} className={styles.symbolField} data-symbol-hunt data-choices>
          {choices.map((choice, index) => (
            <button
              key={choice}
              type="button"
              className={`${styles.symbolChoice} ${[styles.slot1, styles.slot2, styles.slot3][index]} ${feedback === "good" && choice === activity.correctChoice ? styles.correct : ""}`}
              aria-label={`${activity.subjectId === "english" ? "Letter" : "Huruf"} ${choice}`}
              aria-pressed={feedback === "good" && choice === activity.correctChoice}
              disabled={feedback === "good"}
              onClick={() => choose(choice)}
            >
              {choice}
            </button>
          ))}
          <span className={`${styles.spark} ${styles.sparkOne}`} aria-hidden>✦</span>
          <span className={`${styles.spark} ${styles.sparkTwo}`} aria-hidden>✦</span>
          <span className={`${styles.flower} ${styles.flowerOne}`} aria-hidden>●</span>
          <span className={`${styles.flower} ${styles.flowerTwo}`} aria-hidden>●</span>
        </div>
      </section>

      {feedback === "try" ? <p role="status" className={styles.feedbackTry}>Belum tepat. Lihat bentuknya sekali lagi.</p> : null}
      {feedback === "good" ? (
        <div role="status" className={styles.feedbackGood}>
          <strong>Ketemu! ⭐</strong>
          <span>{activity.subjectId === "english" ? "Nice searching." : "Mata jeli, bentuknya cocok."}</span>
          <Link href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        </div>
      ) : null}
    </GardenActivityFrame>
  );
}
