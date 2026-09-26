"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { GameArtwork } from "@/components/GameArtwork";
import { GAME_LIST, type GameDefinition } from "@/lib/data/games";

function GridTile({ game }: { game: GameDefinition }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="fun-card core-thumbnail-game-card"
      data-core-thumbnail-card="game"
      data-core-thumbnail-id={game.slug}
    >
      <span className="fun-card__art" aria-hidden>
        <GameArtwork slug={game.slug} />
      </span>
      <span className="core-thumbnail-game-name">
        <strong>{game.shortTitle}</strong>
      </span>
    </Link>
  );
}

export function GameCatalog() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GAME_LIST;
    return GAME_LIST.filter((game) =>
      [game.slug, game.title, game.shortTitle, game.description, game.age, ...game.capabilities]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  return (
    <div className="catalog">
      <div className="discover-toolbar">
        <label className="catalog-search">
          <span className="catalog-search__icon" aria-hidden><Icon name="discover" size={21} /></span>
          <input
            type="search"
            placeholder="Cari game…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Cari game"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="catalog-empty">Tidak ada hasil. Coba kata kunci lain.</p>
      ) : (
        <div className="game-grid core-thumbnail-game-grid" data-core-thumbnail-grid="games">
          {filtered.map((game) => (
            <GridTile key={game.slug} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
