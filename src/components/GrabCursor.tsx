"use client";

import { useEffect, useRef, useState } from "react";
import {
  pickMagneticTarget,
  type AirTargetRect
} from "@/lib/interaction/air-target";
import type { PlayerId } from "@/lib/engine/types";
import { useLatest } from "@/lib/react/useLatest";
import type { VisionRuntime } from "@/lib/vision/types";
import { findPrimaryHand, useVisionFrame } from "@/lib/vision/useVisionSelector";
import styles from "./GrabCursor.module.css";

interface GrabCursorProps {
  vision: VisionRuntime;
  player?: PlayerId;
  enabled: boolean;
  /** Elements a pinch can pick up. Each needs `data-grab-source` (the id)
   *  and `data-grab-emoji` (what to show while it is carried). */
  sourceSelector?: string;
  /** Elements a carried item can be dropped onto, each with `data-grab-target`. */
  targetSelector?: string;
  grabRadiusPx?: number;
  dropRadiusPx?: number;
  /** How long the pinch can read as "not pinching" before a drag actually
   *  ends. Real hand tracking loses the pinch shape for a frame or several
   *  in a row - especially mid-motion, which is exactly when a drag is
   *  happening - so this has to be generous, not just enough to absorb one
   *  flickered frame. */
  releaseGraceMs?: number;
  label?: string;
  onPickUp?(sourceId: string): void;
  onDrop(sourceId: string, targetId: string): void;
  onCancel?(sourceId: string): void;
  onArmedChange?(targetId: string | null): void;
}

function rectsFor(
  selector: string,
  idAttr: "grabSource" | "grabTarget"
): AirTargetRect[] {
  return Array.from(document.querySelectorAll<HTMLElement>(selector))
    .filter(
      (element) =>
        !element.hasAttribute("disabled") &&
        element.getAttribute("aria-disabled") !== "true"
    )
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        id: element.dataset[idAttr] ?? "",
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom
      };
    })
    .filter(
      (target) =>
        Boolean(target.id) &&
        target.right > target.left &&
        target.bottom > target.top
    );
}

function emojiFor(sourceId: string, selector: string): string {
  const element = document.querySelector<HTMLElement>(
    `${selector}[data-grab-source="${CSS.escape(sourceId)}"]`
  );
  return element?.dataset.grabEmoji ?? "🛒";
}

/**
 * Touchless drag-and-drop: pinch on a source to pick it up, move the hand to
 * carry it, release the pinch over a target to drop it there.
 *
 * This is a different gesture family from `AirCursor`'s dwell (point, hold
 * still). Dwell is the more reliable gesture for a young child - it only
 * asks for a held position, not a held pinch through a sustained movement -
 * so it stays the default everywhere else in these games. This component
 * exists for the one place a literal "pick this up and carry it" motion is
 * the point of the exercise, not just a way to press a button.
 */
export function GrabCursor({
  vision,
  player = "A",
  enabled,
  sourceSelector = "[data-grab-source]",
  targetSelector = "[data-grab-target]",
  grabRadiusPx = 110,
  dropRadiusPx = 150,
  releaseGraceMs = 500,
  label = "Jepit barang, lalu geser",
  onPickUp,
  onDrop,
  onCancel,
  onArmedChange
}: GrabCursorProps) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const enabledRef = useLatest(enabled);
  const sourceSelectorRef = useLatest(sourceSelector);
  const targetSelectorRef = useLatest(targetSelector);
  const grabRadiusRef = useLatest(grabRadiusPx);
  const dropRadiusRef = useLatest(dropRadiusPx);
  const releaseGraceRef = useLatest(releaseGraceMs);
  const onPickUpRef = useLatest(onPickUp);
  const onDropRef = useLatest(onDrop);
  const onCancelRef = useLatest(onCancel);
  const onArmedRef = useLatest(onArmedChange);

  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const [draggingEmoji, setDraggingEmoji] = useState<string | null>(null);

  const draggingIdRef = useRef<string | null>(null);
  const armedIdRef = useRef<string | null>(null);
  const lastPinchAtRef = useRef<number | null>(null);

  const show = (next: boolean) => {
    if (visibleRef.current === next) return;
    visibleRef.current = next;
    setVisible(next);
  };

  const setArmed = (id: string | null) => {
    if (armedIdRef.current === id) return;
    armedIdRef.current = id;
    onArmedRef.current?.(id);
  };

  const endDrag = (dropTargetId: string | null) => {
    const sourceId = draggingIdRef.current;
    draggingIdRef.current = null;
    lastPinchAtRef.current = null;
    setDraggingEmoji(null);
    setArmed(null);
    if (!sourceId) return;
    if (dropTargetId) onDropRef.current(sourceId, dropTargetId);
    else onCancelRef.current?.(sourceId);
  };

  useVisionFrame(vision, (snapshot) => {
    const hand = enabledRef.current
      ? findPrimaryHand(snapshot, player)
      : undefined;
    const now = snapshot.timestamp || performance.now();

    if (!hand) {
      if (draggingIdRef.current) endDrag(null);
      show(false);
      return;
    }

    show(true);
    const rawX = hand.point.x * window.innerWidth;
    const rawY = hand.point.y * window.innerHeight;
    const pinching = hand.gesture === "pinch";
    const node = nodeRef.current;

    if (draggingIdRef.current) {
      if (pinching) lastPinchAtRef.current = now;

      const targetMatch = pickMagneticTarget(
        rawX,
        rawY,
        rectsFor(targetSelectorRef.current, "grabTarget"),
        dropRadiusRef.current
      );
      setArmed(targetMatch?.id ?? null);

      if (node) {
        node.style.transform = `translate(${targetMatch?.snappedX ?? rawX}px, ${
          targetMatch?.snappedY ?? rawY
        }px)`;
      }

      const releasedFor = now - (lastPinchAtRef.current ?? now);
      if (!pinching && releasedFor >= releaseGraceRef.current) {
        endDrag(targetMatch?.id ?? null);
      }
      return;
    }

    if (node) node.style.transform = `translate(${rawX}px, ${rawY}px)`;

    if (pinching) {
      const sourceMatch = pickMagneticTarget(
        rawX,
        rawY,
        rectsFor(sourceSelectorRef.current, "grabSource"),
        grabRadiusRef.current
      );
      if (sourceMatch) {
        draggingIdRef.current = sourceMatch.id;
        lastPinchAtRef.current = now;
        setDraggingEmoji(emojiFor(sourceMatch.id, sourceSelectorRef.current));
        onPickUpRef.current?.(sourceMatch.id);
      }
    }
  });

  useEffect(
    () => () => {
      onArmedRef.current?.(null);
    },
    [onArmedRef]
  );

  if (!visible) return null;

  return (
    <div
      ref={nodeRef}
      className={`${styles.cursor} ${draggingEmoji ? styles.carrying : ""}`}
      aria-hidden
    >
      {draggingEmoji ? (
        <span className={styles.emoji}>{draggingEmoji}</span>
      ) : (
        <span className={styles.dot} />
      )}
      <span className={styles.label}>
        {draggingEmoji ? "Geser ke keranjang, lepas jepitan" : label}
      </span>
    </div>
  );
}
