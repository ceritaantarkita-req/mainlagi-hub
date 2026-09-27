"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { shopRequest } from "./client";
export function AdminOrderActions({
  number,
  packed,
  canPack,
}: {
  number: string;
  packed: boolean;
  canPack: boolean;
}) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function act(action: string) {
    setBusy(true);
    setMessage("");
    try {
      await shopRequest(`admin/${action}`, { number });
      setMessage("Tersimpan.");
      router.refresh();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      {canPack ? (
        <button
          className="shop-button"
          disabled={busy}
          onClick={() => act("pack")}
        >
          Tandai selesai dikemas
        </button>
      ) : null}
      {packed ? (
        <button
          className="shop-button"
          disabled={busy}
          onClick={() => act("ship")}
        >
          Pesan kurir
        </button>
      ) : null}
      <button
        className="shop-button shop-button-secondary"
        disabled={busy}
        onClick={() => act("reconcile")}
      >
        Cek pembayaran
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
export function InventoryAdjust({ variantId }: { variantId: string }) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [key, setKey] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const form = e.currentTarget,
      data = new FormData(form),
      id = key || crypto.randomUUID();
    setKey(id);
    try {
      await shopRequest("admin/inventory", {
        variantId,
        delta: Number(data.get("delta")),
        reason: data.get("reason"),
        key: id,
      });
      setKey("");
      form.reset();
      setMessage("Stok diperbarui.");
      router.refresh();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="shop-form" onSubmit={submit}>
      <label>
        Penyesuaian (+ / −)
        <input
          name="delta"
          type="number"
          required
          disabled={busy}
          onChange={() => setKey("")}
        />
      </label>
      <label>
        Alasan
        <input
          name="reason"
          required
          minLength={3}
          maxLength={500}
          disabled={busy}
          onChange={() => setKey("")}
        />
      </label>
      <button className="shop-button" disabled={busy}>
        Simpan penyesuaian
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
