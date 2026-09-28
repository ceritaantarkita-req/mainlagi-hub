import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

execFileSync(
  process.execPath,
  ["--check", "scripts/run-shop-batch11-integrated-e2e.mjs"],
  { stdio: "inherit" },
);

const files = {
  env: await readFile(".env.example", "utf8"),
  server: await readFile("src/lib/shop/server.ts", "utf8"),
  route: await readFile("src/app/api/shop/[...path]/route.ts", "utf8"),
  operations: await readFile("src/lib/shop/operations.ts", "utf8"),
  workflow: await readFile(".github/workflows/ci.yml", "utf8"),
  batch11Workflow: await readFile(
    ".github/workflows/shop-batch11-staging.yml",
    "utf8",
  ),
  integratedE2e: await readFile(
    "scripts/run-shop-batch11-integrated-e2e.mjs",
    "utf8",
  ),
  gate: await readFile(
    "docs/MAINLAGI_SHOP_BATCH11_LAUNCH_GATE_2026-09-27.md",
    "utf8",
  ),
  candidateMigration: await readFile(
    "supabase/migrations/20260928143000_shop_batch11_marketplace_candidate_variants.sql",
    "utf8",
  ),
  candidateData: await readFile(
    "docs/data/MAINLAGI_SHOP_PRODUCT_TRUTH_MARKETPLACE_CANDIDATE_2026-09-28.json",
    "utf8",
  ),
  shippingDimensionMigration: await readFile(
    "supabase/migrations/20260928144000_shop_batch11_shipping_dimensions.sql",
    "utf8",
  ),
  verificationEvidenceMigration: await readFile(
    "supabase/migrations/20260928145000_shop_batch11_physical_supplier_verification.sql",
    "utf8",
  ),
  verificationPack: await readFile(
    "docs/data/MAINLAGI_SHOP_PHYSICAL_SUPPLIER_VERIFICATION_2026-09-28.json",
    "utf8",
  ),
};

for (const name of [
  "SHOP_STAGING_ACCEPTANCE_ENABLED",
  "SHOP_STAGING_ACCEPTANCE_SECRET",
  "SHOP_STAGING_URL",
  "SHOP_CRON_SECRET",
  "SHOP_ORDER_PII_RETENTION_DAYS",
]) {
  assert.match(files.env, new RegExp(`^${name}=.*$`, "m"), `missing ${name} in .env.example`);
}

