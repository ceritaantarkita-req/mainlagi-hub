-- Additive Shop domain. No applied migrations or learning tables are changed.
-- All financial/stock writes and guest reads use server-only service_role.
create table public.shop_categories (
 slug text primary key, name text not null, sort_order int not null
);
create table public.shop_products (
 id uuid primary key default gen_random_uuid(), product_code text unique not null,
 slug text unique not null, title text not null, description text not null,
 category_slug text not null references public.shop_categories(slug),
 base_price_amount int not null check(base_price_amount>0),
 status text not null default 'draft' check(status in ('draft','active','coming_soon','archived')),
 facts_verified boolean not null default false, media_approved boolean not null default false,
 updated_at timestamptz not null default now()
);
create table public.shop_variants (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.shop_products(id),
 sku text not null unique, title text not null default 'Default',
 option_values jsonb not null default '{}', price_override_amount int check(price_override_amount>0),
 weight_grams int check(weight_grams>0), length_mm int check(length_mm>0), width_mm int check(width_mm>0), height_mm int check(height_mm>0),
 is_active boolean not null default true
);
create index on public.shop_variants(product_id);
create table public.shop_product_media (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.shop_products(id),
 path text not null check(path like '/shop/products/%.webp'), alt_text text not null,
 role text not null check(role in ('hero','in_use','in_use_alt')), sort_order int not null,
 approval_status text not null default 'review' check(approval_status in ('review','approved','rejected')),
 unique(product_id,sort_order)
);
create table public.shop_inventory_balances (
 variant_id uuid primary key references public.shop_variants(id),
 on_hand int not null default 0 check(on_hand>=0), reserved int not null default 0 check(reserved>=0 and reserved<=on_hand)
);
create table public.shop_inventory_ledger (
 id uuid primary key default gen_random_uuid(), variant_id uuid not null references public.shop_variants(id),
 quantity_delta int not null check(quantity_delta<>0), movement_type text not null,
 idempotency_key text not null unique, reason text not null, actor_id uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now()
);
create table public.shop_carts (
 id uuid primary key default gen_random_uuid(), token_hash text not null check(length(token_hash)=64),
 status text not null default 'active' check(status in ('active','converted')),
 revision int not null default 0, expires_at timestamptz not null default now()+interval '30 days'
);
create table public.shop_cart_items (
 cart_id uuid not null references public.shop_carts(id), variant_id uuid not null references public.shop_variants(id),
 quantity int not null check(quantity between 1 and 79), primary key(cart_id,variant_id)
);
create table public.shop_shipping_quotes (
 id uuid primary key default gen_random_uuid(), cart_id uuid not null references public.shop_carts(id),
 cart_revision int not null, cart_signature text not null,
 destination_postal_code text not null check(destination_postal_code ~ '^\d{5}$'),
 courier_code text not null, service_code text not null, service_name text not null, duration_text text,
 price_amount int not null check(price_amount>=0), expires_at timestamptz not null default now()+interval '15 minutes'
);
create table public.shop_orders (
 id uuid primary key default gen_random_uuid(), order_number text not null unique,
 cart_id uuid not null unique references public.shop_carts(id),
 account_id uuid references public.profiles(id) on delete set null,
 guest_token_hash text not null check(length(guest_token_hash)=64),
 customer jsonb not null, address_snapshot jsonb not null, shipping_quote_snapshot jsonb not null,
 subtotal_amount int not null check(subtotal_amount>0), shipping_amount int not null check(shipping_amount>=0),
 grand_total_amount int not null check(grand_total_amount=subtotal_amount+shipping_amount),
 order_status text not null default 'pending_payment' check(order_status in ('pending_payment','processing','completed','cancelled','expired','attention_required','refunded')),
 payment_status text not null default 'pending' check(payment_status in ('pending','paid','failed','expired','cancelled','refunded')),
 fulfillment_status text not null default 'unfulfilled' check(fulfillment_status in ('unfulfilled','ready_to_ship','shipment_created','in_transit','delivered','exception','attention_required','cancelled')),
 expires_at timestamptz not null default now()+interval '30 minutes',
 paid_at timestamptz, created_at timestamptz not null default now()
);
create index on public.shop_orders(account_id,created_at);
create table public.shop_order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.shop_orders(id),
 variant_id uuid not null references public.shop_variants(id), product_code_snapshot text not null,
 title_snapshot text not null, sku_snapshot text not null, option_snapshot jsonb not null,
 unit_price_amount int not null check(unit_price_amount>0), quantity int not null check(quantity>0),
 weight_grams_snapshot int not null check(weight_grams_snapshot>0),
 line_total_amount int not null check(line_total_amount=unit_price_amount*quantity), unique(order_id,variant_id)
);
create table public.shop_inventory_reservations (
 order_id uuid not null references public.shop_orders(id), variant_id uuid not null references public.shop_variants(id),
 quantity int not null check(quantity>0), status text not null default 'active' check(status in ('active','consumed','released')),
 primary key(order_id,variant_id)
);
create table public.shop_payment_attempts (
 order_id uuid primary key references public.shop_orders(id), provider_order_id text unique not null,
 snap_token text, redirect_url text, lease_until timestamptz, provider_transaction_id text,
 updated_at timestamptz not null default now()
);
create table public.shop_shipments (
 order_id uuid primary key references public.shop_orders(id), provider_order_id text unique,
 status text not null default 'creating', waybill_id text, tracking_url text,
 lease_until timestamptz, updated_at timestamptz not null default now()
);
create table public.shop_provider_events (
 id uuid primary key default gen_random_uuid(), provider text not null, event_key text not null,
 order_id uuid not null references public.shop_orders(id), event_type text not null,
 received_at timestamptz not null default now(), unique(provider,event_key)
);
create table public.shop_reviews (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.shop_products(id),
 account_id uuid references public.profiles(id) on delete set null,
 order_item_id uuid not null unique references public.shop_order_items(id),
 stars int not null check(stars between 1 and 5), review_text text,
 status text not null default 'pending' check(status in ('pending','approved','rejected'))
);
create table public.shop_rate_limits (key text primary key, window_start timestamptz not null, hits int not null);

