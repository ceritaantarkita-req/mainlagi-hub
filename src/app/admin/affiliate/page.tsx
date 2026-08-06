/* eslint-disable react-hooks/set-state-in-effect -- initial admin data is loaded from external auth and REST state */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AFFILIATE_ITEMS } from "@/lib/data/affiliate";
import { getCurrentUser, startGoogleLogin } from "@/lib/auth/supabase-auth";
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

export default function AffiliateAdminPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [items, setItems] = useState<AffiliateRecord[]>([]);
  const [form, setForm] = useState<AffiliateRecord>(EMPTY);
  const [message, setMessage] = useState("Memuat status admin…");
  const adminEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "ceritagindra@gmail.com";

  const load = useCallback(async () => {
    const current = await getCurrentUser();
    setUser(current);

    if (!current) {
      setMessage("Login Google diperlukan untuk mengelola affiliate.");
      return;
    }

    if (current.email.toLowerCase() !== adminEmail.toLowerCase()) {
      setMessage(`Akun ${current.email} bukan admin yang diizinkan.`);
      return;
    }

    try {
      setItems(await listAffiliateItems());
      setMessage("Data affiliate dimuat dari Supabase.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Data gagal dimuat.");
    }
  }, [adminEmail]);

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
            <Link href="/">← Beranda</Link>
            <h1>Affiliate Admin</h1>
            <p>Kelola card Shopee dan TikTok Shop yang tampil di homepage.</p>
          </div>
          {user ? (
            <span>{user.email}</span>
          ) : (
            <button
              className="button button--primary"
              onClick={() => void startGoogleLogin()}
            >
              Masuk Google
            </button>
          )}
        </header>

        <div className="admin-note">
          {message}
          <br />
          RLS di file <code>supabase/schema.sql</code> harus diterapkan. Hanya
          role admin atau email admin yang boleh menulis.
        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            <h2>Tambah produk</h2>
            <div className="admin-form">
              <label>
                Slug
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm({ ...form, slug: event.target.value })
                  }
                />
              </label>
              <label>
                Judul
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </label>
              <label>
                Platform
                <select
                  value={form.platform}
                  onChange={(event) =>
                    setForm({ ...form, platform: event.target.value })
                  }
                >
                  <option>Shopee</option>
                  <option>TikTok Shop</option>
                </select>
              </label>
              <label>
                Kategori
                <input
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                />
              </label>
              <label>
                Image URL
                <input
                  value={form.image_url}
                  onChange={(event) =>
                    setForm({ ...form, image_url: event.target.value })
                  }
                />
              </label>
              <label>
                Destination URL
                <input
                  value={form.destination_url}
                  onChange={(event) =>
                    setForm({ ...form, destination_url: event.target.value })
                  }
                />
              </label>
              <label>
                Urutan
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(event) =>
                    setForm({ ...form, sort_order: Number(event.target.value) })
                  }
                />
              </label>
              <button
                className="button button--primary"
                disabled={
                  !user ||
                  user.email.toLowerCase() !== adminEmail.toLowerCase() ||
                  !form.slug ||
                  !form.title ||
                  !form.destination_url
                }
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
                              void updateAffiliateItem(item.id, {
                                active: !item.active
                              }).then(() => load())
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
                        <td>—</td>
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
