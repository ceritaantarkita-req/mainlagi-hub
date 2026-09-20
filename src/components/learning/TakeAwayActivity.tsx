"use client";

import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { ActivityCompletion } from "./ActivityCompletion";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isTakeAwayActivity } from "@/lib/learning/gameplayPresentation";
import { takeAwayConfig } from "@/lib/learning/takeAwayConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./TakeAwayActivity.module.css";

function TakeAwayTokens({ startCount, removeCount, token }: { startCount: number; removeCount: number; token: string }) {
  const remainingCount = startCount - removeCount;
  return (
    <div
      className={styles.group}
      aria-label={`Kelompok awal berisi ${startCount}. ${removeCount} benda ditandai diambil.`}
      data-take-away-group
    >
      <div className={styles.groupHeader}>
        <span>Mulai</span>
        <strong>{startCount}</strong>
      </div>
      <div className={styles.tokens} aria-hidden>
        {Array.from({ length: startCount }, (_, index) => {
          const removed = index >= remainingCount;
          return (
            <span
              key={`take-away-${index}`}
              className={`${styles.token} ${removed ? styles.removedToken : styles.remainingToken}`}
              data-take-away-token
              data-take-away-removed={removed ? "true" : "false"}
            >
              {token}
            </span>
          );
        })}
      </div>
      <div className={styles.removeBadge} data-take-away-remove aria-label={`${removeCount} benda diambil`}>
        <span aria-hidden>−</span>
        <strong>{removeCount}</strong>
        <span>diambil</span>
      </div>
    </div>
  );
}

export function TakeAwayActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = takeAwayConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.takeAwayReady = "true";
  }, []);

  if (!activity || !config || !isTakeAwayActivity(activity) || !activity.correctChoice) return null;

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
          source: "take-away-runtime",
          evidenceFidelity: assessed ? "choice_take_away_interaction" : "completion_only",
          startCount: config.startCount,
          removeCount: config.removeCount,
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
        data-take-away
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>➖</span>
          <div>
            <h1>Ambil sebagian, hitung sisa</h1>
            <p>Benda yang dicoret berarti sudah diambil dari kelompok awal.</p>
          </div>
        </div>

        <div className={styles.board} role="group" aria-label="Papan pengurangan konkret" data-take-away-board>
          <TakeAwayTokens startCount={config.startCount} removeCount={config.removeCount} token={config.token} />
          <div className={styles.equation} aria-label={`${config.startCount} dikurangi ${config.removeCount} sama dengan sisa yang belum ditampilkan`}>
            <span>{config.startCount}</span>
            <span aria-hidden>−</span>
            <span>{config.removeCount}</span>
            <span aria-hidden>=</span>
            <strong
              className={`${styles.result} ${feedback === "good" ? styles.resultGood : ""}`}
              data-take-away-result
              aria-label={feedback === "good" ? `Sisa: ${activity.correctChoice}` : "Sisa masih disembunyikan"}
            >
              {feedback === "good" ? activity.correctChoice : "?"}
            </strong>
          </div>
        </div>

        <div className={styles.cueCard} data-take-away-cue>
          <span>Petunjuk</span>
          <strong>{config.cue}</strong>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih jumlah benda yang tersisa">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih sisa ${choice}`}
                aria-pressed={active}
                data-take-away-choice
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

        {feedback === "good" ? <ActivityCompletion childId={childId} activity={activity} /> : null}
      </section>
    </GardenActivityFrame>
  );
}
