"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isMoreLessBalanceActivity } from "@/lib/learning/gameplayPresentation";
import { balanceChoiceForSide, moreLessBalanceConfig, type BalanceSide } from "@/lib/learning/moreLessBalanceConfig";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./MoreLessBalanceActivity.module.css";

function Tokens({ token, count }: { token: string; count: number }) {
  return (
    <span className={styles.tokens} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <span key={`${token}-${index}`} className={styles.token}>{token}</span>
      ))}
    </span>
  );
}

export function MoreLessBalanceActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const config = moreLessBalanceConfig(activity);
  const sceneRef = useRef<HTMLElement | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [selectedSide, setSelectedSide] = useState<BalanceSide | null>(null);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.moreLessBalanceReady = "true";
  }, []);

  if (!activity || !config || !isMoreLessBalanceActivity(activity) || !activity.correctChoice) return null;

  const leftChoice = balanceChoiceForSide(activity, config, "left");
  const equalChoice = balanceChoiceForSide(activity, config, "equal");
  const rightChoice = balanceChoiceForSide(activity, config, "right");
  if (!leftChoice || !equalChoice || !rightChoice) return null;

  const correctSide = config.choiceToSide[activity.correctChoice];

  const choose = (side: BalanceSide) => {
    if (feedback === "good") return;
    const choice = balanceChoiceForSide(activity, config, side);
    if (!choice) return;
    setSelectedSide(side);

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
          source: "more-less-balance-runtime",
          evidenceFidelity: assessed ? "choice_balance_comparison_interaction" : "completion_only",
          comparisonGoal: config.goal,
          leftCount: config.left.count,
          rightCount: config.right.count,
          correctSide
        }
      }
    });

    completeActivity(childId, activity.id);
    setFeedback("good");
  };

  const selectedClass = (side: BalanceSide) => {
    if (selectedSide !== side) return "";
    if (feedback === "good") return styles.choiceGood;
    if (feedback === "try") return styles.choiceTry;
    return "";
  };

  const resolvedBalanceClass =
    feedback !== "good"
      ? ""
      : config.left.count === config.right.count
        ? styles.balanceEqual
        : config.left.count > config.right.count
          ? styles.balanceLeftHeavy
          : styles.balanceRightHeavy;

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
        data-more-less-balance
      >
        <div className={styles.promptCard}>
          <span className={styles.promptIcon} aria-hidden>⚖️</span>
          <div>
            <h1>Bandingkan dua sisi</h1>
            <p>{config.cue}</p>
          </div>
        </div>

        <div className={styles.board}>
          <div className={`${styles.balance} ${resolvedBalanceClass}`} aria-label="Timbangan perbandingan">
            <div className={styles.beam} aria-hidden />
            <div className={styles.post} aria-hidden />
            <div className={styles.base} aria-hidden />

            <button
              type="button"
              className={`${styles.panButton} ${styles.leftPan} ${selectedClass("left")}`}
              aria-label={`Pilih sisi kiri: ${leftChoice}`}
              aria-pressed={selectedSide === "left"}
              disabled={feedback === "good"}
              onClick={() => choose("left")}
              data-balance-choice="left"
            >
              <span className={styles.sideLabel}>KIRI</span>
              <Tokens token={config.left.token} count={config.left.count} />
              <strong>{config.left.label}</strong>
              <span className={styles.canonicalChoice}>{leftChoice}</span>
            </button>

            <button
              type="button"
              className={`${styles.equalButton} ${selectedClass("equal")}`}
              aria-label={`Pilih sama: ${equalChoice}`}
              aria-pressed={selectedSide === "equal"}
              disabled={feedback === "good"}
              onClick={() => choose("equal")}
              data-balance-choice="equal"
            >
              <span aria-hidden>=</span>
              <small>{equalChoice}</small>
            </button>

            <button
              type="button"
              className={`${styles.panButton} ${styles.rightPan} ${selectedClass("right")}`}
              aria-label={`Pilih sisi kanan: ${rightChoice}`}
              aria-pressed={selectedSide === "right"}
              disabled={feedback === "good"}
              onClick={() => choose("right")}
              data-balance-choice="right"
            >
              <span className={styles.sideLabel}>KANAN</span>
              <Tokens token={config.right.token} count={config.right.count} />
              <strong>{config.right.label}</strong>
              <span className={styles.canonicalChoice}>{rightChoice}</span>
            </button>
          </div>

          <p className={styles.hint}>
            {config.goal === "more"
              ? "Cari sisi yang jumlahnya lebih banyak."
              : config.goal === "less"
                ? "Cari sisi yang jumlahnya lebih sedikit."
                : "Periksa apakah kedua sisi punya jumlah yang sama."}
          </p>
        </div>

        <div
          className={`${styles.status} ${feedback === "good" ? styles.statusGood : feedback === "try" ? styles.statusTry : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback === "good"
            ? "⭐ Tepat! Kamu membandingkan kedua sisi dengan benar."
            : feedback === "try"
              ? "💡 Belum tepat. Hitung lagi benda di kiri dan kanan."
              : "💡 Sentuh sisi kiri, tanda sama, atau sisi kanan."}
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
