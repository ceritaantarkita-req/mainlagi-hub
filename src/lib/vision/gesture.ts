import type { GestureName, Landmark } from "./types";

function distance(a?: Landmark, b?: Landmark): number { return a && b ? Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0)) : 999; }
function angle(a?: Landmark, b?: Landmark, c?: Landmark): number {
  if (!a || !b || !c) return 0; const ax = a.x - b.x; const ay = a.y - b.y; const bx = c.x - b.x; const by = c.y - b.y; const denominator = Math.hypot(ax, ay) * Math.hypot(bx, by); if (denominator < 1e-8) return 180; const cosine = Math.max(-1, Math.min(1, (ax * bx + ay * by) / denominator)); return Math.acos(cosine) * 180 / Math.PI;
}
function extended(landmarks: readonly Landmark[], joints: readonly [number, number, number, number], threshold = 155): boolean { const [mcp, pip, dip, tip] = joints; return angle(landmarks[mcp], landmarks[pip], landmarks[dip]) >= threshold && angle(landmarks[pip], landmarks[dip], landmarks[tip]) >= threshold - 22; }
const FINGERS = { index: [5,6,7,8], middle: [9,10,11,12], ring: [13,14,15,16], pinky: [17,18,19,20] } as const;
export function analyzeGesture(landmarks: readonly Landmark[]): { gesture: GestureName; pinchRatio: number; confidence: number } {
  if (landmarks.length < 21) return { gesture: "unknown", pinchRatio: 99, confidence: 0 };
  const palm = Math.max(.0001, distance(landmarks[0], landmarks[9])); const pinchRatio = distance(landmarks[4], landmarks[8]) / palm;
  const index = extended(landmarks, FINGERS.index); const middle = extended(landmarks, FINGERS.middle); const ring = extended(landmarks, FINGERS.ring); const pinky = extended(landmarks, FINGERS.pinky); const count = [index,middle,ring,pinky].filter(Boolean).length;
  if (pinchRatio < .42) return { gesture: "pinch", pinchRatio, confidence: Math.max(.55, 1 - pinchRatio / .42) };
  if (count >= 4) return { gesture: "open", pinchRatio, confidence: .9 };
  if (count === 0) return { gesture: "fist", pinchRatio, confidence: .86 };
  if (index && count === 1) return { gesture: "point", pinchRatio, confidence: .92 };
  return { gesture: "unknown", pinchRatio, confidence: .45 };
}

export class GestureLatch {
  private active: GestureName = "unknown";
  private candidate: GestureName = "unknown";
  private frames = 0;
  constructor(private readonly enterFrames = 3, private readonly exitFrames = 2) {}
  update(next: GestureName): GestureName {
    if (next === this.active) { this.candidate = next; this.frames = 0; return this.active; }
    if (next !== this.candidate) { this.candidate = next; this.frames = 1; } else this.frames += 1;
    const required = next === "unknown" ? this.exitFrames : this.enterFrames;
    if (this.frames >= required) { this.active = next; this.frames = 0; }
    return this.active;
  }
  reset() { this.active = "unknown"; this.candidate = "unknown"; this.frames = 0; }
}