-- Least privilege: no browser writes, no direct access to guest tokens/PII.
do $$ declare t text; begin
 for t in select tablename from pg_tables where schemaname='public' and tablename like 'shop_%' loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant all on public.%I to service_role',t);
 end loop;
end $$;
grant select on public.shop_categories,public.shop_products,public.shop_variants,public.shop_product_media to anon,authenticated;
create policy shop_categories_read on public.shop_categories for select to anon,authenticated using(true);
create policy shop_products_read on public.shop_products for select to anon,authenticated using(status='active' and facts_verified and media_approved);
create policy shop_variants_read on public.shop_variants for select to anon,authenticated using(is_active and exists(select 1 from public.shop_products p where p.id=product_id));
create policy shop_media_read on public.shop_product_media for select to anon,authenticated using(approval_status='approved' and exists(select 1 from public.shop_products p where p.id=product_id));
-- Order reads always pass through an authorized server DTO; no token columns exposed via RLS.

create function public.shop_rate_limit(p_key text) returns boolean language plpgsql security invoker set search_path=pg_catalog,public as $$
declare n int; begin
 insert into public.shop_rate_limits values(p_key,date_trunc('minute',now()),1)
 on conflict(key) do update set window_start=date_trunc('minute',now()),
 hits=case when shop_rate_limits.window_start=date_trunc('minute',now()) then shop_rate_limits.hits+1 else 1 end returning hits into n;
 return n<=30;
end $$;

create function public.shop_cart_set(p_cart uuid,p_hash text,p_variant uuid,p_quantity int) returns void
language plpgsql security invoker set search_path=pg_catalog,public as $$
begin
 perform 1 from public.shop_carts where id=p_cart and token_hash=p_hash and status='active' and expires_at>now() for update;
 if not found then raise exception 'cart unavailable'; end if;
 if p_quantity is null or p_quantity not between 0 and 79 then raise exception 'invalid quantity'; end if;
 if p_quantity=0 then delete from public.shop_cart_items where cart_id=p_cart and variant_id=p_variant;
 else
  perform 1 from public.shop_variants v join public.shop_products p on p.id=v.product_id join public.shop_inventory_balances b on b.variant_id=v.id
  where v.id=p_variant and v.is_active and p.status='active' and p.facts_verified and p.media_approved and v.weight_grams>0 and b.on_hand-b.reserved>=p_quantity;
  if not found then raise exception 'product unavailable'; end if;
  insert into public.shop_cart_items values(p_cart,p_variant,p_quantity) on conflict(cart_id,variant_id) do update set quantity=excluded.quantity;
 end if;
 update public.shop_carts set revision=revision+1 where id=p_cart;
