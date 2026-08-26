"use client";

import { ShareActions, type ShareTarget } from "./ShareActions";

/** Popup shown when a leaderboard row is tapped. */
export function LeaderboardModal({
  target,
  onClose
}: {
  target: ShareTarget;
  onClose: () => void;
}) {
  return (
    <div className="lb-modal-backdrop" onClick={onClose} role="presentation">
      <div className="lb-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="lb-modal__close" type="button" onClick={onClose} aria-label="Tutup">
          ×
        </button>

        <span className="lb-modal__avatar" aria-hidden>
          {target.name.slice(0, 1).toUpperCase()}
        </span>
        <span className="lb-modal__score">{target.score}</span>
        <span className="lb-modal__rank">Peringkat #{target.rank}</span>
        <span className="lb-modal__name">{target.name}</span>

        <ShareActions target={target} onDone={onClose} />

        <div className="lb-modal__footer">Motion Learning Hub</div>
      </div>
    </div>
  );
}
