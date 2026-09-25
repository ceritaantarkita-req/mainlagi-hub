"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { LearningVisualToken } from "./LearningVisualToken";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { featureFunctionLinkConfig } from "@/lib/learning/featureFunctionLinkConfig";
import { isFeatureFunctionLinkActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./FeatureFunctionLinkActivity.module.css";

export function FeatureFunctionLinkActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = featureFunctionLinkConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.featureFunctionLinkReady = "true";
  }, []);

  if (!activity || !config || !isFeatureFunctionLinkActivity(activity) || !activity.correctChoice) return null;

  const chooseFunction = (choice: string) => {
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
          source: "feature-function-link-runtime",
          evidenceFidelity: assessed ? "choice_feature_function_link_interaction" : "completion_only",
          subjectLabel: config.subjectLabel,
          featureLabel: config.featureLabel,
          linkedFunction: choice
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
        data-feature-function-link
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔗</span>
          <div>
            <h1>Hubungkan ciri dan fungsi</h1>
            <p>{config.contextLabel}</p>
          </div>
        </div>

        <div className={styles.map} role="group" aria-label="Ciri makhluk hidup dan pilihan fungsi">
          <div className={styles.featureColumn}>
            <div className={styles.subjectCard}>
              <LearningVisualToken className={styles.subjectIcon} label={config.subjectLabel} semanticKey={config.subjectSemanticKey}>{config.subjectIcon}</LearningVisualToken>
              <strong>{config.subjectLabel}</strong>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.cardTag}>Ciri</span>
              <LearningVisualToken className={styles.featureIcon} label={config.featureLabel} semanticKey={config.featureSemanticKey}>{config.featureIcon}</LearningVisualToken>
              <strong>{config.featureLabel}</strong>
            </div>
          </div>

          <div className={styles.connector} aria-hidden>
            <span className={styles.connectorDot} />
            <span className={styles.connectorLine} />
            <span className={styles.connectorArrow}>→</span>
          </div>

          <div className={styles.functionColumn}>
            <span className={styles.functionHeading}>Fungsi mana yang cocok?</span>
            {(activity.choices ?? []).map((choice) => {
              const visual = config.choiceVisuals[choice];
              const isSelected = selected === choice;
              const isWrongSelected = isSelected && feedback === "try";
              const isCorrectSelected = isSelected && feedback === "good";
              return (
                <button
                  key={choice}
                  type="button"
                  className={`${styles.functionButton} ${isSelected ? styles.functionSelected : ""} ${isWrongSelected ? styles.functionWrong : ""} ${isCorrectSelected ? styles.functionCorrect : ""}`}
                  aria-label={`Hubungkan fungsi: ${choice}`}
                  aria-pressed={isSelected}
                  data-feature-function-choice
                  onClick={() => chooseFunction(choice)}
                  disabled={feedback === "good"}
                >
                  <LearningVisualToken className={styles.functionIcon}>{visual?.icon ?? "✨"}</LearningVisualToken>
                  <span>{visual?.label ?? choice}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "💡 Fungsi itu belum cocok dengan cirinya. Coba hubungkan ke fungsi lain."
              : "💡 Pilih fungsi yang paling sesuai dengan ciri yang ditunjukkan."}
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
