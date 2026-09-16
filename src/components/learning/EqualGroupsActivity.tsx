"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { equalGroupsConfig } from "@/lib/learning/equalGroupsConfig";
import { isEqualGroupsActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./EqualGroupsActivity.module.css";

function GroupBoard({ totalCount, groupSize, token }: { totalCount: number; groupSize: number; token: string }) {
  const groupCount = totalCount / groupSize;
  return (
    <div
      className={styles.groups}
      role="group"
      aria-label={`${totalCount} benda dibagi menjadi kelompok yang masing-masing berisi ${groupSize}`}
      data-equal-groups-board
    >
      {Array.from({ length: groupCount }, (_, groupIndex) => (
        <div
          key={`equal-group-${groupIndex}`}
          className={styles.group}
          aria-label={`Kelompok ${groupIndex + 1}, berisi ${groupSize} benda`}
          data-equal-groups-group
        >
          <span className={styles.groupLabel}>Kelompok {groupIndex + 1}</span>
          <div className={styles.tokens} aria-hidden>
            {Array.from({ length: groupSize }, (_, tokenIndex) => (
              <span key={`${groupIndex}-${tokenIndex}`} className={styles.token} data-equal-groups-token>{token}</span>
            ))}
          </div>
          <strong className={styles.groupSize}>isi {groupSize}</strong>
        </div>
      ))}
    </div>
  );
}

export function EqualGroupsActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = equalGroupsConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.equalGroupsReady = "true";
  }, []);

  if (!activity || !config || !isEqualGroupsActivity(activity) || !activity.correctChoice) return null;

  const groupCount = config.totalCount / config.groupSize;

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
          source: "equal-groups-runtime",
          evidenceFidelity: assessed ? "choice_equal_groups_interaction" : "completion_only",
          totalCount: config.totalCount,
          groupSize: config.groupSize,
          groupCount,
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
        data-equal-groups
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>👥</span>
          <div>
            <h1>Buat kelompok yang sama besar</h1>
            <p>Setiap kotak harus berisi jumlah benda yang sama.</p>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.summary} aria-label={`${config.totalCount} benda, isi ${config.groupSize} per kelompok`}>
            <span><strong>{config.totalCount}</strong> benda</span>
            <span aria-hidden>→</span>
            <span>isi <strong>{config.groupSize}</strong> tiap kelompok</span>
          </div>
          <GroupBoard totalCount={config.totalCount} groupSize={config.groupSize} token={config.token} />
          <div className={styles.questionRow}>
            <span>Berapa kelompok?</span>
            <strong
              className={`${styles.result} ${feedback === "good" ? styles.resultGood : ""}`}
              data-equal-groups-result
              aria-label={feedback === "good" ? `Jumlah kelompok: ${activity.correctChoice}` : "Jumlah kelompok masih disembunyikan"}
            >
              {feedback === "good" ? activity.correctChoice : "?"}
            </strong>
          </div>
        </div>

        <div className={styles.cueCard} data-equal-groups-cue>
          <span>Petunjuk</span>
          <strong>{config.cue}</strong>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih jumlah kelompok">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih ${choice} kelompok`}
                aria-pressed={active}
                data-equal-groups-choice
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
