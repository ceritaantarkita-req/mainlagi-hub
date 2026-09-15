"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isLivingFeatureFunctionActivity } from "@/lib/learning/gameplayPresentation";
import { livingFeatureFunctionConfig } from "@/lib/learning/livingFeatureFunctionConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./LivingFeatureFunctionActivity.module.css";

export function LivingFeatureFunctionActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = livingFeatureFunctionConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.livingFeatureFunctionReady = "true";
  }, []);

  if (!activity || !config || !isLivingFeatureFunctionActivity(activity) || !activity.correctChoice) return null;

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
          source: "living-feature-function-runtime",
          evidenceFidelity: assessed ? "choice_living_feature_function_interaction" : "completion_only",
          organismLabel: config.organismLabel,
          featureLabel: config.featureLabel,
          selectedFunction: choice
        }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const stateClass = (choice: string) => {
    if (selected !== choice) return "";
    return feedback === "good" ? styles.choiceGood : feedback === "try" ? styles.choiceTry : styles.choiceSelected;
  };

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      title={activity.title}
      narration={activity.prompt ?? activity.title}
      lang="id-ID"
      spacious
    >
      <section ref={sceneRef} className={styles.scene} data-living-feature-function>
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔎</span>
          <div>
            <h1>Cocokkan ciri dan fungsi</h1>
            <p>{config.relationCue}</p>
          </div>
        </div>

        <div className={styles.relationBoard} aria-label={`${config.organismLabel}, ciri ${config.featureLabel}`}>
          <div className={styles.organismCard}>
            <span className={styles.cardTag}>Makhluk hidup</span>
            <span className={styles.organismIcon} aria-hidden>{config.organismIcon}</span>
            <strong>{config.organismLabel}</strong>
          </div>
          <span className={styles.relationArrow} aria-hidden>→</span>
          <div className={styles.featureCard}>
            <span className={styles.cardTag}>Ciri</span>
            <span className={styles.featureIcon} aria-hidden>{config.featureIcon}</span>
            <strong>{config.featureLabel}</strong>
          </div>
          <span className={styles.relationArrow} aria-hidden>→</span>
          <div className={styles.functionSlot}>
            <span className={styles.cardTag}>Fungsi</span>
            <span className={styles.questionIcon} aria-hidden>?</span>
            <strong>{feedback === "good" ? config.choiceVisuals[activity.correctChoice]?.shortLabel : "Pilih fungsi"}</strong>
          </div>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilihan fungsi ciri">
          {(activity.choices ?? []).map((choice) => {
            const visual = config.choiceVisuals[choice];
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.functionChoice} ${stateClass(choice)}`}
                aria-label={`Pilih fungsi: ${choice}`}
                aria-pressed={selected === choice}
                disabled={feedback === "good"}
                onClick={() => choose(choice)}
                data-feature-function-choice
              >
                <span className={styles.choiceIcon} aria-hidden>{visual?.icon ?? "🔗"}</span>
                <strong>{visual?.shortLabel ?? choice}</strong>
                <span className={styles.choiceText}>{choice}</span>
              </button>
            );
          })}
        </div>

        <div
          className={`${styles.status} ${feedback === "good" ? styles.statusGood : feedback === "try" ? styles.statusTry : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "💡 Fungsi itu belum cocok dengan cirinya. Lihat cirinya lagi lalu pilih fungsi lain."
              : "💡 Hubungkan ciri yang terlihat dengan fungsi yang paling masuk akal."}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>
            Pilih permainan lain
          </Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
