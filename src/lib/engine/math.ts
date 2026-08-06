import type { RandomSource } from "./random";

export type Level = "tk" | "sd1" | "sd2";
export type Operation = "add" | "subtract" | "multiply" | "divide";
export interface MathQuestion { id: string; prompt: string; answer: number; operation: Operation; operands: [number, number] }
export interface PatternQuestion { id: string; sequence: number[]; answer: number; prompt: string }

const LIMITS: Record<Level, { maxAnswer: number; maxFactor: number; operations: Operation[] }> = {
  tk: { maxAnswer: 10, maxFactor: 3, operations: ["add", "subtract"] },
  sd1: { maxAnswer: 30, maxFactor: 5, operations: ["add", "subtract", "multiply"] },
  sd2: { maxAnswer: 100, maxFactor: 10, operations: ["add", "subtract", "multiply", "divide"] }
};

export function createMathQuestion(random: RandomSource, level: Level, operations?: readonly Operation[], id = "q"): MathQuestion {
  const limit = LIMITS[level];
  const available = operations?.filter((item) => limit.operations.includes(item)) ?? limit.operations;
  const operation = random.pick(available.length ? available : limit.operations);
  let a = 0; let b = 0; let answer = 0; let symbol = "+";
  if (operation === "add") { answer = random.int(0, limit.maxAnswer); a = random.int(0, answer); b = answer - a; symbol = "+"; }
  if (operation === "subtract") { a = random.int(0, limit.maxAnswer); b = random.int(0, a); answer = a - b; symbol = "−"; }
  if (operation === "multiply") { a = random.int(0, limit.maxFactor); b = random.int(0, limit.maxFactor); answer = a * b; if (answer > limit.maxAnswer) { b = a === 0 ? 0 : Math.floor(limit.maxAnswer / a); answer = a * b; } symbol = "×"; }
  if (operation === "divide") { b = random.int(1, limit.maxFactor); answer = random.int(0, Math.min(limit.maxFactor, Math.floor(limit.maxAnswer / b))); a = b * answer; symbol = "÷"; }
  return { id, prompt: `${a} ${symbol} ${b} = ?`, answer, operation, operands: [a, b] };
}

export function validateMathQuestion(question: MathQuestion, level: Level): string[] {
  const limit = LIMITS[level]; const [a, b] = question.operands; let calculated = 0;
  if (question.operation === "add") calculated = a + b;
  if (question.operation === "subtract") calculated = a - b;
  if (question.operation === "multiply") calculated = a * b;
  if (question.operation === "divide") calculated = a / b;
  const errors: string[] = [];
  if (!Number.isInteger(calculated)) errors.push("non-integer");
  if (calculated !== question.answer) errors.push("answer mismatch");
  if (question.answer < 0 || question.answer > limit.maxAnswer) errors.push("out of range");
  if (question.operation === "divide" && b === 0) errors.push("division by zero");
  return errors;
}

export function createPatternQuestion(random: RandomSource, level: Level, id = "p"): PatternQuestion {
  const max = level === "tk" ? 10 : level === "sd1" ? 30 : 100;
  const step = random.int(1, level === "tk" ? 2 : level === "sd1" ? 5 : 10);
  const descending = level !== "tk" && random.next() > 0.72;
  const count = 4;
  let start = descending ? random.int(step * count, max) : random.int(0, Math.max(0, max - step * count));
  const sequence = Array.from({ length: count }, (_, index) => start + (descending ? -step : step) * index);
  const answer = sequence[sequence.length - 1]! + (descending ? -step : step);
  return { id, sequence, answer, prompt: `${sequence.join(" · ")} · ?` };
}
