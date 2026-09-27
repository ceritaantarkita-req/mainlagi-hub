import { cookies } from "next/headers";
import { requireOwner } from "@/lib/auth/requireOwner";
import {
  body,
  cart,
  cartLines,
  check,
  db,
  equal,
  field,
  hash,
  limit,
  order,
  origin,
  result,
  salesEnabled,
  ShopError,
  userId,
  uuid,
} from "@/lib/shop/server";
import {
  applyShipment,
  checkout,
  payment,
  rates,
  reconcile,
  runReconciliationBatch,
  ship,
} from "@/lib/shop/operations";
import { biteship, verifyBiteship, verifyMidtrans } from "@/lib/shop/providers";
export const dynamic = "force-dynamic";
const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
function integer(value: unknown, label: string, min = 0, max = 1000000000) {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < min ||
    value > max
  )
    throw new ShopError(`Periksa ${label}.`);
  return value;
}
function object(value: unknown, label: string) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new ShopError(`Periksa ${label}.`);
  return value as Record<string, unknown>;
}
async function handle(request: Request, path: string[], post: boolean) {
  const route = path.join("/");
  try {
    if (post && route === "midtrans/notification") {
      const b = await body(request);
      verifyMidtrans(b);
      await reconcile(field(b, "order_id", 50));
      return json({ ok: true });
    }
    if (post && route === "biteship/webhook") {
      const b = await body(request, { allowEmptyObject: true });
      const isInstallProbe =
        Object.keys(b).length === 0 &&
        (request.headers.get("content-type") ?? "")
          .toLowerCase()
          .includes("application/json");
      if (isInstallProbe) return json({ ok: true });
      verifyBiteship(request);
      const id = field(b, "order_id", 100);
      const remote = await biteship(`/v1/orders/${encodeURIComponent(id)}`);
      const o = await order(field(remote, "reference_id", 50), true);
      await applyShipment(o, remote);
      return json({ ok: true });
    }
    if (post && route === "reconcile") {
      const secret = process.env.SHOP_CRON_SECRET;
      if (
        !secret ||
        !equal(request.headers.get("authorization") ?? "", `Bearer ${secret}`)
      )
        throw new ShopError("Akses ditolak.", 403);
      return json(await runReconciliationBatch());
    }
    if (post) origin(request);
    if (path[0] === "admin") {
      const gate = await requireOwner();
      if (!gate.ok) throw new ShopError("Akses owner diperlukan.", 403);
      await limit(`admin:${gate.userId}`);
      if (!post) throw new ShopError("Metode tidak tersedia.", 405);
      const b = await body(request),
        c = await db();
      if (route === "admin/product") {
        const facts = object(b.facts, "fakta produk");
        check(
          await c.rpc("shop_admin_product_save", {
            p_product: uuid(b.productId),
            p_title: field(b, "title", 160),
            p_description: field(b, "description", 1200),
            p_category: field(b, "category", 80),
            p_base_price: integer(b.basePrice, "harga", 1),
            p_facts: facts,
            p_actor: gate.userId,
          }),
        );
        return json({ ok: true });
      }
      if (route === "admin/variants") {
        if (
          !Array.isArray(b.variants) ||
          b.variants.length < 1 ||
          b.variants.length > 20
        )
          throw new ShopError("Periksa varian.");
        const variants = b.variants.map((raw) => {
          const v = object(raw, "varian");
          const optionValues = object(v.optionValues ?? {}, "opsi varian");
          const normalized = {
            sku: field(v, "sku", 60).toUpperCase(),
            title: field(v, "title", 100),
            optionValues,
            onHand: integer(v.onHand, "stok", 0, 100000),
            priceOverride:
              v.priceOverride === null || v.priceOverride === undefined
                ? null
                : integer(v.priceOverride, "harga varian", 1),
            weightGrams:
              v.weightGrams === null || v.weightGrams === undefined
                ? null
                : integer(v.weightGrams, "berat", 1, 1000000),
            lengthMm:
              v.lengthMm === null || v.lengthMm === undefined
                ? null
                : integer(v.lengthMm, "panjang", 1, 100000),
            widthMm:
              v.widthMm === null || v.widthMm === undefined
                ? null
                : integer(v.widthMm, "lebar", 1, 100000),
            heightMm:
              v.heightMm === null || v.heightMm === undefined
                ? null
                : integer(v.heightMm, "tinggi", 1, 100000),
            isActive:
              typeof v.isActive === "boolean" ? v.isActive : true,
          };
          return normalized;
        });
        check(
          await c.rpc("shop_admin_variants_replace", {
            p_product: uuid(b.productId),
            p_variants: variants,
            p_actor: gate.userId,
          }),
        );
        return json({ ok: true });
      }
      if (route === "admin/media") {
        const status = field(b, "status", 20);
        if (!["review", "approved", "rejected"].includes(status))
          throw new ShopError("Status visual tidak valid.");
        check(
          await c.rpc("shop_admin_media_set", {
            p_media: uuid(b.mediaId),
            p_status: status,
            p_actor: gate.userId,
          }),
        );
        return json({ ok: true });
      }
      if (route === "admin/product-state") {
        const action = field(b, "action", 20);
        if (
          !["ready", "approve", "activate", "deactivate", "draft"].includes(
            action,
          )
        )
          throw new ShopError("Transisi produk tidak valid.");
        return json(
          result(
            await c.rpc("shop_admin_transition", {
              p_product: uuid(b.productId),
              p_action: action,
              p_actor: gate.userId,
            }),
          ),
        );
      }
      if (route === "admin/inventory") {
        if (!Number.isSafeInteger(b.delta) || b.delta === 0)
          throw new ShopError("Jumlah penyesuaian tidak valid.");
        check(
          await c.rpc("shop_inventory_adjust", {
            p_variant: uuid(b.variantId),
            p_delta: b.delta,
            p_reason: field(b, "reason", 500),
            p_key: field(b, "key", 160),
            p_actor: gate.userId,
          }),
        );
        return json({ ok: true });
      }
      if (route === "admin/pack") {
        const o = await order(field(b, "number", 50), true);
        check(
          await c.rpc("shop_pack", { p_order: o.id, p_actor: gate.userId }),
        );
        return json({ ok: true });
      }
      if (route === "admin/ship")
        return json(await ship(field(b, "number", 50), gate.userId));
      if (route === "admin/reconcile") {
        const target = await order(field(b, "number", 50), true);
        const state = await reconcile(target.order_number);
        check(
          await c.from("audit_logs").insert({
            actor_id: gate.userId,
            action: "shop.order.payment.reconcile",
            entity: "shop_order",
            entity_id: target.id,
            payload: { status: state.status },
          }),
        );
        return json(state);
      }
      if (route === "admin/order-action") {
        const target = await order(field(b, "number", 50), true);
        return json(
          result(
            await c.rpc("shop_admin_order_action", {
              p_order: target.id,
              p_action: field(b, "action", 50),
              p_reason: field(b, "reason", 500),
              p_actor: gate.userId,
            }),
          ),
        );
      }
      throw new ShopError("Tidak ditemukan.", 404);
    }
    if (!post && route === "cart") {
      try {
        const c = await cart();
        return json({
          lines: c.status === "active" ? await cartLines(c.id) : [],
        });
      } catch (e) {
        if (e instanceof ShopError && e.status === 404)
          return json({ lines: [] });
        throw e;
      }
    }
    if (!post && path[0] === "orders" && path.length === 2) {
      const o = await order(path[1]),
        c = await db();
      return json({
        number: o.order_number,
        subtotal: o.subtotal_amount,
        shipping: o.shipping_amount,
        total: o.grand_total_amount,
        payment: o.payment_status,
        fulfillment: o.fulfillment_status,
        status: o.order_status,
        items: result(
          await c
            .from("shop_order_items")
            .select("title_snapshot,quantity,line_total_amount")
            .eq("order_id", o.id),
        ),
        shipments: result(
          await c
            .from("shop_shipments")
            .select("waybill_id,tracking_url,status")
            .eq("order_id", o.id),
        ),
      });
    }
    if (!post && route === "orders") {
      const id = await userId();
      if (!id) throw new ShopError("Masuk untuk melihat pesanan akun.", 401);
      const c = await db();
      return json(
        result(
          await c
            .from("shop_orders")
            .select(
              "order_number,created_at,grand_total_amount,payment_status,fulfillment_status",
            )
            .eq("account_id", id)
            .order("created_at", { ascending: false })
            .limit(100),
        ),
      );
    }
    if (!post) throw new ShopError("Tidak ditemukan.", 404);
    if (["cart", "shipping/rates", "checkout"].includes(route)) salesEnabled();
    const b = await body(request);
    // Cookie bucket plus edge IP when supplied by the trusted Cloudflare deployment.
    const ip = request.headers.get("cf-connecting-ip");
    if (ip) await limit(`ip:${ip}`);
    if (route === "cart") {
      let c = await cart(true);
      if (c.status === "converted") {
        (await cookies()).delete("mlg_shop_cart");
        c = await cart(true);
      }
      await limit(`cart:${c.id}`);
      if (!Number.isInteger(b.quantity))
        throw new ShopError("Jumlah tidak valid.");
      const client = await db();
      check(
        await client.rpc("shop_cart_set", {
          p_cart: c.id,
          p_hash: hash(c.token),
          p_variant: uuid(b.variantId),
          p_quantity: b.quantity,
        }),
      );
      return json({ ok: true });
    }
    if (route === "shipping/rates") {
      const c = await cart();
      await limit(`rates:${c.id}`);
      return json(await rates(b));
    }
    if (route === "checkout") {
      const c = await cart();
      await limit(`checkout:${c.id}`);
      return json(await checkout(b));
    }
    if (route === "payments/session") {
      const o = await order(field(b, "number", 50));
      await limit(`payment:${o.id}`);
      return json(await payment(o));
    }
    if (route === "orders/refresh") {
      const o = await order(field(b, "number", 50));
      await limit(`refresh:${o.id}`);
      return json(await reconcile(o.order_number));
    }
    throw new ShopError("Tidak ditemukan.", 404);
  } catch (e) {
    return json(
      {
        error:
          e instanceof ShopError
            ? e.message
            : "Shop belum dapat diakses. Coba lagi nanti.",
      },
      e instanceof ShopError ? e.status : 503,
    );
  }
}
export async function GET(
  r: Request,
  c: { params: Promise<{ path: string[] }> },
) {
  return handle(r, (await c.params).path, false);
}
export async function POST(
  r: Request,
  c: { params: Promise<{ path: string[] }> },
) {
  return handle(r, (await c.params).path, true);
}
