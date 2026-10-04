-- Batch 03 additive Shop admin workflow. Foundation migration remains unchanged.
alter table public.shop_products
 add column review_status text not null default 'draft' check(review_status in ('draft','ready_for_review','approved')),
 add column facts jsonb not null default '{}' check(jsonb_typeof(facts)='object'),
 add column initial_stock_total int not null default 0 check(initial_stock_total>=0);

update public.shop_products set initial_stock_total=case product_code
 when '001' then 9 when '002' then 7 when '003' then 6 when '004' then 12 when '005' then 8
 when '006' then 10 when '007' then 7 when '008' then 11 when '009' then 9 else initial_stock_total end;

create function public.shop_product_readiness(p_product uuid) returns jsonb
language plpgsql stable security invoker set search_path=pg_catalog,public as $shop$
declare p public.shop_products; blockers text[]:=array[]::text[]; media_count int:=0; hero_count int:=0;
 variant_count int:=0; missing_weight int:=0; missing_inventory int:=0; missing_size int:=0; product_type text;
begin
 select * into p from public.shop_products where id=p_product;
 if not found then raise exception 'product missing'; end if;
 select count(*)::int,count(*) filter(where role='hero')::int into media_count,hero_count
 from public.shop_product_media where product_id=p_product and approval_status='approved';
 if media_count<2 then blockers:=array_append(blockers,'At least two approved product images are required.'); end if;
 if hero_count<1 then blockers:=array_append(blockers,'An approved hero image is required.'); end if;
 select count(*) filter(where is_active)::int,
 count(*) filter(where is_active and weight_grams is null)::int,
 count(*) filter(where is_active and not exists(select 1 from public.shop_inventory_balances b where b.variant_id=shop_variants.id))::int,
 count(*) filter(where is_active and coalesce(trim(option_values->>'size'),'')='')::int
 into variant_count,missing_weight,missing_inventory,missing_size from public.shop_variants where product_id=p_product;
 if variant_count<1 then blockers:=array_append(blockers,'At least one active sellable variant is required.'); end if;
 if missing_weight>0 then blockers:=array_append(blockers,'Every active variant needs measured shipping weight.'); end if;
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

create function public.shop_admin_product_save(p_product uuid,p_title text,p_description text,p_category text,p_base_price int,p_facts jsonb,p_actor uuid) returns void
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
declare old_product public.shop_products;
begin
 if not exists(select 1 from public.profiles where id=p_actor and role='owner') then raise exception 'owner required'; end if;
 select * into old_product from public.shop_products where id=p_product for update;
 if not found then raise exception 'product missing'; end if;
 if old_product.status='active' then raise exception 'deactivate product before editing'; end if;
 if length(trim(coalesce(p_title,''))) not between 2 and 160 or length(trim(coalesce(p_description,''))) not between 2 and 1200
 or not exists(select 1 from public.shop_categories where slug=p_category) or p_base_price is null or p_base_price<=0
 or p_facts is null or jsonb_typeof(p_facts)<>'object' then raise exception 'invalid product data'; end if;
 update public.shop_products set title=trim(p_title),description=trim(p_description),category_slug=p_category,base_price_amount=p_base_price,
 facts=p_facts,status='draft',review_status='draft',facts_verified=false,updated_at=now() where id=p_product;
 insert into public.audit_logs(actor_id,action,entity,entity_id,payload) values(p_actor,'shop.product.save','shop_product',p_product::text,
 jsonb_build_object('title',trim(p_title),'category',p_category,'basePrice',p_base_price,'facts',p_facts));
end
$shop$;

create function public.shop_admin_variants_replace(p_product uuid,p_variants jsonb,p_actor uuid) returns void
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
declare p public.shop_products; item jsonb; vid uuid; stock int; total int:=0; sku_value text; title_value text; options jsonb;
 price_value int; weight_value int; length_value int; width_value int; height_value int; active_value boolean;
