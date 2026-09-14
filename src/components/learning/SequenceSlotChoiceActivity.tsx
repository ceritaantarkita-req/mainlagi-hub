"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSequenceSlotActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SequenceSlotChoiceActivity.module.css";

function neighbor(letter: string, offset: number): string {
  return String.fromCharCode(letter.charCodeAt(0) + offset);
}

function stableRotate<T>(values: readonly T[], seedText: string): T[] {
  if (!values.length) return [];
  let hash = 0;
  for (const char of seedText) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const offset = hash % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

export function SequenceSlotChoiceActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const sceneRef = useRef<HTMLElement | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [placed, setPlaced] = useState<string | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const choices = useMemo(() => stableRotate(activity?.choices ?? [], activityId), [activity?.choices, activityId]);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.sequenceSlotReady = "true";
  }, []);

  if (!activity || !isSequenceSlotActivity(activity) || !activity.correctChoice) return null;

  const correct = activity.correctChoice;
  const sequence = [neighbor(correct, -1), correct, neighbor(correct, 1)];

  const choose = (choice: string) => {
    if (feedback === "good") return;
    setPlaced(choice);

    if (choice !== correct) {
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
          source: "sequence-slot-runtime",
          evidenceFidelity: assessed ? "choice_sequence_interaction" : "completion_only"
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
      <section ref={sceneRef} className={styles.scene} data-sequence-slot>
        <div className={styles.promptCard}>
          <span aria-hidden>🔤</span>
          <div>
            <h1>{activity.prompt ?? activity.title}</h1>
            <p>Lengkapi urutan huruf dengan memilih kartu yang tepat.</p>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.sequenceLabel}>Urutan huruf</div>
          <div className={styles.sequenceRail} role="group" aria-label="Urutan huruf dengan satu bagian kosong">
            <div className={styles.fixedTile} aria-label={`Huruf ${sequence[0]}`}>{sequence[0]}</div>
            <div
              className={`${styles.slot} ${feedback === "try" ? styles.slotTry : ""} ${feedback === "good" ? styles.slotGood : ""}`}
              aria-label={placed ? `Slot berisi ${placed}` : "Slot huruf kosong"}
              data-sequence-slot-target
            >
              <span className={placed ? styles.slotValue : styles.slotQuestion}>{placed ?? "?"}</span>
            </div>
            <div className={styles.fixedTile} aria-label={`Huruf ${sequence[2]}`}>{sequence[2]}</div>
          </div>

          <div className={styles.choiceLabel}>Pilih huruf untuk slot kosong</div>
          <div className={styles.choices} role="group" aria-label="Pilihan huruf" data-sequence-choices>
            {choices.map((choice) => (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceTile} ${placed === choice && feedback === "try" ? styles.choiceTry : ""} ${placed === choice && feedback === "good" ? styles.choiceGood : ""}`}
                aria-label={`Pilih huruf ${choice}`}
                aria-pressed={placed === choice}
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
            ? "⭐ Tepat! Urutannya sudah lengkap."
            : feedback === "try"
              ? "💡 Belum tepat. Lihat huruf sebelum dan sesudah slot."
              : "💡 Cari huruf yang membuat urutannya benar."}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
