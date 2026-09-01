"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DeleteArticleButton } from "./DeleteArticleButton";
import type { ArticleRecord } from "@/lib/admin/articles";

type SortKey = "title" | "category" | "status" | "published_at";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

interface Row {
  article: ArticleRecord;
  isScheduled: boolean;
  statusLabel: string;
}

function SortHeader({
  label,
  sortKey,
  activeKey,
  dir,
  onSort
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey | null;
  dir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeKey === sortKey;
  return (
    <th aria-sort={isActive ? (dir === "asc" ? "ascending" : "descending") : "none"}>
      <button type="button" className="admin-table__sort" onClick={() => onSort(sortKey)}>
        {label}
        <span className={`admin-table__sort-icon${isActive ? " is-active" : ""}`} aria-hidden>
          {isActive ? (dir === "asc" ? "\u25B2" : "\u25BC") : "\u2195"}
        </span>
      </button>
    </th>
  );
}

export function ArticlesTable({ articles, now }: { articles: ArticleRecord[]; now: number }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const rows = useMemo<Row[]>(() => {
    return articles.map((article) => {
      const isScheduled =
        article.status === "published" &&
        !!article.published_at &&
        new Date(article.published_at).getTime() > now;
      const statusLabel = isScheduled ? "Terjadwal" : article.status === "published" ? "Published" : "Draft";
      return { article, isScheduled, statusLabel };
    });
  }, [articles, now]);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      switch (sortKey) {
        case "title":
          av = a.article.title.toLowerCase();
          bv = b.article.title.toLowerCase();
          break;
        case "category":
          av = (a.article.category ?? "").toLowerCase();
          bv = (b.article.category ?? "").toLowerCase();
          break;
        case "status":
          av = a.statusLabel;
          bv = b.statusLabel;
          break;
        case "published_at":
          av = a.article.published_at ? new Date(a.article.published_at).getTime() : 0;
          bv = b.article.published_at ? new Date(b.article.published_at).getTime() : 0;
          break;
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [rows, sortKey, sortDir]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  function toggleSort(key: SortKey) {
    setVisibleCount(PAGE_SIZE);
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <SortHeader label="Judul" sortKey="title" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
              <SortHeader label="Kategori" sortKey="category" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
              <SortHeader label="Status" sortKey="status" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
              <SortHeader label="Terbit" sortKey="published_at" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(({ article, isScheduled, statusLabel }) => {
              const badgeClass = isScheduled
                ? "admin-badge--pending"
                : article.status === "published"
                  ? "admin-badge--ok"
                  : "admin-badge--muted";
              return (
                <tr key={article.id}>
                  <td>
                    <b>{article.title}</b>
                    <br />
                    <small>/{article.slug}</small>
                  </td>
                  <td>{article.category || <span className="admin-note">-</span>}</td>
                  <td>
                    <span className={`admin-badge ${badgeClass}`}>{statusLabel}</span>
                  </td>
                  <td>
                    {article.published_at ? (
                      isScheduled ? formatDateTime(article.published_at) : formatDate(article.published_at)
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

      <div className="admin-table__footer">
        <small className="admin-note">
          Menampilkan {visible.length} dari {sorted.length} artikel
        </small>
        {hasMore && (
          <button
            type="button"
            className="button button--ghost admin-table__more"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Tampilkan lebih banyak
          </button>
        )}
      </div>
    </>
  );
}
