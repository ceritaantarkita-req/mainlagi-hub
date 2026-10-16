"use client";

import { ActivityCompletion } from "./ActivityCompletion";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSortingBucketsActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import { planChildVisualHierarchy } from "@/lib/learning/childVisualHierarchy";
import visual from "./ChildVisualHierarchy.module.css";
import styles from "./SortingBucketsChoiceActivity.module.css";

type Bucket = "match" | "other";

export function SortingBucketsChoiceActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, Bucket>>({});
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [done, setDone] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.sortingBucketsReady = "true";
  }, []);

  if (!activity || !isSortingBucketsActivity(activity) || !activity.correctChoice) return null;

  const choices = activity.choices ?? [];
  const correct = activity.correctChoice;
  const remaining = choices.filter((choice) => !placed[choice]);
  const matchingItems = choices.filter((choice) => placed[choice] === "match");
  const otherItems = choices.filter((choice) => placed[choice] === "other");
  const hierarchy = planChildVisualHierarchy({
    mode: "sorting",
    activityTitle: activity.title,
    visibleInstruction: activity.prompt ?? activity.title,
    supportingHint: "Pilih satu kartu, lalu masukkan ke keranjang yang sesuai."
  });

  const placeSelected = (bucket: Bucket) => {
    if (!selected || done) return;
    const expected: Bucket = selected === correct ? "match" : "other";
    if (bucket !== expected) {
      incorrectRef.current += 1;
      retryRef.current += 1;
      setFeedback("try");
      return;
    }

    const nextPlaced = { ...placed, [selected]: bucket };
    setPlaced(nextPlaced);
    setSelected(null);

    if (Object.keys(nextPlaced).length === choices.length) {
      const correctCount = choices.length;
      const incorrectCount = incorrectRef.current;
      const accuracy = correctCount / (correctCount + incorrectCount);
      const assessed = spec?.assessment === "assessed";
      emitLearningRuntimeMeasurement({
        childId,
        activityId: activity.id,
        outcome: {
          status: "completed",
          assessed,
          accuracy: assessed ? accuracy : undefined,
          score: assessed ? accuracy : undefined,
          correctCount: assessed ? correctCount : undefined,
          incorrectCount: assessed ? incorrectCount : undefined,
          retryCount: assessed ? retryRef.current : undefined,
          inputMode: activity.preferredMobile,
          metadata: {
            source: "sorting-buckets-runtime",
            evidenceFidelity: assessed ? "choice_sorting_interaction" : "completion_only",
            sortedItemCount: correctCount
          }
        }
      });
      completeActivity(childId, activity.id);
      setDone(true);
      setFeedback("good");
      return;
    }

    setFeedback("idle");
  };

  const restart = () => {
    incorrectRef.current = 0;
    retryRef.current = 0;
    setSelected(null);
    setPlaced({});
    setFeedback("idle");
    setDone(false);
    setHelpOpen(false);
  };

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      narration={activity.prompt ?? activity.title}
      lang="id-ID"
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${done ? styles.sceneDone : ""}`}
        data-sorting-buckets
        data-sorting-buckets-done={done ? "true" : "false"}
        data-child-visual-hierarchy="sorting-v1"
        aria-label={hierarchy.contextTitle}
      >
        <header className={styles.instructions}>
          <h1 className={visual.primaryInstruction} data-sorting-primary-instruction>{hierarchy.primaryInstruction}</h1>
          {hierarchy.onDemandHelp ? (
            <>
              <button type="button" className={styles.helpButton} aria-expanded={helpOpen} onClick={() => setHelpOpen((value) => !value)}>
                {helpOpen ? "Tutup bantuan" : "Cara main"}
              </button>
              {helpOpen ? <p className={visual.assistance} data-sorting-help>{hierarchy.onDemandHelp}</p> : null}
            </>
          ) : null}
        </header>

        <div className={styles.board}>
          <div className={styles.cardTray} role="group" aria-label="Kartu untuk dikelompokkan" data-sorting-cards>
            {remaining.map((choice) => (
              <button
                key={choice}
                type="button"
                className={`${styles.itemCard} ${selected === choice ? styles.itemSelected : ""}`}
                aria-label={`Pilih kartu ${choice}`}
                aria-pressed={selected === choice}
                onClick={() => {
                  setSelected(choice);
                  if (feedback === "try") setFeedback("idle");
                }}
              >
                {choice}
              </button>
            ))}
            {remaining.length === 0 ? <div className={styles.trayDone}>Semua kartu sudah masuk ✓</div> : null}
          </div>

          <div className={styles.buckets} role="group" aria-label="Keranjang pengelompokan">
            <button
              type="button"
              className={`${styles.bucket} ${styles.bucketMatch}`}
              aria-label="Masukkan ke sesuai aturan"
              disabled={!selected || done}
              onClick={() => placeSelected("match")}
            >
              <span className={styles.bucketIcon} aria-hidden>✓</span>
              <strong>Sesuai aturan</strong>
              <span className={styles.bucketSub}>Cocok dengan pertanyaan</span>
              <span className={styles.bucketItems} data-sorting-match-items>
                {matchingItems.map((item) => <span key={item}>{item}</span>)}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.bucket} ${styles.bucketOther}`}
              aria-label="Masukkan ke tidak sesuai"
              disabled={!selected || done}
              onClick={() => placeSelected("other")}
            >
              <span className={styles.bucketIcon} aria-hidden>↺</span>
              <strong>Tidak sesuai</strong>
              <span className={styles.bucketSub}>Bukan jawaban aturan ini</span>
              <span className={styles.bucketItems} data-sorting-other-items>
                {otherItems.map((item) => <span key={item}>{item}</span>)}
              </span>
            </button>
          </div>
        </div>

        {(selected || feedback !== "idle") ? (
          <div className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`} role="status" aria-live="polite">
            {feedback === "good"
              ? "⭐ Rapi! Semua kartu sudah dikelompokkan."
              : feedback === "try"
                ? "💡 Belum tepat. Coba keranjang satunya."
                : `👆 Kartu ${selected} dipilih. Sekarang pilih keranjang.`}
          </div>
        ) : null}

        {done ? <ActivityCompletion childId={childId} activity={activity} onTryAgain={restart} /> : null}
      </section>
    </GardenActivityFrame>
  );
}
