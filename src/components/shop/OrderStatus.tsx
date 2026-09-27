"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { rupiah } from "@/lib/shop/types";
import { shopRequest } from "./client";
type OrderView = {
  number: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment: string;
  fulfillment: string;
  status: string;
  items: {
    title_snapshot: string;
    quantity: number;
    line_total_amount: number;
  }[];
  shipments: {
    waybill_id: string | null;
    tracking_url: string | null;
    status: string;
  }[];
};
const labels: Record<string, string> = {
  pending: "Menunggu pembayaran",
  paid: "Pembayaran diterima",
  failed: "Pembayaran gagal",
  expired: "Kedaluwarsa",
  cancelled: "Dibatalkan",
  refunded: "Dikembalikan",
  unfulfilled: "Belum dikemas",
  ready_to_ship: "Siap dikirim",
  shipment_created: "Pengiriman dibuat",
  in_transit: "Dalam perjalanan",
  delivered: "Sudah diterima",
  attention_required: "Sedang diperiksa",
  exception: "Kendala pengiriman",
};
export function OrderStatus({ number }: { number: string }) {
  const [o, setOrder] = useState<OrderView | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    shopRequest<OrderView>(`orders/${number}`)
      .then((d) => {
        if (active) setOrder(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [number]);
  async function action(pay: boolean) {
    setBusy(true);
    setError("");
    try {
      if (pay) {
        const p = await shopRequest<{ url: string }>("payments/session", {
          number,
        });
        window.location.assign(p.url);
      } else {
        await shopRequest("orders/refresh", { number });
        setOrder(await shopRequest<OrderView>(`orders/${number}`));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="shop-flow">
      <p className="shop-eyebrow">PESANAN MAINLAGI</p>
      <h1>Kabar pesananmu</h1>
      <p>{number}</p>
      {error ? (
        <p role="alert" className="shop-notice">
          {error}
        </p>
      ) : null}
      <div aria-live="polite" aria-busy={!o && !error}>
      {o ? (
        <section className="shop-summary">
          <h2>{labels[o.payment] ?? o.payment}</h2>
          <p>Pengiriman: {labels[o.fulfillment] ?? o.fulfillment}</p>
          {o.status === "attention_required" ? (
            <p className="shop-notice">
              Pembayaran sedang diperiksa. Pesanan belum diteruskan untuk
              pengiriman.
            </p>
          ) : null}
          {o.items.map((i, n) => (
            <p key={n}>
              {i.title_snapshot} × {i.quantity}
              <strong>{rupiah(i.line_total_amount)}</strong>
            </p>
          ))}
          <p>
            Ongkir<strong>{rupiah(o.shipping)}</strong>
          </p>
          <p>
            Total<strong>{rupiah(o.total)}</strong>
          </p>
          {o.shipments.map((s, i) => (
            <p key={i}>
              Resi: {s.waybill_id ?? "Sedang disiapkan"}
              {s.tracking_url?.startsWith("https://") ? (
                <a href={s.tracking_url} target="_blank" rel="noreferrer">
                  Lacak pengiriman ↗
                </a>
              ) : null}
            </p>
          ))}
          {o.payment === "pending" ? (
            <button
              className="shop-button"
              disabled={busy}
              aria-busy={busy}
              onClick={() => action(true)}
            >
              Bayar dengan Midtrans
            </button>
          ) : null}
          <button
            className="shop-button shop-button-secondary"
            disabled={busy}
            aria-busy={busy}
            onClick={() => action(false)}
          >
            Periksa pembayaran
          </button>
        </section>
      ) : !error ? (
        <p className="shop-loading">Memuat pesanan…</p>
      ) : null}
      </div>
      <div className="shop-order-help">
        <Link href="/shop/policies">Kebijakan belanja & bantuan</Link>
        {" · "}
        <Link href="/shop">Kembali ke Shop</Link>
      </div>
    </main>
  );
}
