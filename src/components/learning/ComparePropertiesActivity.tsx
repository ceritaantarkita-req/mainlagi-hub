"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  compareChoiceForTarget,
  comparePropertiesConfig,
  type ComparePropertiesConfig,
  type ComparePropertyTarget,
  type QualitativeLevel
} from "@/lib/learning/comparePropertiesConfig";
import { isComparePropertiesActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./ComparePropertiesActivity.module.css";

function PropertyVisual({ kind, level }: { kind: "length" | "temperature" | "fill" | "capacity"; level: QualitativeLevel }) {
  if (kind === "length") {
    return <span className={`${styles.lengthVisual} ${styles[`length-${level}`]}`} aria-hidden />;
  }
  if (kind === "temperature") {
    return (
      <span className={styles.thermometer} aria-hidden>
        <span className={`${styles.thermometerFill} ${styles[`level-${level}`]}`} />
      </span>
    );
  }
  if (kind === "fill") {
    return (
      <span className={styles.glass} aria-hidden>
        <span className={`${styles.waterFill} ${styles[`level-${level}`]}`} />
      </span>
    );
  }
  return <span className={`${styles.capacityVisual} ${styles[`capacity-${level}`]}`} aria-hidden />;
}

function correctTargetFor(config: ComparePropertiesConfig): string {
  return config.correctTarget;
}

export function ComparePropertiesActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = comparePropertiesConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selectedTarget, setSelectedTarget] = useState<ComparePropertyTarget | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.comparePropertiesReady = "true";
  }, []);

  if (!activity || !config || !isComparePropertiesActivity(activity) || !activity.correctChoice) return null;

  const choose = (target: ComparePropertyTarget) => {
    if (feedback === "good") return;
    const choice = compareChoiceForTarget(config, target);
    if (!choice) return;
    setSelectedTarget(target);

    if (choice !== activity.correctChoice) {
      incorrectRef.current += 1;
      retryRef.current += 1;
      setFeedback("try");
      return;
    }

    const incorrectCount = incorrectRef.current;
    const accuracy = 1 / (1 + incorrectCount);
    const assessed = spec?.assessment === "assessed";
    const baseMetadata = {
      source: "compare-properties-runtime",
      evidenceFidelity: assessed ? "choice_compare_properties_interaction" : "completion_only",
      propertyKind: config.propertyKind,
      comparisonGoal: config.goal,
      correctTarget: correctTargetFor(config)
    };

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
        metadata: config.variant === "binary_compare"
          ? {
              ...baseMetadata,
              leftLevel: config.left.level,
              rightLevel: config.right.level
            }
          : {
              ...baseMetadata,
              variant: config.variant,
              selectedChoice: choice
            }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const stateClass = (target: ComparePropertyTarget) => {
    if (selectedTarget !== target) return "";
    return feedback === "good" ? styles.choiceGood : feedback === "try" ? styles.choiceTry : "";
  };

  const renderBinary = () => {
    if (config.variant !== "binary_compare") return null;
    return (
      <>
        <div className={styles.board} role="group" aria-label="Papan perbandingan sifat">
          {(["left", "right"] as const).map((target) => {
            const side = config[target];
            const showChoiceText = side.choice.trim().toLocaleLowerCase("id-ID") !== side.label.trim().toLocaleLowerCase("id-ID");
            return (
              <button
                key={target}
                type="button"
                className={`${styles.propertyCard} ${stateClass(target)}`}
                aria-label={`Pilih: ${side.choice}`}
                aria-pressed={selectedTarget === target}
                disabled={feedback === "good"}
                onClick={() => choose(target)}
                data-compare-property-choice={target}
              >
                <span className={styles.sideTag}>{target === "left" ? "A" : "B"}</span>
                <span className={styles.objectIcon} aria-hidden>{side.icon}</span>
                <PropertyVisual kind={config.propertyKind} level={side.level} />
                <strong>{side.label}</strong>
                {showChoiceText ? <span className={styles.choiceText}>{side.choice}</span> : null}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={`${styles.otherChoice} ${stateClass("other")}`}
          aria-label={`Pilih: ${config.otherChoice}`}
          aria-pressed={selectedTarget === "other"}
          disabled={feedback === "good"}
          onClick={() => choose("other")}
          data-compare-property-choice="other"
        >
          <span aria-hidden>◌</span>
          <strong>{config.otherChoice}</strong>
        </button>
      </>
    );
  };

  const renderMulti = () => {
    if (config.variant !== "multi_candidate_compare") return null;
    return (
      <div className={`${styles.board} ${styles.multiBoard}`} role="group" aria-label="Pilihan perbandingan sifat">
        {config.candidates.map((candidate, index) => {
          const target = `candidate-${index}` as ComparePropertyTarget;
          return (
            <button
              key={candidate.choice}
              type="button"
              className={`${styles.propertyCard} ${styles.multiCard} ${stateClass(target)}`}
              aria-label={`Pilih: ${candidate.choice}`}
              aria-pressed={selectedTarget === target}
              disabled={feedback === "good"}
              onClick={() => choose(target)}
              data-compare-property-choice={target}
            >
              <span className={styles.sideTag}>{String.fromCharCode(65 + index)}</span>
              <span className={styles.objectIcon} aria-hidden>{candidate.icon}</span>
              <PropertyVisual kind={config.propertyKind} level={candidate.level} />
              <strong>{candidate.label}</strong>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      title={activity.title}
      narration={activity.prompt ?? activity.title}
      lang="id-ID"
      spacious
    >
      <section ref={sceneRef} className={styles.scene} data-compare-properties data-compare-properties-variant={config.variant}>
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔬</span>
          <div>
            <h1>Bandingkan sifatnya</h1>
            <p>{config.cue}</p>
          </div>
        </div>

        {renderBinary()}
        {renderMulti()}

        <div
          className={`${styles.status} ${feedback === "good" ? styles.statusGood : feedback === "try" ? styles.statusTry : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "💡 Belum tepat. Bandingkan semua pilihan sekali lagi."
              : "💡 Pilih benda yang sesuai dengan sifat yang diminta."}
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
