"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/articles/RichTextEditor";
import { createArticle, updateArticle, type ArticleInput, type ArticleRecord } from "@/lib/admin/articles";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toFormState(article?: ArticleRecord): ArticleInput {
  return {
    slug: article?.slug ?? "",
    title: article?.title ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    author: article?.author ?? "",
    category: article?.category ?? "",
    tags: article?.tags ?? [],
    cover_image: article?.cover_image ?? "",
    status: article?.status ?? "draft",
    seo_title: article?.seo_title ?? "",
    seo_description: article?.seo_description ?? ""
  };
}

export function ArticleForm({ article }: { article?: ArticleRecord }) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleInput>(() => toFormState(article));
  const [tagsText, setTagsText] = useState(() => (article?.tags ?? []).join(", "));
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const isEdit = Boolean(article);
  const valid = form.title.trim().length > 0 && form.slug.trim().length > 0 && form.content.trim().length > 0;

  const onTitleChange = (title: string) => {
    setForm((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));
  };

  const submit = () => {
    setMessage("");
    const payload: ArticleInput = { ...form, tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean) };
    startTransition(async () => {
      try {
        if (isEdit && article) {
          await updateArticle(article.id, payload);
        } else {
          await createArticle(payload);
        }
        router.push("/admin/articles");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Gagal menyimpan artikel.");
      }
    });
  };

  return (
    <div className="admin-form admin-form--article">
      <div className="admin-form__row">
        <label>
          Judul
          <input value={form.title} onChange={(event) => onTitleChange(event.target.value)} />
        </label>
        <label>
          Slug
          <input
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true);
              setForm((prev) => ({ ...prev, slug: slugify(event.target.value) }));
            }}
          />
        </label>
      </div>

      <label>
        Ringkasan
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
        />
      </label>

      <div className="admin-form__row">
        <label>
          Penulis
          <input
            value={form.author}
            onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
          />
        </label>
        <label>
          Kategori
          <input
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          />
        </label>
      </div>

      <div className="admin-form__row">
        <label>
          Tag (pisahkan koma)
          <input value={tagsText} onChange={(event) => setTagsText(event.target.value)} />
        </label>
        <label>
          Cover image URL
          <input
            value={form.cover_image}
            onChange={(event) => setForm((prev) => ({ ...prev, cover_image: event.target.value }))}
          />
        </label>
      </div>

      <label>
        Konten
        <RichTextEditor
          value={form.content}
          onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
          placeholder="Tulis artikelnya di sini..."
        />
      </label>

      <details className="admin-form__seo">
        <summary>SEO (opsional)</summary>
        <div className="admin-form__row">
          <label>
            SEO title
            <input
              value={form.seo_title}
              onChange={(event) => setForm((prev) => ({ ...prev, seo_title: event.target.value }))}
            />
          </label>
          <label>
            SEO description
            <input
              value={form.seo_description}
              onChange={(event) => setForm((prev) => ({ ...prev, seo_description: event.target.value }))}
            />
          </label>
        </div>
      </details>

      <div className="admin-form__footer">
        <label className="admin-form__status">
          Status
          <select
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ArticleInput["status"] }))}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <div className="admin-form__actions">
          {message && <span className="admin-form__message">{message}</span>}
          <button className="button" type="button" onClick={() => router.push("/admin/articles")}>
            Batal
          </button>
          <button className="button button--primary" type="button" disabled={!valid || pending} onClick={submit}>
            {pending ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Buat artikel"}
          </button>
        </div>
      </div>
    </div>
  );
}
