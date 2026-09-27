"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { categories, rupiah, type Product, type Variant } from "@/lib/shop/types";
import { shopRequest } from "./client";

type EditableVariant = {
  key: string;
  sku: string;
  title: string;
  optionValues: Record<string, string>;
  onHand: string;
  reserved: number;
  priceOverride: string;
  weightGrams: string;
  lengthMm: string;
  widthMm: string;
  heightMm: string;
  isActive: boolean;
};

const factText = (facts: Record<string, unknown>, key: string) =>
  typeof facts[key] === "string" ? String(facts[key]) : "";

function balance(v: Variant) {
  const raw = v.shop_inventory_balances;
  if (Array.isArray(raw)) return raw[0] ?? { on_hand: 0, reserved: 0 };
  return raw ?? { on_hand: 0, reserved: 0 };
}

function editable(v: Variant): EditableVariant {
  const b = balance(v);
  return {
    key: v.id,
    sku: v.sku,
    title: v.title,
    optionValues: { ...v.option_values },
    onHand: String(b.on_hand),
    reserved: b.reserved,
    priceOverride:
      v.price_override_amount === null ? "" : String(v.price_override_amount),
    weightGrams: v.weight_grams === null ? "" : String(v.weight_grams),
    lengthMm: v.length_mm == null ? "" : String(v.length_mm),
    widthMm: v.width_mm == null ? "" : String(v.width_mm),
    heightMm: v.height_mm == null ? "" : String(v.height_mm),
    isActive: v.is_active,
  };
}

const lifecycleLabel: Record<string, string> = {
  draft: "Draft",
  ready_for_review: "Siap ditinjau",
  approved: "Disetujui",
};

function localBlockers(
  product: Product,
  facts: Record<string, unknown>,
  variants: EditableVariant[],
  mediaStatus: Record<string, string>,
) {
  const blockers: string[] = [];
  const active = variants.filter((v) => v.isActive);
  const approvedMedia = product.shop_product_media.filter(
    (m) => (mediaStatus[m.id ?? m.path] ?? m.approval_status) === "approved",
  );
  if (approvedMedia.length < 2)
    blockers.push("Minimal dua visual produk harus approved.");
  if (
    !approvedMedia.some((m) => (m.role ?? (m.sort_order === 0 ? "hero" : "")) === "hero")
  )
    blockers.push("Visual hero harus approved.");
  if (!active.length) blockers.push("Minimal satu varian aktif diperlukan.");
  if (active.some((v) => !/^\d+$/.test(v.weightGrams) || Number(v.weightGrams) <= 0))
    blockers.push("Semua varian aktif perlu berat kirim terukur.");
  if (["001", "002", "003", "004", "005"].includes(product.product_code)) {
    if (active.some((v) => !(v.optionValues.size ?? "").trim()))
      blockers.push("Semua varian apparel perlu ukuran terverifikasi.");
    if (factText(facts, "sizeChart").trim().length < 3)
      blockers.push("Size chart / catatan pengukuran belum diisi.");
  }
  if (product.product_code === "006") {
    if (!factText(facts, "capacity").trim())
      blockers.push("Kapasitas tumbler belum diverifikasi.");
    if (factText(facts, "material").trim().length < 2)
      blockers.push("Material tumbler belum diverifikasi.");
  }
  if (product.product_code === "007") {
    const type = factText(facts, "productType").trim();
    if (!type) blockers.push("Jenis kartu sebenarnya belum dipilih.");
    if (type === "e_money") {
      for (const [key, label] of [
        ["issuer", "Issuer"],
        ["network", "Network/teknologi"],
        ["activation", "Aktivasi/provisioning"],
        ["topUp", "Top-up/balance"],
        ["authorization", "Dasar izin/co-brand"],
      ] as const)
        if (factText(facts, key).trim().length < 2)
          blockers.push(`${label} kartu belum diverifikasi.`);
      if (facts.tapVerified !== true)
        blockers.push("Fungsi tap/use belum diverifikasi.");
    }
  }
  const stock = variants.reduce((n, v) => n + (Number(v.onHand) || 0), 0);
  if (stock !== product.initial_stock_total)
    blockers.push(
      `Total stok varian harus ${product.initial_stock_total}; saat ini ${stock}.`,
    );
  return blockers;
}

