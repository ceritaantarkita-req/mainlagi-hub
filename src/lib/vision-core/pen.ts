// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Explicit pen up / pen down control.
 *
 * THE PROBLEM THIS SOLVES
 *
 * Every earlier version inferred "is the pen down?" from a per-frame pose
 * classification: pen is down while exactly the index finger is extended. That
 * inference is the source of a complaint that sounds self-contradictory but is
 * really one bug seen from two sides:
 *
 *   "sometimes the line breaks far too easily"
 *      -> a single frame where the classifier saw a second finger uncurl, or
 *         dropped the hand entirely, ended the stroke. The user did nothing.
 *
 *   "sometimes I need it to break and it won't"
 *      -> the grace period added to fix the above then refused to break when
 *         the user genuinely lifted, because it cannot tell a deliberate lift
 *         from a misfire. It only sees the same ambiguous signal.
 *
 * No amount of tuning fixes this, because the timing thresholds are trying to
 * recover an intention that was never measured. Both failures disappear once
 * the user controls the pen directly.
 *
 * PINCH
 *
 * Thumb-to-index distance is a continuous measurement, not a classification. It
 * degrades gracefully, it is robust to hand rotation, and - the important part -
 * the user always knows whether they are pinching. Touch to draw, release to
 * lift. Hysteresis (a lower threshold to engage than to release) gives a dead
 * band that makes chatter impossible.
 *
 * The pointing mode is kept for callers that want it, but it now runs through
 * the same hysteresis and smoothing rather than reading a raw per-frame flag.
 */

import type { Point2D } from "./coordinate";
import type { HandAnalysis } from "./landmarks";

export type PenMode = "pinch" | "point";

export interface PenState {
  /** Whether ink should be laid down this frame. */
  down: boolean;
  /** Smoothed drawing point, or null when the hand is not usable. */
  point: Point2D | null;
  /** Raw, unsmoothed drawing point. Useful for cursors that must feel instant. */
  rawPoint: Point2D | null;
  /** 0..1 how closed the pinch is. Drives the on-screen pen indicator. */
  strength: number;
  /** True while an open palm is being held, for callers that use it to erase. */
  clearing: boolean;
  mode: PenMode;
}

export interface PenOptions {
  mode?: PenMode;
  /** Pinch ratio at or below which the pen goes down. */
  engageRatio?: number;
  /** Pinch ratio at or above which the pen lifts. Must exceed engageRatio. */
  releaseRatio?: number;
  /** Frames the signal must agree before the pen state actually flips. */
  confirmFrames?: number;
  /** Enable the One Euro smoothing filter on the drawing point. */
  smoothing?: boolean;
}

const DEFAULTS: Required<PenOptions> = {
  mode: "pinch",
  // Measured as a fraction of palm size, so it holds at any distance from the
  // camera. Touching fingertips lands near 0.20; a relaxed open hand is >0.9.
  engageRatio: 0.42,
  releaseRatio: 0.62,
  // Two frames at ~30fps is ~66ms: long enough to ignore a single bad frame,
  // short enough that the user never perceives a delay.
  confirmFrames: 2,
  smoothing: true
};

/**
 * One Euro filter.
 *
 * A plain low-pass filter forces a choice between jittery ink and laggy ink.
 * This one adapts: it filters hard when the finger is nearly still (killing the
 * tremor that makes air-written characters look furry) and barely at all when
 * the finger is moving fast (so corners stay sharp and the ink keeps up).
 *
 * Reference: Casiez, Roussel & Vogel, "1 Euro Filter", CHI 2012.
 */
class OneEuroFilter {
  private previous: number | null = null;
  private previousDerivative = 0;
  private previousTime: number | null = null;

  constructor(
    private readonly minCutoff = 1.2,
    private readonly beta = 0.035,
    private readonly derivativeCutoff = 1
  ) {}

