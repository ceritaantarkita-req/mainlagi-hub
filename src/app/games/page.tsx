import type { Metadata } from "next";
import Image from "next/image";
import { GameCatalog } from "@/components/games/GameCatalog";
import { CORE_SURFACE_THUMBNAILS } from "@/lib/learning/coreThumbnailRegistry";

export const metadata: Metadata = {
  title: "Game",
  description: "Katalog permainan gerak Mainlagi Hub - Motion Learning."
};

export default function GamesPage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section">
        <header className="core-thumbnail-header" data-core-thumbnail-surface="main-gerak-header">
          <Image
            src={CORE_SURFACE_THUMBNAILS.mainGerakHeader}
            alt="Main Gerak"
            width={1200}
            height={900}
            priority
          />
        </header>
        <GameCatalog />
      </section>
    </div>
  );
}
