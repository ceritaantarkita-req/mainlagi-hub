-- Batch 11 physical/supplier verification evidence gate.
-- Candidate values remain planning data until auditable evidence covers every
-- marketplace target fact and every active SKU.

create or replace function public.shop_product_readiness(p_product uuid) returns jsonb
language plpgsql stable security invoker set search_path=pg_catalog,public as $shop$
declare p public.shop_products; blockers text[]:=array[]::text[]; media_count int:=0; hero_count int:=0;
 variant_count int:=0; missing_weight int:=0; missing_inventory int:=0; missing_dimensions int:=0; missing_size int:=0; missing_verified_skus int:=0; missing_actual_facts int:=0; candidate_fact_count int:=0; product_type text; verification jsonb; verified_skus jsonb;
begin
 select * into p from public.shop_products where id=p_product;
 if not found then raise exception 'product missing'; end if;
 verification:=coalesce(p.facts->'verification','{}'::jsonb);
 verified_skus:=case when jsonb_typeof(verification->'variantSkus')='array' then verification->'variantSkus' else '[]'::jsonb end;
 if coalesce(p.facts->>'verificationStatus','')<>'production_verified' then blockers:=array_append(blockers,'Production facts require physical or supplier verification.'); end if;
 if coalesce(verification->>'method','') not in ('physical_sample','supplier_production_sheet','physical_and_supplier') then blockers:=array_append(blockers,'Verification method is required.'); end if;
 if length(trim(coalesce(verification->>'verifiedBy','')))<2 then blockers:=array_append(blockers,'Verifier identity is required.'); end if;
 if coalesce(verification->>'verifiedAt','') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then blockers:=array_append(blockers,'Verification date is required.'); end if;
 if length(trim(coalesce(verification->>'evidenceRef','')))<3 then blockers:=array_append(blockers,'Verification evidence reference is required.'); end if;
 if coalesce(verification->>'productFactsConfirmed','false')<>'true' then blockers:=array_append(blockers,'Product facts must be explicitly confirmed.'); end if;
 if coalesce(verification->>'stockCountConfirmed','false')<>'true' then blockers:=array_append(blockers,'Stock allocation/count must be explicitly confirmed.'); end if;
 select count(*)::int into candidate_fact_count
 from jsonb_object_keys(coalesce(p.facts#>'{marketplaceCandidate,targetFacts}','{}'::jsonb));
 if candidate_fact_count<1 then blockers:=array_append(blockers,'Marketplace candidate baseline must remain available for verification.'); end if;
 select count(*)::int into missing_actual_facts
 from jsonb_object_keys(coalesce(p.facts#>'{marketplaceCandidate,targetFacts}','{}'::jsonb)) as k(key)
 where length(trim(coalesce(verification#>>array['actualProductFacts',k.key],'')))=0;
 if missing_actual_facts>0 then blockers:=array_append(blockers,'Every marketplace candidate product fact needs an actual verified value.'); end if;
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
 select count(*)::int into missing_verified_skus
 from public.shop_variants v
 where v.product_id=p_product and v.is_active
   and not exists(
     select 1
     from jsonb_array_elements_text(verified_skus) as covered(sku)
     where covered.sku=v.sku
   );
 if missing_verified_skus>0 then blockers:=array_append(blockers,'Every active SKU must be covered by physical/supplier verification evidence.'); end if;
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
