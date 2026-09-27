#!/usr/bin/env bash
set -Eeuo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"

psql_base=(psql "$DATABASE_URL" -X -q -v ON_ERROR_STOP=1)

scalar() {
  psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "$1" | tr -d '\r' | tail -n 1
}

expect_scalar() {
  local sql="$1"
  local expected="$2"
  local label="$3"
  local actual
  actual="$(scalar "$sql")"
  if [[ "$actual" != "$expected" ]]; then
    echo "FAIL: $label (expected '$expected', got '$actual')" >&2
    exit 1
  fi
  echo "PASS: $label"
}

echo "== Bootstrap Supabase-compatible database roles/auth surface =="
"${psql_base[@]}" <<'SQL'
do $bootstrap$
begin
  if not exists (select 1 from pg_roles where rolname='anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname='service_role') then
    create role service_role nologin bypassrls;
  end if;
end
$bootstrap$;

create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key,
  email text,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create or replace function auth.uid() returns uuid
language sql stable
as 'select null::uuid';
SQL

echo "== Apply complete repository migration chain to PostgreSQL =="
mapfile -t migrations < <(find supabase/migrations -maxdepth 1 -type f -name '*.sql' | sort)
[[ "${#migrations[@]}" -ge 53 ]] || {
  echo "Expected at least 53 migrations, found ${#migrations[@]}" >&2
  exit 1
}
for migration in "${migrations[@]}"; do
  echo "Applying $migration"
  "${psql_base[@]}" -f "$migration"
done

expect_scalar "select count(*) from public.shop_products" "9" "Shop product seed count"
expect_scalar "select coalesce(sum(on_hand),0) from public.shop_inventory_balances" "79" "Shop seed inventory total"
expect_scalar "select count(*) from public.shop_product_media where approval_status='approved'" "26" "approved runtime media count"
expect_scalar "select count(*) from public.shop_products where status='active'" "0" "no active Shop product after migrations"
expect_scalar "select bool_and(c.relrowsecurity)::text from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and c.relname like 'shop_%'" "true" "RLS enabled on every Shop table"

expect_scalar "select bool_and(not has_function_privilege('anon',p.oid,'EXECUTE') and not has_function_privilege('authenticated',p.oid,'EXECUTE') and has_function_privilege('service_role',p.oid,'EXECUTE'))::text from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('shop_admin_product_save','shop_admin_variants_replace','shop_admin_media_set','shop_admin_transition','shop_inventory_adjust','shop_pack','shop_claim_shipment','shop_apply_shipment','shop_apply_payment','shop_checkout','shop_cart_set','shop_report')" "true" "sensitive Shop RPC privileges"

expect_scalar "set role anon; select count(*) from public.shop_products; reset role" "0" "anon cannot see Draft products"
set +e
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "set role anon; select * from public.shop_orders limit 1" >/tmp/shop-pg-order-deny.log 2>&1
order_read_status=$?
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "set role authenticated; select public.shop_admin_transition('00000000-0000-0000-0000-000000000001'::uuid,'draft','00000000-0000-0000-0000-000000000001'::uuid)" >/tmp/shop-pg-rpc-deny.log 2>&1
rpc_status=$?
set -e
[[ "$order_read_status" -ne 0 ]] || { echo "FAIL: anon Shop order read unexpectedly succeeded" >&2; exit 1; }
[[ "$rpc_status" -ne 0 ]] || { echo "FAIL: authenticated admin RPC unexpectedly succeeded" >&2; exit 1; }
echo "PASS: browser-role PII/RPC denial"

echo "== Seed isolated concurrency fixtures =="
"${psql_base[@]}" <<'SQL'
insert into auth.users(id,email,raw_user_meta_data)
values(
  '00000000-0000-0000-0000-000000000001',
  'shop-ci-owner@example.invalid',
  '{}'::jsonb
)
on conflict(id) do nothing;

insert into public.profiles(id,email,role)
values(
  '00000000-0000-0000-0000-000000000001',
  'shop-ci-owner@example.invalid',
  'owner'
)
on conflict(id) do update set role='owner';

insert into public.shop_products(
  id,product_code,slug,title,description,category_slug,base_price_amount,
  status,review_status,facts,initial_stock_total,facts_verified,media_approved
) values
('10000000-0000-0000-0000-000000000001','T01','ci-t01','CI T01','Concurrency fixture','learn-create',10000,'draft','draft','{}',1,false,true),
('10000000-0000-0000-0000-000000000002','T02','ci-t02','CI T02','Concurrency fixture','learn-create',10000,'draft','draft','{}',1,false,true),
('10000000-0000-0000-0000-000000000003','T03','ci-t03','CI T03','Concurrency fixture','learn-create',10000,'draft','draft','{}',1,false,true),
('10000000-0000-0000-0000-000000000004','T04','ci-t04','CI T04','Payment recovery fixture','learn-create',10000,'draft','draft','{}',1,false,true),
('10000000-0000-0000-0000-000000000005','T05','ci-t05','CI T05','Payment review fixture','learn-create',10000,'draft','draft','{}',1,false,true);

insert into public.shop_product_media(product_id,path,alt_text,role,sort_order,approval_status)
select p.id,'/shop/products/ci-'||lower(p.product_code)||'-hero.webp','CI hero','hero',0,'approved'
from public.shop_products p where p.product_code in ('T01','T02','T03','T04','T05');
insert into public.shop_product_media(product_id,path,alt_text,role,sort_order,approval_status)
select p.id,'/shop/products/ci-'||lower(p.product_code)||'-use.webp','CI use','in_use',1,'approved'
from public.shop_products p where p.product_code in ('T01','T02','T03','T04','T05');

insert into public.shop_variants(id,product_id,sku,title,option_values,weight_grams,is_active) values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','T01-ONE','One','{}',100,true),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','T02-ONE','One','{}',100,true),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000003','T03-ONE','One','{}',100,true),
('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000004','T04-ONE','One','{}',100,true),
('20000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000005','T05-ONE','One','{}',100,true);
insert into public.shop_inventory_balances(variant_id,on_hand,reserved) values
('20000000-0000-0000-0000-000000000001',1,0),
('20000000-0000-0000-0000-000000000002',1,0),
('20000000-0000-0000-0000-000000000003',1,0),
('20000000-0000-0000-0000-000000000004',1,0),
('20000000-0000-0000-0000-000000000005',1,0);
insert into public.shop_inventory_ledger(variant_id,quantity_delta,movement_type,idempotency_key,reason,actor_id) values
('20000000-0000-0000-0000-000000000001',1,'variant_setup','ci-seed:t01','CI fixture','00000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000002',1,'variant_setup','ci-seed:t02','CI fixture','00000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000003',1,'variant_setup','ci-seed:t03','CI fixture','00000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000004',1,'variant_setup','ci-seed:t04','CI fixture','00000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000005',1,'variant_setup','ci-seed:t05','CI fixture','00000000-0000-0000-0000-000000000001');

