/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GAME_LIST, GAMES, type GameSlug } from "@/lib/data/games";
import { GAME_THEMES } from "@/lib/data/gameThemes";
import { AFFILIATE_ITEMS } from "@/lib/data/affiliate";
import { Icon, type IconName } from "@/components/Icon";
import { GameIcon } from "@/components/GameIcon";
import { GameArtwork } from "@/components/GameArtwork";
import { readLocalProgress } from "@/lib/auth/progress";
import {
  LEADERBOARD_EVENT,
  readAllBoards,
  type LeaderboardEntry
} from "@/lib/data/leaderboard";

/**
 * Home page.
 *
 * Rewritten for the audience that actually uses it. The previous version was
 * a software landing page - a grey-blue hero, a filter bar, a search box, a
 * paragraph about privacy, an abstract SVG squiggle that rendered as a black
 * blob - aimed at an adult evaluating a product. But the person who opens this
 * screen is usually a five-year-old who wants to press the biggest, most
 * colourful thing available and start moving.
 *
 * So: fewer words, far more colour, one obvious action per card, and the
 * games themselves as the first thing on the page rather than the third.
 */

/** Per-game gradients. Colour is the wayfinding here, not the text. */
const CARD_THEMES = GAME_THEMES;

const STEPS: { icon: IconName; text: string }[] = [
  { icon: "camera", text: "Nyalakan kamera" },
  { icon: "account", text: "Berdiri di depan" },
  { icon: "games", text: "Gerakkan tubuh" },
  { icon: "star", text: "Kumpulkan skor" }
];
/** A soft blob background, drawn rather than imported. */
function Blobs() {
  return (
    <svg className="fun-blobs" viewBox="0 0 800 400" aria-hidden focusable="false">
      <defs>
        <linearGradient id="blobA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id="blobB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="90" r="130" fill="url(#blobA)" opacity=".28" />
      <circle cx="690" cy="300" r="160" fill="url(#blobB)" opacity=".26" />
      <circle cx="560" cy="60" r="70" fill="#a78bfa" opacity=".22" />
    </svg>
  );
}

/**
 * The hero picture: the app mascot, front and center (27 Aug 2026 - swapped
 * out the CSS stick-figure mockup for the same mascot artwork used across
 * the game cards, see `public/artwork/_mascot-reference.webp`).
 */
function HeroScene() {
  return (
    <div className="hero-product" role="img" aria-label="Pratinjau permainan gerak Mainlagi Hub">
      <div className="hero-product__topline"><span>MAINLAGI MOTION</span><b><i /> LIVE</b></div>
      <div className="hero-product__stage">
        <img
          className="hero-product__mascot"
          src="/artwork/_mascot-reference.webp"
          alt=""
          loading="eager"
        />
        <div className="hero-product__target"><span>MOVE</span><b>10</b></div>
      </div>
      <div className="hero-product__footer"><span>ONE CAMERA</span><strong>10 GAMES</strong><span>READY TO PLAY</span></div>
    </div>
  );
}

