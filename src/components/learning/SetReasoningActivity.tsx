"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isSetReasoningActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { setReasoningConfig } from "@/lib/learning/setReasoningConfig";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SetReasoningActivity.module.css";

export function SetReasoningActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = setReasoningConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.setReasoningReady = "true";
  }, []);

  if (!activity || !config || !isSetReasoningActivity(activity) || !activity.correctChoice) return null;

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
          source: "set-reasoning-runtime",
          evidenceFidelity: assessed ? "choice_set_reasoning_interaction" : "completion_only",
          setRules: config.rules,
          operationLabel: config.operationLabel,
          selectedMember: choice,
          ruleCount: 2
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
        data-set-reasoning
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧩</span>
          <div>
            <h1>Cari anggota yang cocok</h1>
            <p>Baca dua aturan himpunan, lalu pilih anggota yang memenuhi keduanya.</p>
          </div>
        </div>

        <div className={styles.ruleBoard} role="group" aria-label="Dua aturan himpunan">
          {config.rules.map((rule, index) => (
            <div
              key={`${rule.label}-${index}`}
              className={`${styles.ruleCard} ${rule.membership === "in" ? styles.ruleIn : styles.ruleOut}`}
              data-set-rule
              data-membership={rule.membership}
            >
              <span className={styles.ruleIndex}>Aturan {index + 1}</span>
              <span className={styles.ruleState} aria-hidden>{rule.membership === "in" ? "✓" : "✕"}</span>
              <strong>{rule.label}</strong>
              <small>{rule.membership === "in" ? "harus masuk" : "harus di luar"}</small>
            </div>
          ))}
          <div className={styles.operationCard} data-set-operation>
            <span>Target</span>
            <strong>{config.operationLabel}</strong>
          </div>
        </div>

        <div className={styles.targetCard}>
          <span className={styles.targetBadge}>Cari anggota</span>
          <strong>{config.targetLabel}</strong>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih anggota himpunan">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih anggota himpunan: ${choice}`}
                aria-pressed={active}
                data-set-reasoning-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <span className={styles.choiceMarker} aria-hidden>?</span>
                <strong>{config.choiceLabels[choice] ?? choice}</strong>
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
              ? "💡 Belum tepat. Cek lagi: apakah pilihanmu harus masuk atau justru di luar setiap kelompok?"
              : "💡 Gunakan kedua aturan. Satu pilihan harus memenuhi semuanya sekaligus."}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
