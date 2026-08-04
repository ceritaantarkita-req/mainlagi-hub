export interface RandomSource {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
}

export function createRandom(seed = Date.now()): RandomSource {
  let state = seed >>> 0;
  const next = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int(min, max) {
      if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
        throw new Error(`Invalid integer range: ${min}..${max}`);
      }
      return Math.floor(next() * (max - min + 1)) + min;
    },
    pick<T>(items: readonly T[]) {
      if (items.length === 0) throw new Error("Cannot pick from an empty collection.");
      return items[Math.floor(next() * items.length)] as T;
    }
  };
}

export function createId(prefix: string, rng: RandomSource): string {
  return `${prefix}-${Math.floor(rng.next() * 1_000_000_000).toString(36)}`;
}
