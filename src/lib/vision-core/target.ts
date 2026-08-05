// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * AR buttons you select by holding your hand over them.
 *
 * Used for "point at the right answer" style games, where the user chooses
 * between options floating over the camera feed instead of writing anything.
 *
 * DESIGN NOTE - why dwell, and why it is cancellable
 *
 * A naive implementation fires the moment the hand touches a button. That is
 * unusable in practice: the hand has to travel across the screen to reach the
 * option it wants, and on the way it passes over the others. Every pass is a
 * misfire, and the user is blamed for an answer they never chose.
 *
 * So selection requires *dwelling*: staying inside the target for a continuous
 * period, with a visible ring filling up so the user can see it happening and
 * pull away in time. Leaving the target resets the progress rather than pausing
 * it, because a partially-filled ring that resumes later is how you get accidental
 * selections from a hand that merely hovered twice.
 */

import type { Point2D } from "./coordinate";

export interface ARTarget {
  id: string;
  /** Centre in the same normalised space the pointer is reported in. */
  center: Point2D;
  /** Radius in the same units. Hit testing is circular. */
  radius: number;
  disabled?: boolean;
}

export interface TargetProgress {
  id: string;
  /** 0..1 through the dwell. Drives the ring the user watches fill. */
  progress: number;
}

export interface TargetUpdate {
  /** Target currently under the pointer, if any. */
  hovering: string | null;
  /** Fires exactly once, on the frame the dwell completes. */
  selected: string | null;
  progress: TargetProgress[];
}

export interface TargetOptions {
  /** How long the pointer must stay inside a target to select it. */
  dwellMs?: number;
  /**
   * Extra radius applied once the pointer is already inside a target.
   *
   * Without this, a hand that trembles right on the boundary flickers in and
   * out and the dwell never completes - the user is holding still, watching the
   * ring reset again and again, with no idea why.
   */
  stickyMargin?: number;
  /** Ignore selections for this long after one fires, so it cannot double-fire. */
  cooldownMs?: number;
}

const DEFAULTS: Required<TargetOptions> = {
  dwellMs: 900,
  stickyMargin: 0.03,
  cooldownMs: 700
};

export class TargetSelector {
  private activeId: string | null = null;
  private enteredAt = 0;
  private lockedUntil = 0;
  private readonly options: Required<TargetOptions>;

  constructor(options: TargetOptions = {}) {
    this.options = { ...DEFAULTS, ...options };
  }

  reset(): void {
    this.activeId = null;
    this.enteredAt = 0;
    this.lockedUntil = 0;
  }

  /** Call once per frame with the pointer, or null when there is no hand. */
  update(pointer: Point2D | null, targets: readonly ARTarget[], now: number): TargetUpdate {
    if (!pointer) {
      this.activeId = null;
      return { hovering: null, selected: null, progress: [] };
    }

    let hovering: string | null = null;
    for (const target of targets) {
      if (target.disabled) continue;
      // The target the pointer is already in gets a slightly larger hitbox.
      const radius = target.id === this.activeId
        ? target.radius + this.options.stickyMargin
        : target.radius;
      const gap = Math.hypot(pointer.x - target.center.x, pointer.y - target.center.y);
      if (gap <= radius) { hovering = target.id; break; }
    }

    if (hovering !== this.activeId) {
      this.activeId = hovering;
      this.enteredAt = now;
    }

    if (!hovering) return { hovering: null, selected: null, progress: [] };
    if (now < this.lockedUntil) {
      return { hovering, selected: null, progress: [{ id: hovering, progress: 0 }] };
    }

    const held = now - this.enteredAt;
    const progress = Math.max(0, Math.min(1, held / this.options.dwellMs));

    if (progress >= 1) {
      this.lockedUntil = now + this.options.cooldownMs;
      this.activeId = null;
      return { hovering, selected: hovering, progress: [{ id: hovering, progress: 1 }] };
    }
    return { hovering, selected: null, progress: [{ id: hovering, progress }] };
  }
}
