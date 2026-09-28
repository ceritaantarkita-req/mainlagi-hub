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
assert.equal(mappedPayment({ transaction_status: "deny" }), "failed");
assert.equal(mappedPayment({ transaction_status: "failure" }), "failed");
assert.equal(mappedPayment({ transaction_status: "cancel" }), "cancelled");
assert.equal(mappedPayment({ transaction_status: "expire" }), "expired");
assert.equal(mappedPayment({ transaction_status: "refund" }), "refunded");
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
assert.equal(
  validMidtransStatus(
    { ...paidStatus, transaction_id: "" },
    "MLG-20260927-ABCDEF123456",
    79000,
  ),
  false,
);
assert.equal(
  validMidtransStatus(
    {
      ...paidStatus,
      transaction_status: "pending",
      status_code: "500",
    },
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
const productCandidates = JSON.parse(
  await readFile(
    "docs/data/MAINLAGI_SHOP_PRODUCT_TRUTH_MARKETPLACE_CANDIDATE_2026-09-28.json",
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
const shopPolicyPageSource = await readFile(
  "src/app/shop/policies/page.tsx",
  "utf8",
);
const shopCheckoutSource = await readFile(
  "src/components/shop/CartCheckout.tsx",
  "utf8",
);
const shopOrderStatusSource = await readFile(
  "src/components/shop/OrderStatus.tsx",
  "utf8",
);
const shopProviderSource = await readFile(
  "src/lib/shop/providers.ts",
  "utf8",
);
const shopApiRouteSource = await readFile(
  "src/app/api/shop/[...path]/route.ts",
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
assert.equal(productCandidates.status, "marketplace_candidate_unverified");
assert.equal(productCandidates.products.length, 9);
assert.equal(
  productCandidates.products.reduce((sum, p) => sum + p.variants.length, 0),
  26,
);
assert.equal(
  productCandidates.products.reduce(
    (sum, p) => sum + p.variants.reduce((n, v) => n + v.stock, 0),
    0,
  ),
  79,
);
for (const candidate of productCandidates.products) {
  const seeded = seed.find((product) => product.code === candidate.code);
  assert.ok(seeded, `candidate product ${candidate.code} must exist in Shop seed`);
  assert.equal(
    candidate.variants.reduce((sum, variant) => sum + variant.stock, 0),
    seeded.initialStock,
    `candidate allocation for ${candidate.code} must preserve owner-approved initial stock`,
  );
}
assert.equal(readiness.batch02Status, "done");
assert.equal(readiness.batch03Authorization.allowed, true);
assert.equal(readiness.batch03Status, "done");
assert.equal(readiness.batch04Authorization.allowed, true);
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
assert.match(
  await readFile("src/components/shop/ProductAdminEditor.tsx", "utf8"),
  /verificationStatus[sS]*marketplace_candidate_unverified[sS]*production_verified/,
  "admin product workflow must expose the explicit physical\/supplier verification gate",
);
assert.match(shopPolicyPageSource, /Belanja dengan aturan yang jelas/);
assert.match(shopPolicyPageSource, /Buka WhatsApp/);
assert.match(shopPolicyPageSource, /operationalPolicy\.ownerDecisions/);
assert.match(shopCheckoutSource, /\/shop\/policies/);
assert.match(shopOrderStatusSource, /\/shop\/policies/);
assert.match(shopProviderSource, /AbortSignal\.timeout\(15000\)/);
assert.match(
  shopOperationsSource,
  /biteship\("\/v1\/rates\/couriers"/,
  "Shop must use the canonical Biteship Rates API endpoint /v1/rates/couriers",
);
assert.match(
  shopOperationsSource,
  /40002060[\s\S]*typeof e\.details\.order_id === "string"[\s\S]*rekonsiliasi manual/,
  "duplicate-reference without provider order id must fail closed to manual reconciliation",
);
assert.doesNotMatch(
  shopOperationsSource,
  /biteship\("\/v1\/rates"/,
  "obsolete /v1/rates endpoint must not return",
);
assert.match(
  shopApiRouteSource,
  /biteship\/webhook"[\s\S]*allowEmptyObject:\s*true[\s\S]*isInstallProbe[\s\S]*return json\(\{ ok: true \}\)[\s\S]*verifyBiteship\(request\)/,
  "Biteship install probe may return 200 only before real-event signature verification",
);
assert.match(
  shopApiRouteSource,
  /SHOP_BITESHIP_SANDBOX_ACCEPTANCE[\s\S]*reference\.startsWith\("ML-SBX-"\)[\s\S]*sandboxAcceptance/,
  "sandbox webhook acceptance must be explicitly enabled and restricted to ML-SBX references",
);
assert.match(
  shopApiRouteSource,
  /verifyMidtrans\(b\);[\s\S]*await reconcile\(field\(b, "order_id", 50\)\)/,
);
const midtransWebhookBlock = shopApiRouteSource
  .split('if (post && route === "midtrans/notification") {')[1]
  ?.split('if (post && route === "biteship/webhook") {')[0];
assert.ok(midtransWebhookBlock, "Midtrans notification route block must exist");
assert.match(midtransWebhookBlock, /verifyMidtrans\(b\)/);
assert.match(midtransWebhookBlock, /await reconcile\(field\(b, "order_id", 50\)\)/);
assert.doesNotMatch(
  midtransWebhookBlock,
  /shop_apply_payment/,
  "Midtrans webhook body must not directly apply payment state",
);
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
  "Shop contracts: Midtrans signature/status integrity, provider state mapping, Batch 02/03 readiness, Batch 04 policy, 9 products / 26 marketplace candidate variants / 79 stock, explicit physical-supplier verification gate, 26 approved runtime media + 1 rejected provenance asset PASS",
);


assert.match(
  shopServerSource,
  /SHOP_STAGING_ACCEPTANCE_ENABLED[\s\S]*SHOP_STAGING_ACCEPTANCE_SECRET[\s\S]*x-mainlagi-shop-staging-secret[\s\S]*equal\(actual, expected\)/,
  "staging acceptance bypass must be fail-closed, secret-gated and timing-safe",
);
assert.match(
  shopServerSource,
  /salesEnabled\(request\?[\s\S]*SHOP_SALES_ENABLED[\s\S]*stagingAcceptance[\s\S]*operationalPolicyBlockers/,
  "staging acceptance may bypass only the public sales flag; operational policy blockers must still apply",
);
assert.match(
  shopApiRouteSource,
  /\["cart", "shipping\/rates", "checkout"\][\s\S]*salesEnabled\(request\)/,
  "Shop mutation routes must pass the request into the secret-gated staging sales check",
);
