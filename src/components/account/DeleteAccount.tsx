"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AccountGate } from "@/components/auth/AccountGate";
import { getCurrentUser, signOut } from "@/lib/auth/supabase-auth";
import { deleteAccountAction } from "@/lib/auth/account-actions";

export function DeleteAccount() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const remove = () => {
    startTransition(async () => {
      setMessage("");
      try {
        await deleteAccountAction();
        await signOut();
        router.replace("/");
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Gagal menghapus akun. Coba lagi."
        );
      }
    });
  };

  if (loading) return <p className="account-gate">Memuat…</p>;
  if (!user) return <AccountGate message="Masuk untuk menghapus akunmu." />;

  return (
    <div className="delete-account">
      <p>
        Menghapus akun akan menghapus profil pemain, skor, progres, dan data
        lainnya yang tersimpan pada akun <strong>{user.email}</strong>. Tindakan
        ini tidak dapat dibatalkan.
      </p>

      <label className="delete-account__confirm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
        />
        <span>Saya memahami data akan dihapus permanen.</span>
      </label>

      <label className="delete-account__phrase">
        <span>Ketik <strong>HAPUS</strong> untuk konfirmasi</span>
        <input
          value={phrase}
          onChange={(event) => setPhrase(event.target.value)}
          placeholder="HAPUS"
          aria-label="Ketik HAPUS untuk konfirmasi"
        />
      </label>

      {message && <p className="delete-account__message">{message}</p>}

      <button
        className="button button--danger"
        type="button"
        disabled={pending || !confirmed || phrase.trim().toUpperCase() !== "HAPUS"}
        onClick={remove}
      >
        {pending ? "Menghapus…" : "Hapus akun"}
      </button>
    </div>
  );
}
