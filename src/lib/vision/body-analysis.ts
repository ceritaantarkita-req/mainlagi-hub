import { calibrateBody, classifyBodyAction, type BodyCalibration, type BodySample } from "../engine/body";
import type { Landmark } from "./types";

export function bodySample(landmarks: readonly Landmark[]): BodySample {
  const ls = landmarks[11]; const rs = landmarks[12]; const lh = landmarks[23]; const rh = landmarks[24]; const lk = landmarks[25]; const rk = landmarks[26];
  const shoulderX = ls && rs ? (ls.x + rs.x) / 2 : .5; const hipX = lh && rh ? (lh.x + rh.x) / 2 : shoulderX; const hipY = lh && rh ? (lh.y + rh.y) / 2 : .58; const shoulderWidth = ls && rs ? Math.hypot(ls.x - rs.x, ls.y - rs.y) : .18; const torsoHeight = ls && lh ? Math.hypot(ls.x - lh.x, ls.y - lh.y) : .25; const torsoScale = Math.max(.001, shoulderWidth + torsoHeight); const kneeY = lk && rk ? (lk.y + rk.y) / 2 : hipY + .22; const kneeCompression = Math.max(0, .24 - (kneeY - hipY));
  return { centerX: 1 - (shoulderX + hipX) / 2, hipY, torsoScale, kneeCompression };
}
export function initialCalibration(sample: BodySample): BodyCalibration { return calibrateBody([sample]); }
export function actionFromLandmarks(landmarks: readonly Landmark[], baseline: BodyCalibration) { return classifyBodyAction(bodySample(landmarks), baseline); }
