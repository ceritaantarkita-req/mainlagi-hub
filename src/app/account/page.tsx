"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { getCurrentUser, signOut } from "@/lib/auth/supabase-auth";
import styles from "./AccountPage.module.css";

const SECTIONS = [
  { label: "Profil akun", detail: "Data akun keluarga", href: "/account/profile", icon: "account" as const },
  { label: "Profil anak", detail: "Kelola anak dari Area orang tua", href: "/parent/children", icon: "games" as const },
  { label: "Pengaturan keluarga", detail: "Bahasa, privasi, dan pengalaman", href: "/parent/settings", icon: "settings" as const },
  { label: "Keamanan", detail: "Kata sandi dan akses", href: "/account/security", icon: "lock" as const },
  { label: "Tentang Mainlagi", detail: "Informasi produk terkini", href: "/about", icon: "globe" as const },
  { label: "FAQ", detail: "Jawaban pertanyaan umum", href: "/faq", icon: "faq" as const },
  { label: "Hapus akun", detail: "Kelola penghapusan data akun", href: "/account/delete", icon: "close" as const, danger: true }
];

export default function AccountPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={styles.page} data-mainlagi-account-family-shell>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Pengaturan akun</p>
          <h1>Akun keluarga</h1>
          <p>
            Akun adalah bagian dari Area orang tua. Kelola identitas keluarga, keamanan, dan akses ke pengaturan akun dari sini.
          </p>
        </header>

        {loading && (
          <div className={styles.loading} role="status">
            Menyiapkan akun keluarga…
          </div>
        )}

        {!loading && !user && (
          <div className={styles.gate} data-mainlagi-account-signed-out>
            <div className={styles.gateCopy}>
              <strong>Simpan progres keluarga di akun Mainlagi.</strong>
              <p>
                Masuk untuk membuat profil anak production, menyimpan progres keluarga, dan membuka Area orang tua. Gian Demo tetap bisa dicoba tanpa akun.
              </p>
            </div>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/login?next=/parent">
                Masuk
              </Link>
              <Link className={styles.secondary} href="/signup?next=/parent">
                Buat akun
              </Link>
            </div>
          </div>
        )}

        {!loading && user && (
          <div className={styles.userCard} data-mainlagi-account-signed-in>
            <div className={styles.userIdentity}>
              <span className={styles.avatar} aria-hidden>
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className={styles.identityCopy}>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </div>
            </div>
            <button
              className={styles.secondary}
              type="button"
              onClick={() => void signOut().then(() => setUser(null))}
            >
              Keluar
            </button>
          </div>
        )}

        <div className={styles.sectionHead}>
          <h2>Pengaturan keluarga</h2>
          <p>Pengaturan orang tua tetap terpisah dari area bermain anak.</p>
        </div>

        <nav className={styles.grid} aria-label="Pengaturan akun" data-mainlagi-account-settings>
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`${styles.link} ${section.danger ? styles.danger : ""}`}
            >
              <span className={styles.linkIcon} aria-hidden>
                <Icon name={section.icon} size={22} />
              </span>
              <span className={styles.linkCopy}>
                <strong>{section.label}</strong>
                <small>{section.detail}</small>
              </span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
