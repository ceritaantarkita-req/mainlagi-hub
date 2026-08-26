import type { Metadata } from "next";
import { PlayerProfiles } from "@/components/account/PlayerProfiles";

export const metadata: Metadata = { title: "Pemain | Mainlagi Hub" };

export default function PlayersPage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section account-page">
        <header className="fun-section__head">
          <h2>Pemain</h2>
        </header>
        <PlayerProfiles />
      </section>
    </div>
  );
}