begin
 if not exists(select 1 from public.profiles where id=p_actor and role='owner') then raise exception 'owner required'; end if;
 select * into p from public.shop_products where id=p_product for update;
 if not found then raise exception 'product missing'; end if;
 if p.status='active' then raise exception 'deactivate product before editing'; end if;
 if p_variants is null or jsonb_typeof(p_variants)<>'array' or jsonb_array_length(p_variants) not between 1 and 20 then raise exception 'invalid variants'; end if;
 if exists(select 1 from public.shop_variants v where v.product_id=p_product and (
  exists(select 1 from public.shop_cart_items ci where ci.variant_id=v.id) or exists(select 1 from public.shop_order_items oi where oi.variant_id=v.id)
  or exists(select 1 from public.shop_inventory_reservations ir where ir.variant_id=v.id))) then raise exception 'variant history exists; edit/deactivate individual variants instead'; end if;
 if exists(select 1 from public.shop_inventory_ledger l join public.shop_variants v on v.id=l.variant_id
  where v.product_id=p_product and l.movement_type not in ('initial_seed','variant_setup')) then raise exception 'inventory history prevents variant replacement'; end if;
 for item in select value from jsonb_array_elements(p_variants) loop
  sku_value:=upper(trim(coalesce(item->>'sku',''))); title_value:=trim(coalesce(item->>'title','')); options:=coalesce(item->'optionValues','{}'::jsonb);
  if sku_value!~'^[A-Z0-9][A-Z0-9._-]{2,59}$' or length(title_value) not between 1 and 100 or jsonb_typeof(options)<>'object' then raise exception 'invalid variant identity'; end if;
  if coalesce(item->>'onHand','')!~'^\d+$' then raise exception 'invalid variant stock'; end if;
  stock:=(item->>'onHand')::int; total:=total+stock;
  price_value:=null; if coalesce(item->>'priceOverride','')<>'' then if (item->>'priceOverride')!~'^\d+$' then raise exception 'invalid variant price'; end if; price_value:=(item->>'priceOverride')::int; if price_value<=0 then raise exception 'invalid variant price'; end if; end if;
  weight_value:=null; if coalesce(item->>'weightGrams','')<>'' then if (item->>'weightGrams')!~'^\d+$' then raise exception 'invalid variant weight'; end if; weight_value:=(item->>'weightGrams')::int; if weight_value<=0 then raise exception 'invalid variant weight'; end if; end if;
  length_value:=null; if coalesce(item->>'lengthMm','')<>'' then if (item->>'lengthMm')!~'^\d+$' then raise exception 'invalid variant dimension'; end if; length_value:=(item->>'lengthMm')::int; if length_value<=0 then raise exception 'invalid variant dimension'; end if; end if;
  width_value:=null; if coalesce(item->>'widthMm','')<>'' then if (item->>'widthMm')!~'^\d+$' then raise exception 'invalid variant dimension'; end if; width_value:=(item->>'widthMm')::int; if width_value<=0 then raise exception 'invalid variant dimension'; end if; end if;
  height_value:=null; if coalesce(item->>'heightMm','')<>'' then if (item->>'heightMm')!~'^\d+$' then raise exception 'invalid variant dimension'; end if; height_value:=(item->>'heightMm')::int; if height_value<=0 then raise exception 'invalid variant dimension'; end if; end if;
  active_value:=coalesce((item->>'isActive')::boolean,true);
 end loop;
 if total<>p.initial_stock_total then raise exception 'variant stock must equal approved initial total %',p.initial_stock_total; end if;
 delete from public.shop_inventory_ledger l using public.shop_variants v where l.variant_id=v.id and v.product_id=p_product;
 delete from public.shop_inventory_balances b using public.shop_variants v where b.variant_id=v.id and v.product_id=p_product;
 delete from public.shop_variants where product_id=p_product;
 for item in select value from jsonb_array_elements(p_variants) loop
  sku_value:=upper(trim(item->>'sku')); title_value:=trim(item->>'title'); options:=coalesce(item->'optionValues','{}'::jsonb); stock:=(item->>'onHand')::int;
  price_value:=nullif(item->>'priceOverride','')::int; weight_value:=nullif(item->>'weightGrams','')::int; length_value:=nullif(item->>'lengthMm','')::int;
  width_value:=nullif(item->>'widthMm','')::int; height_value:=nullif(item->>'heightMm','')::int; active_value:=coalesce((item->>'isActive')::boolean,true);
  insert into public.shop_variants(product_id,sku,title,option_values,price_override_amount,weight_grams,length_mm,width_mm,height_mm,is_active)
  values(p_product,sku_value,title_value,options,price_value,weight_value,length_value,width_value,height_value,active_value) returning id into vid;
  insert into public.shop_inventory_balances(variant_id,on_hand) values(vid,stock);
  if stock>0 then insert into public.shop_inventory_ledger(variant_id,quantity_delta,movement_type,idempotency_key,reason,actor_id)
   values(vid,stock,'variant_setup','variant-setup:'||p.product_code||':'||sku_value,'Owner-approved initial variant allocation',p_actor); end if;
 end loop;
 update public.shop_products set status='draft',review_status='draft',facts_verified=false,updated_at=now() where id=p_product;
 insert into public.audit_logs(actor_id,action,entity,entity_id,payload) values(p_actor,'shop.product.variants.replace','shop_product',p_product::text,
  jsonb_build_object('variants',p_variants,'approvedInitialTotal',p.initial_stock_total));
end
$shop$;

create function public.shop_admin_media_set(p_media uuid,p_status text,p_actor uuid) returns void
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
declare pid uuid; mcount int; hcount int;
begin
 if not exists(select 1 from public.profiles where id=p_actor and role='owner') then raise exception 'owner required'; end if;
 if p_status not in ('review','approved','rejected') then raise exception 'invalid media status'; end if;
 select product_id into pid from public.shop_product_media where id=p_media for update;
 if not found then raise exception 'media missing'; end if;
 if exists(select 1 from public.shop_products where id=pid and status='active') then raise exception 'deactivate product before editing'; end if;
 update public.shop_product_media set approval_status=p_status where id=p_media;
 select count(*)::int,count(*) filter(where role='hero')::int into mcount,hcount from public.shop_product_media where product_id=pid and approval_status='approved';
 update public.shop_products set media_approved=(mcount>=2 and hcount>=1),status='draft',review_status='draft',facts_verified=false,updated_at=now() where id=pid;
 insert into public.audit_logs(actor_id,action,entity,entity_id,payload) values(p_actor,'shop.product.media.review','shop_media',p_media::text,jsonb_build_object('status',p_status,'productId',pid));
