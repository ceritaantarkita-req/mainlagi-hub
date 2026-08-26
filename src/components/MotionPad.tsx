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
import { readDigitCandidates, type DigitCandidate } from "@/lib/engine/digit";
import type { GlyphInput, PlayerId, Point, Stroke } from "@/lib/engine/types";
import { useLatest } from "@/lib/react/useLatest";
import { PenMapper } from "@/lib/interaction/pen-mapper";
import { GestureHold } from "@/lib/vision/gesture";
import { MouthOpenLatch } from "@/lib/vision/face-analysis";
import {
  findFace,
  findPrimaryHand,
  usePlayerGesture,
  useVisionFrame
} from "@/lib/vision/useVisionSelector";
import type { VisionRuntime } from "@/lib/vision/types";

/**
 * Turns loose handwriting into a confirmed number, one digit at a time.
 *
 * Writing "16" side by side inside one box is close to impossible in the air:
 * there is no ruled line, no sense of where the first digit ended, and the
 * second digit lands on top of the first. Composing instead - write one digit,
 * see it become a clean "1", write again, see "16" - removes the problem
 * entirely, and it is also what makes a misread cheap: the alternatives are
 * offered as buttons rather than requiring the whole thing to be rewritten.
 */
export interface ComposeOptions {
  /** How many digits the answer has. */
  length: number;
  onAnswer(value: number): void;
}

interface MotionPadProps {
  vision: VisionRuntime;
  player: PlayerId;
  enabled: boolean;
  /** Guide path to trace, in pad coordinates (0..1). */
  target?: readonly Point[];
  label?: string;
  hint?: string;
  /** Digit-composing mode. When absent the pad submits raw strokes. */
  compose?: ComposeOptions;
  onSubmit?(strokes: Stroke[]): void;
}

/**
 * Idle time after the last ink before the glyph is read.
 *
 * A glyph that is still only *one* stroke gets much longer, because it may be
 * half of a character rather than a whole one. This is what made 4 so hard to
 * write. Most people draw a 4 in two strokes, and if the upright is drawn
 * first, the engine - looking at a lone vertical line - reads a perfectly
 * confident "1" and, a moment later, commits it. The player never gets to draw
 * the rest of the digit, and from the outside it just looks like 4 is
 * impossible. The same trap catches a two-stroke 5 and a crossbarred 7.
 *
 * So a lone stroke is treated as provisional: the reading is offered later and
 * commits itself much later, leaving a comfortable few seconds for a
 * five-year-old to lift, aim and draw the second stroke. Once a second stroke
 * exists the character is probably finished, and the quick timings return.
 */
const READ_DELAY_MS = 420;
const READ_DELAY_PARTIAL_MS = 900;
/** How long a confident reading waits before it commits itself. */
const AUTO_COMMIT_MS = 1500;
const AUTO_COMMIT_PARTIAL_MS = 2400;
/** Below this the reading is never committed automatically. */
const AUTO_COMMIT_CONFIDENCE = 0.62;

const CAMERA_RELEASE_GRACE_MS = 140;
const GESTURE_HOLD_MS = 500;
/**
 * Samples captured just before the pinch is recognized are stitched into the
 * stroke, so the first ~100 ms of a character is not lost while the gesture
 * classifier makes up its mind.
 */
const PRE_PINCH_WINDOW_MS = 170;
const PRE_PINCH_BUFFER = 12;

const INK_COLOUR: Record<PlayerId, string> = {
  A: "#5FD3FF",
  B: "#FF8FC5"
};

/**
 * The writing surface.
 *
 * Two things changed here, both of them things the previous version got wrong
 * in a way that only shows up when you actually play:
 *
 * 1. **It no longer renders through React.** Ink used to be SVG polylines
 *    rebuilt from component state on every captured point, and the camera
 *    cursor was a `setState` inside an effect keyed on the hand object - which
 *    changed identity every frame. That combination is what raised "Maximum
 *    update depth exceeded". Everything per-frame now lives in refs and is
 *    painted to a canvas from one animation loop.
 * 2. **It is transparent.** A big opaque white panel over the camera hid the
 *    player from themselves, which defeats the point of a motion game. The pad
 *    is now a glass surface: you write over your own picture.
 */
