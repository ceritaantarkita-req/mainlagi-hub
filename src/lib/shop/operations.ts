import "server-only";
import {
  db,
  result,
  check,
  ShopError,
  cart,
  cartLines,
  hash,
  field,
  uuid,
  userId,
  orderCookie,
  order,
} from "./server";
import {
  biteship,
  biteshipRuntimeConfigured,
  couriers,
  pickup,
  snap,
  paymentStatus,
  mappedPayment,
  ProviderError,
} from "./providers";
import { validMidtransStatus } from "./protocol";
import type { Order, OrderItem, Quote } from "./types";
import {
  operationalCourierServiceAllowed,
  operationalPolicyBlockers,
} from "./operationalPolicy";
export async function rates(b: Record<string, unknown>) {
  if (operationalPolicyBlockers().length)
    throw new ShopError("Konfigurasi operasional Shop belum lengkap.", 503);
  const postal = field(b, "postalCode", 5);
  if (!/^\d{5}$/.test(postal)) throw new ShopError("Kode pos harus 5 angka.");
  const c = await cart(),
    client = await db();
  if (c.status !== "active") throw new ShopError("Keranjang telah diproses.");
  // Compare signatures before and after the provider request; checkout rechecks under locks.
  const signature = result(
    await client.rpc("shop_cart_signature", { p_cart: c.id }),
  );
  const lines = await cartLines(c.id);
  if (!lines.length) throw new ShopError("Keranjang kosong.");
  const items = lines.map(({ quantity, shop_variants: v }) => {
    const p = v.shop_products;
    if (
      !v.weight_grams ||
      !v.is_active ||
      p.status !== "active" ||
      !p.facts_verified ||
      !p.media_approved
    )
      throw new ShopError("Produk belum siap dikirim.");
    return {
      name: p.title,
      value: v.price_override_amount ?? p.base_price_amount,
      quantity,
      weight: v.weight_grams,
    };
  });
  const response = await biteship("/v1/rates", {
    origin_postal_code: pickup().origin_postal_code,
    destination_postal_code: Number(postal),
    couriers: couriers(),
    items,
  });
  if (
    signature !==
    result(await client.rpc("shop_cart_signature", { p_cart: c.id }))
  )
    throw new ShopError("Keranjang berubah. Hitung ulang ongkir.");
  const pricing = response.pricing as {
    courier_code: string;
    courier_service_code: string;
    courier_service_name: string;
    duration: string;
    price: number;
    service_type: string;
    shipping_type: string;
    available_collection_method: string[];
  }[];
  if (!Array.isArray(pricing))
    throw new ShopError("Ongkir tidak tersedia.", 502);
  const rows = pricing
    .filter(
      (p) =>
        p.shipping_type === "parcel" &&
        p.service_type !== "instant" &&
        p.available_collection_method?.includes("pickup") &&
        operationalCourierServiceAllowed(
          p.courier_code,
          p.courier_service_code,
        ) &&
        Number.isSafeInteger(p.price) &&
        p.price >= 0 &&
        couriers().split(",").includes(p.courier_code),
    )
    .map((p) => ({
      cart_id: c.id,
      cart_revision: c.revision,
      cart_signature: signature,
      destination_postal_code: postal,
      courier_code: p.courier_code,
      service_code: p.courier_service_code,
      service_name: p.courier_service_name,
      duration_text: p.duration,
      price_amount: p.price,
    }));
  if (!rows.length) return [];
  return result(
    await client
      .from("shop_shipping_quotes")
      .insert(rows)
      .select(
        "id,courier_code,service_code,service_name,duration_text,price_amount,expires_at",
      ),
  );
}
export async function checkout(b: Record<string, unknown>) {
  const c = await cart(),
    client = await db();
  const customer = {
    name: field(b, "name", 100),
    email: field(b, "email", 254),
    phone: field(b, "phone", 20),
  };
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
    !/^\+?[0-9]{9,15}$/.test(customer.phone)
  )
    throw new ShopError("Periksa email dan nomor telepon.");
  const address = {
    address: field(b, "address", 500),
    city: field(b, "city", 100),
    province: field(b, "province", 100),
    postalCode: field(b, "postalCode", 5),
  };
  if (!/^\d{5}$/.test(address.postalCode))
    throw new ShopError("Periksa kode pos.");
  const number = result(
    await client.rpc("shop_checkout", {
      p_cart: c.id,
      p_hash: hash(c.token),
      p_quote: uuid(b.quoteId),
      p_customer: customer,
      p_address: address,
      p_account: await userId(),
      p_order_hash: hash(c.token),
    }),
  ) as string;
  await orderCookie(number, c.token);
  return { number };
}
export async function payment(o: Order) {
  const client = await db();
  if (o.payment_status !== "pending" || Date.parse(o.expires_at) <= Date.now())
    throw new ShopError("Pesanan tidak menunggu pembayaran.");
  const old = result(
    await client
      .from("shop_payment_attempts")
      .select("redirect_url")
      .eq("order_id", o.id),
  );
  if (old[0]?.redirect_url) return { url: old[0].redirect_url };
  if (!result(await client.rpc("shop_claim_payment", { p_order: o.id })))
    throw new ShopError(
      "Pembayaran sedang disiapkan. Coba lagi sebentar.",
      409,
    );
  const items = result(
    await client.from("shop_order_items").select("*").eq("order_id", o.id),
  ) as OrderItem[];
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) throw new ShopError("Alamat situs belum dikonfigurasi.", 503);
  const response = await snap({
    transaction_details: {
      order_id: o.order_number,
      gross_amount: o.grand_total_amount,
    },
    credit_card: {
      secure: true,
    },
    item_details: [
      ...items.map((i) => ({
        id: i.sku_snapshot,
        name: i.title_snapshot.slice(0, 50),
        price: i.unit_price_amount,
        quantity: i.quantity,
      })),
      { id: "SHIPPING", name: "Ongkir", price: o.shipping_amount, quantity: 1 },
    ],
    customer_details: {
      first_name: o.customer.name,
      email: o.customer.email,
      phone: o.customer.phone,
    },
    callbacks: {
      finish: `${site.replace(/\/$/, "")}/shop/order/${o.order_number}`,
    },
    expiry: {
      unit: "minutes",
      duration: Math.max(
        1,
        Math.floor((Date.parse(o.expires_at) - Date.now()) / 60000),
      ),
    },
  });
  if (
    typeof response.token !== "string" ||
    typeof response.redirect_url !== "string"
  )
    throw new ShopError("Respons pembayaran tidak valid.", 502);
  const url = new URL(response.redirect_url);
  if (
    url.protocol !== "https:" ||
    !["app.midtrans.com", "app.sandbox.midtrans.com"].includes(url.hostname)
  )
    throw new ShopError("Alamat pembayaran tidak valid.", 502);
  check(
    await client
      .from("shop_payment_attempts")
      .update({ snap_token: response.token, redirect_url: url.href })
      .eq("order_id", o.id),
  );
  return { url: url.href };
}
export async function reconcile(number: string) {
  const c = await db();
  const o = result<{ id: string; grand_total_amount: number }>(
    await c
      .from("shop_orders")
      .select("id,grand_total_amount")
      .eq("order_number", number)
      .single(),
  );
  let p: Record<string, unknown>;
  try {
    p = await paymentStatus(number);
  } catch (e) {
    if (e instanceof ProviderError && String(e.code) === "404") {
      const pending = result<{ expires_at: string; payment_status: string }>(
        await c
          .from("shop_orders")
          .select("expires_at,payment_status")
          .eq("id", o.id)
          .single(),
      );
      if (
        pending.payment_status === "pending" &&
        Date.parse(pending.expires_at) + 120000 < Date.now()
      ) {
        check(
          await c.rpc("shop_apply_payment", {
            p_number: number,
            p_amount: o.grand_total_amount,
            p_status: "expired",
            p_event: `unpaid-expiry:${o.id}`,
            p_transaction: null,
          }),
        );
        return { status: "expired" };
      }
    }
    throw e;
  }

  if (!validMidtransStatus(p, number, o.grand_total_amount))
    throw new ShopError("Status pembayaran tidak cocok.", 502);
  const status = mappedPayment(p);
  check(
    await c.rpc("shop_apply_payment", {
      p_number: number,
      p_amount: o.grand_total_amount,
      p_status: status,
      p_event: hash(`${number}:${p.transaction_id}:${status}`),
      p_transaction: p.transaction_id,
    }),
  );
  return { status };
}
export async function applyShipment(o: Order, p: Record<string, unknown>) {
  if (
    p.reference_id !== o.order_number ||
    typeof p.id !== "string" ||
    typeof p.status !== "string"
  )
    throw new ShopError("Referensi pengiriman tidak cocok.", 502);
  const courier = p.courier as
    { waybill_id?: string; tracking_id?: string; link?: string } | undefined;
  const c = await db();
  check(
    await c.rpc("shop_apply_shipment", {
      p_order: o.id,
      p_provider: p.id,
      p_status: p.status,
      p_waybill: courier?.waybill_id ?? null,
      p_tracking: courier?.link?.startsWith("https://") ? courier.link : null,
    }),
  );
}
export async function ship(number: string, actor: string) {
  if (operationalPolicyBlockers().length)
    throw new ShopError("Konfigurasi operasional Shop belum lengkap.", 503);
  const o = await order(number, true),
    c = await db();
  if (
    !result(
      await c.rpc("shop_claim_shipment", { p_order: o.id, p_actor: actor }),
    )
  )
    throw new ShopError("Pengiriman sedang diproses atau sudah dibuat.", 409);
  const items = result(
    await c.from("shop_order_items").select("*").eq("order_id", o.id),
  ) as OrderItem[];
  const q = o.shipping_quote_snapshot as Quote;
  let p: Record<string, unknown>;
  try {
    p = await biteship("/v1/orders", {
      ...pickup(),
      reference_id: o.order_number,
      destination_contact_name: o.customer.name,
      destination_contact_phone: o.customer.phone,
      destination_contact_email: o.customer.email,
      destination_address: [
        o.address_snapshot.address,
        o.address_snapshot.city,
        o.address_snapshot.province,
      ].join(", "),
      destination_postal_code: Number(o.address_snapshot.postalCode),
      courier_company: q.courier_code,
      courier_type: q.service_code,
      origin_collection_method: "pickup",
      delivery_type: "now",
      items: items.map((i) => ({
        name: i.title_snapshot,
        sku: i.sku_snapshot,
        value: i.unit_price_amount,
        quantity: i.quantity,
        weight: i.weight_grams_snapshot,
      })),
    });
  } catch (e) {
    if (
      e instanceof ProviderError &&
      Number(e.code) === 40002060 &&
      typeof e.details.order_id === "string"
    ) {
      p = await biteship(
        `/v1/orders/${encodeURIComponent(e.details.order_id)}`,
      );
    } else throw e;
  }
  await applyShipment(o, p);
  return { ok: true };
}

