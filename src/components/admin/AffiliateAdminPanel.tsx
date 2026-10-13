/* eslint-disable react-hooks/set-state-in-effect -- initial admin data is loaded from REST state after the server-side owner gate has already passed */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AFFILIATE_ITEMS } from "@/lib/data/affiliate";
import {
  createAffiliateItem,
  listAffiliateItems,
  updateAffiliateItem,
  type AffiliateRecord
} from "@/lib/auth/supabase-rest";

const EMPTY: AffiliateRecord = {
  slug: "",
  title: "",
  platform: "Shopee",
  category: "",
  image_url: "",
  destination_url: "",
  active: true,
  sort_order: 10
};

const PAGE_SIZE = 8;

/**
 * Normalized shape used purely for rendering the table -- lets us mix
 * live Supabase rows (AffiliateRecord) with the static local catalog
 * fallback (AffiliateItem) without the two incompatible shapes leaking
 * into the JSX.
 */
interface DisplayAffiliateRow {
  key: string;
  id: string | undefined;
  slug: string;
  title: string;
  platform: string;
  active: boolean | undefined;
}

/**
 * Interactive affiliate CRUD panel. Rendered only after
 * src/app/admin/affiliate/page.tsx has confirmed the caller is the owner
 * server-side (src/lib/auth/requireOwner.ts) -- this component does not
 * re-check identity, it just does the work.
 */
