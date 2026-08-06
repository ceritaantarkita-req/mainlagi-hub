export interface RandomSource { next(): number; int(min: number, max: number): number; pick<T>(items: readonly T[]): T }
export function createRandom(seed: number): RandomSource {
  let state = seed >>> 0 || 0x9e3779b9;
  const next = () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 0x100000000; };
  return { next, int(min, max) { return Math.floor(next() * (max - min + 1)) + min; }, pick<T>(items: readonly T[]) { if (!items.length) throw new Error("Cannot pick from empty list"); return items[Math.floor(next() * items.length)]!; } };
}
