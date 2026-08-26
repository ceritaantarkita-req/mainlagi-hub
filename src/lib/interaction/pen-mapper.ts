import type { Point } from "../engine/types";

export interface PenMapperOptions {
  /** Half-width of the initial comfortable hand-movement box, in camera space. */
  initialHalfWidth?: number;
  initialHalfHeight?: number;
  /**
   * Minimum half-width/height the box is padded out to the moment a stroke
   * locks it. See {@link PenMapper.lock} for why this exists.
   */
  writeHalfWidth?: number;
  writeHalfHeight?: number;
  /** How much of the canvas edge stays unreachable, to avoid clipping. */
  marginX?: number;
  marginY?: number;
  /** Samples further than this from the anchor are treated as tracking glitches. */
  maxJumpPerFrame?: number;
  /** Gap after which the mapper re-anchors rather than interpolating. */
  maxGapMs?: number;
  /** Fraction by which the box shrinks back per second when unused. */
  contractionPerSecond?: number;
}

/**
 * Letters and digits are, on average, noticeably taller than they are wide -
 * every digit template in `DIGIT_VARIANTS` has an aspect ratio (width /
 * height) between 0.45 and 1.0, and the most-missed digits (1, 4, 7) sit at
 * the narrow end. A box shaped like the hand's *idle* wandering - which
 * tends to be wider than tall, since people scan a screen side to side more
 * than they reach up and down while thinking - is the wrong shape for that,
 * so it defaults taller than wide too.
 */
const DEFAULTS: Required<PenMapperOptions> = {
  initialHalfWidth: 0.13,
  initialHalfHeight: 0.17,
  writeHalfWidth: 0.22,
  writeHalfHeight: 0.32,
  marginX: 0.03,
  marginY: 0.04,
  maxJumpPerFrame: 0.09,
  maxGapMs: 320,
  contractionPerSecond: 0.04
};

interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Maps hand position onto the writing canvas.
 *
 * This replaces the previous relative, trackpad-style mapper. That design
 * integrated hand *velocity* into a cursor position, which meant every bit of
 * residual tracking jitter above the dead zone was added permanently and never
 * corrected - a random walk. In practice the pen drifted while writing: a
 * straight line bent, a circle failed to close, and the user had to press a
 * "recenter" button. Relative mapping is right for pointing at menus and wrong
 * for handwriting, where the shape of the path *is* the answer.
 *
 * The mapping here is absolute: a hand position corresponds to a fixed canvas
 * position, so the written shape is the shape of the hand movement. What makes
 * it work across different room setups, arm lengths and phone sizes is that
 * the reference box adapts. It starts as a comfortable region around wherever
 * the player's hand first appears, and expands whenever the player reaches
 * further. It contracts only very slowly, so it never chases a single frame.
 */
export class PenMapper {
  private readonly options: Required<PenMapperOptions>;
  private box: Box | null = null;
  private lastRaw: Point | null = null;
  private lastTimestampMs: number | null = null;
  private locked = false;
  private rejectedFrames = 0;
  private cursor: Point = { x: 0.5, y: 0.5, t: 0 };

  constructor(options: PenMapperOptions = {}) {
    this.options = { ...DEFAULTS, ...options };
  }

  private anchor(raw: Point): void {
    this.box = {
      minX: raw.x - this.options.initialHalfWidth,
      maxX: raw.x + this.options.initialHalfWidth,
      minY: raw.y - this.options.initialHalfHeight,
      maxY: raw.y + this.options.initialHalfHeight
    };
  }

