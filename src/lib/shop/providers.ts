import "server-only";
import { validMidtransSignature } from "./protocol";
export { mappedPayment } from "./protocol";
import { ShopError, equal } from "./server";
function required(name: string) {
  const v = process.env[name];
  if (!v)
    throw new ShopError(
      "Layanan pembayaran atau pengiriman belum tersedia.",
      503,
    );
  return v;
}
export class ProviderError extends ShopError {
  constructor(
    public code: unknown,
    public details: Record<string, unknown>,
  ) {
    super(
      "Penyedia layanan belum dapat memproses permintaan. Coba lagi nanti.",
      502,
    );
  }
}
export async function providerFetch(url: string, key: string, data?: unknown) {
  const r = await fetch(url, {
    method: data ? "POST" : "GET",
    headers: {
      Authorization: key,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const json = (await r.json()) as Record<string, unknown>;
  if (!r.ok || json.success === false || json.status_code === "404")
    throw new ProviderError(
      json.code ?? json.status_code ?? r.status,
      (json.details ?? {}) as Record<string, unknown>,
    );
  return json;
}
const midtransBase = () =>
  process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "midtrans.com"
    : "sandbox.midtrans.com";
const midtransAuth = () =>
  `Basic ${Buffer.from(required("MIDTRANS_SERVER_KEY") + ":").toString("base64")}`;
export const snap = (data: unknown) =>
  providerFetch(
    `https://app.${midtransBase()}/snap/v1/transactions`,
    midtransAuth(),
    data,
  );
export const paymentStatus = (number: string) =>
  providerFetch(
    `https://api.${midtransBase()}/v2/${encodeURIComponent(number)}/status`,
    midtransAuth(),
  );
export function verifyMidtrans(b: Record<string, unknown>) {
  if (!validMidtransSignature(b, required("MIDTRANS_SERVER_KEY")))
    throw new ShopError("Notifikasi tidak valid.", 403);
}
export const biteship = (path: string, data?: unknown) =>
  providerFetch(
    `https://api.biteship.com${path}`,
    required("BITESHIP_API_KEY"),
    data,
  );
export const biteshipRuntimeConfigured = () =>
  Boolean(process.env.BITESHIP_API_KEY);
export function pickup() {
  return {
    origin_contact_name: required("BITESHIP_ORIGIN_CONTACT_NAME"),
    origin_contact_phone: required("BITESHIP_ORIGIN_CONTACT_PHONE"),
    origin_address: required("BITESHIP_ORIGIN_ADDRESS"),
    origin_postal_code: Number(required("BITESHIP_ORIGIN_POSTAL_CODE")),
  };
}
export const couriers = () => required("BITESHIP_COURIERS");
export function verifyBiteship(request: Request) {
  const name = required("BITESHIP_WEBHOOK_HEADER");
  if (
    !equal(request.headers.get(name) ?? "", required("BITESHIP_WEBHOOK_SECRET"))
  )
    throw new ShopError("Notifikasi tidak valid.", 403);
}
