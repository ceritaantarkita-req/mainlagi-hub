"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_PROGRESS, sanitizeProgress } from "@/engine/progress";
import { GAME_REGISTRY } from "@/engine/registry";
import type { LocalProgress } from "@/engine/types";
import { CompanionApps } from "@/components/CompanionApps";

const STORAGE_KEY = "motion-learning-hub-progress-v1";

function readLocalProgress(): LocalProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeProgress(JSON.parse(raw)) : { ...DEFAULT_PROGRESS, bestScores: {} };
  } catch {
    return { ...DEFAULT_PROGRESS, bestScores: {} };
  }
}

export function HubHome() {
  const [progress, setProgress] = useState<LocalProgress>(() => ({ ...DEFAULT_PROGRESS, bestScores: {} }));

  useEffect(() => {
    const updateProgress = () => setProgress(readLocalProgress());
    const timer = window.setTimeout(updateProgress, 0);
    window.addEventListener("storage", updateProgress);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", updateProgress);
    };
  }, []);

  const totalBestScore = Object.values(progress.bestScores).reduce(
    (sum, value) => sum + (typeof value === "number" && Number.isFinite(value) ? value : 0),
    0
  );

  return (
    <main className="hub-page">
      <header className="hub-header">
        <Link href="/" className="brand" aria-label="Motion Learning Hub">
          <span className="brand-mark">🤸</span>
          <span><b>MOTION</b><small>LEARNING HUB</small></span>
        </Link>
        <nav aria-label="Navigasi utama">
          <Link className="nav-pill is-active" href="/">⌂ Beranda</Link>
          <Link className="nav-pill" href="/leaderboard">🏆 Papan skor</Link>
          <Link className="nav-pill" href="/how-to-play">? Cara bermain</Link>
          <span className="score-pill" aria-label={`Total skor terbaik ${totalBestScore}`}>⭐ {totalBestScore}</span>
        </nav>
      </header>

      <section className="hub-hero">
        <div className="hub-hero__copy">
          <h1>Belajar Seru,<br /><span>Gerak & Pintar!</span></h1>
          <p>Belajar angka, bentuk, pola, dan matematika dengan kamera. Tidak perlu controller dan tidak perlu login.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#games">Mulai petualangan</a>
            <Link className="secondary-button" href="/privacy">Privasi kamera</Link>
          </div>
          <div className="privacy-note">🔒 Video diproses langsung di perangkat dan tidak disimpan.</div>
        </div>
        <div className="hub-hero__visual">
          <Image src="/concepts/hub-home.png" alt="Contoh tampilan Motion Learning Hub" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
      </section>

      <section id="games" className="games-section">
        <div className="section-heading">
          <div><h2>Pilih petualanganmu</h2><p>Empat game pertama memakai motion engine yang sama.</p></div>
          <span>{progress.completedRounds} ronde selesai</span>
        </div>
        <div className="game-grid">
          {Object.values(GAME_REGISTRY).map((game) => (
            <article key={game.id} className={`game-card game-card--${game.color}`}>
              <div className="game-card__image">
                <Image src={game.image} alt={`Preview ${game.title}`} fill sizes="(max-width: 760px) 100vw, 25vw" />
              </div>
              <div className="game-card__body">
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <div className="game-meta"><span>{game.age}</span><span>{game.players}</span></div>
                <Link className="play-button" href={`/games/${game.id}`}>▶ Mainkan</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CompanionApps />

      <section className="family-strip">
        <div><strong>👨‍👩‍👧 Cocok untuk anak dan orang tua</strong><span>Gunakan laptop di rumah, kelas, tempat les, atau booth edukasi.</span></div>
        <Link href="/how-to-play">Lihat panduan lengkap →</Link>
      </section>
    </main>
  );
}
