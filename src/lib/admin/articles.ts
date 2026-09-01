"use server";

import { requireOwner } from "@/lib/auth/requireOwner";
import { getAdminClient } from "@/lib/auth/supabase-server-admin";

export type ArticleStatus = "draft" | "published";

export interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  category: string | null;
  tags: string[];
  cover_image: string | null;
  locale: string;
  status: ArticleStatus;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface ArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  cover_image: string;
  status: ArticleStatus;
  seo_title: string;
  seo_description: string;
}

async function ensureOwner() {
  const gate = await requireOwner();
  if (!gate.ok) throw new Error(gate.reason);
}

const COLUMNS =
  "id, slug, title, excerpt, content, author, category, tags, cover_image, locale, status, seo_title, seo_description, published_at, updated_at, created_at";

export async function listArticles(): Promise<ArticleRecord[]> {
  await ensureOwner();
  const admin = await getAdminClient();
  if (!admin) throw new Error("Service role tidak dikonfigurasi.");
  const { data, error } = await admin
    .from("articles")
    .select(COLUMNS)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ArticleRecord[];
}

export async function getArticle(id: string): Promise<ArticleRecord | null> {
  await ensureOwner();
  const admin = await getAdminClient();
  if (!admin) throw new Error("Service role tidak dikonfigurasi.");
  const { data, error } = await admin.from("articles").select(COLUMNS).eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as ArticleRecord) ?? null;
}

function friendlyDbError(error: { code?: string; message: string }): string {
  if (error.code === "23505") return "Slug sudah dipakai artikel lain -- pilih slug yang berbeda.";
  return error.message;
}

export async function createArticle(input: ArticleInput): Promise<{ id: string }> {
  await ensureOwner();
  const admin = await getAdminClient();
  if (!admin) throw new Error("Service role tidak dikonfigurasi.");

  const now = new Date().toISOString();
  const { data, error } = await admin
    .from("articles")
    .insert({
      slug: input.slug.trim(),
      title: input.title.trim(),
      excerpt: input.excerpt.trim() || null,
      content: input.content,
      author: input.author.trim() || null,
      category: input.category.trim() || null,
      tags: input.tags,
      cover_image: input.cover_image.trim() || null,
      locale: "id",
      status: input.status,
      seo_title: input.seo_title.trim() || null,
      seo_description: input.seo_description.trim() || null,
      published_at: input.status === "published" ? now : null,
      updated_at: now
    })
    .select("id")
    .single();

  if (error) throw new Error(friendlyDbError(error));
  return { id: (data as { id: string }).id };
}

export async function updateArticle(id: string, input: ArticleInput): Promise<void> {
  await ensureOwner();
  const admin = await getAdminClient();
  if (!admin) throw new Error("Service role tidak dikonfigurasi.");

  const existing = await getArticle(id);
  if (!existing) throw new Error("Artikel tidak ditemukan.");

  const publishedAt =
    input.status === "published" ? (existing.published_at ?? new Date().toISOString()) : existing.published_at;

  const { error } = await admin
    .from("articles")
    .update({
      slug: input.slug.trim(),
      title: input.title.trim(),
      excerpt: input.excerpt.trim() || null,
      content: input.content,
      author: input.author.trim() || null,
      category: input.category.trim() || null,
      tags: input.tags,
      cover_image: input.cover_image.trim() || null,
      status: input.status,
      seo_title: input.seo_title.trim() || null,
      seo_description: input.seo_description.trim() || null,
      published_at: publishedAt,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) throw new Error(friendlyDbError(error));
}

export async function deleteArticle(id: string): Promise<void> {
  await ensureOwner();
  const admin = await getAdminClient();
  if (!admin) throw new Error("Service role tidak dikonfigurasi.");
  const { error } = await admin.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
