"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  appendPoint,
  beginStroke,
  emptyGlyph,
  endStroke,
  submitGlyph,
  usableStrokes
} from "@/lib/engine/stroke";
import type { GlyphInput, PlayerId, Point, Stroke } from "@/lib/engine/types";
import { RelativeHandMapper } from "@/lib/interaction/relative-hand-mapper";
import type { TrackedHand } from "@/lib/vision/types";
import styles from "./MotionPad.module.css";

interface MotionPadProps {
  player: PlayerId;
  playerCount: 1 | 2;
  hand?: TrackedHand;
  enabled: boolean;
  target?: readonly Point[];
  label?: string;
  hint?: string;
  onSubmit(strokes: Stroke[]): void;
}

const CAMERA_RELEASE_GRACE_MS = 170;
const GESTURE_HOLD_MS = 700;
const GESTURE_COOLDOWN_MS = 1200;
const MIN_HAND_CONFIDENCE = 0.38;

function pointsAttribute(points: readonly Point[]): string {
  return points.map((point) => `${point.x * 1000},${point.y * 650}`).join(" ");
}

function cursorChanged(previous: Point | null, next: Point): boolean {
  if (!previous) return true;
  return Math.hypot(previous.x - next.x, previous.y - next.y) > 0.0012;
}

export function MotionPad({
  player,
  hand,
  enabled,
  target,
  label = `Player ${player}`,
  hint = "Cubit untuk menulis · buka telapak untuk kirim",
  onSubmit
}: MotionPadProps) {
  const initialGlyph = emptyGlyph();
  const [glyph, setGlyph] = useState<GlyphInput>(initialGlyph);
  const [cameraCursor, setCameraCursor] = useState<Point | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pointerRef = useRef<number | null>(null);
  const cameraDrawingRef = useRef(false);
  const lastPinchAtRef = useRef<number | null>(null);
  const openStartedRef = useRef<number | null>(null);
  const fistStartedRef = useRef<number | null>(null);
  const lastSubmitRef = useRef(0);
  const liveGlyphRef = useRef(initialGlyph);
  const cursorRef = useRef<Point | null>(null);
  const mapperRef = useRef(new RelativeHandMapper());
  const onSubmitRef = useRef(onSubmit);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  const commitGlyph = useCallback((next: GlyphInput) => {
    liveGlyphRef.current = next;
    setGlyph(next);
  }, []);

  const finishCameraStroke = useCallback(
    (now: number) => {
      if (!cameraDrawingRef.current) return;
      cameraDrawingRef.current = false;
      lastPinchAtRef.current = null;
      const next = endStroke(liveGlyphRef.current, now);
      commitGlyph(next);
    },
    [commitGlyph]
  );

  const clear = useCallback(() => {
    const fresh = emptyGlyph();
    commitGlyph(fresh);
    cameraDrawingRef.current = false;
    lastPinchAtRef.current = null;
    openStartedRef.current = null;
    fistStartedRef.current = null;
  }, [commitGlyph]);

  const recenter = useCallback(() => {
    const next = mapperRef.current.recenter(performance.now());
    cursorRef.current = next;
    setCameraCursor(next);
    cameraDrawingRef.current = false;
    lastPinchAtRef.current = null;
  }, []);

  const submit = useCallback(() => {
    const now = performance.now();
    if (cameraDrawingRef.current) finishCameraStroke(now);
    const strokes = usableStrokes(liveGlyphRef.current);
    if (!enabled || !strokes.length || now - lastSubmitRef.current < 500) {
      return;
    }

    lastSubmitRef.current = now;
    liveGlyphRef.current = submitGlyph(liveGlyphRef.current, now);
    onSubmitRef.current(strokes);
    clear();
  }, [clear, enabled, finishCameraStroke]);

  useEffect(() => {
    if (!enabled) {
      finishCameraStroke(performance.now());
      mapperRef.current.release();
      cursorRef.current = null;
      setCameraCursor((current) => (current === null ? current : null));
      return;
    }

    if (!hand) {
      finishCameraStroke(performance.now());
      mapperRef.current.release();
      cursorRef.current = null;
      setCameraCursor((current) => (current === null ? current : null));
      return;
    }

    const now = hand.point.t || performance.now();
    const mappedPoint = mapperRef.current.update(hand.point, now);
    if (cursorChanged(cursorRef.current, mappedPoint)) {
      cursorRef.current = mappedPoint;
      setCameraCursor(mappedPoint);
    }

    const reliablePinch =
      hand.gesture === "pinch" && hand.confidence >= MIN_HAND_CONFIDENCE;

    if (reliablePinch) {
      openStartedRef.current = null;
      fistStartedRef.current = null;
      lastPinchAtRef.current = now;

      if (!cameraDrawingRef.current) {
        cameraDrawingRef.current = true;
        const next = beginStroke(liveGlyphRef.current, mappedPoint, now);
        commitGlyph(next);
      } else {
        const next = appendPoint(liveGlyphRef.current, mappedPoint, now, 0.0025);
        if (next !== liveGlyphRef.current) commitGlyph(next);
      }
      return;
    }

    if (
      cameraDrawingRef.current &&
      lastPinchAtRef.current !== null &&
      now - lastPinchAtRef.current >= CAMERA_RELEASE_GRACE_MS
    ) {
      finishCameraStroke(now);
    }

    if (hand.gesture === "open") {
      openStartedRef.current ??= now;
      if (now - openStartedRef.current >= GESTURE_HOLD_MS) {
        openStartedRef.current = now + GESTURE_COOLDOWN_MS;
        submit();
      }
    } else {
      openStartedRef.current = null;
    }

    if (hand.gesture === "fist") {
      fistStartedRef.current ??= now;
      if (now - fistStartedRef.current >= GESTURE_HOLD_MS) {
        fistStartedRef.current = now + GESTURE_COOLDOWN_MS;
        clear();
      }
    } else {
      fistStartedRef.current = null;
    }
  }, [clear, commitGlyph, enabled, finishCameraStroke, hand, submit]);

  const eventPoint = (clientX: number, clientY: number): Point | null => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return null;
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
      t: performance.now()
    };
  };

  return (
    <section
      className="motion-pad"
      style={
        {
          "--player": player === "A" ? "#4AA7FF" : "#FF65AD"
        } as React.CSSProperties
      }
    >
      <header>
        <div>
          <span>{player}</span>
          <strong>{label}</strong>
        </div>
        <em>
          {hand
            ? `${hand.gesture} · ${Math.round(hand.confidence * 100)}%`
            : "mouse / touch"}
        </em>
      </header>

      <svg
        ref={svgRef}
        viewBox="0 0 1000 650"
        preserveAspectRatio="none"
        className="motion-pad__canvas"
        onPointerDown={(event) => {
          if (!enabled || pointerRef.current !== null) return;
          const point = eventPoint(event.clientX, event.clientY);
          if (!point) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          pointerRef.current = event.pointerId;
          commitGlyph(
            beginStroke(liveGlyphRef.current, point, performance.now())
          );
        }}
        onPointerMove={(event) => {
          if (!enabled || pointerRef.current !== event.pointerId) return;
          const point = eventPoint(event.clientX, event.clientY);
          if (!point) return;
          const next = appendPoint(
            liveGlyphRef.current,
            point,
            performance.now()
          );
          if (next !== liveGlyphRef.current) commitGlyph(next);
        }}
        onPointerUp={(event) => {
          if (pointerRef.current !== event.pointerId) return;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          pointerRef.current = null;
          commitGlyph(endStroke(liveGlyphRef.current, performance.now()));
        }}
        onPointerCancel={(event) => {
          if (pointerRef.current === event.pointerId) pointerRef.current = null;
        }}
      >
        {target?.length ? (
          <polyline
            className="motion-target"
            points={pointsAttribute(target)}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}

        {glyph.strokes
          .filter((stroke) => stroke.points.length)
          .map((stroke) => (
            <polyline
              key={stroke.id}
              className="motion-ink"
              points={pointsAttribute(stroke.points)}
              vectorEffect="non-scaling-stroke"
            />
          ))}

        {cameraCursor ? (
          <g
            className={`${styles.cameraCursor} ${
              cameraDrawingRef.current ? styles.cursorDrawing : ""
            }`}
            transform={`translate(${cameraCursor.x * 1000} ${cameraCursor.y * 650})`}
          >
            <circle className={styles.cursorHalo} r="27" />
            <circle className={styles.cursorDot} r="8" />
          </g>
        ) : null}
      </svg>

      <footer>
        <span className={styles.relativeHint}>
          {hand ? "Gerakkan tangan seperti trackpad" : hint}
        </span>
        <div>
          <button type="button" onClick={clear}>
            Hapus
          </button>
          {hand ? (
            <button
              className={styles.recenterButton}
              type="button"
              onClick={recenter}
            >
              Tengah
            </button>
          ) : null}
          <button type="button" className="submit" onClick={submit}>
            Kirim
          </button>
        </div>
      </footer>
    </section>
  );
}
