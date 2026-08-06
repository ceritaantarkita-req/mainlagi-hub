import type { BodyAction } from "./types";
export interface BodySample { centerX: number; hipY: number; torsoScale: number; kneeCompression: number }
export interface BodyCalibration { centerX: number; hipY: number; torsoScale: number }
export function calibrateBody(samples: readonly BodySample[]): BodyCalibration { if (!samples.length) return { centerX: .5, hipY: .58, torsoScale: 1 }; return { centerX: samples.reduce((s, v) => s + v.centerX, 0) / samples.length, hipY: samples.reduce((s, v) => s + v.hipY, 0) / samples.length, torsoScale: samples.reduce((s, v) => s + v.torsoScale, 0) / samples.length }; }
export function classifyBodyAction(sample: BodySample, baseline: BodyCalibration): BodyAction {
  const dx = sample.centerX - baseline.centerX; const dy = sample.hipY - baseline.hipY; const scale = sample.torsoScale / Math.max(.001, baseline.torsoScale);
  if (dy < -.085) return "jump"; if (sample.kneeCompression > .22 || dy > .09) return "crouch"; if (dx < -.12) return "left"; if (dx > .12) return "right"; if (scale > 1.16) return "forward"; if (scale < .84) return "back"; return "center";
}
