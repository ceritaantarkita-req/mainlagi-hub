-- Mainlagi Shop Batch 05 — staging validation queries
-- Read-only except SET ROLE / RESET ROLE. Run only after applying the complete
-- migration chain to a non-production staging database.
--
-- Expected Shop seed state:
-- 9 products, 79 total on_hand, 26 approved runtime media,
-- all products Draft/unverified until real owner product facts are entered.

-- 1) Migration/schema surface
select
  (select count(*) from public.shop_products) as shop_products,
  (select coalesce(sum(on_hand),0) from public.shop_inventory_balances) as total_on_hand,
  (select count(*) from public.shop_product_media where approval_status='approved') as approved_media,
  (select count(*) from public.shop_products where status='draft' and review_status='draft' and facts_verified=false) as draft_unverified_products;

-- 2) RLS must be enabled on every public Shop table.
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public'
  and c.relkind='r'
  and c.relname like 'shop_%'
order by c.relname;

-- 3) Browser roles must not execute sensitive Shop RPCs.
select
  p.proname,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute,
  has_function_privilege('service_role', p.oid, 'EXECUTE') as service_role_execute
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
  and p.proname like 'shop_%'
order by p.proname, p.oid::regprocedure::text;

-- 4) Public Shop RLS policies.
select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname='public'
  and tablename like 'shop_%'
order by tablename, policyname;

-- 5) Draft products must remain invisible to anon.
set local role anon;
select count(*) as anon_visible_shop_products from public.shop_products;
reset role;

-- 6) Direct PII/order access must be denied to browser roles.
-- Run each statement independently and expect permission denied:
--
-- set local role anon;
-- select * from public.shop_orders limit 1;
-- reset role;
--
-- set local role authenticated;
-- select * from public.shop_inventory_ledger limit 1;
-- reset role;
--
-- set local role authenticated;
-- select public.shop_admin_transition(
--   '00000000-0000-0000-0000-000000000001'::uuid,
--   'draft',
--   '00000000-0000-0000-0000-000000000001'::uuid
-- );
-- reset role;

-- 7) Verify no active Shop product exists before owner completeness/approval.
select product_code, status, review_status, facts_verified, media_approved
from public.shop_products
where status='active'
order by product_code;

-- 8) Verify Shop function security characteristics.
select
  p.oid::regprocedure::text as function_signature,
  p.prosecdef as security_definer,
  coalesce(array_to_string(p.proconfig, ','),'') as function_config
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname in ('public','private')
  and p.proname like 'shop_%'
order by function_signature;
