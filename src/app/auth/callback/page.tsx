/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { exchangeAuthCode, verifyEmailOtp } from "@/lib/auth/supabase-auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Menyelesaikan proses…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const errorCode = params.get("error_code") || hashParams.get("error_code");
    if (errorCode) {
      setMessage(
        errorCode === "otp_expired"
          ? 'Tautan sudah kedaluwarsa atau sudah terpakai. Minta tautan baru lalu coba lagi.'
          : 'Tautan tidak valid. Minta tautan baru lalu coba lagi.'
      );
      return;
    }

    const code = params.get("code");
    const tokenHash = params.get("token_hash");
    const type = params.get("type");

    if (tokenHash && type) {
      const knownTypes = ["signup", "email_change", "invite", "magiclink"] as const;
      const matchedType = knownTypes.find((t) => t === type);
      if (!matchedType) {
        setMessage("Tipe tautan tidak dikenali.");
        return;
      }
      setMessage("Mengonfirmasi email…");
      void verifyEmailOtp(tokenHash, matchedType)
        .then(() => {
          setMessage("Email dikonfirmasi. Mengalihkan…");
          router.replace("/account");
        })
        .catch((error: unknown) =>
          setMessage(error instanceof Error ? error.message : "Gagal mengonfirmasi email.")
        );
      return;
    }

    if (!code) {
      setMessage("Kode login tidak ditemukan.");
      return;
    }

    setMessage("Menyelesaikan login Google…");
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
        <h1>Mainlagi Hub</h1>
        <p>{message}</p>
        <Link className="button button--primary" href="/">
          Kembali
        </Link>
      </section>
    </main>
  );
}
