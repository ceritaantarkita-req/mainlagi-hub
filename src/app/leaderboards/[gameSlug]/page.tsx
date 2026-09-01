import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeekBanner } from "@/components/leaderboard/WeekBanner";
import { LeaderboardGame } from "@/components/leaderboard/LeaderboardGame";
import { GAMES, isGameSlug } from "@/lib/data/games";

export function generateStaticParams() {
  return Object.keys(GAMES).map((slug) => ({ gameSlug: slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ gameSlug: string }>;
}): Promise<Metadata> {
  const { gameSlug } = await params;
  if (!isGameSlug(gameSlug)) return {};
  return {
    title: `Papan Skor ${GAMES[gameSlug].shortTitle}`
  };
}

export default async function LeaderboardGamePage({
  params
}: {
  params: Promise<{ gameSlug: string }>;
}) {
  const { gameSlug } = await params;
  if (!isGameSlug(gameSlug)) notFound();

  return (
    <div className="fun-home">
      <section className="page-shell fun-section leaderboard-page">
        <header className="fun-section__head">
          <h2>Papan skor · {GAMES[gameSlug].shortTitle}</h2>
        </header>
        <WeekBanner />
        <LeaderboardGame slug={gameSlug} />
      </section>
    </div>
  );
}