select public.shop_admin_transition(id,'ready','00000000-0000-0000-0000-000000000001')
from public.shop_products where product_code in ('T01','T02','T03','T04','T05');
select public.shop_admin_transition(id,'approve','00000000-0000-0000-0000-000000000001')
from public.shop_products where product_code in ('T01','T02','T03','T04','T05');
select public.shop_admin_transition(id,'activate','00000000-0000-0000-0000-000000000001')
from public.shop_products where product_code in ('T01','T02','T03','T04','T05');
SQL

create_cart() {
  local cart="$1"
  local quote="$2"
  local variant="$3"
  local hash="$4"
  "${psql_base[@]}" -v cart="$cart" -v quote="$quote" -v variant="$variant" -v hash="$hash" <<'SQL'
insert into public.shop_carts(id,token_hash)
values(:'cart'::uuid,:'hash');
insert into public.shop_cart_items(cart_id,variant_id,quantity)
values(:'cart'::uuid,:'variant'::uuid,1);
insert into public.shop_shipping_quotes(
  id,cart_id,cart_revision,cart_signature,destination_postal_code,
  courier_code,service_code,service_name,price_amount
)
select :'quote'::uuid,id,revision,public.shop_cart_signature(id),'17111',
       'ci','standard','CI Standard',1000
from public.shop_carts where id=:'cart'::uuid;
SQL
}

