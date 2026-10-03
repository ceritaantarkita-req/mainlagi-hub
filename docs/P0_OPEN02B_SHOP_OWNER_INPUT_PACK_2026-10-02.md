# P0-OPEN-02B — Shop owner launch-input pack

Date: **2 October 2026**  
Status: **WAITING FOR REAL OWNER/SUPPLIER INPUT — NO PRODUCTION CLAIM**  
Repository baseline when created: `main@f8fc2f0f2fb8f73af499470311a05ff9996dcad7`  
Shop evidence source: PR **#359** @ `9047931289e6ccd8981a35f7c79c321a24f34b59`

Machine-readable intake template:

`docs/data/P0_OPEN02B_SHOP_OWNER_INPUT_TEMPLATE_2026-10-02.json`

Fail-closed validator:

```bash
npm run shop:validate-owner-input
npm run shop:validate-owner-input:ready
npm run test:shop:owner-input
```

The normal validator accepts a structurally valid partially filled intake and reports `ready=false`. The `:ready` command is the release-readiness gate and fails until all **9 products / 27 active SKUs** plus the explicit production PII-retention decision are fully evidenced.

## 1. Purpose

P0-OPEN-02A proved that the Shop commerce core is technically portable to current main, but release readiness is still blocked by two inputs that cannot be fabricated by code or inferred from marketplace benchmarks:

1. real physical/supplier verification for **9 products / 27 active SKU candidates**;
2. an explicit production value for `SHOP_ORDER_PII_RETENTION_DAYS`.

This pack is the canonical intake surface for those two inputs.

It does **not**:

- enable Shop sales;
- apply Shop migrations to production;
- change navigation;
- merge/rebase PR #359;
- promote marketplace-candidate facts into production truth;
- choose a retention period on behalf of the owner.

## 2. Evidence rule

A product may move toward `production_verified` only when real evidence covers:

- product identity and applicable physical facts;
- active-SKU identity/specification;
- actual stock/count;
- packed weight;
- package dimensions;
- applicable option measurements or other SKU facts.

Accepted verification methods in the current database gate:

```text
physical_sample
supplier_production_sheet
```

For each verified product, record:

```text
method
verifiedBy
verifiedAt
evidenceRef
notes
productFactsConfirmed
stockCountConfirmed
```

Do not use screenshots of marketplace listings, competitor specs, guessed dimensions, AI output, or the Batch 11 simulated fixture as production verification.

## 3. Product / SKU intake matrix

### 001 — Kaos Anak Mainlagi — Sahabat Ceria Putih

- active SKU candidates: `001-2Y`, `001-4Y`, `001-6Y`, `001-8Y`, `001-10Y`
- production fact fields to verify: `color`, `material`, `fit`, `print`
- for every active SKU: confirm identity/specification, actual stock, packed weight, package dimensions, and applicable option measurements/facts
- accepted evidence method: `physical_sample` or `supplier_production_sheet`
- current state: **PENDING — do not mark production_verified**

### 002 — Kaos Oversized Mainlagi — Back Graphic Hitam

- active SKU candidates: `002-S`, `002-M`, `002-L`, `002-XL`, `002-XXL`
- production fact fields to verify: `color`, `material`, `fit`, `print`
- for every active SKU: confirm identity/specification, actual stock, packed weight, package dimensions, and applicable option measurements/facts
- accepted evidence method: `physical_sample` or `supplier_production_sheet`
- current state: **PENDING — do not mark production_verified**

### 003 — Piyama Anak Gavi — Cozy Set Putih

- active SKU candidates: `003-95`, `003-100`, `003-110`, `003-120`, `003-130`
- production fact fields to verify: `color`, `material`, `set`, `print`
- for every active SKU: confirm identity/specification, actual stock, packed weight, package dimensions, and applicable option measurements/facts
- accepted evidence method: `physical_sample` or `supplier_production_sheet`
- current state: **PENDING — do not mark production_verified**

### 004 — Kaos Kaki Karakter Mainlagi

- active SKU candidates: `004-1-3Y`, `004-4-6Y`, `004-7-10Y`
- production fact fields to verify: `unit`, `construction`, `material`
- for every active SKU: confirm identity/specification, actual stock, packed weight, package dimensions, and applicable option measurements/facts
- accepted evidence method: `physical_sample` or `supplier_production_sheet`
- current state: **PENDING — do not mark production_verified**

### 005 — Hoodie Anak Mainlagi — Navy Back Graphic

- active SKU candidates: `005-S`, `005-M`, `005-L`, `005-XL`, `005-XXL`
- production fact fields to verify: `color`, `material`, `fit`, `print`
- for every active SKU: confirm identity/specification, actual stock, packed weight, package dimensions, and applicable option measurements/facts
- accepted evidence method: `physical_sample` or `supplier_production_sheet`
- current state: **PENDING — do not mark production_verified**

