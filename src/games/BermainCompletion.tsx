"use client";

import { useState } from "react";
import { CanonicalCompletion } from "@/components/CanonicalCompletion";
import { CanonicalShareDialog } from "@/components/CanonicalShare";
import { LeaderboardCapture } from "@/components/LeaderboardCapture";
import { CharacterLayer } from "@/components/learning/CharacterLayer";
import { resolveCharacterPresentation } from "@/lib/learning/characterPresentation";
import { GAMES, GAME_SLUGS, type GameSlug } from "@/lib/data/games";
import type { PlayerId } from "@/lib/engine/types";
import styles from "./BermainCompletion.module.css";

const PRAISE = ["Great job!", "Excellent!", "Hebat!", "Keren!"] as const;

export function BermainCompletion({
  title,
  score,
  playerCount,
  onReplay,
  onCalibration,
  game,
  durationSeconds
}: {
  title: string;
  score: Record<PlayerId, number>;
  playerCount: 1 | 2;
  onReplay(): void;
  onCalibration(): void;
  game: GameSlug;
  durationSeconds?: number;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const definition = GAMES[game];
  const currentIndex = GAME_SLUGS.indexOf(game);
  const nextSlug = GAME_SLUGS[(currentIndex + 1) % GAME_SLUGS.length];
  const nextGame = GAMES[nextSlug];
  const si07Game = currentIndex >= 0 && currentIndex <= 2;
  const si08Game = currentIndex >= 3 && currentIndex <= 5;
  const totalScore = score.A + (playerCount === 2 ? score.B : 0);
  const praise = PRAISE[Math.abs(totalScore) % PRAISE.length];
  const winner =
    playerCount === 1
      ? null
      : score.A === score.B
        ? "Seri"
        : score.A > score.B
          ? "Pemain A menang"
          : "Pemain B menang";
  const characterPresentation = resolveCharacterPresentation({
    context: "play_completion",
    requestedCharacters: ["gavi", "paca"],
    allowIdentityFallback: false
  });

  return (
    <>
      <CanonicalCompletion
        context="bermain"
        surface="overlay"
        praise={praise}
        eyebrow={definition.title}
        message={title}
        characterSlot={
          <div
            className={styles.characters}
            data-mainlagi-play-character-state={characterPresentation.requestedState}
          >
            <CharacterLayer
              characters={characterPresentation.characters}
              variant="ensemble"
            />
          </div>
        }
        supportingContent={
          <div className={styles.results} data-bermain-completion-score>
            <p className={styles.resultLead}>
              {winner ?? "Ronde selesai. Skormu sudah tercatat untuk sesi ini."}
            </p>
            <div
              className={[styles.scores, playerCount === 1 ? styles.single : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <div>
                <small>PEMAIN A</small>
                <strong>{score.A}</strong>
              </div>
              {playerCount === 2 ? (
                <div>
                  <small>PEMAIN B</small>
                  <strong>{score.B}</strong>
                </div>
              ) : null}
            </div>
            <LeaderboardCapture
              game={game}
              score={playerCount === 2 ? Math.max(score.A, score.B) : score.A}
              durationSeconds={durationSeconds}
            />
            <button
              type="button"
              className={styles.calibration}
              data-bermain-completion-action="calibrate"
              onClick={onCalibration}
            >
              Kalibrasi ulang
            </button>
          </div>
        }
        back={{
          href: `/games/${game}`,
          ariaLabel: `Back ke detail ${definition.title}`
        }}
        again={{
          onClick: onReplay,
          ariaLabel: `Again ${definition.title}`
        }}
        next={{
          href: `/play/${nextSlug}`,
          ariaLabel: `Next ke ${nextGame.title}`
        }}
        onShare={() => setShareOpen(true)}
        data-si07-bermain={si07Game ? "games-1-3" : undefined}
        data-si08-bermain={si08Game ? "games-4-6" : undefined}
      />
      <CanonicalShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        input={{
          context: "bermain",
          gameSlug: game,
          gameTitle: definition.title
        }}
      />
    </>
  );
}
