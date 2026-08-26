import Link from "next/link";

/**
 * Shared "not authorized" screen for /admin/* pages. Pair with
 * src/lib/auth/requireOwner.ts -- render this when the gate returns
 * `{ ok: false }` instead of building a page-specific denial screen.
 */
export function AdminGate({ title, reason }: { title: string; reason: string }) {
  return (
    <div className="center-page">
      <section className="dialog-card">
        <h1>{title}</h1>
        <p>{reason}</p>
        <Link className="button button--primary" href="/login">
          Masuk
        </Link>
      </section>
    </div>
  );
}
