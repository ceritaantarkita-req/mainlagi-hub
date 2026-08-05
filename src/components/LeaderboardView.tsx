"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { allBoards, boardFor, type BoardSummary } from "@/engine/leaderboard";

/**
 * Boards are read in an effect, never during render.
 *
 * They come from localStorage, which does not exist while Next.js prerenders
 * this page on the server. Reading during render would either crash the build
 * or - worse - produce server HTML that disagrees with the client and trigger a
 * hydration mismatch. Starting empty and filling in after mount is the only
 * arrangement that is correct in both environments.
 */
export function LeaderboardView() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBoards(allBoards());
    setLoaded(true);
  }, []);

  const clear = (gameId: BoardSummary["gameId"]) => {
    boardFor(gameId).clear();
    setBoards(allBoards());
  };

  const totalScores = boards.reduce((sum, board) => sum + board.entries.length, 0);

  return (
    <main className="board-page">
      <Link href="/" className="board-back">← Kembali ke beranda</Link>
      <header className="board-header">
        <h1>Papan Skor</h1>
        <p>
          Skor disimpan di perangkat ini saja — tidak dikirim ke mana pun.
          Membuka di komputer lain akan menampilkan papan yang berbeda.
        </p>
      </header>

      {!loaded ? (
        <p className="board-empty">Memuat…</p>
      ) : totalScores === 0 ? (
        <p className="board-empty">
          Belum ada skor. Mainkan salah satu permainan, lalu skormu muncul di sini.
        </p>
      ) : null}

      <div className="board-grid">
        {boards.map((board) => (
          <section key={board.gameId} className={`board-card board-card--${board.color}`}>
            <header>
              <h2>{board.title}</h2>
              {board.entries.length > 0 ? (
                <button type="button" onClick={() => clear(board.gameId)} aria-label={`Hapus skor ${board.title}`}>
                  Hapus
                </button>
              ) : null}
            </header>
            {board.entries.length === 0 ? (
              <p className="board-card-empty">Belum ada skor.</p>
            ) : (
              <ol>
                {board.entries.map((entry, index) => (
                  <li key={`${entry.at}-${entry.name}`}>
                    <b>{index + 1}</b>
                    <span>{entry.name}</span>
                    <small>
                      {entry.detail?.benar !== undefined && entry.detail?.total !== undefined
                        ? `${entry.detail.benar}/${entry.detail.total}`
                        : new Date(entry.at).toLocaleDateString("id-ID")}
                    </small>
                    <strong>{entry.score}</strong>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
