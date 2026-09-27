# Mainlagi Shop — implementation checkpoint, 2026-09-27

Status: **draft implementation; not approved for live sales**. No remote migration,
production secrets, provider transaction, merge, or deployment was performed.

## Source of truth and provenance

- Mainlagi `main`: `bf69beea081cff4eb1cf9f1a54ed3ef9aba6408a`, checked again before implementation.
- Main reference: `MAINLAGI_SHOP_IMPLEMENTATION_HANDOFF_2026-09-27.md` (full document reviewed in preceding audit).
- Commerce reference: `ceritaantarkita-req/pleated-and-beyond` at `be04933932b4e9aea0e616e705cc6aa6ae906217`.
- Source asset folder: https://drive.google.com/drive/folders/1vygtEwXuS_nOemblWEP5RqOftyFN84al
- Asset hashes and mapping: `docs/data/MAINLAGI_SHOP_MEDIA_MANIFEST_2026-09-27.json`.

The Drive audit found **29 entries**, comprising 27 PNG files and two documents;
the older handoff counted 28. PNG sources are 1254×1254, with **26 unique hashes**:
the tumbler in-use and alternate are identical. Keep that duplication visible for
owner review. Derivatives are 1200×1200 WebP, without creative alteration.
Three persisted derivatives were empty at session resume; they were regenerated
from hash-verified source PNGs and their derivative checksums updated.

Current Mainlagi uses Supabase/Next.js/OpenNext, not the reference repo's
Neon/Drizzle persistence. Existing migrations and learning/auth data are unchanged.
Use current Mainlagi coral `#bd492f`, not the older handoff's `#e46c49`.

## What this branch implements

- Public `/shop`, product detail/gallery, category/search, cart, guest/account
  checkout, payment redirect, order status and account order list.
- Public navigation keeps five destinations; Shop takes the former scoreboard
  slot. `/leaderboards` remains available from Main Gerak.
- Owner-gated `/admin/shop/products`, `/preview`, `/inventory`, `/orders`, `/reports`.
  Product review is read-only in this checkpoint. No placeholder weight, size,
  measurements, material claim, card issuer, review, or rating is invented.
- One additive migration creates the Shop domain and seeds nine **draft** products,
  27 review-state media rows, nine default variants and 79 total units exactly once.
- Server-only cart/order APIs; browser roles cannot read PII, token hashes, stock
  ledger or provider attempts, and cannot execute commerce RPCs.
- Cart secrets are 256-bit random HttpOnly/SameSite cookies, stored hashed in DB.
  Checkout retries reuse the cart's order; guest order access requires its cookie
  or the authenticated account that originally placed the order.
- Atomic checkout locks cart/catalog/stock; binds a 15-minute shipping quote to
  cart revision, price/weight signature and destination postal code; snapshots
  prices and weights; reserves inventory for 30 minutes.
- Midtrans SHA-512 notification validation plus independent GET status, amount and
  identity checks; idempotent settlement, release and late-payment hold. Browser
  redirects never mark orders paid. Fraud challenges stay pending.
- Midtrans hosted Snap redirect needs only the server key; no client key/script
  is shipped to the browser in this implementation.
- Biteship rate lookup supports allowlisted standard parcel services with pickup.
  Shipment creation requires owner confirmation that a paid order is packed.
  A DB lease serializes creation attempts; duplicate-reference error 40002060
  recovers the existing provider order. Webhooks require configured custom secret
  header and a fresh provider GET before state updates.
- Inventory adjustment requires owner identity, a reason and an idempotency key;
  it cannot reduce physical stock below reserved stock and writes an audit row.
- Reporting separates merchandise, shipping, total collected and full refunds.
  Date range boundaries use Asia/Jakarta. Failed queries display an unavailable
  state, not fictional zero revenue. Partial refunds require manual reconciliation
  and place fulfillment on hold; they are not represented as full refunds.

## Configuration and operational contract

See `.env.example`. All provider keys, service role and webhook/cron secrets are
server-only. `SHOP_SALES_ENABLED=false` is the default. Missing providers fail
closed; there is no successful mock-payment fallback.

`SHOP_LOCAL_PREVIEW=true` works **only with NODE_ENV=development** and exposes seed
visuals for local review. Production catalog reads use public RLS, which returns
only active products with verified facts and approved media. Owner preview is
separately authenticated. Static image paths themselves are public assets, not an
access-control boundary.

Configure these provider URLs on the deployment's canonical origin:

- Midtrans notification: `POST /api/shop/midtrans/notification`
- Biteship webhook: `POST /api/shop/biteship/webhook`
- Scheduled reconciliation: `POST /api/shop/reconcile`, authenticated with
  `Authorization: Bearer <SHOP_CRON_SECRET>`.

