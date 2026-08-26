/**
 * Pure ranking rules shared by the leaderboard.
 *
 * Separated from the storage layer so the ordering can be tested directly.
 * The tie-break matters more than it looks: without one, two equal scores
 * swap places every time the list is re-sorted, and a child watching the
 * board sees their name jump around for no reason.
 */

export interface RankableEntry {
  score: number;
  /** Epoch ms. Earlier runs win ties. */
  at: number;
}

/** Highest score first; for equal scores, whoever got there first stays ahead. */
export function orderEntries<T extends RankableEntry>(entries: readonly T[]): T[] {
  return [...entries].sort(
    (left, right) => right.score - left.score || left.at - right.at
  );
}

/**
 * The 1-based place `score` would take among `entries`, without inserting it.
 *
 * Counts entries that are *at least* as good, not merely better, because a
 * new run is always the newest and `orderEntries` puts the earlier run first
 * on a tie. Using a strict `>` here would preview "you are #1" for a score
 * that lands at #2 the moment it is saved, and the number changing under the
 * player's eyes reads as the game getting it wrong.
 */
export function rankOf(entries: readonly RankableEntry[], score: number): number {
  return entries.filter((entry) => entry.score >= score).length + 1;
}