end $$;

create function public.shop_cart_signature(p_cart uuid) returns text language sql stable security invoker set search_path=pg_catalog,public as $$
 select md5(coalesce(string_agg(v.id::text||':'||i.quantity||':'||coalesce(v.price_override_amount,p.base_price_amount)||':'||coalesce(v.weight_grams,0), '|' order by v.id),''))
 from public.shop_cart_items i join public.shop_variants v on v.id=i.variant_id join public.shop_products p on p.id=v.product_id where i.cart_id=p_cart;
$$;

create function public.shop_checkout(p_cart uuid,p_hash text,p_quote uuid,p_customer jsonb,p_address jsonb,p_account uuid,p_order_hash text) returns text
language plpgsql security invoker set search_path=pg_catalog,public as $$
declare c public.shop_carts; q public.shop_shipping_quotes; r record; total int:=0; oid uuid:=gen_random_uuid(); num text;
begin
 select * into c from public.shop_carts where id=p_cart and token_hash=p_hash for update;
 if not found then raise exception 'cart unavailable'; end if;
 -- A converted cart is its own idempotency boundary; retries return the same order.
 select order_number into num from public.shop_orders where cart_id=p_cart;
 if found then return num; end if;
 if c.status<>'active' or c.expires_at<=now() then raise exception 'cart expired'; end if;
 -- Freeze catalog facts before validating the quote and writing snapshots.
 perform v.id from public.shop_variants v join public.shop_cart_items i on i.variant_id=v.id
 where i.cart_id=p_cart order by v.id for share of v;
 perform p.id from public.shop_products p where p.id in
 (select v.product_id from public.shop_variants v join public.shop_cart_items i on i.variant_id=v.id where i.cart_id=p_cart)
 order by p.id for share;
 if exists(select 1 from public.shop_cart_items i left join public.shop_inventory_balances b on b.variant_id=i.variant_id
 where i.cart_id=p_cart and b.variant_id is null) then raise exception 'inventory missing'; end if;
 select * into q from public.shop_shipping_quotes where id=p_quote and cart_id=p_cart and cart_revision=c.revision
 and cart_signature=public.shop_cart_signature(p_cart) and expires_at>now() and destination_postal_code=p_address->>'postalCode';
 if not found then raise exception 'shipping quote stale'; end if;
 -- Deterministic locking order across checkout/payment/expiry/admin adjustment.
 perform b.variant_id from public.shop_inventory_balances b join public.shop_cart_items i on i.variant_id=b.variant_id
 where i.cart_id=p_cart order by b.variant_id for update of b;
 for r in select i.quantity,v.*,p.product_code,p.title as product_title,p.status,p.facts_verified,p.media_approved,coalesce(v.price_override_amount,p.base_price_amount) as price,
 b.on_hand,b.reserved from public.shop_cart_items i join public.shop_variants v on v.id=i.variant_id join public.shop_products p on p.id=v.product_id
 join public.shop_inventory_balances b on b.variant_id=v.id where i.cart_id=p_cart loop
  if r.status<>'active' or not r.is_active or not r.facts_verified or not r.media_approved or r.weight_grams is null or r.on_hand-r.reserved<r.quantity then raise exception 'stock or product changed'; end if;
  total:=total+r.price*r.quantity;
 end loop;
 if total<=0 then raise exception 'empty cart'; end if;
 num:='MLG-'||to_char(now() at time zone 'Asia/Jakarta','YYYYMMDD')||'-'||upper(substr(replace(oid::text,'-',''),1,12));
 insert into public.shop_orders(id,order_number,cart_id,account_id,guest_token_hash,customer,address_snapshot,shipping_quote_snapshot,subtotal_amount,shipping_amount,grand_total_amount)
 values(oid,num,p_cart,p_account,p_order_hash,p_customer,p_address,to_jsonb(q),total,q.price_amount,total+q.price_amount);
 insert into public.shop_order_items(order_id,variant_id,product_code_snapshot,title_snapshot,sku_snapshot,option_snapshot,unit_price_amount,quantity,weight_grams_snapshot,line_total_amount)
 select oid,v.id,p.product_code,p.title,v.sku,v.option_values,coalesce(v.price_override_amount,p.base_price_amount),i.quantity,v.weight_grams,coalesce(v.price_override_amount,p.base_price_amount)*i.quantity
 from public.shop_cart_items i join public.shop_variants v on v.id=i.variant_id join public.shop_products p on p.id=v.product_id where i.cart_id=p_cart;
 insert into public.shop_inventory_reservations(order_id,variant_id,quantity) select oid,variant_id,quantity from public.shop_cart_items where cart_id=p_cart;
 update public.shop_inventory_balances b set reserved=b.reserved+i.quantity from public.shop_cart_items i where i.cart_id=p_cart and b.variant_id=i.variant_id;
 update public.shop_carts set status='converted' where id=p_cart;
 return num;