The cron endpoint is implemented but **not scheduled by this branch**. It handles
up to 50 oldest pending orders per invocation. Monitor `failed` and pending-age
backlog. Expired orders with no payment attempt, or authoritative provider 404
beyond a two-minute grace period, release reservations. Ambiguous provider/network
failures retain stock rather than infer failed payment. Use the owner payment
check action for targeted reconciliation.

Provider timeout after successful remote Snap creation but before persisting the
response can leave an unavailable payment URL. Same provider order ID prevents a
new charge identity; reconcile/expire the pending order and investigate in the
provider dashboard. Do not overwrite order IDs to bypass duplicate protection.

Shipment webhook delivery before local creation response can recover from the
provider reference, but only if a local shipment claim already exists. Full refund
does not automatically restock consumed stock or cancel an already dispatched
courier. Inspect return/refund cases manually.

Order report dates refer to the first locally verified paid event, not a provider
settlement export. Full refunds are attributed to that original payment cohort.
The report is not profit accounting: provider fees, actual shipping cost, partial
refund amounts and settlement dates need a separate reconciliation release.

## Launch blockers and remaining implementation

1. Owner-supplied sizes and measurements for 001–005, exact stock split across
   variants, and measured shipping weights; dimensions where required. Default
   stock must be allocated, not copied into every size. A reviewed variant editor
   and activation workflow remain to be built after agreeing that data contract.
2. Pickup origin/contact/postal code, explicit courier allowlist, sandbox keys,
   webhook configuration, scheduler and operational monitoring.
3. Tumbler capacity/material facts, issuer/function of SKU 007, final product/media
   fidelity approval including duplicated tumbler shot and audited artwork drift.
4. Support contact, return/refund policy, shipping SLA, guest order recovery and
   customer notification decisions. Guest access currently depends on the original
   device cookie; no email/WhatsApp delivery is claimed.
5. Full staging Supabase migration-chain test and advisors; concurrent checkout
   tests against real PostgreSQL; provider sandbox end-to-end tests, webhook
   retry/out-of-order cases and timeout recovery drills.
6. Browser/mobile/accessibility verification. The available cloud browser rejected
   `http://localhost:3000/shop` with `net::ERR_BLOCKED_BY_CLIENT`. No visual pass or
   screenshot evidence is claimed; no alternative browser bypass was attempted.
7. Pagination beyond the 100 newest owner/account orders, shipment reconciliation
   scheduler, PII retention/cleanup, refund accounting and review submission remain
   later operational work. The reviews table is reserved, with no public writes.

Keep this a draft until the remaining code and acceptance gates above are closed.
Do not apply the migration to production merely because local tests passed.

## Launch execution playbook

This section is the **canonical execution guide for continuing Mainlagi Shop from
PR #359 to launch**. It converts the launch blockers above into bounded work batches
so a developer or AI agent can stop at a safe checkpoint and resume later without
silently mixing unrelated work.

### Source-of-truth rule

For Shop work on this branch:

1. `docs/SHOP_IMPLEMENTATION.md` is the canonical Shop implementation, blocker,
   execution-order and acceptance-gate document.
2. `docs/data/MAINLAGI_SHOP_MEDIA_MANIFEST_2026-09-27.json` is the machine-readable
   source for Shop media provenance/mapping.
3. `MAINLAGI_SHOP_IMPLEMENTATION_HANDOFF_2026-09-27.md` remains an upstream
   requirements/audit input. It must not override newer verified implementation
   truth recorded here.
4. `docs/CURRENT_STATE.md` remains the source of truth for merged/current Mainlagi
   runtime state. Do **not** rewrite it to imply Shop is live while PR #359 is
   draft/unmerged.
5. If code, provider behavior, owner-supplied facts or staging evidence changes the
   assumptions in this document, update this document in the **same batch**.

### Non-negotiable launch boundaries

- Keep PR #359 **Draft** until its acceptance gates are closed.
- Keep `SHOP_SALES_ENABLED=false` until the explicit production activation batch.
- Draft/incomplete products must never become public merely because seed data exists.
- Do not invent product sizes, measurements, material facts, weight, dimensions,
  card issuer/function, ratings, reviews or operational policy.
- Do not create a shipment before payment is locally verified and an owner/admin
  has confirmed the order is packed/ready to ship.
- Ambiguous, late or conflicting payment/provider states go to reconciliation or
  manual review; never infer success.
- Partial refunds remain manual/reconciliation-held until accounting support is
  deliberately implemented and accepted.
