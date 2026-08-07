"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { allBoards, boardFor, type BoardSummary } from "@/engine/leaderboard";

/**
 * Boards live in localStorage, so the server-rendered snapshot starts empty.
 * Load them on the next task after mount instead of synchronously setting state
 * inside the effect body. This preserves the server/client boundary and avoids
 * React's cascading-render lint rule.
 */
export function LeaderboardView() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBoards(allBoards());
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
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
