import { createId, type RandomSource } from "./random.js";
import { DIGIT_TEMPLATES, SHAPE_TEMPLATES } from "./templates.js";
import type {
  Challenge,
  LevelId,
  MathChallenge,
  Operation,
  PatternChallenge,
  ShapeChallenge,
  ShapeName,
  TraceChallenge
} from "./types.js";

const OP_SYMBOL: Record<Operation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷"
};

export function allowedOperations(level: LevelId): Operation[] {
  if (level === "kindergarten") return ["add", "subtract"];
  if (level === "grade-1") return ["add", "subtract"];
  return ["add", "subtract", "multiply", "divide"];
}

function buildMath(operation: Operation, level: LevelId, rng: RandomSource): MathChallenge {
  let a = 0;
  let b = 0;
  let answer = 0;

  if (operation === "add") {
    const max = level === "kindergarten" ? 10 : level === "grade-1" ? 20 : 100;
    answer = rng.int(level === "kindergarten" ? 1 : 2, max);
    a = rng.int(0, answer);
    b = answer - a;
  } else if (operation === "subtract") {
    const max = level === "kindergarten" ? 10 : level === "grade-1" ? 20 : 100;
    a = rng.int(0, max);
    b = rng.int(0, a);
    answer = a - b;
  } else if (operation === "multiply") {
    a = rng.int(1, 10);
    b = rng.int(1, 10);
    answer = a * b;
  } else {
    b = rng.int(1, 10);
    answer = rng.int(1, 10);
    a = b * answer;
  }

  return {
    kind: "math",
    id: createId("math", rng),
    prompt: `${a} ${OP_SYMBOL[operation]} ${b} = ?`,
    answer,
    operation,
    operands: [a, b]
  };
}

export function createMathChallenge(level: LevelId, rng: RandomSource, operation?: Operation): MathChallenge {
  return buildMath(operation ?? rng.pick(allowedOperations(level)), level, rng);
}

export function createPatternChallenge(level: LevelId, rng: RandomSource): PatternChallenge {
  const maxAnswer = level === "kindergarten" ? 10 : level === "grade-1" ? 20 : 100;
  const length = level === "kindergarten" ? 3 : 4;
  const maxStep = level === "kindergarten" ? 2 : level === "grade-1" ? 5 : 10;
  const step = rng.int(1, maxStep);
  const direction = level === "kindergarten" || rng.next() > 0.35 ? 1 : -1;
  const signedStep = step * direction;
  const largestOffset = length * Math.abs(signedStep);
  const start = direction > 0 ? rng.int(0, Math.max(0, maxAnswer - largestOffset)) : rng.int(largestOffset, maxAnswer);
  const sequence = Array.from({ length }, (_, index) => start + index * signedStep);
  const answer = start + length * signedStep;
  return {
    kind: "pattern",
    id: createId("pattern", rng),
    sequence,
    prompt: `${sequence.join(", ")}, ?`,
    answer,
    step: signedStep
  };
}

export function createTraceChallenge(rng: RandomSource): TraceChallenge {
  const digit = rng.int(0, 9);
  return {
    kind: "trace",
    id: createId("trace", rng),
    digit,
    prompt: `Ikuti jalur angka ${digit}`,
    target: DIGIT_TEMPLATES[digit]![0]!
  };
}

export function createShapeChallenge(rng: RandomSource): ShapeChallenge {
  const shapes = Object.keys(SHAPE_TEMPLATES) as ShapeName[];
  const shape = rng.pick(shapes);
  const labels: Record<ShapeName, string> = {
    circle: "lingkaran",
    triangle: "segitiga",
    square: "persegi",
    rectangle: "persegi panjang",
    zigzag: "zigzag"
  };
  return {
    kind: "shape",
    id: createId("shape", rng),
    shape,
    prompt: `Gambar ${labels[shape]}`,
    target: SHAPE_TEMPLATES[shape]
  };
}

export function createChallenge(gameId: string, level: LevelId, rng: RandomSource): Challenge {
  switch (gameId) {
    case "math-battle":
      return createMathChallenge(level, rng);
    case "pattern-race":
      return createPatternChallenge(level, rng);
    case "number-trace":
      return createTraceChallenge(rng);
    case "shape-quest":
      return createShapeChallenge(rng);
    default:
      throw new Error(`Unsupported game: ${gameId}`);
  }
}

export class ChallengeDeck {
  private readonly recentIds = new Set<string>();
  private readonly recentSignatures: string[] = [];
  private readonly historyLimit: number;

  constructor(
    private readonly gameId: string,
    private readonly level: LevelId,
    private readonly rng: RandomSource,
    historyLimit = 20
  ) {
    const domainSafeLimit = gameId === "number-trace" ? 5 : gameId === "shape-quest" ? 3 : historyLimit;
    this.historyLimit = Math.max(1, Math.min(historyLimit, domainSafeLimit));
  }

  next(): Challenge {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const challenge = createChallenge(this.gameId, this.level, this.rng);
      const signature = challenge.kind === "math"
        ? `${challenge.operation}:${challenge.operands.join(":")}`
        : challenge.kind === "pattern"
          ? `${challenge.sequence.join(":")}:${challenge.step}`
          : challenge.kind === "trace"
            ? `digit:${challenge.digit}`
            : `shape:${challenge.shape}`;
      if (!this.recentIds.has(challenge.id) && !this.recentSignatures.includes(signature)) {
        this.recentIds.add(challenge.id);
        this.recentSignatures.push(signature);
        if (this.recentSignatures.length > this.historyLimit) this.recentSignatures.shift();
        return challenge;
      }
    }
    return createChallenge(this.gameId, this.level, this.rng);
  }
}