- Production migration/provider calls are prohibited before the staging and launch
  gates below pass.

### Batch discipline

Each batch is intentionally bounded to be finishable as one focused work session.
Do not start the next batch while the current batch has an unresolved blocker that
invalidates its exit criteria. A batch may stop early, but it must end with a safe
checkpoint rather than partially changing multiple later systems.

At the end of **every** batch, record in this document:

- batch status: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, or `DONE`;
- exact branch/commit SHA and relevant PR;
- migrations/schema changes made, if any;
- tests/commands actually run and their result;
- provider/staging actions actually performed;
- owner decisions/data still missing;
- remaining blockers and the exact next allowed batch.

A later session must resume from the latest recorded batch checkpoint instead of
reconstructing progress from memory.

### Batch 01 — foundation/CI gate lock

**Goal:** prove the existing Shop foundation is a stable baseline before adding more
scope.

Work:

- Wait for all PR #359 CI/checks to finish.
- Investigate and fix any Shop-related failure or regression.
- Re-run the relevant Shop tests/build/type/lint/security checks after any fix.
- Confirm the tested Git tree is the same tree under review.
- Reconfirm that no live migration, live provider transaction, merge or deployment
  has occurred.
- Keep the PR Draft and sales disabled.

Exit gate:

- Required PR checks are green or any unrelated failure is explicitly evidenced.
- No unresolved Shop regression is hidden by skipping a test.
- The exact baseline SHA and CI evidence are recorded here.

### Batch 02 — product truth, media approval and inventory contract

**Goal:** replace review-only placeholders with owner-approved physical product
truth without inventing data.

Work:

- Finalize size/measurement data for products 001–005.
- Finalize exact stock allocation **per size/variant** for 001–005; do not clone
  total stock into every size.
- Record measured shipping weight and required dimensions for all sellable variants.
- Finalize tumbler capacity/material/other physical facts for SKU 006.
- Finalize issuer, function and allowed product claims for SKU 007.
- Revalidate all nine products: SKU, slug, title, category, price, copy, facts and
  intended publish state.
- Review all 27 mapped media assets against the actual products.
- Resolve/approve/reject the duplicated tumbler image and any visual/product drift.
- Define the inventory lifecycle precisely: available, reserved, consumed,
  released, manual adjustment and oversell prevention.

Owner-input gate:

- This batch cannot be declared done while required physical facts or approval
  decisions are unknown. Unknown facts stay draft/blocked.

Exit gate:

- Every sellable variant has verified data required by checkout/shipping.
- Stock totals reconcile exactly to approved variant allocations.
- Every media row has an explicit review decision.
- No unverified product can be activated.

### Batch 03 — product admin, variant editor and activation workflow

**Goal:** give the owner/admin a controlled way to maintain variants and activate
only complete products.

Work:

- Build/review product editing for approved mutable fields.
- Build variant/size editing, stock editing, weight/dimension editing and media
  review/selection as required by the approved data contract.
- Implement a clear lifecycle such as:
  `Draft -> Ready for Review -> Approved -> Active`, with deactivation support.
- Add completeness validation so missing required facts/media/inventory block
  activation.
- Add confirmation and audit logging for sensitive product/stock/activation changes.
- Preserve public RLS/fail-closed behavior: only active, verified products with
  approved media are public.

Exit gate:

- Admin can complete a product without direct database editing.
- An incomplete product cannot be activated through UI or API.
- Activation/deactivation and stock changes are authorized and auditable.
- Regression tests cover activation boundaries and variant/inventory integrity.

### Batch 04 — operational settings and customer policy contract

**Goal:** close the non-code business decisions required by checkout and support.

Work:

- Finalize pickup/warehouse origin, sender contact and postal code.
- Finalize courier allowlist and allowed shipping service classes.
- Finalize packing/handling rules where they affect rates or fulfillment.
- Finalize customer support contact/channel and operational hours if applicable.
- Finalize payment-expiry, cancellation, return/exchange and refund policy.
- Finalize processing/shipping/refund SLA wording.
- Decide guest order recovery and customer notification behavior.
- Define handling for damaged/wrong/lost/delayed shipments and manual-review cases.

Exit gate:

- Checkout/fulfillment behavior has no unresolved operational policy dependency.
- Public/admin copy can be derived from approved policy rather than assumptions.
- Provider configuration values needed by staging are known.

### Batch 05 — staging database, migration chain and security gate

**Goal:** prove the Shop schema and authorization model on staging before provider
integration.

Work:

