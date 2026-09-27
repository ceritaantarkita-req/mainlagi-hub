"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { shopRequest } from "./client";

export function AdminOrderActions({
  number,
  packed,
  canPack,
  canAcceptLatePayment = false,
  canRestockRefund = false,
}: {
  number: string;
  packed: boolean;
  canPack: boolean;
  canAcceptLatePayment?: boolean;
  canRestockRefund?: boolean;
}) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [reason, setReason] = useState("");

  async function act(action: string, data: Record<string, unknown> = {}) {
    setBusy(true);
    setMessage("");
    try {
      await shopRequest(`admin/${action}`, { number, ...data });
      setMessage("Tersimpan.");
      if (action === "order-action") setReason("");
      router.refresh();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const manual = async (action: string) => {
    if (reason.trim().length < 3) {
      setMessage("Isi alasan minimal 3 karakter.");
      return;
    }
    await act("order-action", { action, reason: reason.trim() });
  };

  return (
    <div>
      {canPack ? (
        <button className="shop-button" disabled={busy} onClick={() => act("pack")}>
          Tandai selesai dikemas
        </button>
      ) : null}
      {packed ? (
        <button className="shop-button" disabled={busy} onClick={() => act("ship")}>
          Pesan kurir
        </button>
      ) : null}
      <button
        className="shop-button shop-button-secondary"
        disabled={busy}
        onClick={() => act("reconcile")}
      >
        Cek pembayaran/refund
      </button>

      <label style={{ display: "block", marginTop: 12 }}>
        Catatan/alasan operator
        <input
          value={reason}
          minLength={3}
          maxLength={500}
          disabled={busy}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Wajib untuk tindakan manual"
        />
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        <button
          className="shop-button shop-button-secondary"
          disabled={busy}
          onClick={() => manual("note")}
        >
          Simpan catatan
        </button>
        {canAcceptLatePayment ? (
          <button
            className="shop-button"
            disabled={busy}
            onClick={() => manual("accept_late_payment_stock")}
          >
            Terima late payment + ambil stok
          </button>
        ) : null}
        {canRestockRefund ? (
          <button
            className="shop-button"
            disabled={busy}
            onClick={() => manual("restock_full_refund")}
          >
            Restock barang refund
          </button>
        ) : null}
      </div>
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
