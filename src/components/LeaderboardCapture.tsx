"use client";

import { useEffect, useMemo, useState } from "react";
import type { GameSlug } from "@/lib/data/games";
import {
  normalizeName,
  rankFor,
  readBoard,
  readSavedName,
  submitScore,
  type LeaderboardEntry
} from "@/lib/data/leaderboard";

/**
 * End-of-round leaderboard block: where this score landed, and a name box to
 * keep it.
 *
 * The rank is worked out and shown *before* anything is saved. A child who
 * just came third should be able to see that they came third without first
 * being made to fill in a form - the name box is the reward for a good run,
 * not a toll gate in front of the result.
 */
export function LeaderboardCapture({
  game,
  score,
  durationSeconds,
  label
}: {
  game: GameSlug;
  score: number;
  durationSeconds?: number;
  label?: string;
}) {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<{ rank: number; total: number } | null>(
    null
  );
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  /** Id of the row this player just saved, so it can be highlighted. */
  const [savedId, setSavedId] = useState<string | null>(null);
  /* eslint-disable react-hooks/set-state-in-effect -- localStorage is only
     readable after mount; reading it during render would break hydration. */
  useEffect(() => {
    setName(readSavedName());
    setBoard(readBoard(game));
  }, [game]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /** Provisional placing, recomputed only while the score is still unsaved. */
  const provisionalRank = useMemo(
    () => (saved ? saved.rank : rankFor(game, score)),
    [game, saved, score]
  );
  const total = saved ? saved.total : board.length + 1;

  const commit = () => {
    if (saved) return;
    const result = submitScore(game, name, score, durationSeconds);
    setSavedId(result.entry.id);
    setSaved({ rank: result.rank, total: result.total });
    setBoard(readBoard(game));
  };

  const top = board.slice(0, 5);
  const medal = (place: number) =>
    place === 1 ? "🥇" : place === 2 ? "🥈" : place === 3 ? "🥉" : `${place}`;

  return (
    <div className="leaderboard-capture">
      <div className="leaderboard-rank" data-top={provisionalRank <= 3 ? "true" : undefined}>
        <small>{label ?? "PERINGKAT KAMU"}</small>
        <strong>
          #{provisionalRank}
          <em> dari {total}</em>
        </strong>
      </div>

      {saved ? (
        <p className="leaderboard-saved">
          Tersimpan sebagai <b>{normalizeName(name) || "Pemain"}</b>.
        </p>
      ) : (
        <form
          className="leaderboard-form"
          onSubmit={(event) => {
            event.preventDefault();
            commit();
          }}
        >
          <label>
            <span>Tulis nama untuk simpan skor</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama kamu"
              maxLength={16}
              autoComplete="off"
            />
          </label>
          <button className="button button--primary" type="submit">
            Simpan skor
          </button>
        </form>
      )}

      {top.length ? (
        <ol className="leaderboard-top">
          {top.map((entry, index) => (
            <li
              key={entry.id}
              className={entry.id === savedId ? "is-me" : ""}
            >
              <b aria-hidden>{medal(index + 1)}</b>
              <span>{entry.name}</span>
              <strong>{entry.score}</strong>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
