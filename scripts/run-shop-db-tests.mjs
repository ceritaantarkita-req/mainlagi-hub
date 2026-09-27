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
  await db.exec(
    "update shop_products set status='active',facts_verified=true,media_approved=true; update shop_variants set weight_grams=200",
  );
  const v = (await one("select id from shop_variants where sku='001-DEFAULT'"))
    .id;
  const owner = "00000000-0000-0000-0000-000000000001";
  await db.query("insert into profiles values($1,'owner')", [owner]);
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
    "Shop SQL: seeds, RLS, RPC grants, reservation, idempotency, amount, stale events, late payment, quote invalidation, missing inventory, owner gate, packing, shipment leases, no status regression, refund release, adjustment idempotency, reporting PASS",
  );
} finally {
  await db.close();
}
