/* eslint-disable react-hooks/set-state-in-effect -- cursor state follows external camera landmarks */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  DwellSelector,
  pickMagneticTarget,
  type AirTargetRect
} from "@/lib/interaction/air-target";
import type { TrackedHand } from "@/lib/vision/types";
import styles from "./AirCursor.module.css";

interface AirCursorProps {
  hand?: TrackedHand;
  enabled: boolean;
  targetSelector?: string;
  magneticRadiusPx?: number;
  dwellMs?: number;
  label?: string;
  onFocusChange?(targetId: string | null): void;
  onSelect(targetId: string): void;
}

interface CursorView {
  x: number;
  y: number;
  focusedId: string | null;
  progress: number;
}

function canDwell(hand: TrackedHand): boolean {
  return (
    hand.gesture !== "pinch" &&
    hand.gesture !== "fist" &&
    hand.gesture !== "thumbs-up"
  );
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

export function AirCursor({
  hand,
  enabled,
  targetSelector = "[data-air-target]",
  magneticRadiusPx = 104,
  dwellMs = 900,
  label = "Tahan untuk memilih",
  onFocusChange,
  onSelect
}: AirCursorProps) {
  const [view, setView] = useState<CursorView | null>(null);
  const dwellRef = useRef(new DwellSelector(dwellMs));
  const lastFocusedRef = useRef<string | null>(null);

  useEffect(() => {
    dwellRef.current = new DwellSelector(dwellMs);
  }, [dwellMs]);

  useEffect(() => {
    if (!enabled || !hand) {
      dwellRef.current.reset();
      setView(null);
      if (lastFocusedRef.current !== null) {
        lastFocusedRef.current = null;
        onFocusChange?.(null);
      }
      return;
    }

    const rawX = hand.point.x * window.innerWidth;
    const rawY = hand.point.y * window.innerHeight;
    const match = pickMagneticTarget(
      rawX,
      rawY,
      visibleTargets(targetSelector),
      magneticRadiusPx
    );
    const timestamp = hand.point.t ?? performance.now();
    const dwell = dwellRef.current.update(
      canDwell(hand) ? (match?.id ?? null) : null,
      timestamp
    );
    const focusedId = match?.id ?? null;

    setView({
      x: match?.snappedX ?? rawX,
      y: match?.snappedY ?? rawY,
      focusedId,
      progress: dwell.progress
    });

    if (focusedId !== lastFocusedRef.current) {
      lastFocusedRef.current = focusedId;
      onFocusChange?.(focusedId);
    }
    if (dwell.selected) onSelect(dwell.selected);
  }, [
    enabled,
    hand,
    magneticRadiusPx,
    onFocusChange,
    onSelect,
    targetSelector
  ]);

  useEffect(
    () => () => {
      onFocusChange?.(null);
    },
    [onFocusChange]
  );

  if (!view) return null;

  return (
    <div
      className={styles.cursor}
      data-focused={Boolean(view.focusedId)}
      style={
        {
          left: view.x,
          top: view.y,
          "--air-progress": view.progress
        } as React.CSSProperties
      }
      aria-hidden
    >
      <span className={styles.progress} />
      <span className={styles.dot} />
      {view.focusedId ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
