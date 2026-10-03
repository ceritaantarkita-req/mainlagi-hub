import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DEFAULT_OWNER_INPUT_PATH = path.join(
  root,
  "docs",
  "data",
  "P0_OPEN02B_SHOP_OWNER_INPUT_TEMPLATE_2026-10-02.json",
);

const EXPECTED_PRODUCT_CODES = ["001", "002", "003", "004", "005", "006", "007", "008", "009"];
const ACCEPTED_METHODS = new Set(["physical_sample", "supplier_production_sheet"]);
const PRODUCT_STATUSES = new Set(["pending", "production_verified"]);
const FACT_STATUSES = new Set(["pending", "verified"]);
const VARIANT_STATUSES = new Set(["pending", "verified"]);

const nonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const finitePositive = (value) => Number.isFinite(value) && value > 0;
const nonNegativeInteger = (value) => Number.isInteger(value) && value >= 0;
const present = (value) => value !== null && value !== undefined && value !== "";

function push(errors, condition, message) {
  if (!condition) errors.push(message);
}

function validatePiiRetention(piiRetention, errors) {
  push(errors, piiRetention && typeof piiRetention === "object", "piiRetention must be an object");
  if (!piiRetention || typeof piiRetention !== "object") return false;

  const min = piiRetention.allowedRangeDays?.min;
  const max = piiRetention.allowedRangeDays?.max;
  push(errors, min === 30 && max === 3650, "piiRetention allowed range must remain exactly 30..3650 days");

  if (piiRetention.status === "pending") {
    push(errors, piiRetention.productionDays === null, "pending PII retention must keep productionDays=null");
    push(errors, piiRetention.ownerDecisionEvidence === null, "pending PII retention must keep ownerDecisionEvidence=null");
    return false;
  }

  push(errors, piiRetention.status === "approved", "piiRetention.status must be pending or approved");
  if (piiRetention.status !== "approved") return false;

  push(
    errors,
    Number.isInteger(piiRetention.productionDays) &&
      piiRetention.productionDays >= 30 &&
      piiRetention.productionDays <= 3650,
    "approved productionDays must be an integer in the 30..3650 day range",
  );
  push(
    errors,
    nonEmptyString(piiRetention.ownerDecisionEvidence),
    "approved PII retention requires ownerDecisionEvidence",
  );
  return errors.length === 0;
}

function validateVariant(variant, product, errors) {
  const prefix = `${product.code}/${variant?.sku ?? "<missing-sku>"}`;
  push(errors, nonEmptyString(variant?.sku), `${prefix}: sku is required`);
  push(errors, VARIANT_STATUSES.has(variant?.status), `${prefix}: status must be pending or verified`);

  const actual = variant?.actual;
  push(errors, actual && typeof actual === "object", `${prefix}: actual must be an object`);
  if (!actual || typeof actual !== "object") return false;

  if (variant.status !== "verified") return false;

  push(errors, nonNegativeInteger(actual.stock), `${prefix}: verified SKU requires actual.stock >= 0 integer`);
  push(errors, finitePositive(actual.weightGrams), `${prefix}: verified SKU requires positive actual.weightGrams`);
  push(
    errors,
    Array.isArray(actual.packageMm) &&
      actual.packageMm.length === 3 &&
      actual.packageMm.every(finitePositive),
    `${prefix}: verified SKU requires three positive package dimensions`,
  );

  const checks = variant.checks ?? {};
  for (const key of [
    "identityMatched",
    "physicalOrSupplierEvidenceSeen",
    "weightConfirmed",
    "packageDimensionsConfirmed",
    "optionMeasurementsConfirmed",
  ]) {
    push(errors, checks[key] === true, `${prefix}: verified SKU requires checks.${key}=true`);
  }

  const candidateAttributes = variant.candidate?.attributes ?? {};
  const actualAttributes = actual.attributes ?? {};
  for (const key of Object.keys(candidateAttributes)) {
    push(
      errors,
      present(actualAttributes[key]),
      `${prefix}: verified SKU requires actual.attributes.${key}`,
    );
  }

  return true;
}

function validateProduct(product, errors) {
  const prefix = product?.code ?? "<missing-product>";
  push(errors, nonEmptyString(product?.code), `${prefix}: product code is required`);
  push(errors, PRODUCT_STATUSES.has(product?.status), `${prefix}: status must be pending or production_verified`);

  const facts = Array.isArray(product?.productFactChecks) ? product.productFactChecks : [];
  push(errors, facts.length > 0, `${prefix}: productFactChecks must not be empty`);

  for (const fact of facts) {
    const label = `${prefix}/fact:${fact?.key ?? "<missing-key>"}`;
    push(errors, nonEmptyString(fact?.key), `${label}: key is required`);
    push(errors, FACT_STATUSES.has(fact?.status), `${label}: status must be pending or verified`);
    if (fact?.status === "verified") {
      push(errors, present(fact.actualValue), `${label}: verified fact requires actualValue`);
    }
  }

  const verification = product?.verification ?? {};
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  push(errors, variants.length > 0, `${prefix}: variants must not be empty`);

  const verifiedVariants = variants.filter((variant) => validateVariant(variant, product, errors));
  const anyVerifiedVariant = verifiedVariants.length > 0;
  const productClaimsVerified = product?.status === "production_verified";

  if (anyVerifiedVariant || productClaimsVerified) {
    push(errors, ACCEPTED_METHODS.has(verification.method), `${prefix}: verification.method is not accepted`);
    push(errors, nonEmptyString(verification.verifiedBy), `${prefix}: verified evidence requires verifiedBy`);
    push(errors, nonEmptyString(verification.verifiedAt), `${prefix}: verified evidence requires verifiedAt`);
    if (nonEmptyString(verification.verifiedAt)) {
      push(errors, Number.isFinite(Date.parse(verification.verifiedAt)), `${prefix}: verifiedAt must be a valid timestamp`);
    }
    push(errors, nonEmptyString(verification.evidenceRef), `${prefix}: verified evidence requires evidenceRef`);
  }

  if (productClaimsVerified) {
    push(errors, verification.productFactsConfirmed === true, `${prefix}: production_verified requires productFactsConfirmed=true`);
    push(errors, verification.stockCountConfirmed === true, `${prefix}: production_verified requires stockCountConfirmed=true`);
    push(
      errors,
      facts.every((fact) => fact.status === "verified" && present(fact.actualValue)),
      `${prefix}: production_verified requires every product fact verified with actualValue`,
    );
    push(
      errors,
      variants.every((variant) => variant.status === "verified"),
      `${prefix}: production_verified requires every active SKU verified`,
    );
  }

  return productClaimsVerified;
}