export function MotionPad({
  vision,
  player,
  enabled,
  target,
  label = `Pemain ${player}`,
  hint = "Cubit untuk menulis · buka telapak untuk kirim",
  compose,
  onSubmit
}: MotionPadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);

  const glyphRef = useRef<GlyphInput>(emptyGlyph());
  const cursorRef = useRef<Point | null>(null);
  const drawingRef = useRef(false);
  const pointerRef = useRef<number | null>(null);
  const lastPinchAtRef = useRef<number | null>(null);
  /**
   * Dropout-tolerant holds. These replace a pair of raw timestamps that were
   * cleared by any single non-matching frame - see {@link GestureHold}.
   */
  const openHoldRef = useRef(new GestureHold(GESTURE_HOLD_MS));
  const fistHoldRef = useRef(new GestureHold(GESTURE_HOLD_MS));
  const lastSubmitRef = useRef(0);
  const mapperRef = useRef(new PenMapper());
  const preBufferRef = useRef<Point[]>([]);
  const mouthLatchRef = useRef(new MouthOpenLatch());
  const enabledRef = useLatest(enabled);
  const onSubmitRef = useLatest(onSubmit);
  const targetRef = useLatest(target);
  const composeRef = useLatest(compose);

  /**
   * Composer state. These update a few times per answer, not per frame, so
   * they are ordinary React state.
   */
  const [slots, setSlots] = useState<number[]>([]);
  const [candidates, setCandidates] = useState<DigitCandidate[]>([]);
  const [tooSmall, setTooSmall] = useState(false);
  const [partial, setPartial] = useState(false);
  const slotsRef = useRef<number[]>([]);
  const lastInkAtRef = useRef(0);
  const readyAtRef = useRef<number | null>(null);
  /** Strokes the current reading was based on - see the delay constants. */
  const readStrokeCountRef = useRef(0);
  const topCandidateRef = useLatest<DigitCandidate | null>(candidates[0] ?? null);

  /** Only used to enable the Kirim button, so it updates at most twice a second. */
  const [hasInk, setHasInk] = useState(false);
  const hasInkRef = useRef(false);
  const lastInkCheckRef = useRef(0);

  const gesture = usePlayerGesture(vision, player);
  const usingCamera = gesture !== "none";



  const markInk = useCallback(
    (now: number) => {
      lastInkAtRef.current = now;
      // New ink invalidates any reading on screen: a 4 written in two strokes
      // must not be judged after the first one.
      readyAtRef.current = null;
      setCandidates((current) => (current.length ? [] : current));
      setTooSmall((current) => (current ? false : current));

      const next = glyphRef.current.strokes.some(
        (stroke) => stroke.points.length > 0
      );
      if (next === hasInkRef.current) return;
      if (now - lastInkCheckRef.current < 300) return;
      lastInkCheckRef.current = now;
      hasInkRef.current = next;
      setHasInk(next);
    },
    []
  );

  const clearReading = useCallback(() => {
    setCandidates([]);
    setTooSmall(false);
    setPartial(false);
    readyAtRef.current = null;
    readStrokeCountRef.current = 0;
  }, []);

  const clear = useCallback(() => {
    glyphRef.current = emptyGlyph();
    drawingRef.current = false;
    lastPinchAtRef.current = null;
    openHoldRef.current.reset();
    fistHoldRef.current.reset();
    preBufferRef.current = [];
    mapperRef.current.unlock();
    hasInkRef.current = false;
    lastInkCheckRef.current = 0;
    setHasInk(false);
    clearReading();
  }, [clearReading]);

  const finishStroke = useCallback((now: number) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPinchAtRef.current = null;
    mapperRef.current.unlock();
    glyphRef.current = endStroke(glyphRef.current, now);
  }, []);

  /** Adds a digit to the answer tray, and answers once the tray is full. */
  const commitDigit = useCallback(
    (digit: number) => {
      const options = composeRef.current;
      if (!options) return;

      const next = [...slotsRef.current, digit].slice(0, options.length);
      slotsRef.current = next;
      setSlots(next);
      clear();

      if (next.length >= options.length) {
        options.onAnswer(Number(next.join("")));
        slotsRef.current = [];
        setSlots([]);
      }
    },
    [clear, composeRef]
  );

  const removeLast = useCallback(() => {
    if (hasInkRef.current) {
      clear();
      return;
    }
    const next = slotsRef.current.slice(0, -1);
    slotsRef.current = next;
    setSlots(next);
  }, [clear]);

  /**
   * The confirm action. In composing mode it accepts the digit on screen; in
   * raw mode it hands the strokes to the game as before.
   */
  const submit = useCallback(() => {
    const now = performance.now();
    finishStroke(now);
    if (!enabledRef.current) return;
    if (now - lastSubmitRef.current < 400) return;

    const options = composeRef.current;
    if (options) {
      const reading = readDigitCandidates(usableStrokes(glyphRef.current), 3);
      const top = reading[0];
      if (!top) {
        setTooSmall(true);
        return;
      }
      lastSubmitRef.current = now;
      commitDigit(top.digit);
      return;
    }

    const strokes = usableStrokes(glyphRef.current);
    if (!strokes.length) return;
    lastSubmitRef.current = now;
    glyphRef.current = submitGlyph(glyphRef.current, now);
    onSubmitRef.current?.(strokes);
    clear();
  }, [clear, commitDigit, composeRef, enabledRef, finishStroke, onSubmitRef]);

  /**
   * Reads the glyph once writing pauses, then lets a confident reading commit
   * itself. Runs on a slow interval rather than per frame - recognition is
   * milliseconds of work, but there is no reason to do it 25 times a second.
   */
  useEffect(() => {
    if (!compose) return;
    const handle = window.setInterval(() => {
      const now = performance.now();
      if (drawingRef.current) return;

      if (readyAtRef.current !== null) {
        const top = topCandidateRef.current;
        const wait =
          readStrokeCountRef.current <= 1
            ? AUTO_COMMIT_PARTIAL_MS
            : AUTO_COMMIT_MS;
        if (
          top &&
          top.confidence >= AUTO_COMMIT_CONFIDENCE &&
          now - readyAtRef.current >= wait
        ) {
          commitDigit(top.digit);
        }
        return;
      }

      if (!hasInkRef.current) return;

      const strokes = usableStrokes(glyphRef.current);
      const delay =
        strokes.length <= 1 ? READ_DELAY_PARTIAL_MS : READ_DELAY_MS;
      if (now - lastInkAtRef.current < delay) return;

      const reading = readDigitCandidates(strokes, 3);
      readStrokeCountRef.current = strokes.length;
      readyAtRef.current = now;
      if (!reading.length) {
        setTooSmall(true);
        setCandidates([]);
        return;
      }
      setTooSmall(false);
      setCandidates(reading);
      // A one-stroke reading is provisional, so say so rather than presenting
      // half of a 4 as though it were a finished answer.
      setPartial(strokes.length <= 1);
    }, 120);
    return () => window.clearInterval(handle);
  }, [commitDigit, compose, topCandidateRef]);

  const recenter = useCallback(() => {
    cursorRef.current = mapperRef.current.recenter(performance.now());
    drawingRef.current = false;
    lastPinchAtRef.current = null;
  }, []);

  // --- Camera input -------------------------------------------------------
  useVisionFrame(vision, (snapshot) => {
    const hand = findPrimaryHand(snapshot, player);
    const now = snapshot.timestamp || performance.now();

    if (!enabledRef.current || !hand) {
      finishStroke(now);
      mapperRef.current.release();
      mouthLatchRef.current.reset();
      preBufferRef.current = [];
      cursorRef.current = null;
      return;
    }

    const mapped = mapperRef.current.update(hand.point, now);
    cursorRef.current = mapped;

    if (hand.gesture === "pinch") {
      openHoldRef.current.reset();
      fistHoldRef.current.reset();
      lastPinchAtRef.current = now;

      if (!drawingRef.current) {
        drawingRef.current = true;
        mapperRef.current.lock();
        const lead = preBufferRef.current.filter(
          (point) => now - (point.t ?? now) <= PRE_PINCH_WINDOW_MS
        );
        let next = beginStroke(glyphRef.current, lead[0] ?? mapped, now);
        for (const point of lead.slice(1)) {
          next = appendPoint(next, point, point.t ?? now, 0.002);
        }
        glyphRef.current = appendPoint(next, mapped, now, 0.002);
      } else {
        glyphRef.current = appendPoint(glyphRef.current, mapped, now, 0.002);
      }
      preBufferRef.current = [];
      markInk(now);
      return;
    }

    preBufferRef.current = [...preBufferRef.current, mapped].slice(
      -PRE_PINCH_BUFFER
    );

    if (
      drawingRef.current &&
      lastPinchAtRef.current !== null &&
      now - lastPinchAtRef.current >= CAMERA_RELEASE_GRACE_MS
    ) {
      finishStroke(now);
    }

    if (openHoldRef.current.update(hand.gesture === "open", now)) submit();
    if (fistHoldRef.current.update(hand.gesture === "fist", now)) clear();

    // Mouth-open shortcut: far easier for a small child than holding a still
    // open palm for half a second.
    const face = findFace(snapshot, player);
    if (face && mouthLatchRef.current.update(face.mouthOpen, now)) submit();

    markInk(now);
  });

  // --- Painting -----------------------------------------------------------
  useEffect(() => {
    let frame = 0;

    const paint = () => {
      frame = requestAnimationFrame(paint);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.lineCap = "round";
      context.lineJoin = "round";

      const scale = Math.min(rect.width, rect.height) / 380;
      const toX = (value: number) => value * rect.width;
      const toY = (value: number) => value * rect.height;

      // Guide path.
      const guide = targetRef.current;
      if (guide?.length) {
        context.save();
        context.setLineDash([2, 18 * scale]);
        context.strokeStyle = "rgba(255,255,255,0.55)";
        context.lineWidth = 14 * scale;
        context.beginPath();
        guide.forEach((point, index) => {
          const x = toX(point.x);
          const y = toY(point.y);
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.stroke();
        context.restore();
      }

      // Ink, with a dark halo so it stays readable over a bright room.
      const ink = INK_COLOUR[player];
      for (const pass of ["halo", "ink"] as const) {
        context.strokeStyle =
          pass === "halo" ? "rgba(3,10,24,0.55)" : ink;
        context.lineWidth = (pass === "halo" ? 14 : 9) * scale;
        for (const stroke of glyphRef.current.strokes) {
          if (stroke.points.length < 1) continue;
          context.beginPath();
          stroke.points.forEach((point, index) => {
            const x = toX(point.x);
            const y = toY(point.y);
            if (index === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          });
          if (stroke.points.length === 1) {
            const only = stroke.points[0]!;
            context.arc(
              toX(only.x),
              toY(only.y),
              (pass === "halo" ? 7 : 4.5) * scale,
              0,
              Math.PI * 2
            );
            context.fillStyle =
              pass === "halo" ? "rgba(3,10,24,0.55)" : ink;
            context.fill();
          }
          context.stroke();
        }
      }

      // Pen cursor.
      const cursor = cursorRef.current;
      if (cursor) {
        const x = toX(cursor.x);
        const y = toY(cursor.y);
        const active = drawingRef.current;
        context.beginPath();
        context.arc(x, y, 22 * scale, 0, Math.PI * 2);
        context.fillStyle = active
          ? "rgba(200,242,107,0.22)"
          : "rgba(255,255,255,0.16)";
        context.fill();
        context.beginPath();
        context.arc(x, y, 7 * scale, 0, Math.PI * 2);
        context.fillStyle = active ? "#C8F26B" : "#FFFFFF";
        context.fill();
      }
    };

    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, [player, targetRef]);

  // --- Mouse and touch fallback ------------------------------------------
  const eventPoint = (clientX: number, clientY: number): Point | null => {
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return null;
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
      t: performance.now()
    };
  };

  const reading = candidates[0];
  const alternatives = candidates.slice(1).filter((item) => item.confidence > 0.2);

  return (
    <section className="motion-pad" data-player={player}>
      {compose ? (
        <div className="answer-tray" aria-label="Jawaban">
          {Array.from({ length: compose.length }, (_, index) => (
            <span
              key={index}
              className={`answer-tray__slot ${
                slots[index] !== undefined ? "is-filled" : ""
              } ${slots.length === index ? "is-active" : ""}`}
            >
              {slots[index] ?? ""}
            </span>
          ))}
        </div>
      ) : null}

      <div
        ref={surfaceRef}
        className="motion-pad__surface"
        onPointerDown={(event) => {
          if (!enabled || pointerRef.current !== null) return;
          const point = eventPoint(event.clientX, event.clientY);
          if (!point) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          pointerRef.current = event.pointerId;
          drawingRef.current = true;
          glyphRef.current = beginStroke(
            glyphRef.current,
            point,
            performance.now()
          );
          cursorRef.current = point;
          markInk(performance.now());
        }}
        onPointerMove={(event) => {
          if (!enabled || pointerRef.current !== event.pointerId) return;
          const point = eventPoint(event.clientX, event.clientY);
          if (!point) return;
          glyphRef.current = appendPoint(
            glyphRef.current,
            point,
            performance.now()
          );
          cursorRef.current = point;
        }}
        onPointerUp={(event) => {
          if (pointerRef.current !== event.pointerId) return;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          pointerRef.current = null;
          drawingRef.current = false;
          glyphRef.current = endStroke(glyphRef.current, performance.now());
          markInk(performance.now());
        }}
        onPointerCancel={(event) => {
          if (pointerRef.current === event.pointerId) {
            pointerRef.current = null;
            drawingRef.current = false;
          }
        }}
      >
        <canvas ref={canvasRef} className="motion-pad__canvas" aria-hidden />
        <span className="motion-pad__tag">{label}</span>

        {/*
          The verification step: the loose stroke is shown back as a clean
          numeral, so the player confirms what the engine read instead of
          finding out only when the answer is marked wrong.
        */}
        {compose && reading ? (
          <div
            className={`ink-reading ${partial ? "is-partial" : ""}`}
            role="status"
            aria-live="polite"
          >
            {partial ? (
              <span className="ink-reading__partial">
                Masih bisa dilanjut — tulis garis berikutnya
              </span>
            ) : null}
            <button
              type="button"
              className="ink-reading__main"
              data-air-target={`read-${player}-accept`}
              style={
                { "--confidence": reading.confidence } as React.CSSProperties
              }
              onClick={() => commitDigit(reading.digit)}
            >
              <span className="ink-reading__glyph">{reading.digit}</span>
              <small>
                <b>Pakai {reading.digit}</b>
                {Math.round(reading.confidence * 100)}% yakin
              </small>
            </button>
            {alternatives.length ? (
              <div className="ink-reading__alts">
                <small>atau</small>
                {alternatives.map((item) => (
                  <button
                    key={item.digit}
                    type="button"
                    data-air-target={`read-${player}-alt-${item.digit}`}
                    onClick={() => commitDigit(item.digit)}
                  >
                    {item.digit}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {compose && tooSmall ? (
          <div className="ink-reading is-warning" role="status">
            <p>Tulisannya terlalu kecil — tulis lebih besar ya.</p>
          </div>
        ) : null}
      </div>

      <footer className="motion-pad__controls">
        <span className="motion-pad__hint">
          {compose
            ? usingCamera
              ? "Tulis satu angka · buka telapak atau buka mulut = pakai angka itu"
              : "Tulis satu angka, lalu tekan Pakai"
            : usingCamera
              ? "Cubit = tulis · buka telapak atau buka mulut = kirim"
              : hint}
        </span>
        <div>
          <button
            type="button"
            className="pad-button"
            data-air-target={`pad-${player}-clear`}
            onClick={compose ? removeLast : clear}
          >
            {compose ? "Hapus 1" : "Hapus"}
          </button>
          {usingCamera ? (
            <button
              type="button"
              className="pad-button"
              data-air-target={`pad-${player}-recenter`}
              onClick={recenter}
            >
              Tengah
            </button>
          ) : null}
          <button
            type="button"
            className="pad-button pad-button--submit"
            data-air-target={`pad-${player}-submit`}
            disabled={!hasInk}
            onClick={submit}
          >
            {compose ? "Pakai" : "Kirim"}
          </button>
        </div>
      </footer>
    </section>
  );
}
