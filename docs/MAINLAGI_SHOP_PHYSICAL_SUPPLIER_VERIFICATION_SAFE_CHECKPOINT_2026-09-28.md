# Mainlagi Shop — Physical / Supplier Verification — SAFE CHECKPOINT — 28 September 2026

Status: **SAFE IMPLEMENTATION CHECKPOINT / REAL-WORLD EVIDENCE STILL PENDING**

PR: **#359 — `feat(shop): gated commerce foundation and draft storefront`**

Branch: `agent/mainlagi-shop-foundation-20260927`

Exact implementation head before this docs-only checkpoint commit:

`5f8d1e1ccc620655af6c7d323f27d62589cb036d`

> This checkpoint file itself is a docs-only commit created after the implementation
> head above. The PR body records the newer exact PR head after this file is added.

## 1. What is complete

The Mainlagi Shop physical/supplier verification system is implemented far enough
to receive real production evidence without inventing product truth.

Canonical candidate baseline:

- `docs/data/MAINLAGI_SHOP_PRODUCT_TRUTH_MARKETPLACE_CANDIDATE_2026-09-28.json`
- **9 products**
- **27 candidate variants**
- **79 allocated stock units**

Important correction: the earlier total of 26 variants was an arithmetic/documentation
error. The candidate dataset contains 27 valid SKU rows:
`5 + 5 + 5 + 3 + 5 + 1 + 1 + 1 + 1 = 27`.
There is no extra rogue SKU and the stock total remains 79.

Canonical real-evidence intake pack:

- `docs/MAINLAGI_SHOP_PHYSICAL_SUPPLIER_VERIFICATION_2026-09-28.md`
- `docs/data/MAINLAGI_SHOP_PHYSICAL_SUPPLIER_VERIFICATION_2026-09-28.json`

Current evidence truth:

- **0/9 products physically/supplier verified**
- **0/27 variants physically/supplier verified**
- actual values intentionally remain blank/null until evidence from a real
  production-equivalent sample or supplier production sheet exists.

## 2. Verification gate implemented

Migration:

`supabase/migrations/20260928145000_shop_batch11_physical_supplier_verification.sql`

A product cannot pass Shop readiness as `production_verified` unless it has:

- accepted verification method:
  - `physical_sample`;
  - `supplier_production_sheet`;
  - `physical_and_supplier`;
- verifier identity;
- verification date;
- durable evidence reference;
- explicit product-fact confirmation;
- explicit stock allocation/count confirmation;
- an actual value for every marketplace candidate product fact;
- evidence coverage for every active SKU;
- all pre-existing product-specific readiness rules still satisfied.

The marketplace candidate baseline must remain available for candidate-vs-actual
comparison. It must not be deleted merely to bypass verification checks.

## 3. Verification staleness hardening implemented

Migration:

`supabase/migrations/20260928146000_shop_batch11_verification_staleness.sql`

Old evidence is automatically invalidated when verified physical truth changes.

The system now changes verification status to:

`verification_stale`

when either:

- product facts are edited after they were production verified; or
- a physical variant is inserted/deleted; or
- an existing variant changes:
  - SKU;
  - title/identity;
  - option values;
  - shipping weight;
  - packed length;
  - packed width;
  - packed height;
  - active/sellable state.

Staleness also resets:

- `facts_verified=false`;
- review state back to `draft`;
- product-facts confirmation;
- stock confirmation;
- verified SKU coverage;
- active verification method;
- active verifier;
- active verification date;
- active evidence reference.

The previous verification object is preserved under
`verificationInvalidation.previousVerification` for audit history. A fresh
verification therefore requires fresh evidence metadata instead of merely
re-checking old boxes.

A price-only variant change intentionally does **not** invalidate physical
verification evidence.

## 4. Admin workflow

`src/components/shop/ProductAdminEditor.tsx`

Admin now exposes:

- physical/supplier verification method;
- verifier;
- verification date;
- evidence reference;
- notes;
- marketplace candidate vs actual value fields;
- active-SKU evidence coverage;
- stock confirmation;
- product-fact confirmation;
- explicit `production_verified` gate;
- explicit **Verification stale — wajib verifikasi ulang** state.

The UI is not the final authority. Database readiness remains the final gate.

## 5. Shipping truth remains connected end-to-end

Candidate and later verified shipping data flow through:

`variant packed dimensions/weight → cart signature → checkout immutable snapshot → Biteship Rates → Biteship Order`

Changing relevant variant data invalidates old verification and also preserves the
existing quote-staleness behavior.

## 6. Staging boundary

Batch 11 free staging remains:

- `workflow_dispatch` manual-only;
- disposable local Supabase;
- Cloudflare Quick Tunnel;
- Midtrans Sandbox;
- Biteship Testing Mode;
- `SHOP_SALES_ENABLED=false`.

