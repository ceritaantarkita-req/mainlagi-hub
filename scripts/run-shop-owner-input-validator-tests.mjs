import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateOwnerInput } from "./validate-shop-owner-input.mjs";

const templatePath = path.join(
  process.cwd(),
  "docs",
  "data",
  "P0_OPEN02B_SHOP_OWNER_INPUT_TEMPLATE_2026-10-02.json",
);
const template = JSON.parse(readFileSync(templatePath, "utf8"));
const clone = (value) => JSON.parse(JSON.stringify(value));

const pending = validateOwnerInput(clone(template));
assert.equal(pending.valid, true, pending.errors.join("\n"));
assert.equal(pending.ready, false);
assert.deepEqual(pending.summary, {
  products: 9,
  variants: 27,
  verifiedProducts: 0,
  verifiedVariants: 0,
  piiRetentionStatus: "pending",
});

const requireReady = validateOwnerInput(clone(template), { requireReady: true });
assert.equal(requireReady.valid, false);
assert.match(requireReady.errors.join("\n"), /release-readiness gate requested/);

const fakeProduct = clone(template);
fakeProduct.products[0].status = "production_verified";
fakeProduct.totals.verifiedProducts = 1;
const fakeProductResult = validateOwnerInput(fakeProduct);
assert.equal(fakeProductResult.valid, false);
assert.match(fakeProductResult.errors.join("\n"), /verification\.method is not accepted/);
assert.match(fakeProductResult.errors.join("\n"), /productFactsConfirmed=true/);

const badRetention = clone(template);
badRetention.piiRetention = {
  ...badRetention.piiRetention,
  status: "approved",
  productionDays: 29,
  ownerDecisionEvidence: "owner-note",
};
const badRetentionResult = validateOwnerInput(badRetention);
assert.equal(badRetentionResult.valid, false);
assert.match(badRetentionResult.errors.join("\n"), /30\.\.3650/);

const driftedTotals = clone(template);
driftedTotals.totals.verifiedVariants = 1;
const driftedTotalsResult = validateOwnerInput(driftedTotals);
assert.equal(driftedTotalsResult.valid, false);
assert.match(driftedTotalsResult.errors.join("\n"), /totals\.verifiedVariants drifted/);

const complete = clone(template);
complete.piiRetention = {
  ...complete.piiRetention,
  status: "approved",
  productionDays: 365,
  ownerDecisionEvidence: "synthetic-validator-test-owner-decision",
};

for (const product of complete.products) {
  product.status = "production_verified";
  product.verification = {
    method: "supplier_production_sheet",
    verifiedBy: "synthetic-validator-test",
    verifiedAt: "2026-10-03T00:00:00.000Z",
    evidenceRef: `synthetic://validator-test/${product.code}`,
    notes: "Synthetic unit-test fixture only; never production evidence.",
    productFactsConfirmed: true,
    stockCountConfirmed: true,
  };

  for (const fact of product.productFactChecks) {
    fact.actualValue = fact.candidateValue;
    fact.status = "verified";
    fact.evidenceNote = "Synthetic unit-test fixture only.";
  }

  for (const variant of product.variants) {
    variant.status = "verified";
    variant.actual.stock = variant.candidate.stock;
    variant.actual.weightGrams = variant.candidate.weightGrams;
    variant.actual.packageMm = [...variant.candidate.packageMm];
    variant.actual.attributes = { ...(variant.candidate.attributes ?? {}) };
    variant.checks = {
      identityMatched: true,
      physicalOrSupplierEvidenceSeen: true,
      weightConfirmed: true,
      packageDimensionsConfirmed: true,
      optionMeasurementsConfirmed: true,
    };
    variant.evidenceNote = "Synthetic unit-test fixture only.";
  }
}

complete.totals.verifiedProducts = 9;
complete.totals.verifiedVariants = 27;
const completeResult = validateOwnerInput(complete, { requireReady: true });
assert.equal(completeResult.valid, true, completeResult.errors.join("\n"));
assert.equal(completeResult.ready, true);
assert.deepEqual(completeResult.summary, {
  products: 9,
  variants: 27,
  verifiedProducts: 9,
  verifiedVariants: 27,
  piiRetentionStatus: "approved",
});

console.log(JSON.stringify({
  status: "PASS",
  cases: 5,
  canonicalPendingTemplateValid: pending.valid,
  canonicalPendingTemplateReady: pending.ready,
  syntheticCompleteFixtureReady: completeResult.ready,
}));
