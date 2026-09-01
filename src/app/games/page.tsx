import type { Metadata } from "next";
import { GameCatalog } from "@/components/games/GameCatalog";

export const metadata: Metadata = {
  title: "Game",
  description: "Katalog permainan gerak Mainlagi Hub - Motion Learning."
};

export default function GamesPage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section">
        <header className="fun-section__head">
          <div>
            <span className="fun-section__eyebrow">10 aktivitas gerak</span>
            <h1>Pilih permainanmu</h1>
            <p>Cari tantangan yang cocok, lalu mulai bergerak dengan satu kamera.</p>
          </div>
        </header>
        <GameCatalog />
      </section>
    </div>
  );
}
