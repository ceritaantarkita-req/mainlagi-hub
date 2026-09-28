-- Batch 11 verification staleness hardening.
-- Physical/supplier evidence is only valid for the facts and physical variant
-- configuration that were reviewed. Relevant edits must force re-verification.

create or replace function public.shop_mark_verification_stale(p_product uuid,p_reason text) returns void
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
begin
 update public.shop_products
 set facts=coalesce(facts,'{}'::jsonb)
     || jsonb_build_object(
          'verificationStatus','verification_stale',
          'verification',
            coalesce(facts->'verification','{}'::jsonb)
            || jsonb_build_object(
                 'method',null,
                 'verifiedBy',null,
                 'verifiedAt',null,
                 'evidenceRef',null,
                 'productFactsConfirmed',false,
                 'stockCountConfirmed',false,
                 'variantSkus',jsonb_build_array()
               ),
          'verificationInvalidation',
            jsonb_build_object(
              'reason',coalesce(nullif(trim(p_reason),''),'relevant product data changed'),
              'invalidatedAt',to_char((now() at time zone 'UTC'),'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
              'previousVerification',coalesce(facts->'verification','{}'::jsonb)
            )
        ),
     status='draft',
     review_status='draft',
     facts_verified=false,
     updated_at=now()
 where id=p_product
   and coalesce(facts->>'verificationStatus','')='production_verified';
end
$shop$;

create or replace function public.shop_guard_verified_facts_staleness() returns trigger
language plpgsql set search_path=pg_catalog,public as $shop$
begin
 if coalesce(old.facts->>'verificationStatus','')='production_verified'
    and new.facts is distinct from old.facts
    and coalesce(new.facts->>'verificationStatus','')='production_verified'
 then
  new.facts:=coalesce(new.facts,'{}'::jsonb)
    || jsonb_build_object(
         'verificationStatus','verification_stale',
         'verification',
           coalesce(new.facts->'verification','{}'::jsonb)
           || jsonb_build_object(
                'method',null,
                'verifiedBy',null,
                'verifiedAt',null,
                'evidenceRef',null,
                'productFactsConfirmed',false,
                'stockCountConfirmed',false,
                'variantSkus',jsonb_build_array()
              ),
         'verificationInvalidation',
           jsonb_build_object(
             'reason','verified product facts changed',
             'invalidatedAt',to_char((now() at time zone 'UTC'),'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
             'previousVerification',coalesce(old.facts->'verification','{}'::jsonb)
           )
       );
  new.status:='draft';
  new.review_status:='draft';
  new.facts_verified:=false;
 end if;
 return new;
end
$shop$;

drop trigger if exists shop_verified_facts_staleness on public.shop_products;
create trigger shop_verified_facts_staleness
before update of facts on public.shop_products
for each row execute function public.shop_guard_verified_facts_staleness();

create or replace function public.shop_guard_verified_variant_staleness() returns trigger
language plpgsql set search_path=pg_catalog,public as $shop$
declare pid uuid;
begin
 pid:=case when tg_op='DELETE' then old.product_id else new.product_id end;
 perform public.shop_mark_verification_stale(
   pid,
   case
     when tg_op='INSERT' then 'physical variant inserted'
     when tg_op='DELETE' then 'physical variant deleted'
     else 'physical variant configuration changed'
   end
 );
 return case when tg_op='DELETE' then old else new end;
end
$shop$;

drop trigger if exists shop_verified_variant_staleness_insert on public.shop_variants;
create trigger shop_verified_variant_staleness_insert
after insert on public.shop_variants
for each row execute function public.shop_guard_verified_variant_staleness();

drop trigger if exists shop_verified_variant_staleness_delete on public.shop_variants;
create trigger shop_verified_variant_staleness_delete
after delete on public.shop_variants
for each row execute function public.shop_guard_verified_variant_staleness();

drop trigger if exists shop_verified_variant_staleness_update on public.shop_variants;
create trigger shop_verified_variant_staleness_update
after update of sku,title,option_values,weight_grams,length_mm,width_mm,height_mm,is_active
on public.shop_variants
for each row
when (
  old.sku is distinct from new.sku
  or old.title is distinct from new.title
  or old.option_values is distinct from new.option_values
  or old.weight_grams is distinct from new.weight_grams
  or old.length_mm is distinct from new.length_mm
  or old.width_mm is distinct from new.width_mm
  or old.height_mm is distinct from new.height_mm
  or old.is_active is distinct from new.is_active
)
execute function public.shop_guard_verified_variant_staleness();

revoke all on function public.shop_mark_verification_stale(uuid,text) from public,anon,authenticated;
grant execute on function public.shop_mark_verification_stale(uuid,text) to service_role;
revoke all on function public.shop_guard_verified_facts_staleness() from public,anon,authenticated;
grant execute on function public.shop_guard_verified_facts_staleness() to service_role;
revoke all on function public.shop_guard_verified_variant_staleness() from public,anon,authenticated;
grant execute on function public.shop_guard_verified_variant_staleness() to service_role;
