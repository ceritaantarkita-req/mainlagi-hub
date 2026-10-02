-- Batch 09 financial reporting hardening.
-- Payment review/partial-refund/chargeback holds are excluded from retained
-- revenue until a later accounting release can represent them accurately.

create or replace function public.shop_report_v2(
  p_from timestamptz,
  p_to timestamptz
) returns jsonb
language plpgsql stable security invoker set search_path=pg_catalog,public as $shop$
declare
  summary jsonb;
  products jsonb;
  variants jsonb;
  inventory jsonb;
begin
  if p_from is null or p_to is null or p_from>=p_to then
    raise exception 'invalid report range';
  end if;

  select jsonb_build_object(
    'settledOrders',count(*) filter(where o.payment_status in ('paid','refunded')),
    'paidOrders',count(*) filter(
      where o.payment_status='paid'
        and not exists(
          select 1 from public.shop_provider_events pe
          where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
        )
    ),
    'manualReviewOrders',count(*) filter(
      where exists(
        select 1 from public.shop_provider_events pe
        where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
      )
    ),
    'merchandise',coalesce(sum(o.subtotal_amount) filter(
      where o.payment_status='paid'
        and not exists(
          select 1 from public.shop_provider_events pe
          where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
        )
    ),0),
    'shipping',coalesce(sum(o.shipping_amount) filter(
      where o.payment_status='paid'
        and not exists(
          select 1 from public.shop_provider_events pe
          where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
        )
    ),0),
    'collected',coalesce(sum(o.grand_total_amount) filter(
      where o.payment_status='paid'
        and not exists(
          select 1 from public.shop_provider_events pe
          where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
        )
    ),0),
    'grossCollected',coalesce(sum(o.grand_total_amount) filter(
      where o.payment_status in ('paid','refunded')
    ),0),
    'refundedOrders',count(*) filter(where o.payment_status='refunded'),
    'refundedGross',coalesce(sum(o.grand_total_amount) filter(where o.payment_status='refunded'),0),
    'attention',count(*) filter(where o.order_status='attention_required'),
    'partialRefundAccounting','excluded'
  ) into summary
  from public.shop_orders o
  where o.paid_at>=p_from and o.paid_at<p_to;

  select coalesce(jsonb_agg(row_data order by product_code),'[]'::jsonb) into products
  from (
    select
      i.product_code_snapshot product_code,
      max(i.title_snapshot) title,
      sum(i.quantity) filter(where o.payment_status in ('paid','refunded')) gross_units,
      coalesce(sum(i.quantity) filter(
        where o.payment_status='paid'
          and not exists(
            select 1 from public.shop_provider_events pe
            where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
          )
      ),0) retained_units,
      coalesce(sum(i.quantity) filter(where o.payment_status='refunded'),0) refunded_units,
      coalesce(sum(i.quantity) filter(
        where exists(
          select 1 from public.shop_provider_events pe
          where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
        )
      ),0) manual_review_units,
      coalesce(sum(i.line_total_amount) filter(
        where o.payment_status='paid'
          and not exists(
            select 1 from public.shop_provider_events pe
            where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
          )
      ),0) retained_merchandise
    from public.shop_order_items i
    join public.shop_orders o on o.id=i.order_id
    where o.paid_at>=p_from and o.paid_at<p_to
      and o.payment_status in ('paid','refunded')
    group by i.product_code_snapshot
  ) row_data;

  select coalesce(jsonb_agg(row_data order by sku),'[]'::jsonb) into variants
  from (
    select
      i.sku_snapshot sku,
      max(i.title_snapshot) title,
      sum(i.quantity) filter(where o.payment_status in ('paid','refunded')) gross_units,
      coalesce(sum(i.quantity) filter(
        where o.payment_status='paid'
          and not exists(
            select 1 from public.shop_provider_events pe
            where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
          )
      ),0) retained_units,
      coalesce(sum(i.quantity) filter(where o.payment_status='refunded'),0) refunded_units,
      coalesce(sum(i.quantity) filter(
        where exists(
          select 1 from public.shop_provider_events pe
          where pe.order_id=o.id and pe.provider='midtrans' and pe.event_type='review'
        )
      ),0) manual_review_units
    from public.shop_order_items i
    join public.shop_orders o on o.id=i.order_id
    where o.paid_at>=p_from and o.paid_at<p_to
      and o.payment_status in ('paid','refunded')
    group by i.sku_snapshot
  ) row_data;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'productCode',p.product_code,
        'sku',v.sku,
        'title',v.title,
        'onHand',b.on_hand,
        'reserved',b.reserved,
        'available',b.on_hand-b.reserved
      ) order by p.product_code,v.sku
    ),
    '[]'::jsonb
  ) into inventory
  from public.shop_inventory_balances b
  join public.shop_variants v on v.id=b.variant_id
  join public.shop_products p on p.id=v.product_id;

  return jsonb_build_object(
    'summary',summary,
    'products',products,
    'variants',variants,
    'inventory',inventory
  );
end
$shop$;

revoke all on function public.shop_report_v2(timestamptz,timestamptz)
from public,anon,authenticated;
grant execute on function public.shop_report_v2(timestamptz,timestamptz)
to service_role;
