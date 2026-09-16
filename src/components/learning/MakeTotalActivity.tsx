"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isMakeTotalActivity } from "@/lib/learning/gameplayPresentation";
import { makeTotalConfig } from "@/lib/learning/makeTotalConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./MakeTotalActivity.module.css";

function TokenGroup({ count, token, label }: { count: number; token: string; label: string }) {
  return (
    <div className={styles.group} aria-label={label}>
      <span className={styles.countLabel}>{count}</span>
      <div className={styles.tokens} aria-hidden>
        {Array.from({ length: count }, (_, index) => (
          <span key={`${label}-${index}`} className={styles.token}>{token}</span>
        ))}
      </div>
    </div>
  );
}

export function MakeTotalActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = makeTotalConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.makeTotalReady = "true";
  }, []);

  if (!activity || !config || !isMakeTotalActivity(activity) || !activity.correctChoice) return null;

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
          source: "make-total-runtime",
          evidenceFidelity: assessed ? "choice_make_total_interaction" : "completion_only",
          leftCount: config.leftCount,
          rightCount: config.rightCount,
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
        data-make-total
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>➕</span>
          <div>
            <h1>Gabungkan dua kelompok</h1>
            <p>Hitung semua benda setelah kedua kelompok disatukan.</p>
          </div>
        </div>

        <div className={styles.board} role="group" aria-label="Papan gabung dua kelompok" data-make-total-board>
          <TokenGroup count={config.leftCount} token={config.token} label={`Kelompok pertama berisi ${config.leftCount}`} />
          <span className={styles.operator} aria-hidden>+</span>
          <TokenGroup count={config.rightCount} token={config.token} label={`Kelompok kedua berisi ${config.rightCount}`} />
          <span className={styles.operator} aria-hidden>=</span>
          <div
            className={`${styles.result} ${feedback === "good" ? styles.resultGood : ""}`}
            data-make-total-result
            aria-label={feedback === "good" ? `Jumlah: ${activity.correctChoice}` : "Jumlah masih disembunyikan"}
          >
            {feedback === "good" ? activity.correctChoice : "?"}
          </div>
        </div>

        <div className={styles.cueCard} data-make-total-cue>
          <span>Petunjuk</span>
          <strong>{config.cue}</strong>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih jumlah seluruh benda">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih jumlah ${choice}`}
                aria-pressed={active}
                data-make-total-choice
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
