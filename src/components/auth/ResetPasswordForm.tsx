"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/auth/supabase-client";

/**
 * Sets a new password after the email recovery link is followed.
 *
 * The link authenticates the user on arrival (recovery session); we just ask
 * for a new password and call updateUser.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const client = getBrowserClient();
      if (!client) {
        if (!cancelled) setMessage("Supabase belum dikonfigurasi. Reset untuk sementara nonaktif.");
        return;
      }
      const { data } = await client.auth.getUser();
      if (cancelled) return;
      if (data?.user) setReady(true);
      else setMessage("Sesi reset tidak ditemukan. Gunakan tautan dari email.");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const client = getBrowserClient();
    if (!client) return;
    setLoading(true);
    setMessage("");
    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Kata sandi diperbarui.");
      setTimeout(() => router.replace("/account"), 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memperbarui kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={(event) => void submit(event)}>
      <h1>Atur kata sandi baru</h1>

      <label>
        <span>Kata sandi baru</span>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
          disabled={!ready}
        />
      </label>

      {message && <p className="auth-form__message">{message}</p>}

      <button className="button button--primary" type="submit" disabled={loading || !ready}>
        {loading ? "Memproses…" : "Simpan kata sandi"}
      </button>
    </form>
  );
}
