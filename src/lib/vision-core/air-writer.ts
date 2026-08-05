// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Turns a moving pen into a glyph made of one or more strokes.
 *
 * Two generations of bug live in this file's history:
 *
 * 1. The first controller recorded a single continuous stroke and submitted it
 *    as soon as the finger stopped moving for 650ms. Digits 4, 5 and 7 are
 *    normally two strokes, so the instant the user lifted to start the second
 *    stroke the app graded half a digit and called it wrong.
 *
 * 2. The second distinguished "pen up" from "finished", which was right, but
 *    still *inferred* pen-up from a per-frame pose classification. That made
 *    strokes break on their own, and the grace period added to stop that then
 *    made deliberate breaks unreliable. See pen.ts for why no threshold can fix
 *    this - the intention was never being measured.
 *
 * Now the pen state arrives as an explicit boolean from PenController, driven by
 * the user's pinch. This file's only remaining job is turning a sequence of
 * pen-down samples into strokes, and deciding when a glyph is finished.
 */

import type { Point2D } from "./coordinate";

export interface WriterPoint extends Point2D {
  t: number;
}

/** A single pen-down mark. Points carry a timestamp; recognisers ignore it. */
export type Stroke = WriterPoint[];

export type AirWriterEvent =
  | { type: "stroke-start"; point: WriterPoint }
  | { type: "stroke-point"; strokes: Stroke[] }
  | { type: "stroke-end"; strokes: Stroke[] }
  | { type: "completed"; strokes: Stroke[] }
  | { type: "discarded"; reason: "too-short" | "too-small" }
  | { type: "cleared" };

export interface AirWriterInput {
  /** Pen position in aspect-correct glyph space, or null when unavailable. */
  point: { x: number; y: number } | null;
  /**
   * Whether the pen is down. Supply this from PenController, which applies
   * hysteresis and frame confirmation. Do NOT pass a raw per-frame pose flag:
   * that is the bug this parameter exists to eliminate.
   */
  penDown: boolean;
  isOpenPalm: boolean;
  /**
   * @deprecated Older callers passed the pose flag here. Still accepted so
   * vendored copies keep compiling, but `penDown` takes precedence when both
   * are present.
   */
  isPointing?: boolean;
}

export interface AirWriterOptions {
  /** Pen-up time before the glyph is considered finished. */
  submitAfterPenUpMs?: number;
  /** Pen-down time with no movement before the glyph is considered finished. */
  submitAfterStillMs?: number;
  /** How far the finger must travel before a new sample is recorded. */
  minSampleDistance?: number;
  /** Minimum total ink for a glyph to be worth recognising. */
  minPathLength?: number;
  /** Minimum bounding-box size for a glyph to be worth recognising. */
  minGlyphSize?: number;
  /** Hold an open palm this long to wipe the canvas. */
  clearHoldMs?: number;
  maxStrokes?: number;
  /**
   * How long the pose can misread as "not pointing" mid-stroke, while the
   * fingertip position is still known, before the stroke is treated as
   * genuinely finished. Real handwriting jitters: a finger can momentarily
   * uncurl or the classifier can misfire for a frame or two while the user
   * is actively drawing, and without this grace period every one of those
   * blips chopped the line into a new stroke - fast writing looked
   * "putus-putus" (constantly breaking) and rarely matched any template.
   */
  pointingGraceMs?: number;
}

const DEFAULTS: Required<AirWriterOptions> = {
  submitAfterPenUpMs: 900,
  submitAfterStillMs: 1400,
  minSampleDistance: 0.004,
  minPathLength: 0.06,
  minGlyphSize: 0.04,
  clearHoldMs: 700,
  maxStrokes: 4,
  pointingGraceMs: 180
};

function pathLengthOf(strokes: readonly Stroke[]): number {
  let total = 0;
  for (const stroke of strokes) {
    for (let i = 1; i < stroke.length; i += 1) {
      total += Math.hypot(stroke[i]!.x - stroke[i - 1]!.x, stroke[i]!.y - stroke[i - 1]!.y);
    }
  }
  return total;
}

function glyphSizeOf(strokes: readonly Stroke[]): number {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const stroke of strokes) {
    for (const point of stroke) {
      minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
    }
  }
  if (!Number.isFinite(minX)) return 0;
  return Math.max(maxX - minX, maxY - minY);
}

export class AirWriter {
  private strokes: Stroke[] = [];
  private active: Stroke | null = null;
  private penUpSince: number | null = null;
  private lastMovedAt = 0;
  private openPalmSince: number | null = null;
  /** When the pose first read "not pointing" while a stroke was active. */
  private notPointingSince: number | null = null;
  private readonly options: Required<AirWriterOptions>;

  constructor(options: AirWriterOptions = {}) {
    this.options = { ...DEFAULTS, ...options };
  }

