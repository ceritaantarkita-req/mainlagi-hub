import type { Metadata } from "next";
import { Preferences } from "@/components/account/Preferences";

export const metadata: Metadata = { title: "Preferensi | Mainlagi Hub" };

export default function PreferencesPage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section account-page">
        <header className="fun-section__head">
          <h2>Preferensi</h2>
        </header>
        <Preferences />
      </section>
    </div>
  );
}
