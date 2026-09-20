import type { MatchItem } from "./system";

export type MatchingLayoutCard = MatchItem & {
  id: string;
  sourceIndex: number;
};

export type MatchingColumns = {
  left: MatchingLayoutCard[];
  right: MatchingLayoutCard[];
};

export function matchingSeedFromText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 1;
}

function mulberry32(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function rotate<T>(items: T[], amount: number): T[] {
  if (!items.length) return [];
  const offset = ((amount % items.length) + items.length) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function rowLeaksAnswer(left: MatchingLayoutCard[], right: MatchingLayoutCard[]) {
  return left.some((item, index) => item.pair === right[index]?.pair);
}

export function matchingLayoutSignature(layout: MatchingColumns) {
  return [
    layout.left.map((item) => item.id).join(","),
    layout.right.map((item) => item.id).join(",")
  ].join("|");
}

export function buildMatchingColumns(items: MatchItem[], seed: number): MatchingColumns {
  const groups = new Map<string, MatchingLayoutCard[]>();
  items.forEach((item, sourceIndex) => {
    const card: MatchingLayoutCard = {
      ...item,
      id: `${sourceIndex}:${item.pair}`,
      sourceIndex
    };
    const group = groups.get(item.pair) ?? [];
    group.push(card);
    groups.set(item.pair, group);
  });

  const validPairs = [...groups.values()].filter((group) => group.length === 2);
  const random = mulberry32(seed || 1);
  const left: MatchingLayoutCard[] = [];
  const right: MatchingLayoutCard[] = [];

  for (const pair of validPairs) {
    const swapSides = random() >= 0.5;
    left.push(swapSides ? pair[1] : pair[0]);
    right.push(swapSides ? pair[0] : pair[1]);
  }

  const shuffledLeft = shuffle(left, random);
  let shuffledRight = shuffle(right, random);

  // Matching activities are contractually at least two complete pairs.
  // Rotate only the right column until no correct pair shares a row.
  if (shuffledLeft.length > 1 && rowLeaksAnswer(shuffledLeft, shuffledRight)) {
    const start = Math.max(1, Math.floor(random() * shuffledRight.length));
    for (let step = 0; step < shuffledRight.length; step += 1) {
      const candidate = rotate(shuffledRight, start + step);
      if (!rowLeaksAnswer(shuffledLeft, candidate)) {
        shuffledRight = candidate;
        break;
      }
    }
  }

  return { left: shuffledLeft, right: shuffledRight };
}

export function nextDistinctMatchingSeed(items: MatchItem[], currentSeed: number) {
  const current = matchingLayoutSignature(buildMatchingColumns(items, currentSeed));
  for (let offset = 1; offset <= 128; offset += 1) {
    const candidate = (currentSeed + offset) >>> 0 || offset;
    if (matchingLayoutSignature(buildMatchingColumns(items, candidate)) !== current) return candidate;
  }
  return (currentSeed + 129) >>> 0 || 129;
}