  update(input: AirWriterInput, now: number): AirWriterEvent[] {
    const events: AirWriterEvent[] = [];

    // An open palm held for a moment wipes whatever has been written.
    if (input.isOpenPalm) {
      this.openPalmSince ??= now;
      if (now - this.openPalmSince >= this.options.clearHoldMs) {
        this.openPalmSince = null;
        if (this.strokes.length > 0 || this.active) {
          this.reset();
          events.push({ type: "cleared" });
        }
        return events;
      }
    } else {
      this.openPalmSince = null;
    }

    // penDown is authoritative. isPointing is only consulted for legacy callers
    // that have not been migrated to PenController yet.
    const penDown = input.penDown ?? input.isPointing ?? false;

    if (penDown && input.point) {
      this.penUpSince = null;
      this.notPointingSince = null;
      if (!this.active) {
        const point: WriterPoint = { x: input.point.x, y: input.point.y, t: now };
        this.active = [point];
        this.lastMovedAt = now;
        events.push({ type: "stroke-start", point });
      } else {
        const previous = this.active[this.active.length - 1]!;
        const moved = Math.hypot(input.point.x - previous.x, input.point.y - previous.y);
        if (moved >= this.options.minSampleDistance) {
          this.active.push({ x: input.point.x, y: input.point.y, t: now });
          this.lastMovedAt = now;
          events.push({ type: "stroke-point", strokes: this.snapshot() });
        } else if (now - this.lastMovedAt >= this.options.submitAfterStillMs) {
          // Held completely still with the pen down - treat as finished.
          this.endStroke(events);
          this.finish(events);
          return events;
        }
      }
      return events;
    }

    // The pen is up this frame.
    //
    // Legacy pose-driven callers get a short grace window, because their signal
    // is a per-frame classification that misfires: without it the line breaks on
    // its own. Callers supplying an explicit `penDown` get NO grace at all -
    // PenController has already debounced the signal, and adding a second delay
    // here would be exactly what made deliberate stroke breaks feel unreliable.
    const usingExplicitPen = input.penDown !== undefined;
    const graceMs = usingExplicitPen ? 0 : this.options.pointingGraceMs;

    if (this.active) {
      this.notPointingSince ??= now;
      const withinGrace = now - this.notPointingSince < graceMs;
      if (withinGrace && input.point) {
        const previous = this.active[this.active.length - 1]!;
        const moved = Math.hypot(input.point.x - previous.x, input.point.y - previous.y);
        if (moved >= this.options.minSampleDistance) {
          this.active.push({ x: input.point.x, y: input.point.y, t: now });
          this.lastMovedAt = now;
          events.push({ type: "stroke-point", strokes: this.snapshot() });
        }
        return events;
      }
      this.notPointingSince = null;
      this.endStroke(events);
      this.penUpSince = now;
      return events;
    }

    this.notPointingSince = null;
    if (this.strokes.length > 0) {
      this.penUpSince ??= now;
      if (now - this.penUpSince >= this.options.submitAfterPenUpMs) {
        this.finish(events);
      }
    }
    return events;
  }

  private endStroke(events: AirWriterEvent[]): void {
    if (!this.active) return;
    // A one-sample stroke is a tracking blip, not a pen mark.
    if (this.active.length > 1) {
      this.strokes.push(this.active);
      if (this.strokes.length > this.options.maxStrokes) this.strokes.shift();
    }
    this.active = null;
    events.push({ type: "stroke-end", strokes: this.snapshot() });
  }

  private finish(events: AirWriterEvent[]): void {
    const strokes = this.snapshot();
    this.reset();
    if (strokes.length === 0) return;
    if (pathLengthOf(strokes) < this.options.minPathLength) {
      events.push({ type: "discarded", reason: "too-short" });
      return;
    }
    if (glyphSizeOf(strokes) < this.options.minGlyphSize) {
      events.push({ type: "discarded", reason: "too-small" });
      return;
    }
    events.push({ type: "completed", strokes });
  }

  /** Drop the most recent stroke, for an explicit undo. */
  undoStroke(): void {
    if (this.active) { this.active = null; return; }
    this.strokes.pop();
  }

  reset(): void {
    this.strokes = [];
    this.active = null;
    this.penUpSince = null;
    this.openPalmSince = null;
    this.notPointingSince = null;
  }

  snapshot(): Stroke[] {
    const all = this.strokes.map((stroke) => stroke.map((point) => ({ ...point })));
    if (this.active && this.active.length > 0) all.push(this.active.map((point) => ({ ...point })));
    return all;
  }

  get isWriting(): boolean {
    return this.active !== null;
  }

  get strokeCount(): number {
    return this.strokes.length + (this.active ? 1 : 0);
  }
}
