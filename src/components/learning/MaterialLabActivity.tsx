"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityCompletion } from "./ActivityCompletion";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { LearningVisualToken } from "./LearningVisualToken";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isMaterialLabActivity } from "@/lib/learning/gameplayPresentation";
import { materialLabConfig } from "@/lib/learning/materialLabConfig";
import { planChildVisualHierarchy } from "@/lib/learning/childVisualHierarchy";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./MaterialLabActivity.module.css";
import visual from "./ChildVisualHierarchy.module.css";

export function MaterialLabActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = materialLabConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.materialLabReady = "true";
  }, []);

  if (!activity || !config || !isMaterialLabActivity(activity) || !activity.correctChoice) return null;

  const hierarchy = planChildVisualHierarchy({
    mode: "choice",
    activityTitle: activity.title,
    visibleInstruction: "Pilih sifat, lalu uji!",
    supportingHint: "Pilih sifat bahan yang paling cocok, lalu uji pilihanmu."
  });

  const testSelection = () => {
    if (!selected || feedback === "good") return;

    if (selected !== activity.correctChoice) {
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
          source: "material-lab-runtime",
          evidenceFidelity: assessed ? "choice_material_lab_interaction" : "completion_only",
          materialTestKind: config.testKind,
          objectLabel: config.objectLabel,
          purposeLabel: config.purposeLabel,
          testedChoice: selected
        }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const restart = () => {
    incorrectRef.current = 0;
    retryRef.current = 0;
    setSelected(null);
    setFeedback("idle");
    setHelpOpen(false);
  };

  const selectChoice = (choice: string) => {
    if (feedback === "good") return;
    setSelected(choice);
    setFeedback("idle");
  };

  const selectedVisual = selected ? config.choiceVisuals[selected] : null;

  return (
    <GardenActivityFrame
      backHref={`/child/${childId}/subject/${activity.subjectId}`}
      narration={activity.prompt ?? activity.title}
      lang="id-ID"
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`}
        data-material-lab
        data-child-visual-hierarchy="material-lab-vsg02"
        aria-label={hierarchy.contextTitle}
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>🧪</span>
          <h1 className={visual.primaryInstruction} data-material-lab-primary-instruction>{hierarchy.primaryInstruction}</h1>
          <button
            type="button"
            className={styles.helpButton}
            aria-label={helpOpen ? "Tutup bantuan" : "Cara main"}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen((value) => !value)}
          >{helpOpen ? "×" : "?"}</button>
        </div>
        {helpOpen && hierarchy.onDemandHelp ? (
          <p className={visual.assistance} data-material-lab-help>{hierarchy.onDemandHelp}</p>
        ) : null}

        <div className={styles.labBench} role="group" aria-label="Benda dan tujuan pengujian bahan">
          <div className={styles.objectCard}>
            <span className={styles.cardTag}>Benda</span>
            <LearningVisualToken className={styles.objectIcon} semanticKey={config.objectSemanticKey}>{config.objectIcon}</LearningVisualToken>
            <strong>{config.objectLabel}</strong>
          </div>
          <span className={styles.arrow} aria-hidden>→</span>
          <div className={styles.purposeCard}>
            <span className={styles.cardTag}>Tujuan</span>
            <LearningVisualToken className={styles.testIcon}>{config.testIcon}</LearningVisualToken>
            <strong>{config.purposeLabel}</strong>
          </div>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilihan sifat bahan">
          {(activity.choices ?? []).map((choice) => {
            const visual = config.choiceVisuals[choice];
            const isSelected = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.sampleButton} ${isSelected ? styles.sampleSelected : ""}`}
                aria-label={`Pilih sifat: ${choice}`}
                aria-pressed={isSelected}
                data-material-lab-choice
                onClick={() => selectChoice(choice)}
                disabled={feedback === "good"}
              >
                <LearningVisualToken className={styles.sampleIcon}>{visual?.icon ?? "🔬"}</LearningVisualToken>
                <strong>{visual?.sampleLabel ?? choice}</strong>
                <span className={styles.choiceText}>{choice}</span>
              </button>
            );
          })}
        </div>

        <div
          className={`${styles.testBench} ${feedback === "try" ? styles.testTry : ""} ${feedback === "good" ? styles.testGood : ""}`}
          aria-live="polite"
        >
          <div className={styles.selectedSample}>
            <span className={styles.cardTag}>Sampel</span>
            <LearningVisualToken className={styles.selectedIcon}>{selectedVisual?.icon ?? "❔"}</LearningVisualToken>
            <strong>{selectedVisual?.sampleLabel ?? "Pilih sifat dulu"}</strong>
          </div>
          <button
            type="button"
            className={styles.testButton}
            data-material-lab-test
            onClick={testSelection}
            disabled={!selected || feedback === "good"}
          >
            <LearningVisualToken className={styles.testButtonIcon}>{config.testIcon}</LearningVisualToken><span>{config.testLabel}</span>
          </button>
        </div>

        <div
          className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.srOnly : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? `⭐ Tepat! ${config.successText}`
            : feedback === "try"
              ? "Belum cocok. Coba sifat lain!"
              : selected
                ? `🔬 Sekarang ${config.testLabel.toLowerCase()}!`
                : ""}
        </div>

        {feedback === "good" ? (
          <ActivityCompletion childId={childId} activity={activity} onTryAgain={restart} concise />
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
