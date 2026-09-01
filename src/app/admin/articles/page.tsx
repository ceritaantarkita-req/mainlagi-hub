import type { Metadata } from "next";
import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { requireOwner } from "@/lib/auth/requireOwner";
import { listArticles } from "@/lib/admin/articles";
import { ArticlesTable } from "@/components/admin/articles/ArticlesTable";

export const metadata: Metadata = { title: "Admin Artikel" };

export const dynamic = "force-dynamic";

export default async function ArticlesAdminPage() {
  const gate = await requireOwner();
  if (!gate.ok) return <AdminGate title="Admin Artikel" reason={gate.reason} />;

  let articles: Awaited<ReturnType<typeof listArticles>> = [];
  let loadError = "";
  try {
    articles = await listArticles();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Gagal memuat artikel.";
  }

  // Server component rendered per-request (force-dynamic): reading the clock here
  // is intentional, not a stale/impure client render.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  return (
    <main className="admin-page-main">
      <div className="admin-page-head">
        <div>
          <h1>Artikel</h1>
          <p>Kelola artikel yang tampil di halaman Jelajah. Artikel terjadwal otomatis tayang begitu waktunya tiba.</p>
        </div>
        <Link href="/admin/articles/new" className="button button--primary">
          Artikel baru
        </Link>
      </div>

      {loadError && <p className="admin-banner admin-banner--warn">{loadError}</p>}

      {!loadError && articles.length === 0 && (
        <div className="admin-chart-empty">
          <p>Belum ada artikel. Klik &quot;Artikel baru&quot; untuk mulai menulis.</p>
        </div>
      )}

      {articles.length > 0 && <ArticlesTable articles={articles} now={now} />}
    </main>
  );
}
