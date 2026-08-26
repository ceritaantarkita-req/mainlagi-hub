import type { Metadata } from "next";
import Link from "next/link";
import { getData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Artikel | Mainlagi Hub",
  description: "Artikel belajar dan permainan anak dari Mainlagi Hub."
};

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getData().articles.listPublished("id");

  return (
    <div className="fun-home">
      <section className="page-shell fun-section">
        <header className="fun-section__head">
          <h2>Artikel</h2>
        </header>
        <div className="article-list">
          {articles.length === 0 ? (
            <p className="catalog-empty">Belum ada artikel.</p>
          ) : (
            articles.map((article) => (
              <Link key={article.slug} href={`/discover/articles/${article.slug}`} className="article-card">
                <strong>{article.title}</strong>
                <p>{article.excerpt}</p>
                <small>{article.category} · {article.updatedAt.slice(0, 10)}</small>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
