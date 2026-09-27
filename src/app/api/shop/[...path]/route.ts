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
  ship,
} from "@/lib/shop/operations";
import { biteship, verifyBiteship, verifyMidtrans } from "@/lib/shop/providers";
export const dynamic = "force-dynamic";
const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
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
      verifyBiteship(request);
      const b = await body(request);
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
      const c = await db(),
        rows = result(
          await c
            .from("shop_orders")
            .select("order_number,id,grand_total_amount,expires_at")
            .eq("payment_status", "pending")
            .order("created_at")
            .limit(50),
        );
      let processed = 0;
      for (const row of rows) {
        try {
          const attempts = result(
            await c
              .from("shop_payment_attempts")
              .select("order_id")
              .eq("order_id", row.id),
          );
          if (
            !attempts.length &&
            Date.parse(row.expires_at) + 120000 < Date.now()
          )
            check(
              await c.rpc("shop_apply_payment", {
                p_number: row.order_number,
                p_amount: row.grand_total_amount,
                p_status: "expired",
                p_event: `local-expiry:${row.id}`,
                p_transaction: null,
              }),
            );
          else await reconcile(row.order_number);
          processed++;
        } catch {
          /* Retain reservations on ambiguous provider failures; alert via failed count. */
        }
      }
      return json({ processed, failed: rows.length - processed });
    }
    if (post) origin(request);
    if (path[0] === "admin") {
      const gate = await requireOwner();
      if (!gate.ok) throw new ShopError("Akses owner diperlukan.", 403);
      await limit(`admin:${gate.userId}`);
      if (!post) throw new ShopError("Metode tidak tersedia.", 405);
      const b = await body(request),
        c = await db();
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
      if (route === "admin/reconcile")
        return json(await reconcile(field(b, "number", 50)));
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
