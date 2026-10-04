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

const endpoint = "https://api.biteship.com/v1/couriers";
const candidates = [
  { name: "raw-authorization", value: key },
  {
    name: "basic-username",
    value: `Basic ${Buffer.from(`${key}:`).toString("base64")}`,
  },
  {
    name: "basic-password",
    value: `Basic ${Buffer.from(`:${key}`).toString("base64")}`,
  },
];

let response;
let payload;
let authScheme = null;
const attempts = [];

for (const candidate of candidates) {
  const candidateResponse = await fetch(endpoint, {
    headers: {
      Authorization: candidate.value,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });
  const raw = await candidateResponse.text();
  let candidatePayload;
  try {
    candidatePayload = JSON.parse(raw);
  } catch {
    candidatePayload = null;
  }
  attempts.push({
    scheme: candidate.name,
    status: candidateResponse.status,
    success: candidatePayload?.success === true,
    code:
      typeof candidatePayload?.code === "number" ||
      typeof candidatePayload?.code === "string"
        ? candidatePayload.code
        : null,
  });
  if (candidateResponse.status === 200 && candidatePayload?.success === true) {
    response = candidateResponse;
    payload = candidatePayload;
    authScheme = candidate.name;
    break;
  }
}

assert.ok(
  response && payload,
  `Biteship courier authentication failed for every supported scheme: ${JSON.stringify(attempts)}`,
);
assert.equal(response.status, 200);
assert.equal(payload.success, true);
assert.ok(Array.isArray(payload.couriers), "Biteship couriers array missing");

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
      authScheme,
      authAttempts: attempts,
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
