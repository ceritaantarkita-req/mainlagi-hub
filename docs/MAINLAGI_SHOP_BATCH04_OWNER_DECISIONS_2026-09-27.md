# Mainlagi Shop — Batch 04 owner decision packet

Date: 2026-09-27

Status: **OWNER-APPROVED — private deployment configuration still pending**.

This document converts the unresolved Batch 04 operational decisions into one
bounded approval packet. Nothing in this file enables sales, mutates production,
or substitutes guessed private data for owner input.

## Existing implementation boundaries that should remain stable

The current Shop code already implements these behaviors:

- payment/order reservation expiry: **30 minutes**;
- shipping quote lifetime: **15 minutes**;
- shipping type: **parcel**;
- collection method: **pickup**;
- instant courier services: **not allowed**;
- partial refunds: **manual review**;
- guest order access: original guest device cookie or the authenticated account
  that created the order;
- no automated outbound email/WhatsApp order notification is currently claimed;
- shipment creation requires verified payment and owner/admin packed confirmation;
- ambiguous or late provider states fail closed to review rather than fabricating
  success.

These coded behaviors are not treated as owner policy approval until the owner
explicitly accepts them.

## Recommended initial-launch policy

The following low-complexity policy was explicitly approved by the owner on
2026-09-27 for the first Mainlagi Shop release. The support-hours recommendation
was changed by the owner to **Senin-Jumat, 09:00-17:00 WIB**.

### Pickup origin

Approve one Mainlagi fulfillment/pickup origin. Keep the real sender identity,
phone, address and postal code only in server/deployment environment variables:

```text
BITESHIP_ORIGIN_CONTACT_NAME
BITESHIP_ORIGIN_CONTACT_PHONE
BITESHIP_ORIGIN_ADDRESS
BITESHIP_ORIGIN_POSTAL_CODE
```

Do not commit those private values into Git.

### Courier and service allowlist

Recommended courier codes:

```text
jne,jnt,sicepat,anteraja,ninja
```

Recommended exact initial service pairs:

```text
jne/reg
jnt/ez
sicepat/reg
anteraja/reg
ninja/standard
```

The initial release should expose only those explicitly approved parcel/pickup
services. Do not silently expose another service merely because the same courier
offers it. Instant, same-day, cargo/trucking and unapproved express/next-day
services stay excluded until separately approved.

The runtime now has an explicit exact courier/service allowlist boundary; the
policy remains empty and fail-closed until owner approval.

### Packing and handling

Recommended:

- handling fee: **Rp0**;
- normal protective packing is included;
- no hidden packing surcharge is added at checkout;
- special packing or insurance that changes customer price requires a later
  explicit policy and implementation change.

This matches the current checkout total model, which does not add a separate
handling fee.

### Customer support

Approved initial channel: **WhatsApp**.

Approved support hours:

```text
Senin-Jumat, 09:00-17:00 WIB
```

The public contact itself must be supplied by the owner. Do not infer or reuse a
private number/email without explicit approval.

### Payment expiry

Recommended: approve the existing **30-minute** pending-payment expiry.

An unpaid order releases its reservation after the implemented expiry/reconciliation
rules. A browser redirect does not mark payment as successful.

### Cancellation

Recommended public policy:

> Pesanan yang belum dibayar dapat dibiarkan kedaluwarsa. Setelah pembayaran
> terverifikasi, pembatalan tidak tersedia secara otomatis. Hubungi dukungan
> Mainlagi secepatnya; permintaan sebelum pesanan diserahkan ke kurir ditinjau
> secara manual. Setelah pesanan dikirim, kebijakan retur/penukaran yang berlaku
> digunakan.

This avoids promising an automated paid-order cancellation flow that is not
implemented.

### Return and exchange

Recommended initial policy:

- wrong/damaged/defective item: report to support within **2 x 24 hours** after
  delivery with order number and reasonable photo/video evidence;
- seller-verified wrong/damaged/defective cases can receive replacement or refund;
- apparel size exchange/change-of-mind: allowed within **7 calendar days** after
  delivery only when unused, unwashed, complete and stock is available;
- for size/change-of-mind exchange, return/reship cost is paid by customer;
- for verified Mainlagi fulfillment error or defect, reasonable return/reship cost
  is borne by Mainlagi;
- no automatic stock restock is inferred from a refund; returned stock must be
  inspected and adjusted operationally.

### Refund

Recommended:

- full refund may be approved manually for an accepted cancellation before
  shipment, confirmed lost shipment, or verified wrong/damaged/defective item when
  replacement is declined or unavailable;
- partial refunds remain **manual review**;
- no refund is treated as completed merely from a customer-facing redirect;
- refund completion target: **3-7 business days after approval**, subject to the
  payment provider/bank processing time;
- physical restock and courier consequences remain separate operational actions.

### SLA

Recommended customer-facing operational SLA:

- order processing/packing: **1-2 business days** after verified payment;
- courier transit: use the live courier ETA shown at checkout; it is a courier
  estimate rather than a Mainlagi delivery guarantee;
- support response target: within **1 business day** during support hours;
- approved refund processing target: **3-7 business days**.

### Guest order recovery

Recommended initial mode:

- self-service order access stays limited to the original guest device cookie or
  the authenticated account that created the order;
- if guest access is lost, customer contacts support with order number plus
  matching order identity details for manual verification;
- no public endpoint may reveal an order merely from order number/email/phone.

This keeps the current authorization boundary intact.

### Customer notifications

Recommended initial release:

- **no proactive automated email/WhatsApp notification**;
- order state is available on the order-status page while the guest cookie/account
  access remains valid;
- support handles exceptions manually.

Automated notifications can be added later without weakening the first-release
security boundary.

### Shipment exceptions

Recommended:

- damaged item: manual review after evidence; replacement/refund according to the
  approved return/refund policy;
- wrong item: manual review; replacement or refund after verification;
- lost shipment: confirm/escalate with courier, then replace or refund after the
  loss is confirmed;
- delayed shipment: show provider tracking state and escalate to courier when the
  quoted ETA has materially passed; do not mark the order lost solely because it
  is late;
- ambiguous payment/shipping provider state: **manual_review** and retain the
  fail-closed behavior.

## Owner approval record

The owner approved the policy packet on 2026-09-27 with support hours changed to
**Senin-Jumat, 09:00-17:00 WIB**. The remaining items are configuration inputs,
not unresolved business-policy choices:

1. supply the public WhatsApp support contact;
2. configure the approved pickup origin's private sender name, phone, address and
   postal code in the deployment environment;
3. configure `BITESHIP_COURIERS=jne,jnt,sicepat,anteraja,ninja` in the target
   staging/deployment environment.

The policy contract is now owner-approved. Sales remain fail-closed until the
required public/private configuration passes the runtime readiness checks.

## External provider reference checked

Biteship courier/service codes and pickup capability were rechecked against the
current Biteship API/help documentation on 2026-09-27. Availability must still be
confirmed through the staging Rates API for the actual approved origin/destination;
a documented courier code does not guarantee every service is available for every
route.
