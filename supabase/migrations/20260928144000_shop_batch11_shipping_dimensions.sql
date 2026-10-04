-- Batch 11 shipping-dimension propagation.
-- Biteship supports item length/width/height in centimeters for rates and order creation.
-- Persist millimeter snapshots so checkout and fulfillment keep the same immutable dimensions.

alter table public.shop_order_items
  add column length_mm_snapshot int check(length_mm_snapshot>0),
  add column width_mm_snapshot int check(width_mm_snapshot>0),
  add column height_mm_snapshot int check(height_mm_snapshot>0);

create or replace function public.shop_product_readiness(p_product uuid) returns jsonb
language plpgsql stable security invoker set search_path=pg_catalog,public as $shop$
declare p public.shop_products; blockers text[]:=array[]::text[]; media_count int:=0; hero_count int:=0;
 variant_count int:=0; missing_weight int:=0; missing_inventory int:=0; missing_dimensions int:=0; missing_size int:=0; product_type text;
begin
 select * into p from public.shop_products where id=p_product;
 if not found then raise exception 'product missing'; end if;
 if coalesce(p.facts->>'verificationStatus','')<>'production_verified' then blockers:=array_append(blockers,'Production facts require physical or supplier verification.'); end if;
 select count(*)::int,count(*) filter(where role='hero')::int into media_count,hero_count
 from public.shop_product_media where product_id=p_product and approval_status='approved';
 if media_count<2 then blockers:=array_append(blockers,'At least two approved product images are required.'); end if;
 if hero_count<1 then blockers:=array_append(blockers,'An approved hero image is required.'); end if;
 select count(*) filter(where is_active)::int,
 count(*) filter(where is_active and weight_grams is null)::int,
 count(*) filter(where is_active and not exists(select 1 from public.shop_inventory_balances b where b.variant_id=shop_variants.id))::int,
 count(*) filter(where is_active and (length_mm is null or width_mm is null or height_mm is null))::int,
 count(*) filter(where is_active and coalesce(trim(option_values->>'size'),'')='')::int
 into variant_count,missing_weight,missing_inventory,missing_dimensions,missing_size from public.shop_variants where product_id=p_product;
 if variant_count<1 then blockers:=array_append(blockers,'At least one active sellable variant is required.'); end if;
 if missing_weight>0 then blockers:=array_append(blockers,'Every active variant needs measured shipping weight.'); end if;
 if missing_dimensions>0 then blockers:=array_append(blockers,'Every active variant needs packed shipping dimensions.'); end if;
 if missing_inventory>0 then blockers:=array_append(blockers,'Every active variant needs an inventory balance.'); end if;
 if p.product_code in ('001','002','003','004','005') then
  if missing_size>0 then blockers:=array_append(blockers,'Every active apparel variant needs a verified size.'); end if;
  if length(trim(coalesce(p.facts->>'sizeChart','')))<3 then blockers:=array_append(blockers,'A verified size chart or measurement note is required.'); end if;
 elsif p.product_code='006' then
  if length(trim(coalesce(p.facts->>'capacity','')))<1 then blockers:=array_append(blockers,'Verified tumbler capacity is required.'); end if;
  if length(trim(coalesce(p.facts->>'material','')))<2 then blockers:=array_append(blockers,'Verified tumbler material is required.'); end if;
 elsif p.product_code='007' then
  product_type:=trim(coalesce(p.facts->>'productType',''));
  if product_type='' then blockers:=array_append(blockers,'Actual card product type is required.');
  elsif product_type='e_money' then
   if length(trim(coalesce(p.facts->>'issuer','')))<2 then blockers:=array_append(blockers,'E-money issuer is required.'); end if;
   if length(trim(coalesce(p.facts->>'network','')))<2 then blockers:=array_append(blockers,'E-money network or technology is required.'); end if;
   if length(trim(coalesce(p.facts->>'activation','')))<2 then blockers:=array_append(blockers,'Activation/provisioning behavior is required.'); end if;
   if length(trim(coalesce(p.facts->>'topUp','')))<2 then blockers:=array_append(blockers,'Top-up/balance behavior is required.'); end if;
   if length(trim(coalesce(p.facts->>'authorization','')))<2 then blockers:=array_append(blockers,'Authorization/co-brand basis is required.'); end if;
   if coalesce(p.facts->>'tapVerified','false')<>'true' then blockers:=array_append(blockers,'Tap/use capability must be verified before it is claimed.'); end if;
  elsif lower(p.title||' '||p.description) like '%e-money%' then blockers:=array_append(blockers,'Remove e-money claims from title/description when the actual product is not e-money.');
  end if;
 end if;
 return jsonb_build_object('ready',cardinality(blockers)=0,'blockers',to_jsonb(blockers),'approvedMedia',media_count,
  'activeVariants',variant_count,'mediaApproved',(media_count>=2 and hero_count>=1));
