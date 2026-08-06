export interface AirTargetRect {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface AirTargetMatch {
  id: string;
  snappedX: number;
  snappedY: number;
  distance: number;
  inside: boolean;
}

export interface DwellState {
  targetId: string | null;
  progress: number;
  selected: string | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function distanceToRect(
  x: number,
  y: number,
  target: AirTargetRect
): { distance: number; nearestX: number; nearestY: number; inside: boolean } {
  const nearestX = clamp(x, target.left, target.right);
  const nearestY = clamp(y, target.top, target.bottom);
  const inside =
    x >= target.left &&
    x <= target.right &&
    y >= target.top &&
    y <= target.bottom;

  return {
    distance: inside ? 0 : Math.hypot(x - nearestX, y - nearestY),
    nearestX,
    nearestY,
    inside
  };
}

/**
 * Finds the closest eligible UI target. Targets remain selectable slightly
 * outside their visible rectangle, providing a magnetic tolerance for noisy
 * air cursors and small involuntary hand movement.
 */
export function pickMagneticTarget(
  x: number,
  y: number,
  targets: readonly AirTargetRect[],
  radiusPx = 96
): AirTargetMatch | null {
  let best: AirTargetMatch | null = null;

  for (const target of targets) {
    const result = distanceToRect(x, y, target);
    if (!result.inside && result.distance > radiusPx) continue;

    const centerX = (target.left + target.right) / 2;
    const centerY = (target.top + target.bottom) / 2;
    const magnetStrength = result.inside
      ? 0.58
      : Math.max(0.18, 0.58 * (1 - result.distance / radiusPx));
    const snappedX = x + (centerX - x) * magnetStrength;
    const snappedY = y + (centerY - y) * magnetStrength;
    const match: AirTargetMatch = {
      id: target.id,
      snappedX,
      snappedY,
      distance: result.distance,
      inside: result.inside
    };

    if (
      !best ||
      match.distance < best.distance ||
      (match.distance === best.distance && match.inside && !best.inside)
    ) {
      best = match;
    }
  }

  return best;
}

/**
 * Converts a stable target hover into one selection event. Moving to another
 * target, leaving all targets, or entering cooldown resets the hold progress.
 */
export class DwellSelector {
  private targetId: string | null = null;
  private startedAt = 0;
  private cooldownUntil = 0;

  constructor(
    private readonly dwellMs = 900,
    private readonly cooldownMs = 850
  ) {}

  update(targetId: string | null, nowMs: number): DwellState {
    if (!Number.isFinite(nowMs)) {
      return { targetId: this.targetId, progress: 0, selected: null };
    }

    if (nowMs < this.cooldownUntil) {
      this.targetId = null;
      this.startedAt = 0;
      return { targetId: null, progress: 0, selected: null };
    }

    if (!targetId) {
      this.targetId = null;
      this.startedAt = 0;
      return { targetId: null, progress: 0, selected: null };
    }

    if (targetId !== this.targetId) {
      this.targetId = targetId;
      this.startedAt = nowMs;
      return { targetId, progress: 0, selected: null };
    }

    const progress = Math.max(
      0,
      Math.min(1, (nowMs - this.startedAt) / this.dwellMs)
    );
    if (progress < 1) {
      return { targetId, progress, selected: null };
    }

    const selected = targetId;
    this.targetId = null;
    this.startedAt = 0;
    this.cooldownUntil = nowMs + this.cooldownMs;
    return { targetId: null, progress: 0, selected };
  }

  reset(): void {
    this.targetId = null;
    this.startedAt = 0;
    this.cooldownUntil = 0;
  }
}