- Review the complete migration chain against current `main`.
- Back up/record rollback strategy before applying Shop migrations.
- Apply migrations to **staging only**.
- Seed/reconcile approved product, variant, inventory and media state as intended.
- Run Supabase/PostgreSQL validation including constraints, RPC permissions and RLS.
- Run advisor/security checks available for the staging project.
- Exercise concurrent checkout/reservation cases against real PostgreSQL, not only
  PGlite.
- Recheck server-only secrets, CSRF, owner authorization, cart/order ownership,
  client price/stock tampering and sensitive-data exposure boundaries.

Exit gate:

- Staging migration chain is reproducible and rollback path is documented.
- No RLS/auth/schema blocker remains.
- Concurrency tests do not permit oversell/double settlement/unauthorized mutation.
- Production database remains untouched.

### Batch 06 — Midtrans sandbox acceptance

**Goal:** verify real payment-provider behavior without enabling sales.

Work:

- Configure Midtrans sandbox credentials and environment values.
- Configure notification webhook on the staging canonical origin.
- Verify Snap/hosted payment creation and supported payment methods.
- Verify signature, independent status lookup, amount/order identity checks and
  idempotent settlement.
- Exercise pending, success, deny, cancel, expire, fraud/challenge and late-payment
  paths.
- Exercise duplicate/retried/out-of-order notification handling.
- Exercise timeout/recovery cases around remote payment creation.
- Verify inventory reservation/release behavior for each payment outcome.
- Verify manual-review behavior for ambiguous states.

Exit gate:

- A real sandbox payment can traverse checkout to locally verified payment state.
- Browser redirects alone cannot mark an order paid.
- Wrong amount/identity/signature and duplicates fail safely.
- Payment reconciliation behavior is evidenced.

### Batch 07 — Biteship sandbox and fulfillment acceptance

**Goal:** verify real shipping rates, shipment creation and tracking transitions.

Work:

- Configure Biteship sandbox/test credentials and approved origin.
- Configure courier/service allowlist.
- Verify rate lookup using actual approved variant weights/dimensions.
- Verify selected shipping quote remains bound to the expected cart/destination.
- Verify shipment creation is impossible before verified payment and owner/admin
  packed confirmation.
- Exercise shipment creation lease/idempotency and duplicate-reference recovery.
- Configure and verify authenticated webhook handling plus provider GET validation.
- Exercise AWB/tracking and valid status progression.
- Exercise failed creation, delayed webhook, duplicate webhook and provider timeout.
- Define/verify shipment reconciliation behavior.

Exit gate:

- Staging can quote and create a valid test shipment only through the approved state
  machine.
- Duplicate/retry cases do not create duplicate shipments.
- Tracking updates cannot regress or bypass fulfillment rules.

### Batch 08 — checkout, order, refund and exception-flow QA

**Goal:** test the complete commerce state machine across browser/API/provider
boundaries.

Work:

- Product -> cart -> variant/quantity -> address -> quote -> courier -> order ->
  payment flow.
- Guest and authenticated account access/ownership.
- Duplicate checkout and stale-cart/stale-quote behavior.
- Out-of-stock and competing-stock scenarios.
- Pending, failed, cancelled, expired and late payment outcomes.
- Paid -> processing -> packed -> shipment -> shipped -> delivered transitions.
- Full refund flow and manual handling of stock/courier consequences.
- Partial refund/manual-reconciliation hold behavior.
- Failed shipment, wrong/duplicate/delayed webhook and ambiguous provider state.
- Confirm no exception path fabricates success or silently loses reserved stock.

Exit gate:

- All supported transitions have positive and negative-path evidence.
- Unsupported/ambiguous states are explicitly held for review.
- Inventory/payment/fulfillment state stays internally consistent.

### Batch 09 — reconciliation, admin order operations and reporting

**Goal:** make ongoing operations inspectable and recoverable.

Work:

- Configure/test scheduled payment reconciliation.
- Add/verify shipment reconciliation scheduling if still missing.
- Verify expired-order cleanup and inventory release.
- Define retry/backoff/alert behavior for persistent provider mismatch.
- Complete owner order-management needs: search/filter, payment, fulfillment,
  shipping, customer/address, timeline/history and manual-review actions.
- Verify refund/admin actions are authorized and auditable.
- Verify reporting for orders, merchandise, shipping, total collected, product/
  variant sales, inventory and full refunds with Asia/Jakarta boundaries.
- Add pagination/retention work required for launch rather than assuming the newest
  100 orders are sufficient forever.
- Keep partial-refund accounting explicitly excluded until supported.

Exit gate:

- An operator can identify and recover stuck orders without unsafe database edits.
- Scheduled jobs are actually configured in staging and observable.
- Reports reconcile to known staged transactions and do not show fictional zeros
  on query failure.

