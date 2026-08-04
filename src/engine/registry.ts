import type { GameId } from "./types.js";

export interface GameDefinition {
  id: GameId;
  title: string;
  shortTitle: string;
  description: string;
  age: string;
  players: "1 pemain" | "1–2 pemain";
  color: string;
  image: string;
  capabilities: string[];
}

export const GAME_REGISTRY: Record<GameId, GameDefinition> = {
  "math-battle": {
    id: "math-battle",
    title: "Math Motion Battle",
    shortTitle: "Math Battle",
    description: "Adu cepat menjawab tambah, kurang, kali, dan bagi dengan menulis angka di udara.",
    age: "TK–SD 2",
    players: "1–2 pemain",
    color: "green",
    image: "/concepts/math-battle.png",
    capabilities: ["hand-tracking", "air-writing-digit", "split-screen", "random-math"]
  },
  "number-trace": {
    id: "number-trace",
    title: "Number Trace Adventure",
    shortTitle: "Number Trace",
    description: "Ikuti jalur angka dengan telunjuk untuk melatih bentuk angka dan motorik halus.",
    age: "TK A–TK B",
    players: "1 pemain",
    color: "blue",
    image: "/concepts/number-trace.png",
    capabilities: ["hand-tracking", "guided-tracing", "path-scoring"]
  },
  "shape-quest": {
    id: "shape-quest",
    title: "Shape Quest",
    shortTitle: "Shape Quest",
    description: "Gambar lingkaran, segitiga, persegi, dan pola lain langsung di udara.",
    age: "TK–SD 1",
    players: "1 pemain",
    color: "orange",
    image: "/concepts/shape-quest.png",
    capabilities: ["hand-tracking", "shape-tracing", "path-scoring"]
  },
  "pattern-race": {
    id: "pattern-race",
    title: "Pattern Race",
    shortTitle: "Pattern Race",
    description: "Temukan angka berikutnya dari pola dan tulis jawabannya sebelum lawan.",
    age: "TK B–SD 2",
    players: "1–2 pemain",
    color: "purple",
    image: "/concepts/pattern-race.png",
    capabilities: ["hand-tracking", "air-writing-digit", "split-screen", "random-pattern"]
  }
};

export function isGameId(value: string): value is GameId {
  return Object.prototype.hasOwnProperty.call(GAME_REGISTRY, value);
}