HASH_A="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
HASH_B="bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
HASH_C="cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
HASH_D="dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
HASH_E="eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
HASH_F="ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
GUEST_HASH="9999999999999999999999999999999999999999999999999999999999999999"
CUSTOMER="'{\"name\":\"CI\"}'::jsonb"
ADDRESS="'{\"postalCode\":\"17111\"}'::jsonb"

echo "== Race 1: two checkouts compete for final unit =="
create_cart "30000000-0000-0000-0000-000000000001" "40000000-0000-0000-0000-000000000001" "20000000-0000-0000-0000-000000000001" "$HASH_A"
create_cart "30000000-0000-0000-0000-000000000002" "40000000-0000-0000-0000-000000000002" "20000000-0000-0000-0000-000000000001" "$HASH_B"

checkout_sql() {
  local cart="$1" hash="$2" quote="$3"
  printf "select public.shop_checkout('%s'::uuid,'%s','%s'::uuid,%s,%s,null,'%s');"     "$cart" "$hash" "$quote" "$CUSTOMER" "$ADDRESS" "$GUEST_HASH"
}

set +e
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "$(checkout_sql "30000000-0000-0000-0000-000000000001" "$HASH_A" "40000000-0000-0000-0000-000000000001")" >/tmp/checkout-a.out 2>&1 &
pid_a=$!
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "$(checkout_sql "30000000-0000-0000-0000-000000000002" "$HASH_B" "40000000-0000-0000-0000-000000000002")" >/tmp/checkout-b.out 2>&1 &
pid_b=$!
wait "$pid_a"; status_a=$?
wait "$pid_b"; status_b=$?
set -e
if ! { [[ "$status_a" -eq 0 && "$status_b" -ne 0 ]] || [[ "$status_b" -eq 0 && "$status_a" -ne 0 ]]; }; then
  echo "FAIL: checkout race expected exactly one success" >&2
  cat /tmp/checkout-a.out /tmp/checkout-b.out >&2
  exit 1
fi
expect_scalar "select count(*) from public.shop_orders where cart_id in ('30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002')" "1" "exactly one checkout survives"
expect_scalar "select (reserved<=on_hand and reserved=1 and on_hand=1)::text from public.shop_inventory_balances where variant_id='20000000-0000-0000-0000-000000000001'" "true" "checkout reservation cannot oversell"

echo "== Race 2: duplicate checkout retry is idempotent =="
winning_cart="$(scalar "select cart_id from public.shop_orders where cart_id in ('30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002')")"
winning_number="$(scalar "select order_number from public.shop_orders where cart_id='$winning_cart'::uuid")"
if [[ "$winning_cart" == "30000000-0000-0000-0000-000000000001" ]]; then
  retry_hash="$HASH_A"; retry_quote="40000000-0000-0000-0000-000000000001"
else
  retry_hash="$HASH_B"; retry_quote="40000000-0000-0000-0000-000000000002"
fi
retry_number="$(scalar "$(checkout_sql "$winning_cart" "$retry_hash" "$retry_quote")")"
[[ "$retry_number" == "$winning_number" ]] || { echo "FAIL: duplicate checkout changed order" >&2; exit 1; }
expect_scalar "select count(*) from public.shop_orders where cart_id='$winning_cart'::uuid" "1" "duplicate checkout creates no second order"

