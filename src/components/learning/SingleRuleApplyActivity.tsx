"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  isSingleRuleApplyActivity,
  singleRuleApplyConfig,
  type SingleRuleChoiceVisual
} from "@/lib/learning/singleRuleApplyConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./SingleRuleApplyActivity.module.css";

function ChoiceVisual({ visual }: { visual: SingleRuleChoiceVisual }) {
  return (
    <span className={styles.choiceVisual} role="img" aria-label={visual.accessibleLabel}>
      {visual.icon}
    </span>
  );
}

export function SingleRuleApplyActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = singleRuleApplyConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.singleRuleApplyReady = "true";
  }, []);

  if (!activity || !config || !isSingleRuleApplyActivity(activity) || !activity.correctChoice) return null;

  const correctVisual = config.choiceVisuals.find((visual) => visual.label === activity.correctChoice);
  if (!correctVisual) return null;

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
          source: "single-rule-apply-runtime",
          evidenceFidelity: assessed ? "choice_single_rule_apply_interaction" : "completion_only",
          ruleMode: config.mode,
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
        data-single-rule-apply
        data-rule-mode={config.mode}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧠</span>
          <div>
            <span className={styles.badge}>Satu aturan</span>
            <h1>Terapkan aturannya</h1>
            <p data-single-rule-prompt>{activity.prompt}</p>
          </div>
        </div>

        <div className={styles.ruleBoard} role="group" aria-label="Satu aturan dan kondisi">
          <div className={styles.ruleCard} data-single-rule-rule>
            <span className={styles.cardTag}>Aturan</span>
            <strong>{config.ruleLabel}</strong>
          </div>
          <span className={styles.arrow} aria-hidden>→</span>
          <div className={styles.inputCard} data-single-rule-input>
            <span className={styles.cardTag}>Input / kondisi</span>
            <span className={styles.inputIcon} aria-hidden>{config.inputIcon}</span>
            <strong>{config.inputLabel}</strong>
          </div>
          <span className={styles.arrow} aria-hidden>→</span>
          <div
            className={`${styles.targetCard} ${feedback === "good" ? styles.targetComplete : ""}`}
            data-single-rule-target
            data-single-rule-target-state={feedback === "good" ? "complete" : "unknown"}
          >
            <span className={styles.cardTag}>{config.targetLabel}</span>
            {feedback === "good" ? (
              <>
                <ChoiceVisual visual={correctVisual} />
                <strong>{activity.correctChoice}</strong>
              </>
            ) : (
              <>
                <span className={styles.unknown} aria-hidden>?</span>
                <strong>Belum terisi</strong>
              </>
            )}
          </div>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilihan hasil aturan">
          {config.choiceVisuals.map((visual) => {
            const active = selected === visual.label;
            const stateClass = active && feedback === "try"
              ? styles.choiceTry
              : active && feedback === "good"
                ? styles.choiceGood
                : "";
            return (
              <button
                key={visual.label}
                type="button"
                className={`${styles.choiceButton} ${stateClass}`}
                aria-label={`Pilih hasil: ${visual.label}`}
                aria-pressed={active}
                data-single-rule-choice
                onClick={() => choose(visual.label)}
                disabled={feedback === "good"}
              >
                <ChoiceVisual visual={visual} />
                <span className={styles.choiceLabel}>{visual.label}</span>
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
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>
            Pilih permainan lain
          </Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
