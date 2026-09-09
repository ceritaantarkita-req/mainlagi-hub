/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { GAME_LIST, GAMES, type GameSlug } from "@/lib/data/games";
import { GAME_THEMES } from "@/lib/data/gameThemes";
import { SUBJECTS } from "@/lib/learning/system";
import { getData } from "@/lib/data";
import type { AffiliateItem } from "@/lib/data/domain";
import { Icon, type IconName } from "@/components/Icon";
import { GameIcon } from "@/components/GameIcon";
import { GameArtwork } from "@/components/GameArtwork";
import { CharacterGroup } from "@/components/learning/LearningCommon";
import { readLocalProgress } from "@/lib/auth/progress";
import { LEADERBOARD_EVENT, readAllBoards, type LeaderboardEntry } from "@/lib/data/leaderboard";

const CARD_THEMES = GAME_THEMES;

const STEPS: { icon: IconName; text: string }[] = [
  { icon: "account", text: "Pilih profil anak" },
  { icon: "discover", text: "Pilih area belajar" },
  { icon: "games", text: "Sentuh, dengar, trace, atau main" },
  { icon: "star", text: "Kumpulkan bintang" }
];

function Blobs() {
  return (
    <svg className="fun-blobs" viewBox="0 0 800 400" aria-hidden focusable="false">
      <defs>
        <linearGradient id="blobA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbbf24" /><stop offset="1" stopColor="#f472b6" /></linearGradient>
        <linearGradient id="blobB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#60a5fa" /><stop offset="1" stopColor="#34d399" /></linearGradient>
      </defs>
      <circle cx="120" cy="90" r="130" fill="url(#blobA)" opacity=".2" />
      <circle cx="690" cy="300" r="160" fill="url(#blobB)" opacity=".2" />
      <circle cx="560" cy="60" r="70" fill="#a78bfa" opacity=".16" />
    </svg>
  );
}

function LearningHeroArt() {
  return (
    <div style={{ borderRadius: 32, background: "rgba(255,255,255,.9)", padding: "18px 14px", boxShadow: "0 16px 46px rgba(45,72,91,.10)", border: "1px solid rgba(255,255,255,.9)" }}>
      <CharacterGroup />
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
        {[
          "👆 Sentuh",
          "🔊 Audio",
          "✍️ Trace",
          "🎨 Warna",
          "📷 Gerak opsional"
        ].map((label) => <span key={label} style={{ padding: "6px 9px", borderRadius: 999, background: "#f2f7fa", color: "#536f82", fontSize: 11, fontWeight: 800 }}>{label}</span>)}
      </div>
    </div>
  );
}

