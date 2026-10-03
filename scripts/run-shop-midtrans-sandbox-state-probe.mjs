import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const serverKey = process.env.MIDTRANS_SANDBOX_SERVER_KEY;
assert.ok(
  serverKey,
  "MIDTRANS_SANDBOX_SERVER_KEY is required for the live Midtrans sandbox state probe",
);
assert.notEqual(
  process.env.MIDTRANS_IS_PRODUCTION,
  "true",
  "sandbox state probe refuses production mode",
);

const auth = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;
const baseUrl = "https://api.sandbox.midtrans.com";
const amount = 10000;

function uniqueOrderId(label) {
  return `MLG-SBX-${label}-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

async function parseJson(response) {
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(
      `Midtrans returned non-JSON response: HTTP ${response.status} ${text.slice(0, 300)}`,
    );
  }
  return body;
}

async function midtrans(path, { method = "GET", body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  return { response, body: await parseJson(response) };
}

function assertIdentity(body, orderId) {
  assert.equal(body.order_id, orderId);
  assert.equal(Number(body.gross_amount), amount);
  assert.equal(typeof body.transaction_id, "string");
  assert.ok(body.transaction_id.length > 10);
}

async function createPendingVa(orderId) {
  const { response, body } = await midtrans("/v2/charge", {
    method: "POST",
    body: {
      payment_type: "bank_transfer",
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      bank_transfer: {
        bank: "permata",
      },
    },
  });

  assert.ok(
    response.ok,
    `Midtrans sandbox VA creation failed: HTTP ${response.status} ${JSON.stringify(body)}`,
  );
  assert.equal(String(body.status_code), "201");
  assert.equal(body.transaction_status, "pending");
  assert.equal(body.payment_type, "bank_transfer");
  assertIdentity(body, orderId);

  const status = await midtrans(
    `/v2/${encodeURIComponent(orderId)}/status`,
  );
  assert.ok(status.response.ok, JSON.stringify(status.body));
  assert.equal(String(status.body.status_code), "201");
  assert.equal(status.body.transaction_status, "pending");
  assertIdentity(status.body, orderId);
}

async function verifyTerminal(orderId, expectedStatus, allowedStatusCodes = ["200"]) {
  const status = await midtrans(
    `/v2/${encodeURIComponent(orderId)}/status`,
  );
  assert.ok(status.response.ok, JSON.stringify(status.body));
  assert.ok(
    allowedStatusCodes.includes(String(status.body.status_code)),
    `Unexpected Midtrans status_code for ${expectedStatus}: ${JSON.stringify(status.body)}`,
  );
  assert.equal(status.body.transaction_status, expectedStatus);
  assertIdentity(status.body, orderId);
}

const cancelOrderId = uniqueOrderId("CANCEL");
await createPendingVa(cancelOrderId);
const cancelled = await midtrans(
  `/v2/${encodeURIComponent(cancelOrderId)}/cancel`,
  { method: "POST" },
);
assert.ok(
  cancelled.response.ok,
  `Midtrans sandbox cancel failed: HTTP ${cancelled.response.status} ${JSON.stringify(cancelled.body)}`,
);
assert.equal(String(cancelled.body.status_code), "200");
assert.equal(cancelled.body.transaction_status, "cancel");
await verifyTerminal(cancelOrderId, "cancel");

const expireOrderId = uniqueOrderId("EXPIRE");
await createPendingVa(expireOrderId);
const expired = await midtrans(
  `/v2/${encodeURIComponent(expireOrderId)}/expire`,
  { method: "POST" },
);
assert.ok(
  expired.response.ok,
  `Midtrans sandbox expire failed: HTTP ${expired.response.status} ${JSON.stringify(expired.body)}`,
);
assert.equal(
  String(expired.body.status_code),
  "407",
  "Midtrans documents status_code 407 as Expired transaction for the expire action",
);
assert.equal(expired.body.transaction_status, "expire");
await verifyTerminal(expireOrderId, "expire", ["200", "407"]);

console.log(
  `Midtrans sandbox state probe PASS: pending verified for two Rp${amount.toLocaleString("id-ID")} VA transactions; cancel and expire terminal states verified via independent GET Status. Orders: ${cancelOrderId}, ${expireOrderId}.`,
);
