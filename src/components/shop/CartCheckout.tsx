"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { rupiah, type CartLine, type Quote } from "@/lib/shop/types";
import { shopRequest } from "./client";
export function CartCheckout({ checkout = false }: { checkout?: boolean }) {
  const router = useRouter(),
    [lines, setLines] = useState<CartLine[] | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [quotes, setQuotes] = useState<Quote[]>([]),
    [selected, setSelected] = useState(""),
    [postal, setPostal] = useState("");
  useEffect(() => {
    let active = true;
    shopRequest<{ lines: CartLine[] }>("cart")
      .then((d) => {
        if (active) setLines(d.lines);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const subtotal =
    lines?.reduce(
      (sum, l) =>
        sum +
        l.quantity *
          (l.shop_variants.price_override_amount ??
            l.shop_variants.shop_products.base_price_amount),
      0,
    ) ?? 0;
  async function remove(variantId: string) {
    setBusy(true);
    setError("");
    try {
      await shopRequest("cart", { variantId, quantity: 0 });
      setLines((l) => l?.filter((i) => i.variant_id !== variantId) ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function getRates() {
    setBusy(true);
    setError("");
    setQuotes([]);
    setSelected("");
    try {
      const q = await shopRequest<Quote[]>("shipping/rates", {
        postalCode: postal,
      });
      setQuotes(q);
      if (!q.length) setError("Belum ada layanan pengiriman untuk alamat ini.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const o = await shopRequest<{ number: string }>("checkout", {
        ...data,
        quoteId: selected,
      });
      router.push(`/shop/order/${o.number}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="shop-flow">
      <p className="shop-eyebrow">
        {checkout ? "SEDIKIT LAGI" : "PILIHANMU HARI INI"}
      </p>
      <h1>{checkout ? "Alamat & pengiriman" : "Keranjang"}</h1>
      {error ? (
        <p className="shop-notice" role="alert">
          {error}
        </p>
      ) : null}
      {lines === null ? (
        <p>{error ? "Keranjang belum dapat dimuat." : "Memuat keranjang…"}</p>
      ) : !lines.length ? (
        <div className="shop-empty">
          <h2>Keranjangmu masih kosong.</h2>
          <Link className="shop-button" href="/shop">
            Jelajahi koleksi
          </Link>
        </div>
      ) : (
        <div className="shop-checkout-grid">
          <section>
            {lines.map((l) => (
              <article className="shop-cart-line" key={l.variant_id}>
                <div>
                  <Link href={`/shop/${l.shop_variants.shop_products.slug}`}>
                    <strong>{l.shop_variants.shop_products.title}</strong>
                  </Link>
                  <p>
                    {l.shop_variants.title} · {l.quantity} buah
                  </p>
                  <p>
                    {rupiah(
                      l.quantity *
                        (l.shop_variants.price_override_amount ??
                          l.shop_variants.shop_products.base_price_amount),
                    )}
                  </p>
                </div>
                {!checkout ? (
                  <button disabled={busy} onClick={() => remove(l.variant_id)}>
                    Hapus
                  </button>
                ) : null}
              </article>
            ))}
            {checkout ? (
              <form onSubmit={submit} className="shop-form">
                <h2>Ke mana kami mengirimnya?</h2>
                <p>Isi data penerima dewasa.</p>
                {[
                  ["name", "Nama penerima", "text", "name"],
                  ["email", "Email", "email", "email"],
                  ["phone", "Nomor telepon", "tel", "tel"],
                  ["address", "Alamat lengkap", "text", "street-address"],
                  ["city", "Kota / kabupaten", "text", "address-level2"],
                  ["province", "Provinsi", "text", "address-level1"],
                ].map(([name, label, type, auto]) => (
                  <label key={name}>
                    {label}
                    <input
                      name={name}
                      type={type}
                      autoComplete={auto}
                      required
                      maxLength={name === "address" ? 500 : 254}
                    />
                  </label>
                ))}
                <label>
                  Kode pos
                  <input
                    name="postalCode"
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                    maxLength={5}
                    required
                    value={postal}
                    onChange={(e) => {
                      setPostal(e.target.value);
                      setQuotes([]);
                      setSelected("");
                    }}
                  />
                </label>
                <button
                  className="shop-button shop-button-secondary"
                  type="button"
                  disabled={busy || postal.length !== 5}
                  onClick={getRates}
                >
                  {busy ? "Memproses…" : "Hitung ongkir"}
                </button>
                {quotes.length ? (
                  <fieldset>
                    <legend>Pilih pengiriman</legend>
                    {quotes.map((q) => (
                      <label className="shop-quote" key={q.id}>
                        <input
                          type="radio"
                          name="shipping"
                          value={q.id}
                          checked={selected === q.id}
                          onChange={() => setSelected(q.id)}
                          required
                        />
                        <span>
                          {q.courier_code.toUpperCase()} · {q.service_name}
                          <small>
                            {q.duration_text} · {rupiah(q.price_amount)}
                          </small>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                ) : null}
                <button className="shop-button" disabled={busy || !selected}>
                  Buat pesanan
                </button>
                <p>
                  Harga dan ketersediaan diperiksa kembali saat pesanan dibuat.
                </p>
              </form>
            ) : null}
          </section>
          <aside className="shop-summary">
            <h2>Ringkasan</h2>
            <p>
              Produk <strong>{rupiah(subtotal)}</strong>
            </p>
            <p>
              Ongkir{" "}
              <strong>
                {selected
                  ? rupiah(
                      quotes.find((q) => q.id === selected)?.price_amount ?? 0,
                    )
                  : "Dihitung saat checkout"}
              </strong>
            </p>
            <hr />
            <p>
              Total{" "}
              <strong>
                {rupiah(
                  subtotal +
                    (quotes.find((q) => q.id === selected)?.price_amount ?? 0),
                )}
              </strong>
            </p>
            {!checkout ? (
              <Link className="shop-button" href="/shop/checkout">
                Lanjut checkout
              </Link>
            ) : null}
          </aside>
        </div>
      )}
    </main>
  );
}
