-- Batch 08 additive commerce state-machine hardening.
-- Keep provider status handling fail-closed and monotonic even when callbacks are
-- duplicated, delayed, out of order, or introduce an unknown future status.

create or replace function public.shop_apply_shipment(
  p_order uuid,
  p_provider text,
  p_status text,
  p_waybill text,
  p_tracking text
) returns void
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
declare
  o public.shop_orders;
  f text;
begin
  if p_provider is null or length(trim(p_provider))<1
     or p_status is null or length(trim(p_status))<1 then
    raise exception 'invalid shipment identity';
  end if;

  select * into o from public.shop_orders where id=p_order for update;
  if not found then raise exception 'order missing'; end if;

  if exists(
    select 1 from public.shop_shipments
    where order_id=p_order
      and provider_order_id is not null
      and provider_order_id<>p_provider
  ) then
    raise exception 'shipment mismatch';
  end if;

  f:=case
    when p_status='delivered' then 'delivered'
    when p_status in ('picking_up','picked','in_transit','dropping_off') then 'in_transit'
    when p_status in ('confirmed','scheduled','allocated') then 'shipment_created'
    when p_status in (
      'cancelled','on_hold','return_in_transit','returned','rejected',
      'disposed','courier_not_found'
    ) then 'exception'
    else 'attention_required'
  end;

  insert into public.shop_provider_events(provider,event_key,order_id,event_type)
  values('biteship',p_provider||':'||p_status,o.id,p_status)
  on conflict do nothing;
  if not found then return; end if;

  -- Delayed callbacks must not regress either the order or the shipment row.
  if o.fulfillment_status='delivered'
     and f in ('shipment_created','in_transit','delivered') then
    return;
  end if;
  if o.fulfillment_status='in_transit' and f='shipment_created' then
    return;
  end if;

  update public.shop_shipments
  set provider_order_id=p_provider,
      status=p_status,
      waybill_id=coalesce(p_waybill,waybill_id),
      tracking_url=coalesce(p_tracking,tracking_url),
      updated_at=now()
  where order_id=p_order;
  if not found then raise exception 'shipment not claimed'; end if;

  -- Refund/late-payment holds remain manual. Shipping callbacks may update raw
  -- provider facts but cannot clear the hold.
  if o.payment_status<>'paid' or o.order_status in ('attention_required','refunded') then
    return;
  end if;

  if f='attention_required' then
    update public.shop_orders
    set order_status='attention_required',
        fulfillment_status='attention_required'
    where id=p_order;
    insert into public.audit_logs(action,entity,entity_id,payload)
    values(
      'shop.shipment.unknown_status',
      'shop_order',
      o.id::text,
      jsonb_build_object('provider',p_provider,'status',p_status)
    );
    return;
  end if;

  if f='exception' then
    update public.shop_orders
    set order_status='attention_required',
        fulfillment_status='exception'
    where id=p_order;
    insert into public.audit_logs(action,entity,entity_id,payload)
    values(
      'shop.shipment.exception',
      'shop_order',
      o.id::text,
      jsonb_build_object('provider',p_provider,'status',p_status)
    );
    return;
  end if;

  -- A known exception/manual hold is cleared only through explicit operator
  -- recovery in a later operational batch, never by an unreviewed callback.
  if o.fulfillment_status in ('exception','attention_required') then
    return;
  end if;

  update public.shop_orders
  set fulfillment_status=f,
      order_status=case when f='delivered' then 'completed' else order_status end
  where id=p_order;
end
$shop$;

revoke all on function public.shop_apply_shipment(uuid,text,text,text,text)
from public,anon,authenticated;
grant execute on function public.shop_apply_shipment(uuid,text,text,text,text)
to service_role;
