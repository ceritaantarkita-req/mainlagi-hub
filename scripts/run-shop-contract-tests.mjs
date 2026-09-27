import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import ts from "typescript";
const source = await readFile("src/lib/shop/protocol.ts", "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const { validMidtransSignature, validMidtransStatus, mappedPayment } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const notification = {
  order_id: "MLG-20260927-ABCDEF123456",
  status_code: "200",
  gross_amount: "79000.00",
};
const key = "test-only-not-a-real-provider-key";
notification.signature_key = createHash("sha512")
  .update(
    notification.order_id +
      notification.status_code +
      notification.gross_amount +
      key,
  )
  .digest("hex");
assert.ok(validMidtransSignature(notification, key));
assert.equal(
  validMidtransSignature({ ...notification, gross_amount: "1.00" }, key),
  false,
);
assert.equal(
  validMidtransSignature({ ...notification, signature_key: "bad" }, key),
  false,
);
assert.equal(validMidtransSignature(notification, ""), false);
assert.equal(
  mappedPayment({ transaction_status: "capture", fraud_status: "challenge" }),
  "pending",
);
assert.equal(
  mappedPayment({ transaction_status: "capture", fraud_status: "accept" }),
  "paid",
);
assert.equal(
  mappedPayment({ transaction_status: "settlement", fraud_status: "deny" }),
  "review",
);
assert.equal(
  mappedPayment({ transaction_status: "capture", fraud_status: "challenge" }),
  "pending",
);
assert.equal(mappedPayment({ transaction_status: "failure" }), "failed");
assert.equal(mappedPayment({ transaction_status: "chargeback" }), "review");
assert.equal(mappedPayment({ transaction_status: "partial_refund" }), "review");
assert.equal(
  mappedPayment({ transaction_status: "future_unknown_status" }),
  "pending",
);
const paidStatus = {
  order_id: "MLG-20260927-ABCDEF123456",
  transaction_id: "trx-1",
  transaction_status: "settlement",
  status_code: "200",
  gross_amount: "79000.00",
  fraud_status: "accept",
};
assert.ok(
  validMidtransStatus(paidStatus, "MLG-20260927-ABCDEF123456", 79000),
);
assert.equal(
  validMidtransStatus(
    { ...paidStatus, status_code: "201" },
    "MLG-20260927-ABCDEF123456",
    79000,
  ),
  false,
  "paid state requires provider success status_code 200",
);
assert.ok(
  validMidtransStatus(
    {
      ...paidStatus,
      transaction_status: "pending",
      status_code: "201",
    },
    "MLG-20260927-ABCDEF123456",
    79000,
  ),
  "pending provider state accepts documented 201 status code",
);
assert.equal(
  validMidtransStatus(
    { ...paidStatus, order_id: "wrong-order" },
    "MLG-20260927-ABCDEF123456",
    79000,
  ),
  false,
);
assert.equal(
  validMidtransStatus(
    { ...paidStatus, gross_amount: "1.00" },
    "MLG-20260927-ABCDEF123456",
    79000,
  ),
  false,
);
const seed = JSON.parse(await readFile("src/lib/shop/seed.json", "utf8"));
const manifest = JSON.parse(
  await readFile(
    "docs/data/MAINLAGI_SHOP_MEDIA_MANIFEST_2026-09-27.json",
    "utf8",
  ),
);
const readiness = JSON.parse(
  await readFile(
    "docs/data/MAINLAGI_SHOP_PRODUCT_READINESS_2026-09-27.json",
    "utf8",
  ),
);
const operationalPolicy = JSON.parse(
  await readFile("src/lib/shop/operational-policy.json", "utf8"),
);
const operationalPolicySource = await readFile(
  "src/lib/shop/operationalPolicy.ts",
  "utf8",
);
const shopServerSource = await readFile("src/lib/shop/server.ts", "utf8");
const shopOperationsSource = await readFile(
  "src/lib/shop/operations.ts",
  "utf8",
);
const shopAdminSource = await readFile(
  "src/app/admin/shop/[section]/page.tsx",
  "utf8",
);
assert.equal(seed.length, 9);
assert.equal(manifest.length, 27);
assert.equal(manifest.filter((m) => m.approval === "approved").length, 26);
assert.equal(manifest.filter((m) => m.approval === "rejected").length, 1);
assert.deepEqual(
  seed.map((p) => p.initialStock),
  [9, 7, 6, 12, 8, 10, 7, 11, 9],
);
assert.deepEqual(
  seed.map((p) => p.price),
  [69000, 74000, 120000, 45000, 150000, 89000, 89000, 25000, 35000],
);
assert.equal(readiness.batch02Status, "done");
assert.equal(readiness.batch03Authorization.allowed, true);
assert.equal(readiness.batch03Status, "done");
assert.equal(readiness.batch04Authorization.allowed, true);
assert.equal(operationalPolicy.status, "pending_owner_input");
assert.equal(
  operationalPolicy.currentImplementedBehavior.paymentExpiryMinutes,
  30,
);
assert.equal(
  operationalPolicy.currentImplementedBehavior.shippingQuoteExpiryMinutes,
  15,
);
assert.equal(
  operationalPolicy.currentImplementedBehavior.collectionMethod,
  "pickup",
);
assert.equal(
  operationalPolicy.currentImplementedBehavior.shippingType,
  "parcel",
);
assert.equal(
  operationalPolicy.currentImplementedBehavior.instantServiceAllowed,
  false,
);
assert.equal(
  operationalPolicy.currentImplementedBehavior.partialRefundHandling,
  "manual_review",
);
assert.equal(operationalPolicy.status, "approved");
for (const [name, decision] of Object.entries(operationalPolicy.ownerDecisions)) {
  assert.equal(
    decision.approved,
    true,
    `${name} must remain owner-approved after Batch 04 approval`,
  );
}
assert.deepEqual(operationalPolicy.ownerDecisions.courierAllowlist.couriers, [
  "jne",
  "jnt",
  "sicepat",
  "anteraja",
  "ninja",
]);
assert.deepEqual(operationalPolicy.ownerDecisions.courierAllowlist.services, [
  "jne/reg",
  "jnt/ez",
  "sicepat/reg",
  "anteraja/reg",
  "ninja/standard",
]);
assert.equal(operationalPolicy.ownerDecisions.packingHandling.handlingFeeAmount, 0);
assert.equal(operationalPolicy.ownerDecisions.support.channel, "whatsapp");
assert.equal(
  operationalPolicy.ownerDecisions.support.hours,
  "Senin-Jumat, 09:00-17:00 WIB",
);
assert.equal(
  operationalPolicy.ownerDecisions.support.contact,
  "+6281280769076",
);
assert.equal(operationalPolicy.ownerDecisions.paymentExpiry.minutes, 30);
assert.ok(operationalPolicy.ownerDecisions.cancellation.publicPolicy);
assert.ok(operationalPolicy.ownerDecisions.returnExchange.publicPolicy);
assert.ok(operationalPolicy.ownerDecisions.refund.publicPolicy);
assert.deepEqual(operationalPolicy.ownerDecisions.customerNotifications.channels, []);
assert.match(operationalPolicySource, /operationalPolicyBlockers/);
assert.match(operationalPolicySource, /couriers_env_mismatch/);
assert.match(operationalPolicySource, /operationalCourierServiceAllowed/);
assert.match(shopOperationsSource, /operationalCourierServiceAllowed/);
assert.match(shopServerSource, /operationalPolicyBlockers\(\)/);
assert.match(
  shopServerSource,
  /konfigurasi operasional belum lengkap/i,
);
assert.ok(
  (shopOperationsSource.match(/operationalPolicyBlockers\(\)\.length/g) ?? [])
    .length >= 2,
  "rates and shipment creation must both keep the operational readiness guard",
);
assert.match(shopAdminSource, /"settings"/);
assert.match(shopAdminSource, /Kesiapan operasional Shop/);
assert.equal(readiness.products.length, 9);
assert.deepEqual(
  readiness.products.map((p) => p.approvedTotalStock),
  seed.map((p) => p.initialStock),
);
assert.deepEqual(
  readiness.products.map((p) => p.price),
  seed.map((p) => p.price),
);
assert.equal(
  new Set(manifest.map((m) => m.sourceSha256)).size,
  26,
  "known duplicate source remains explicit",
);
for (const product of seed) {
  assert.equal(product.status, "draft");
  assert.equal(product.media.length, product.code === "006" ? 2 : 3);
  for (const media of product.media) {
    const row = manifest.find((m) => m.path === media.path);
    assert.ok(row);
    assert.equal(row.approval, "approved");
    assert.equal(
      createHash("sha256")
        .update(await readFile(`public${media.path}`))
        .digest("hex"),
      row.sha256,
    );
  }
}
assert.ok(
  !seed
    .find((p) => p.code === "006")
    .media.some(
      (m) =>
        m.path ===
        "/shop/products/mainlagi-shop-006-kids-tumbler-alternate-v1.webp",
    ),
  "rejected duplicate tumbler alternate is not runtime media",
);
console.log(
  "Shop contracts: Midtrans signature/status integrity, provider state mapping, Batch 02/03 readiness, Batch 04 fail-closed operational contract, 9 products, 26 approved runtime media + 1 rejected provenance asset PASS",
);
