"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GAMES, type GameSlug } from "@/lib/data/games";
import { LEADERBOARD_EVENT, readAllBoards, type LeaderboardEntry } from "@/lib/data/leaderboard";
import { weekBounds } from "@/lib/week";
import { LeaderboardRow } from "./LeaderboardRow";
import { LeaderboardModal } from "./LeaderboardModal";
import type { ShareTarget } from "./ShareActions";

type Board = Array<{ game: GameSlug; entries: LeaderboardEntry[] }>;

export function LeaderboardBoard() {
  const [boards, setBoards] = useState<Board>([]);
  const [modal, setModal] = useState<ShareTarget | null>(null);
  const weekKey = useMemo(() => weekBounds().weekKey, []);

  useEffect(() => {
    const update = () => setBoards(readAllBoards());
    update();
    window.addEventListener(LEADERBOARD_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(LEADERBOARD_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <div className="leaderboard">
      {boards.length === 0 ? (
        <p className="fun-board__empty">
          Belum ada skor. Main satu ronde, lalu tulis namamu di akhir permainan
          untuk masuk papan skor.
        </p>
      ) : (
        <div className="leaderboard__grid">
          {boards.map((board) => (
            <section className="leaderboard__game" key={board.game}>
              <header>
                <strong>{GAMES[board.game].shortTitle}</strong>
                <Link href={`/leaderboards/${board.game}`}>Lihat ↗</Link>
              </header>
              <ol className="lb-list">
                {board.entries.slice(0, 5).map((entry, index) => (
                  <li key={entry.id}>
                    <LeaderboardRow
                      rank={index + 1}
                      name={entry.name}
                      score={entry.score}
                      gameSlug={board.game}
                      weekKey={weekKey}
                      onOpen={setModal}
                    />
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}

      {modal ? <LeaderboardModal target={modal} onClose={() => setModal(null)} /> : null}
    </div>
  );
}