echo "== Race 3: duplicate payment settlement consumes stock once =="
amount="$(scalar "select grand_total_amount from public.shop_orders where order_number='$winning_number'")"
set +e
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "select public.shop_apply_payment('$winning_number',$amount,'paid','ci-paid-a','ci-tx-1');" >/tmp/pay-a.out 2>&1 &
pid_a=$!
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "select public.shop_apply_payment('$winning_number',$amount,'paid','ci-paid-b','ci-tx-1');" >/tmp/pay-b.out 2>&1 &
pid_b=$!
wait "$pid_a"; pay_a=$?
wait "$pid_b"; pay_b=$?
set -e
[[ "$pay_a" -eq 0 && "$pay_b" -eq 0 ]] || { cat /tmp/pay-a.out /tmp/pay-b.out >&2; exit 1; }
expect_scalar "select (on_hand=0 and reserved=0)::text from public.shop_inventory_balances where variant_id='20000000-0000-0000-0000-000000000001'" "true" "duplicate payment consumes one unit once"
expect_scalar "select count(*) from public.shop_inventory_ledger where variant_id='20000000-0000-0000-0000-000000000001' and movement_type='sale'" "1" "one sale ledger movement"

echo "== Race 4: paid settlement versus expiry remains safe =="
create_cart "30000000-0000-0000-0000-000000000003" "40000000-0000-0000-0000-000000000003" "20000000-0000-0000-0000-000000000002" "$HASH_C"
order2="$(scalar "$(checkout_sql "30000000-0000-0000-0000-000000000003" "$HASH_C" "40000000-0000-0000-0000-000000000003")")"
amount2="$(scalar "select grand_total_amount from public.shop_orders where order_number='$order2'")"
set +e
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "select public.shop_apply_payment('$order2',$amount2,'paid','ci-race-paid','ci-tx-2');" >/tmp/race-paid.out 2>&1 &
pid_a=$!
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "select public.shop_apply_payment('$order2',$amount2,'expired','ci-race-expired','ci-tx-2');" >/tmp/race-expired.out 2>&1 &
pid_b=$!
wait "$pid_a"; race_paid=$?
wait "$pid_b"; race_expired=$?
set -e
[[ "$race_paid" -eq 0 && "$race_expired" -eq 0 ]] || { cat /tmp/race-paid.out /tmp/race-expired.out >&2; exit 1; }
expect_scalar "select (payment_status='paid')::text from public.shop_orders where order_number='$order2'" "true" "paid/expiry race ends with paid recorded"
expect_scalar "select case when o.order_status='processing' then (b.on_hand=0 and b.reserved=0 and r.status='consumed') when o.order_status='attention_required' then (b.on_hand=1 and b.reserved=0 and r.status='released') else false end::text from public.shop_orders o join public.shop_inventory_reservations r on r.order_id=o.id join public.shop_inventory_balances b on b.variant_id=r.variant_id where o.order_number='$order2'" "true" "paid/expiry race never silently oversells released stock"

echo "== Race 5: inventory adjustment versus checkout preserves invariant =="
create_cart "30000000-0000-0000-0000-000000000004" "40000000-0000-0000-0000-000000000004" "20000000-0000-0000-0000-000000000003" "$HASH_D"
set +e
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "$(checkout_sql "30000000-0000-0000-0000-000000000004" "$HASH_D" "40000000-0000-0000-0000-000000000004")" >/tmp/adjust-checkout.out 2>&1 &
pid_a=$!
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "select public.shop_inventory_adjust('20000000-0000-0000-0000-000000000003'::uuid,-1,'CI concurrent recount','ci-adjust-race-0001','00000000-0000-0000-0000-000000000001'::uuid);" >/tmp/adjust-admin.out 2>&1 &
pid_b=$!
wait "$pid_a"; adjust_checkout=$?
wait "$pid_b"; adjust_admin=$?
set -e
if ! { [[ "$adjust_checkout" -eq 0 && "$adjust_admin" -ne 0 ]] || [[ "$adjust_checkout" -ne 0 && "$adjust_admin" -eq 0 ]]; }; then
  echo "FAIL: adjustment/checkout race expected exactly one stock claimant" >&2
  cat /tmp/adjust-checkout.out /tmp/adjust-admin.out >&2
  exit 1