### Batch 10 — storefront visual, mobile, UX and accessibility QA

**Goal:** close the browser-quality gap that local HTTP tests do not cover.

Work:

- Review Shop listing, product detail/gallery, cart, checkout, payment states, order
  confirmation/history and owner Shop screens.
- Verify desktop, tablet and mobile layouts.
- Verify loading, empty, error, disabled and retry states.
- Check alignment with the current Mainlagi visual system and coral `#bd492f`.
- Check keyboard navigation, focus visibility, semantic labels, validation/errors,
  contrast, image alt text and touch target sizing.
- Verify checkout cannot advance with invalid/incomplete required data.
- Capture/record browser evidence for required breakpoints.

Exit gate:

- No P0/P1 visual/interaction/accessibility blocker remains for launch scope.
- Required mobile/browser evidence is attached or referenced.
- Known non-blocking debt is documented rather than silently ignored.

### Batch 11 — full staging E2E and launch-gate review

**Goal:** prove the exact release candidate end to end before production work.

Required scenario set:

- successful order;
- payment pending;
- payment expired/cancelled;
- stock unavailable/race;
- delayed/duplicate/out-of-order payment webhook;
- packed shipment creation and tracking;
- failed/delayed/duplicate shipping webhook;
- full refund;
- manual-review/ambiguous provider state;
- reconciliation retry/recovery.

Final gate checklist:

- product truth and variants;
- media approval;
- inventory integrity;
- operational policy;
- admin activation workflow;
- staging DB/RLS/security;
- Midtrans sandbox;
- Biteship sandbox;
- checkout/order/fulfillment/refund exceptions;
- reconciliation and monitoring;
- admin operations/reporting;
- desktop/mobile/accessibility;
- full staging E2E.

Exit gate:

- Every required item above is explicitly PASS or has an owner-approved launch
  deferral that does not violate the non-negotiable boundaries.
- PR #359 can move from Draft only after this review is documented.

### Batch 12 — production preparation, merge/deploy and sales activation

**Goal:** launch deliberately, with rollback and a final real-world smoke check.

Production preparation:

- Configure production provider credentials and webhook URLs.
- Confirm production origin/pickup/courier configuration.
- Prepare production migration, backup and rollback procedure.
- Confirm cron/scheduler, logging and monitoring.
- Keep `SHOP_SALES_ENABLED=false`.

Merge/deploy:

- Perform final PR/code/security review.
- Move the PR out of Draft only after Batch 11 passes.
- Merge and deploy the approved release candidate.
- Run production smoke tests while sales remain disabled.
- Verify migration/runtime/provider configuration without creating unintended live
  orders.

Sales activation:

- Activate only owner-approved products.
- Enable intended production Midtrans/Biteship configuration.
- Set `SHOP_SALES_ENABLED=true` only after the disabled-sales smoke passes.
- Run one controlled low-value real transaction.
- Verify the complete chain: payment -> inventory -> fulfillment -> shipment ->
  reporting/reconciliation.
- If a launch-blocking discrepancy appears, disable sales and follow the documented
  rollback/recovery path rather than patching production ad hoc.

Exit gate:

- Controlled production transaction and operational observability are verified.
- Launch status, exact production SHA, migration state, provider configuration
  evidence and remaining non-blocking debt are recorded in canonical docs.

### Batch checkpoint ledger

#### Batch 01 — foundation/CI gate lock

Status: **DONE**.

Verified release-candidate baseline:

- PR: #359 — `feat(shop): gated commerce foundation and draft storefront`.
- Branch: `agent/mainlagi-shop-foundation-20260927`.
- Verified PR head: `1f6c895b78ce68b95ddf174f829b2ac9faccd3d2`.
- Base `main`: `bf69beea081cff4eb1cf9f1a54ed3ef9aba6408a`.
- Branch comparison at closure: 3 commits ahead / 0 behind.
- GitHub Actions: **Mainlagi TV V3 CI #1715**, run `36292679482`,
  completed **success** on the exact verified PR head.
- Successful PR jobs: Secret history scan, Windows compatibility, Production
  dependency audit, Production build, Quality gate (Ubuntu), and Mobile route QA
  (Chromium).
- The Ubuntu quality gate included successful structure/source validation,
  Batch 16 security regressions, physical-device harness contract, Shop
  transaction/provider contracts, typecheck, lint, engine tests, learning
  activity audit, gameplay-distribution audit, simulations, and Batch 17 final
  acceptance contracts.
- The PR-only Cloudflare production-smoke job was skipped by workflow condition;
  that skip is not treated as a failure or as production verification.
