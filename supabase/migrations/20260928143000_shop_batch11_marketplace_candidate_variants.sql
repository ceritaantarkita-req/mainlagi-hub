-- Batch 11 marketplace-backed product candidate variants.
-- Owner requested concrete variant/stock/size targets from comparable marketplace products.
-- These values are deliberately NOT production-verified facts.
-- Public activation remains fail-closed until physical sample or supplier-sheet verification.

create or replace function public.shop_product_readiness(p_product uuid) returns jsonb
language plpgsql stable security invoker set search_path=pg_catalog,public as $shop$
declare p public.shop_products; blockers text[]:=array[]::text[]; media_count int:=0; hero_count int:=0;
 variant_count int:=0; missing_weight int:=0; missing_inventory int:=0; missing_size int:=0; product_type text;
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

revoke all on function public.shop_product_readiness(uuid) from public,anon,authenticated;
grant execute on function public.shop_product_readiness(uuid) to service_role;

do $shop$
declare
  p public.shop_products;
  item jsonb;
  variant jsonb;
  vid uuid;
  stock int;
  total int;
begin
  for item in
    select value
    from jsonb_array_elements($candidate$[{"code":"001","facts":{"candidateSource":"marketplace_benchmark_2026-09-28","confidence":"medium-high","targetFacts":{"color":"Putih","material":"Cotton Combed 24s","fit":"Regular kids unisex","print":"Mainlagi front graphic"},"notes":null,"sourceIds":["S1"]},"variants":[{"sku":"001-2Y","title":"2 Tahun","optionValues":{"size":"2 Tahun","ageYears":"1-2","bodyWidthCm":"30","bodyLengthCm":"40"},"onHand":1,"weightGrams":150,"lengthMm":250,"widthMm":200,"heightMm":30,"isActive":true},{"sku":"001-4Y","title":"4 Tahun","optionValues":{"size":"4 Tahun","ageYears":"3-4","bodyWidthCm":"33","bodyLengthCm":"43"},"onHand":2,"weightGrams":160,"lengthMm":250,"widthMm":200,"heightMm":30,"isActive":true},{"sku":"001-6Y","title":"6 Tahun","optionValues":{"size":"6 Tahun","ageYears":"5-6","bodyWidthCm":"36","bodyLengthCm":"46"},"onHand":2,"weightGrams":170,"lengthMm":250,"widthMm":200,"heightMm":30,"isActive":true},{"sku":"001-8Y","title":"8 Tahun","optionValues":{"size":"8 Tahun","ageYears":"7-8","bodyWidthCm":"40","bodyLengthCm":"50"},"onHand":2,"weightGrams":180,"lengthMm":250,"widthMm":200,"heightMm":30,"isActive":true},{"sku":"001-10Y","title":"10 Tahun","optionValues":{"size":"10 Tahun","ageYears":"9-10","bodyWidthCm":"44","bodyLengthCm":"54"},"onHand":2,"weightGrams":190,"lengthMm":250,"widthMm":200,"heightMm":30,"isActive":true}]},{"code":"002","facts":{"candidateSource":"marketplace_benchmark_2026-09-28","confidence":"medium","targetFacts":{"color":"Hitam","material":"Cotton Combed 24s","fit":"Kids boxy / oversized","print":"Small front logo + Mainlagi back graphic"},"notes":"Marketplace source supplies age variants and boxy/cotton-24s construction but not exact garment measurements. Candidate measurements intentionally add ease versus regular kids tee and require sample confirmation.","sourceIds":["S1","S2"]},"variants":[{"sku":"002-S","title":"S","optionValues":{"size":"S","ageYears":"1-2","bodyWidthCm":"34","bodyLengthCm":"42"},"onHand":1,"weightGrams":170,"lengthMm":280,"widthMm":240,"heightMm":30,"isActive":true},{"sku":"002-M","title":"M","optionValues":{"size":"M","ageYears":"3-4","bodyWidthCm":"37","bodyLengthCm":"46"},"onHand":1,"weightGrams":180,"lengthMm":280,"widthMm":240,"heightMm":30,"isActive":true},{"sku":"002-L","title":"L","optionValues":{"size":"L","ageYears":"5-6","bodyWidthCm":"40","bodyLengthCm":"50"},"onHand":2,"weightGrams":190,"lengthMm":280,"widthMm":240,"heightMm":30,"isActive":true},{"sku":"002-XL","title":"XL","optionValues":{"size":"XL","ageYears":"7-8","bodyWidthCm":"43","bodyLengthCm":"54"},"onHand":2,"weightGrams":200,"lengthMm":280,"widthMm":240,"heightMm":30,"isActive":true},{"sku":"002-XXL","title":"XXL","optionValues":{"size":"XXL","ageYears":"9-10","bodyWidthCm":"46","bodyLengthCm":"58"},"onHand":1,"weightGrams":210,"lengthMm":280,"widthMm":240,"heightMm":30,"isActive":true}]},{"code":"003","facts":{"candidateSource":"marketplace_benchmark_2026-09-28","confidence":"medium","targetFacts":{"color":"Putih","material":"Cotton-spandex jersey","set":"Atasan + celana","print":"Repeated Gavi pattern"},"notes":null,"sourceIds":["S3"]},"variants":[{"sku":"003-95","title":"95","optionValues":{"size":"95","ageYears":"2-3","topWidthCm":"30","topLengthCm":"39","pantsWidthCm":"22","pantsLengthCm":"52"},"onHand":1,"weightGrams":220,"lengthMm":300,"widthMm":250,"heightMm":40,"isActive":true},{"sku":"003-100","title":"100","optionValues":{"size":"100","ageYears":"3-4","topWidthCm":"31","topLengthCm":"40","pantsWidthCm":"23","pantsLengthCm":"55"},"onHand":1,"weightGrams":230,"lengthMm":300,"widthMm":250,"heightMm":40,"isActive":true},{"sku":"003-110","title":"110","optionValues":{"size":"110","ageYears":"4-5","topWidthCm":"32","topLengthCm":"41","pantsWidthCm":"24","pantsLengthCm":"58"},"onHand":2,"weightGrams":240,"lengthMm":300,"widthMm":250,"heightMm":40,"isActive":true},{"sku":"003-120","title":"120","optionValues":{"size":"120","ageYears":"5-6","topWidthCm":"33","topLengthCm":"42","pantsWidthCm":"25","pantsLengthCm":"61"},"onHand":1,"weightGrams":250,"lengthMm":300,"widthMm":250,"heightMm":40,"isActive":true},{"sku":"003-130","title":"130","optionValues":{"size":"130","ageYears":"6-7","topWidthCm":"34","topLengthCm":"43","pantsWidthCm":"26","pantsLengthCm":"64"},"onHand":1,"weightGrams":260,"lengthMm":300,"widthMm":250,"heightMm":40,"isActive":true}]},{"code":"004","facts":{"candidateSource":"marketplace_benchmark_2026-09-28","confidence":"low-medium","targetFacts":{"unit":"1 pasang","construction":"Character-print kids socks","material":"Cotton-blend knit"},"notes":"Age bands are marketplace-derived; foot-length ranges are planning estimates and must be checked against supplier/sample.","sourceIds":["S4"]},"variants":[{"sku":"004-1-3Y","title":"1-3 Tahun","optionValues":{"size":"1-3 Tahun","footLengthCm":"12-14"},"onHand":4,"weightGrams":50,"lengthMm":180,"widthMm":120,"heightMm":30,"isActive":true},{"sku":"004-4-6Y","title":"4-6 Tahun","optionValues":{"size":"4-6 Tahun","footLengthCm":"15-17"},"onHand":4,"weightGrams":55,"lengthMm":180,"widthMm":120,"heightMm":30,"isActive":true},{"sku":"004-7-10Y","title":"7-10 Tahun","optionValues":{"size":"7-10 Tahun","footLengthCm":"18-20"},"onHand":4,"weightGrams":60,"lengthMm":180,"widthMm":120,"heightMm":30,"isActive":true}]},{"code":"005","facts":{"candidateSource":"marketplace_benchmark_2026-09-28","confidence":"medium-high","targetFacts":{"color":"Navy","material":"Fleece","fit":"Regular kids hoodie","print":"Mainlagi back graphic"},"notes":null,"sourceIds":["S5"]},"variants":[{"sku":"005-S","title":"S","optionValues":{"size":"S","ageYears":"2-3","bodyWidthCm":"30","bodyLengthCm":"42"},"onHand":1,"weightGrams":350,"lengthMm":320,"widthMm":280,"heightMm":60,"isActive":true},{"sku":"005-M","title":"M","optionValues":{"size":"M","ageYears":"4-5","bodyWidthCm":"34","bodyLengthCm":"46"},"onHand":2,"weightGrams":380,"lengthMm":320,"widthMm":280,"heightMm":60,"isActive":true},{"sku":"005-L","title":"L","optionValues":{"size":"L","ageYears":"6-7","bodyWidthCm":"38","bodyLengthCm":"50"},"onHand":2,"weightGrams":400,"lengthMm":320,"widthMm":280,"heightMm":60,"isActive":true},{"sku":"005-XL","title":"XL","optionValues":{"size":"XL","ageYears":"8-9","bodyWidthCm":"42","bodyLengthCm":"52"},"onHand":2,"weightGrams":420,"lengthMm":320,"widthMm":280,"heightMm":60,"isActive":true},{"sku":"005-XXL","title":"XXL","optionValues":{"size":"XXL","ageYears":"10-11","bodyWidthCm":"46","bodyLengthCm":"54"},"onHand":1,"weightGrams":450,"lengthMm":320,"widthMm":280,"heightMm":60,"isActive":true}]},{"code":"006","facts":{"candidateSource":"marketplace_benchmark_2026-09-28","confidence":"medium","targetFacts":{"capacityMl":500,"targetBodyMaterial":"STS304 stainless body","targetBodyDiameterMm":70,"targetBodyHeightMm":220},"notes":null,"sourceIds":["S6","S7"]},"variants":[{"sku":"006-500ML","title":"500 ml","optionValues":{"size":"500 ml"},"onHand":10,"weightGrams":350,"lengthMm":90,"widthMm":90,"heightMm":240,"isActive":true}]},{"code":"007","facts":{"candidateSource":"marketplace_benchmark_2026-09-28","confidence":"medium","targetFacts":{"procurementTarget":"Mandiri E-Money Gen2 custom UV print","issuerTarget":"Bank Mandiri","startingBalanceRupiah":0,"cardStandard":"ISO/IEC 7810 ID-1 / CR80","cardWidthMm":85.6,"cardHeightMm":53.98,"cardThicknessMm":0.8},"notes":"Issuer/function is a PROCUREMENT TARGET, not a verified fact of the existing Mainlagi asset. Supplier must confirm genuine issued card, Gen2/NFC top-up behavior, and zero starting balance before activation.","sourceIds":["S8","S9"]},"variants":[{"sku":"007-MANDIRI-GEN2","title":"Mandiri E-Money Gen2","optionValues":{"size":"Mandiri E-Money Gen2"},"onHand":7,"weightGrams":40,"lengthMm":100,"widthMm":70,"heightMm":10,"isActive":true}]},{"code":"008","facts":{"candidateSource":"marketplace_benchmark_2026-09-28","confidence":"high","targetFacts":{"size":"A5","widthMm":148,"heightMm":210,"pageStyle":"Bergaris","sheets":80,"targetThicknessMm":12},"notes":null,"sourceIds":["S10","S11"]},"variants":[{"sku":"008-A5-80-LINED","title":"A5 / 80 lembar / bergaris","optionValues":{"size":"A5 / 80 lembar / bergaris"},"onHand":11,"weightGrams":300,"lengthMm":220,"widthMm":160,"heightMm":20,"isActive":true}]},{"code":"009","facts":{"candidateSource":"marketplace_benchmark_2026-09-28","confidence":"medium-high","targetFacts":{"size":"A4","widthMm":210,"heightMm":297,"targetPaperGsm":120,"targetSheets":20,"pageStyle":"Polos"},"notes":null,"sourceIds":["S12","S13"]},"variants":[{"sku":"009-A4-120GSM-20","title":"A4 / 120 gsm / 20 lembar","optionValues":{"size":"A4 / 120 gsm / 20 lembar"},"onHand":9,"weightGrams":250,"lengthMm":310,"widthMm":230,"heightMm":10,"isActive":true}]}]$candidate$::jsonb)
  loop
    select * into p
    from public.shop_products
    where product_code=item->>'code'
    for update;

    if not found then
      raise exception 'candidate product % missing', item->>'code';
    end if;

    if p.status<>'draft' or p.review_status<>'draft' or p.facts_verified then
      raise exception 'candidate product % must remain unverified draft', p.product_code;
    end if;

    if exists(
      select 1
      from public.shop_variants v
      where v.product_id=p.id
        and (
          exists(select 1 from public.shop_cart_items ci where ci.variant_id=v.id)
          or exists(select 1 from public.shop_order_items oi where oi.variant_id=v.id)
          or exists(select 1 from public.shop_inventory_reservations ir where ir.variant_id=v.id)
        )
    ) then
      raise exception 'candidate product % has transaction history', p.product_code;
    end if;

    if exists(
      select 1
      from public.shop_inventory_ledger l
      join public.shop_variants v on v.id=l.variant_id
      where v.product_id=p.id
        and l.movement_type not in ('initial_seed','variant_setup')
    ) then
      raise exception 'candidate product % has inventory history', p.product_code;
    end if;

    total:=0;
    for variant in select value from jsonb_array_elements(item->'variants') loop
      stock:=(variant->>'onHand')::int;
      total:=total+stock;
      if stock<0
        or coalesce((variant->>'weightGrams')::int,0)<=0
        or coalesce((variant->>'lengthMm')::int,0)<=0
        or coalesce((variant->>'widthMm')::int,0)<=0
        or coalesce((variant->>'heightMm')::int,0)<=0
      then
        raise exception 'invalid marketplace candidate variant for %',p.product_code;
      end if;
    end loop;

    if total<>p.initial_stock_total then
      raise exception 'candidate stock % does not equal approved initial total % for %',total,p.initial_stock_total,p.product_code;
    end if;

    delete from public.shop_inventory_ledger l
    using public.shop_variants v
    where l.variant_id=v.id and v.product_id=p.id;

    delete from public.shop_inventory_balances b
    using public.shop_variants v
    where b.variant_id=v.id and v.product_id=p.id;

    delete from public.shop_variants where product_id=p.id;

    for variant in select value from jsonb_array_elements(item->'variants') loop
      stock:=(variant->>'onHand')::int;
      insert into public.shop_variants(
        product_id,sku,title,option_values,price_override_amount,
        weight_grams,length_mm,width_mm,height_mm,is_active
      )
      values(
        p.id,
        upper(variant->>'sku'),
        variant->>'title',
        coalesce(variant->'optionValues','{}'::jsonb),
        null,
        (variant->>'weightGrams')::int,
        (variant->>'lengthMm')::int,
        (variant->>'widthMm')::int,
        (variant->>'heightMm')::int,
        coalesce((variant->>'isActive')::boolean,true)
      )
      returning id into vid;

      insert into public.shop_inventory_balances(variant_id,on_hand,reserved)
      values(vid,stock,0);

      if stock>0 then
        insert into public.shop_inventory_ledger(
          variant_id,quantity_delta,movement_type,idempotency_key,reason
        )
        values(
          vid,
          stock,
          'variant_setup',
          'marketplace-candidate:'||p.product_code||':'||upper(variant->>'sku'),
          'Marketplace benchmark candidate allocation — unverified'
        );
      end if;
    end loop;

    update public.shop_products
    set facts=jsonb_build_object(
          'verificationStatus','marketplace_candidate_unverified',
          'candidateSource','MAINLAGI_SHOP_PRODUCT_TRUTH_MARKETPLACE_CANDIDATE_2026-09-28',
          'marketplaceCandidate',item->'facts'
        ),
        status='draft',
        review_status='draft',
        facts_verified=false,
        updated_at=now()
    where id=p.id;
  end loop;
end
$shop$;