  update(raw: Point, timestampMs: number): Point {
    if (!Number.isFinite(raw.x) || !Number.isFinite(raw.y)) {
      return { ...this.cursor };
    }

    const gapTooLarge =
      this.lastTimestampMs === null ||
      timestampMs <= this.lastTimestampMs ||
      timestampMs - this.lastTimestampMs > this.options.maxGapMs;

    if (!this.box) this.anchor(raw);
    const box = this.box!;

    // Reject single-frame teleports (a detection flicker between two hands)
    // by holding the previous sample. A real hand cannot cross the frame in
    // one frame, and letting it through would put a straight line across the
    // middle of the letter.
    let sample = raw;
    if (!gapTooLarge && this.lastRaw) {
      const jump = Math.hypot(raw.x - this.lastRaw.x, raw.y - this.lastRaw.y);
      // A spike is only a spike if it does not persist. Rejecting forever
      // would strand the pen whenever the player genuinely moves fast.
      if (jump > this.options.maxJumpPerFrame && this.rejectedFrames < 3) {
        sample = this.lastRaw;
        this.rejectedFrames += 1;
      } else {
        this.rejectedFrames = 0;
      }
    } else {
      this.rejectedFrames = 0;
    }

    // While the pen is down the reference box is frozen. Letting it grow
    // mid-stroke would rescale the drawing halfway through a character, which
    // is its own kind of shape distortion.
    if (!this.locked) {
      // Expand instantly when the player reaches beyond the current box.
      box.minX = Math.min(box.minX, sample.x);
      box.maxX = Math.max(box.maxX, sample.x);
      box.minY = Math.min(box.minY, sample.y);
      box.maxY = Math.max(box.maxY, sample.y);
    }

    // Contract very slowly so an accidental big reach does not permanently
    // shrink the player's effective resolution.
    if (!this.locked && !gapTooLarge && this.lastTimestampMs !== null) {
      const seconds = (timestampMs - this.lastTimestampMs) / 1000;
      const rate = this.options.contractionPerSecond * seconds;
      const centerX = (box.minX + box.maxX) / 2;
      const centerY = (box.minY + box.maxY) / 2;
      const halfWidth = Math.max(
        this.options.initialHalfWidth,
        ((box.maxX - box.minX) / 2) * (1 - rate)
      );
      const halfHeight = Math.max(
        this.options.initialHalfHeight,
        ((box.maxY - box.minY) / 2) * (1 - rate)
      );
      box.minX = Math.min(centerX - halfWidth, sample.x);
      box.maxX = Math.max(centerX + halfWidth, sample.x);
      box.minY = Math.min(centerY - halfHeight, sample.y);
      box.maxY = Math.max(centerY + halfHeight, sample.y);
    }

    const width = Math.max(box.maxX - box.minX, 1e-6);
    const height = Math.max(box.maxY - box.minY, 1e-6);
    const usableX = 1 - this.options.marginX * 2;
    const usableY = 1 - this.options.marginY * 2;

    this.cursor = {
      x: clamp(
        this.options.marginX + ((sample.x - box.minX) / width) * usableX,
        this.options.marginX,
        1 - this.options.marginX
      ),
      y: clamp(
        this.options.marginY + ((sample.y - box.minY) / height) * usableY,
        this.options.marginY,
        1 - this.options.marginY
      ),
      t: timestampMs
    };

    this.lastRaw = sample;
    this.lastTimestampMs = timestampMs;
    return { ...this.cursor };
  }

  /**
   * Freezes the reference box. Call on pen-down so the glyph being written is
   * measured against a fixed frame from first point to last.
   *
   * The box being frozen here is whatever the *idle* hand movement shaped it
   * into before this stroke started - it has no idea yet how big the
   * character about to be written will be. If that box is small (the default
   * comfortable region, or one that has spent a few seconds slowly
   * contracting while the player held still and thought), the write that
   * follows gets clipped against its edges: a tall digit's vertical stroke
   * saturates at the top or bottom instead of continuing, flattening exactly
   * the part of the shape that made it recognizable. Because the default box
   * is wider than it is tall, this hits tall, narrow digits - 1, 4, 7 - far
   * harder than round ones, which is exactly the pattern reported.
   *
   * So locking pads the box out to a guaranteed writable minimum first,
   * expanding from its current centre. A box that has already grown bigger
   * than that floor (because the player is reaching further than usual) is
   * left alone - this only ever adds room, never removes it.
   */
  lock(): void {
    if (this.box) {
      const centerX = (this.box.minX + this.box.maxX) / 2;
      const centerY = (this.box.minY + this.box.maxY) / 2;
      const halfWidth = Math.max(
        this.options.writeHalfWidth,
        (this.box.maxX - this.box.minX) / 2
      );
      const halfHeight = Math.max(
        this.options.writeHalfHeight,
        (this.box.maxY - this.box.minY) / 2
      );
      this.box = {
        minX: centerX - halfWidth,
        maxX: centerX + halfWidth,
        minY: centerY - halfHeight,
        maxY: centerY + halfHeight
      };
    }
    this.locked = true;
  }

  unlock(): void {
    this.locked = false;
  }

  /** Called when the hand leaves the frame. */
  release(): void {
    this.lastRaw = null;
    this.lastTimestampMs = null;
    this.rejectedFrames = 0;
  }

  /** Drops the learned box so the next sample re-anchors the writing area. */
  recenter(timestampMs = 0): Point {
    this.box = null;
    this.lastRaw = null;
    this.lastTimestampMs = null;
    this.locked = false;
    this.rejectedFrames = 0;
    this.cursor = { x: 0.5, y: 0.5, t: timestampMs };
    return { ...this.cursor };
  }

  /** Current reference box, exposed for the preflight calibration display. */
  reach(): { width: number; height: number } | null {
    if (!this.box) return null;
    return {
      width: this.box.maxX - this.box.minX,
      height: this.box.maxY - this.box.minY
    };
  }

  current(): Point {
    return { ...this.cursor };
  }
}
