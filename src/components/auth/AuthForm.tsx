"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/auth/supabase-client";

type Mode = "login" | "signup" | "forgot";

const COPY: Record<Mode, { title: string; cta: string }> = {
  login: { title: "Masuk", cta: "Masuk" },
  signup: { title: "Buat akun", cta: "Daftar" },
  forgot: { title: "Lupa kata sandi", cta: "Kirim tautan" }
};

/**
 * Email/password auth form (login, signup, forgot-password).
 *
 * Uses the cookie-session browser client. No-ops with a message when Supabase
 * is not configured.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const client = getBrowserClient();
    if (!client) {
      setMessage("Supabase belum dikonfigurasi. Login untuk sementara nonaktif.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      if (mode === "forgot") {
        const { error } = await client.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) throw error;
        setMessage("Tautan reset terkirim. Cek email kamu.");
      } else if (mode === "signup") {
        const { data, error } = await client.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user && !data.session) {
          setMessage("Cek email untuk konfirmasi, lalu masuk.");
        } else {
          router.replace("/account");
        }
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/account");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={(event) => void submit(event)}>
      <h1>{COPY[mode].title}</h1>

      <label>
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      {mode !== "forgot" && (
        <label>
          <span>Kata sandi</span>
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>
      )}

      {message && <p className="auth-form__message">{message}</p>}

      <button className="button button--primary" type="submit" disabled={loading}>
        {loading ? "Memproses…" : COPY[mode].cta}
      </button>

      <nav className="auth-form__links">
        {mode === "login" ? (
          <>
            <Link href="/signup">Buat akun</Link>
            <Link href="/forgot-password">Lupa kata sandi</Link>
          </>
        ) : (
          <Link href="/login">Sudah punya akun? Masuk</Link>
        )}
      </nav>
    </form>
  );
}