export function HomePage() {
  const [totalScore, setTotalScore] = useState(0);
  const [boards, setBoards] = useState<Array<{ game: GameSlug; entries: LeaderboardEntry[] }>>([]);
  const [recommended, setRecommended] = useState<AffiliateItem[]>([]);

  useEffect(() => {
    const update = () => {
      setTotalScore(Object.values(readLocalProgress().bestScores).reduce((sum, value) => sum + (typeof value === "number" ? value : 0), 0));
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

  useEffect(() => {
    let cancelled = false;
    void getData().products.listActive().then((items) => { if (!cancelled) setRecommended(items.slice(0, 4)); }).catch(() => { if (!cancelled) setRecommended([]); });
    return () => { cancelled = true; };
  }, []);

  const champions = useMemo(() => boards.map((board) => ({ game: board.game, entry: board.entries[0]! })).sort((left, right) => right.entry.score - left.entry.score).slice(0, 5), [boards]);

  return (
    <main className="fun-home">
      <section className="fun-hero">
        <Blobs />
        <div className="page-shell fun-hero__inner">
          <div className="fun-hero__copy">
            <p style={{ margin: "0 0 8px", fontWeight: 900, color: "#178272", letterSpacing: ".04em" }}>MAINLAGI · BELAJAR & MAIN</p>
            <h1>Belajar seru,<br /><span className="fun-gradient-text">sesuai caranya anak.</span></h1>
            <p>Bahasa Indonesia, English, Matematika, Iqro, dan Mewarnai — dibuat nyaman untuk HP. Sentuh jadi default; game kamera tetap ada sebagai pilihan.</p>
            <div className="fun-hero__actions">
              <Link className="fun-cta" href="/child/select">Mulai belajar</Link>
              <Link className="fun-cta fun-cta--ghost" href="#games">Main Gerak</Link>
            </div>
            <p className="fun-privacy"><span className="privacy-mark" aria-hidden>✓</span> Kamera hanya dipakai saat memilih aktivitas yang memang membutuhkannya.</p>
          </div>
          <div className="fun-hero__art"><LearningHeroArt /></div>
        </div>
      </section>

      <section className="page-shell fun-section">
        <header className="fun-section__head"><h2>Pilih area belajar</h2><Link className="fun-pill fun-pill--link" href="/child/select">Masuk mode anak</Link></header>
        <div className="fun-grid">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              className="fun-card"
              href="/child/select"
              style={{ "--from": subject.soft, "--to": subject.accent } as CSSProperties}
            >
              <span className="fun-card__art" aria-hidden style={{ fontSize: 72, display: "grid", placeItems: "center" }}>{subject.emoji}</span>
              <span className="fun-card__body"><span className="fun-card__title"><strong>{subject.title}</strong></span><span className="fun-card__meta">{subject.description}</span><span className="fun-card__play">Mulai <b aria-hidden><Icon name="arrow" size={19} /></b></span></span>
            </Link>
          ))}
        </div>
      </section>

      <section id="games" className="page-shell fun-section">
        <header className="fun-section__head"><div><h2>Main Gerak</h2><p style={{ margin: "5px 0 0", color: "#6b7f90" }}>10 game existing tetap dipertahankan. Di HP, gunakan saat perangkat bisa ditaruh stabil.</p></div><span className="fun-pill"><Icon name="star" size={16} /> {totalScore}</span></header>
        <div className="fun-grid">
          {GAME_LIST.map((game) => {
            const theme = CARD_THEMES[game.slug];
            return (
              <Link className="fun-card" key={game.slug} href={`/play/${game.slug}`} style={{ "--from": theme.from, "--to": theme.to } as CSSProperties}>
                <span className="fun-card__art" aria-hidden><GameArtwork slug={game.slug} /></span>
                <span className="fun-card__body"><span className="fun-card__title"><span className="fun-card__glyph" aria-hidden><GameIcon name={game.icon} size={30} /></span><strong>{game.shortTitle}</strong></span><span className="fun-card__meta">{game.age} · {game.visionMode === "pose" ? "Gerak badan" : "Gerak tangan"}</span><span className="fun-card__play">Mainkan <b aria-hidden><Icon name="arrow" size={19} /></b></span></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-shell fun-section">
        <header className="fun-section__head"><h2>Cara mulai</h2></header>
        <div className="howto">{STEPS.map((step, index) => <div className="howto__step" key={step.text}><span className="howto__icon" aria-hidden><Icon name={step.icon} size={24} /><span className="howto__num">{index + 1}</span></span><span className="howto__label">{step.text}</span></div>)}</div>
      </section>

      <section id="papan-skor" className="fun-board-band">
        <div className="page-shell">
          <header className="fun-section__head"><h2><span className="score-heading-mark" aria-hidden><Icon name="star" size={18} /></span> Papan skor Main Gerak</h2><Link className="fun-pill fun-pill--link" href="/leaderboards">Lihat semua</Link></header>
          {champions.length ? <ol className="fun-board">{champions.map((item, index) => <li key={item.game}><b aria-hidden><span className={`rank-mark rank-mark--${index + 1}`}>{index + 1}</span></b><span><strong>{item.entry.name}</strong><small>{GAMES[item.game].shortTitle}</small></span><em>{item.entry.score}</em></li>)}</ol> : <p className="fun-board__empty">Belum ada skor minggu ini. Papan skor ini untuk game, bukan penilaian kemampuan belajar anak.</p>}
        </div>
      </section>

      {recommended.length > 0 ? (
        <section id="affiliate" className="page-shell fun-section">
          <header className="fun-section__head"><h2>Rekomendasi Hari ini</h2></header>
          <div className="fun-grid">{recommended.map((item) => <a key={item.slug} href={`/go/${item.slug}`} className="product-tile"><span className="product-tile__media">{item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" /> : null}</span><span className="product-tile__overlay" aria-hidden><strong>{item.title}</strong><small>Lihat produk ↗</small></span></a>)}</div>
        </section>
      ) : null}
    </main>
  );
}
