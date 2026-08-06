/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GAME_LIST, type GameCategory } from "@/lib/data/games";
import { AFFILIATE_ITEMS, type AffiliateItem } from "@/lib/data/affiliate";
import { GameIcon } from "./GameIcon";
import { SiteHeader } from "./SiteHeader";
import { ShareButton } from "./ShareButton";
import { readLocalProgress } from "@/lib/auth/progress";

const FILTERS: Array<"Semua" | GameCategory> = ["Semua", "Belajar dengan tangan", "Aktivitas tubuh", "Alat kelas"];

export function HomePage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Semua");
  const [query, setQuery] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [affiliateItems, setAffiliateItems] = useState<AffiliateItem[]>(AFFILIATE_ITEMS);
  useEffect(() => {
    const update = () =>
      setTotalScore(
        Object.values(readLocalProgress().bestScores).reduce(
          (sum, value) => sum + (typeof value === "number" ? value : 0),
          0
        )
      );
    update();
    window.addEventListener("mainlagi-progress", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("mainlagi-progress", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/affiliate", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("affiliate"))))
      .then((items: unknown) => {
        if (Array.isArray(items) && items.length) setAffiliateItems(items as AffiliateItem[]);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  const games = useMemo(() => GAME_LIST.filter((game) => {
    const matchesCategory = filter === "Semua" || game.category === filter;
    const haystack = `${game.title} ${game.description} ${game.capabilities.join(" ")}`.toLowerCase();
    return matchesCategory && haystack.includes(query.trim().toLowerCase());
  }), [filter, query]);

  return (
    <main>
      <div className="page-shell"><SiteHeader /></div>
      <section className="hero-band">
        <div className="page-shell hero-layout">
          <div className="hero-copy">
            <p className="hero-label">SATU KAMERA · SEMBILAN PENGALAMAN</p>
            <h1>Gerak badan.<br /><span>Gerak pikiran.</span></h1>
            <p className="hero-lede">Mainlagi TV menyatukan game angka, Iqro, simulasi warung, papan presentasi, dan aktivitas full-body dalam satu Motion Learning Hub.</p>
            <div className="hero-actions">
              <Link className="button button--primary" href="#games">Pilih permainan</Link>
              <Link className="button button--ghost" href="/play/math-motion-battle">Coba Math Battle</Link>
              <ShareButton title="Mainlagi TV Motion Learning Hub" text="Coba 9 aktivitas belajar dan gerak di Mainlagi TV." />
            </div>
            <div className="trust-row"><span>Privasi lokal</span><span>Mode 1–2 pemain</span><span>Skor lokal {totalScore}</span><span>Mouse/keyboard fallback</span></div>
          </div>
          <div className="hero-stage" aria-label="Ilustrasi kemampuan Motion Learning Hub">
            <div className="stage-screen">
              <div className="stage-top"><span>LIVE MOTION</span><b>2 pemain terdeteksi</b></div>
              <div className="stage-people">
                <div className="stage-person stage-person--a"><i /><span>A</span></div>
                <div className="stage-prompt"><small>SOAL</small><strong>7 + 5</strong><em>gambar jawaban</em></div>
                <div className="stage-person stage-person--b"><i /><span>B</span></div>
              </div>
              <div className="stage-trail"><svg viewBox="0 0 400 80"><path d="M15 55 C75 5 110 70 155 32 S250 15 285 52 S355 65 390 20" /></svg></div>
            </div>
            <div className="floating-note floating-note--one"><b>Hand skeleton</b><span>Pinch untuk menulis</span></div>
            <div className="floating-note floating-note--two"><b>Body skeleton</b><span>Lompat · jongkok · geser</span></div>
          </div>
        </div>
      </section>

      <section id="games" className="page-shell games-section">
        <div className="section-intro"><div><span>SEMUA AKTIVITAS</span><h2>Sembilan module. Satu sistem.</h2><p>Tidak ada launcher eksternal. Semua dibuka langsung di dalam Motion Learning Hub.</p></div><strong>{games.length} ditemukan</strong></div>
        <div className="game-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter kategori">{FILTERS.map((item) => <button key={item} type="button" className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
          <label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari game atau kemampuan" /></label>
        </div>
        <div className="game-list">{games.map((game, index) => (
          <article className="game-row" key={game.slug} style={{ "--accent": game.accent, "--soft": game.accentSoft } as React.CSSProperties}>
            <div className="game-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="game-visual"><GameIcon name={game.icon} size={72} /><span>{game.category}</span></div>
            <div className="game-copy"><div className="game-title-line"><h3>{game.title}</h3><span>{game.status === "beta" ? "V2 Beta" : "Siap"}</span></div><p>{game.description}</p><ul>{game.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></div>
            <div className="game-meta"><span>{game.age}</span><span>{game.playerOptions.join("/")} pemain</span><span>{game.visionMode}</span></div>
            <Link className="game-open" href={`/play/${game.slug}`} aria-label={`Buka ${game.title}`}>Buka <span>→</span></Link>
          </article>
        ))}</div>
      </section>

      <section id="how" className="how-band"><div className="page-shell how-grid"><div><span>PRE-FLIGHT SEBELUM MAIN</span><h2>Kamera tidak langsung melempar user ke game.</h2><p>Sistem memeriksa kamera, model, skeleton, jumlah pemain, dan gesture terlebih dahulu. Countdown baru aktif setelah user siap.</p></div><ol><li><b>01</b><span>Pilih 1 atau 2 pemain</span></li><li><b>02</b><span>Deteksi tubuh dan tangan</span></li><li><b>03</b><span>Kalibrasi pinch dan posisi</span></li><li><b>04</b><span>Countdown 3–2–1</span></li></ol></div></section>

      <section id="affiliate" className="page-shell affiliate-section">
        <div className="section-intro"><div><span>PILIHAN MAINLAGI</span><h2>Peralatan pendukung</h2><p>Tautan afiliasi ditandai jelas dan dapat diganti dari panel admin.</p></div></div>
        <div className="affiliate-grid">{affiliateItems.map((item) => <a key={item.slug} className="affiliate-card" href={`/go/${item.slug}`}><img src={item.image} alt="" /><div><small>{item.platform} · {item.category}</small><h3>{item.title}</h3><p>Tautan afiliasi</p><strong>Lihat produk ↗</strong></div></a>)}</div>
      </section>

      <footer className="site-footer"><div className="page-shell footer-grid"><div><strong>Mainlagi TV</strong><p>Motion Learning Hub untuk belajar, bergerak, dan bermain bersama.</p></div><div><a href="mailto:ceritagindra@gmail.com">ceritagindra@gmail.com</a><a href="https://www.youtube.com/@mainlagi_id">YouTube @mainlagi_id</a><a href="https://www.tiktok.com/@di.toko">TikTok @di.toko</a></div><span>Video kamera diproses di browser dan tidak disimpan oleh aplikasi.</span></div></footer>
    </main>
  );
}
