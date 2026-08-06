import type { Point } from "../engine/types";
import type { Landmark } from "./types";

export interface OneEuroOptions {
  minCutoff?: number;
  beta?: number;
  derivativeCutoff?: number;
  maxGapMs?: number;
}

const DEFAULT_OPTIONS: Required<OneEuroOptions> = {
  minCutoff: 1.2,
  beta: 0.08,
  derivativeCutoff: 1,
  maxGapMs: 500
};

function smoothingFactor(cutoff: number, deltaSeconds: number): number {
  const safeCutoff = Math.max(0.0001, cutoff);
  const ratio = 2 * Math.PI * safeCutoff * deltaSeconds;
  return ratio / (ratio + 1);
}

class LowPassFilter {
  private value: number | null = null;

  filter(next: number, alpha: number): number {
    if (this.value === null) {
      this.value = next;
      return next;
    }
    this.value = alpha * next + (1 - alpha) * this.value;
    return this.value;
  }

  reset(): void {
    this.value = null;
  }
}

/**
 * Adaptive low-pass filter for noisy real-time landmark coordinates.
 * Slow movements receive stronger smoothing while faster intentional movement
 * receives less smoothing to keep interaction latency low.
 */
export class OneEuroFilter {
  private readonly options: Required<OneEuroOptions>;
  private readonly valueFilter = new LowPassFilter();
  private readonly derivativeFilter = new LowPassFilter();
  private lastRaw: number | null = null;
  private lastTimestampMs: number | null = null;

  constructor(options: OneEuroOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  filter(value: number, timestampMs: number): number {
    if (!Number.isFinite(value) || !Number.isFinite(timestampMs)) {
      return this.lastRaw ?? 0;
    }

    if (
      this.lastTimestampMs === null ||
      timestampMs <= this.lastTimestampMs ||
      timestampMs - this.lastTimestampMs > this.options.maxGapMs
    ) {
      this.reset();
      this.lastRaw = value;
      this.lastTimestampMs = timestampMs;
      return this.valueFilter.filter(value, 1);
    }

    const deltaSeconds = Math.max(
      1 / 240,
      Math.min(1, (timestampMs - this.lastTimestampMs) / 1000)
    );
    const derivative = (value - (this.lastRaw ?? value)) / deltaSeconds;
    const filteredDerivative = this.derivativeFilter.filter(
      derivative,
      smoothingFactor(this.options.derivativeCutoff, deltaSeconds)
    );
    const cutoff =
      this.options.minCutoff + this.options.beta * Math.abs(filteredDerivative);
    const filteredValue = this.valueFilter.filter(
      value,
      smoothingFactor(cutoff, deltaSeconds)
    );

    this.lastRaw = value;
    this.lastTimestampMs = timestampMs;
    return filteredValue;
  }

  reset(): void {
    this.valueFilter.reset();
    this.derivativeFilter.reset();
    this.lastRaw = null;
    this.lastTimestampMs = null;
  }
}

export class PointSmoother {
  private readonly x: OneEuroFilter;
  private readonly y: OneEuroFilter;

  constructor(options: OneEuroOptions = {}) {
    this.x = new OneEuroFilter(options);
    this.y = new OneEuroFilter(options);
  }

  update(point: Point, timestampMs: number): Point {
    return {
      ...point,
      x: this.x.filter(point.x, timestampMs),
      y: this.y.filter(point.y, timestampMs),
      t: timestampMs
    };
  }

  reset(): void {
    this.x.reset();
    this.y.reset();
  }
}

interface LandmarkFilters {
  x: OneEuroFilter;
  y: OneEuroFilter;
  z: OneEuroFilter;
}

export class LandmarkSmoother {
  private readonly options: OneEuroOptions;
  private filters: LandmarkFilters[] = [];

  constructor(options: OneEuroOptions = {}) {
    this.options = options;
  }

  update(landmarks: readonly Landmark[], timestampMs: number): Landmark[] {
    while (this.filters.length < landmarks.length) {
      this.filters.push({
        x: new OneEuroFilter(this.options),
        y: new OneEuroFilter(this.options),
        z: new OneEuroFilter(this.options)
      });
    }

    return landmarks.map((landmark, index) => {
      const filters = this.filters[index]!;
      const next: Landmark = {
        ...landmark,
        x: filters.x.filter(landmark.x, timestampMs),
        y: filters.y.filter(landmark.y, timestampMs)
      };
      if (typeof landmark.z === "number") {
        next.z = filters.z.filter(landmark.z, timestampMs);
      }
      return next;
    });
  }

  reset(): void {
    for (const filter of this.filters) {
      filter.x.reset();
      filter.y.reset();
      filter.z.reset();
    }
    this.filters = [];
  }
}
