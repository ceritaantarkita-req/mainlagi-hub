import type { PlayerId, Point } from "../engine/types";
import type { Landmark } from "./types";

export interface BodyCandidate {
  id: string;
  player: PlayerId;
  landmarks: Landmark[];
  center: Point;
}

export interface HandCandidate {
  id: string;
  landmarks: Landmark[];
  point: Point;
}

interface BodyObservation {
  id: string;
  landmarks: Landmark[];
  center: Point;
}

function centerOf(landmarks: Landmark[], index: number): BodyObservation {
  const keypoints = [landmarks[11], landmarks[12], landmarks[23], landmarks[24]].filter(
    Boolean
  ) as Landmark[];
  const x =
    keypoints.reduce((sum, point) => sum + (1 - point.x), 0) /
    Math.max(1, keypoints.length);
  const y =
    keypoints.reduce((sum, point) => sum + point.y, 0) /
    Math.max(1, keypoints.length);
  return { id: `body-${index}`, landmarks, center: { x, y } };
}

function pointDistance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function landmarkDistance(a?: Landmark, b?: Landmark): number {
  return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 999;
}

/**
 * Maintains temporal A/B slots instead of reassigning players solely from the
 * left/right order of one frame. The first frame initializes left-to-right;
 * subsequent frames choose the assignment with the lowest movement cost.
 */
export class BodySlotTracker {
  private anchors: Partial<Record<PlayerId, Point>> = {};
  private missingFrames: Record<PlayerId, number> = { A: 0, B: 0 };

  reset(): void {
    this.anchors = {};
    this.missingFrames = { A: 0, B: 0 };
  }

  update(landmarkSets: readonly Landmark[][], playerCount: 1 | 2): BodyCandidate[] {
    const observations = landmarkSets
      .map((landmarks, index) => centerOf(landmarks, index))
      .filter((body) => body.landmarks.length >= 25)
      .slice(0, Math.max(1, playerCount + 1));

    if (playerCount === 1) {
      const current = observations[0];
      if (!current) {
        this.missingFrames.A += 1;
        if (this.missingFrames.A > 30) delete this.anchors.A;
        return [];
      }
      this.missingFrames.A = 0;
      this.anchors.A = current.center;
      return [{ ...current, player: "A" }];
    }

    if (observations.length === 0) {
      this.missingFrames.A += 1;
      this.missingFrames.B += 1;
      if (this.missingFrames.A > 30) delete this.anchors.A;
      if (this.missingFrames.B > 30) delete this.anchors.B;
      return [];
    }

    if (!this.anchors.A || !this.anchors.B) {
      const ordered = [...observations].sort((left, right) => left.center.x - right.center.x);
      const result: BodyCandidate[] = [];
      const a = ordered[0];
      const b = ordered[1];
      if (a) {
        this.anchors.A = a.center;
        this.missingFrames.A = 0;
        result.push({ ...a, player: "A" });
      }
      if (b) {
        this.anchors.B = b.center;
        this.missingFrames.B = 0;
        result.push({ ...b, player: "B" });
      }
      return result;
    }

    if (observations.length === 1) {
      const body = observations[0]!;
      const distanceA = pointDistance(body.center, this.anchors.A);
      const distanceB = pointDistance(body.center, this.anchors.B);
      const player: PlayerId = distanceA <= distanceB ? "A" : "B";
      const other: PlayerId = player === "A" ? "B" : "A";
      this.anchors[player] = body.center;
      this.missingFrames[player] = 0;
      this.missingFrames[other] += 1;
      return [{ ...body, player }];
    }

    const first = observations[0]!;
    const second = observations[1]!;
    const normalCost =
      pointDistance(first.center, this.anchors.A) +
      pointDistance(second.center, this.anchors.B);
    const swappedCost =
      pointDistance(first.center, this.anchors.B) +
      pointDistance(second.center, this.anchors.A);

    const assignment =
      normalCost <= swappedCost
        ? ([
            { body: first, player: "A" as const },
            { body: second, player: "B" as const }
          ] as const)
        : ([
            { body: first, player: "B" as const },
            { body: second, player: "A" as const }
          ] as const);

    const result = assignment.map(({ body, player }) => {
      const previous = this.anchors[player]!;
      const smoothed = {
        x: previous.x + (body.center.x - previous.x) * 0.35,
        y: previous.y + (body.center.y - previous.y) * 0.35
      };
      this.anchors[player] = smoothed;
      this.missingFrames[player] = 0;
      return { ...body, player };
    });

    return result;
  }
}

export function playerForBody(body: BodyCandidate): PlayerId {
  return body.player;
}

export function assignHandToPlayer(
  hand: HandCandidate,
  bodies: readonly BodyCandidate[],
  playerCount: 1 | 2
): PlayerId | null {
  if (playerCount === 1) return "A";

  if (bodies.length >= 1) {
    const wrist = hand.landmarks[0];
    const ranked = bodies
      .map((body) => ({
        body,
        distance: Math.min(
          landmarkDistance(wrist, body.landmarks[15]),
          landmarkDistance(wrist, body.landmarks[16])
        )
      }))
      .sort((left, right) => left.distance - right.distance);
    const selected = ranked[0]?.body;
    if (selected && ranked[0]!.distance < 0.42) return selected.player;
  }

  if (hand.point.x < 0.46) return "A";
  if (hand.point.x > 0.54) return "B";
  return null;
}