- The preceding implementation head
  `c636ca1eb21b20da80e787d9468ba05a61fae91d` also passed CI #1714.
- The two commits between that implementation head and the verified Batch 01 head
  changed only `docs/SHOP_IMPLEMENTATION.md` and `docs/README.md`; no runtime,
  migration, schema, asset, provider or environment behavior changed in that gap.

Actions deliberately **not** performed in Batch 01:

- no Supabase migration was applied remotely;
- no staging or production database was mutated;
- no Midtrans or Biteship transaction/configuration was performed;
- no production secret was added;
- no merge or deployment was performed;
- PR #359 remains Draft;
- `SHOP_SALES_ENABLED` remains disabled.

Owner decisions/data still missing after Batch 01 include the physical product,
variant/stock, media-approval and operational-policy inputs enumerated in Batches
02 and 04.

The documentation commit that records this checkpoint is documentation-only and
does not change the verified Shop runtime tree.

#### Batch 02 — product truth, media approval and inventory contract

Status: **DONE — truth/media/inventory contract closed; unresolved physical facts remain fail-closed activation blockers**.

The repository/Drive/source audit for this batch is complete. No missing real-world
fact was inferred from generated imagery.

A final repository + Project/Drive search on 27 September 2026 found no additional
verified source for the missing sizes, measured weights, tumbler capacity/material,
or SKU 007 issuer/functionality. Those values therefore remain intentionally
unknown. Batch completion does **not** convert unknown facts into launch-ready data.

Machine-readable continuation contract:
`docs/data/MAINLAGI_SHOP_PRODUCT_READINESS_2026-09-27.json`.

##### Verified product truth

The canonical handoff explicitly marks these initial price/stock values as
owner-approved. The current seed matches them exactly:

| SKU | Product | Price | Approved total stock |
| --- | --- | ---: | ---: |
| 001 | Kaos Anak Mainlagi — Sahabat Ceria Putih | Rp69.000 | 9 |
| 002 | Kaos Oversized Mainlagi — Back Graphic Hitam | Rp74.000 | 7 |
| 003 | Piyama Anak Gavi — Cozy Set Putih | Rp120.000 | 6 |
| 004 | Kaos Kaki Karakter Mainlagi | Rp45.000 | 12 |
| 005 | Hoodie Anak Mainlagi — Navy Back Graphic | Rp150.000 | 8 |
| 006 | Tumbler Anak Mainlagi — Daily Buddy | Rp89.000 | 10 |
| 007 | Kartu E-Money Mainlagi — Character Edition | Rp89.000 | 7 |
| 008 | Buku Tulis Mainlagi — Writing Notebook | Rp25.000 | 11 |
| 009 | Buku Gambar Mainlagi — Drawing Book | Rp35.000 | 9 |

Verified total seed stock: **79 units**.

Current implementation intentionally keeps one `<SKU>-DEFAULT` development
variant per product. That is a temporary representation of the approved
product-level total; it is **not** evidence that sized products have only one
variant.

##### Apparel/variant truth still missing

For 001–005 the source handoff still does not contain:

- actual size options;
- per-size stock allocation;
- garment/sock size chart and measurements;
- verified material/fabric facts where those facts will be shown publicly;
- measured shipping weight for each final sellable variant;
- package dimensions where required/available.

The approved totals above must be conserved when real variants are created.
Example: SKU 001 remains **9 total units** after splitting into sizes. Never copy
nine units into every size.

No size variant migration/seed change is authorized until these owner inputs exist.

##### Non-apparel truth still missing

- SKU 006: verified tumbler capacity and material; safety/certification claims only
  if the owner has evidence for them; measured shipping weight and package
  dimensions.
- SKU 007: actual product type (real e-money/stored-value card, co-branded/custom
  card, accessory/skin, or another product), issuer, network/technology,
  activation/provisioning, balance/top-up capability, applicable authorization,
  and whether the current tap/use imagery represents a capability that will
  actually exist. Keep 007 Draft/Coming Soon until verified.
- SKU 008/009: measured shipping weight and package dimensions. The source supports
  their functional distinction (ruled writing notebook versus drawing/blank
  pages), but not invented page count, paper specification, manufacturing claims,
  or other physical facts.

##### Current media decision — exact PR branch

The current Drive folder contains 27 PNG sources and the repository contains their
27 mapped 1200×1200 WebP derivatives. The fresh branch review found 26 unique
images because SKU 006 `kids-tumbler-in-use-v1` and
`kids-tumbler-alternate-v1` are byte-identical duplicates.

Owner decision on **27 September 2026**:

