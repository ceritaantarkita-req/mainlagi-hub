import type { Article } from "../domain";
import type { ArticleRepository } from "./contracts";

/**
 * Real (Supabase-backed) article repository.
 *
 * Reads through the public REST endpoint with the anon key -- the
 * `articles public read` RLS policy on `public.articles` already allows
 * anyone to select rows where `status = 'published'`, so no service-role
 * key is needed here (and none should ever reach this file: it runs on
 * every public article request).
 *
 * `published_at` doubles as the scheduling field: the admin CMS
 * (src/lib/admin/articles.ts) can set it to a future timestamp while
 * `status` is already `published`, and this repository simply hides rows
 * whose `published_at` has not arrived yet. That is the entire "schedule a
 * post" mechanism -- no cron job, no extra worker.
 */

interface DbArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  cover_image: string | null;
  locale: string;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
}

const COLUMNS =
  "id,slug,title,excerpt,content,author,category,tags,cover_image,locale,status,seo_title,seo_description,published_at,updated_at";

function supabaseEnv(): { url: string; anon: string } {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return { url, anon };
}

function toArticle(row: DbArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    category: row.category,
    tags: row.tags ?? [],
    coverImage: row.cover_image,
    locale: row.locale,
    status: row.status,
    canonicalUrl: `/discover/articles/${row.slug}`,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    publishedAt: row.published_at,
    updatedAt: row.updated_at
  };
}

async function query(params: string): Promise<DbArticleRow[]> {
  const { url, anon } = supabaseEnv();
  if (!url || !anon) return [];
  try {
    const response = await fetch(`${url}/rest/v1/articles?${params}`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      cache: "no-store"
    });
    if (!response.ok) return [];
    return (await response.json()) as DbArticleRow[];
  } catch {
    return [];
  }
}

export function createSupabaseArticleRepository(): ArticleRepository {
  return {
    async listPublished(locale = "id") {
      const now = encodeURIComponent(new Date().toISOString());
      const rows = await query(
        `select=${COLUMNS}&status=eq.published&locale=eq.${encodeURIComponent(locale)}&published_at=lte.${now}&order=published_at.desc`
      );
      return rows.map(toArticle);
    },
    async bySlug(slug) {
      const now = encodeURIComponent(new Date().toISOString());
      const rows = await query(
        `select=${COLUMNS}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&published_at=lte.${now}&limit=1`
      );
      const row = rows[0];
      return row ? toArticle(row) : null;
    },
    async related() {
      return [];
    }
  };
}
