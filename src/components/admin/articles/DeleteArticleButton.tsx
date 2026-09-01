"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/lib/admin/articles";
import { Icon } from "@/components/Icon";

export function DeleteArticleButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const onClick = () => {
    if (!window.confirm(`Hapus artikel "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setError("");
    startTransition(async () => {
      try {
        await deleteArticle(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menghapus.");
      }
    });
  };

  return (
    <span className="admin-table__delete">
      <button className="admin-table__action admin-table__action--danger" onClick={onClick} disabled={pending}>
        <Icon name="trash" size={14} />
        {pending ? "Menghapus..." : "Hapus"}
      </button>
      {error && <small className="admin-form__message">{error}</small>}
    </span>
  );
}