end $$;

-- Provider callers must have verified signature, GET-status, order id and amount.
create function public.shop_apply_payment(p_number text,p_amount int,p_status text,p_event text,p_transaction text) returns void
language plpgsql security invoker set search_path=pg_catalog,public as $$
declare o public.shop_orders; r record; safe boolean;
begin
 if p_status is null or p_status not in ('pending','paid','failed','expired','cancelled','refunded','review') then raise exception 'invalid status'; end if;
 select * into o from public.shop_orders where order_number=p_number for update;
 if not found or p_amount is null or o.grand_total_amount<>p_amount then raise exception 'payment mismatch'; end if;
 if exists(select 1 from public.shop_payment_attempts where order_id=o.id and provider_transaction_id is not null and provider_transaction_id is distinct from p_transaction) then raise exception 'transaction mismatch'; end if;
 insert into public.shop_provider_events(provider,event_key,order_id,event_type) values('midtrans',p_event,o.id,p_status) on conflict do nothing;
 if not found then return; end if;
 update public.shop_payment_attempts set provider_transaction_id=coalesce(provider_transaction_id,p_transaction) where order_id=o.id;
 if p_status='review' then
  update public.shop_orders set order_status='attention_required',fulfillment_status='attention_required' where id=o.id;return;
 end if;
 -- Never regress settled/refunded state on stale notifications.
 if o.payment_status='refunded' or (o.payment_status='paid' and p_status<>'refunded') then return; end if;
 if p_status='pending' then return; end if;
 if p_status='refunded' then
  perform b.variant_id from public.shop_inventory_balances b join public.shop_inventory_reservations ir on ir.variant_id=b.variant_id where ir.order_id=o.id order by b.variant_id for update of b;
  update public.shop_inventory_balances b set reserved=b.reserved+0-ir.quantity from public.shop_inventory_reservations ir where ir.order_id=o.id and ir.status='active' and b.variant_id=ir.variant_id;
  update public.shop_inventory_reservations set status='released' where order_id=o.id and status='active';
  update public.shop_orders set payment_status='refunded',paid_at=coalesce(paid_at,now()),order_status='refunded',fulfillment_status='attention_required' where id=o.id; return;
 end if;
 perform b.variant_id from public.shop_inventory_balances b join public.shop_inventory_reservations ir on ir.variant_id=b.variant_id where ir.order_id=o.id order by b.variant_id for update of b;
 select count(*)>0 and bool_and(status='active') into safe from public.shop_inventory_reservations where order_id=o.id;
 if p_status='paid' and not coalesce(safe,false) then
  update public.shop_orders set payment_status='paid',paid_at=coalesce(paid_at,now()),order_status='attention_required',fulfillment_status='attention_required' where id=o.id;
  insert into public.audit_logs(action,entity,entity_id,payload) values('shop.payment.late','shop_order',o.id::text,'{"requires":"manual_refund_or_stock_review"}'); return;
 end if;
 for r in select * from public.shop_inventory_reservations where order_id=o.id and status='active' order by variant_id loop
  update public.shop_inventory_balances set reserved=reserved-r.quantity,on_hand=on_hand-case when p_status='paid' then r.quantity else 0 end where variant_id=r.variant_id;
  update public.shop_inventory_reservations set status=case when p_status='paid' then 'consumed' else 'released' end where order_id=o.id and variant_id=r.variant_id;
  if p_status='paid' then insert into public.shop_inventory_ledger(variant_id,quantity_delta,movement_type,idempotency_key,reason)
   values(r.variant_id,-r.quantity,'sale','sale:'||o.id||':'||r.variant_id,'Verified Midtrans payment'); end if;
 end loop;
 update public.shop_orders set payment_status=p_status,order_status=case when p_status='paid' then 'processing' when p_status='expired' then 'expired' else 'cancelled' end,
 paid_at=case when p_status='paid' then now() else paid_at end where id=o.id;
