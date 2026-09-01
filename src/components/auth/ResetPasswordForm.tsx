"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/auth/supabase-client";

/**
 * Sets a new password after the email recovery link is followed.
 *
 * Supports two link shapes:
 *  - `?token_hash=...&type=recovery` (recommended custom email template,
 *    resistant to email-scanner link prefetching — see README note in the
 *    Supabase dashboard instructions) — exchanged via verifyOtp.
 *  - `?code=...` (Supabase's default PKCE confirmation link) — exchanged
 *    via exchangeCodeForSession, same as src/app/auth/callback.
 * Also surfaces Supabase's own `error_code` (e.g. otp_expired) when the
 * link was already consumed or expired before the user got here.
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
      try {
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const errorCode = params.get("error_code") || hashParams.get("error_code");
        if (errorCode) {
          setMessage(
            errorCode === "otp_expired"
              ? 'Tautan reset sudah kedaluwarsa atau sudah terpakai. Minta tautan baru lewat "Lupa kata sandi".'
              : 'Tautan reset tidak valid. Minta tautan baru lewat "Lupa kata sandi".'
          );
          return;
        }

        const code = params.get("code");
        const tokenHash = params.get("token_hash");
        const type = params.get("type");

        if (tokenHash && type === "recovery") {
          const { error: verifyError } = await client.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
          if (cancelled) return;
          if (verifyError) {
            setMessage('Tautan reset sudah tidak berlaku atau sudah dipakai. Minta tautan baru lewat "Lupa kata sandi".');
            return;
          }
          window.history.replaceState({}, "", window.location.pathname);
        } else if (code) {
          const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (exchangeError) {
            setMessage('Tautan reset sudah tidak berlaku atau sudah dipakai. Minta tautan baru lewat "Lupa kata sandi".');
            return;
          }
          window.history.replaceState({}, "", window.location.pathname);
        }

        const { data } = await client.auth.getUser();
        if (cancelled) return;
        if (data?.user) setReady(true);
        else setMessage("Sesi reset tidak ditemukan. Gunakan tautan dari email.");
      } catch {
        if (!cancelled) setMessage("Supabase sedang tidak bisa diakses. Coba lagi sebentar lagi.");
      }
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
