"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  growthStageTransitionConfig,
  isGrowthStageTransitionActivity,
  type GrowthStageChoiceScene
} from "@/lib/learning/growthStageTransitionConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./GrowthStageTransitionActivity.module.css";

function StageCard({
  kind,
  icon,
  label,
  accessibleLabel,
  stageKey,
  targetState
}: {
  kind: "known" | "target";
  icon: string;
  label: string;
  accessibleLabel: string;
  stageKey: string;
  targetState?: "unknown" | "complete";
}) {
  return (
    <div
      className={`${styles.stageCard} ${kind === "target" ? styles.targetCard : styles.knownCard} ${targetState === "complete" ? styles.targetComplete : ""}`}
      data-growth-known={kind === "known" ? "true" : undefined}
      data-growth-target={kind === "target" ? "true" : undefined}
      data-growth-target-state={kind === "target" ? targetState : undefined}
      data-stage-key={stageKey}
    >
      <span className={styles.stageTag}>{kind === "known" ? "Tahap yang diketahui" : "Tahap yang dicari"}</span>
      <span className={styles.stageIcon} role="img" aria-label={accessibleLabel}>{icon}</span>
      <strong>{label}</strong>
    </div>
  );
}

function ChoiceVisual({ scene }: { scene: GrowthStageChoiceScene }) {
  return (
    <span
      className={styles.choiceVisual}
      role="img"
      aria-label={scene.accessibleLabel}
      data-growth-stage-choice-visual
      data-stage-key={scene.stageKey}
    >
      {scene.icon}
    </span>
  );
}

export function GrowthStageTransitionActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = growthStageTransitionConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.growthStageTransitionReady = "true";
  }, []);

  if (!activity || !config || !isGrowthStageTransitionActivity(activity) || !activity.correctChoice) return null;

  const correctScene = config.choiceScenes.find((scene) => scene.label === activity.correctChoice);
  if (!correctScene) return null;

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
          source: "growth-stage-transition-runtime",
          evidenceFidelity: assessed ? "choice_growth_stage_transition_interaction" : "completion_only",
          transitionMode: config.mode,
          selectedChoice: choice
        }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const targetCard = feedback === "good"
    ? (
        <StageCard
          kind="target"
          icon={correctScene.icon}
          label={activity.correctChoice}
          accessibleLabel={correctScene.accessibleLabel}
          stageKey={correctScene.stageKey}
          targetState="complete"
        />
      )
    : (
        <StageCard
          kind="target"
          icon="?"
          label={config.targetSlotLabel}
          accessibleLabel="tahap pertumbuhan belum terisi"
          stageKey="unknown"
          targetState="unknown"
        />
      );

  const knownCard = (
    <StageCard
      kind="known"
      icon={config.knownIcon}
      label={config.knownStageLabel}
      accessibleLabel={config.knownAccessibleLabel}
      stageKey={config.knownStageKey}
    />
  );

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
        data-growth-stage-transition
        data-transition-mode={config.mode}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🌿</span>
          <div>
            <span className={styles.badge}>Siklus hidup</span>
            <h1>Ikuti tahap pertumbuhannya</h1>
            <p data-growth-stage-prompt>{activity.prompt}</p>
          </div>
        </div>

        <div className={styles.flow} role="group" aria-label="Hubungan tahap pertumbuhan">
          {config.direction === "backward" ? targetCard : knownCard}
          <span className={`${styles.arrow} ${config.direction === "backward" ? styles.arrowBackward : ""}`} aria-hidden>→</span>
          {config.direction === "backward" ? knownCard : targetCard}
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilihan tahap pertumbuhan">
          {config.choiceScenes.map((scene) => {
            const active = selected === scene.label;
            const stateClass = active && feedback === "try"
              ? styles.choiceTry
              : active && feedback === "good"
                ? styles.choiceGood
                : "";
            return (
              <button
                key={scene.label}
                type="button"
                className={`${styles.choiceButton} ${stateClass}`}
                aria-label={`Pilih tahap: ${scene.label}`}
                aria-pressed={active}
                data-growth-stage-choice
                data-stage-key={scene.stageKey}
                onClick={() => choose(scene.label)}
                disabled={feedback === "good"}
              >
                <ChoiceVisual scene={scene} />
                <span className={styles.choiceLabel}>{scene.label}</span>
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
