"use client";

import { useEffect, useState, useTransition } from "react";
import { AccountGate } from "@/components/auth/AccountGate";
import { getCurrentUserId } from "@/lib/auth/supabase-auth";
import { getData } from "@/lib/data";
import type { PlayerProfile } from "@/lib/data/domain";

const AGE_GROUPS = ["TK", "SD 1", "SD 2", "Umum"] as const;

export function PlayerProfiles() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [alias, setAlias] = useState("");
  const [ageGroup, setAgeGroup] = useState<string>("TK");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const refresh = async (id: string) => {
    setPlayers(await getData().players.list(id));
  };

  useEffect(() => {
    void (async () => {
      const id = await getCurrentUserId();
      setAccountId(id);
      if (id) await refresh(id);
      setLoading(false);
    })();
  }, []);

  const add = () => {
    if (!accountId) return;
    const name = alias.trim();
    if (!name) return;
    startTransition(async () => {
      try {
        await getData().players.create(accountId, { alias: name, ageGroup });
        setAlias("");
        setMessage("Pemain ditambahkan.");
        await refresh(accountId);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Gagal menambahkan.");
      }
    });
  };

  const remove = (id: string) => {
    if (!accountId) return;
    startTransition(async () => {
      await getData().players.remove(id);
      setMessage("Pemain dihapus.");
      await refresh(accountId);
    });
  };

  if (loading) return <p className="account-gate">Memuat…</p>;
  if (!accountId) return <AccountGate message="Masuk untuk mengelola profil pemain." />;

  return (
    <div className="players">
      <div className="players__add">
        <input
          placeholder="Nama pemain / alias"
          value={alias}
          onChange={(event) => setAlias(event.target.value)}
          aria-label="Nama pemain"
        />
        <select
          value={ageGroup}
          onChange={(event) => setAgeGroup(event.target.value)}
          aria-label="Kelompok umur"
        >
          {AGE_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        <button
          className="button button--primary"
          type="button"
          onClick={add}
          disabled={pending || !alias.trim()}
        >
          Tambah
        </button>
      </div>

      {message && <p className="players__message">{message}</p>}

      {players.length === 0 ? (
        <p className="catalog-empty">Belum ada pemain. Tambahkan di atas.</p>
      ) : (
        <ul className="players__list">
          {players.map((player) => (
            <li key={player.id}>
              <span className="players__avatar" aria-hidden>
                {player.alias.slice(0, 1).toUpperCase()}
              </span>
              <div>
                <strong>{player.alias}</strong>
                <small>{player.ageGroup ?? "Umum"}</small>
              </div>
              <button type="button" onClick={() => remove(player.id)} disabled={pending}>
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
