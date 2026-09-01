import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { requireOwner } from "@/lib/auth/requireOwner";
import { ArticleForm } from "@/components/admin/articles/ArticleForm";

export const metadata: Metadata = { title: "Artikel baru" };

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const gate = await requireOwner();
  if (!gate.ok) return <AdminGate title="Artikel baru" reason={gate.reason} />;

  return (
    <main className="admin-page-main">
      <div className="admin-page-head">
        <div>
          <h1>Artikel baru</h1>
          <p>Tulis dan terbitkan artikel baru.</p>
        </div>
      </div>
      <ArticleForm />
    </main>
  );
}
