"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import {
  isPhraseSceneMatchActivity,
  phraseSceneMatchConfig,
  type PhraseSceneColor,
  type PhraseSceneSize,
  type PhraseSceneVisual
} from "@/lib/learning/phraseSceneMatchConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./PhraseSceneMatchActivity.module.css";

function colorClass(color: PhraseSceneColor | undefined): string {
  if (color === "red") return styles.red;
  if (color === "blue") return styles.blue;
  if (color === "green") return styles.green;
  if (color === "yellow") return styles.yellow;
  return "";
}

function sizeClass(size: PhraseSceneSize | undefined): string {
  if (size === "small") return styles.small;
  if (size === "big") return styles.big;
  return "";
}

function SceneToken({ scene }: { scene: PhraseSceneVisual }) {
  if (scene.noun === "ball") return <span className={`${styles.ball} ${colorClass(scene.color)}`} aria-hidden />;
  if (scene.noun === "book") return <span className={`${styles.book} ${colorClass(scene.color)}`} aria-hidden />;
  if (scene.noun === "cat") return <span className={`${styles.emojiToken} ${sizeClass(scene.size)}`} aria-hidden>🐱</span>;
  if (scene.noun === "dog") return <span className={`${styles.emojiToken} ${sizeClass(scene.size)}`} aria-hidden>🐶</span>;
  if (scene.noun === "banana") return <span className={styles.emojiToken} aria-hidden>🍌</span>;
  return <span className={styles.emojiToken} aria-hidden>🍏</span>;
}

function ChoiceScene({ scene }: { scene: PhraseSceneVisual }) {
  return (
    <span
      className={styles.sceneVisual}
      role="img"
      aria-label={scene.accessibleLabel}
      data-phrase-scene-visual
      data-scene-noun={scene.noun}
      data-scene-quantity={String(scene.quantity)}
      data-scene-color={scene.color ?? ""}
      data-scene-size={scene.size ?? ""}
    >
      <span className={styles.tokenRow} aria-hidden>
        {Array.from({ length: scene.quantity }, (_, index) => <SceneToken key={`${scene.label}-${index}`} scene={scene} />)}
      </span>
    </span>
  );
}

export function PhraseSceneMatchActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = phraseSceneMatchConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.phraseSceneMatchReady = "true";
  }, []);

  if (!activity || !config || !isPhraseSceneMatchActivity(activity) || !activity.correctChoice) return null;

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
          source: "phrase-scene-match-runtime",
          evidenceFidelity: assessed ? "choice_phrase_scene_interaction" : "completion_only",
          targetPhrase: config.targetPhrase,
          selectedChoice: choice,
          featureKinds: config.featureKinds.join("|")
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
      lang="en-US"
      spacious
    >
      <section
        ref={sceneRef}
        className={`${styles.scene} ${feedback === "good" ? styles.sceneDone : ""}`}
        data-phrase-scene-match
      >
        <div className={styles.intro}>
          <span className={styles.badge}>English phrases</span>
          <h1>Cocokkan frasa dengan scene</h1>
          <p data-phrase-scene-prompt>{activity.prompt}</p>
        </div>

        <div className={styles.choiceGrid} role="group" aria-label="Pilih scene yang cocok dengan frasa">
          {config.scenes.map((scene) => {
            const choice = scene.label;
            const active = selected === choice;
            return (
              <button
                key={choice}
                type="button"
                className={`${styles.choiceButton} ${active ? styles.selected : ""} ${active && feedback === "try" ? styles.wrong : ""} ${active && feedback === "good" ? styles.correct : ""}`}
                aria-label={`Pilih jawaban ${choice}`}
                aria-pressed={active}
                data-phrase-scene-choice
                onClick={() => choose(choice)}
                disabled={feedback === "good"}
              >
                <ChoiceScene scene={scene} />
                <span className={styles.choiceLabel}>{choice}</span>
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
              ? `💡 Coba lagi. ${config.cue}`
              : `💡 ${config.cue}`}
        </div>

        {feedback === "good" ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