export function AffiliateAdminPanel() {
  const [items, setItems] = useState<AffiliateRecord[]>([]);
  const [form, setForm] = useState<AffiliateRecord>(EMPTY);
  const [message, setMessage] = useState("Memuat data affiliate...");
  const [showAll, setShowAll] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState("");
  const [imageSavePending, setImageSavePending] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await listAffiliateItems());
      setMessage("Data affiliate dimuat dari Supabase.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Data gagal dimuat.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    try {
      const created = await createAffiliateItem(form);
      setItems((current) => [...current, created]);
      setForm(EMPTY);
      setMessage("Item affiliate tersimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan.");
    }
  };

  const editImage = (item: AffiliateRecord) => {
    if (!item.id) return;
    setEditingImageId(item.id);
    setEditingImageUrl(item.image_url ?? "");
    setMessage("Tempel URL gambar langsung dari materi Shopee Affiliate yang boleh dipakai. Link produk Shopee bukan gambar.");
  };

  const saveImage = async () => {
    if (!editingImageId || imageSavePending) return;
    const url = editingImageUrl.trim();
    if (url) {
      let parsed: URL;
      try { parsed = new URL(url); } catch {
        setMessage("URL foto tidak valid. Gunakan URL HTTPS gambar langsung.");
        return;
      }
      if (parsed.protocol !== "https:" || parsed.hostname === "shopee.co.id" || parsed.hostname.endsWith(".shopee.co.id")) {
        setMessage("URL foto harus HTTPS langsung ke gambar (contoh CDN Shopee), bukan link halaman/affiliate Shopee.");
        return;
      }
    }
    setImageSavePending(true);
    try {
      await updateAffiliateItem(editingImageId, { image_url: url });
      setEditingImageId(null);
      setEditingImageUrl("");
      await load();
      setMessage(url ? "URL foto tersimpan. Katalog akan memakai URL itu; cek hasilnya di Discover." : "URL foto dihapus; placeholder akan ditampilkan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan URL foto.");
    } finally {
      setImageSavePending(false);
    }
  };

  const isLive = items.length > 0;

  const rows: DisplayAffiliateRow[] = isLive
    ? items.map((item) => ({
        key: item.id ?? item.slug,
        id: item.id,
        slug: item.slug,
        title: item.title,
        platform: item.platform,
        active: item.active
      }))
    : AFFILIATE_ITEMS.map((item) => ({
        key: item.slug,
        id: undefined,
        slug: item.slug,
        title: item.title,
        platform: item.platform,
        active: undefined
      }));

  const visibleRows = useMemo(() => (showAll ? rows : rows.slice(0, PAGE_SIZE)), [rows, showAll]);
  const hiddenCount = rows.length - visibleRows.length;

  return (
    <main className="admin-page-main">
      <div className="admin-page-head">
        <div>
          <h1>Affiliate</h1>
          <p>Kelola card Shopee dan TikTok Shop yang tampil di homepage.</p>
        </div>
      </div>

      <p className="admin-note admin-note--block">
        {message}
        <br />
        Akses halaman ini dicek server-side lewat <code>profiles.role</code> (harus bernilai
        owner). Penulisan tetap dilindungi RLS di database.
      </p>

      <div className="admin-grid">
        <section className="admin-panel">
          <h2>Tambah produk</h2>
          <div className="admin-form">
            <label>
              Slug
              <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
            </label>
            <label>
              Judul
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </label>
            <label>
              Platform
              <select
                value={form.platform}
                onChange={(event) => setForm({ ...form, platform: event.target.value })}
              >
                <option>Shopee</option>
                <option>TikTok Shop</option>
              </select>
            </label>
            <label>
              Kategori
              <input
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              />
            </label>
            <label>
              Image URL
              <input
                value={form.image_url}
                onChange={(event) => setForm({ ...form, image_url: event.target.value })}
              />
            </label>
            <label>
              Destination URL
              <input
                value={form.destination_url}
                onChange={(event) => setForm({ ...form, destination_url: event.target.value })}
              />
            </label>
            <label>
              Urutan
              <input
                type="number"
                value={form.sort_order}
                onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })}
              />
            </label>
            <button
              className="button button--primary"
              disabled={!form.slug || !form.title || !form.destination_url}
              onClick={() => void save()}
            >
              Simpan
            </button>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <h2>Produk aktif</h2>
            <span className="admin-note">{rows.length} produk</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((item) => (
                  <tr key={item.key}>
                    <td>
                      <b>{item.title}</b>
                      <br />
                      <small>{item.slug}</small>
                    </td>
                    <td>{item.platform}</td>
                    <td>
                      {isLive ? (
                        <span className={`admin-badge ${item.active ? "admin-badge--ok" : "admin-badge--muted"}`}>
                          {item.active ? "Aktif" : "Nonaktif"}
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge--muted">Contoh lokal</span>
                      )}
                    </td>
                    <td>
                      {isLive ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <button
                            className="admin-table__action"
                            type="button"
                            onClick={() => {
                              const record = items.find((row) => row.id === item.id);
                              if (record) editImage(record);
                            }}
                          >
                            Edit foto
                          </button>
                          <button
                            className="admin-table__action"
                            type="button"
                            onClick={() =>
                              item.id &&
                              void updateAffiliateItem(item.id, { active: !item.active }).then(() => load())
                            }
                          >
                            {item.active ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </div>
                      ) : (
                        <span className="admin-note">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editingImageId ? (
            <div className="admin-panel" data-affiliate-image-editor>
              <h3>Foto produk</h3>
              <p className="admin-note">
                Pakai URL HTTPS gambar dari materi promosi/afiliasi yang diizinkan.
                Link pendek s.shopee.co.id adalah tujuan produk, bukan URL foto.
                Jangan masukkan foto produk lain atau link halaman.
              </p>
              <label className="admin-form">
                <span>URL gambar langsung</span>
                <input
                  type="url"
                  placeholder="https://...gambar-produk.webp"
                  value={editingImageUrl}
                  onChange={(event) => setEditingImageUrl(event.target.value)}
                  aria-label="URL gambar produk"
                />
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                <button className="button button--primary" type="button" disabled={imageSavePending} onClick={() => void saveImage()}>
                  {imageSavePending ? "Menyimpan…" : "Simpan foto"}
                </button>
                <button className="button button--ghost" type="button" onClick={() => setEditingImageId(null)}>
                  Batal
                </button>
                {editingImageUrl.trim().startsWith("https://") ? (
                  <a className="button button--ghost" href={editingImageUrl.trim()} target="_blank" rel="noopener noreferrer">
                    Periksa URL gambar ↗
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
          {hiddenCount > 0 && (
            <button className="admin-show-more" onClick={() => setShowAll(true)}>
              Tampilkan {hiddenCount} produk lagi
            </button>
          )}
          {showAll && rows.length > PAGE_SIZE && (
            <button className="admin-show-more" onClick={() => setShowAll(false)}>
              Tampilkan lebih sedikit
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