### 006 — Tumbler Anak Mainlagi — Daily Buddy

- active SKU candidates: `006-500ML`
- production fact fields to verify: `capacityMl`, `targetBodyMaterial`, `targetBodyDiameterMm`, `targetBodyHeightMm`
- for every active SKU: confirm identity/specification, actual stock, packed weight, package dimensions, and applicable option measurements/facts
- accepted evidence method: `physical_sample` or `supplier_production_sheet`
- current state: **PENDING — do not mark production_verified**

### 007 — Kartu E-Money Mainlagi — Character Edition

- active SKU candidates: `007-MANDIRI-GEN2`
- production fact fields to verify: `procurementTarget`, `issuerTarget`, `startingBalanceRupiah`, `cardStandard`, `cardWidthMm`, `cardHeightMm`, `cardThicknessMm`
- for every active SKU: confirm identity/specification, actual stock, packed weight, package dimensions, and applicable option measurements/facts
- accepted evidence method: `physical_sample` or `supplier_production_sheet`
- current state: **PENDING — do not mark production_verified**

### 008 — Buku Tulis Mainlagi — Writing Notebook

- active SKU candidates: `008-A5-80-LINED`
- production fact fields to verify: `size`, `widthMm`, `heightMm`, `pageStyle`, `sheets`, `targetThicknessMm`
- for every active SKU: confirm identity/specification, actual stock, packed weight, package dimensions, and applicable option measurements/facts
- accepted evidence method: `physical_sample` or `supplier_production_sheet`
- current state: **PENDING — do not mark production_verified**

### 009 — Buku Gambar Mainlagi — Drawing Book

- active SKU candidates: `009-A4-120GSM-20`
- production fact fields to verify: `size`, `widthMm`, `heightMm`, `targetPaperGsm`, `targetSheets`, `pageStyle`
- for every active SKU: confirm identity/specification, actual stock, packed weight, package dimensions, and applicable option measurements/facts
- accepted evidence method: `physical_sample` or `supplier_production_sheet`
- current state: **PENDING — do not mark production_verified**

## 4. How to fill the machine-readable template

For each product:

1. keep `candidateProductFacts` untouched as comparison context;
2. fill every `productFactChecks[].actualValue` from real evidence;
3. change a fact check to `status: "verified"` only when supported;
4. fill `verification.method`, `verifiedBy`, `verifiedAt`, `evidenceRef`, and `notes`;
5. set `productFactsConfirmed=true` only after every required product fact is confirmed;
6. set `stockCountConfirmed=true` only after the stock value is actually checked;
7. for every active SKU, fill its `actual` values and corresponding checks;
8. mark a SKU `verified` only when its required checks are supported by evidence;
9. update totals only after the underlying rows are actually verified.

If a real measurement differs from the marketplace candidate, the **real measurement wins**. Do not preserve a candidate value merely to keep the old seed unchanged.

## 5. PII retention production decision

The second unresolved owner input is:

`SHOP_ORDER_PII_RETENTION_DAYS`

Supported production range:

```text
minimum: 30 days
maximum: 3650 days
```

The existing Batch 11 staging value of **30 days is test-only** and must not be interpreted as the production decision.

Record the chosen value under:

```json
"piiRetention": {
  "status": "approved",
  "productionDays": <30..3650>,
  "ownerDecisionEvidence": "<decision reference>"
}
```

This intake pack intentionally leaves the value `null` until the owner decides.

## 6. Activation gate after inputs arrive

P0-OPEN-02B is complete only when all of the following are true:

```text
verified products:  9/9
verified variants: 27/27
PII retention:      approved explicit value
evidence refs:      present and auditable
candidate-only data: not promoted without evidence
```

Only then may the next runtime package start:

```text
P0-SHOP-CONV-01 — fresh current-main commerce-core transplant
```

That future package must still preserve:

- `SHOP_SALES_ENABLED=false` during convergence;
- Midtrans Sandbox;
- Biteship Testing Mode;
- no paid Supabase branch requirement;
- no production DB mutation before release approval;
- current Journey Map authority;
- current Next/package/CI versions from then-current main;
- full deterministic Shop tests;
- integrated disposable DB-backed provider E2E.

## 7. Safe resume rule

If work resumes in another chat/agent:

1. read `docs/P0_OPEN02A_SHOP_CONVERGENCE_PREFLIGHT_2026-10-02.md`;
2. read this file;
3. use the JSON template as the only owner-input working surface;
4. leave unknown real-world values as `null` / `pending`;
5. do not infer production facts from candidate data;
6. do not begin P0-SHOP-CONV-01 until the two owner-input gates are actually satisfied.

This file is an intake contract, not evidence that the inputs have already been supplied.
