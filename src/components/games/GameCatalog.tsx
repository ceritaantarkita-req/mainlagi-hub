"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { GameIcon } from "@/components/GameIcon";
import { GameArtwork } from "@/components/GameArtwork";
import { GAME_LIST, type GameDefinition } from "@/lib/data/games";
import { GAME_THEMES } from "@/lib/data/gameThemes";

type View = "grid" | "list";

function GridTile({ game }: { game: GameDefinition }) {
  const theme = GAME_THEMES[game.slug];
  return (
    <Link
      href={`/games/${game.slug}`}
      className="fun-card"
      style={{ "--from": theme.from, "--to": theme.to } as React.CSSProperties}
    >
      <span className="fun-card__art" aria-hidden>
        <GameArtwork slug={game.slug} />
      </span>
      <span className="fun-card__body">
        <span className="fun-card__title">
          <span className="fun-card__glyph" aria-hidden>
            <GameIcon name={game.icon} size={30} />
          </span>
          <strong>{game.shortTitle}</strong>
        </span>
        <span className="fun-card__meta">{game.age} · {game.visionMode === "pose" ? "Gerak badan" : "Gerak tangan"}</span>
        <span className="fun-card__play">Mainkan <b aria-hidden><Icon name="arrow" size={19} /></b></span>
      </span>
    </Link>
  );
}

function ListRow({ game }: { game: GameDefinition }) {
  return (
    <Link href={`/games/${game.slug}`} className="row">
      <span className="row__thumb" aria-hidden>
        <GameIcon name={game.icon} size={30} />
      </span>
      <span className="row__body">
        <strong>{game.shortTitle}</strong>
        <small>{game.description}</small>
      </span>
      <span className="row__arrow" aria-hidden><Icon name="arrow" size={18} /></span>
    </Link>
  );
}

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function GameCatalog() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("grid");

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
        <div className="view-toggle" role="group" aria-label="Tampilan">
          <button
            type="button"
            className={view === "grid" ? "is-active" : ""}
            onClick={() => setView("grid")}
            aria-label="Tampilan grid"
          >
            <IconGrid />
          </button>
          <button
            type="button"
            className={view === "list" ? "is-active" : ""}
            onClick={() => setView("list")}
            aria-label="Tampilan daftar"
          >
            <IconList />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="catalog-empty">Tidak ada hasil. Coba kata kunci lain.</p>
      ) : view === "grid" ? (
        <div className="game-grid">
          {filtered.map((game) => (
            <GridTile key={game.slug} game={game} />
          ))}
        </div>
      ) : (
        <div className="discover-list">
          {filtered.map((game) => (
            <ListRow key={game.slug} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
