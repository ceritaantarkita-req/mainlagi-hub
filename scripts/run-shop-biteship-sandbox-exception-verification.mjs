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
assert.ok(key.startsWith("biteship_test."));
const orderId = clean("BITESHIP_TEST_EXCEPTION_ORDER_ID");

async function api(path) {
  const response = await fetch(`https://api.biteship.com${path}`, {
    headers: { Authorization: key, Accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  const raw = await response.text();
  let body;
  try { body = JSON.parse(raw); } catch {
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

function normalize(value) {
  return String(value ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/-/g, "_")
    .toLowerCase();
}

const order = await api(`/v1/orders/${encodeURIComponent(orderId)}`);
assert.equal(order.id, orderId);
console.log(
  "Exception order provider status before terminal assertion:",
  JSON.stringify({
    status: normalize(order.status),
    courierStatus: normalize(order?.courier?.status),
    courierHistory: Array.isArray(order?.courier?.history)
      ? order.courier.history.map((row) => normalize(row?.status))
      : [],
  }),
);
assert.equal(
  normalize(order.status),
  "returned",
  "Exception candidate must reach returned before verification",
);

const trackingId = order?.courier?.tracking_id;
assert.ok(
  typeof trackingId === "string" && trackingId.length > 5,
  "Returned sandbox order has no courier.tracking_id",
);

const tracking = await api(`/v1/trackings/${encodeURIComponent(trackingId)}`);
assert.equal(tracking.id, trackingId);
assert.equal(tracking.order_id, orderId);
assert.equal(normalize(tracking.status), "returned");
assert.ok(Array.isArray(tracking.history) && tracking.history.length > 0);

const history = tracking.history
  .map((row) => normalize(row?.status))
  .filter(Boolean);

for (const required of ["return_in_transit", "returned"]) {
  assert.ok(
    history.includes(required),
    `Tracking history missing required return state: ${required}`,
  );
}

const evidence = {
  environment: "Biteship Testing Mode",
  simulatedOnly: true,
  orderId,
  referenceId: order.reference_id ?? null,
  finalOrderStatus: normalize(order.status),
  trackingId,
  finalTrackingStatus: normalize(tracking.status),
  trackingHistoryStatuses: history,
  exceptionStatesVerifiedByApi: ["return_in_transit", "returned"],
  onHoldDashboardEvidenceRequired: !history.includes("on_hold"),
};

await writeFile(
  "/tmp/mainlagi-biteship-exception-verification.json",
  JSON.stringify(evidence, null, 2) + "\n",
);

console.log(JSON.stringify(evidence, null, 2));
console.log(
  "Shop Biteship sandbox exception progression: returned flow + return_in_transit history PASS",
);
