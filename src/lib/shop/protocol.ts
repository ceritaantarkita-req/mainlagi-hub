import { createHash, timingSafeEqual } from "node:crypto";
export function validMidtransSignature(
  b: Record<string, unknown>,
  key: string,
) {
  if (
    !key ||
    !["order_id", "status_code", "gross_amount", "signature_key"].every(
      (k) => typeof b[k] === "string",
    )
  )
    return false;
  const expected = createHash("sha512")
    .update(`${b.order_id}${b.status_code}${b.gross_amount}${key}`)
    .digest("hex");
  const given = Buffer.from(b.signature_key as string),
    digest = Buffer.from(expected);
  return given.length === digest.length && timingSafeEqual(given, digest);
}
export function mappedPayment(b: Record<string, unknown>) {
  switch (b.transaction_status) {
    case "settlement":
      return !b.fraud_status || b.fraud_status === "accept"
        ? "paid"
        : "pending";
    case "capture":
      return b.fraud_status === "accept" ? "paid" : "pending";
    case "deny":
      return "failed";
    case "cancel":
      return "cancelled";
    case "expire":
      return "expired";
    case "refund":
      return "refunded";
    case "partial_refund":
      return "review";
    default:
      return "pending";
  }
}