assert.match(
  files.server,
  /SHOP_STAGING_ACCEPTANCE_ENABLED[\s\S]*SHOP_STAGING_ACCEPTANCE_SECRET[\s\S]*x-mainlagi-shop-staging-secret/,
);
assert.match(
  files.server,
  /SHOP_SALES_ENABLED[\s\S]*stagingAcceptance[\s\S]*operationalPolicyBlockers/,
  "staging acceptance must not bypass operational policy checks",
);
assert.match(
  files.route,
  /salesEnabled\(request\)/,
  "Shop cart/rates/checkout must use request-aware sales gating",
);
assert.match(
  files.gate,
  /Batch 11 must remain \*\*BLOCKED\*\*/,
  "Batch 11 must remain fail-closed until owner/data/remote-staging prerequisites pass",
);
assert.match(
  files.workflow,
  /EXPECTED_SUPABASE_PROJECT_REF:\s*estvtgflwkebomsqlolv/,
  "production Supabase project reference must remain explicit for anti-staging guardrails",
);
for (const required of [
  "supabase/setup-cli@v1",
  "supabase start",
  "supabase status -o env",
  "supabase db reset --local",
  "trycloudflare",
  "SHOP_STAGING_ACCEPTANCE_SECRET",
  "SHOP_CRON_SECRET",
]) {
  assert.match(
    files.batch11Workflow,
    new RegExp(required),
    `Batch 11 staging workflow missing ${required}`,
  );
}
assert.doesNotMatch(
  files.batch11Workflow,
  /SHOP_STAGING_SUPABASE_(?:URL|ANON_KEY|SERVICE_ROLE_KEY)/,
  "free Batch 11 staging must not require a paid remote Supabase branch/project",
);
assert.match(
  files.batch11Workflow,
  /SHOP_SALES_ENABLED(?::|=)\s*["']?false["']?/,
  "Batch 11 database-backed staging must keep public sales disabled",
);
assert.match(
  files.batch11Workflow,
  /crons": \["\*\/5 \* \* \* \*"\]/,
  "Batch 11 workflow must exercise a real temporary Cloudflare cron trigger",
);

console.log(
  "Shop Batch 11 preflight PASS: staging bypass is secret-gated, public sales remain fail-closed, production Supabase identity remains explicit, and unresolved launch gates are not silently marked complete.",
);

assert.doesNotMatch(
  files.batch11Workflow,
  /cloudflared tunnel[\s\S]*5432[12]/,
  "Supabase API/database ports must never be exposed by the public Quick Tunnel",
);
assert.doesNotMatch(
  files.batch11Workflow,
  /cloudflared tunnel[\s\S]*54321/,
  "local Supabase API must never be exposed by the public Quick Tunnel",
);


assert.match(
  files.batch11Workflow,
  /DELETE[\s\S]*workers\/scripts\/\$CRON_WORKER_NAME/,
  "temporary Cloudflare cron cleanup must use the direct Workers API and not depend on unrelated KV permissions",
);

assert.match(
  files.batch11Workflow,
  /BITESHIP_ORIGIN_CONTACT_PHONE format invalid[\s\S]*BITESHIP_ORIGIN_POSTAL_CODE format invalid/,
  "free staging must fail safely on malformed private origin secret formats without printing their values",
);

assert.match(
  files.batch11Workflow,
  /Normalize private origin secret wrappers safely[\s\S]*::add-mask::[\s\S]*GITHUB_ENV/,
  "free staging must normalize quoted private origin secrets without exposing normalized values",
);
assert.match(
  files.batch11Workflow,
  /Owner operational-policy contract PASS/,
  "free staging must verify the owner-approved operational-policy contract instead of treating it as unresolved",
);


assert.match(
  files.batch11Workflow,
  /^on:\s*\n\s+workflow_dispatch:\s*$/m,
  "Batch 11 free staging must remain manual-only via workflow_dispatch",
);
assert.doesNotMatch(
  files.batch11Workflow,
  /^\s+(?:push|pull_request|schedule):/m,
  "Batch 11 free staging must not gain automatic push/PR/schedule triggers",
);
assert.match(
  files.batch11Workflow,
  /Run full integrated DB-backed provider E2E[\s\S]*run-shop-batch11-integrated-e2e\.mjs/,
  "manual free staging must execute the integrated DB-backed provider E2E harness",
);
for (const required of [
  "008-A5-80-LINED",
  ".trycloudflare.com",
  "biteship_test.",
  "api.sandbox.midtrans.com",
  "createServerClient",
  "signInWithPassword",
  "context.addCookies",
  "admin/pack",
  "admin/ship",
  "biteship/webhook",
  "/api/shop/reconcile",
]) {
  assert.ok(
    files.integratedE2e.includes(required),
    "integrated Batch 11 E2E missing boundary: " + required,
  );
}
assert.match(
  files.integratedE2e,
  /email_confirm:\s*true[\s\S]*profiles\?select=id,role[\s\S]*role:\s*"owner"/,
  "integrated E2E must create/promote an ephemeral local owner instead of bypassing owner auth",
);
assert.match(
  files.integratedE2e,
  /createServerClient[\s\S]*signInWithPassword[\s\S]*context\.addCookies/,
  "integrated E2E must establish the ephemeral owner session through Supabase SSR cookies",
);
assert.match(
  files.operations,
  /SHOP_STAGING_ACCEPTANCE_ENABLED\s*===\s*"true"[\s\S]*MIDTRANS_IS_PRODUCTION\s*!==\s*"true"[\s\S]*enabled_payments:\s*\["permata_va"\]/,
  "staging Snap must be constrained to Permata VA only in non-production staging acceptance",
);
assert.doesNotMatch(
  files.route,
  /staging\/(?:pack|ship)/,
  "Batch 11 must not add staging-only fulfillment bypass routes",
);
assert.match(
  files.integratedE2e,
  /usedRealProductionProductFacts:\s*false[\s\S]*choseProductionPiiRetention:\s*false/,
  "integrated E2E must explicitly remain independent from product-truth and production-PII decisions",
);

console.log(
  "Shop Batch 11 integrated E2E guard PASS: manual-only staging now covers the real app cart/rates/checkout/payment/owner-pack/shipping/webhook/tracking/reconcile path without a staging owner bypass or production-provider mode.",
);


const candidate = JSON.parse(files.candidateData);
assert.equal(candidate.products.length, 9);
assert.equal(
  candidate.products.reduce((n, product) => n + product.variants.length, 0),
  27,
);
assert.equal(
  candidate.products.reduce(
    (n, product) =>
      n + product.variants.reduce((sum, variant) => sum + variant.stock, 0),
    0,
  ),
  79,
);
assert.match(
  files.candidateMigration,
  /marketplace_candidate_unverified[\s\S]*production_verified/,
  "candidate migration must preserve the physical/supplier verification gate",
);
assert.match(
  files.candidateMigration,
  /Marketplace benchmark candidate allocation — unverified/,
  "candidate stock ledger must remain explicitly unverified",
);
assert.doesNotMatch(
  files.candidateMigration,
  /SHOP_SALES_ENABLED|MIDTRANS_IS_PRODUCTION|BITESHIP_API_KEY/,
  "product candidate migration must not alter sales/provider configuration",
);

console.log(
  "Shop Batch 11 product candidate guard PASS: 9 products / 27 variants / 79 stock are seeded as unverified marketplace candidates and remain activation-blocked until physical or supplier verification.",
);


assert.match(
  files.shippingDimensionMigration,
  /length_mm_snapshot[\s\S]*width_mm_snapshot[\s\S]*height_mm_snapshot/,
  "checkout must persist immutable packed-dimension snapshots",
);
assert.match(
  files.shippingDimensionMigration,
  /shop_cart_signature[\s\S]*length_mm[\s\S]*width_mm[\s\S]*height_mm/,
  "shipping quote signature must include packed dimensions",
);
assert.match(
  files.operations,
  /length:\s*shippingDimensionCm\(v\.length_mm\)[\s\S]*width:\s*shippingDimensionCm\(v\.width_mm\)[\s\S]*height:\s*shippingDimensionCm\(v\.height_mm\)/,
  "Biteship rate request must include packed candidate dimensions",
);
assert.match(
  files.operations,
  /length:\s*shippingDimensionCm\(i\.length_mm_snapshot\)[\s\S]*width:\s*shippingDimensionCm\(i\.width_mm_snapshot\)[\s\S]*height:\s*shippingDimensionCm\(i\.height_mm_snapshot\)/,
  "Biteship order request must use immutable packed-dimension snapshots",
);

console.log(
  "Shop Batch 11 shipping-dimension guard PASS: quote signature, checkout snapshots, rates and order creation use the same packed dimensions.",
);


const verificationPack = JSON.parse(files.verificationPack);
assert.equal(verificationPack.status, "pending_physical_supplier_verification");
assert.equal(verificationPack.products.length, 9);
assert.equal(
  verificationPack.products.reduce((sum, product) => sum + product.variants.length, 0),
  27,
);
assert.equal(verificationPack.totals.verifiedProducts, 0);
assert.equal(verificationPack.totals.verifiedVariants, 0);
for (const product of verificationPack.products) {
  assert.equal(product.status, "pending");
  for (const fact of product.productFactChecks) {
    assert.equal(fact.actualValue, null);
    assert.equal(fact.status, "pending");
  }
  for (const variant of product.variants) {
    assert.equal(variant.status, "pending");
    assert.equal(variant.actual.weightGrams, null);
  }
}
for (const required of [
  "Verification method is required.",
  "Verifier identity is required.",
  "Verification date is required.",
  "Verification evidence reference is required.",
  "Marketplace candidate baseline must remain available for verification.",
  "Every marketplace candidate product fact needs an actual verified value.",
  "Every active SKU must be covered by physical/supplier verification evidence.",
]) {
  assert.ok(
    files.verificationEvidenceMigration.includes(required),
    "physical/supplier DB gate missing: " + required,
  );
}
assert.match(
  files.batch11Workflow,
  /fixtureOnly[\s\S]*Batch11 simulated fixture[\s\S]*fixture:\/\/batch11\/sku-008/,
  "Batch 11 staging must keep verification evidence explicitly simulated and disposable",
);
assert.doesNotMatch(
  files.verificationPack,
  /"verifiedProducts"\s*:\s*[1-9]|"verifiedVariants"\s*:\s*[1-9]/,
  "verification pack must not fabricate completed physical verification",
);

console.log(
  "Shop physical/supplier verification guard PASS: 9 products / 27 variants remain pending, actual values are blank, and production verification requires auditable evidence plus active-SKU coverage.",
);
