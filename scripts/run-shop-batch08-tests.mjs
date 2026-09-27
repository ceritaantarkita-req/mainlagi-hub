import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import ts from "typescript";

const accessSource = await readFile("src/lib/shop/access.ts", "utf8");
const { outputText: accessJs } = ts.transpileModule(accessSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const { orderAccessAllowed } = await import(
  `data:text/javascript;base64,${Buffer.from(accessJs).toString("base64")}`
);

assert.equal(
  orderAccessAllowed({
    guestTokenMatches: true,
    accountId: null,
    userId: null,
  }),
  true,
  "guest order cookie grants only the matching guest order",
);
assert.equal(
  orderAccessAllowed({
    guestTokenMatches: false,
    accountId: "account-a",
    userId: "account-a",
  }),
  true,
  "matching authenticated account grants order access",
);
assert.equal(
  orderAccessAllowed({
    guestTokenMatches: false,
    accountId: "account-a",
    userId: "account-b",
  }),
  false,
  "different authenticated account cannot read the order",
);
assert.equal(
  orderAccessAllowed({
    guestTokenMatches: false,
    accountId: null,
    userId: null,
  }),
  false,
  "anonymous request without the order cookie cannot read the order",
);

const routeSource = await readFile("src/app/api/shop/[...path]/route.ts", "utf8");
const operationsSource = await readFile("src/lib/shop/operations.ts", "utf8");
assert.match(
  routeSource,
  /if \(post && route === "biteship\/webhook"\)[\s\S]*verifyBiteship\(request\)[\s\S]*biteship\(\`\/v1\/orders\/\$\{encodeURIComponent\(id\)\}\`\)[\s\S]*applyShipment\(o, remote\)/,
  "Biteship webhook must authenticate then independently GET the provider order",
);
assert.match(
  routeSource,
  /route === "orders"[\s\S]*\.eq\("account_id", id\)/,
  "account order history must remain scoped to the authenticated account id",
);
assert.match(
  operationsSource,
  /p\.reference_id !== o\.order_number/,
  "shipment application must reject a provider response for the wrong local order",
);

const db = new PGlite();
try {
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
create table public.profiles(id uuid primary key,role text);
create table public.audit_logs(
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text,
  entity text,
  entity_id text,
  payload jsonb default '{}'
);`);

  for (const migration of [
    "../supabase/migrations/20260926195237_shop_foundation.sql",
    "../supabase/migrations/20260927051000_shop_admin_workflow.sql",
    "../supabase/migrations/20260927123000_shop_batch08_state_machine_hardening.sql",
  ]) {
    await db.exec(await readFile(new URL(migration, import.meta.url), "utf8"));
  }

  const one = async (sql, args = []) => (await db.query(sql, args)).rows[0];
  const owner = "00000000-0000-0000-0000-000000000001";
  const accountA = "00000000-0000-0000-0000-000000000002";
  const accountB = "00000000-0000-0000-0000-000000000003";
  await db.query(
    "insert into profiles(id,role) values($1,'owner'),($2,'parent'),($3,'parent')",
    [owner, accountA, accountB],
  );

  const product = await one(
    "select id,title,description from shop_products where product_code='001'",
  );
  await db.query(
    "select shop_admin_product_save($1,$2,$3,'wear',69000,$4,$5)",
    [
      product.id,
      product.title,
      product.description,
      JSON.stringify({ sizeChart: "ONE: verified Batch 08 fixture" }),
      owner,
    ],
  );
  await db.query("select shop_admin_variants_replace($1,$2,$3)", [
    product.id,
    JSON.stringify([
      {
        sku: "001-B08",
        title: "Batch 08",
        optionValues: { size: "ONE" },
        onHand: 9,
        priceOverride: null,
        weightGrams: 200,
        lengthMm: 250,
        widthMm: 200,
        heightMm: 40,
        isActive: true,
      },
    ]),
    owner,
  ]);
  await db.query("select shop_admin_transition($1,'ready',$2)", [
    product.id,
    owner,
  ]);
  await db.query("select shop_admin_transition($1,'approve',$2)", [
    product.id,
    owner,
  ]);
  await db.query("select shop_admin_transition($1,'activate',$2)", [
    product.id,
    owner,
  ]);
  const variant = (
    await one("select id from shop_variants where sku='001-B08'")
  ).id;

  let sequence = 0;
  const makeHash = (label) =>
    createHash("sha256").update(label).digest("hex");
  async function cart(qty = 1) {
    sequence++;
    const hash = makeHash(`batch08-cart-${sequence}`);
    const c = (
      await one("insert into shop_carts(token_hash) values($1) returning id", [
        hash,
      ])
    ).id;
    await db.query("select shop_cart_set($1,$2,$3,$4)", [
      c,
      hash,
      variant,
      qty,
    ]);
    const q = (
      await one(
        `insert into shop_shipping_quotes(
          cart_id,cart_revision,cart_signature,destination_postal_code,
          courier_code,service_code,service_name,price_amount
        )
        select id,revision,shop_cart_signature(id),'17111',
               'jne','reg','JNE REG',10000
        from shop_carts where id=$1 returning id`,
        [c],
      )
    ).id;
    return { c, q, hash };
  }
  async function checkout(c, account = null) {
    return (
      await one(
        `select shop_checkout(
          $1::uuid,$2,$3::uuid,$4::jsonb,$5::jsonb,$6::uuid,$2
        ) n`,
        [
          c.c,
          c.hash,
          c.q,
          JSON.stringify({
            name: "Batch 08",
            email: "batch08@example.invalid",
            phone: "+628111111111",
          }),
          JSON.stringify({
            address: "Fixture address",
            city: "Bekasi",
            province: "Jawa Barat",
            postalCode: "17111",
          }),
          account,
        ],
      )
    ).n;
  }
  async function orderRow(number) {
    return one("select * from shop_orders where order_number=$1", [number]);
  }
  async function claimPayment(number) {
    const o = await orderRow(number);
    assert.equal(
      (await one("select shop_claim_payment($1) ok", [o.id])).ok,
      true,
      "fresh pending order can claim one payment session",
    );
    return o;
  }
  async function pay(number, status, event, transaction) {
    const o = await orderRow(number);
    await db.query("select shop_apply_payment($1,$2,$3,$4,$5)", [
      number,
      o.grand_total_amount,
      status,
      event,
      transaction,
    ]);
  }
  async function makeOrder(account = null) {
    const c = await cart();
    const number = await checkout(c, account);
    return { c, number };
  }

  console.log("== Batch 08: ownership, checkout idempotency, stale quote and stock ==");
  const guest = await makeOrder();
  assert.equal(await checkout(guest.c), guest.number);
  let guestOrder = await orderRow(guest.number);
  assert.equal(guestOrder.account_id, null);
  assert.equal(guestOrder.guest_token_hash, guest.c.hash);
  await claimPayment(guest.number);
  await pay(guest.number, "pending", "b08-guest-pending", "b08-guest-tx");
  assert.equal((await orderRow(guest.number)).payment_status, "pending");
  await pay(guest.number, "failed", "b08-guest-failed", "b08-guest-tx");
  guestOrder = await orderRow(guest.number);
  assert.equal(guestOrder.payment_status, "failed");
  assert.equal(guestOrder.order_status, "cancelled");

  const authenticated = await makeOrder(accountA);
  const authenticatedOrder = await orderRow(authenticated.number);
  assert.equal(authenticatedOrder.account_id, accountA);
  assert.notEqual(authenticatedOrder.account_id, accountB);
  await claimPayment(authenticated.number);
  await pay(
    authenticated.number,
    "cancelled",
    "b08-account-cancelled",
    "b08-account-tx",
  );
  assert.equal((await orderRow(authenticated.number)).order_status, "cancelled");

  const stale = await cart();
  await db.query("select shop_cart_set($1,$2,$3,2)", [
    stale.c,
    stale.hash,
    variant,
  ]);
  await assert.rejects(checkout(stale), /shipping quote stale/);

  const emptyHash = makeHash("batch08-out-of-stock");
  const emptyCart = (
    await one("insert into shop_carts(token_hash) values($1) returning id", [
      emptyHash,
    ])
  ).id;
  await assert.rejects(
    db.query("select shop_cart_set($1,$2,$3,10)", [
      emptyCart,
      emptyHash,
      variant,
    ]),
    /product unavailable/,
  );

  console.log("== Batch 08: expired and late-payment hold ==");
  const expired = await makeOrder();
  await claimPayment(expired.number);
  await pay(expired.number, "expired", "b08-expired", "b08-expired-tx");
  let expiredOrder = await orderRow(expired.number);
  assert.equal(expiredOrder.payment_status, "expired");
  assert.equal(expiredOrder.order_status, "expired");
  assert.equal(
    (
      await one(
        "select reserved from shop_inventory_balances where variant_id=$1",
        [variant],
      )
    ).reserved,
    0,
  );
  await pay(expired.number, "paid", "b08-late-paid", "b08-expired-tx");
  expiredOrder = await orderRow(expired.number);
  assert.equal(expiredOrder.payment_status, "paid");
  assert.equal(expiredOrder.order_status, "attention_required");
  assert.equal(expiredOrder.fulfillment_status, "attention_required");
  assert.equal(
    (
      await one(
        "select on_hand from shop_inventory_balances where variant_id=$1",
        [variant],
      )
    ).on_hand,
    9,
    "late payment cannot consume stock after reservation release",
  );

  console.log("== Batch 08: paid -> packed -> shipment -> delivered -> refund ==");
  const fulfilled = await makeOrder();
  const fulfilledBefore = await claimPayment(fulfilled.number);
  await pay(fulfilled.number, "paid", "b08-paid", "b08-paid-tx");
  let fulfilledOrder = await orderRow(fulfilled.number);
  assert.equal(fulfilledOrder.order_status, "processing");
  assert.equal(fulfilledOrder.payment_status, "paid");
  assert.equal(
    (
      await one(
        "select status from shop_inventory_reservations where order_id=$1",
        [fulfilledOrder.id],
      )
    ).status,
    "consumed",
  );
  assert.equal(
    (
      await one(
        "select on_hand from shop_inventory_balances where variant_id=$1",
        [variant],
      )
    ).on_hand,
    8,
  );
  await db.query("select shop_pack($1,$2)", [fulfilledOrder.id, owner]);
  assert.equal(
    (await one("select shop_claim_shipment($1,$2) ok", [fulfilledOrder.id, owner]))
      .ok,
    true,
  );
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-1','confirmed','AWB-B08','https://example.invalid/track')",
    [fulfilledOrder.id],
  );
  assert.equal(
    (await orderRow(fulfilled.number)).fulfillment_status,
    "shipment_created",
  );
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-1','picked','AWB-B08','https://example.invalid/track')",
    [fulfilledOrder.id],
  );
  assert.equal((await orderRow(fulfilled.number)).fulfillment_status, "in_transit");
  assert.equal(
    (
      await one("select status from shop_shipments where order_id=$1", [
        fulfilledOrder.id,
      ])
    ).status,
    "picked",
  );
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-1','confirmed','AWB-B08','https://example.invalid/track')",
    [fulfilledOrder.id],
  );
  assert.equal(
    (
      await one("select status from shop_shipments where order_id=$1", [
        fulfilledOrder.id,
      ])
    ).status,
    "picked",
    "delayed pre-transit callback cannot regress raw shipment status",
  );
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-1','delivered','AWB-B08','https://example.invalid/track')",
    [fulfilledOrder.id],
  );
  fulfilledOrder = await orderRow(fulfilled.number);
  assert.equal(fulfilledOrder.fulfillment_status, "delivered");
  assert.equal(fulfilledOrder.order_status, "completed");
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-1','delivered','AWB-B08','https://example.invalid/track')",
    [fulfilledOrder.id],
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from shop_provider_events where provider='biteship' and event_key='b08-provider-1:delivered'",
      )
    ).n,
    1,
    "duplicate shipment event remains idempotent",
  );
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-1','scheduled','AWB-B08','https://example.invalid/track')",
    [fulfilledOrder.id],
  );
  assert.equal(
    (
      await one("select status from shop_shipments where order_id=$1", [
        fulfilledOrder.id,
      ])
    ).status,
    "delivered",
    "post-delivery stale callback cannot regress shipment row",
  );
  assert.equal((await orderRow(fulfilled.number)).order_status, "completed");

  await pay(fulfilled.number, "refunded", "b08-full-refund", "b08-paid-tx");
  fulfilledOrder = await orderRow(fulfilled.number);
  assert.equal(fulfilledOrder.payment_status, "refunded");
  assert.equal(fulfilledOrder.order_status, "refunded");
  assert.equal(fulfilledOrder.fulfillment_status, "attention_required");
  assert.equal(
    (
      await one(
        "select on_hand from shop_inventory_balances where variant_id=$1",
        [variant],
      )
    ).on_hand,
    8,
    "full refund after sale does not silently restock physical inventory",
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from shop_inventory_ledger where movement_type='sale' and variant_id=$1",
        [variant],
      )
    ).n,
    1,
  );
  assert.ok(fulfilledBefore.id);

  console.log("== Batch 08: partial refund/manual review and shipment ambiguity ==");
  const partial = await makeOrder();
  const partialBefore = await claimPayment(partial.number);
  await pay(partial.number, "paid", "b08-partial-paid", "b08-partial-tx");
  await pay(partial.number, "review", "b08-partial-review", "b08-partial-tx");
  const partialOrder = await orderRow(partial.number);
  assert.equal(partialOrder.payment_status, "paid");
  assert.equal(partialOrder.order_status, "attention_required");
  assert.equal(partialOrder.fulfillment_status, "attention_required");
  assert.equal(
    (
      await one(
        "select status from shop_inventory_reservations where order_id=$1",
        [partialBefore.id],
      )
    ).status,
    "consumed",
    "partial-refund/manual-review hold cannot invent a restock",
  );

  const ambiguous = await makeOrder();
  const ambiguousBefore = await claimPayment(ambiguous.number);
  await pay(ambiguous.number, "paid", "b08-ambiguous-paid", "b08-ambiguous-tx");
  await db.query("select shop_pack($1,$2)", [ambiguousBefore.id, owner]);
  assert.equal(
    (await one("select shop_claim_shipment($1,$2) ok", [ambiguousBefore.id, owner]))
      .ok,
    true,
  );
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-2','future_provider_state',null,null)",
    [ambiguousBefore.id],
  );
  let ambiguousOrder = await orderRow(ambiguous.number);
  assert.equal(ambiguousOrder.order_status, "attention_required");
  assert.equal(ambiguousOrder.fulfillment_status, "attention_required");
  assert.equal(
    (
      await one(
        "select count(*)::int n from audit_logs where entity_id=$1 and action='shop.shipment.unknown_status'",
        [ambiguousBefore.id],
      )
    ).n,
    1,
  );
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-2','delivered',null,null)",
    [ambiguousBefore.id],
  );
  ambiguousOrder = await orderRow(ambiguous.number);
  assert.equal(
    ambiguousOrder.order_status,
    "attention_required",
    "later provider success cannot auto-clear an ambiguous shipment hold",
  );
  assert.notEqual(ambiguousOrder.order_status, "completed");

  const failedShipment = await makeOrder();
  const failedShipmentBefore = await claimPayment(failedShipment.number);
  await pay(
    failedShipment.number,
    "paid",
    "b08-shipment-failure-paid",
    "b08-shipment-failure-tx",
  );
  await db.query("select shop_pack($1,$2)", [failedShipmentBefore.id, owner]);
  assert.equal(
    (
      await one("select shop_claim_shipment($1,$2) ok", [
        failedShipmentBefore.id,
        owner,
      ])
    ).ok,
    true,
  );
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-3','rejected',null,null)",
    [failedShipmentBefore.id],
  );
  let failedShipmentOrder = await orderRow(failedShipment.number);
  assert.equal(failedShipmentOrder.fulfillment_status, "exception");
  assert.equal(failedShipmentOrder.order_status, "attention_required");
  await assert.rejects(
    db.query(
      "select shop_apply_shipment($1,'different-provider','delivered',null,null)",
      [failedShipmentBefore.id],
    ),
    /shipment mismatch/,
  );
  await db.query(
    "select shop_apply_shipment($1,'b08-provider-3','delivered',null,null)",
    [failedShipmentBefore.id],
  );
  failedShipmentOrder = await orderRow(failedShipment.number);
  assert.equal(
    failedShipmentOrder.order_status,
    "attention_required",
    "known shipment exception cannot be silently auto-cleared",
  );
  assert.equal(failedShipmentOrder.fulfillment_status, "exception");

  assert.equal(
    (
      await one(
        "select bool_and(reserved>=0 and on_hand>=0 and reserved<=on_hand) ok from shop_inventory_balances",
      )
    ).ok,
    true,
    "inventory invariant remains valid across every Batch 08 exception path",
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from shop_orders where order_status='completed' and (payment_status<>'paid' or fulfillment_status<>'delivered')",
      )
    ).n,
    0,
    "no exception path fabricates a completed order",
  );

  console.log(
    "Shop Batch 08: ownership, checkout/idempotency/stale-stock, payment terminal states, late-payment hold, paid-to-delivered flow, full-refund manual stock handling, partial-refund review, shipment duplicate/out-of-order/unknown/exception handling and global inventory consistency PASS",
  );
} finally {
  await db.close();
}
