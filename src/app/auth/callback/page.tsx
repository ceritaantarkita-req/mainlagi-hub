/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { exchangeAuthCode } from "@/lib/auth/supabase-auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Menyelesaikan login Google…");

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      setMessage("Kode login tidak ditemukan.");
      return;
    }

    void exchangeAuthCode(code)
      .then(() => {
        setMessage("Login berhasil. Mengalihkan…");
        router.replace("/");
      })
      .catch((error: unknown) =>
        setMessage(error instanceof Error ? error.message : "Login gagal.")
      );
  }, [router]);

  return (
    <main className="center-page">
      <section className="dialog-card">
        <h1>Login Mainlagi Hub</h1>
        <p>{message}</p>
        <Link className="button button--primary" href="/">
          Kembali
        </Link>
      </section>
    </main>
  );
}
