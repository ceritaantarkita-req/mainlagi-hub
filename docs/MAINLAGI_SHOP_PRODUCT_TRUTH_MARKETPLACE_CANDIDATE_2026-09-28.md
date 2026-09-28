# Mainlagi Shop — marketplace product-truth candidate — 28 September 2026

Status: **OWNER-REQUESTED MARKETPLACE BENCHMARK / NOT PHYSICALLY VERIFIED / DO NOT SET `facts_verified=true`**

Canonical machine-readable dataset:
`docs/data/MAINLAGI_SHOP_PRODUCT_TRUTH_MARKETPLACE_CANDIDATE_2026-09-28.json`.

## Why this exists

The owner asked for a concrete product-truth/variant/stock/size proposal for all
nine Mainlagi Shop products using comparable marketplace products, especially
Tokopedia-linked sellers, rather than leaving every physical field blank.

This closes the **missing target specification** problem, but it does not convert a
marketplace analogue into evidence that a Mainlagi physical sample has actually
been measured.

The dataset may be used for:

- supplier brief;
- proposed variant setup;
- stock allocation planning;
- non-production staging;
- shipping estimate planning.

It must **not** by itself:

- set `facts_verified=true`;
- activate a product for live production sales;
- claim that Mainlagi merchandise was physically weighed/measured;
- silently replace a supplier/sample measurement that later differs.

## Proposed production targets

| SKU | Product | Candidate variants | Stock allocation | Candidate physical/shipping target |
| --- | --- | --- | ---: | --- |
| 001 | Kaos Anak Mainlagi — Sahabat Ceria Putih | 2Y, 4Y, 6Y, 8Y, 10Y | 1 / 2 / 2 / 2 / 2 = 9 | Cotton Combed 24s; width×length 30×40 to 44×54 cm; 150–190 g; folded pack 25×20×3 cm |
| 002 | Kaos Oversized Mainlagi — Back Graphic Hitam | S, M, L, XL, XXL | 1 / 1 / 2 / 2 / 1 = 7 | Cotton Combed 24s boxy; candidate width×length 34×42 to 46×58 cm; 170–210 g; pack 28×24×3 cm |
| 003 | Piyama Anak Gavi — Cozy Set Putih | 95, 100, 110, 120, 130 | 1 / 1 / 2 / 1 / 1 = 6 | Cotton-spandex set; top 30×39 to 34×43 cm; pants length 52–64 cm; 220–260 g; pack 30×25×4 cm |
| 004 | Kaos Kaki Karakter Mainlagi | 1–3Y, 4–6Y, 7–10Y | 4 / 4 / 4 = 12 | 1 pair; cotton-blend target; planning foot lengths 12–14 / 15–17 / 18–20 cm; 50–60 g |
| 005 | Hoodie Anak Mainlagi — Navy Back Graphic | S, M, L, XL, XXL | 1 / 2 / 2 / 2 / 1 = 8 | Fleece; width×length 30×42 to 46×54 cm; 350–450 g; pack 32×28×6 cm |
| 006 | Tumbler Anak Mainlagi — Daily Buddy | 500 ml | 10 | 500 ml; target body about Ø70×220 mm; STS304 target; shipping weight 350 g; pack 9×9×24 cm |
| 007 | Kartu E-Money Mainlagi — Character Edition | Mandiri E-Money Gen2 target | 7 | procurement target only: Mandiri genuine card, saldo Rp0, CR80 85.60×53.98×0.8 mm; shipping weight 40 g |
| 008 | Buku Tulis Mainlagi — Writing Notebook | A5 / 80 sheets / lined | 11 | 148×210 mm, target thickness 12 mm; shipping weight 300 g; pack 22×16×2 cm |
| 009 | Buku Gambar Mainlagi — Drawing Book | A4 / 120 gsm / 20 sheets | 9 | 210×297 mm; target 120 gsm / 20 sheets; shipping weight 250 g; pack 31×23×1 cm |

Total candidate variants: **26**.  
Total allocated stock: **79 units**, exactly preserving the current seeded total.

## Marketplace/reference basis

### 001 — child tee
Tokopedia-linked Idaiya/Pabrik T Shirt Anak publicly lists Cotton Combed 24s and
the child chart 2y 30×40, 4y 33×43, 6y 36×46, 8y 40×50, 10y 44×54 cm.

### 002 — kids boxy/oversized tee
Livescoot links Tokopedia and sells a kids boxy 100% cotton 24s tee with
S 1–2y, M 3–4y, L 5–6y, XL 7–8y, XXL 9–10y. Its public page does not expose exact
garment measurements, so the candidate width/length values are planning estimates
with added ease over the regular child tee. **This SKU particularly needs sample
measurement before verification.**

### 003 — pajama set
A Tokopedia product-entry reference exposes sizes 95–130, top widths 30–34 cm,
top lengths 39–43 cm, pants widths 22–26 cm and pants lengths 52–64 cm with a
cotton-spandex example.

### 004 — character socks
Ihana Konveksi links Tokopedia and explicitly carries character-print socks for
children 1–3 years. The proposed broader age bands are a merchandising plan; foot
length ranges are estimates and remain low-confidence until supplier/sample
confirmation.

### 005 — child hoodie
Comparable local child fleece hoodies use S–XXL with width×length from about
30×42 cm through 46×54 cm and list about 350 g product weight. Larger-size weights
in the dataset are conservative shipping estimates.

### 006 — child tumbler
A Tokopedia-linked seller lists a 500 ml child bottle around 19 cm tall and 7 cm
diameter. A current comparable 500 ml kids strap tumbler is 70×70×220 mm and 290 g.
The candidate uses a conservative 350 g shipping weight.

### 007 — e-money card
Comparable custom-card vendors offer Mandiri E-Money as a custom UV-print option.
The physical CR80/ISO ID-1 form is 85.60×53.98 mm and about 0.8 mm thick.
**Mainlagi must still confirm the actual genuine issuer/card generation and zero
balance with the supplier. Do not silently substitute Flazz/BRIZZI/TapCash.**

### 008 — writing notebook
Tokopedia editorial references identify A5 as 14.8×21 cm. Current comparable
80-sheet A5 notebooks are approximately 245–300 g; the candidate deliberately
uses 300 g for shipping.

### 009 — drawing book
Comparable A4 drawing books commonly use 120 gsm paper. Public references cover
A4 21×29.7 cm / 20-sheet constructions; the candidate uses 20 sheets and a
conservative 250 g shipping weight.

## Verification rule

A marketplace candidate becomes canonical production truth only after one of:

1. supplier production sheet confirms the exact final manufactured specification;
2. one production-equivalent physical sample is measured/weighed and recorded.

For apparel, record the actual garment chart and packed shipping weight for each
size. For rigid goods, record product dimensions plus final packed dimensions and
weight. For SKU 007, verify issuer, card generation/function and starting balance.

If actual values differ, update the candidate to measured truth instead of forcing
the physical product to match this document.