> Prioritize visual consistency, clear product readability and a lightweight web
> experience. Do not require a larger master merely for resolution if it adds
> unnecessary delivery weight.

This decision intentionally supersedes the older Shop-asset requirement that a
2048×2048 final master was mandatory before acceptance.

The Shop media contract is now:

- **1200×1200 WebP is the approved final web-delivery target** for the current
  product gallery;
- larger source/master files may be kept for authoring/provenance, but are not a
  launch requirement and must not be served merely because they are larger;
- visual consistency across the same SKU matters more than forcing merchandise
  artwork to be an exact rasterization of the canonical runtime SVG;
- the Shop may use the current merchandise illustration treatment as an explicit
  Shop presentation variant, provided characters remain recognizably Mainlagi and
  the same product/print/logo treatment does not drift between shots;
- no duplicated image should be rendered just to reach an arbitrary three-image
  count;
- **two distinct, useful images are sufficient for a SKU** when a third image would
  only duplicate bytes/content;
- future replacements should keep or reduce delivery weight while preserving
  adequate visual clarity.

Machine-readable manifest decision:

- 26 unique current assets are marked `approved`;
- the exact duplicate SKU 006 alternate is marked `rejected` for runtime use;
- the rejected duplicate remains in source history only for provenance and does
  not require regeneration to unblock launch;
- SKU 006 may launch with its product hero + one distinct in-use image once its
  physical product facts are verified.

Current visual findings remain useful QA notes:

| SKU | Current consistency result | Media status |
| --- | --- | --- |
| 001 | White tee geometry and the group print are consistent across hero/lifestyle shots. | APPROVED |
| 002 | Black oversized tee front/back concept and back print remain coherent across the set. | APPROVED |
| 003 | Pajama color, repeated cat pattern and garment form remain coherent across the set. | APPROVED |
| 004 | Sock base, navy/yellow details and two-character treatment remain coherent across the set. | APPROVED |
| 005 | Navy hoodie geometry and back-print placement are highly consistent across the set. | APPROVED |
| 006 | Cream body/navy lid construction is consistent; the alternate is an exact duplicate of the in-use image. | HERO + IN-USE APPROVED; DUPLICATE ALTERNATE REJECTED |
| 007 | One consistent card-face concept is carried across hero/in-hand/tap imagery. The image does not prove financial functionality. | MEDIA APPROVED; PRODUCT FUNCTION STILL BLOCKED |
| 008 | Ruled-page writing use is clear and distinct from SKU 009. | APPROVED |
| 009 | Drawing/blank-page use is clear and distinct from SKU 008. | APPROVED |

This is a **Shop-specific media decision**, not a rewrite of the Mainlagi Art Bible
for learning/World/runtime character assets. Canonical SVG rules remain in force
for those systems.

##### Inventory contract accepted for continuation

The implemented stock semantics match the intended contract and must remain stable
when variants are introduced:

- `on_hand` = physical units represented for a variant, including units currently
  reserved but not yet paid;
- `reserved` = subset of `on_hand` held by pending checkout orders;
- `available = on_hand - reserved`;
- cart edits check available stock but do not reserve it;
- checkout rechecks product/media/facts/weight and stock under database locks,
  creates the order, creates active reservations, and increments `reserved`;
- the pending order lifetime is 30 minutes;
- verified payment consumes active reservations, decrements both `reserved` and
  `on_hand`, and writes an idempotent sale ledger movement;
- failed/expired/cancelled payment releases `reserved` while leaving physical
  `on_hand` unchanged;
- a payment arriving after its reservation was released becomes
  `attention_required` instead of silently consuming unavailable stock;
- full refund after a settled sale does **not** automatically restock physical
  inventory; return/restock remains an explicit operational action;
- owner-only manual adjustments are idempotent and may not reduce `on_hand` below
  `reserved`;
- sized-variant allocation must conserve each SKU's approved total seed and must
  never duplicate that total across variants.

Current checkout/shipping correctly fails closed when `weight_grams` is missing.
The current Biteship rate request uses verified weight; dimensions exist in the
schema but are not currently required by runtime rate calculation.

##### Batch 02 implementation closure

The draft Shop implementation is now aligned to the owner-approved media decision:

- runtime/local preview seed carries **26 distinct approved media items**;
- SKU 006 no longer includes the byte-identical alternate in runtime seed data;
- the source/provenance manifest still records all 27 source entries, with
  26 `approved` and the duplicate alternate `rejected`;
- the unapplied draft Shop migration now seeds 26 approved media rows and sets
  product-level `media_approved=true` while products remain `draft` and
  `facts_verified=false`;
- contract/database tests were updated to enforce 26 approved runtime media,
  one rejected provenance asset, nine Draft products and total seed stock 79;
