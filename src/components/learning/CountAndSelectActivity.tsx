"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isCountAndSelectActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./CountAndSelectActivity.module.css";

function stableRotate<T>(values: readonly T[], seedText: string): T[] {
  if (!values.length) return [];
  let hash = 0;
  for (const char of seedText) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const offset = hash % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function countSymbols(prompt: string, fallback: string, target: number): string[] {
  const visualPrefix = prompt.split(/Ada berapa/i)[0]?.trim() ?? "";
  const tokens = visualPrefix.split(/\s+/).filter(Boolean);
  if (tokens.length === target) return tokens;
  return Array.from({ length: target }, () => fallback);
}

export function CountAndSelectActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [selected, setSelected] = useState<string | null>(null);
  const choices = useMemo(() => stableRotate(activity?.choices ?? [], activityId), [activity?.choices, activityId]);
  const targetCount = Number(activity?.correctChoice ?? 0);
  const symbols = useMemo(
    () => countSymbols(activity?.prompt ?? "", activity?.emoji ?? "●", targetCount),
    [activity?.prompt, activity?.emoji, targetCount]
  );

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.countSelectReady = "true";
  }, []);

  if (!activity || !isCountAndSelectActivity(activity) || !activity.correctChoice || !Number.isInteger(targetCount) || targetCount < 1) return null;

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
          source: "count-select-runtime",
          evidenceFidelity: assessed ? "choice_count_interaction" : "completion_only",
          countTarget: targetCount
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
      <section ref={sceneRef} className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`} data-count-select>
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔢</span>
          <div>
            <h1>Ada berapa?</h1>
            <p>Hitung benda satu per satu, lalu pilih jumlah yang tepat.</p>
          </div>
        </div>

        <div className={styles.board}>
          <div
            className={styles.objectField}
            role="img"
            aria-label={`Kumpulan benda untuk dihitung pada aktivitas ${activity.title}`}
            data-count-objects
          >
            {symbols.map((symbol, index) => (
              <span key={`${symbol}-${index}`} className={styles.objectToken} aria-hidden>{symbol}</span>
            ))}
          </div>

          <div className={styles.choiceLabel}>Pilih jumlahnya</div>
          <div className={styles.choices} role="group" aria-label="Pilihan jumlah" data-count-choices>
            {choices.map((choice) => (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceTile} ${selected === choice && feedback === "try" ? styles.choiceTry : ""} ${selected === choice && feedback === "good" ? styles.choiceGood : ""}`}
                aria-label={`Pilih jumlah ${choice}`}
                aria-pressed={selected === choice}
                disabled={feedback === "good"}
                onClick={() => choose(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        <div className={`${styles.status} ${feedback === "good" ? styles.statusGood : feedback === "try" ? styles.statusTry : ""}`} role="status" aria-live="polite">
          {feedback === "good"
            ? `⭐ Tepat! Jumlahnya ${activity.correctChoice}.`
            : feedback === "try"
              ? "💡 Belum tepat. Sentuh tiap benda sambil menghitung pelan-pelan."
              : "💡 Mulai dari satu dan hitung setiap benda sekali."}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
