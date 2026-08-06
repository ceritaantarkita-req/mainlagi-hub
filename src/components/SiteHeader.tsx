/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, startGoogleLogin, signOut } from "@/lib/auth/supabase-auth";

export function SiteHeader() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  useEffect(() => { void getCurrentUser().then(setUser); }, []);

  return (
    <header className="site-header">
      <Link className="brand-lockup" href="/" aria-label="Mainlagi TV beranda">
        <Image src="/brand/mainlagi-square.png" alt="" width={46} height={46} className="brand-logo" priority />
        <span><strong>Mainlagi TV</strong><small>Motion Learning Hub</small></span>
      </Link>
      <nav className="main-nav" aria-label="Navigasi utama">
        <Link href="/#games">9 aktivitas</Link>
        <Link href="/#how">Cara kerja</Link>
        <Link href="/#affiliate">Pilihan Mainlagi</Link>
        <Link href="/admin/affiliate">Admin</Link>
      </nav>
      <div className="header-actions">
        {user ? (
          <button className="account-button" type="button" onClick={() => void signOut().then(() => setUser(null))} title={user.email}>
            <span>{user.name.slice(0, 1).toUpperCase()}</span> Keluar
          </button>
        ) : (
          <button className="account-button" type="button" onClick={() => void startGoogleLogin()}>
            <span>G</span> Masuk Google
          </button>
        )}
      </div>
    </header>
  );
}