export function ProductAdminEditor({ product }: { product: Product }) {
  const router = useRouter();
  const [facts, setFacts] = useState<Record<string, unknown>>({
    ...product.facts,
  });
  const [variants, setVariants] = useState<EditableVariant[]>(
    product.shop_variants.map(editable),
  );
  const [mediaStatus, setMediaStatus] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const blockers = useMemo(
    () => localBlockers(product, facts, variants, mediaStatus),
    [product, facts, variants, mediaStatus],
  );

  const updateFact = (key: string, value: unknown) =>
    setFacts((old) => ({ ...old, [key]: value }));

  async function saveProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      await shopRequest("admin/product", {
        productId: product.id,
        title: data.get("title"),
        description: data.get("description"),
        category: data.get("category"),
        basePrice: Number(data.get("basePrice")),
        facts,
      });
      setMessage("Data produk disimpan. Review kembali sebelum aktivasi.");
      router.refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function saveVariants() {
    if (
      !window.confirm(
        "Simpan susunan varian dan alokasi stok ini? Untuk produk pra-penjualan, susunan varian lama akan diganti secara atomik.",
      )
    )
      return;
    setBusy(true);
    setMessage("");
    try {
      await shopRequest("admin/variants", {
        productId: product.id,
        variants: variants.map((v) => ({
          sku: v.sku,
          title: v.title,
          optionValues: v.optionValues,
          onHand: Number(v.onHand),
          priceOverride: v.priceOverride ? Number(v.priceOverride) : null,
          weightGrams: v.weightGrams ? Number(v.weightGrams) : null,
          lengthMm: v.lengthMm ? Number(v.lengthMm) : null,
          widthMm: v.widthMm ? Number(v.widthMm) : null,
          heightMm: v.heightMm ? Number(v.heightMm) : null,
          isActive: v.isActive,
        })),
      });
      setMessage("Varian dan alokasi stok disimpan.");
      router.refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function saveMedia(mediaId: string, status: string) {
    setBusy(true);
    setMessage("");
    try {
      await shopRequest("admin/media", {
        mediaId,
        status,
      });
      setMessage("Status visual diperbarui.");
      router.refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function transition(
    action: "ready" | "approve" | "activate" | "deactivate" | "draft",
  ) {
    if (
      ["approve", "activate", "deactivate"].includes(action) &&
      !window.confirm(
        action === "activate"
          ? "Aktifkan produk ini ke katalog publik? Database akan menolak jika masih ada blocker."
          : action === "approve"
            ? "Setujui fakta dan konfigurasi produk ini?"
            : "Nonaktifkan produk ini dari katalog publik?",
      )
    )
      return;
    setBusy(true);
    setMessage("");
    try {
      await shopRequest("admin/product-state", {
        productId: product.id,
        action,
      });
      setMessage("Status produk diperbarui.");
      router.refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function patchVariant(key: string, patch: Partial<EditableVariant>) {
    setVariants((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  function addVariant() {
    const index = variants.length + 1;
    setVariants((rows) => [
      ...rows,
      {
        key: `new-${Date.now()}-${index}`,
        sku: `${product.product_code}-NEW-${index}`,
        title: "Varian baru",
        optionValues: {},
        onHand: "0",
        reserved: 0,
        priceOverride: "",
        weightGrams: "",
        lengthMm: "",
        widthMm: "",
        heightMm: "",
        isActive: true,
      },
    ]);
  }

  return (
    <details className="shop-summary">
      <summary>
        <strong>
          {product.product_code} · {product.title}
        </strong>{" "}
        · {rupiah(product.base_price_amount)} · {product.status} ·{" "}
        {lifecycleLabel[product.review_status] ?? product.review_status}
      </summary>

      <div className="shop-flow" style={{ marginTop: 18 }}>
        <section>
          <h3>Readiness</h3>
          {blockers.length ? (
            <ul>
              {blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          ) : (
            <p>Data yang terlihat di form sudah lengkap untuk diajukan review.</p>
          )}
          <p>
            Database tetap menjadi validator final. UI ini tidak dapat memaksa
            produk incomplete menjadi aktif.
          </p>
        </section>

        <form className="shop-form" onSubmit={saveProduct}>
          <h3>Data produk</h3>
          <label>
            Judul
            <input name="title" defaultValue={product.title} required maxLength={160} disabled={busy} />
          </label>
          <label>
            Deskripsi
            <textarea name="description" defaultValue={product.description} required maxLength={1200} disabled={busy} />
          </label>
          <label>
            Kategori
            <select name="category" defaultValue={product.category_slug} disabled={busy}>
              {Object.entries(categories).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Harga dasar
            <input name="basePrice" type="number" min={1} step={1} defaultValue={product.base_price_amount} required disabled={busy} />
          </label>

          {["001", "002", "003", "004", "005"].includes(product.product_code) ? (
            <>
              <label>
                Size chart / catatan pengukuran terverifikasi
                <textarea
                  value={factText(facts, "sizeChart")}
                  onChange={(e) => updateFact("sizeChart", e.target.value)}
                  placeholder="Isi setelah ukuran fisik diverifikasi"
                  disabled={busy}
                />
              </label>
              <label>
                Material/fabric (opsional jika tidak dipublikasikan)
                <input
                  value={factText(facts, "material")}
                  onChange={(e) => updateFact("material", e.target.value)}
                  disabled={busy}
                />
              </label>
            </>
          ) : null}

          {product.product_code === "006" ? (
            <>
              <label>
                Kapasitas tumbler
                <input
                  value={factText(facts, "capacity")}
                  onChange={(e) => updateFact("capacity", e.target.value)}
                  placeholder="Contoh hanya setelah diukur"
                  disabled={busy}
                />
              </label>
              <label>
                Material tumbler
                <input
                  value={factText(facts, "material")}
                  onChange={(e) => updateFact("material", e.target.value)}
                  disabled={busy}
                />
              </label>
              <label>
                Safety/certification claim (opsional, hanya jika ada bukti)
                <input
                  value={factText(facts, "safetyClaim")}
                  onChange={(e) => updateFact("safetyClaim", e.target.value)}
                  disabled={busy}
                />
              </label>
            </>
          ) : null}

          {product.product_code === "007" ? (
            <>
              <label>
                Jenis produk kartu
                <select
                  value={factText(facts, "productType")}
                  onChange={(e) => updateFact("productType", e.target.value)}
                  disabled={busy}
                >
                  <option value="">Belum diverifikasi</option>
                  <option value="e_money">E-money / stored-value card</option>
                  <option value="custom_card">Custom/co-brand non e-money</option>
                  <option value="card_skin">Card skin/accessory</option>
                  <option value="other">Lainnya</option>
                </select>
              </label>
              {factText(facts, "productType") === "e_money" ? (
                <>
                  {[
                    ["issuer", "Issuer"],
                    ["network", "Network / teknologi"],
                    ["activation", "Aktivasi / provisioning"],
                    ["topUp", "Top-up / balance behavior"],
                    ["authorization", "Dasar izin / co-brand"],
                  ].map(([key, label]) => (
                    <label key={key}>
                      {label}
                      <input
                        value={factText(facts, key)}
                        onChange={(e) => updateFact(key, e.target.value)}
                        disabled={busy}
                      />
                    </label>
                  ))}
                  <label>
                    <input
                      type="checkbox"
                      checked={facts.tapVerified === true}
                      onChange={(e) => updateFact("tapVerified", e.target.checked)}
                      disabled={busy}
                    />{" "}
                    Fungsi tap/use sudah diverifikasi nyata
                  </label>
                </>
              ) : null}
            </>
          ) : null}

          <button className="shop-button" disabled={busy}>
            Simpan data produk
          </button>
        </form>

        <section>
          <h3>Varian & stok awal</h3>
          <p>
            Target stok awal SKU ini: <strong>{product.initial_stock_total}</strong>.
            Total semua baris wajib tetap sama. Setelah ada histori transaksi,
            replacement varian akan ditolak.
          </p>
          {variants.map((v, index) => (
            <div className="shop-cart-line" key={v.key}>
              <label>
                SKU
                <input value={v.sku} onChange={(e) => patchVariant(v.key, { sku: e.target.value })} disabled={busy} />
              </label>
              <label>
                Nama varian
                <input value={v.title} onChange={(e) => patchVariant(v.key, { title: e.target.value })} disabled={busy} />
              </label>
              {["001", "002", "003", "004", "005"].includes(product.product_code) ? (
                <label>
                  Ukuran
                  <input
                    value={v.optionValues.size ?? ""}
                    onChange={(e) =>
                      patchVariant(v.key, {
                        optionValues: { ...v.optionValues, size: e.target.value },
                      })
                    }
                    placeholder={product.product_code === "004" ? "Contoh: One Size jika benar" : "Isi ukuran terverifikasi"}
                    disabled={busy}
                  />
                </label>
              ) : null}
              <label>
                Stok fisik
                <input type="number" min={0} step={1} value={v.onHand} onChange={(e) => patchVariant(v.key, { onHand: e.target.value })} disabled={busy} />
              </label>
              <p>Reservasi saat ini: {v.reserved}</p>
              <label>
                Berat kirim (gram)
                <input type="number" min={1} step={1} value={v.weightGrams} onChange={(e) => patchVariant(v.key, { weightGrams: e.target.value })} disabled={busy} />
              </label>
              <label>
                Harga override (opsional)
                <input type="number" min={1} step={1} value={v.priceOverride} onChange={(e) => patchVariant(v.key, { priceOverride: e.target.value })} disabled={busy} />
              </label>
              <div className="shop-form">
                <label>
                  Panjang paket mm (opsional)
                  <input type="number" min={1} step={1} value={v.lengthMm} onChange={(e) => patchVariant(v.key, { lengthMm: e.target.value })} disabled={busy} />
                </label>
                <label>
                  Lebar paket mm (opsional)
                  <input type="number" min={1} step={1} value={v.widthMm} onChange={(e) => patchVariant(v.key, { widthMm: e.target.value })} disabled={busy} />
                </label>
                <label>
                  Tinggi paket mm (opsional)
                  <input type="number" min={1} step={1} value={v.heightMm} onChange={(e) => patchVariant(v.key, { heightMm: e.target.value })} disabled={busy} />
                </label>
              </div>
              <label>
                <input type="checkbox" checked={v.isActive} onChange={(e) => patchVariant(v.key, { isActive: e.target.checked })} disabled={busy} />{" "}
                Varian sellable
              </label>
              {variants.length > 1 ? (
                <button
                  type="button"
                  className="shop-button shop-button-secondary"
                  onClick={() => setVariants((rows) => rows.filter((_, i) => i !== index))}
                  disabled={busy}
                >
                  Hapus baris
                </button>
              ) : null}
            </div>
          ))}
          <div>
            <button type="button" className="shop-button shop-button-secondary" onClick={addVariant} disabled={busy}>
              Tambah varian
            </button>{" "}
            <button type="button" className="shop-button" onClick={saveVariants} disabled={busy}>
              Simpan varian & alokasi stok
            </button>
          </div>
        </section>

        <section>
          <h3>Visual</h3>
          {product.shop_product_media
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((m) => {
              const key = m.id ?? m.path;
              const value = mediaStatus[key] ?? m.approval_status;
              return (
                <div className="shop-cart-line" key={key}>
                  <Image src={m.path} alt={m.alt_text} width={160} height={160} />
                  <p>{m.role ?? "media"} · {m.path}</p>
                  <label>
                    Status visual
                    <select
                      value={value}
                      onChange={(e) =>
                        setMediaStatus((old) => ({ ...old, [key]: e.target.value }))
                      }
                      disabled={busy || !m.id}
                    >
                      <option value="approved">Approved</option>
                      <option value="review">Review</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="shop-button shop-button-secondary"
                    disabled={busy || !m.id}
                    onClick={() => m.id && saveMedia(m.id, value)}
                  >
                    Simpan status visual
                  </button>
                </div>
              );
            })}
        </section>

        <section>
          <h3>Lifecycle</h3>
          <p>
            Review: {lifecycleLabel[product.review_status] ?? product.review_status} ·
            Public: {product.status} · Fakta: {product.facts_verified ? "verified" : "belum verified"} ·
            Media: {product.media_approved ? "approved" : "belum approved"}
          </p>
          <div>
            <button type="button" className="shop-button shop-button-secondary" disabled={busy || product.status === "active"} onClick={() => transition("ready")}>
              Ajukan review
            </button>{" "}
            <button type="button" className="shop-button shop-button-secondary" disabled={busy || product.review_status !== "ready_for_review"} onClick={() => transition("approve")}>
              Approve
            </button>{" "}
            <button type="button" className="shop-button" disabled={busy || product.review_status !== "approved" || product.status === "active"} onClick={() => transition("activate")}>
              Aktifkan
            </button>{" "}
            {product.status === "active" ? (
              <button type="button" className="shop-button shop-button-secondary" disabled={busy} onClick={() => transition("deactivate")}>
                Nonaktifkan
              </button>
            ) : null}
            {product.review_status !== "draft" && product.status !== "active" ? (
              <>
                {" "}
                <button type="button" className="shop-button shop-button-secondary" disabled={busy} onClick={() => transition("draft")}>
                  Kembali ke Draft
                </button>
              </>
            ) : null}
          </div>
        </section>
        <p role="status">{message}</p>
      </div>
    </details>
  );
}
