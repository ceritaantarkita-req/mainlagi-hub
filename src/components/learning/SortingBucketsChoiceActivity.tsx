"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSortingBucketsActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
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

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.sortingBucketsReady = "true";
  }, []);

  if (!activity || !isSortingBucketsActivity(activity) || !activity.correctChoice) return null;

  const choices = activity.choices ?? [];
  const correct = activity.correctChoice;
  const remaining = choices.filter((choice) => !placed[choice]);
  const matchingItems = choices.filter((choice) => placed[choice] === "match");
  const otherItems = choices.filter((choice) => placed[choice] === "other");

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

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      title={activity.title}
      narration={activity.prompt ?? activity.title}
      lang="id-ID"
      spacious
    >
      <section ref={sceneRef} className={styles.scene} data-sorting-buckets>
        <div className={styles.promptCard}>
          <span aria-hidden>🗂️</span>
          <div>
            <h1>{activity.prompt ?? activity.title}</h1>
            <p>Pilih satu kartu, lalu masukkan ke keranjang yang sesuai.</p>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.trayLabel}>Kartu yang perlu dikelompokkan</div>
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

          <div className={styles.bucketHint}>{selected ? `Kartu ${selected} dipilih. Masukkan ke keranjang.` : "Pilih satu kartu dulu."}</div>

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

        <div className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`} role="status" aria-live="polite">
          {feedback === "good"
            ? "⭐ Rapi! Semua kartu sudah dikelompokkan."
            : feedback === "try"
              ? "💡 Belum tepat. Coba keranjang satunya."
              : selected
                ? "👆 Pilih keranjang untuk kartu ini."
                : "💡 Kelompokkan ketiga kartu sesuai aturannya."}
        </div>

        {done ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
