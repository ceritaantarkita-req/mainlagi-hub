import type { RandomSource } from "./random";

export interface MoneyChoiceSet {
  /** Shuffled options, always containing the answer exactly once. */
  options: number[];
  answer: number;
}

/**
 * Multiple-choice options for a money amount (a non-negative whole number of
 * thousands of rupiah - a cart total or a change amount).
 *
 * Mirrors the reasoning in `choices.ts`: the wrong options are not random
 * noise, they are the specific slip a child makes (forgot to count one item,
 * subtracted the wrong way round, forgot to subtract at all). `mistakes` is
 * supplied by the caller because what a plausible mistake looks like depends
 * on the question - summing a cart and making change fail in different ways.
 */
export function buildMoneyChoices(
  random: RandomSource,
  answer: number,
  mistakes: number[],
  count = 4,
  ceiling = 60
): MoneyChoiceSet {
  const chosen: number[] = [answer];

  const admissible = (value: number): boolean =>
    Number.isInteger(value) &&
    value >= 0 &&
    value <= ceiling &&
    !chosen.includes(value);

  for (const candidate of mistakes) {
    if (chosen.length >= count) break;
    if (admissible(candidate)) chosen.push(candidate);
  }

  // Top up with near neighbours when the mistake list could not supply
  // enough distinct, in-range values on its own.
  for (let spread = 1; chosen.length < count && spread <= ceiling; spread += 1) {
    for (const candidate of [answer - spread, answer + spread]) {
      if (chosen.length >= count) break;
      if (admissible(candidate)) chosen.push(candidate);
    }
  }

  // Last resort, for an answer near the edge of the range.
  for (let value = 0; chosen.length < count && value <= ceiling; value += 1) {
    if (admissible(value)) chosen.push(value);
  }

  // Fisher-Yates, so the answer is not biased towards any one box.
  const options = [...chosen];
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = random.int(0, index);
    const held = options[index]!;
    options[index] = options[swap]!;
    options[swap] = held;
  }

  return { options, answer };
}
