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
      if (!b.fraud_status || b.fraud_status === "accept") return "paid";
      return b.fraud_status === "challenge" ? "pending" : "review";
    case "capture":
      if (b.fraud_status === "accept") return "paid";
      return !b.fraud_status || b.fraud_status === "challenge"
        ? "pending"
        : "review";
    case "deny":
    case "failure":
      return "failed";
    case "cancel":
      return "cancelled";
    case "expire":
      return "expired";
    case "refund":
      return "refunded";
    case "partial_refund":
    case "chargeback":
    case "partial_chargeback":
      return "review";
    default:
      return "pending";
  }
}

export function validMidtransStatus(
  b: Record<string, unknown>,
  expectedOrder: string,
  expectedAmount: number,
) {
  if (
    b.order_id !== expectedOrder ||
    typeof b.transaction_id !== "string" ||
    !b.transaction_id ||
    typeof b.transaction_status !== "string" ||
    typeof b.status_code !== "string" ||
    !/^\d+(\.00)?$/.test(String(b.gross_amount)) ||
    Number(b.gross_amount) !== expectedAmount
  )
    return false;

  const mapped = mappedPayment(b);
  if (mapped === "paid" && b.status_code !== "200") return false;
  if (
    b.transaction_status === "pending" &&
    !["200", "201"].includes(b.status_code)
  )
    return false;
  return true;
}
