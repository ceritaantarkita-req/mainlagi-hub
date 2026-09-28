import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

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
assert.ok(
  key.startsWith("biteship_test."),
  "Refusing tracking acceptance because API key is not a sandbox key",
);

const deliveredOrderId = clean("BITESHIP_TEST_DELIVERED_ORDER_ID");
const cancelledOrderId = clean("BITESHIP_TEST_CANCELLED_ORDER_ID");

async function api(path) {
  const response = await fetch(`https://api.biteship.com${path}`, {
    headers: {
      Authorization: key,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(20000),
  });
  const raw = await response.text();
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new Error(`Biteship returned non-JSON HTTP ${response.status}`);
  }
  assert.equal(
    response.status,
    200,
    `Biteship GET failed HTTP ${response.status}: ${body?.error ?? body?.message ?? "unknown"}`,
  );
  assert.equal(body?.success, true);
  return body;
}

const deliveredOrder = await api(
  `/v1/orders/${encodeURIComponent(deliveredOrderId)}`,
);
assert.equal(deliveredOrder.id, deliveredOrderId);
assert.equal(deliveredOrder.status, "delivered");
assert.ok(
  typeof deliveredOrder.tracking_id === "string" &&
    deliveredOrder.tracking_id.length > 5,
  "Delivered sandbox order has no tracking_id",
);

const tracking = await api(
  `/v1/trackings/${encodeURIComponent(deliveredOrder.tracking_id)}`,
);
assert.equal(tracking.id, deliveredOrder.tracking_id);
assert.equal(tracking.order_id, deliveredOrderId);
assert.equal(tracking.status, "delivered");
assert.ok(Array.isArray(tracking.history) && tracking.history.length > 0);

const statuses = tracking.history
  .map((row) => String(row?.status ?? "").trim())
  .filter(Boolean);
const normalized = statuses.map((value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/-/g, "_")
    .toLowerCase(),
);

for (const required of [
  "confirmed",
  "allocated",
  "picking_up",
  "picked",
  "dropping_off",
  "delivered",
]) {
  assert.ok(
    normalized.includes(required),
    `Tracking history missing expected status: ${required}`,
  );
}

const cancelledOrder = await api(
  `/v1/orders/${encodeURIComponent(cancelledOrderId)}`,
);
assert.equal(cancelledOrder.id, cancelledOrderId);
assert.equal(cancelledOrder.status, "cancelled");

const evidence = {
  environment: "Biteship Testing Mode",
  deliveredOrderId,
  deliveredReferenceId: deliveredOrder.reference_id ?? null,
  deliveredStatus: deliveredOrder.status,
  trackingId: deliveredOrder.tracking_id,
  trackingStatus: tracking.status,
  trackingHistoryStatuses: normalized,
  trackingHistoryLength: tracking.history.length,
  cancelledOrderId,
  cancelledReferenceId: cancelledOrder.reference_id ?? null,
  cancelledStatus: cancelledOrder.status,
  eventsLogScreenshotEvidence: {
    eventType: "order.status",
    observedHttpStatus: 200,
    note: "User-supplied Biteship Testing dashboard Events Log showed sequential order.status callbacks returning HTTP 200 during the Delivered simulation.",
  },
};

await writeFile(
  "/tmp/mainlagi-biteship-tracking-evidence.json",
  JSON.stringify(evidence, null, 2) + "\n",
);
console.log(JSON.stringify(evidence, null, 2));
console.log(
  "Shop Biteship sandbox tracking: delivered order + tracking history + cancelled order PASS",
);