- no size/variant rows were invented and no approved stock total was redistributed;
- no weight/dimension/material/capacity/issuer fact was invented;
- no generated image was regenerated or silently replaced;
- **no remote migration was applied**, no staging/production database was mutated,
  and no provider/production action was performed;
- `SHOP_SALES_ENABLED` remains disabled.

##### Physical facts carried forward as activation blockers

The missing owner facts no longer keep this execution batch open. Instead they are
formal, fail-closed activation requirements consumed by Batch 03.

Required before the affected product can become `active`:

1. **SKU 001–005:** verified size option(s), per-size stock allocation that sums
   exactly to the approved SKU total, relevant size chart/measurements, and measured
   shipping weight for each sellable variant.
2. **All products that will ship:** measured `weight_grams`. Package dimensions
   remain optional unless operations/provider requirements later make them required.
3. **SKU 006:** verified capacity and material. Safety/certification claims stay
   absent unless evidenced.
4. **SKU 007:** actual product type and, if financial/e-money functionality is
   claimed, verified issuer/network, activation/top-up behavior, authorization and
   real tap/use capability. Until then it remains Draft/Coming Soon.
5. **SKU 008/009:** measured shipping weight; do not invent page count/paper specs.

This closure deliberately separates **batch completion** from **product
activation**: Batch 02 is complete because the truth contract is explicit and
machine-readable, while products with unknown real-world facts remain impossible
to activate safely.

### Current execution pointer

- Batch 01 is **DONE**.
- Batch 02 is **DONE**.
- The next executable batch is **Batch 03 — product admin, variant editor and
  activation workflow**.
- Batch 03 must use
  `docs/data/MAINLAGI_SHOP_PRODUCT_READINESS_2026-09-27.json` as its
  machine-readable readiness contract.
- Missing physical facts are **activation blockers**, not permission to invent
  placeholder values.
- PR #359 remains **Draft** and is **not approved for live sales**.
- `SHOP_SALES_ENABLED` must remain disabled.
- Staging/provider work still waits for its later explicit batches; closing
  Batch 02 does not authorize jumping ahead.

### Mandatory successor after Shop closure

After the Shop release sequence is fully closed, merged to `main`, and verified on
the merged production SHA, the next planned work is **not another Shop batch**. The
next handoff is the already-implemented child-surface visual/navigation revision:

```text
PR #360
agent/child-surface-visual-alignment-20260927
```

Read `docs/MAINLAGI_POST_SHOP_CHILD_SURFACE_HANDOFF_2026-09-27.md` before touching
that branch. PR #360 is intentionally deferred while Shop is active because its
navbar includes `Shop` and therefore depends on the final Shop route/release state.

Do not merge PR #360 blindly from its historical stacked base. After Shop is merged,
synchronize that branch onto the actual latest `main`, preserve finalized Shop
behavior, rerun full CI + responsive visual QA, then retarget/merge the child-surface
revision only if all gates are green.

## Verification completed

- `npm run test:shop`: provider signature tampering/fraud/status tests; all 27
  derivative checksums; exact nine product prices/stocks; executable PostgreSQL
  migration/RLS/transaction tests using pinned PGlite.
- DB scenarios include duplicate checkout/settlement/adjustment, wrong amount,
  stale/cross-cart quote, wrong cart secret, lost inventory row, late settlement,
  refund-before-settlement release, owner-only packing, unpaid shipping denial,
  shipment creation lease, no delivered regression and report totals.
- `npm run test:shop:http` after a production build: production catalog hides draft
  products and ignores the development preview flag; image bytes are served; CSRF,
  sales-disabled, owner, notification-signature and cron gates reject invalid
  requests, and API responses carry `no-store`. Uses HTTP assertions, not browser QA.
- `npm run typecheck` and `npm run lint` (six existing unrelated warnings).
- `npm run build` and `npm run build:cloudflare`.
- Structure/source audit, Batch 16 security boundary checks and existing mobile
  foundation contract checks.

PGlite tests bootstrap minimal existing `profiles`/`audit_logs`; they do not claim
that all 51 historical migrations, Supabase Auth/PostgREST, multi-connection races,
Cloudflare runtime network behavior or live provider integration were exercised.

## Provider references checked during implementation

- https://docs.midtrans.com/reference/backend-integration
- https://docs.midtrans.com/docs/https-notification-webhooks
- https://docs.midtrans.com/reference/get-transaction-status
- https://biteship.com/en/docs/api/rates/retrieve
- https://biteship.com/en/docs/api/orders/create
- https://biteship.com/en/docs/api/orders/retrieve
