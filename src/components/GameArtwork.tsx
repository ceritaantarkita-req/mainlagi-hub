import Image from "next/image";
import type { GameSlug } from "@/lib/data/games";
import { CORE_GAME_THUMBNAILS } from "@/lib/learning/coreThumbnailRegistry";

/**
 * Canonical Main Gerak thumbnail.
 *
 * Wave 01 replaces the historical mixed game artwork with one consistent
 * 4:3 family sourced from the audited Drive masters and stored as optimized
 * repository-controlled WebP files.
 */
export function GameArtwork({ slug, label }: { slug: GameSlug; label?: string }) {
  return (
    <Image
      className="game-artwork"
      src={CORE_GAME_THUMBNAILS[slug]}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      width={1200}
      height={900}
      draggable={false}
      priority={false}
    />
  );
}
