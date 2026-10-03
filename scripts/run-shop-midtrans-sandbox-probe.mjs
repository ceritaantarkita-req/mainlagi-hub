import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const serverKey = process.env.MIDTRANS_SANDBOX_SERVER_KEY;
assert.ok(
  serverKey,
  "MIDTRANS_SANDBOX_SERVER_KEY is required for the live Midtrans sandbox probe",
);
assert.notEqual(
  process.env.MIDTRANS_IS_PRODUCTION,
  "true",
  "sandbox probe refuses production mode",
);

const auth = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;
const orderId = `MLG-SBX-${Date.now()}-${randomUUID().slice(0, 8)}`;
const amount = 10000;

async function jsonResponse(response) {
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

const createResponse = await fetch(
  "https://app.sandbox.midtrans.com/snap/v1/transactions",
  {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: "Mainlagi Sandbox QA",
        email: "qa@example.com",
        phone: "081234567890",
      },
      callbacks: {
        finish: "https://example.com/midtrans-sandbox-return",
      },
      expiry: {
        unit: "minutes",
        duration: 10,
      },
    }),
    signal: AbortSignal.timeout(15000),
  },
);
const created = await jsonResponse(createResponse);
assert.equal(
  createResponse.status,
  201,
  `Snap sandbox creation failed: ${JSON.stringify(created)}`,
);
assert.equal(typeof created.token, "string");
assert.ok(created.token.length > 10);
assert.equal(typeof created.redirect_url, "string");
const redirect = new URL(created.redirect_url);
assert.equal(redirect.protocol, "https:");
assert.equal(redirect.hostname, "app.sandbox.midtrans.com");

const statusResponse = await fetch(
  `https://api.sandbox.midtrans.com/v2/${encodeURIComponent(orderId)}/status`,
  {
    headers: {
      Accept: "application/json",
      Authorization: auth,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  },
);
const status = await jsonResponse(statusResponse);

if (statusResponse.status === 404 || String(status.status_code) === "404") {
  // Official Midtrans docs explicitly allow GET Status to be 404 after Snap
  // creation but before the customer chooses a payment method.
  assert.equal(String(status.status_code), "404");
  console.log(
    `Midtrans sandbox probe PASS: Snap transaction ${orderId} created, redirect host verified, pre-payment GET Status returned documented 404.`,
  );
} else {
  assert.ok(statusResponse.ok, JSON.stringify(status));
  assert.equal(status.order_id, orderId);
  assert.equal(Number(status.gross_amount), amount);
  assert.equal(status.transaction_status, "pending");
  assert.ok(["200", "201"].includes(String(status.status_code)));
  console.log(
    `Midtrans sandbox probe PASS: Snap transaction ${orderId} created, redirect host verified, pre-payment status is pending.`,
  );
}
