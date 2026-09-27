import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/auth/requireOwner";
import { AdminGate } from "@/components/admin/AdminGate";
import {
  AdminOrderActions,
  InventoryAdjust,
} from "@/components/shop/AdminActions";
import { ProductAdminEditor } from "@/components/shop/ProductAdminEditor";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { previewProducts } from "@/lib/shop/catalog";
import { db, result } from "@/lib/shop/server";
import { rupiah, type Product, type Order } from "@/lib/shop/types";
export const dynamic = "force-dynamic";
export default async function ShopAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ from?: string; to?: string; slug?: string }>;
}) {
  const gate = await requireOwner();
  if (!gate.ok) return <AdminGate title="Admin Shop" reason={gate.reason} />;
  const { section } = await params;
  if (
    !["products", "preview", "orders", "inventory", "reports"].includes(section)
  )
    notFound();
  if (section === "preview") {
    const slug = (await searchParams).slug;
    if (slug) {
      const product = previewProducts().find((p) => p.slug === slug);
      if (!product) notFound();
      return <ProductDetail product={product} enabled={false} />;
    }
    return (
      <ShopCatalog
        products={previewProducts()}
        preview
        detailBase="/admin/shop/preview?slug="
      />
    );
  }
  const c = await db();
  if (section === "products") {
    const products = result(
      await c
        .from("shop_products")
        .select("*,shop_variants(*,shop_inventory_balances(on_hand,reserved)),shop_product_media(*)")
        .order("product_code"),
    ) as unknown as Product[];
    return (
      <main className="shop-flow">
        <h1>Produk Shop</h1>
        <p>
          Isi hanya data fisik yang sudah diverifikasi. Produk tidak dapat aktif
          sampai readiness database lolos, sudah melalui review, dan mendapat
          approval owner.
        </p>
        <p>
          Total stok awal setiap SKU dikunci sesuai data owner. Untuk apparel,
          bagi stok tersebut ke ukuran nyata—jangan menggandakan total ke setiap
          ukuran.
        </p>
        <Link className="shop-button" href="/admin/shop/preview">
          Tinjau visual Shop
        </Link>
        <div className="shop-flow">
          {products.map((p) => (
            <ProductAdminEditor key={p.id} product={p} />
          ))}
        </div>
      </main>
    );
  }
  if (section === "inventory") {
    const rows = result(
      await c
        .from("shop_inventory_balances")
        .select("variant_id,on_hand,reserved,shop_variants(sku,title)")
        .order("variant_id"),
    ) as unknown as {
      variant_id: string;
      on_hand: number;
      reserved: number;
      shop_variants: { sku: string; title: string };
    }[];
    return (
      <main className="shop-flow">
        <h1>Inventory</h1>
        <p>
          Penyesuaian dicatat pada ledger. Stok yang sedang dipesan tidak dapat
          diambil oleh penyesuaian.
        </p>
        {rows.map((r) => (
          <details
            key={r.variant_id}
            className="shop-cart-line"
            style={{ display: "block" }}
          >
            <summary>
              {r.shop_variants.sku} · Fisik {r.on_hand} · Reservasi {r.reserved}{" "}
              · Tersedia {r.on_hand - r.reserved}
            </summary>
            <InventoryAdjust variantId={r.variant_id} />
          </details>
        ))}
      </main>
    );
  }
  if (section === "orders") {
    const orders = result(
      await c
        .from("shop_orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
    ) as Order[];
    return (
      <main className="shop-flow">
        <h1>Pesanan</h1>
        <p>
          100 pesanan terbaru. Pesan kurir hanya setelah pembayaran
          terverifikasi dan barang selesai dikemas.
        </p>
        {orders.length ? (
          orders.map((o) => (
            <article
              className="shop-summary"
              style={{ marginBottom: 20 }}
              key={o.id}
            >
              <h2>{o.order_number}</h2>
              <p>
                {o.customer.name} · {o.customer.phone}
              </p>
              <p>
                {o.address_snapshot.address}, {o.address_snapshot.city},{" "}
                {o.address_snapshot.postalCode}
              </p>
              <p>
                {rupiah(o.grand_total_amount)} · {o.payment_status} ·{" "}
                {o.fulfillment_status} · {o.order_status}
              </p>
              <AdminOrderActions
                number={o.order_number}
                canPack={
                  o.payment_status === "paid" &&
                  o.order_status === "processing" &&
                  o.fulfillment_status === "unfulfilled"
                }
                packed={
                  o.payment_status === "paid" &&
                  o.order_status === "processing" &&
                  o.fulfillment_status === "ready_to_ship"
                }
              />
            </article>
          ))
        ) : (
          <p>Belum ada pesanan.</p>
        )}
      </main>
    );
  }
  const query = await searchParams,
    today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  const from = query.from ?? `${today.slice(0, 7)}-01`,
    to = query.to ?? today;
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(to) ||
    from > to
  )
    throw new Error("Rentang tanggal tidak valid.");
  const start = new Date(`${from}T00:00:00+07:00`),
    end = new Date(new Date(`${to}T00:00:00+07:00`).getTime() + 86400000);
  const report = result(
    await c.rpc("shop_report", {
      p_from: start.toISOString(),
      p_to: end.toISOString(),
    }),
  ) as Record<string, number>;
  return (
    <main className="shop-flow">
      <h1>Laporan Shop</h1>
      <form className="shop-form">
        <label>
          Dari
          <input name="from" type="date" defaultValue={from} />
        </label>
        <label>
          Sampai
          <input name="to" type="date" defaultValue={to} />
        </label>
        <button className="shop-button">Terapkan</button>
      </form>
      <p>
        Asia/Jakarta · Berdasarkan tanggal pembayaran. Pesanan pending tidak
        masuk omzet. Refund ditampilkan menurut periode pembayaran asal.
      </p>
      <div className="shop-grid">
        {[
          ["paidOrders", "Pesanan dibayar"],
          ["merchandise", "Penjualan produk"],
          ["shipping", "Ongkir terkumpul"],
          ["collected", "Total pembayaran"],
          ["refundedOrders", "Pesanan refund"],
          ["refundedGross", "Total refund penuh"],
          ["attention", "Perlu pemeriksaan"],
        ].map(([key, label]) => (
          <article className="shop-summary" key={key}>
            <h2>{label}</h2>
            <strong>
              {["paidOrders", "refundedOrders", "attention"].includes(key)
                ? report[key]
                : rupiah(report[key])}
            </strong>
          </article>
        ))}
      </div>
      <p>
        Ini bukan laporan laba. Biaya gateway, biaya aktual pengiriman, serta
        refund parsial memerlukan rekonsiliasi terpisah.
      </p>
    </main>
  );
}
