// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Deciding which detected hand belongs to which player.
 *
 * The old code asked "is this wrist left or right of the centre line?" on every
 * single frame, with a 4% dead band and numHands capped at 2. Three things went
 * wrong: one person showing both hands consumed both slots and starved the other
 * player, a hand near the middle switched owner several times a second, and a
 * hand that briefly left the frame came back as a different player.
 *
 * This tracker keeps identity across frames, so a hand stays with its player for
 * as long as it keeps being seen near where it was.
 */

import type { HandAnalysis } from "./landmarks";
import { DEFAULT_SPLIT, sideForX, type SideId, type SplitZone, type StagePoint } from "./coordinate";

export interface TrackedHand {
  analysis: HandAnalysis;
  stage: StagePoint;
  handedness: string;
}

export interface AssignedHand extends TrackedHand {
  side: SideId;
}

interface Anchor {
  x: number;
  y: number;
  lastSeen: number;
}

export interface AssignmentOptions {
  zone?: SplitZone;
  /** How long a player keeps its slot after the hand disappears. */
  holdMs?: number;
  /** Max distance (fraction of container width) for a hand to keep its identity. */
  reacquireRadius?: number;
  /**
   * How many people are playing.
   *
   * In solo mode the screen is NOT split. Splitting it for one player means a
   * right-handed user standing naturally has their hand land in player B's half
   * and gets no slot at all - the app looks broken while the hand is plainly
   * visible on screen. With `players: 1` every hand competes for slot A and the
   * divider is ignored entirely.
   */
  players?: 1 | 2;
}

export class HandAssigner {
  private anchors: Partial<Record<SideId, Anchor>> = {};
  private readonly zone: SplitZone;
  private readonly holdMs: number;
  private readonly reacquireRadius: number;
  private players: 1 | 2;

  constructor(options: AssignmentOptions = {}) {
    this.zone = options.zone ?? DEFAULT_SPLIT;
    this.holdMs = options.holdMs ?? 900;
    this.reacquireRadius = options.reacquireRadius ?? 0.28;
    this.players = options.players ?? 2;
  }

  /** Switch between solo and duel without rebuilding the tracker. */
  setPlayers(players: 1 | 2): void {
    if (players === this.players) return;
    this.players = players;
    this.reset();
  }

  get playerCount(): 1 | 2 {
    return this.players;
  }

  reset(): void {
    this.anchors = {};
  }

  /**
   * Returns at most one hand per player: whichever is pointing, or failing that
   * whichever is closest to where that player's hand was last seen.
   */
  assign(hands: readonly TrackedHand[], now: number): Partial<Record<SideId, AssignedHand>> {
    const result: Partial<Record<SideId, AssignedHand>> = {};
    const remaining = [...hands];

    // Solo: no divider, no second slot. Prefer a hand that is drawing; failing
    // that, whichever is closest to where this player's hand was last seen, so
    // a second hand drifting into frame cannot steal the stroke in progress.
    if (this.players === 1) {
      const anchor = this.anchors.A;
      let bestIndex = -1;
      let bestScore = Number.POSITIVE_INFINITY;
      remaining.forEach((hand, index) => {
        const drawing = hand.analysis.pose === "point" || hand.analysis.pose === "pinch";
        const gap = anchor ? Math.hypot(hand.stage.x - anchor.x, hand.stage.y - anchor.y) : 0;
        const score = gap - (drawing ? 0.5 : 0);
        if (score < bestScore) { bestScore = score; bestIndex = index; }
      });
      if (bestIndex >= 0) {
        const hand = remaining[bestIndex] as TrackedHand;
        result.A = { ...hand, side: "A" };
        this.anchors.A = { x: hand.stage.x, y: hand.stage.y, lastSeen: now };
      }
      return result;
    }

    // Pass 1: hands that are still near a live anchor keep their player.
    for (const side of ["A", "B"] as const) {
      const anchor = this.anchors[side];
      if (!anchor || now - anchor.lastSeen > this.holdMs) continue;
      let bestIndex = -1;
      let bestScore = Number.POSITIVE_INFINITY;
      remaining.forEach((hand, index) => {
        const gap = Math.hypot(hand.stage.x - anchor.x, hand.stage.y - anchor.y);
        if (gap > this.reacquireRadius) return;
        // Pointing hands win ties; they are the ones that can actually draw.
        const score = gap - (hand.analysis.pose === "point" ? 0.12 : 0);
        if (score < bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });
      if (bestIndex >= 0) {
        const [hand] = remaining.splice(bestIndex, 1);
        result[side] = { ...(hand as TrackedHand), side };
      }
    }

    // Pass 2: unclaimed hands fall back to which half of the screen they are in.
    for (const hand of remaining) {
      const side = sideForX(hand.stage.x, this.zone);
      if (!side || result[side]) continue;
      result[side] = { ...hand, side };
    }

    // Pass 3: if only one player is present, a second hand from the same person
    // must not be promoted into the empty slot. Nothing to do - we simply never
    // fill a slot from a hand on the wrong side of the divider.

    for (const side of ["A", "B"] as const) {
      const assigned = result[side];
      if (assigned) {
        this.anchors[side] = { x: assigned.stage.x, y: assigned.stage.y, lastSeen: now };
      }
    }
    return result;
  }

  /** True while the player's slot is still warm, even during a brief dropout. */
  isHeld(side: SideId, now: number): boolean {
    const anchor = this.anchors[side];
    return Boolean(anchor && now - anchor.lastSeen <= this.holdMs);
  }
}
