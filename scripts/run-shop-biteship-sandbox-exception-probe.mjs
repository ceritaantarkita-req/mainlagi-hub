import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

function clean(name) {
  const raw = process.env[name]?.trim();
  if (!raw) throw new Error(`${name}_NOT_CONFIGURED`);
  const quoted =
    raw.length >= 2 &&
    ((raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'")));
  return (quoted ? raw.slice(1, -1) : raw).trim();
}

const key = clean("BITESHIP_TEST_API_KEY");
assert.ok(key.startsWith("biteship_test."));
const webhookSecret = clean("BITESHIP_WEBHOOK_SECRET");
const stagingUrl = clean("SHOP_BITESHIP_STAGING_URL").replace(/\/$/, "");
const runId = clean("GITHUB_RUN_ID");

const origin = {
  origin_contact_name: clean("BITESHIP_ORIGIN_CONTACT_NAME"),
  origin_contact_phone: clean("BITESHIP_ORIGIN_CONTACT_PHONE"),
  origin_address: clean("BITESHIP_ORIGIN_ADDRESS").replace(/\\\./g, "."),
  origin_postal_code: Number(clean("BITESHIP_ORIGIN_POSTAL_CODE")),
};

const fixture = JSON.parse(
  await readFile(
    "docs/data/MAINLAGI_SHOP_BITESHIP_SANDBOX_FIXTURE_2026-09-27.json",
    "utf8",
  ),
);
const product = fixture.products.find((row) => row.code === "001");
assert.ok(product);

async function api(path, options = {}) {
  const response = await fetch(`https://api.biteship.com${path}`, {
    ...options,
    headers: {
      Authorization: key,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
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

const referenceId = `ML-SBX-EXCEPTION-${runId}`;
const payload = {
  ...origin,
  origin_collection_method: "pickup",
  destination_contact_name: "Mainlagi Sandbox Exception Receiver",
  destination_contact_phone: "088888888888",
  destination_address: "Mainlagi Sandbox Destination, Jakarta Selatan",
  destination_postal_code: 12240,
  courier_company: "sicepat",
  courier_type: "reg",
  delivery_type: "now",
  order_note: "Mainlagi sandbox exception progression acceptance only",
  reference_id: referenceId,
  metadata: {
    environment: "sandbox",
    purpose: "exception-progression",
    production_use_allowed: false,
  },
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

const created = await api("/v1/orders", {
  method: "POST",
  body: JSON.stringify(payload),
});
assert.ok(created.response.ok && created.body?.success !== false);
assert.equal(created.body.reference_id, referenceId);
assert.equal(typeof created.body.id, "string");
const orderId = created.body.id;

const retrieved = await api(`/v1/orders/${encodeURIComponent(orderId)}`);
assert.equal(retrieved.response.status, 200);
assert.equal(retrieved.body?.success, true);
assert.equal(retrieved.body?.id, orderId);
assert.equal(retrieved.body?.reference_id, referenceId);
assert.equal(retrieved.body?.status, "confirmed");

const webhook = await fetch(`${stagingUrl}/api/shop/biteship/webhook`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Mainlagi-Biteship-Secret": webhookSecret,
  },
  body: JSON.stringify({
    event: "order.status",
    order_id: orderId,
    status: "confirmed",
  }),
  signal: AbortSignal.timeout(20000),
});
const webhookBody = await webhook.json();
assert.equal(webhook.status, 200);
assert.deepEqual(webhookBody, { ok: true, sandboxAcceptance: true });

const evidence = {
  environment: "Biteship Testing Mode",
  simulatedOnly: true,
  orderId,
  referenceId,
  initialStatus: retrieved.body.status,
  intendedManualProgression: [
    "allocated",
    "picking_up",
    "picked",
    "dropping_off",
    "on_hold",
    "return_in_transit",
    "returned"
  ],
  authenticatedWebhookBoundaryAndProviderGet: "PASS",
};

await writeFile(
  "/tmp/mainlagi-biteship-exception-candidate.json",
  JSON.stringify(evidence, null, 2) + "\n",
);
console.log(JSON.stringify(evidence, null, 2));
console.log("Shop Biteship sandbox exception candidate creation PASS");