end
$shop$;


revoke all on function public.shop_product_readiness(uuid) from public,anon,authenticated;
grant execute on function public.shop_product_readiness(uuid) to service_role;

create or replace function public.shop_cart_signature(p_cart uuid) returns text language sql stable security invoker set search_path=pg_catalog,public as $$
 select md5(coalesce(string_agg(v.id::text||':'||i.quantity||':'||coalesce(v.price_override_amount,p.base_price_amount)||':'||coalesce(v.weight_grams,0)||':'||coalesce(v.length_mm,0)||':'||coalesce(v.width_mm,0)||':'||coalesce(v.height_mm,0), '|' order by v.id),''))
 from public.shop_cart_items i join public.shop_variants v on v.id=i.variant_id join public.shop_products p on p.id=v.product_id where i.cart_id=p_cart;
$$;


revoke all on function public.shop_cart_signature(uuid) from public,anon,authenticated;
grant execute on function public.shop_cart_signature(uuid) to service_role;

create or replace function public.shop_checkout(p_cart uuid,p_hash text,p_quote uuid,p_customer jsonb,p_address jsonb,p_account uuid,p_order_hash text) returns text
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
  if r.status<>'active' or not r.is_active or not r.facts_verified or not r.media_approved or r.weight_grams is null or r.length_mm is null or r.width_mm is null or r.height_mm is null or r.on_hand-r.reserved<r.quantity then raise exception 'stock or product changed'; end if;
  total:=total+r.price*r.quantity;
 end loop;
 if total<=0 then raise exception 'empty cart'; end if;
 num:='MLG-'||to_char(now() at time zone 'Asia/Jakarta','YYYYMMDD')||'-'||upper(substr(replace(oid::text,'-',''),1,12));
 insert into public.shop_orders(id,order_number,cart_id,account_id,guest_token_hash,customer,address_snapshot,shipping_quote_snapshot,subtotal_amount,shipping_amount,grand_total_amount)
 values(oid,num,p_cart,p_account,p_order_hash,p_customer,p_address,to_jsonb(q),total,q.price_amount,total+q.price_amount);
 insert into public.shop_order_items(order_id,variant_id,product_code_snapshot,title_snapshot,sku_snapshot,option_snapshot,unit_price_amount,quantity,weight_grams_snapshot,length_mm_snapshot,width_mm_snapshot,height_mm_snapshot,line_total_amount)
 select oid,v.id,p.product_code,p.title,v.sku,v.option_values,coalesce(v.price_override_amount,p.base_price_amount),i.quantity,v.weight_grams,v.length_mm,v.width_mm,v.height_mm,coalesce(v.price_override_amount,p.base_price_amount)*i.quantity
 from public.shop_cart_items i join public.shop_variants v on v.id=i.variant_id join public.shop_products p on p.id=v.product_id where i.cart_id=p_cart;
 insert into public.shop_inventory_reservations(order_id,variant_id,quantity) select oid,variant_id,quantity from public.shop_cart_items where cart_id=p_cart;
 update public.shop_inventory_balances b set reserved=b.reserved+i.quantity from public.shop_cart_items i where i.cart_id=p_cart and b.variant_id=i.variant_id;
 update public.shop_carts set status='converted' where id=p_cart;
 return num;
end $$;


revoke all on function public.shop_checkout(uuid,text,uuid,jsonb,jsonb,uuid,text) from public,anon,authenticated;
grant execute on function public.shop_checkout(uuid,text,uuid,jsonb,jsonb,uuid,text) to service_role;