end
$shop$;

create function public.shop_admin_transition(p_product uuid,p_action text,p_actor uuid) returns jsonb
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
declare p public.shop_products; r jsonb; ready boolean; blockers jsonb;
begin
 if not exists(select 1 from public.profiles where id=p_actor and role='owner') then raise exception 'owner required'; end if;
 select * into p from public.shop_products where id=p_product for update; if not found then raise exception 'product missing'; end if;
 r:=public.shop_product_readiness(p_product); ready:=coalesce((r->>'ready')::boolean,false); blockers:=r->'blockers';
 if p_action='ready' then
  if not ready then raise exception 'product incomplete: %',blockers::text; end if;
  update public.shop_products set status='draft',review_status='ready_for_review',facts_verified=false,media_approved=coalesce((r->>'mediaApproved')::boolean,false),updated_at=now() where id=p_product;
 elsif p_action='approve' then
  if p.review_status<>'ready_for_review' then raise exception 'product is not ready for approval'; end if;
  if not ready then raise exception 'product incomplete: %',blockers::text; end if;
  update public.shop_products set status='draft',review_status='approved',facts_verified=true,media_approved=coalesce((r->>'mediaApproved')::boolean,false),updated_at=now() where id=p_product;
 elsif p_action='activate' then
  if p.review_status<>'approved' or not p.facts_verified then raise exception 'product is not approved'; end if;
  if not ready then raise exception 'product incomplete: %',blockers::text; end if;
  update public.shop_products set status='active',media_approved=true,updated_at=now() where id=p_product;
 elsif p_action='deactivate' then update public.shop_products set status='draft',updated_at=now() where id=p_product;
 elsif p_action='draft' then update public.shop_products set status='draft',review_status='draft',facts_verified=false,updated_at=now() where id=p_product;
 else raise exception 'invalid product transition'; end if;
 insert into public.audit_logs(actor_id,action,entity,entity_id,payload) values(p_actor,'shop.product.transition','shop_product',p_product::text,jsonb_build_object('transition',p_action,'readiness',r));
 return public.shop_product_readiness(p_product);
end
$shop$;

create function public.shop_guard_product_activation() returns trigger
language plpgsql set search_path=pg_catalog,public as $shop$
declare r jsonb;
begin
 if tg_op='INSERT' and new.status='active' then raise exception 'product activation requires review workflow'; end if;
 if tg_op='UPDATE' and old.status='active' and new.status='active' and (new.title is distinct from old.title or new.description is distinct from old.description
  or new.category_slug is distinct from old.category_slug or new.base_price_amount is distinct from old.base_price_amount or new.facts is distinct from old.facts
  or new.review_status is distinct from old.review_status or new.facts_verified is distinct from old.facts_verified or new.media_approved is distinct from old.media_approved)
 then raise exception 'deactivate product before editing'; end if;
 if tg_op='UPDATE' and new.status='active' and old.status is distinct from 'active' then
  r:=public.shop_product_readiness(new.id);
  if new.review_status<>'approved' or not new.facts_verified or not new.media_approved or not coalesce((r->>'ready')::boolean,false)
  then raise exception 'product activation blocked: %',coalesce(r->'blockers','[]'::jsonb)::text; end if;
 end if;
 return new;
end
$shop$;
create trigger shop_product_activation_guard before insert or update on public.shop_products for each row execute function public.shop_guard_product_activation();

create function public.shop_guard_active_product_child() returns trigger
language plpgsql set search_path=pg_catalog,public as $shop$
begin
 if tg_op='DELETE' then
  if exists(select 1 from public.shop_products where id=old.product_id and status='active') then raise exception 'deactivate product before editing'; end if;
  return old;
 end if;
 if exists(select 1 from public.shop_products where id=new.product_id and status='active')
    or (tg_op='UPDATE' and exists(select 1 from public.shop_products where id=old.product_id and status='active'))
 then raise exception 'deactivate product before editing'; end if;
 return new;
end
$shop$;
create trigger shop_variant_active_guard before insert or update or delete on public.shop_variants for each row execute function public.shop_guard_active_product_child();
create trigger shop_media_active_guard before insert or update or delete on public.shop_product_media for each row execute function public.shop_guard_active_product_child();

do $shop$
declare f record;
begin
 for f in select oid::regprocedure as signature from pg_proc
  where pronamespace='public'::regnamespace and proname in ('shop_product_readiness','shop_admin_product_save','shop_admin_variants_replace','shop_admin_media_set','shop_admin_transition','shop_guard_product_activation','shop_guard_active_product_child')
 loop
  execute format('revoke all on function %s from public,anon,authenticated',f.signature);
  execute format('grant execute on function %s to service_role',f.signature);
 end loop;
end
$shop$;
