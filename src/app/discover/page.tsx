import type { Metadata } from "next";
import { DiscoverShell } from "@/components/discover/DiscoverShell";

export const metadata: Metadata = {
  title: "Discover | Mainlagi Hub",
  description: "Temukan game, artikel, dan perlengkapan Mainlagi Hub."
};

export default function DiscoverPage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section">
        <header className="fun-section__head">
          <h2>Discover</h2>
        </header>
        <DiscoverShell />
      </section>
    </div>
  );
}
