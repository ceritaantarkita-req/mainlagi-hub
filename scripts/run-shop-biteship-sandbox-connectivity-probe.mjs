import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const key = process.env.BITESHIP_TEST_API_KEY?.trim();
if (!key) throw new Error("BITESHIP_TEST_API_KEY_NOT_CONFIGURED");
const policy = JSON.parse(
  await readFile("src/lib/shop/operational-policy.json", "utf8"),
);
const approvedCouriers =
  policy.ownerDecisions?.courierAllowlist?.couriers ?? [];
const approvedServices =
  policy.ownerDecisions?.courierAllowlist?.services ?? [];

const response = await fetch("https://api.biteship.com/v1/couriers", {
  headers: {
    Authorization: key,
    Accept: "application/json",
  },
  signal: AbortSignal.timeout(15000),
});

const raw = await response.text();
let payload;
try {
  payload = JSON.parse(raw);
} catch {
  throw new Error(
    `Biteship courier probe returned non-JSON HTTP ${response.status}`,
  );
}

assert.equal(
  response.status,
  200,
  `Biteship courier probe failed HTTP ${response.status}: ${payload?.message ?? "unknown"}`,
);
assert.equal(payload?.success, true, "Biteship courier probe success=false");
assert.ok(Array.isArray(payload?.couriers), "Biteship couriers array missing");

const available = new Set(
  payload.couriers
    .filter(
      (row) =>
        row &&
        typeof row.courier_code === "string" &&
        typeof row.courier_service_code === "string",
    )
    .map((row) => `${row.courier_code.toLowerCase()}/${row.courier_service_code.toLowerCase()}`),
);
const courierCodes = new Set(
  payload.couriers
    .map((row) =>
      typeof row?.courier_code === "string"
        ? row.courier_code.toLowerCase()
        : "",
    )
    .filter(Boolean),
);

const missingCouriers = approvedCouriers.filter(
  (code) => !courierCodes.has(String(code).toLowerCase()),
);
const missingServices = approvedServices.filter(
  (service) => !available.has(String(service).toLowerCase()),
);

console.log(
  JSON.stringify(
    {
      credentialConfigured: true,
      endpoint: "/v1/couriers",
      availableCourierRows: payload.couriers.length,
      approvedCouriers,
      approvedServices,
      missingCouriers,
      missingServices,
    },
    null,
    2,
  ),
);

assert.deepEqual(
  missingCouriers,
  [],
  `Approved courier codes unavailable in Biteship: ${missingCouriers.join(", ")}`,
);
assert.deepEqual(
  missingServices,
  [],
  `Approved courier/service pairs unavailable in Biteship: ${missingServices.join(", ")}`,
);

console.log(
  "Shop Biteship sandbox connectivity: test-key auth + approved courier/service availability PASS",
);
