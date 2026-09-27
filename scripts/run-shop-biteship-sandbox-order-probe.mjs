import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

function clean(name) {
  const raw = process.env[name]?.trim();
  if (!raw) throw new Error(`${name}_NOT_CONFIGURED`);
  const quoted =
    raw.length >= 2 &&
    ((raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("\'") && raw.endsWith("\'")));
  return (quoted ? raw.slice(1, -1) : raw).trim();
}

const key = clean("BITESHIP_TEST_API_KEY");
assert.ok(
  key.startsWith("biteship_test."),
  "Refusing to create an order because BITESHIP_TEST_API_KEY is not a sandbox key",
);

const origin = {
  origin_contact_name: clean("BITESHIP_ORIGIN_CONTACT_NAME"),
  origin_contact_phone: clean("BITESHIP_ORIGIN_CONTACT_PHONE"),
  origin_address: clean("BITESHIP_ORIGIN_ADDRESS").replace(/\\\./g, "."),
  origin_postal_code: Number(clean("BITESHIP_ORIGIN_POSTAL_CODE")),
};
assert.match(origin.origin_contact_phone, /^\+?[0-9]{9,15}$/);
assert.ok(Number.isInteger(origin.origin_postal_code));

const webhookSecret = clean("BITESHIP_WEBHOOK_SECRET");
const stagingUrl = clean("SHOP_BITESHIP_STAGING_URL").replace(/\/$/, "");
const runId = clean("GITHUB_RUN_ID");

const fixture = JSON.parse(
  await readFile(
    "docs/data/MAINLAGI_SHOP_BITESHIP_SANDBOX_FIXTURE_2026-09-27.json",
    "utf8",
  ),
);
assert.equal(fixture.productionUseAllowed, false);
const product = fixture.products.find((row) => row.code === "001");
assert.ok(product, "sandbox fixture SKU 001 missing");

async function api(path, options = {}) {
  const response = await fetch(`https://api.biteship.com${path}`, {
    ...options,
    headers: {
      Authorization: key,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    signal: AbortSignal.timeout(20000),
  });
  const raw = await response.text();
  let body;
  try { body = JSON.parse(raw); } catch {
    throw new Error(`Biteship returned non-JSON HTTP ${response.status}`);
  }
  return { response, body };
}

function payload(referenceId, purpose) {
  return {
    ...origin,
    origin_collection_method: "pickup",
    destination_contact_name: "Mainlagi Sandbox Receiver",
    destination_contact_phone: "088888888888",
    destination_address: "Mainlagi Sandbox Destination, Jakarta Selatan",
    destination_postal_code: 12240,
    courier_company: "sicepat",
    courier_type: "reg",
    delivery_type: "now",
    order_note: `Mainlagi sandbox acceptance only: ${purpose}`,
    reference_id: referenceId,
    metadata: { environment: "sandbox", purpose, production_use_allowed: false },
    items: [{
      name: "Mainlagi Shop Sandbox 001-DEFAULT",
      sku: product.sku,
      category: "fashion",
      value: 69000,
      quantity: 1,
      weight: product.weight_grams,
      length: Math.ceil(product.length_mm / 10),
      width: Math.ceil(product.width_mm / 10),
      height: Math.ceil(product.height_mm / 10),
    }],
  };
}

async function createOrder(referenceId, purpose) {
  const data = payload(referenceId, purpose);
  const { response, body } = await api("/v1/orders", {
    method: "POST", body: JSON.stringify(data),
  });
  assert.ok(
    response.ok && body?.success !== false,
    `Biteship create order failed HTTP ${response.status}: ${body?.error ?? body?.message ?? "unknown"}`,
  );
  assert.equal(body.reference_id, referenceId);
  assert.equal(typeof body.id, "string");
  assert.ok(body.id.length > 5);
  return { body, data };
}

async function retrieve(id, referenceId) {
  const { response, body } = await api(`/v1/orders/${encodeURIComponent(id)}`);
  assert.equal(response.status, 200);
  assert.equal(body?.success, true);
  assert.equal(body?.id, id);
  assert.equal(body?.reference_id, referenceId);
  return body;
}

async function verifyDuplicate(data, originalId) {
  const { response, body } = await api("/v1/orders", {
    method: "POST", body: JSON.stringify(data),
  });
  const evidence = {
    httpStatus: response.status,
    success: body?.success ?? null,
    code: body?.code ?? null,
    error: typeof body?.error === "string" ? body.error : null,
    message: typeof body?.message === "string" ? body.message : null,
    details:
      body?.details && typeof body.details === "object"
        ? Object.fromEntries(
            Object.entries(body.details).filter(([key]) =>
              ["order_id", "waybill_id", "reference_id"].includes(key),
            ),
          )
        : null,
  };
  console.log("Biteship duplicate-reference evidence:", JSON.stringify(evidence));
  assert.ok(!response.ok || body?.success === false);
  assert.equal(Number(body?.code), 40002060);
  if (typeof body?.details?.order_id === "string")
    assert.equal(body.details.order_id, originalId);
  return evidence;
}

async function verifyWebhookBoundary(orderId) {
  const response = await fetch(`${stagingUrl}/api/shop/biteship/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Mainlagi-Biteship-Secret": webhookSecret,
    },
    body: JSON.stringify({ event: "order.status", order_id: orderId, status: "confirmed" }),
    signal: AbortSignal.timeout(20000),
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(body, { ok: true, sandboxAcceptance: true });
}

const deliveredRef = `ML-SBX-DELIVER-${runId}`;
const cancelledRef = `ML-SBX-CANCEL-${runId}`;

const delivered = await createOrder(deliveredRef, "deliver-flow");
await retrieve(delivered.body.id, deliveredRef);
const duplicateEvidence = await verifyDuplicate(delivered.data, delivered.body.id);
await verifyWebhookBoundary(delivered.body.id);

const cancelled = await createOrder(cancelledRef, "cancel-flow");
await retrieve(cancelled.body.id, cancelledRef);
await verifyWebhookBoundary(cancelled.body.id);

const evidence = {
  environment: "Biteship Testing Mode",
  simulatedOnly: true,
  courier: "sicepat/reg",
  deliveredCandidate: { id: delivered.body.id, reference_id: deliveredRef, status: delivered.body.status ?? null },
  cancelledCandidate: { id: cancelled.body.id, reference_id: cancelledRef, status: cancelled.body.status ?? null },
  duplicateReferenceDetection: "PASS",
  duplicateProviderOrderIdReturned:
    typeof duplicateEvidence?.details?.order_id === "string",
  independentGet: "PASS",
  authenticatedWebhookBoundaryAndProviderGet: "PASS",
};

await writeFile("/tmp/mainlagi-biteship-sandbox-orders.json", JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify(evidence, null, 2));
console.log("Shop Biteship sandbox orders: 2 simulated orders + GET + duplicate-reference + authenticated webhook/provider-GET PASS");