type ReconciliationDueRow = {
  order_id: string;
  order_number: string;
  provider_id: string | null;
};

function reconciliationErrorLabel(error: unknown) {
  if (error instanceof ProviderError) return `provider:${String(error.code).slice(0, 80)}`;
  if (error instanceof ShopError) return `shop:${error.status}`;
  return "unexpected";
}

async function markReconciliation(
  orderId: string,
  kind: "payment" | "shipment",
  outcome: "ok" | "pending" | "error" | "blocked",
  error?: string,
) {
  const c = await db();
  check(
    await c.rpc("shop_reconciliation_mark", {
      p_order: orderId,
      p_kind: kind,
      p_outcome: outcome,
      p_error: error ?? null,
    }),
  );
}

export async function runReconciliationBatch() {
  const c = await db();
  const run = result<{ id: string }>(
    await c
      .from("shop_reconciliation_runs")
      .insert({ status: "running", details: {} })
      .select("id")
      .single(),
  );
  const summary = {
    status: "ok" as "ok" | "partial" | "blocked",
    expiredLocally: 0,
    payment: { scanned: 0, processed: 0, pending: 0, failed: 0 },
    shipment: {
      configured: biteshipRuntimeConfigured(),
      scanned: 0,
      processed: 0,
      failed: 0,
      blocked: 0,
    },
  };
  try {
    summary.expiredLocally = Number(
      result(
        await c.rpc("shop_expire_unattempted_orders", {
          p_limit: 50,
        }),
      ),
    );
    const paymentRows = result(
      await c.rpc("shop_reconciliation_due", {
        p_kind: "payment",
        p_limit: 50,
      }),
    ) as ReconciliationDueRow[];
    summary.payment.scanned = paymentRows.length;
    for (const row of paymentRows) {
      try {
        const state = await reconcile(row.order_number);
        const pending = state.status === "pending";
        await markReconciliation(
          row.order_id,
          "payment",
          pending ? "pending" : "ok",
        );
        if (pending) summary.payment.pending++;
        else summary.payment.processed++;
      } catch (error) {
        summary.payment.failed++;
        await markReconciliation(
          row.order_id,
          "payment",
          "error",
          reconciliationErrorLabel(error),
        );
      }
    }

    const shipmentRows = result(
      await c.rpc("shop_reconciliation_due", {
        p_kind: "shipment",
        p_limit: 25,
      }),
    ) as ReconciliationDueRow[];
    summary.shipment.scanned = shipmentRows.length;
    if (!summary.shipment.configured) {
      summary.shipment.blocked = shipmentRows.length;
    } else {
      for (const row of shipmentRows) {
        try {
          if (!row.provider_id) throw new ShopError("Pengiriman belum memiliki referensi.", 409);
          const remote = await biteship(
            `/v1/orders/${encodeURIComponent(row.provider_id)}`,
          );
          const local = await order(row.order_number, true);
          await applyShipment(local, remote);
          await markReconciliation(row.order_id, "shipment", "ok");
          summary.shipment.processed++;
        } catch (error) {
          summary.shipment.failed++;
          await markReconciliation(
            row.order_id,
            "shipment",
            "error",
            reconciliationErrorLabel(error),
          );
        }
      }
    }

    if (summary.shipment.blocked > 0) summary.status = "blocked";
    else if (summary.payment.failed > 0 || summary.shipment.failed > 0)
      summary.status = "partial";

    check(
      await c
        .from("shop_reconciliation_runs")
        .update({
          finished_at: new Date().toISOString(),
          status: summary.status,
          details: summary,
        })
        .eq("id", run.id),
    );
    return { runId: run.id, ...summary };
  } catch (error) {
    check(
      await c
        .from("shop_reconciliation_runs")
        .update({
          finished_at: new Date().toISOString(),
          status: "partial",
          details: {
            ...summary,
            status: "partial",
            fatal: reconciliationErrorLabel(error),
          },
        })
        .eq("id", run.id),
    );
    throw error;
  }
}

