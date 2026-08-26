"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { type GameSlug } from "@/lib/data/games";
import { LEADERBOARD_EVENT, readBoard, type LeaderboardEntry } from "@/lib/data/leaderboard";
import { weekBounds } from "@/lib/week";
import { LeaderboardRow } from "./LeaderboardRow";
import { LeaderboardModal } from "./LeaderboardModal";
import type { ShareTarget } from "./ShareActions";

export function LeaderboardGame({ slug }: { slug: GameSlug }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [modal, setModal] = useState<ShareTarget | null>(null);
  const weekKey = useMemo(() => weekBounds().weekKey, []);

  useEffect(() => {
    const update = () => setEntries(readBoard(slug));
    update();
    window.addEventListener(LEADERBOARD_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(LEADERBOARD_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, [slug]);

  return (
    <div className="leaderboard">
      <Link className="leaderboard__back" href="/leaderboards">
        ← Semua permainan
      </Link>
      {entries.length === 0 ? (
        <p className="fun-board__empty">Belum ada skor untuk game ini.</p>
      ) : (
        <ol className="lb-list lb-list--full">
          {entries.slice(0, 20).map((entry, index) => (
            <li key={entry.id}>
              <LeaderboardRow
                rank={index + 1}
                name={entry.name}
                score={entry.score}
                gameSlug={slug}
                weekKey={weekKey}
                onOpen={setModal}
              />
            </li>
          ))}
        </ol>
      )}

      {modal ? <LeaderboardModal target={modal} onClose={() => setModal(null)} /> : null}
    </div>
  );
}