end $$;

create function public.shop_inventory_adjust(p_variant uuid,p_delta int,p_reason text,p_key text,p_actor uuid) returns void
language plpgsql security invoker set search_path=pg_catalog,public as $$
declare old public.shop_inventory_ledger;
begin
 if not exists(select 1 from public.profiles where id=p_actor and role='owner') then raise exception 'owner required'; end if;
 if p_delta is null or p_reason is null or p_key is null or p_delta=0 or length(trim(p_reason))<3 or length(p_reason)>500 or length(p_key) not between 8 and 160 then raise exception 'invalid adjustment'; end if;
 perform pg_advisory_xact_lock(hashtextextended('shop-adjust:'||p_key,0));
 select * into old from public.shop_inventory_ledger where idempotency_key=p_key;
 if found then
  if old.variant_id<>p_variant or old.quantity_delta<>p_delta or old.reason<>p_reason or old.actor_id is distinct from p_actor then raise exception 'idempotency conflict'; end if; return;
 end if;
 update public.shop_inventory_balances set on_hand=on_hand+p_delta where variant_id=p_variant and on_hand+p_delta>=reserved;
 if not found then raise exception 'stock adjustment unavailable'; end if;
 insert into public.shop_inventory_ledger(variant_id,quantity_delta,movement_type,idempotency_key,reason,actor_id) values(p_variant,p_delta,'manual_adjustment',p_key,p_reason,p_actor);
 insert into public.audit_logs(actor_id,action,entity,entity_id,payload) values(p_actor,'shop.inventory.adjust','shop_variant',p_variant::text,jsonb_build_object('delta',p_delta,'reason',p_reason));
end $$;


create index on public.shop_inventory_ledger(variant_id,created_at);
create index on public.shop_shipping_quotes(cart_id);
create index on public.shop_inventory_reservations(variant_id);
create index on public.shop_provider_events(order_id);
create index on public.shop_orders(expires_at) where payment_status='pending';

create function public.shop_claim_payment(p_order uuid) returns boolean language plpgsql security invoker set search_path=pg_catalog,public as $$
declare o public.shop_orders; begin
 select * into o from public.shop_orders where id=p_order for update;
 if not found or o.payment_status<>'pending' or o.expires_at<=now() then return false; end if;
 insert into public.shop_payment_attempts(order_id,provider_order_id,lease_until) values(o.id,o.order_number,now()+interval '60 seconds')
 on conflict(order_id) do update set lease_until=excluded.lease_until
 where shop_payment_attempts.snap_token is null and shop_payment_attempts.lease_until<now();
 return found;
end $$;

create function public.shop_pack(p_order uuid,p_actor uuid) returns void language plpgsql security invoker set search_path=pg_catalog,public as $$
begin
 if not exists(select 1 from public.profiles where id=p_actor and role='owner') then raise exception 'owner required'; end if;
 perform 1 from public.shop_orders where id=p_order and payment_status='paid' and order_status='processing' and fulfillment_status in ('unfulfilled','ready_to_ship') for update;
 if not found then raise exception 'order cannot be packed'; end if;
 update public.shop_orders set fulfillment_status='ready_to_ship' where id=p_order;
 insert into public.audit_logs(actor_id,action,entity,entity_id) values(p_actor,'shop.order.packed','shop_order',p_order::text);
end $$;

create function public.shop_claim_shipment(p_order uuid,p_actor uuid) returns boolean language plpgsql security invoker set search_path=pg_catalog,public as $$
begin
 if not exists(select 1 from public.profiles where id=p_actor and role='owner') then raise exception 'owner required'; end if;
 perform 1 from public.shop_orders where id=p_order and payment_status='paid' and order_status='processing' and fulfillment_status='ready_to_ship' for update;
 if not found then raise exception 'order not ready'; end if;
 insert into public.shop_shipments(order_id,lease_until) values(p_order,now()+interval '60 seconds')
 on conflict(order_id) do update set lease_until=excluded.lease_until where shop_shipments.provider_order_id is null and shop_shipments.lease_until<now();
 return found;
