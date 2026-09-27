import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const workflowSource = await readFile(
  ".github/workflows/shop-staging-reconcile.yml",
  "utf8",
);
const adminSource = await readFile(
  "src/app/admin/shop/[section]/page.tsx",
  "utf8",
);
const accountOrdersSource = await readFile(
  "src/app/shop/orders/page.tsx",
  "utf8",
);
const operationsSource = await readFile("src/lib/shop/operations.ts", "utf8");

assert.match(workflowSource, /cron: "\*\/15 \* \* \* \*"/);
assert.match(workflowSource, /secrets\.SHOP_STAGING_URL/);
assert.match(workflowSource, /secrets\.SHOP_CRON_SECRET/);
assert.match(workflowSource, /body\.status === "blocked"/);
assert.match(adminSource, /shop_admin_orders/);
assert.match(adminSource, /shop_admin_order_detail/);
assert.match(adminSource, /shop_report_v2/);
assert.match(adminSource, /Nilai nol tidak ditampilkan/);
assert.match(accountOrdersSource, /\.range\(/);
assert.doesNotMatch(accountOrdersSource, /\.limit\(100\)/);
assert.match(operationsSource, /shop_expire_unattempted_orders/);
assert.match(operationsSource, /shop_reconciliation_due/);
assert.match(operationsSource, /shop_reconciliation_mark/);
assert.match(operationsSource, /biteshipRuntimeConfigured/);
assert.match(operationsSource, /SHOP_ORDER_PII_RETENTION_DAYS/);
assert.match(operationsSource, /shop_redact_order_pii/);

const db = new PGlite();
try {
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
create table public.profiles(id uuid primary key,role text);
create table public.audit_logs(
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);`);

  for (const migration of [
    "../supabase/migrations/20260926195237_shop_foundation.sql",
    "../supabase/migrations/20260927051000_shop_admin_workflow.sql",
    "../supabase/migrations/20260927123000_shop_batch08_state_machine_hardening.sql",
    "../supabase/migrations/20260927124000_shop_batch09_operations.sql",
    "../supabase/migrations/20260927125000_shop_batch09_pii_retention.sql",
  ]) {
    await db.exec(await readFile(new URL(migration, import.meta.url), "utf8"));
  }

  const one = async (sql, args = []) => (await db.query(sql, args)).rows[0];
  const owner = "00000000-0000-0000-0000-000000000001";
  const stranger = "00000000-0000-0000-0000-000000000002";
  await db.query("insert into profiles values($1,'owner'),($2,'parent')", [
    owner,
    stranger,
  ]);

  const product = await one(
    "select id,title,description from shop_products where product_code='001'",
  );
  await db.query(
    "select shop_admin_product_save($1,$2,$3,'wear',69000,$4,$5)",
    [
      product.id,
      product.title,
      product.description,
      JSON.stringify({ sizeChart: "ONE: verified Batch 09 fixture" }),
      owner,
    ],
  );
  await db.query("select shop_admin_variants_replace($1,$2,$3)", [
    product.id,
    JSON.stringify([
      {
        sku: "001-B09",
        title: "Batch 09",
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
    await one("select id from shop_variants where sku='001-B09'")
  ).id;

  let sequence = 0;
  const tokenHash = (label) =>
    createHash("sha256").update(label).digest("hex");

  async function createCart(qty = 1) {
    sequence++;
    const hash = tokenHash(`batch09-${sequence}`);
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

  async function checkout(cart, account = null, name = "Batch 09 Customer") {
    return (
      await one(
        `select shop_checkout(
          $1::uuid,$2,$3::uuid,$4::jsonb,$5::jsonb,$6::uuid,$2
        ) n`,
        [
          cart.c,
          cart.hash,
          cart.q,
          JSON.stringify({
            name,
            email: "batch09@example.invalid",
            phone: "+628111111111",
          }),
          JSON.stringify({
            address: "Jl. Batch 09",
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

  async function payment(number, status, event, transaction = null) {
    const o = await orderRow(number);
    await db.query("select shop_apply_payment($1,$2,$3,$4,$5)", [
      number,
      o.grand_total_amount,
      status,
      event,
      transaction,
    ]);
  }

  console.log("== Batch 09: local expiry cleanup and reservation release ==");
  const expiringCart = await createCart();
  const expiringNumber = await checkout(expiringCart);
  const expiringOrder = await orderRow(expiringNumber);
  await db.query(
    "update shop_orders set expires_at=now()-interval '5 minutes' where id=$1",
    [expiringOrder.id],
  );
  assert.equal(
    (
      await one(
        "select reserved from shop_inventory_balances where variant_id=$1",
        [variant],
      )
    ).reserved,
    1,
  );
  assert.equal(
    (await one("select shop_expire_unattempted_orders(50) n")).n,
    1,
  );
  assert.equal((await orderRow(expiringNumber)).payment_status, "expired");
  assert.equal(
    (
      await one(
        "select reserved from shop_inventory_balances where variant_id=$1",
        [variant],
      )
    ).reserved,
    0,
  );
  assert.equal(
    (await one("select shop_expire_unattempted_orders(50) n")).n,
    0,
    "expiry cleanup is idempotent",
  );

  console.log("== Batch 09: reconciliation backoff and persistent-error alert ==");
  const pendingCart = await createCart();
  const pendingNumber = await checkout(pendingCart, stranger, "Searchable Customer");
  const pendingOrder = await orderRow(pendingNumber);
  assert.equal(
    (await one("select shop_claim_payment($1) ok", [pendingOrder.id])).ok,
    true,
  );
  let due = await db.query(
    "select * from shop_reconciliation_due('payment',50) where order_id=$1",
    [pendingOrder.id],
  );
  assert.equal(due.rows.length, 1);
  for (let i = 1; i <= 3; i++) {
    assert.equal(
      (
        await one(
          "select shop_reconciliation_mark($1,'payment','error','provider:test') n",
          [pendingOrder.id],
        )
      ).n,
      i,
    );
    if (i < 3)
      await db.query(
        "update shop_reconciliation_state set next_attempt_at=now()-interval '1 second' where order_id=$1 and kind='payment'",
        [pendingOrder.id],
      );
  }
  assert.equal(
    (
      await one(
        "select count(*)::int n from audit_logs where entity_id=$1 and action='shop.reconciliation.alert'",
        [pendingOrder.id],
      )
    ).n,
    1,
  );
  due = await db.query(
    "select * from shop_reconciliation_due('payment',50) where order_id=$1",
    [pendingOrder.id],
  );
  assert.equal(due.rows.length, 0, "backoff suppresses immediate retry");
  await db.query(
    "update shop_reconciliation_state set next_attempt_at=now()-interval '1 second' where order_id=$1 and kind='payment'",
    [pendingOrder.id],
  );
  assert.equal(
    (
      await one(
        "select shop_reconciliation_mark($1,'payment','ok',null) n",
        [pendingOrder.id],
      )
    ).n,
    0,
  );

  console.log("== Batch 09: owner search/filter/pagination/detail and audit note ==");
  let list = (
    await one(
      "select shop_admin_orders($1,null,null,null,1,1) data",
      ["searchable"],
    )
  ).data;
  assert.equal(list.page, 1);
  assert.equal(list.pageSize, 1);
  assert.equal(list.total, 1);
  assert.equal(list.items.length, 1);
  assert.equal(list.items[0].order_number, pendingNumber);
  assert.equal(
    Object.prototype.hasOwnProperty.call(list.items[0], "guest_token_hash"),
    false,
    "admin list does not expose guest token hashes",
  );
  const pendingFilter = (
    await one(
      "select shop_admin_orders(null,'pending',null,'pending_payment',1,25) data",
    )
  ).data;
  assert.ok(
    pendingFilter.items.some((item) => item.order_number === pendingNumber),
  );

  await assert.rejects(
    db.query(
      "select shop_admin_order_action($1,'note','stranger note',$2)",
      [pendingOrder.id, stranger],
    ),
    /owner required/,
  );
  await db.query(
    "select shop_admin_order_action($1,'note','Investigated payment state',$2)",
    [pendingOrder.id, owner],
  );
  let detail = (
    await one("select shop_admin_order_detail($1) data", [pendingNumber])
  ).data;
  assert.ok(
    detail.timeline.some((event) => event.type === "shop.order.note"),
    "owner note appears in order timeline",
  );
  assert.ok(
    detail.reconciliation.some((state) => state.kind === "payment"),
    "reconciliation state appears in detail",
  );

  console.log("== Batch 09: late payment recovery can consume stock only when available ==");
  const lateCart = await createCart();
  const lateNumber = await checkout(lateCart);
  const lateOrder = await orderRow(lateNumber);
  await payment(lateNumber, "expired", "b09-late-expire", null);
  await payment(lateNumber, "paid", "b09-late-paid", "b09-late-tx");
  let lateState = await orderRow(lateNumber);
  assert.equal(lateState.order_status, "attention_required");
  const beforeLateStock = (
    await one("select on_hand from shop_inventory_balances where variant_id=$1", [
      variant,
    ])
  ).on_hand;
  await db.query(
    "select shop_admin_order_action($1,'accept_late_payment_stock','Stock physically available',$2)",
    [lateOrder.id, owner],
  );
  lateState = await orderRow(lateNumber);
  assert.equal(lateState.order_status, "processing");
  assert.equal(lateState.fulfillment_status, "unfulfilled");
  assert.equal(
    (
      await one(
        "select status from shop_inventory_reservations where order_id=$1",
        [lateOrder.id],
      )
    ).status,
    "consumed",
  );
  assert.equal(
    (
      await one("select on_hand from shop_inventory_balances where variant_id=$1", [
        variant,
      ])
    ).on_hand,
    beforeLateStock - 1,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from shop_inventory_ledger where idempotency_key like $1",
        [`late-sale:${lateOrder.id}:%`],
      )
    ).n,
    1,
  );

  console.log("== Batch 09: full refund restock requires explicit owner action ==");
  const refundCart = await createCart();
  const refundNumber = await checkout(refundCart);
  const refundOrder = await orderRow(refundNumber);
  await payment(refundNumber, "paid", "b09-refund-paid", "b09-refund-tx");
  const afterSaleStock = (
    await one("select on_hand from shop_inventory_balances where variant_id=$1", [
      variant,
    ])
  ).on_hand;
  await payment(refundNumber, "refunded", "b09-full-refund", "b09-refund-tx");
  let refundState = await orderRow(refundNumber);
  assert.equal(refundState.payment_status, "refunded");
  assert.equal(refundState.fulfillment_status, "attention_required");
  assert.equal(
    (
      await one("select on_hand from shop_inventory_balances where variant_id=$1", [
        variant,
      ])
    ).on_hand,
    afterSaleStock,
    "provider refund alone never invents a physical return",
  );
  await db.query(
    "select shop_admin_order_action($1,'restock_full_refund','Returned item inspected and received',$2)",
    [refundOrder.id, owner],
  );
  refundState = await orderRow(refundNumber);
  assert.equal(refundState.fulfillment_status, "cancelled");
  assert.equal(
    (
      await one("select on_hand from shop_inventory_balances where variant_id=$1", [
        variant,
      ])
    ).on_hand,
    afterSaleStock + 1,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from shop_inventory_ledger where idempotency_key like $1",
        [`refund-restock:${refundOrder.id}:%`],
      )
    ).n,
    1,
  );

  console.log("== Batch 09: report v2 separates gross, retained, refund and inventory ==");
  const report = (
    await one(
      "select shop_report_v2('2000-01-01T00:00:00Z'::timestamptz,'2100-01-01T00:00:00Z'::timestamptz) data",
    )
  ).data;
  assert.equal(report.summary.partialRefundAccounting, "excluded");
  assert.ok(report.summary.settledOrders >= 2);
  assert.ok(report.summary.grossCollected >= report.summary.collected);
  assert.ok(report.summary.refundedOrders >= 1);
  assert.ok(report.summary.refundedGross > 0);
  assert.ok(report.products.some((row) => row.product_code === "001"));
  assert.ok(report.variants.some((row) => row.sku === "001-B09"));
  assert.ok(report.inventory.some((row) => row.sku === "001-B09"));
  const inventory = report.inventory.find((row) => row.sku === "001-B09");
  assert.equal(inventory.available, inventory.onHand - inventory.reserved);

  assert.equal(
    (
      await one(
        "select bool_and(reserved>=0 and on_hand>=0 and reserved<=on_hand) ok from shop_inventory_balances",
      )
    ).ok,
    true,
  );

  console.log("== Batch 09: PII retention is explicit and terminal-only ==");
  await db.query(
    "update shop_orders set created_at=now()-interval '800 days' where id=$1",
    [expiringOrder.id],
  );
  assert.equal(
    (
      await one(
        "select shop_redact_order_pii(now()-interval '365 days',50) n",
      )
    ).n,
    1,
  );
  const redacted = await orderRow(expiringNumber);
  assert.equal(redacted.customer.name, "[redacted]");
  assert.equal(redacted.address_snapshot.address, "[redacted]");
  assert.ok(redacted.pii_redacted_at);
  assert.equal(
    (
      await one(
        "select count(*)::int n from audit_logs where entity_id=$1 and action='shop.order.pii.redact'",
        [expiringOrder.id],
      )
    ).n,
    1,
  );
  assert.equal(
    (
      await one(
        "select shop_redact_order_pii(now()-interval '365 days',50) n",
      )
    ).n,
    0,
    "PII redaction is idempotent",
  );

  console.log(
    "Shop Batch 09: scheduled-reconcile contract, expiry cleanup, reconciliation backoff/alerts, owner search/filter/pagination/detail timeline, audited manual recovery, report v2, explicit PII retention and inventory/refund consistency PASS",
  );
} finally {
  await db.close();
}
