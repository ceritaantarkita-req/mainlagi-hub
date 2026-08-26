"use client";

import { useEffect, useRef, useState } from "react";
import {
  DwellSelector,
  pickMagneticTarget,
  type AirTargetRect
} from "@/lib/interaction/air-target";
import type { PlayerId } from "@/lib/engine/types";
import { useLatest } from "@/lib/react/useLatest";
import type { VisionRuntime } from "@/lib/vision/types";
import { findPrimaryHand, useVisionFrame } from "@/lib/vision/useVisionSelector";
import styles from "./AirCursor.module.css";

interface AirCursorProps {
  vision: VisionRuntime;
  player?: PlayerId;
  enabled: boolean;
  targetSelector?: string;
  magneticRadiusPx?: number;
  dwellMs?: number;
  label?: string;
  onFocusChange?(targetId: string | null): void;
  onSelect(targetId: string): void;
}

function visibleTargets(selector: string): AirTargetRect[] {
  return Array.from(document.querySelectorAll<HTMLElement>(selector))
    .filter(
      (element) =>
        !element.hasAttribute("disabled") &&
        element.getAttribute("aria-disabled") !== "true" &&
        element.dataset.airDisabled !== "true"
    )
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        id: element.dataset.airTarget ?? "",
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

/**
 * Touchless pointer.
 *
 * Position and dwell progress are written straight to the DOM node from the
 * frame subscription. The previous version kept them in React state and set
 * that state from an effect keyed on the hand object, which changes identity
 * on every frame - so the component re-rendered continuously and, with the
 * rest of the tree doing the same, tripped React's update-depth guard.
 * Only focus changes, which happen a few times a minute, go through state.
 */
export function AirCursor({
  vision,
  player = "A",
  enabled,
  targetSelector = "[data-air-target]",
  magneticRadiusPx = 104,
  dwellMs = 900,
  label = "Tahan untuk memilih",
  onFocusChange,
  onSelect
}: AirCursorProps) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const dwellRef = useRef(new DwellSelector(dwellMs));
  const lastFocusedRef = useRef<string | null>(null);
  const enabledRef = useLatest(enabled);
  const selectorRef = useLatest(targetSelector);
  const radiusRef = useLatest(magneticRadiusPx);
  const onSelectRef = useLatest(onSelect);
  const onFocusRef = useLatest(onFocusChange);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    dwellRef.current = new DwellSelector(dwellMs);
  }, [dwellMs]);

  const show = (next: boolean) => {
    if (visibleRef.current === next) return;
    visibleRef.current = next;
    setVisible(next);
  };

  useVisionFrame(vision, (snapshot) => {
    const hand = enabledRef.current
      ? findPrimaryHand(snapshot, player)
      : undefined;

    if (!hand) {
      dwellRef.current.reset();
      show(false);
      if (lastFocusedRef.current !== null) {
        lastFocusedRef.current = null;
        onFocusRef.current?.(null);
      }
      return;
    }

    const rawX = hand.point.x * window.innerWidth;
    const rawY = hand.point.y * window.innerHeight;
    const match = pickMagneticTarget(
      rawX,
      rawY,
      visibleTargets(selectorRef.current),
      radiusRef.current
    );
    // Pinching and clenching are drawing gestures, not pointing ones: dwell
    // must not fire while the player is writing.
    const dwellable =
      hand.gesture !== "pinch" &&
      hand.gesture !== "fist" &&
      hand.gesture !== "thumbs-up";
    const timestamp = hand.point.t ?? performance.now();
    const dwell = dwellRef.current.update(
      dwellable ? (match?.id ?? null) : null,
      timestamp
    );

    show(true);
    const node = nodeRef.current;
    if (node) {
      node.style.transform = `translate(${match?.snappedX ?? rawX}px, ${
        match?.snappedY ?? rawY
      }px)`;
      node.style.setProperty("--air-progress", String(dwell.progress));
      node.dataset.focused = String(Boolean(match?.id));
    }

    const focusedId = match?.id ?? null;
    if (focusedId !== lastFocusedRef.current) {
      lastFocusedRef.current = focusedId;
      onFocusRef.current?.(focusedId);
    }
    if (dwell.selected) onSelectRef.current(dwell.selected);
  });

  useEffect(
    () => () => {
      onFocusRef.current?.(null);
    },
    [onFocusRef]
  );

  if (!visible) return null;

  return (
    <div ref={nodeRef} className={styles.cursor} aria-hidden>
      <span className={styles.progress} />
      <span className={styles.dot} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