end $$;

create function public.shop_apply_shipment(p_order uuid,p_provider text,p_status text,p_waybill text,p_tracking text) returns void
language plpgsql security invoker set search_path=pg_catalog,public as $$
declare o public.shop_orders; f text; begin
 select * into o from public.shop_orders where id=p_order for update;
 if not found then raise exception 'order missing'; end if;
 if exists(select 1 from public.shop_shipments where order_id=p_order and provider_order_id is not null and provider_order_id<>p_provider) then raise exception 'shipment mismatch'; end if;
 insert into public.shop_provider_events(provider,event_key,order_id,event_type) values('biteship',p_provider||':'||p_status,o.id,p_status) on conflict do nothing;
 update public.shop_shipments set provider_order_id=p_provider,status=p_status,waybill_id=p_waybill,tracking_url=p_tracking,updated_at=now() where order_id=p_order;
 if not found then raise exception 'shipment not claimed'; end if;
 f:=case when p_status='delivered' then 'delivered' when p_status in ('dropping_off','picked','picking_up') then 'in_transit'
 when p_status in ('cancelled','rejected','returned') then 'exception' else 'shipment_created' end;
 -- Refund/late-payment holds and delivered state never regress with shipping callbacks.
 if o.payment_status<>'paid' or o.order_status='attention_required' or o.fulfillment_status='delivered' then return; end if;
 if o.fulfillment_status='in_transit' and f='shipment_created' then return; end if;
 update public.shop_orders set fulfillment_status=f,order_status=case when f='delivered' then 'completed' else order_status end where id=p_order;
end $$;

create function public.shop_report(p_from timestamptz,p_to timestamptz) returns jsonb language sql stable security invoker set search_path=pg_catalog,public as $$
 select jsonb_build_object('paidOrders',count(*) filter(where payment_status='paid'),
 'merchandise',coalesce(sum(subtotal_amount) filter(where payment_status='paid'),0),
 'shipping',coalesce(sum(shipping_amount) filter(where payment_status='paid'),0),
 'collected',coalesce(sum(grand_total_amount) filter(where payment_status='paid'),0),
 'refundedOrders',count(*) filter(where payment_status='refunded'),
 'refundedGross',coalesce(sum(grand_total_amount) filter(where payment_status='refunded'),0),
 'attention',count(*) filter(where order_status='attention_required'))
 from public.shop_orders where paid_at>=p_from and paid_at<p_to;
$$;

-- Explicitly revoke PostgreSQL's default PUBLIC execute on every Shop RPC.
do $$ declare f record; begin
 for f in select oid::regprocedure as signature from pg_proc where pronamespace='public'::regnamespace and proname like 'shop_%' loop
  execute format('revoke all on function %s from public,anon,authenticated',f.signature);
  execute format('grant execute on function %s to service_role',f.signature);
 end loop;
end $$;