fi
expect_scalar "select (on_hand>=0 and reserved>=0 and reserved<=on_hand)::text from public.shop_inventory_balances where variant_id='20000000-0000-0000-0000-000000000003'" "true" "inventory invariant after checkout/adjustment race"

echo "== Race 6: duplicate shipment claim yields one lease owner =="
order1_id="$(scalar "select id from public.shop_orders where order_number='$winning_number'")"
"${psql_base[@]}" -c "select public.shop_pack('$order1_id'::uuid,'00000000-0000-0000-0000-000000000001'::uuid);"
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "select public.shop_claim_shipment('$order1_id'::uuid,'00000000-0000-0000-0000-000000000001'::uuid);" >/tmp/ship-a.out 2>&1 &
pid_a=$!
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "select public.shop_claim_shipment('$order1_id'::uuid,'00000000-0000-0000-0000-000000000001'::uuid);" >/tmp/ship-b.out 2>&1 &
pid_b=$!
wait "$pid_a"; ship_a=$?
wait "$pid_b"; ship_b=$?
[[ "$ship_a" -eq 0 && "$ship_b" -eq 0 ]] || { cat /tmp/ship-a.out /tmp/ship-b.out >&2; exit 1; }
ship_true="$(cat /tmp/ship-a.out /tmp/ship-b.out | tr -d '\r' | grep -c '^t$' || true)"
ship_false="$(cat /tmp/ship-a.out /tmp/ship-b.out | tr -d '\r' | grep -c '^f$' || true)"
[[ "$ship_true" == "1" && "$ship_false" == "1" ]] || {
  echo "FAIL: expected one true and one false shipment claim" >&2
  cat /tmp/ship-a.out /tmp/ship-b.out >&2
  exit 1
}
expect_scalar "select count(*) from public.shop_shipments where order_id='$order1_id'::uuid" "1" "one shipment lease row"

echo "== Batch 06: payment lease timeout/retry and late settlement hold =="
create_cart "30000000-0000-0000-0000-000000000005" "40000000-0000-0000-0000-000000000005" "20000000-0000-0000-0000-000000000004" "$HASH_E"
order3="$(scalar "$(checkout_sql "30000000-0000-0000-0000-000000000005" "$HASH_E" "40000000-0000-0000-0000-000000000005")")"
order3_id="$(scalar "select id from public.shop_orders where order_number='$order3'")"
amount3="$(scalar "select grand_total_amount from public.shop_orders where order_number='$order3'")"
expect_scalar "select public.shop_claim_payment('$order3_id'::uuid)::text" "true" "first payment session claim succeeds"
expect_scalar "select public.shop_claim_payment('$order3_id'::uuid)::text" "false" "second payment session claim is blocked during lease"
"${psql_base[@]}" -c "update public.shop_payment_attempts set lease_until=now()-interval '1 second' where order_id='$order3_id'::uuid;"
expect_scalar "select public.shop_claim_payment('$order3_id'::uuid)::text" "true" "expired payment-session lease can be safely reclaimed"
expect_scalar "select count(*) from public.shop_payment_attempts where order_id='$order3_id'::uuid and provider_order_id='$order3' and snap_token is null" "1" "payment-session retries keep one provider identity"

"${psql_base[@]}" -c "select public.shop_apply_payment('$order3',$amount3,'expired','ci-late-expire',null);"
expect_scalar "select (payment_status='expired' and order_status='expired')::text from public.shop_orders where order_number='$order3'" "true" "expiry releases unpaid order"
expect_scalar "select (on_hand=1 and reserved=0)::text from public.shop_inventory_balances where variant_id='20000000-0000-0000-0000-000000000004'" "true" "expiry releases reservation without consuming stock"