SKU `008-A5-80-LINED` may use clearly marked **simulated fixture evidence**
only inside disposable Batch 11 staging. That simulated evidence is not production
truth and must never be copied into production verification records.

## 7. Tests / deterministic guards

The normal `npm run test:shop` path already includes:

- Shop contract tests;
- full migration-chain tests;
- DB tests;
- Batch 08/09 tests;
- Biteship fixture tests;
- Batch 11 preflight.

New verification coverage now checks:

- 9 products / 27 variants / 79 stock consistency;
- canonical verification pack remains 0 verified before evidence exists;
- direct status forcing cannot bypass evidence requirements;
- marketplace candidate baseline remains required;
- every active SKU requires evidence coverage;
- physical variant edits invalidate old evidence;
- verified product-fact edits invalidate old evidence;
- stale verification returns product to draft/unverified state;
- stale verification archives the previous evidence but clears the active
  verifier/date/method/evidence reference;
- a stale product cannot be re-approved without entering fresh evidence;
- price-only edits do not invalidate physical verification;
- admin exposes stale-verification state;
- staging evidence remains explicitly simulated.

Static consistency sweep at the implementation head confirmed:

- verification migration 145000: **1 readiness function / 2 `$shop$` markers**;
- staleness migration 146000: **3 functions / 6 `$shop$` markers**;
- no accidental `[sS]` regex remains in the newly touched Shop contract,
  migration-chain or Batch 11 preflight tests.

## 8. CI status at checkpoint creation

Exact implementation-head Actions run:

- workflow run **#2224**
- run id **36402683527**
- exact SHA `5f8d1e1ccc620655af6c7d323f27d62589cb036d`
- status when checkpoint was updated: **QUEUED**
- no exact-head green claim is made yet.

Do not call this verification work CI-green until a workflow on the final PR head
completes successfully.

## 9. Production safety boundary — DO NOT CROSS

Until the remaining Batch 11 gates are explicitly closed:

- keep PR #359 **Draft**;
- keep `SHOP_SALES_ENABLED=false`;
- do **not** merge PR #359;
- do **not** deploy Shop migrations to production;
- do **not** mutate the production Shop DB;
- do **not** use production Midtrans transactions;
- do **not** use production Biteship transactions;
- do **not** set `facts_verified=true` from marketplace estimates;
- do **not** convert candidate values to actual values without real evidence;
- do **not** copy Batch 11 simulated evidence into production;
- do **not** remove the candidate baseline to bypass verification;
- do **not** silently choose the production PII retention period.

## 10. Remaining real blockers

### A. Physical / supplier evidence

Need actual sample or supplier production-sheet evidence for all facts intended to
be claimed in production.

Supplier/sample input may arrive as PDF, spreadsheet, photos, measurement notes,
WhatsApp screenshots, Drive files or other durable evidence. It should be mapped
to the canonical 27 SKUs.

For every applicable SKU verify:

`SKU | actual size/measurements | material/spec | actual shipping weight | packed L×W×H | actual stock/qty | evidence reference | notes`

Higher-risk product-specific facts still require appropriate evidence, especially:

- product 006 tumbler material/capacity/safety claims;
- product 007 e-money issuer, generation, authorization, activation/top-up/tap use;
- product 009 paper GSM.

### B. Production PII retention

`SHOP_ORDER_PII_RETENTION_DAYS` remains unresolved for production.
Staging's temporary value is not the production decision.

### C. Exact-head normal CI

Final PR head must receive a successful normal CI run.

### D. Manual integrated Batch 11 staging

One manual successful run is still required for the DB-backed provider chain:

`cart → Biteship rates → checkout → Midtrans Sandbox → paid → owner pack → Biteship Testing order → authenticated webhook/tracking → reconcile`

The evidence artifact must be inspected before closing Batch 11.

## 11. Safe resume order

When continuing from this checkpoint:

1. read this checkpoint first;
2. confirm current PR #359 head and Draft status;
3. inspect exact-head CI before changing code;
4. if CI fails, repair only the failing regression;
5. if CI passes, do not enable production — proceed to real product evidence intake;
6. map supplied evidence to the 9 products / 27 SKUs;
7. preserve candidate values and record actual values separately;
8. mark only evidence-backed facts/SKUs verified;
9. run Shop tests and exact-head CI again;
10. run the manual Batch 11 integrated staging workflow;
11. inspect its evidence artifact;
12. only after the remaining explicit gates are closed may Batch 11 closure be discussed.

## 12. Safe checkpoint conclusion

The verification **system** is implemented and fail-closed.

The physical product truth itself is **not yet verified**.

The correct current state is therefore:

**IMPLEMENTATION READY → REAL EVIDENCE PENDING → PRODUCTION STILL BLOCKED**
