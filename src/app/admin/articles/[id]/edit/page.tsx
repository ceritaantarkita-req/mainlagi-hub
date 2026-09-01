import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { requireOwner } from "@/lib/auth/requireOwner";
import { getArticle } from "@/lib/admin/articles";
import { ArticleForm } from "@/components/admin/articles/ArticleForm";

export const metadata: Metadata = { title: "Edit artikel" };

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const gate = await requireOwner();
  if (!gate.ok) return <AdminGate title="Edit artikel" reason={gate.reason} />;

  const { id } = await params;
  let article;
  let loadError = "";
  try {
    article = await getArticle(id);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Gagal memuat artikel.";
  }

  if (loadError) {
    return (
      <main className="admin-page-main">
        <p className="admin-banner admin-banner--warn">{loadError}</p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="admin-page-main">
        <p className="admin-banner admin-banner--warn">Artikel tidak ditemukan.</p>
      </main>
    );
  }

  return (
    <main className="admin-page-main">
      <div className="admin-page-head">
        <div>
          <h1>Edit artikel</h1>
          <p>{article.title}</p>
        </div>
      </div>
      <ArticleForm article={article} />
    </main>
  );
}
