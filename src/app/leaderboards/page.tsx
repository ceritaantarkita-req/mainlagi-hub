import type { Metadata } from "next";
import { WeekBanner } from "@/components/leaderboard/WeekBanner";
import { LeaderboardBoard } from "@/components/leaderboard/LeaderboardBoard";

export const metadata: Metadata = {
  title: "Papan Skor | Mainlagi Hub",
  description: "Papan skor semua permainan Mainlagi Hub Motion Learning."
};

export default function LeaderboardsPage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section leaderboard-page">
        <header className="fun-section__head">
          <h2>Papan skor</h2>
        </header>
        <WeekBanner />
        <LeaderboardBoard />
      </section>
    </div>
  );
}
