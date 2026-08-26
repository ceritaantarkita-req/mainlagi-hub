import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getData().articles.bySlug(slug);
  if (!article) return {};
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt ?? undefined,
    alternates: { canonical: article.canonicalUrl ?? undefined }
  };
}

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getData().articles.bySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    author: article.author ? { "@type": "Person", name: article.author } : undefined,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    mainEntityOfPage: article.canonicalUrl ?? undefined
  };

  return (
    <div className="fun-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="page-shell article-detail">
        <Link className="leaderboard__back" href="/discover/articles">
          ← Semua artikel
        </Link>
        <header className="article-detail__head">
          <h1>{article.title}</h1>
          {article.excerpt && <p>{article.excerpt}</p>}
          <small>
            {article.author ? `${article.author} · ` : ""}
            Diperbarui {article.updatedAt.slice(0, 10)}
          </small>
        </header>
        <div className="article-detail__body">
          {article.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <footer className="article-detail__footer">
          <Link className="button button--secondary" href="/games">
            Lihat semua game
          </Link>
        </footer>
      </article>
    </div>
  );
}
