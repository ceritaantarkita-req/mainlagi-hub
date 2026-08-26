/* eslint-disable react-hooks/set-state-in-effect -- initial admin data is loaded from REST state after the server-side owner gate has already passed */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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

/**
 * Interactive affiliate CRUD panel. Rendered only after
 * src/app/admin/affiliate/page.tsx has confirmed the caller is the owner
 * server-side (src/lib/auth/requireOwner.ts) -- this component does not
 * re-check identity, it just does the work.
 */
export function AffiliateAdminPanel({ ownerEmail }: { ownerEmail: string }) {
  const [items, setItems] = useState<AffiliateRecord[]>([]);
  const [form, setForm] = useState<AffiliateRecord>(EMPTY);
  const [message, setMessage] = useState("Memuat data affiliate...");

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

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <Link href="/admin/dashboard">Admin</Link>
            <h1>Affiliate Admin</h1>
            <p>Kelola card Shopee dan TikTok Shop yang tampil di homepage.</p>
          </div>
          <span>{ownerEmail}</span>
        </header>

        <div className="admin-note">
          {message}
          <br />
          Akses halaman ini dicek server-side lewat <code>profiles.role</code> (harus
          bernilai owner) -- lihat <code>src/lib/auth/requireOwner.ts</code>. Penulisan
          tetap dilindungi RLS di database.
        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            <h2>Tambah produk</h2>
            <div className="admin-form">
              <label>
                Slug
                <input
                  value={form.slug}
                  onChange={(event) => setForm({ ...form, slug: event.target.value })}
                />
              </label>
              <label>
                Judul
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
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
            <h2>Produk aktif</h2>
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
                {items.length
                  ? items.map((item) => (
                      <tr key={item.id ?? item.slug}>
                        <td>
                          <b>{item.title}</b>
                          <br />
                          <small>{item.slug}</small>
                        </td>
                        <td>{item.platform}</td>
                        <td>{item.active ? "Aktif" : "Nonaktif"}</td>
                        <td>
                          <button
                            onClick={() =>
                              item.id &&
                              void updateAffiliateItem(item.id, { active: !item.active }).then(() => load())
                            }
                          >
                            {item.active ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </td>
                      </tr>
                    ))
                  : AFFILIATE_ITEMS.map((item) => (
                      <tr key={item.slug}>
                        <td>{item.title}</td>
                        <td>{item.platform}</td>
                        <td>Contoh lokal</td>
                        <td>-</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </main>
  );
}