  private static alpha(cutoff: number, deltaSeconds: number): number {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / deltaSeconds);
  }

  filter(value: number, now: number): number {
    if (this.previous === null || this.previousTime === null) {
      this.previous = value;
      this.previousTime = now;
      return value;
    }
    const deltaSeconds = Math.max(1e-3, (now - this.previousTime) / 1000);
    this.previousTime = now;

    const rawDerivative = (value - this.previous) / deltaSeconds;
    const derivative =
      OneEuroFilter.alpha(this.derivativeCutoff, deltaSeconds) * rawDerivative +
      (1 - OneEuroFilter.alpha(this.derivativeCutoff, deltaSeconds)) * this.previousDerivative;
    this.previousDerivative = derivative;

    const cutoff = this.minCutoff + this.beta * Math.abs(derivative);
    const alpha = OneEuroFilter.alpha(cutoff, deltaSeconds);
    const filtered = alpha * value + (1 - alpha) * this.previous;
    this.previous = filtered;
    return filtered;
  }

  reset(): void {
    this.previous = null;
    this.previousDerivative = 0;
    this.previousTime = null;
  }
}

export class PenController {
  private down = false;
  private agreeing = 0;
  private lastCandidate = false;
  private readonly filterX = new OneEuroFilter();
  private readonly filterY = new OneEuroFilter();
  private readonly options: Required<PenOptions>;

  constructor(options: PenOptions = {}) {
    this.options = { ...DEFAULTS, ...options };
    if (this.options.releaseRatio <= this.options.engageRatio) {
      // Without a gap there is no hysteresis, and the pen will chatter on any
      // signal that sits near the threshold - which is most of them.
      this.options.releaseRatio = this.options.engageRatio + 0.15;
    }
  }

  get mode(): PenMode {
    return this.options.mode;
  }

  setMode(mode: PenMode): void {
    if (mode === this.options.mode) return;
    this.options.mode = mode;
    this.reset();
  }

  reset(): void {
    this.down = false;
    this.agreeing = 0;
    this.lastCandidate = false;
    this.filterX.reset();
    this.filterY.reset();
  }

  update(analysis: HandAnalysis | null, now: number): PenState {
    if (!analysis) {
      this.down = false;
      this.agreeing = 0;
      this.filterX.reset();
      this.filterY.reset();
      return {
        down: false, point: null, rawPoint: null, strength: 0,
        clearing: false, mode: this.options.mode
      };
    }

    const { engageRatio, releaseRatio, confirmFrames, mode } = this.options;

    // Asymmetric thresholds: once the pen is down it takes a clearly wider gap
    // to lift it than it took to put it down. This is the dead band.
    const candidate =
      mode === "pinch"
        ? this.down
          ? analysis.pinchRatio < releaseRatio
          : analysis.pinchRatio < engageRatio
        : this.down
          ? analysis.pose === "point" || analysis.pose === "pinch"
          : analysis.pose === "point";

    if (candidate === this.lastCandidate) this.agreeing += 1;
    else this.agreeing = 1;
    this.lastCandidate = candidate;

    if (candidate !== this.down && this.agreeing >= confirmFrames) {
      this.down = candidate;
      if (this.down) {
        // Start every stroke from a clean filter, otherwise the first points get
        // dragged toward wherever the hand happened to be when it lifted.
        this.filterX.reset();
        this.filterY.reset();
      }
    }

    // In pinch mode the perceived pen tip is between the two fingers, which is
    // where the user is looking. In point mode it is the index fingertip.
    const raw: Point2D =
      mode === "pinch"
        ? {
            x: (analysis.tip.x + analysis.thumbTip.x) / 2,
            y: (analysis.tip.y + analysis.thumbTip.y) / 2
          }
        : { x: analysis.tip.x, y: analysis.tip.y };

    const point: Point2D = this.options.smoothing
      ? { x: this.filterX.filter(raw.x, now), y: this.filterY.filter(raw.y, now) }
      : raw;

    // 0 when wide open, 1 when fully closed - drives the pen indicator so the
    // user can see how close they are to the threshold instead of guessing.
    const strength = Math.max(
      0,
      Math.min(1, (releaseRatio - analysis.pinchRatio) / Math.max(1e-6, releaseRatio - 0.16))
    );

    return {
      down: this.down,
      point,
      rawPoint: raw,
      strength,
      clearing: analysis.pose === "open",
      mode
    };
  }
}
