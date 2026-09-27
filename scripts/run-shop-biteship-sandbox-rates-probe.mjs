import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name}_NOT_CONFIGURED`);
  return value;
}

const key = required("BITESHIP_TEST_API_KEY");
const contactName = required("BITESHIP_ORIGIN_CONTACT_NAME");
const contactPhone = required("BITESHIP_ORIGIN_CONTACT_PHONE");
const address = required("BITESHIP_ORIGIN_ADDRESS");
const originPostal = required("BITESHIP_ORIGIN_POSTAL_CODE");
const destinationPostal = required("BITESHIP_TEST_DESTINATION_POSTAL_CODE");
const couriers = required("BITESHIP_COURIERS");

assert.match(contactPhone, /^\+?[0-9]{9,15}$/, "origin phone format invalid");
assert.match(originPostal, /^\d{5}$/, "origin postal code must be 5 digits");
assert.match(destinationPostal, /^\d{5}$/, "destination postal code must be 5 digits");
assert.ok(address.length >= 10, "origin address is too short for sandbox acceptance");

const fixture = JSON.parse(
  await readFile(
    "docs/data/MAINLAGI_SHOP_BITESHIP_SANDBOX_FIXTURE_2026-09-27.json",
    "utf8",
  ),
);
assert.equal(fixture.productionUseAllowed, false);
assert.equal(fixture.products.length, 9, "sandbox fixture must cover all 9 products");

const seed = JSON.parse(await readFile("src/lib/shop/seed.json", "utf8"));
const prices = new Map(seed.map((row) => [row.code, row.price]));
const items = fixture.products.map((product) => {
  const value = prices.get(product.code);
  assert.ok(Number.isInteger(value) && value > 0, `missing seed price for ${product.code}`);
  return {
    name: `Mainlagi Shop Sandbox ${product.sku}`,
    value,
    quantity: 1,
    weight: product.weight_grams,
    length: Math.ceil(product.length_mm / 10),
    width: Math.ceil(product.width_mm / 10),
    height: Math.ceil(product.height_mm / 10),
  };
});

const payload = {
  origin_postal_code: Number(originPostal),
  destination_postal_code: Number(destinationPostal),
  couriers,
  items,
};

const response = await fetch("https://api.biteship.com/v1/rates/couriers", {
  method: "POST",
  headers: {
    Authorization: key,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(20000),
});

const raw = await response.text();
let body;
try {
  body = JSON.parse(raw);
} catch {
  throw new Error(`Biteship rates returned non-JSON HTTP ${response.status}`);
}

assert.equal(
  response.status,
  200,
  `Biteship rates probe failed HTTP ${response.status}: ${body?.message ?? "unknown"}`,
);
assert.equal(body?.success, true, "Biteship rates success=false");
assert.ok(Array.isArray(body?.pricing), "Biteship pricing array missing");

const policy = JSON.parse(
  await readFile("src/lib/shop/operational-policy.json", "utf8"),
);
const approved = new Set(
  (policy.ownerDecisions?.courierAllowlist?.services ?? []).map((row) =>
    String(row).toLowerCase(),
  ),
);

const available = body.pricing
  .filter((row) => row && typeof row === "object")
  .map((row) => ({
    service: `${String(row.courier_code ?? "").toLowerCase()}/${String(row.courier_service_code ?? "").toLowerCase()}`,
    price: row.price,
    duration: row.duration,
    shipping_type: row.shipping_type,
    collection: row.available_collection_method,
  }));

const approvedAvailable = available.filter((row) => approved.has(row.service));

console.log(
  JSON.stringify(
    {
      originConfigured: true,
      originContactConfigured: Boolean(contactName && contactPhone),
      originPostalCode: originPostal,
      destinationPostalCode: destinationPostal,
      testItemCount: items.length,
      testSkus: fixture.products.map((row) => row.sku),
      totalTestWeightGrams: fixture.products.reduce(
        (sum, row) => sum + row.weight_grams,
        0,
      ),
      requestedCouriers: couriers.split(","),
      returnedPricingRows: available.length,
      approvedPricingRows: approvedAvailable,
    },
    null,
    2,
  ),
);

assert.ok(
  available.length > 0,
  "Biteship returned no rate rows for the sandbox request",
);
assert.ok(
  approvedAvailable.length > 0,
  "Biteship returned rates but none matched the Mainlagi approved service allowlist",
);

console.log(
  "Shop Biteship sandbox rates: authenticated non-mutating rate lookup PASS",
);
