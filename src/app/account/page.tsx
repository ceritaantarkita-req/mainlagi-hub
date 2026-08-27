"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { getCurrentUser, signOut } from "@/lib/auth/supabase-auth";

const SECTIONS = [
  { label: "Profil", href: "/account/profile", icon: "account" as const },
  { label: "Pemain", href: "/account/players", icon: "games" as const },
  { label: "Preferensi", href: "/account/preferences", icon: "settings" as const },
  { label: "Keamanan", href: "/account/security", icon: "lock" as const },
  { label: "Tentang", href: "/account/about", icon: "globe" as const },
  { label: "Hapus akun", href: "/account/delete", icon: "close" as const }
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
    <div className="fun-home">
      <section className="page-shell fun-section account-page">
        <header className="fun-section__head">
          <h2>Akun</h2>
        </header>

        {!loading && !user && (
          <div className="account-gate">
            <p>
              Masuk untuk menyimpan progress, mengelola pemain, dan mengikuti
              leaderboard. Kamu tetap bisa bermain tanpa akun.
            </p>
            <div className="account-gate__actions">
              <Link className="button button--primary" href="/login">
                Masuk
              </Link>
              <Link className="button button--ghost" href="/signup">
                Buat akun
              </Link>
            </div>
          </div>
        )}

        {!loading && user && (
          <div className="account-user">
            <div className="account-user__head">
              <span className="account-avatar" aria-hidden>
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </div>
            </div>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => void signOut().then(() => setUser(null))}
            >
              Keluar
            </button>
          </div>
        )}

        <nav className="account-grid" aria-label="Pengaturan akun">
          {SECTIONS.map((section) => (
            <Link key={section.href} href={section.href} className="account-link">
              <span className="account-link__icon">
                <Icon name={section.icon} size={22} />
              </span>
              <span>{section.label}</span>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
