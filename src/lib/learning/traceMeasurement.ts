import { DIGIT_TEMPLATES } from "@/lib/engine/templates";
import type { Stroke } from "@/lib/engine/types";
import { evaluateGuidedTrace, type GuidedTraceResult } from "@/lib/tracing/guided";
import type { LearningAttemptOutcome } from "./attempts";

export interface LearningTraceMeasurement {
  accepted: boolean;
  result: GuidedTraceResult;
  outcome: LearningAttemptOutcome | null;
}

/**
 * Evaluates a touch/pen digit trace in normalized 0..1 coordinates using the
 * same guided-tracing engine as Mainlagi's motion games. This function is
 * intentionally digit-agnostic so future learning activities can add another
 * numeral without inventing a new scoring rule.
 */
export function measureLearningDigitTrace(args: {
  digit: number;
  strokes: readonly Stroke[];
  retryCount?: number;
  startedAt?: string;
  completedAt?: string;
}): LearningTraceMeasurement {
  const target = DIGIT_TEMPLATES[args.digit]?.[0];
  if (!target) throw new Error(`Unsupported learning trace digit: ${args.digit}`);

  // Learning touch traces are deliberately more tolerant than a fine-motor
  // handwriting assessment. We measure path adherence, not penmanship quality.
  const result = evaluateGuidedTrace(args.strokes, target, {
    corridor: 0.13,
    sampleCount: 96,
    requireDirection: true,
    minCoverage: 0.68,
    maxOffPathRatio: 0.42,
    minScore: 62
  });

  if (!result.accepted) return { accepted: false, result, outcome: null };

  const normalizedScore = Math.max(0, Math.min(1, result.score / 100));
  return {
    accepted: true,
    result,
    outcome: {
      status: "completed",
      assessed: true,
      score: normalizedScore,
      accuracy: normalizedScore,
      correctCount: 1,
      incorrectCount: Math.max(0, args.retryCount ?? 0),
      retryCount: Math.max(0, args.retryCount ?? 0),
      inputMode: "touch",
      startedAt: args.startedAt,
      completedAt: args.completedAt,
      metadata: {
        source: "guided-trace-evaluator",
        evidenceFidelity: "guided_trace_path_score",
        digit: args.digit,
        traceScore: result.score,
        coverage: result.coverage,
        precision: result.precision,
        offPathRatio: result.offPathRatio,
        directionScore: result.directionScore
      }
    }
  };
}
