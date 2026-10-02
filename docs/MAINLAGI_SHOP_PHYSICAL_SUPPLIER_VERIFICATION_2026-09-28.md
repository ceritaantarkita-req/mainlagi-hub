# Mainlagi Shop — Physical / Supplier Verification Pack — 28 September 2026

Status: **READY TO USE / NO PHYSICAL VALUES VERIFIED YET**

Machine-readable checklist:
`docs/data/MAINLAGI_SHOP_PHYSICAL_SUPPLIER_VERIFICATION_2026-09-28.json`

Candidate baseline:
`docs/data/MAINLAGI_SHOP_PRODUCT_TRUTH_MARKETPLACE_CANDIDATE_2026-09-28.json`

## Purpose

This pack is the mandatory bridge between the marketplace benchmark and canonical
production truth. Marketplace values remain a planning baseline. A product may
become `production_verified` only after a real production-equivalent sample,
supplier production sheet, or both have been checked.

Do not copy candidate values into the actual fields merely because they look
reasonable. When an actual value differs, keep the candidate unchanged and
record the measured/supplier value as the new actual production fact.

## Accepted evidence

Three verification methods are allowed:

1. `physical_sample` — production-equivalent physical sample measured/weighed.
2. `supplier_production_sheet` — supplier sheet/specification tied to the exact
   SKU/version being ordered.
3. `physical_and_supplier` — both methods; preferred for higher-risk claims
   such as material, paper GSM, bottle material, or e-money functionality.

Evidence reference may point to a Google Drive folder/file, supplier PDF,
purchase-order attachment, signed specification, measurement photo set, or
another durable internal identifier. Do not put secrets or supplier credentials
inside Shop product facts.

## Mandatory completion rules

For every product, record verifier, method, date, evidence reference, an actual
value for every marketplace candidate target fact, stock confirmation, and
explicit evidence coverage for every active SKU.

The database/admin gate must reject `production_verified` if any required item
is missing.

## Measurement protocol

**001 / 002 / 005 — T-shirt / hoodie:** measure finished garment laid flat
without stretching; record size label, body width and body length for every SKU.
Confirm material, color, fit/construction and print placement. Weigh each
shipping-ready SKU and measure final packed L×W×H.

**003 — Pajama set:** verify set contents, material, color/print and every size.
Measure top width/length and pants width/length. Weigh the complete packed set
and record final package dimensions.

**004 — Socks:** verify one-pair unit, material/construction, size/age label and
usable foot-length range for every SKU. Weigh one shipping-ready pair and record
final package dimensions.

**006 — Tumbler:** confirm capacity, body material, body diameter and body height
from the production-equivalent sample/supplier specification. Weigh the packed
unit and record package dimensions. Any safety/certification claim needs separate
documentary evidence.

**007 — E-money card:** verify actual issuer/product type, procurement
authorization/co-brand basis, activation/provisioning, top-up/balance behavior,
tap/use function, starting balance, card dimensions and exact generation/version.
A printed PVC mockup is not enough evidence for an e-money claim.

**008 — Writing notebook:** confirm A5 dimensions, lined page style, sheet count,
finished thickness, shipping weight and final packed dimensions.

**009 — Drawing book:** confirm finished page size, paper GSM, sheet count and
plain page style. GSM should come from supplier paper specification or another
reliable production document if it cannot be established directly. Record
shipping weight and final package dimensions.

## Supplier response format

Ask the supplier to return one row per SKU:

`SKU | final size/measurements | material/spec | unit weight | packed L×W×H | stock/qty | document/sample reference | notes`

Product-level facts that do not vary by SKU may be stated once per product, but
the response must identify the exact product/version those facts apply to.

## Admin completion sequence

Open **Admin → Shop → Products**, replace candidate variant measurements with the
actual checked values when they differ, fill actual product facts and evidence,
confirm stock, mark every active SKU actually checked, save data, then mark
`production_verified` only when the verification checklist has no blocker.

The marketplace baseline remains preserved for audit/comparison.
