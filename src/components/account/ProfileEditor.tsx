"use client";

import { useEffect, useState, useTransition } from "react";
import { AccountGate } from "@/components/auth/AccountGate";
import { getCurrentUser } from "@/lib/auth/supabase-auth";
import { updateDisplayNameAction } from "@/lib/auth/account-actions";

export function ProfileEditor() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void getCurrentUser()
      .then((current) => {
        setUser(current);
        if (current) setName(current.name);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = () => {
    startTransition(async () => {
      setMessage("");
      try {
        await updateDisplayNameAction(name.trim());
        setMessage("Nama diperbarui.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Gagal menyimpan.");
      }
    });
  };

  if (loading) return <p className="account-gate">Memuat…</p>;
  if (!user) return <AccountGate message="Masuk untuk mengubah profile." />;

  return (
    <div className="profile-editor">
      <label>
        <span>Email</span>
        <input value={user.email} readOnly disabled />
      </label>

      <label>
        <span>Nama tampilan</span>
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>

      {message && <p className="players__message">{message}</p>}

      <button
        className="button button--primary"
        type="button"
        onClick={save}
        disabled={pending || !name.trim()}
      >
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
    </div>
  );
}