"${psql_base[@]}" -c "select public.shop_apply_payment('$order3',$amount3,'paid','ci-late-paid','ci-tx-late');"
expect_scalar "select (payment_status='paid' and order_status='attention_required' and fulfillment_status='attention_required')::text from public.shop_orders where order_number='$order3'" "true" "late settlement is recorded but held for manual review"
expect_scalar "select (on_hand=1 and reserved=0)::text from public.shop_inventory_balances where variant_id='20000000-0000-0000-0000-000000000004'" "true" "late settlement never consumes already released stock"
expect_scalar "select count(*) from public.audit_logs where action='shop.payment.late' and entity_id='$order3_id'" "1" "late settlement creates one audit hold"

echo "== Batch 06: duplicate and out-of-order payment events never regress paid state =="
"${psql_base[@]}" -c "select public.shop_apply_payment('$order3',$amount3,'paid','ci-late-paid','ci-tx-late');"
expect_scalar "select count(*) from public.shop_provider_events where provider='midtrans' and event_key='ci-late-paid'" "1" "duplicate provider event is idempotent"
"${psql_base[@]}" -c "select public.shop_apply_payment('$order3',$amount3,'expired','ci-stale-expire','ci-tx-late');"
"${psql_base[@]}" -c "select public.shop_apply_payment('$order3',$amount3,'cancelled','ci-stale-cancel','ci-tx-late');"
"${psql_base[@]}" -c "select public.shop_apply_payment('$order3',$amount3,'failed','ci-stale-failed','ci-tx-late');"
expect_scalar "select (payment_status='paid' and order_status='attention_required')::text from public.shop_orders where order_number='$order3'" "true" "out-of-order terminal events cannot regress a verified paid order"

echo "== Batch 06: amount and provider transaction identity mismatch fail closed =="
set +e
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "select public.shop_apply_payment('$order3',$((amount3+1)),'paid','ci-wrong-amount','ci-tx-late');" >/tmp/payment-wrong-amount.out 2>&1
wrong_amount_status=$?
psql "$DATABASE_URL" -X -qAt -v ON_ERROR_STOP=1 -c "select public.shop_apply_payment('$order3',$amount3,'paid','ci-wrong-tx','ci-tx-other');" >/tmp/payment-wrong-tx.out 2>&1
wrong_tx_status=$?
set -e
[[ "$wrong_amount_status" -ne 0 ]] || { echo "FAIL: wrong payment amount unexpectedly accepted" >&2; cat /tmp/payment-wrong-amount.out >&2; exit 1; }
[[ "$wrong_tx_status" -ne 0 ]] || { echo "FAIL: mismatched provider transaction unexpectedly accepted" >&2; cat /tmp/payment-wrong-tx.out >&2; exit 1; }
expect_scalar "select count(*) from public.shop_provider_events where event_key in ('ci-wrong-amount','ci-wrong-tx')" "0" "rejected identity mismatches create no provider event"

echo "== Batch 06: ambiguous provider state holds reservation for manual review =="
create_cart "30000000-0000-0000-0000-000000000006" "40000000-0000-0000-0000-000000000006" "20000000-0000-0000-0000-000000000005" "$HASH_F"
order4="$(scalar "$(checkout_sql "30000000-0000-0000-0000-000000000006" "$HASH_F" "40000000-0000-0000-0000-000000000006")")"
amount4="$(scalar "select grand_total_amount from public.shop_orders where order_number='$order4'")"
"${psql_base[@]}" -c "select public.shop_apply_payment('$order4',$amount4,'review','ci-review','ci-tx-review');"
expect_scalar "select (payment_status='pending' and order_status='attention_required' and fulfillment_status='attention_required')::text from public.shop_orders where order_number='$order4'" "true" "ambiguous provider state is held for review"
expect_scalar "select (on_hand=1 and reserved=1)::text from public.shop_inventory_balances where variant_id='20000000-0000-0000-0000-000000000005'" "true" "manual-review hold retains inventory reservation"
expect_scalar "select count(*) from public.shop_inventory_ledger where variant_id='20000000-0000-0000-0000-000000000005' and movement_type='sale'" "0" "manual-review hold creates no sale movement"

echo "PostgreSQL 17 Shop staging gate: full migrations, RLS/RPC security, six concurrency races, and deterministic Batch 06 payment edge cases PASS"
