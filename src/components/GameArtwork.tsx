import Image from "next/image";
import type { GameSlug } from "@/lib/data/games";

/**
 * Game cover art.
 *
 * Replaced the hand-drawn abstract line scenes (26 Aug 2026) with illustrated
 * 3D-render style artwork of the app's mascot, one image per game, generated
 * externally and stored as WebP under `public/artwork/`. Kept the same
 * component signature so every call site (home page cards, catalog tiles,
 * game detail hero) needed zero changes.
 *
 * Source images are square (1:1) - `.fun-card__art`, `.game-tile` and
 * `.game-detail__art` size the container; this component just fills it via
 * `object-fit: cover` (see `.game-artwork` in globals.css).
 */
const ARTWORK_SRC: Record<GameSlug, string> = {
  "math-choice": "/artwork/math-choice.webp",
  "math-motion-battle": "/artwork/math-motion-battle.webp",
  "number-trace": "/artwork/number-trace.webp",
  "shape-quest": "/artwork/shape-quest.webp",
  "pattern-race": "/artwork/pattern-race.webp",
  "math-warung": "/artwork/math-warung.webp",
  "iqro-motion": "/artwork/iqro-motion.webp",
  "airboard-presenter": "/artwork/airboard-presenter.webp",
  "dodge-motion": "/artwork/dodge-motion.webp",
  "run-to-target": "/artwork/run-to-target.webp"
};

export function GameArtwork({ slug, label }: { slug: GameSlug; label?: string }) {
  return (
    <Image
      className="game-artwork"
      src={ARTWORK_SRC[slug]}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      width={640}
      height={640}
      draggable={false}
      priority={false}
    />
  );
}
