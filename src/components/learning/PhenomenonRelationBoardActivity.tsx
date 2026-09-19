"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  isPhenomenonRelationBoardActivity,
  phenomenonRelationBoardConfig
} from "@/lib/learning/phenomenonRelationBoardConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./PhenomenonRelationBoardActivity.module.css";

export function PhenomenonRelationBoardActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = phenomenonRelationBoardConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.phenomenonRelationReady = "true";
  }, []);

  if (!activity || !config || !isPhenomenonRelationBoardActivity(activity) || !activity.correctChoice) return null;

  const ecosystem = config.domainVariant === "ecosystem_dependency";

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
        metadata: ecosystem
          ? {
              source: "phenomenon-relation-board-runtime",
              evidenceFidelity: assessed ? "choice_ecosystem_dependency_relation_interaction" : "completion_only",
              domainVariant: "ecosystem_dependency",
              relationMode: config.mode,
              selectedChoice: choice,
              observationLabel: config.observationLabel,
              relationLabel: config.relationLabel
            }
          : {
              source: "phenomenon-relation-board-runtime",
              evidenceFidelity: assessed ? "choice_phenomenon_relation_interaction" : "completion_only",
              relationMode: config.mode,
              selectedChoice: choice,
              observationLabel: config.observationLabel,
              relationLabel: config.relationLabel
            }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const resolved = feedback === "good";
  const resultVisual = resolved ? config.choiceVisuals[activity.correctChoice] : null;

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
        className={`${styles.scene} ${resolved ? styles.sceneDone : ""}`}
        data-phenomenon-relation-board
        data-relation-domain={config.domainVariant}
        data-relation-mode={config.mode}
        data-relation-resolved={resolved ? "true" : "false"}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>{ecosystem ? "🌿" : "🔭"}</span>
          <div>
            <span className={styles.badge}>{ecosystem ? "Hubungan ekosistem" : "Pola Bumi & langit"}</span>
            <h1>{ecosystem ? "Hubungkan kebutuhan makhluk hidup" : "Hubungkan pengamatan"}</h1>
            <p>{activity.prompt}</p>
          </div>
        </div>

        <div
          className={styles.relationBoard}
          role="group"
          aria-label={ecosystem ? "Hubungan makhluk hidup dan kebutuhan lingkungan" : "Hubungan pengamatan dan hasil"}
        >
          <div className={styles.observationCard} data-relation-observation>
            <span className={styles.cardTag}>Pengamatan</span>
            <span className={styles.bigIcon} aria-hidden>{config.observationIcon}</span>
            <strong>{config.observationLabel}</strong>
          </div>

          <div className={styles.arrowWrap} aria-hidden>
            <span className={styles.arrow}>→</span>
            <span className={styles.arrowLabel}>hubungkan</span>
          </div>

          <div
            className={`${styles.resultCard} ${feedback === "try" ? styles.resultTry : ""} ${resolved ? styles.resultGood : ""}`}
            data-relation-result
            aria-label={resolved ? `Hubungan terjawab: ${activity.correctChoice}` : "Hubungan belum terjawab"}
          >
            <span className={styles.cardTag}>{config.relationLabel}</span>
            <span className={styles.bigIcon} aria-hidden>{resultVisual?.icon ?? "?"}</span>
            <strong data-relation-result-label>{resolved ? activity.correctChoice : "Pilih hubungan"}</strong>
          </div>
        </div>

        <div className={styles.cue} data-relation-cue>
          <span aria-hidden>💡</span>
          <span>{config.cue}</span>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilihan hubungan">
          {(activity.choices ?? []).map((choice) => {
            const active = selected === choice;
            const visual = config.choiceVisuals[choice];
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active && feedback === "try" ? styles.choiceTry : ""} ${active && resolved ? styles.choiceGood : ""}`}
                aria-label={`Pilih hubungan: ${choice}`}
                aria-pressed={active}
                data-phenomenon-relation-choice
                onClick={() => choose(choice)}
                disabled={resolved}
              >
                <span className={styles.choiceIcon} aria-hidden>{visual?.icon ?? "✨"}</span>
                <strong>{choice}</strong>
              </button>
            );
          })}
        </div>

        <div
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${resolved ? styles.statusGood : ""}`}
          role="status"
          aria-live="polite"
        >
          {resolved
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? ecosystem
                ? "💡 Belum tepat. Hubungan belum terisi—lihat lagi makhluk hidup atau perubahan sumber dayanya, lalu coba pilihan lain."
                : "💡 Belum tepat. Slot hubungan tetap kosong—lihat lagi pengamatan dan coba pilihan lain."
              : ecosystem
                ? "💡 Perhatikan makhluk hidup atau perubahan di kiri, lalu pilih hubungan yang paling sesuai."
                : "💡 Amati kondisi di kiri, lalu pilih hubungan yang paling sesuai."}
        </div>

        {resolved ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>
            Pilih permainan lain
          </Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
