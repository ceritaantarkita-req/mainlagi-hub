import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const db = new PGlite();
try {
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
 create table public.profiles(id uuid primary key,role text);
 create table public.audit_logs(id bigint generated always as identity primary key,actor_id uuid,action text,entity text,entity_id text,payload jsonb default '{}');`);
  await db.exec(
    await readFile(
      new URL(
        "../supabase/migrations/20260926195237_shop_foundation.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const one = async (sql, args = []) => (await db.query(sql, args)).rows[0];
  assert.equal((await one("select count(*)::int n from shop_products")).n, 9);
  assert.equal(
    (await one("select sum(on_hand)::int n from shop_inventory_balances")).n,
    79,
  );
  assert.equal(
    (await one("select count(*)::int n from shop_product_media")).n,
    26,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from shop_product_media where approval_status='approved'",
      )
    ).n,
    26,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from shop_products where media_approved=true and status='draft' and facts_verified=false",
      )
    ).n,
    9,
  );
  await db.exec("set role anon");
  assert.equal((await one("select count(*)::int n from shop_products")).n, 0);
  await assert.rejects(
    db.query("select * from shop_orders"),
    /permission denied/,
  );
  await assert.rejects(
    db.query("select shop_rate_limit('test')"),
    /permission denied/,
  );
  await db.exec("reset role");
  const owner = "00000000-0000-0000-0000-000000000001";
  const stranger = "00000000-0000-0000-0000-000000000002";
  await db.query("insert into profiles values($1,'owner'),($2,'parent')", [
    owner,
    stranger,
  ]);
  const product = await one(
    "select id,title,description from shop_products where product_code='001'",
  );
  await assert.rejects(
    db.query("select shop_admin_transition($1,'ready',$2)", [
      product.id,
      owner,
    ]),
    /product incomplete/,
  );
  await assert.rejects(
    db.query(
      "select shop_admin_product_save($1,$2,$3,'wear',69000,$4,$5)",
      [
        product.id,
        product.title,
        product.description,
        JSON.stringify({ sizeChart: "S: verified sample measurements" }),
        stranger,
      ],
    ),
    /owner required/,
  );
  await db.query(
    "select shop_admin_product_save($1,$2,$3,'wear',69000,$4,$5)",
    [
      product.id,
      product.title,
      product.description,
      JSON.stringify({ sizeChart: "S: verified sample measurements" }),
      owner,
    ],
  );
  const invalidSplit = JSON.stringify([
    {
      sku: "001-S",
      title: "Size S",
      optionValues: { size: "S" },
      onHand: 10,
      priceOverride: null,
      weightGrams: 200,
      lengthMm: null,
      widthMm: null,
      heightMm: null,
      isActive: true,
    },
  ]);
  await assert.rejects(
    db.query("select shop_admin_variants_replace($1,$2,$3)", [
      product.id,
      invalidSplit,
      owner,
    ]),
    /variant stock must equal approved initial total 9/,
  );
  const validSplit = JSON.stringify([
    {
      sku: "001-S",
      title: "Size S",
      optionValues: { size: "S" },
      onHand: 4,
      priceOverride: null,
      weightGrams: 200,
      lengthMm: 250,
      widthMm: 200,
      heightMm: 40,
      isActive: true,
    },
    {
      sku: "001-M",
      title: "Size M",
      optionValues: { size: "M" },
      onHand: 5,
      priceOverride: null,
      weightGrams: 210,
      lengthMm: 260,
      widthMm: 210,
      heightMm: 40,
      isActive: true,
    },
  ]);
  await db.query("select shop_admin_variants_replace($1,$2,$3)", [
    product.id,
    validSplit,
    owner,
  ]);
  assert.equal(
    (
      await one(
        "select sum(on_hand)::int n from shop_inventory_balances b join shop_variants v on v.id=b.variant_id where v.product_id=$1",
        [product.id],
      )
    ).n,
    9,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from shop_variants where product_id=$1 and sku='001-DEFAULT'",
        [product.id],
      )
    ).n,
    0,
  );
  await db.query("select shop_admin_transition($1,'ready',$2)", [
    product.id,
    owner,
  ]);
  assert.equal(
    (
      await one("select review_status from shop_products where id=$1", [
        product.id,
      ])
    ).review_status,
    "ready_for_review",
  );
  await db.query("select shop_admin_transition($1,'approve',$2)", [
    product.id,
    owner,
  ]);
  await db.query("select shop_admin_transition($1,'activate',$2)", [
    product.id,
    owner,
  ]);
  assert.equal(
    (
      await one(
        "select status||':'||review_status||':'||facts_verified::text state from shop_products where id=$1",
        [product.id],
      )
    ).state,
    "active:approved:true",
  );
  const v = (await one("select id from shop_variants where sku='001-S'")).id;
  await assert.rejects(
    db.query("update shop_variants set weight_grams=201 where id=$1", [v]),
    /deactivate product before editing/,
  );
  const media = (
    await one(
      "select id from shop_product_media where product_id=$1 order by sort_order limit 1",
      [product.id],
    )
  ).id;
  await assert.rejects(
    db.query("update shop_product_media set approval_status='review' where id=$1", [
      media,
    ]),
    /deactivate product before editing/,
  );
  assert.ok(
    (
      await one(
        "select count(*)::int n from audit_logs where entity_id=$1 and action like 'shop.product.%'",
        [product.id],
      )
    ).n >= 4,
  );
  const hash = "a".repeat(64);
  async function cart(qty = 1) {
    const c = (
      await one("insert into shop_carts(token_hash) values($1) returning id", [
        hash,
      ])
    ).id;
    await db.query("select shop_cart_set($1,$2,$3,$4)", [c, hash, v, qty]);
    const q = (
      await one(
        `insert into shop_shipping_quotes(cart_id,cart_revision,cart_signature,destination_postal_code,courier_code,service_code,service_name,price_amount)
  select id,revision,shop_cart_signature(id),'12345','jne','reg','Regular',10000 from shop_carts where id=$1 returning id`,
        [c],
      )
    ).id;
    return { c, q };
  }
  const checkout = async ({ c, q }) =>
    (
      await one(
        `select shop_checkout($1,$2,$3,'{}','{"postalCode":"12345"}',null,$2) n`,
        [c, hash, q],
      )
    ).n;
  const first = await cart(2),
    num = await checkout(first);
  assert.equal(
    await checkout(first),
    num,
    "checkout retry creates no duplicate",
  );
  assert.equal(
    (
      await one(
        "select reserved from shop_inventory_balances where variant_id=$1",
        [v],
      )
    ).reserved,
    2,
  );
  await assert.rejects(
    db.query("select shop_inventory_adjust($1,-8,$2,$3,$4)", [
      v,
      "cannot steal reserved",
      "adjust-test-1",
      owner,
    ]),
    /stock adjustment unavailable/,
  );
  const pay = async (number, status, event, amount = 148000) =>
    db.query("select shop_apply_payment($1,$2,$3,$4,$5)", [
      number,
      amount,
      status,
      event,
      "txn-" + number,
    ]);
  await assert.rejects(pay(num, "paid", "bad", 1), /payment mismatch/);
  await pay(num, "paid", "paid-1");
  await pay(num, "paid", "paid-1");
  await pay(num, "paid", "paid-2");
  await pay(num, "expired", "stale");
  await db.query("select shop_admin_transition($1,'deactivate',$2)", [
    product.id,
    owner,
  ]);
  await assert.rejects(
    db.query("select shop_admin_variants_replace($1,$2,$3)", [
      product.id,
      validSplit,
      owner,
    ]),
    /variant history exists/,
  );
  await db.query("select shop_admin_transition($1,'activate',$2)", [
    product.id,
    owner,
  ]);
  assert.equal(
    (
      await one(
        "select on_hand from shop_inventory_balances where variant_id=$1",
        [v],
      )
    ).on_hand,
    7,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from shop_inventory_ledger where movement_type='sale'",
      )
    ).n,
    1,
  );
  const second = await cart(),
    late = await checkout(second);
  await pay(late, "expired", "expire-2", 79000);
  await pay(late, "paid", "late-2", 79000);
  assert.equal(
    (
      await one("select order_status from shop_orders where order_number=$1", [
        late,
      ])
    ).order_status,
    "attention_required",
  );
  assert.equal(
    (
      await one(
        "select on_hand from shop_inventory_balances where variant_id=$1",
        [v],
      )
    ).on_hand,
    7,
  );
  const oid = (
    await one("select id from shop_orders where order_number=$1", [num])
  ).id;
  await assert.rejects(
    db.query("select shop_claim_shipment($1,$2)", [oid, owner]),
    /order not ready/,
  );
  await assert.rejects(
    db.query("select shop_pack($1,$2)", [
      oid,
      "00000000-0000-0000-0000-000000000002",
    ]),
    /owner required/,
  );
  await db.query("select shop_pack($1,$2)", [oid, owner]);
  assert.equal(
    (await one("select shop_claim_shipment($1,$2) ok", [oid, owner])).ok,
    true,
  );
  assert.equal(
    (await one("select shop_claim_shipment($1,$2) ok", [oid, owner])).ok,
    false,
  );
  await db.query(
    "select shop_apply_shipment($1,'provider-1','delivered','RESI',null)",
    [oid],
  );
  await db.query(
    "select shop_apply_shipment($1,'provider-1','confirmed','RESI',null)",
    [oid],
  );
  assert.equal(
    (await one("select fulfillment_status from shop_orders where id=$1", [oid]))
      .fulfillment_status,
    "delivered",
  );
  await pay(num, "review", "partial-refund");
  assert.equal(
    (await one("select order_status from shop_orders where id=$1", [oid]))
      .order_status,
    "attention_required",
  );
  const refundEarly = await checkout(await cart());
  await pay(refundEarly, "refunded", "refund-before-paid", 79000);
  assert.equal(
    (
      await one(
        "select reserved from shop_inventory_balances where variant_id=$1",
        [v],
      )
    ).reserved,
    0,
    "refund before settlement releases active reservation",
  );
  const pendingPack = await checkout(await cart());
  const pendingId = (
    await one("select id from shop_orders where order_number=$1", [pendingPack])
  ).id;
  await assert.rejects(
    db.query("select shop_pack($1,$2)", [pendingId, owner]),
    /order cannot be packed/,
  );
  await pay(pendingPack, "expired", "expire-pending", 79000);
  const adjustment = [
    v,
    2,
    "physical recount",
    "adjustment-idempotency",
    owner,
  ];
  await db.query("select shop_inventory_adjust($1,$2,$3,$4,$5)", adjustment);
  await db.query("select shop_inventory_adjust($1,$2,$3,$4,$5)", adjustment);
  assert.equal(
    (
      await one(
        "select on_hand from shop_inventory_balances where variant_id=$1",
        [v],
      )
    ).on_hand,
    9,
  );
  await assert.rejects(
    db.query("select shop_inventory_adjust($1,3,$2,$3,$4)", [
      v,
      adjustment[2],
      adjustment[3],
      owner,
    ]),
    /idempotency conflict/,
  );
  const crossA = await cart(),
    crossB = await cart();
  await assert.rejects(
    checkout({ c: crossA.c, q: crossB.q }),
    /shipping quote stale/,
  );
  const wrongToken = "b".repeat(64);
  await assert.rejects(
    db.query("select shop_cart_set($1,$2,$3,1)", [crossA.c, wrongToken, v]),
    /cart unavailable/,
  );
  const report = (
    await one("select shop_report('2000-01-01','2100-01-01') report")
  ).report;
  assert.equal(report.paidOrders, 2);
  assert.equal(report.refundedOrders, 1);
  assert.equal(report.merchandise + report.shipping, report.collected);
  await db.exec("set role authenticated");
  await assert.rejects(
    db.query("select * from shop_inventory_ledger"),
    /permission denied/,
  );
  await assert.rejects(
    db.query("select shop_pack($1,$2)", [oid, owner]),
    /permission denied/,
  );
  await db.exec("reset role");
  const stale = await cart();
  await db.query("select shop_cart_set($1,$2,$3,2)", [stale.c, hash, v]);
  await assert.rejects(checkout(stale), /shipping quote stale/);
  const repriced = await cart();
  await db.exec(
    "update shop_products set base_price_amount=70000 where product_code='001'",
  );
  await assert.rejects(checkout(repriced), /shipping quote stale/);
  const emptyBalance = await cart();
  await db.query("delete from shop_inventory_balances where variant_id=$1", [
    v,
  ]);
  await assert.rejects(checkout(emptyBalance), /inventory missing/);
  console.log(
    "Shop SQL: seeds, RLS, owner product workflow, fail-closed activation, variant stock conservation/history lock, media guards, audit logs, reservation, idempotency, amount, stale events, late payment, quote invalidation, missing inventory, packing, shipment leases, no status regression, refund release, adjustment idempotency, reporting PASS",
  );
} finally {
  await db.close();
}