export function HomePage() {
  const [totalScore, setTotalScore] = useState(0);
  const [boards, setBoards] = useState<
    Array<{ game: GameSlug; entries: LeaderboardEntry[] }>
  >([]);

  useEffect(() => {
    const update = () => {
      setTotalScore(
        Object.values(readLocalProgress().bestScores).reduce(
          (sum, value) => sum + (typeof value === "number" ? value : 0),
          0
        )
      );
      setBoards(readAllBoards());
    };
    update();
    window.addEventListener("mainlagi-progress", update);
    window.addEventListener(LEADERBOARD_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("mainlagi-progress", update);
      window.removeEventListener(LEADERBOARD_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const featuredAffiliate = useMemo(() => AFFILIATE_ITEMS.slice(0, 4), []);
  const [recommended, setRecommended] = useState(featuredAffiliate);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setRecommended([...AFFILIATE_ITEMS].sort(() => Math.random() - 0.5).slice(0, 4));
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  /** Best single run across every board, for the home leaderboard strip. */
  const champions = useMemo(
    () =>
      boards
        .map((board) => ({ game: board.game, entry: board.entries[0]! }))
        .sort((left, right) => right.entry.score - left.entry.score)
        .slice(0, 5),
    [boards]
  );

  return (
    <main className="fun-home">
      <section className="fun-hero">
        <Blobs />
        <div className="page-shell fun-hero__inner">
          <div className="fun-hero__copy">
            <h1>
              Main Gerak,
              <br />
              <span className="fun-gradient-text">Makin Jago!</span>
            </h1>
            <p>
              10 permainan yang dimainkan lewat gerakan tangan dan badan
              — cukup satu kamera, tanpa kontroler.
            </p>
            <div className="fun-hero__actions">
              <Link className="fun-cta" href="#games">
                Mulai petualangan
              </Link>
              <Link className="fun-cta fun-cta--ghost" href="#papan-skor">
                <span className="score-heading-mark" aria-hidden><Icon name="star" size={18} /></span> Papan skor
              </Link>
            </div>
            <p className="fun-privacy">
              <span className="privacy-mark" aria-hidden>✓</span> Video diproses di perangkat dan tidak disimpan.
            </p>
          </div>
          <div className="fun-hero__art">
            <HeroScene />
          </div>
        </div>
      </section>

      <section id="games" className="page-shell fun-section">
        <header className="fun-section__head">
          <h2>Pilih petualanganmu</h2>
          <span className="fun-pill"><Icon name="star" size={16} /> {totalScore}</span>
        </header>

        <div className="fun-grid">
          {GAME_LIST.map((game) => {
            const theme = CARD_THEMES[game.slug];
            return (
              <Link
                className="fun-card"
                key={game.slug}
                href={`/play/${game.slug}`}
                style={
                  {
                    "--from": theme.from,
                    "--to": theme.to
                  } as React.CSSProperties
                }
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
          })}
        </div>
      </section>

      <section id="papan-skor" className="fun-board-band">
        <div className="page-shell">
          <header className="fun-section__head">
            <h2><span className="score-heading-mark" aria-hidden><Icon name="star" size={18} /></span> Papan skor</h2>
            <Link className="fun-pill fun-pill--link" href="/leaderboards">
              Lihat semua
            </Link>
          </header>

          {champions.length ? (
            <ol className="fun-board">
              {champions.map((item, index) => (
                <li key={item.game}>
                  <b aria-hidden>
                    <span className={`rank-mark rank-mark--${index + 1}`}>{index + 1}</span>
                  </b>
                  <span>
                    <strong>{item.entry.name}</strong>
                    <small>{GAMES[item.game].shortTitle}</small>
                  </span>
                  <em>{item.entry.score}</em>
                </li>
              ))}
            </ol>
          ) : (
            <p className="fun-board__empty">
              Belum ada skor. Main satu ronde, lalu tulis namamu di akhir
              permainan untuk masuk papan skor.
            </p>
          )}
        </div>
      </section>

      <section className="page-shell fun-section">
        <header className="fun-section__head">
          <h2>Cara main</h2>
        </header>
        <div className="howto">
          {STEPS.map((step, index) => (
            <div className="howto__step" key={step.text}>
              <span className="howto__icon" aria-hidden>
                <Icon name={step.icon} size={24} />
                <span className="howto__num">{index + 1}</span>
              </span>
              <span className="howto__label">{step.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="affiliate" className="page-shell fun-section">
        <header className="fun-section__head">
          <h2>Rekomendasi Hari ini</h2>
        </header>
        <div className="fun-grid">
          {recommended.map((item) => (
            <a key={item.slug} href={`/go/${item.slug}`} className="product-tile">
              <span className="product-tile__media">
                <img src={item.image} alt="" loading="lazy" />
              </span>
              <span className="product-tile__overlay" aria-hidden>
                <strong>{item.title}</strong>
                <small>Lihat di Shopee ↗</small>
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
