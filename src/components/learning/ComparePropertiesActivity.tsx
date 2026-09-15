"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  compareChoiceForTarget,
  comparePropertiesConfig,
  type ComparePropertyTarget
} from "@/lib/learning/comparePropertiesConfig";
import { isComparePropertiesActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./ComparePropertiesActivity.module.css";

function PropertyVisual({ kind, level }: { kind: "length" | "temperature" | "fill"; level: "low" | "high" }) {
  if (kind === "length") {
    return <span className={`${styles.lengthVisual} ${level === "high" ? styles.lengthHigh : styles.lengthLow}`} aria-hidden />;
  }
  if (kind === "temperature") {
    return (
      <span className={styles.thermometer} aria-hidden>
        <span className={`${styles.thermometerFill} ${level === "high" ? styles.levelHigh : styles.levelLow}`} />
      </span>
    );
  }
  return (
    <span className={styles.glass} aria-hidden>
      <span className={`${styles.waterFill} ${level === "high" ? styles.levelHigh : styles.levelLow}`} />
    </span>
  );
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
          source: "compare-properties-runtime",
          evidenceFidelity: assessed ? "choice_compare_properties_interaction" : "completion_only",
          propertyKind: config.propertyKind,
          comparisonGoal: config.goal,
          correctTarget: config.correctTarget,
          leftLevel: config.left.level,
          rightLevel: config.right.level
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

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      title={activity.title}
      narration={activity.prompt ?? activity.title}
      lang="id-ID"
      spacious
    >
      <section ref={sceneRef} className={styles.scene} data-compare-properties>
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🔬</span>
          <div>
            <h1>Bandingkan sifatnya</h1>
            <p>{config.cue}</p>
          </div>
        </div>

        <div className={styles.board} role="group" aria-label="Papan perbandingan sifat">
          {(["left", "right"] as const).map((target) => {
            const side = config[target];
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
                <span className={styles.choiceText}>{side.choice}</span>
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

        <div
          className={`${styles.status} ${feedback === "good" ? styles.statusGood : feedback === "try" ? styles.statusTry : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "💡 Belum tepat. Bandingkan kedua benda sekali lagi."
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