insert into public.shop_categories values ('wear','Wear',1),('daily','Daily',2),('learn-create','Learn & Create',3);
do $$ declare p uuid; v uuid; item jsonb; media jsonb; n int; begin
for item in select value from jsonb_array_elements($seed$[{"code": "001", "title": "Kaos Anak Mainlagi — Sahabat Ceria Putih", "slug": "kaos-anak-mainlagi-sahabat-ceria-putih", "category": "wear", "price": 69000, "initialStock": 9, "description": "Kaos putih anak dengan ilustrasi sahabat Mainlagi di bagian depan.", "status": "draft", "media": [{"path": "/shop/products/mainlagi-shop-001-white-tee-product-v1.webp", "alt": "Kaos Anak Mainlagi — Sahabat Ceria Putih — tampilan produk", "role": "hero"}, {"path": "/shop/products/mainlagi-shop-001-white-tee-worn-v1.webp", "alt": "Kaos Anak Mainlagi — Sahabat Ceria Putih — digunakan anak", "role": "in_use"}, {"path": "/shop/products/mainlagi-shop-001-white-tee-worn-alt-v1.webp", "alt": "Kaos Anak Mainlagi — Sahabat Ceria Putih — tampilan alternatif", "role": "in_use_alt"}]}, {"code": "002", "title": "Kaos Oversized Mainlagi — Back Graphic Hitam", "slug": "kaos-oversized-mainlagi-back-graphic-hitam", "category": "wear", "price": 74000, "initialStock": 7, "description": "Kaos oversized hitam dengan logo Mainlagi kecil di dada dan ilustrasi karakter di punggung.", "status": "draft", "media": [{"path": "/shop/products/mainlagi-shop-002-black-oversized-tee-product-v1.webp", "alt": "Kaos Oversized Mainlagi — Back Graphic Hitam — tampilan produk", "role": "hero"}, {"path": "/shop/products/mainlagi-shop-002-black-oversized-tee-worn-back-v1.webp", "alt": "Kaos Oversized Mainlagi — Back Graphic Hitam — digunakan anak", "role": "in_use"}, {"path": "/shop/products/mainlagi-shop-002-black-oversized-tee-worn-alt-v1.webp", "alt": "Kaos Oversized Mainlagi — Back Graphic Hitam — tampilan alternatif", "role": "in_use_alt"}]}, {"code": "003", "title": "Piyama Anak Gavi — Cozy Set Putih", "slug": "piyama-anak-gavi-cozy-set-putih", "category": "wear", "price": 120000, "initialStock": 6, "description": "Set piyama putih anak dengan repeated pattern Gavi, kucing oranye Mainlagi.", "status": "draft", "media": [{"path": "/shop/products/mainlagi-shop-003-gavi-pajama-product-v1.webp", "alt": "Piyama Anak Gavi — Cozy Set Putih — tampilan produk", "role": "hero"}, {"path": "/shop/products/mainlagi-shop-003-gavi-pajama-worn-v1.webp", "alt": "Piyama Anak Gavi — Cozy Set Putih — digunakan anak", "role": "in_use"}, {"path": "/shop/products/mainlagi-shop-003-gavi-pajama-worn-alt-v1.webp", "alt": "Piyama Anak Gavi — Cozy Set Putih — tampilan alternatif", "role": "in_use_alt"}]}, {"code": "004", "title": "Kaos Kaki Karakter Mainlagi", "slug": "kaos-kaki-karakter-mainlagi", "category": "wear", "price": 45000, "initialStock": 12, "description": "Sepasang kaos kaki anak dengan karakter Mainlagi.", "status": "draft", "media": [{"path": "/shop/products/mainlagi-shop-004-character-socks-product-v1.webp", "alt": "Kaos Kaki Karakter Mainlagi — tampilan produk", "role": "hero"}, {"path": "/shop/products/mainlagi-shop-004-character-socks-worn-v1.webp", "alt": "Kaos Kaki Karakter Mainlagi — digunakan anak", "role": "in_use"}, {"path": "/shop/products/mainlagi-shop-004-character-socks-worn-alt-v1.webp", "alt": "Kaos Kaki Karakter Mainlagi — tampilan alternatif", "role": "in_use_alt"}]}, {"code": "005", "title": "Hoodie Anak Mainlagi — Navy Back Graphic", "slug": "hoodie-anak-mainlagi-navy-back-graphic", "category": "wear", "price": 150000, "initialStock": 8, "description": "Hoodie navy anak dengan artwork Mainlagi di bagian belakang.", "status": "draft", "media": [{"path": "/shop/products/mainlagi-shop-005-navy-hoodie-product-v1.webp", "alt": "Hoodie Anak Mainlagi — Navy Back Graphic — tampilan produk", "role": "hero"}, {"path": "/shop/products/mainlagi-shop-005-navy-hoodie-worn-back-v1.webp", "alt": "Hoodie Anak Mainlagi — Navy Back Graphic — digunakan anak", "role": "in_use"}, {"path": "/shop/products/mainlagi-shop-005-navy-hoodie-worn-alt-v1.webp", "alt": "Hoodie Anak Mainlagi — Navy Back Graphic — tampilan alternatif", "role": "in_use_alt"}]}, {"code": "006", "title": "Tumbler Anak Mainlagi — Daily Buddy", "slug": "tumbler-anak-mainlagi-daily-buddy", "category": "daily", "price": 89000, "initialStock": 10, "description": "Tumbler anak dengan artwork karakter Mainlagi untuk aktivitas sehari-hari.", "status": "draft", "media": [{"path": "/shop/products/mainlagi-shop-006-kids-tumbler-product-v1.webp", "alt": "Tumbler Anak Mainlagi — Daily Buddy — tampilan produk", "role": "hero"}, {"path": "/shop/products/mainlagi-shop-006-kids-tumbler-in-use-v1.webp", "alt": "Tumbler Anak Mainlagi — Daily Buddy — digunakan anak", "role": "in_use"}]}, {"code": "007", "title": "Kartu E-Money Mainlagi — Character Edition", "slug": "kartu-emoney-mainlagi-character-edition", "category": "daily", "price": 89000, "initialStock": 7, "description": "Konsep kartu bergambar karakter Mainlagi. Fungsi kartu masih menunggu verifikasi.", "status": "draft", "media": [{"path": "/shop/products/mainlagi-shop-007-emoney-card-product-v1.webp", "alt": "Kartu E-Money Mainlagi — Character Edition — tampilan produk", "role": "hero"}, {"path": "/shop/products/mainlagi-shop-007-emoney-card-in-hand-v1.webp", "alt": "Kartu E-Money Mainlagi — Character Edition — digunakan anak", "role": "in_use"}, {"path": "/shop/products/mainlagi-shop-007-emoney-card-tap-v1.webp", "alt": "Kartu E-Money Mainlagi — Character Edition — tampilan alternatif", "role": "in_use_alt"}]}, {"code": "008", "title": "Buku Tulis Mainlagi — Writing Notebook", "slug": "buku-tulis-mainlagi-writing-notebook", "category": "learn-create", "price": 25000, "initialStock": 11, "description": "Buku tulis Mainlagi dengan cover karakter dan halaman bergaris untuk aktivitas menulis.", "status": "draft", "media": [{"path": "/shop/products/mainlagi-shop-008-writing-notebook-product-v1.webp", "alt": "Buku Tulis Mainlagi — Writing Notebook — tampilan produk", "role": "hero"}, {"path": "/shop/products/mainlagi-shop-008-writing-notebook-in-use-v1.webp", "alt": "Buku Tulis Mainlagi — Writing Notebook — digunakan anak", "role": "in_use"}, {"path": "/shop/products/mainlagi-shop-008-writing-notebook-in-use-alt-v1.webp", "alt": "Buku Tulis Mainlagi — Writing Notebook — tampilan alternatif", "role": "in_use_alt"}]}, {"code": "009", "title": "Buku Gambar Mainlagi — Drawing Book", "slug": "buku-gambar-mainlagi-drawing-book", "category": "learn-create", "price": 35000, "initialStock": 9, "description": "Buku gambar Mainlagi untuk menggambar dan bereksplorasi secara kreatif.", "status": "draft", "media": [{"path": "/shop/products/mainlagi-shop-009-drawing-book-product-v1.webp", "alt": "Buku Gambar Mainlagi — Drawing Book — tampilan produk", "role": "hero"}, {"path": "/shop/products/mainlagi-shop-009-drawing-book-in-use-v1.webp", "alt": "Buku Gambar Mainlagi — Drawing Book — digunakan anak", "role": "in_use"}, {"path": "/shop/products/mainlagi-shop-009-drawing-book-in-use-alt-v1.webp", "alt": "Buku Gambar Mainlagi — Drawing Book — tampilan alternatif", "role": "in_use_alt"}]}]$seed$::jsonb) loop
insert into public.shop_products(product_code,slug,title,description,category_slug,base_price_amount,media_approved)
 values(item->>'code',item->>'slug',item->>'title',item->>'description',item->>'category',(item->>'price')::int,true) returning id into p;
 insert into public.shop_variants(product_id,sku) values(p,(item->>'code')||'-DEFAULT') returning id into v;
 insert into public.shop_inventory_balances(variant_id,on_hand) values(v,(item->>'initialStock')::int);
 insert into public.shop_inventory_ledger(variant_id,quantity_delta,movement_type,idempotency_key,reason)
 values(v,(item->>'initialStock')::int,'initial_seed','seed:'||(item->>'code'),'Owner-approved Mainlagi Shop initial stock seed');
 n:=0; for media in select value from jsonb_array_elements(item->'media') loop
 insert into public.shop_product_media(product_id,path,alt_text,role,sort_order,approval_status) values(p,media->>'path',media->>'alt',media->>'role',n,'approved'); n:=n+1;
 end loop;
end loop; end $$;
