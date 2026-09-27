import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { operationalPolicyBlockers } from "./operationalPolicy";
import { orderAccessAllowed } from "./access";
import { cookies } from "next/headers";
import { getAdminClient } from "@/lib/auth/supabase-server-admin";
import { getServerClient } from "@/lib/auth/supabase-server";
import type { CartLine, Order, Product } from "./types";
export class ShopError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export function equal(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export async function db() {
  const client = await getAdminClient();
  if (!client)
    throw new ShopError("Shop belum tersedia. Coba lagi nanti.", 503);
  return client;
}
export function result<T>(r: {
  data: T | null;
  error: unknown;
}): NonNullable<T> {
  if (r.error || r.data === null)
    throw new ShopError(
      "Data Shop belum dapat diproses. Muat ulang dan coba lagi.",
      409,
    );
  return r.data as NonNullable<T>;
}
export function check(r: { error: unknown }) {
  if (r.error)
    throw new ShopError(
      "Perubahan tidak dapat diproses. Periksa data terbaru.",
      409,
    );
}
export function salesEnabled() {
  if (process.env.SHOP_SALES_ENABLED !== "true")
    throw new ShopError("Penjualan belum dibuka.", 503);
  const blockers = operationalPolicyBlockers();
  if (blockers.length)
    throw new ShopError(
      "Penjualan belum dapat dibuka karena konfigurasi operasional belum lengkap.",
      503,
    );
}
export async function body(
  request: Request,
  options: { allowEmptyObject?: boolean } = {},
): Promise<Record<string, unknown>> {
  if (Number(request.headers.get("content-length")) > 16384)
    throw new ShopError("Data terlalu besar.", 413);
  const reader = request.body?.getReader();
  if (!reader) {
    if (options.allowEmptyObject) return {};
    throw new ShopError("Data kosong.");
  }
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 16384) {
      await reader.cancel();
      throw new ShopError("Data terlalu besar.", 413);
    }
    chunks.push(value);
  }
  const raw = Buffer.concat(chunks).toString();
  if (options.allowEmptyObject && raw.trim() === "") return {};
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw Error();
    return value;
  } catch {
    throw new ShopError("Format data tidak valid.");
  }
}
export function field(b: Record<string, unknown>, key: string, max = 200) {
  const value = b[key];
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new ShopError(`Periksa ${key}.`);
  return value.trim();
}
export function uuid(value: unknown) {
  if (
    typeof value !== "string" ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      value,
    )
  )
    throw new ShopError("ID tidak valid.");
  return value;
}
export function origin(request: Request) {
  const expected = process.env.NEXT_PUBLIC_SITE_URL;
  const allowed = expected
    ? new URL(expected).origin
    : new URL(request.url).origin;
  if (request.headers.get("origin") !== allowed)
    throw new ShopError("Permintaan ditolak.", 403);
}
export async function limit(key: string) {
  const c = await db();
  if (!result(await c.rpc("shop_rate_limit", { p_key: hash(key) })))
    throw new ShopError(
      "Terlalu banyak permintaan. Coba satu menit lagi.",
      429,
    );
}
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
export async function cart(create = false) {
  const c = await db(),
    jar = await cookies();
  const raw = jar.get("mlg_shop_cart")?.value ?? "";
  const [id, token] = raw.split(".");
  if (
    id &&
    token &&
    /^[a-f0-9]{64}$/.test(token) &&
    /^[a-f0-9-]{36}$/.test(id)
  ) {
    const { data, error } = await c
      .from("shop_carts")
      .select("id,status,revision")
      .eq("id", id)
      .eq("token_hash", hash(token))
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (error) throw new ShopError("Keranjang belum dapat dimuat.", 503);
    if (data) return { ...data, token };
  }
  if (!create) throw new ShopError("Keranjang kosong.", 404);
  const tokenNew = randomBytes(32).toString("hex");
  const row = result<{ id: string; status: string; revision: number }>(
    await c
      .from("shop_carts")
      .insert({ token_hash: hash(tokenNew) })
      .select("id,status,revision")
      .single(),
  );
  jar.set("mlg_shop_cart", `${row.id}.${tokenNew}`, {
    ...cookieOptions,
    maxAge: 2592000,
  });
  return { ...row, token: tokenNew };
}
export async function cartLines(id: string) {
  const c = await db();
  return result(
    await c
      .from("shop_cart_items")
      .select("variant_id,quantity,shop_variants(*,shop_products(*))")
      .eq("cart_id", id),
  ) as unknown as CartLine[];
}
export async function userId() {
  const client = await getServerClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  return error ? null : (data.user?.id ?? null);
}
export async function order(number: string, owner = false): Promise<Order> {
  if (!/^MLG-\d{8}-[A-F0-9]{12}$/.test(number))
    throw new ShopError("Pesanan tidak ditemukan.", 404);
  const c = await db();
  const r = await c
    .from("shop_orders")
    .select("*")
    .eq("order_number", number)
    .maybeSingle();
  if (r.error) throw new ShopError("Pesanan belum dapat dimuat.", 503);
  const o = r.data as Order | null;
  if (!o) throw new ShopError("Pesanan tidak ditemukan.", 404);
  if (!owner) {
    const token = (await cookies()).get(`mlg_order_${number}`)?.value;
    const guestTokenMatches = Boolean(
      token && equal(hash(token), o.guest_token_hash),
    );
    const currentUserId = guestTokenMatches ? null : await userId();
    if (
      !orderAccessAllowed({
        guestTokenMatches,
        accountId: o.account_id,
        userId: currentUserId,
      })
    )
      throw new ShopError("Pesanan tidak ditemukan.", 404);
  }
  return o;
}
export async function orderCookie(number: string, token: string) {
  (await cookies()).set(`mlg_order_${number}`, token, {
    ...cookieOptions,
    maxAge: 2592000,
  });
}
export async function catalog(): Promise<Product[]> {
  const client = await getServerClient();
  if (!client) return [];
  return result(
    await client
      .from("shop_products")
      .select("*,shop_variants(*),shop_product_media(*)")
      .order("product_code"),
  ) as unknown as Product[];
}
