import type { Level, MathQuestion } from "./math";
import type { RandomSource } from "./random";

/**
 * Multiple-choice answers for a maths question.
 *
 * The point of a choice game here is to take handwriting out of the loop
 * entirely. Writing a numeral in mid-air is a second, harder skill layered on
 * top of the arithmetic, and for a five-year-old it is usually the *only*
 * thing standing between them and a correct answer. Picking one of four boxes
 * asks them the maths question and nothing else.
 *
 * That makes the distractors the whole design problem. Three random numbers
 * would let a child score by elimination without doing any arithmetic, and
 * would teach nothing when they got it wrong. The wrong options here are
 * therefore the answers a child actually arrives at by making a specific,
 * recognisable mistake: counting one too far, running the wrong operation,
 * dropping a carry. Choosing one is then informative rather than merely wrong.
 */

const CEILING: Record<Level, number> = { tk: 10, sd1: 30, sd2: 100 };

/** Mistakes a child plausibly makes, given the operation actually asked. */
function plausibleMistakes(question: MathQuestion): number[] {
  const [a, b] = question.operands;
  const { answer, operation } = question;

  switch (operation) {
    case "add":
      // Counting slips, and running the other operation by mistake.
      return [answer + 1, answer - 1, a - b, b - a, answer + 10, answer + 2];
    case "subtract":
      // Adding instead of subtracting is the classic one, as is subtracting
      // the wrong way round.
      return [answer + 1, answer - 1, a + b, b - a, answer + 2, a];
    case "multiply":
      // Off-by-one-group errors land exactly one factor away.
      return [answer + a, answer - a, answer + b, a + b, answer + 1, answer - 1];
    case "divide":
      return [answer + 1, answer - 1, a - b, b, answer * 2, a];
    default:
      return [answer + 1, answer - 1, answer + 2];
  }
}

export interface ChoiceSet {
  /** Shuffled options, always containing the answer exactly once. */
  options: number[];
  answer: number;
}

/**
 * Builds `count` options for a question, one of them correct.
 *
 * Every option is a whole number within the level's range, and the set never
 * repeats a value - a duplicate would make two boxes correct, or two boxes
 * pointlessly identical.
 */
export function buildChoices(
  random: RandomSource,
  question: MathQuestion,
  level: Level,
  count = 4
): ChoiceSet {
  const ceiling = CEILING[level];
  const { answer } = question;
  const chosen: number[] = [answer];

  const admissible = (value: number): boolean =>
    Number.isInteger(value) &&
    value >= 0 &&
    value <= ceiling &&
    !chosen.includes(value);

  for (const candidate of plausibleMistakes(question)) {
    if (chosen.length >= count) break;
    if (admissible(candidate)) chosen.push(candidate);
  }

  // Top up with near neighbours when the mistake list could not supply enough
  // - small answers near a range edge run out of room quickly.
  for (let spread = 1; chosen.length < count && spread <= ceiling; spread += 1) {
    for (const candidate of [answer - spread, answer + spread]) {
      if (chosen.length >= count) break;
      if (admissible(candidate)) chosen.push(candidate);
    }
  }

  // Last resort, for a range too small to hold `count` distinct values at all.
  for (let value = 0; chosen.length < count && value <= ceiling; value += 1) {
    if (admissible(value)) chosen.push(value);
  }

  // Fisher-Yates, so the answer is not biased towards any one box. A child
  // notices "it is always the second one" faster than an adult does.
  const options = [...chosen];
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = random.int(0, index);
    const held = options[index]!;
    options[index] = options[swap]!;
    options[swap] = held;
  }

  return { options, answer };
}
