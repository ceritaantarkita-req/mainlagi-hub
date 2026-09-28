-- Batch 09 configurable PII retention mechanism.
-- No retention duration is assumed here. The scheduler invokes this RPC only when
-- SHOP_ORDER_PII_RETENTION_DAYS is explicitly configured by the owner/deployment.

alter table public.shop_orders
  add column pii_redacted_at timestamptz;

create index shop_orders_pii_retention_idx
  on public.shop_orders(created_at)
  where pii_redacted_at is null;

create or replace function public.shop_redact_order_pii(
  p_before timestamptz,
  p_limit int default 50
) returns int
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
declare
  row_order record;
  redacted_count int:=0;
begin
  if p_before is null or p_limit is null or p_limit not between 1 and 100 then
    raise exception 'invalid retention request';
  end if;

  for row_order in
    select o.id
    from public.shop_orders o
    where o.pii_redacted_at is null
      and o.created_at<p_before
      and o.order_status in ('completed','cancelled','expired','refunded')
      and o.order_status<>'attention_required'
      and o.fulfillment_status<>'attention_required'
    order by o.created_at
    for update of o skip locked
    limit p_limit
  loop
    update public.shop_orders
    set customer=jsonb_build_object(
          'name','[redacted]',
          'email','[redacted]',
          'phone','[redacted]'
        ),
        address_snapshot=jsonb_build_object(
          'address','[redacted]',
          'city','[redacted]',
          'province','[redacted]',
          'postalCode','00000'
        ),
        pii_redacted_at=now()
    where id=row_order.id;

    insert into public.audit_logs(action,entity,entity_id,payload)
    values(
      'shop.order.pii.redact',
      'shop_order',
      row_order.id::text,
      jsonb_build_object('cutoff',p_before)
    );
    redacted_count:=redacted_count+1;
  end loop;
  return redacted_count;
end
$shop$;

revoke all on function public.shop_redact_order_pii(timestamptz,int)
from public,anon,authenticated;
grant execute on function public.shop_redact_order_pii(timestamptz,int)
to service_role;
