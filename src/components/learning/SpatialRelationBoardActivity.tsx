"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import {
  isSpatialRelationBoardActivity,
  spatialRelationBoardConfig,
  type SpatialRelationBoardConfig
} from "@/lib/learning/spatialRelationBoardConfig";
import styles from "./SpatialRelationBoardActivity.module.css";

function RelationBoard({ config, revealResult }: { config: SpatialRelationBoardConfig; revealResult: boolean }) {
  const { kind, anchor, moving, secondaryAnchor } = config;

  if (kind === "between") {
    return (
      <div className={styles.objectRow} aria-hidden>
        <span>{anchor}</span>
        <span className={styles.moving}>{moving}</span>
        <span>{secondaryAnchor ?? anchor}</span>
      </div>
    );
  }

  if (kind === "left_of") {
    return <div className={styles.objectRow} aria-hidden><span className={styles.moving}>{moving}</span><span className={styles.anchor}>{anchor}</span></div>;
  }

  if (kind === "right_of") {
    return <div className={styles.objectRow} aria-hidden><span className={styles.anchor}>{anchor}</span><span className={styles.moving}>{moving}</span></div>;
  }

  if (kind === "above") {
    return (
      <div className={styles.verticalRelation} aria-hidden>
        <span className={styles.moving}>{moving}</span>
        <span className={styles.verticalArrow}>↑</span>
        <span className={styles.anchor}>{anchor}</span>
      </div>
    );
  }

  if (kind === "inside") {
    return (
      <div className={styles.containmentBoard} aria-hidden>
        <span className={styles.containerIcon}>{anchor}</span>
        <span className={styles.containedObject}>{moving}</span>
      </div>
    );
  }

  if (kind === "near") {
    return (
      <div className={styles.proximityBoard} aria-hidden>
        <span className={styles.nearTarget}>{moving}</span>
        <span className={styles.focusObject}>{anchor}</span>
        <span className={styles.distanceDots}>······</span>
        <span className={styles.farTarget}>{secondaryAnchor}</span>
      </div>
    );
  }

  if (kind === "turn_right" || kind === "turn_left") {
    return (
      <div className={styles.turnBoard} aria-hidden>
        <span className={styles.direction}>{anchor}</span>
        <span className={kind === "turn_right" ? styles.turnRight : styles.turnLeft}>{kind === "turn_right" ? "↷" : "↶"}</span>
        <span className={styles.direction} data-spatial-relation-result>{revealResult ? moving : "?"}</span>
      </div>
    );
  }

  return (
    <div className={styles.turnBoard} aria-hidden>
      <span className={styles.direction}>{anchor}</span>
      <span className={styles.opposite}>↔</span>
      <span className={styles.direction} data-spatial-relation-result>{revealResult ? moving : "?"}</span>
    </div>
  );
}

function boardAriaLabel(config: SpatialRelationBoardConfig, revealResult: boolean): string {
  if (config.mode === "turn" || config.mode === "opposite") {
    return `Papan arah awal ${config.anchor}; hasil ${revealResult ? config.moving : "belum diketahui"}`;
  }
  if (config.mode === "containment") return "Papan posisi benda di dalam wadah";
  if (config.mode === "proximity") return "Papan perbandingan jarak dekat dan jauh";
  return `Papan hubungan ruang ${config.kind}`;
}

export function SpatialRelationBoardActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = spatialRelationBoardConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.spatialRelationBoardReady = "true";
  }, []);

  if (!activity || !config || !isSpatialRelationBoardActivity(activity) || !activity.correctChoice) return null;

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
          source: "spatial-relation-board-runtime",
          evidenceFidelity: assessed ? "choice_spatial_relation_interaction" : "completion_only",
          mode: config.mode,
          relationOrTurn: config.relationOrTurn,
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
      <section ref={sceneRef} className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`} data-spatial-relation-board>
        <div className={styles.intro}>
          <span className={styles.badge}>Posisi & arah</span>
          <h1>Lihat hubungan ruangnya</h1>
          <p>{activity.prompt}</p>
        </div>

        <div
          className={styles.board}
          data-spatial-relation-visual
          data-relation-kind={config.kind}
          data-relation-mode={config.mode}
          aria-label={boardAriaLabel(config, feedback === "good")}
        >
          <RelationBoard config={config} revealResult={feedback === "good"} />
          <p>{config.cue}</p>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih jawaban posisi atau arah">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih jawaban ${choice}`}
                aria-pressed={active}
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
                data-spatial-relation-choice
              >
                {choice}
              </button>
            );
          })}
        </div>

        <div className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`} role="status" aria-live="polite">
          {feedback === "good" ? `⭐ Tepat! ${config.successText}` : feedback === "try" ? `💡 Coba lagi. ${config.cue}` : `💡 ${config.cue}`}
        </div>

        {feedback === "good" ? <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link> : null}
      </section>
    </GardenActivityFrame>
  );
}
