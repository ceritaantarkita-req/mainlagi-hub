"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories, rupiah, type Product } from "@/lib/shop/types";
export function ShopCatalog({
  products,
  preview = false,
  detailBase = "/shop/",
}: {
  products: Product[];
  preview?: boolean;
  detailBase?: string;
}) {
  const [category, setCategory] = useState("all"),
    [search, setSearch] = useState("");
  const shown = products.filter(
    (p) =>
      (category === "all" || p.category_slug === category) &&
      p.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <main>
      {preview ? (
        <p className="shop-notice">
          Pratinjau · 9 produk draft · Belum dapat dibeli
        </p>
      ) : null}
      <section className="shop-hero">
        <div>
          <p className="shop-eyebrow">DARI DUNIA MAINLAGI</p>
          <h1>
            Teman kecil.
            <br />
            Cerita besar.
          </h1>
          <p>
            Bawa serunya bermain ke keseharian.
            <br />
            Dari yang dipakai, sampai tempat menuangkan ide.
          </p>
          <a className="shop-button" href="#koleksi">
            Lihat koleksi <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="shop-hero-art">
          {products[0]?.shop_product_media[0] ? (
            <Image
              src={products[0].shop_product_media[0].path}
              alt={products[0].shop_product_media[0].alt_text}
              width={600}
              height={600}
              priority
            />
          ) : (
            <div className="shop-coming">
              <span aria-hidden="true">✳</span>
              <strong>
                Sedang disiapkan
                <br />
                untukmu.
              </strong>
            </div>
          )}
          <span className="shop-stamp">
            MAIN · BELAJAR
            <br />
            TUMBUH BERSAMA
          </span>
        </div>
      </section>
      <section id="koleksi" className="shop-collection">
        <div className="shop-section-head">
          <div>
            <p className="shop-eyebrow">PILIH TEMAN HARIMU</p>
            <h2>Koleksi Mainlagi</h2>
          </div>
          <label className="shop-search">
            <span className="sr-only">Cari produk</span>
            <input
              type="search"
              placeholder="Cari teman baru…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <div className="shop-filters" aria-label="Kategori produk" role="group">
          {Object.entries({ all: "Semua", ...categories }).map(
            ([id, label]) => (
              <button
                key={id}
                aria-pressed={category === id}
                onClick={() => setCategory(id)}
              >
                {label}
              </button>
            ),
          )}
        </div>
        {!products.length ? (
          <div className="shop-empty">
            <h3>Hal-hal seru sedang disiapkan.</h3>
            <p>Koleksi Mainlagi akan hadir di sini saat siap dipesan.</p>
          </div>
        ) : !shown.length ? (
          <div className="shop-empty shop-empty-compact" role="status" aria-live="polite">
            <h3>Belum ketemu.</h3>
            <p>Coba kategori atau kata pencarian lain.</p>
            <button
              className="shop-button shop-button-secondary"
              type="button"
              onClick={() => {
                setCategory("all");
                setSearch("");
              }}
            >
              Tampilkan semua
            </button>
          </div>
        ) : (
          <div className="shop-grid">
            {shown.map((p, i) => {
              const media = [...p.shop_product_media].sort(
                (a, b) => a.sort_order - b.sort_order,
              )[0];
              return (
                <article key={p.id} className="shop-card">
                  <Link href={`${detailBase}${p.slug}`}>
                    <div className="shop-card-image">
                      {media ? (
                        <Image
                          src={media.path}
                          alt={media.alt_text}
                          width={600}
                          height={600}
                          sizes="(max-width: 640px) 46vw, (max-width: 1000px) 30vw, 360px"
                          priority={i < 3}
                        />
                      ) : null}
                      <span className="shop-product-code">
                        {p.product_code}
                      </span>
                    </div>
                    <p className="shop-eyebrow">
                      {categories[p.category_slug]}
                    </p>
                    <h3>{p.title}</h3>
                    <p className="shop-price">{rupiah(p.base_price_amount)}</p>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <section className="shop-note">
        <p className="shop-eyebrow">KECIL BENDANYA, BESAR CERITANYA</p>
        <h2>
          Lebih banyak cara
          <br />
          untuk main lagi.
        </h2>
        <p>
          Karakter yang menemani waktu bermain,
          <br />
          kini ikut mengisi hari-hari kecil yang berarti.
        </p>
      </section>
    </main>
  );
}
