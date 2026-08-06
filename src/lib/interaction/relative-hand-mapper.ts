import type { Point } from "../engine/types";

export interface RelativeHandMapperOptions {
  gainX?: number;
  gainY?: number;
  deadZone?: number;
  maxRawStep?: number;
  maxGapMs?: number;
  marginX?: number;
  marginY?: number;
  startX?: number;
  startY?: number;
}

const DEFAULTS: Required<RelativeHandMapperOptions> = {
  gainX: 2.15,
  gainY: 1.85,
  deadZone: 0.0015,
  maxRawStep: 0.055,
  maxGapMs: 320,
  marginX: 0.045,
  marginY: 0.055,
  startX: 0.5,
  startY: 0.52
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function applyDeadZone(value: number, deadZone: number): number {
  if (Math.abs(value) <= deadZone) return 0;
  return value - Math.sign(value) * deadZone;
}

/**
 * Converts camera-space hand movement into a relative canvas cursor.
 *
 * Absolute mapping forces the user's fingertip to occupy the exact same screen
 * coordinate as the drawing canvas. Relative mapping behaves more like a
 * trackpad: the current hand position becomes an anchor and comfortable hand
 * movement moves the pen across the whole canvas. This is substantially more
 * tolerant of different camera framing, arm length, and mobile screen sizes.
 */
export class RelativeHandMapper {
  private readonly options: Required<RelativeHandMapperOptions>;
  private previousRaw: Point | null = null;
  private lastTimestampMs: number | null = null;
  private cursor: Point;

  constructor(options: RelativeHandMapperOptions = {}) {
    this.options = { ...DEFAULTS, ...options };
    this.cursor = {
      x: this.options.startX,
      y: this.options.startY,
      t: 0
    };
  }

  update(raw: Point, timestampMs: number): Point {
    if (
      !Number.isFinite(raw.x) ||
      !Number.isFinite(raw.y) ||
      !Number.isFinite(timestampMs)
    ) {
      return { ...this.cursor };
    }

    if (
      !this.previousRaw ||
      this.lastTimestampMs === null ||
      timestampMs <= this.lastTimestampMs ||
      timestampMs - this.lastTimestampMs > this.options.maxGapMs
    ) {
      this.previousRaw = { ...raw };
      this.lastTimestampMs = timestampMs;
      this.cursor = { ...this.cursor, t: timestampMs };
      return { ...this.cursor };
    }

    const rawDx = clamp(
      raw.x - this.previousRaw.x,
      -this.options.maxRawStep,
      this.options.maxRawStep
    );
    const rawDy = clamp(
      raw.y - this.previousRaw.y,
      -this.options.maxRawStep,
      this.options.maxRawStep
    );
    const dx = applyDeadZone(rawDx, this.options.deadZone) * this.options.gainX;
    const dy = applyDeadZone(rawDy, this.options.deadZone) * this.options.gainY;

    this.cursor = {
      x: clamp(
        this.cursor.x + dx,
        this.options.marginX,
        1 - this.options.marginX
      ),
      y: clamp(
        this.cursor.y + dy,
        this.options.marginY,
        1 - this.options.marginY
      ),
      t: timestampMs
    };
    this.previousRaw = { ...raw };
    this.lastTimestampMs = timestampMs;
    return { ...this.cursor };
  }

  release(): void {
    this.previousRaw = null;
    this.lastTimestampMs = null;
  }

  recenter(timestampMs = 0): Point {
    this.previousRaw = null;
    this.lastTimestampMs = null;
    this.cursor = {
      x: this.options.startX,
      y: this.options.startY,
      t: timestampMs
    };
    return { ...this.cursor };
  }

  current(): Point {
    return { ...this.cursor };
  }
}
