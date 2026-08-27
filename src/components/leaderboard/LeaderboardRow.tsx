"use client";

import { useState, type KeyboardEvent } from "react";
import { GAMES, type GameSlug } from "@/lib/data/games";
import { Icon } from "@/components/Icon";
import { ShareActions, type ShareTarget } from "./ShareActions";

export function LeaderboardRow({
  rank,
  name,
  score,
  gameSlug,
  weekKey,
  onOpen
}: {
  rank: number;
  name: string;
  score: number;
  gameSlug: GameSlug;
  weekKey: string;
  onOpen: (target: ShareTarget) => void;
}) {
  const [open, setOpen] = useState(false);
  const target: ShareTarget = {
    name,
    game: GAMES[gameSlug].shortTitle,
    score,
    rank,
    weekKey,
    href: `/leaderboards/${gameSlug}`
  };

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") onOpen(target);
  };

  return (
    <div
      className="lb-row"
      data-rank={rank}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(target)}
      onKeyDown={handleKey}
    >
      <span className="lb-row__rank">{rank}</span>
      <span className="lb-row__info">
        <strong>{name}</strong>
        <small>{GAMES[gameSlug].shortTitle}</small>
      </span>
      <span className="lb-row__score">{score}</span>

      <span
        className="lb-row__menu"
        role="button"
        tabIndex={0}
        aria-label="Opsi berbagi"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.stopPropagation();
            setOpen((value) => !value);
          }
        }}
      >
        <span className="lb-dots" aria-hidden><Icon name="dots" size={20} /></span>
        {open ? (
          <span className="lb-pop" onClick={(event) => event.stopPropagation()}>
            <ShareActions target={target} onDone={() => setOpen(false)} />
          </span>
        ) : null}
      </span>
    </div>
  );
}
