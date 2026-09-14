"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { isDragTargetActivity } from "@/lib/learning/gameplayPresentation";
import { emitLearningRuntimeMeasurement } from "@/lib/learning/runtimeMeasurement";
import { completeActivity, getActivity } from "@/lib/learning/system";
import styles from "./DragTargetMatchActivity.module.css";

type PairCard = { pair: string; source: string; target: string };
type PointerDrag = { pair: string; label: string; pointerId: number; startX: number; startY: number; moved: boolean };

type Ghost = { label: string; x: number; y: number } | null;

function buildPairCards(items: readonly { label: string; pair: string }[]): PairCard[] {
  const grouped = new Map<string, string[]>();
  for (const item of items) {
    const labels = grouped.get(item.pair) ?? [];
    labels.push(item.label);
    grouped.set(item.pair, labels);
  }
  return [...grouped.entries()]
    .filter(([, labels]) => labels.length === 2)
    .map(([pair, labels]) => ({ pair, source: labels[0], target: labels[1] }));
}

export function DragTargetMatchActivity({ childId, activityId }: { childId: string; activityId: string }) {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const sceneRef = useRef<HTMLElement | null>(null);
  const pointerDragRef = useRef<PointerDrag | null>(null);
  const incorrectRef = useRef(0);
  const retryRef = useRef(0);
  const pairs = useMemo(() => buildPairCards(activity?.matchItems ?? []), [activity?.matchItems]);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [draggingPair, setDraggingPair] = useState<string | null>(null);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const [ghost, setGhost] = useState<Ghost>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "try" | "good">("idle");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.dataset.dragTargetReady = "true";
  }, []);

  if (!activity || !isDragTargetActivity(activity) || pairs.length !== 3) return null;

  const finishIfComplete = (nextMatched: string[]) => {
    if (nextMatched.length !== pairs.length) return;
    const correctCount = pairs.length;
    const incorrectCount = incorrectRef.current;
    const accuracy = correctCount / (correctCount + incorrectCount);
    const assessed = spec?.assessment === "assessed";
    emitLearningRuntimeMeasurement({
      childId,
      activityId: activity.id,
      outcome: {
        status: "completed",
        assessed,
        accuracy: assessed ? accuracy : undefined,
        score: assessed ? accuracy : undefined,
        correctCount: assessed ? correctCount : undefined,
        incorrectCount: assessed ? incorrectCount : undefined,
        retryCount: assessed ? retryRef.current : undefined,
        inputMode: activity.preferredMobile,
        metadata: {
          source: "drag-target-runtime",
          evidenceFidelity: assessed ? "matching_drag_target_interaction" : "completion_only",
          matchedPairCount: correctCount
        }
      }
    });
    completeActivity(childId, activity.id);
    setDone(true);
    setFeedback("good");
  };

  const placePair = (sourcePair: string, targetPair: string) => {
    if (done || matched.includes(sourcePair)) return;
    if (sourcePair !== targetPair) {
      incorrectRef.current += 1;
      retryRef.current += 1;
      setFeedback("try");
      return;
    }
    const nextMatched = [...matched, sourcePair];
    setMatched(nextMatched);
    setSelectedPair(null);
    setFeedback("idle");
    finishIfComplete(nextMatched);
  };

  const clearDragVisuals = () => {
    setDraggingPair(null);
    setHoverTarget(null);
    setGhost(null);
  };

  const targetAtPoint = (x: number, y: number) => {
    const node = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-drag-target-pair]");
    return node?.dataset.dragTargetPair ?? null;
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
        className={`${styles.scene} ${done ? styles.sceneDone : ""}`}
        data-drag-target
        data-drag-target-done={done ? "true" : "false"}
      >
        <div className={styles.promptCard}>
          <span aria-hidden>🧲</span>
          <div>
            <h1>{activity.prompt ?? activity.title}</h1>
            <p>Seret kartu ke tempat yang cocok. Bisa juga pilih kartu, lalu pilih target.</p>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.column}>
            <div className={styles.columnTitle}>Kartu</div>
            <div className={styles.sourceList} role="group" aria-label="Kartu yang akan dipasangkan">
              {pairs.map((card) => {
                const isMatched = matched.includes(card.pair);
                const isSelected = selectedPair === card.pair;
                const isDragging = draggingPair === card.pair;
                return (
                  <button
                    key={card.pair}
                    type="button"
                    className={`${styles.sourceCard} ${isSelected ? styles.sourceSelected : ""} ${isDragging ? styles.sourceDragging : ""} ${isMatched ? styles.sourceMatched : ""}`}
                    aria-label={`${card.source}${isMatched ? ", sudah cocok" : ", pilih atau seret"}`}
                    aria-pressed={isSelected}
                    disabled={isMatched || done}
                    draggable={!isMatched && !done}
                    data-drag-source-pair={card.pair}
                    onClick={() => {
                      setSelectedPair(card.pair);
                      if (feedback === "try") setFeedback("idle");
                    }}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", card.pair);
                      setDraggingPair(card.pair);
                      setSelectedPair(card.pair);
                    }}
                    onDragEnd={clearDragVisuals}
                    onPointerDown={(event) => {
                      if (event.pointerType === "mouse" || isMatched || done) return;
                      pointerDragRef.current = {
                        pair: card.pair,
                        label: card.source,
                        pointerId: event.pointerId,
                        startX: event.clientX,
                        startY: event.clientY,
                        moved: false
                      };
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={(event) => {
                      const drag = pointerDragRef.current;
                      if (!drag || drag.pointerId !== event.pointerId) return;
                      const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
                      if (!drag.moved && distance < 8) return;
                      drag.moved = true;
                      event.preventDefault();
                      setDraggingPair(drag.pair);
                      setSelectedPair(drag.pair);
                      setGhost({ label: drag.label, x: event.clientX, y: event.clientY });
                      setHoverTarget(targetAtPoint(event.clientX, event.clientY));
                    }}
                    onPointerUp={(event) => {
                      const drag = pointerDragRef.current;
                      if (!drag || drag.pointerId !== event.pointerId) return;
                      const targetPair = drag.moved ? targetAtPoint(event.clientX, event.clientY) : null;
                      pointerDragRef.current = null;
                      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                      clearDragVisuals();
                      if (drag.moved && targetPair) placePair(drag.pair, targetPair);
                    }}
                    onPointerCancel={(event) => {
                      if (pointerDragRef.current?.pointerId === event.pointerId) pointerDragRef.current = null;
                      clearDragVisuals();
                    }}
                  >
                    <span>{card.source}</span>
                    <small>{isMatched ? "Cocok ✓" : "Seret / pilih"}</small>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.arrowRail} aria-hidden>
            <span>→</span><span>→</span><span>→</span>
          </div>

          <div className={styles.column}>
            <div className={styles.columnTitle}>Target</div>
            <div className={styles.targetList} role="group" aria-label="Target pasangan">
              {pairs.map((card) => {
                const isMatched = matched.includes(card.pair);
                const isHover = hoverTarget === card.pair;
                return (
                  <button
                    key={card.pair}
                    type="button"
                    className={`${styles.targetCard} ${isHover ? styles.targetHover : ""} ${isMatched ? styles.targetMatched : ""}`}
                    aria-label={`Target ${card.target}${isMatched ? `, pasangan ${card.source}` : ""}`}
                    disabled={done}
                    data-drag-target-pair={card.pair}
                    onClick={() => {
                      if (selectedPair) placePair(selectedPair, card.pair);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setHoverTarget(card.pair);
                    }}
                    onDragEnter={() => setHoverTarget(card.pair)}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHoverTarget(null);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const sourcePair = event.dataTransfer.getData("text/plain") || draggingPair;
                      clearDragVisuals();
                      if (sourcePair) placePair(sourcePair, card.pair);
                    }}
                  >
                    <span className={styles.targetLabel}>{card.target}</span>
                    <span className={styles.targetSlot}>{isMatched ? card.source : "Taruh di sini"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`${styles.status} ${feedback === "try" ? styles.statusTry : ""} ${feedback === "good" ? styles.statusGood : ""}`} role="status" aria-live="polite">
          {feedback === "good"
            ? "⭐ Mantap! Semua pasangan sudah tepat."
            : feedback === "try"
              ? "💡 Belum cocok. Coba target yang lain."
              : selectedPair
                ? "👆 Kartu dipilih. Sekarang pilih target atau seret kartunya."
                : "💡 Pasangkan semua kartu dengan target yang sesuai."}
        </div>

        {done ? (
          <Link className={styles.nextLink} href={`/child/${childId}/subject/${activity.subjectId}`}>Pilih permainan lain</Link>
        ) : null}

        {ghost ? (
          <div className={styles.dragGhost} style={{ left: ghost.x, top: ghost.y }} aria-hidden>{ghost.label}</div>
        ) : null}
      </section>
    </GardenActivityFrame>
  );
}