export function validateOwnerInput(data, { requireReady = false } = {}) {
  const errors = [];

  push(errors, data && typeof data === "object", "owner input must be a JSON object");
  if (!data || typeof data !== "object") return { valid: false, ready: false, errors, summary: null };

  push(errors, data.schemaVersion === "p0-open-02b-owner-input-v1", "schemaVersion drifted");
  push(errors, data.verificationPolicy?.noFabrication === true, "verificationPolicy.noFabrication must remain true");

  const accepted = data.verificationPolicy?.acceptedMethods;
  push(
    errors,
    Array.isArray(accepted) &&
      accepted.length === 2 &&
      accepted.every((method) => ACCEPTED_METHODS.has(method)),
    "verificationPolicy.acceptedMethods must remain physical_sample + supplier_production_sheet",
  );

  const products = Array.isArray(data.products) ? data.products : [];
  push(errors, products.length === 9, "owner input must contain exactly 9 products");

  const productCodes = products.map((product) => product.code);
  push(errors, new Set(productCodes).size === productCodes.length, "product codes must be unique");
  push(
    errors,
    EXPECTED_PRODUCT_CODES.every((code) => productCodes.includes(code)),
    "product codes must remain exactly 001..009",
  );

  const productionVerifiedProducts = products.filter((product) => validateProduct(product, errors));
  const variants = products.flatMap((product) => Array.isArray(product.variants) ? product.variants : []);
  push(errors, variants.length === 27, "owner input must contain exactly 27 active SKU candidates");

  const skus = variants.map((variant) => variant.sku);
  push(errors, new Set(skus).size === skus.length, "SKU values must be globally unique");
  const verifiedVariants = variants.filter((variant) => variant.status === "verified");

  const totals = data.totals ?? {};
  push(errors, totals.products === 9, "totals.products must remain 9");
  push(errors, totals.variants === 27, "totals.variants must remain 27");
  push(
    errors,
    totals.verifiedProducts === productionVerifiedProducts.length,
    `totals.verifiedProducts drifted: expected ${productionVerifiedProducts.length}`,
  );
  push(
    errors,
    totals.verifiedVariants === verifiedVariants.length,
    `totals.verifiedVariants drifted: expected ${verifiedVariants.length}`,
  );

  const piiApproved = validatePiiRetention(data.piiRetention, errors);
  const ready =
    productionVerifiedProducts.length === 9 &&
    verifiedVariants.length === 27 &&
    piiApproved &&
    errors.length === 0;

  if (!ready) {
    push(
      errors,
      data.status === "pending_owner_input",
      "non-ready owner input must keep top-level status=pending_owner_input",
    );
  }

  if (requireReady && !ready) {
    errors.push("release-readiness gate requested but P0-OPEN-02B inputs are incomplete");
  }

  return {
    valid: errors.length === 0,
    ready,
    errors,
    summary: {
      products: products.length,
      variants: variants.length,
      verifiedProducts: productionVerifiedProducts.length,
      verifiedVariants: verifiedVariants.length,
      piiRetentionStatus: data.piiRetention?.status ?? "missing",
    },
  };
}

function parseCli(argv) {
  const args = [...argv];
  const requireReadyIndex = args.indexOf("--require-ready");
  const requireReady = requireReadyIndex !== -1;
  if (requireReady) args.splice(requireReadyIndex, 1);

  const inputPath = args[0] ? path.resolve(process.cwd(), args[0]) : DEFAULT_OWNER_INPUT_PATH;
  return { inputPath, requireReady };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { inputPath, requireReady } = parseCli(process.argv.slice(2));

  try {
    const data = JSON.parse(readFileSync(inputPath, "utf8"));
    const result = validateOwnerInput(data, { requireReady });
    console.log(JSON.stringify({ inputPath, ...result }, null, 2));
    if (!result.valid) process.exitCode = 1;
  } catch (error) {
    console.error(JSON.stringify({
      inputPath,
      valid: false,
      ready: false,
      errors: [error instanceof Error ? error.message : String(error)],
    }, null, 2));
    process.exitCode = 1;
  }
}
