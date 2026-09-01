import type { Metadata } from "next";
import Link from "next/link";
import { AdminGate } from "@/components/admin/AdminGate";
import { requireOwner } from "@/lib/auth/requireOwner";
import { listArticles } from "@/lib/admin/articles";
import { DeleteArticleButton } from "@/components/admin/articles/DeleteArticleButton";

export const metadata: Metadata = { title: "Admin Artikel" };

export const dynamic = "force-dynamic";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

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

      {articles.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Terbit</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => {
                const isScheduled =
                  article.status === "published" &&
                  !!article.published_at &&
                  new Date(article.published_at).getTime() > now;
                const badgeClass = isScheduled
                  ? "admin-badge--pending"
                  : article.status === "published"
                    ? "admin-badge--ok"
                    : "admin-badge--muted";
                const badgeLabel = isScheduled ? "Terjadwal" : article.status === "published" ? "Published" : "Draft";

                return (
                  <tr key={article.id}>
                    <td>
                      <b>{article.title}</b>
                      <br />
                      <small>/{article.slug}</small>
                    </td>
                    <td>{article.category || <span className="admin-note">-</span>}</td>
                    <td>
                      <span className={`admin-badge ${badgeClass}`}>{badgeLabel}</span>
                    </td>
                    <td>
                      {article.published_at ? (
                        isScheduled ? (
                          formatDateTime(article.published_at)
                        ) : (
                          formatDate(article.published_at)
                        )
                      ) : (
                        <span className="admin-note">-</span>
                      )}
                    </td>
                    <td className="admin-table__actions">
                      <Link className="admin-table__action" href={`/admin/articles/${article.id}/edit`}>
                        Edit
                      </Link>
                      <DeleteArticleButton id={article.id} title={article.title} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
