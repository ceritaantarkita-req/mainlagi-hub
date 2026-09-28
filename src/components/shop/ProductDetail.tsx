"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categories, rupiah, type Product } from "@/lib/shop/types";
import { shopRequest } from "./client";
export function ProductDetail({
  product: p,
  enabled,
}: {
  product: Product;
  enabled: boolean;
}) {
  const media = [...p.shop_product_media].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
    variants = p.shop_variants.filter((v) => v.is_active && v.weight_grams);
  const [image, setImage] = useState(0),
    [variant, setVariant] = useState(variants[0]?.id ?? ""),
    [quantity, setQuantity] = useState(1),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function add() {
    setBusy(true);
    setMessage("");
    try {
      await shopRequest("cart", { variantId: variant, quantity });
      setMessage("Ditambahkan ke keranjang.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main>
      <p className="shop-breadcrumb">
        <Link href="/shop">Shop</Link> / {categories[p.category_slug]}
      </p>
      <div className="shop-detail">
        <section aria-label="Foto produk">
          <div className="shop-detail-image">
            {media[image] ? (
              <Image
                src={media[image].path}
                alt={media[image].alt_text}
                width={900}
                height={900}
                priority
              />
            ) : null}
          </div>
          <div className="shop-thumbs">
            {media.map((m, i) => (
              <button
                key={m.path}
                onClick={() => setImage(i)}
                aria-label={`Lihat foto ${i + 1}`}
                aria-pressed={image === i}
              >
                <Image src={m.path} alt="" width={140} height={140} />
              </button>
            ))}
          </div>
        </section>
        <section className="shop-product-info">
          <p className="shop-eyebrow">
            MAINLAGI {p.product_code} · {categories[p.category_slug]}
          </p>
          <h1>{p.title}</h1>
          <p className="shop-price">
            {rupiah(
              variants.find((v) => v.id === variant)?.price_override_amount ??
                p.base_price_amount,
            )}
          </p>
          <p>{p.description}</p>
          {enabled && variants.length ? (
            <>
              <label>
                Varian
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                >
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Jumlah
                <input
                  type="number"
                  min={1}
                  max={79}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </label>
              <button
                className="shop-button"
                disabled={busy || !variant || quantity < 1 || quantity > 79}
                aria-busy={busy}
                onClick={add}
              >
                {busy ? "Menambahkan…" : "Tambah ke keranjang"}
              </button>
            </>
          ) : (
            <p className="shop-notice">
              Produk ini belum tersedia untuk dibeli.
            </p>
          )}
          <p role="status" aria-live="polite">{message}</p>
          {message === "Ditambahkan ke keranjang." ? (
            <Link
              className="shop-button shop-button-secondary"
              href="/shop/cart"
            >
              Lihat keranjang
            </Link>
          ) : null}
          <details>
            <summary>Pembayaran & pengiriman</summary>
            <p>
              Ongkir dihitung berdasarkan alamat dan produk saat checkout.
              Pembayaran diproses melalui Midtrans.
            </p>
          </details>
        </section>
      </div>
    </main>
  );
}
