import Link from "next/link";
import type { ReactNode } from "react";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

/**
 * Shared renderer for legal/public policy pages (privacy, terms, etc.).
 * Server-compatible (no client hooks); content is passed in as data.
 */
export function LegalPage({
  title,
  updated,
  sections
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="fun-home">
      <section className="page-shell legal-page">
        <header className="legal-page__head">
          <h1>{title}</h1>
          <p>Terakhir diperbarui: {updated}</p>
        </header>

        <div className="legal-page__body">
          {sections.map((section) => (
            <section key={section.heading} className="legal-page__section">
              <h2>{section.heading}</h2>
              <div>{section.body}</div>
            </section>
          ))}
        </div>

        <footer className="legal-page__back">
          <Link href="/">← Kembali ke beranda</Link>
        </footer>
      </section>
    </div>
  );
}
