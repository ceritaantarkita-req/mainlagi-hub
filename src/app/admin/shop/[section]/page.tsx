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
import { operationalPolicySafeSummary } from "@/lib/shop/operationalPolicy";
export const dynamic = "force-dynamic";
export default async function ShopAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    slug?: string;
    q?: string;
    page?: string;
    payment?: string;
    fulfillment?: string;
    status?: string;
    order?: string;
  }>;
}) {
  const gate = await requireOwner();
  if (!gate.ok) return <AdminGate title="Admin Shop" reason={gate.reason} />;
  const { section } = await params;
  if (
    !["products", "preview", "orders", "inventory", "reports", "settings"].includes(section)
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
  if (section === "settings") {
    const readiness = operationalPolicySafeSummary();
    const settingsDb = await db();
    const reconciliationRuns = result(
      await settingsDb
        .from("shop_reconciliation_runs")
        .select("id,started_at,finished_at,status,details")
        .order("started_at", { ascending: false })
        .limit(1),
    ) as {
      id: string;
      started_at: string;
      finished_at: string | null;
      status: string;
      details: Record<string, unknown>;
    }[];
    const latestRun = reconciliationRuns[0];
    return (
      <main className="shop-flow">
        <h1>Kesiapan operasional Shop</h1>
        <p>
          Halaman ini hanya menampilkan readiness. Nilai privat pickup/origin tetap
          disimpan di environment server dan tidak ditampilkan di browser.
        </p>
        <div className="shop-summary">
          <h2>Status</h2>
          <p>
            Contract: <strong>{readiness.status}</strong> · Version:{" "}
            {readiness.version}
          </p>
          <p>
            Origin environment:{" "}
            <strong>{readiness.environment.originReady ? "lengkap" : "belum lengkap"}</strong>
          </p>
          <p>
            Courier env:{" "}
            <strong>
              {readiness.environment.configuredCouriers.length
                ? readiness.environment.configuredCouriers.join(", ")
                : "belum dikonfigurasi"}
            </strong>
          </p>
        </div>
        <section className="shop-summary">
          <h2>Blocker sebelum sales dapat dibuka</h2>
          {readiness.blockers.length ? (
            <ul>
              {readiness.blockers.map((blocker) => (
                <li key={blocker.code}>
                  <strong>{blocker.code}</strong> — {blocker.message}
                </li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada blocker operasional.</p>
          )}
        </section>
        <section className="shop-summary">
          <h2>Policy owner-approved</h2>
          <ul>
            <li>
              Support: {readiness.ownerDecisions.support.channel} ·{" "}
              {readiness.ownerDecisions.support.contact} ·{" "}
              {readiness.ownerDecisions.support.hours}
            </li>
            <li>
              Courier:{" "}
              {readiness.ownerDecisions.courierAllowlist.couriers.join(", ")}
            </li>
            <li>
              Service:{" "}
              {readiness.ownerDecisions.courierAllowlist.services.join(", ")}
            </li>
            <li>
              Handling fee: Rp
              {readiness.ownerDecisions.packingHandling.handlingFeeAmount ?? 0}.
            </li>
            <li>
              Payment expiry: {readiness.ownerDecisions.paymentExpiry.minutes} menit.
            </li>
            <li>Customer notification otomatis v1: tidak ada.</li>
          </ul>
          <p>
            <Link href="/shop/policies">Lihat kebijakan customer-facing</Link>
          </p>
        </section>
        <section className="shop-summary">
          <h2>Reconciliation readiness</h2>
          <ul>
            <li>
              Cron secret deployment:{" "}
              <strong>{process.env.SHOP_CRON_SECRET ? "configured" : "belum dikonfigurasi"}</strong>
            </li>
            <li>
              Biteship API untuk shipment reconcile:{" "}
              <strong>{process.env.BITESHIP_API_KEY ? "configured" : "belum dikonfigurasi"}</strong>
            </li>
            <li>
              PII retention:{" "}
              <strong>
                {process.env.SHOP_ORDER_PII_RETENTION_DAYS
                  ? `${process.env.SHOP_ORDER_PII_RETENTION_DAYS} hari`
                  : "belum diputuskan / disabled"}
              </strong>
            </li>
            <li>
              Latest run:{" "}
              <strong>
                {latestRun
                  ? `${latestRun.status} · ${new Date(latestRun.started_at).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                    })}`
                  : "belum ada"}
              </strong>
            </li>
          </ul>
          <p>
            Scheduler repository tersedia, tetapi staging hanya dianggap aktif
            setelah GitHub secret <code>SHOP_STAGING_URL</code> dan{" "}
            <code>SHOP_CRON_SECRET</code> benar-benar dipasang.
          </p>
        </section>
        <section className="shop-summary">
          <h2>Behavior yang sudah ada di kode</h2>
          <ul>
            <li>
              Payment expiry:{" "}
              {readiness.currentImplementedBehavior.paymentExpiryMinutes} menit.
            </li>
            <li>
              Shipping quote expiry:{" "}
              {readiness.currentImplementedBehavior.shippingQuoteExpiryMinutes} menit.
            </li>
            <li>Collection: pickup.</li>
            <li>Shipping: parcel; instant tidak diizinkan.</li>
            <li>Partial refund: manual review.</li>
            <li>
              Guest order: original device cookie atau akun asal yang membuat order.
            </li>
            <li>Outbound email/WhatsApp notification belum diimplementasikan.</li>
          </ul>
        </section>
        <p>
          Policy owner sudah disetujui. Blocker yang tersisa di halaman ini adalah
          konfigurasi deployment yang memang belum tersedia; jangan isi nilai
          perkiraan hanya untuk menghilangkan blocker.
        </p>
      </main>
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
        <div>
          <Link className="shop-button" href="/admin/shop/preview">
            Tinjau visual Shop
          </Link>{" "}
          <Link className="shop-button shop-button-secondary" href="/admin/shop/settings">
            Kesiapan operasional
          </Link>
        </div>
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
    const query = await searchParams;
    const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
    const pageSize = 25;
    const list = result(
      await c.rpc("shop_admin_orders", {
        p_search: query.q?.trim() || null,
        p_payment: query.payment || null,
        p_fulfillment: query.fulfillment || null,
        p_status: query.status || null,
        p_page: page,
        p_page_size: pageSize,
      }),
    ) as {
      page: number;
      pageSize: number;
      total: number;
      items: (Order & {
        shipment?: {
          status?: string;
          waybillId?: string | null;
          trackingUrl?: string | null;
        } | null;
      })[];
    };
    const totalPages = Math.max(1, Math.ceil(list.total / list.pageSize));
    const selected = query.order
      ? (result(
          await c.rpc("shop_admin_order_detail", { p_number: query.order }),
        ) as {
          order: {
            id: string;
            number: string;
            payment: string;
            fulfillment: string;
            status: string;
          };
          items: {
            title: string;
            sku: string;
            quantity: number;
            lineTotal: number;
          }[];
          shipment: {
            providerOrderId?: string | null;
            status?: string;
            waybillId?: string | null;
            trackingUrl?: string | null;
          } | null;
          reconciliation: {
            kind: string;
            attempts: number;
            status: string;
            lastAttemptAt?: string | null;
            nextAttemptAt?: string | null;
            lastError?: string | null;
          }[];
          timeline: {
            at: string;
            source: string;
            type: string;
            payload?: Record<string, unknown>;
          }[];
        })
      : null;

    const hrefFor = (targetPage: number, orderNumber?: string) => {
      const params = new URLSearchParams();
      if (query.q) params.set("q", query.q);
      if (query.payment) params.set("payment", query.payment);
      if (query.fulfillment) params.set("fulfillment", query.fulfillment);
      if (query.status) params.set("status", query.status);
      if (targetPage > 1) params.set("page", String(targetPage));
      if (orderNumber) params.set("order", orderNumber);
      const suffix = params.toString();
      return `/admin/shop/orders${suffix ? `?${suffix}` : ""}`;
    };

    return (
      <main className="shop-flow">
        <h1>Pesanan</h1>
        <p>
          Cari berdasarkan nomor order, customer, email/telepon atau alamat.
          Semua tindakan manual memerlukan owner auth dan alasan yang masuk audit log.
        </p>
        <form className="shop-form">
          <label>
            Cari
            <input name="q" defaultValue={query.q ?? ""} placeholder="Order / customer / alamat" />
          </label>
          <label>
            Payment
            <select name="payment" defaultValue={query.payment ?? ""}>
              <option value="">Semua</option>
              {["pending","paid","failed","expired","cancelled","refunded"].map((value) => (
                <option value={value} key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Fulfillment
            <select name="fulfillment" defaultValue={query.fulfillment ?? ""}>
              <option value="">Semua</option>
              {["unfulfilled","ready_to_ship","shipment_created","in_transit","delivered","exception","attention_required","cancelled"].map((value) => (
                <option value={value} key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Order status
            <select name="status" defaultValue={query.status ?? ""}>
              <option value="">Semua</option>
              {["pending_payment","processing","completed","cancelled","expired","attention_required","refunded"].map((value) => (
                <option value={value} key={value}>{value}</option>
              ))}
            </select>
          </label>
          <button className="shop-button">Filter</button>
        </form>

        <p>
          {list.total} pesanan · halaman {list.page} dari {totalPages}.
        </p>

        {selected ? (
          <section className="shop-summary">
            <h2>Timeline {selected.order.number}</h2>
            <p>
              {selected.order.payment} · {selected.order.fulfillment} · {selected.order.status}
            </p>
            {selected.shipment ? (
              <p>
                Shipment: {selected.shipment.status ?? "—"} · AWB{" "}
                {selected.shipment.waybillId ?? "—"} · Provider{" "}
                {selected.shipment.providerOrderId ?? "—"}
              </p>
            ) : (
              <p>Shipment belum dibuat.</p>
            )}
            <h3>Item</h3>
            <ul>
              {selected.items.map((item) => (
                <li key={item.sku}>
                  {item.title} · {item.sku} · {item.quantity} ×{" "}
                  {rupiah(item.lineTotal / item.quantity)}
                </li>
              ))}
            </ul>
            <h3>Reconciliation</h3>
            {selected.reconciliation.length ? (
              <ul>
                {selected.reconciliation.map((state) => (
                  <li key={state.kind}>
                    {state.kind}: {state.status} · attempt {state.attempts}
                    {state.lastError ? ` · ${state.lastError}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Belum ada reconciliation state.</p>
            )}
            <h3>Timeline provider/audit</h3>
            {selected.timeline.length ? (
              <ul>
                {selected.timeline.map((event, index) => (
                  <li key={`${event.at}-${event.type}-${index}`}>
                    {new Date(event.at).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                    })}{" "}
                    · {event.source} · {event.type}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Belum ada event.</p>
            )}
            <Link href={hrefFor(page)}>Tutup detail</Link>
          </section>
        ) : null}

        {list.items.length ? (
          list.items.map((o) => (
            <article className="shop-summary" style={{ marginBottom: 20 }} key={o.id}>
              <h2>{o.order_number}</h2>
              <p>{o.customer.name} · {o.customer.phone} · {o.customer.email}</p>
              <p>
                {o.address_snapshot.address}, {o.address_snapshot.city},{" "}
                {o.address_snapshot.postalCode}
              </p>
              <p>
                {rupiah(o.grand_total_amount)} · {o.payment_status} ·{" "}
                {o.fulfillment_status} · {o.order_status}
              </p>
              {o.shipment ? (
                <p>
                  Shipment: {o.shipment.status ?? "—"} · AWB {o.shipment.waybillId ?? "—"}
                </p>
              ) : null}
              <p>
                <Link href={hrefFor(page, o.order_number)}>Lihat timeline/detail</Link>
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
                canAcceptLatePayment={
                  o.payment_status === "paid" &&
                  o.order_status === "attention_required" &&
                  o.fulfillment_status === "attention_required"
                }
                canRestockRefund={
                  o.payment_status === "refunded" &&
                  o.order_status === "refunded" &&
                  o.fulfillment_status === "attention_required"
                }
              />
            </article>
          ))
        ) : (
          <p>Tidak ada pesanan sesuai filter.</p>
        )}

        <nav aria-label="Pagination pesanan" style={{ display: "flex", gap: 12 }}>
          {page > 1 ? <Link href={hrefFor(page - 1)}>← Sebelumnya</Link> : null}
          {page < totalPages ? <Link href={hrefFor(page + 1)}>Berikutnya →</Link> : null}
        </nav>
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
  const reportResponse = await c.rpc("shop_report_v2", {
    p_from: start.toISOString(),
    p_to: end.toISOString(),
  });
  if (reportResponse.error || !reportResponse.data)
    return (
      <main className="shop-flow">
        <h1>Laporan Shop</h1>
        <p role="alert">
          Laporan sedang tidak tersedia. Nilai nol tidak ditampilkan karena query
          gagal.
        </p>
      </main>
    );
  const report = reportResponse.data as {
    summary: Record<string, number | string>;
    products: {
      product_code: string;
      title: string;
      gross_units: number;
      retained_units: number;
      refunded_units: number;
      manual_review_units: number;
      retained_merchandise: number;
    }[];
    variants: {
      sku: string;
      title: string;
      gross_units: number;
      retained_units: number;
      refunded_units: number;
      manual_review_units: number;
    }[];
    inventory: {
      productCode: string;
      sku: string;
      title: string;
      onHand: number;
      reserved: number;
      available: number;
    }[];
  };
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
        Asia/Jakarta · Berdasarkan pembayaran pertama yang terverifikasi.
        Full refund tetap tercatat pada cohort pembayaran asal. Partial refund
        tetap excluded dan harus direkonsiliasi manual.
      </p>
      <div className="shop-grid">
        {[
          ["settledOrders", "Order pernah settle", true],
          ["paidOrders", "Order paid aktif", true],
          ["manualReviewOrders", "Payment review (excluded)", true],
          ["merchandise", "Penjualan produk retained", false],
          ["shipping", "Ongkir retained", false],
          ["collected", "Pembayaran retained", false],
          ["grossCollected", "Gross pernah terkumpul", false],
          ["refundedOrders", "Full refund", true],
          ["refundedGross", "Nominal full refund", false],
          ["attention", "Perlu pemeriksaan", true],
        ].map(([key, label, count]) => (
          <article className="shop-summary" key={String(key)}>
            <h2>{String(label)}</h2>
            <strong>
              {count
                ? report.summary[String(key)]
                : rupiah(Number(report.summary[String(key)] ?? 0))}
            </strong>
          </article>
        ))}
      </div>

      <section className="shop-summary">
        <h2>Penjualan per produk</h2>
        {report.products.length ? (
          <ul>
            {report.products.map((row) => (
              <li key={row.product_code}>
                {row.product_code} · {row.title} · gross {row.gross_units} unit ·
                retained {row.retained_units} · refunded {row.refunded_units} ·
                review {row.manual_review_units} ·{" "}
                {rupiah(row.retained_merchandise)}
              </li>
            ))}
          </ul>
        ) : (
          <p>Tidak ada transaksi settle pada periode ini.</p>
        )}
      </section>

      <section className="shop-summary">
        <h2>Penjualan per varian</h2>
        {report.variants.length ? (
          <ul>
            {report.variants.map((row) => (
              <li key={row.sku}>
                {row.sku} · {row.title} · gross {row.gross_units} · retained{" "}
                {row.retained_units} · refunded {row.refunded_units} · review{" "}
                {row.manual_review_units}
              </li>
            ))}
          </ul>
        ) : (
          <p>Tidak ada transaksi varian pada periode ini.</p>
        )}
      </section>

      <section className="shop-summary">
        <h2>Snapshot inventory</h2>
        <ul>
          {report.inventory.map((row) => (
            <li key={row.sku}>
              {row.productCode} · {row.sku} · fisik {row.onHand} · reservasi{" "}
              {row.reserved} · tersedia {row.available}
            </li>
          ))}
        </ul>
      </section>

      <p>
        Ini bukan laporan laba. Biaya gateway, biaya aktual pengiriman, settlement
        export dan partial refund belum dihitung sebagai accounting ledger.
      </p>
    </main>
  );
}
