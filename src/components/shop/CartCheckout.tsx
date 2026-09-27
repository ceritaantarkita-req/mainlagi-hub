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
    [postal, setPostal] = useState(""),
    [busyAction, setBusyAction] = useState<"remove" | "rates" | "checkout" | null>(null);
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
  async function retryCart() {
    setBusy(true);
    setError("");
    try {
      const data = await shopRequest<{ lines: CartLine[] }>("cart");
      setLines(data.lines);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
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
    setBusyAction("remove");
    setError("");
    try {
      await shopRequest("cart", { variantId, quantity: 0 });
      setLines((l) => l?.filter((i) => i.variant_id !== variantId) ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      setBusyAction(null);
    }
  }
  async function getRates() {
    if (!/^\d{5}$/.test(postal)) {
      setError("Kode pos harus terdiri dari 5 angka.");
      return;
    }
    setBusy(true);
    setBusyAction("rates");
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
      setBusyAction(null);
    }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) {
      setError("Pilih layanan pengiriman sebelum membuat pesanan.");
      return;
    }
    if (!e.currentTarget.reportValidity()) return;
    setBusy(true);
    setBusyAction("checkout");
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
      setBusyAction(null);
    }
  }
  return (
    <main className="shop-flow">
      <p className="shop-eyebrow">
        {checkout ? "SEDIKIT LAGI" : "PILIHANMU HARI INI"}
      </p>
      <h1>{checkout ? "Alamat & pengiriman" : "Keranjang"}</h1>
      <div aria-live="assertive">
        {error ? (
          <p className="shop-notice" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      {lines === null ? (
        error ? (
          <div className="shop-empty shop-empty-compact">
            <h2>Keranjang belum dapat dimuat.</h2>
            <p>Coba lagi tanpa mengubah isi keranjangmu.</p>
            <button
              className="shop-button shop-button-secondary"
              type="button"
              disabled={busy}
              aria-busy={busy}
              onClick={retryCart}
            >
              {busy ? "Mencoba lagi…" : "Coba lagi"}
            </button>
          </div>
        ) : (
          <p className="shop-loading" aria-live="polite">
            Memuat keranjang…
          </p>
        )
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
                  <button
                    disabled={busy}
                    aria-label={`Hapus ${l.shop_variants.shop_products.title} dari keranjang`}
                    onClick={() => remove(l.variant_id)}
                  >
                    {busyAction === "remove" ? "Memproses…" : "Hapus"}
                  </button>
                ) : null}
              </article>
            ))}
            {checkout ? (
              <form onSubmit={submit} className="shop-form">
                <h2>Ke mana kami mengirimnya?</h2>
                <p id="shop-checkout-required">
                  Isi data penerima dewasa. Semua kolom wajib diisi.
                </p>
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
                      aria-describedby="shop-checkout-required"
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
                    title="Masukkan 5 angka kode pos"
                    maxLength={5}
                    required
                    aria-describedby="shop-postal-help"
                    value={postal}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                      setPostal(value);
                      setQuotes([]);
                      setSelected("");
                    }}
                  />
                  <small id="shop-postal-help">5 angka kode pos tujuan.</small>
                </label>
                <button
                  className="shop-button shop-button-secondary"
                  type="button"
                  disabled={busy || !/^\d{5}$/.test(postal)}
                  aria-busy={busyAction === "rates"}
                  onClick={getRates}
                >
                  {busyAction === "rates" ? "Menghitung…" : "Hitung ongkir"}
                </button>
                <div aria-live="polite">
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
                </div>
                <button
                  className="shop-button"
                  disabled={busy || !selected}
                  aria-busy={busyAction === "checkout"}
                >
                  {busyAction === "checkout" ? "Membuat pesanan…" : "Buat pesanan"}
                </button>
                <p>
                  Dengan membuat pesanan, kamu memahami{" "}
                  <Link href="/shop/policies">kebijakan belanja Mainlagi Shop</Link>.
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
