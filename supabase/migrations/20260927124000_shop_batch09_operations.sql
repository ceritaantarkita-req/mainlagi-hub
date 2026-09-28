-- Batch 09 additive reconciliation, owner recovery, pagination and reporting.
-- Provider calls remain in server code; these RPCs only manage local transactional
-- state, observability and owner-authorized recovery.

create table public.shop_reconciliation_state (
  order_id uuid not null references public.shop_orders(id) on delete cascade,
  kind text not null check(kind in ('payment','shipment')),
  attempts int not null default 0 check(attempts>=0),
  status text not null default 'pending' check(status in ('pending','ok','error','blocked')),
  last_attempt_at timestamptz,
  next_attempt_at timestamptz not null default now(),
  last_success_at timestamptz,
  last_error text,
  primary key(order_id,kind)
);
create index shop_reconciliation_state_due_idx
  on public.shop_reconciliation_state(kind,next_attempt_at);

create table public.shop_reconciliation_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check(status in ('running','ok','partial','blocked')),
  details jsonb not null default '{}'::jsonb
);
create index shop_reconciliation_runs_started_idx
  on public.shop_reconciliation_runs(started_at desc);

alter table public.shop_reconciliation_state enable row level security;
alter table public.shop_reconciliation_runs enable row level security;
revoke all on public.shop_reconciliation_state from public,anon,authenticated;
revoke all on public.shop_reconciliation_runs from public,anon,authenticated;
grant all on public.shop_reconciliation_state to service_role;
grant all on public.shop_reconciliation_runs to service_role;

create index if not exists shop_orders_ops_status_idx
  on public.shop_orders(payment_status,order_status,fulfillment_status,created_at desc);

create or replace function public.shop_expire_unattempted_orders(p_limit int default 50)
returns int
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
declare
  row_order record;
  expired_count int:=0;
begin
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception 'invalid reconciliation limit';
  end if;
  for row_order in
    select o.id,o.order_number,o.grand_total_amount
    from public.shop_orders o
    where o.payment_status='pending'
      and o.order_status='pending_payment'
      and o.expires_at + interval '2 minutes' < now()
      and not exists(
        select 1 from public.shop_payment_attempts pa where pa.order_id=o.id
      )
    order by o.created_at
    for update of o skip locked
    limit p_limit
  loop
    perform public.shop_apply_payment(
      row_order.order_number,
      row_order.grand_total_amount,
      'expired',
      'local-expiry:'||row_order.id::text,
      null
    );
    expired_count:=expired_count+1;
  end loop;
  return expired_count;
end
$shop$;

create or replace function public.shop_reconciliation_due(
  p_kind text,
  p_limit int default 50
) returns table(order_id uuid,order_number text,provider_id text)
language plpgsql stable security invoker set search_path=pg_catalog,public as $shop$
begin
  if p_kind not in ('payment','shipment') then
    raise exception 'invalid reconciliation kind';
  end if;
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception 'invalid reconciliation limit';
  end if;

  if p_kind='payment' then
    return query
    select o.id,o.order_number,null::text
    from public.shop_orders o
    join public.shop_payment_attempts pa on pa.order_id=o.id
    left join public.shop_reconciliation_state rs
      on rs.order_id=o.id and rs.kind='payment'
    where o.payment_status='pending'
      and o.order_status='pending_payment'
      and coalesce(rs.next_attempt_at,'-infinity'::timestamptz)<=now()
    order by o.created_at
    limit p_limit;
  else
    return query
    select o.id,o.order_number,s.provider_order_id
    from public.shop_orders o
    join public.shop_shipments s on s.order_id=o.id
    left join public.shop_reconciliation_state rs
      on rs.order_id=o.id and rs.kind='shipment'
    where o.payment_status='paid'
      and o.order_status not in ('refunded')
      and o.fulfillment_status in ('shipment_created','in_transit')
      and s.provider_order_id is not null
      and coalesce(rs.next_attempt_at,'-infinity'::timestamptz)<=now()
    order by s.updated_at
    limit p_limit;
  end if;
end
$shop$;

create or replace function public.shop_reconciliation_mark(
  p_order uuid,
  p_kind text,
  p_outcome text,
  p_error text default null
) returns int
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
declare
  old_attempts int:=0;
  next_attempts int:=0;
  delay_minutes int:=15;
begin
  if p_kind not in ('payment','shipment')
     or p_outcome not in ('ok','pending','error','blocked') then
    raise exception 'invalid reconciliation result';
  end if;
  if not exists(select 1 from public.shop_orders where id=p_order) then
    raise exception 'order missing';
  end if;

  select attempts into old_attempts
  from public.shop_reconciliation_state
  where order_id=p_order and kind=p_kind
  for update;
  old_attempts:=coalesce(old_attempts,0);

  if p_outcome='ok' then
    next_attempts:=0;
    delay_minutes:=15;
  else
    next_attempts:=old_attempts+1;
    delay_minutes:=case
      when next_attempts=1 then 5
      when next_attempts=2 then 10
      when next_attempts=3 then 20
      else 60
    end;
  end if;

  insert into public.shop_reconciliation_state(
    order_id,kind,attempts,status,last_attempt_at,next_attempt_at,last_success_at,last_error
  ) values(
    p_order,p_kind,next_attempts,p_outcome,now(),
    now() + interval '1 minute' * delay_minutes,
    case when p_outcome='ok' then now() else null end,
    case when p_outcome in ('error','blocked')
      then left(coalesce(p_error,'provider_error'),500) else null end
  )
  on conflict(order_id,kind) do update set
    attempts=excluded.attempts,
    status=excluded.status,
    last_attempt_at=excluded.last_attempt_at,
    next_attempt_at=excluded.next_attempt_at,
    last_success_at=case
      when p_outcome='ok' then excluded.last_success_at
      else shop_reconciliation_state.last_success_at end,
    last_error=excluded.last_error;

  if p_outcome='error' and next_attempts in (3,6,12) then
    insert into public.audit_logs(action,entity,entity_id,payload)
    values(
      'shop.reconciliation.alert',
      'shop_order',
      p_order::text,
      jsonb_build_object(
        'kind',p_kind,
        'attempts',next_attempts,
        'error',left(coalesce(p_error,'provider_error'),500)
      )
    );
  end if;
  return next_attempts;
end
$shop$;

create or replace function public.shop_admin_orders(
  p_search text default null,
  p_payment text default null,
  p_fulfillment text default null,
  p_status text default null,
  p_page int default 1,
  p_page_size int default 25
) returns jsonb
language plpgsql stable security invoker set search_path=pg_catalog,public as $shop$
declare
  search_value text:=lower(trim(coalesce(p_search,'')));
begin
  if p_page is null or p_page<1 or p_page>100000
     or p_page_size is null or p_page_size not between 1 and 50 then
    raise exception 'invalid pagination';
  end if;
  if nullif(p_payment,'') is not null
     and p_payment not in ('pending','paid','failed','expired','cancelled','refunded') then
    raise exception 'invalid payment filter';
  end if;
  if nullif(p_fulfillment,'') is not null
     and p_fulfillment not in (
       'unfulfilled','ready_to_ship','shipment_created','in_transit','delivered',
       'exception','attention_required','cancelled'
     ) then raise exception 'invalid fulfillment filter'; end if;
  if nullif(p_status,'') is not null
     and p_status not in (
       'pending_payment','processing','completed','cancelled','expired',
       'attention_required','refunded'
     ) then raise exception 'invalid order filter'; end if;

  return (
    with filtered as (
      select
        o.id,o.order_number,o.account_id,o.customer,o.address_snapshot,
        o.shipping_quote_snapshot,o.subtotal_amount,o.shipping_amount,
        o.grand_total_amount,o.order_status,o.payment_status,
        o.fulfillment_status,o.expires_at,o.paid_at,o.created_at,
        (
          select jsonb_build_object(
            'providerOrderId',s.provider_order_id,
            'status',s.status,
            'waybillId',s.waybill_id,
            'trackingUrl',s.tracking_url,
            'updatedAt',s.updated_at
          )
          from public.shop_shipments s where s.order_id=o.id
        ) shipment
      from public.shop_orders o
      where (
        search_value=''
        or lower(o.order_number) like '%'||search_value||'%'
        or lower(coalesce(o.customer->>'name','')) like '%'||search_value||'%'
        or lower(coalesce(o.customer->>'email','')) like '%'||search_value||'%'
        or lower(coalesce(o.customer->>'phone','')) like '%'||search_value||'%'
        or lower(coalesce(o.address_snapshot->>'address','')) like '%'||search_value||'%'
        or lower(coalesce(o.address_snapshot->>'city','')) like '%'||search_value||'%'
        or lower(coalesce(o.address_snapshot->>'postalCode','')) like '%'||search_value||'%'
      )
      and (nullif(p_payment,'') is null or o.payment_status=p_payment)
      and (nullif(p_fulfillment,'') is null or o.fulfillment_status=p_fulfillment)
      and (nullif(p_status,'') is null or o.order_status=p_status)
    ),
    paged as (
      select * from filtered
      order by created_at desc,id desc
      limit p_page_size
      offset (p_page-1)*p_page_size
    )
    select jsonb_build_object(
      'page',p_page,
      'pageSize',p_page_size,
      'total',(select count(*) from filtered),
      'items',coalesce(
        (
          select jsonb_agg(to_jsonb(p) order by p.created_at desc,p.id desc)
          from paged p
        ),
        '[]'::jsonb
      )
    )
  );
end
$shop$;

create or replace function public.shop_admin_order_detail(p_number text)
returns jsonb
language plpgsql stable security invoker set search_path=pg_catalog,public as $shop$
declare
  o public.shop_orders;
begin
  select * into o from public.shop_orders where order_number=p_number;
  if not found then raise exception 'order missing'; end if;

  return jsonb_build_object(
    'order',jsonb_build_object(
      'id',o.id,
      'number',o.order_number,
      'accountId',o.account_id,
      'customer',o.customer,
      'address',o.address_snapshot,
      'shippingQuote',o.shipping_quote_snapshot,
      'subtotal',o.subtotal_amount,
      'shipping',o.shipping_amount,
      'total',o.grand_total_amount,
      'payment',o.payment_status,
      'fulfillment',o.fulfillment_status,
      'status',o.order_status,
      'expiresAt',o.expires_at,
      'paidAt',o.paid_at,
      'createdAt',o.created_at
    ),
    'items',coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'title',i.title_snapshot,
            'sku',i.sku_snapshot,
            'options',i.option_snapshot,
            'unitPrice',i.unit_price_amount,
            'quantity',i.quantity,
            'lineTotal',i.line_total_amount
          ) order by i.id
        )
        from public.shop_order_items i where i.order_id=o.id
      ),
      '[]'::jsonb
    ),
    'shipment',(
      select jsonb_build_object(
        'providerOrderId',s.provider_order_id,
        'status',s.status,
        'waybillId',s.waybill_id,
        'trackingUrl',s.tracking_url,
        'updatedAt',s.updated_at
      ) from public.shop_shipments s where s.order_id=o.id
    ),
    'reconciliation',coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'kind',r.kind,
            'attempts',r.attempts,
            'status',r.status,
            'lastAttemptAt',r.last_attempt_at,
            'nextAttemptAt',r.next_attempt_at,
            'lastSuccessAt',r.last_success_at,
            'lastError',r.last_error
          ) order by r.kind
        )
        from public.shop_reconciliation_state r where r.order_id=o.id
      ),
      '[]'::jsonb
    ),
    'timeline',coalesce(
      (
        select jsonb_agg(event order by occurred_at,id)
        from (
          select
            pe.received_at occurred_at,
            pe.id::text id,
            jsonb_build_object(
              'at',pe.received_at,
              'source','provider',
              'type',pe.provider||'.'||pe.event_type
            ) event
          from public.shop_provider_events pe where pe.order_id=o.id
          union all
          select
            al.created_at occurred_at,
            al.id::text id,
            jsonb_build_object(
              'at',al.created_at,
              'source','audit',
              'type',al.action,
              'payload',al.payload
            ) event
          from public.audit_logs al where al.entity_id=o.id::text
        ) events
      ),
      '[]'::jsonb
    )
  );
end
$shop$;

create or replace function public.shop_admin_order_action(
  p_order uuid,
  p_action text,
  p_reason text,
  p_actor uuid
) returns jsonb
language plpgsql security invoker set search_path=pg_catalog,public as $shop$
declare
  o public.shop_orders;
  r record;
begin
  if not exists(select 1 from public.profiles where id=p_actor and role='owner') then
    raise exception 'owner required';
  end if;
  if p_reason is null or length(trim(p_reason)) not between 3 and 500 then
    raise exception 'reason required';
  end if;
  select * into o from public.shop_orders where id=p_order for update;
  if not found then raise exception 'order missing'; end if;

  if p_action='note' then
    insert into public.audit_logs(actor_id,action,entity,entity_id,payload)
    values(
      p_actor,'shop.order.note','shop_order',o.id::text,
      jsonb_build_object('reason',trim(p_reason))
    );
  elsif p_action='accept_late_payment_stock' then
    if o.payment_status<>'paid'
       or o.order_status<>'attention_required'
       or o.fulfillment_status<>'attention_required'
       or not exists(select 1 from public.shop_inventory_reservations where order_id=o.id)
       or exists(
         select 1 from public.shop_inventory_reservations
         where order_id=o.id and status<>'released'
       ) then raise exception 'late payment recovery unavailable'; end if;

    perform b.variant_id
    from public.shop_inventory_balances b
    join public.shop_inventory_reservations ir on ir.variant_id=b.variant_id
    where ir.order_id=o.id
    order by b.variant_id
    for update of b;

    if exists(
      select 1
      from public.shop_inventory_reservations ir
      join public.shop_inventory_balances b on b.variant_id=ir.variant_id
      where ir.order_id=o.id
        and ir.status='released'
        and b.on_hand-b.reserved<ir.quantity
    ) then raise exception 'stock unavailable for late payment'; end if;

    for r in
      select * from public.shop_inventory_reservations
      where order_id=o.id and status='released'
      order by variant_id
    loop
      update public.shop_inventory_balances
      set on_hand=on_hand-r.quantity
      where variant_id=r.variant_id;
      update public.shop_inventory_reservations
      set status='consumed'
      where order_id=o.id and variant_id=r.variant_id;
      insert into public.shop_inventory_ledger(
        variant_id,quantity_delta,movement_type,idempotency_key,reason,actor_id
      ) values(
        r.variant_id,-r.quantity,'late_sale',
        'late-sale:'||o.id::text||':'||r.variant_id::text,
        trim(p_reason),p_actor
      ) on conflict(idempotency_key) do nothing;
    end loop;

    update public.shop_orders
    set order_status='processing',fulfillment_status='unfulfilled'
    where id=o.id;
    insert into public.audit_logs(actor_id,action,entity,entity_id,payload)
    values(
      p_actor,'shop.order.late_payment.accept_stock','shop_order',o.id::text,
      jsonb_build_object('reason',trim(p_reason))
    );
  elsif p_action='restock_full_refund' then
    if o.payment_status<>'refunded'
       or o.order_status<>'refunded'
       or o.fulfillment_status<>'attention_required'
       or not exists(select 1 from public.shop_inventory_reservations where order_id=o.id)
       or exists(
         select 1 from public.shop_inventory_reservations
         where order_id=o.id and status<>'consumed'
       ) then raise exception 'refund restock unavailable'; end if;

    perform b.variant_id
    from public.shop_inventory_balances b
    join public.shop_inventory_reservations ir on ir.variant_id=b.variant_id
    where ir.order_id=o.id
    order by b.variant_id
    for update of b;

    for r in
      select * from public.shop_inventory_reservations
      where order_id=o.id and status='consumed'
      order by variant_id
    loop
      update public.shop_inventory_balances
      set on_hand=on_hand+r.quantity
      where variant_id=r.variant_id;
      insert into public.shop_inventory_ledger(
        variant_id,quantity_delta,movement_type,idempotency_key,reason,actor_id
      ) values(
        r.variant_id,r.quantity,'refund_restock',
        'refund-restock:'||o.id::text||':'||r.variant_id::text,
        trim(p_reason),p_actor
      ) on conflict(idempotency_key) do nothing;
    end loop;

    update public.shop_orders set fulfillment_status='cancelled' where id=o.id;
    insert into public.audit_logs(actor_id,action,entity,entity_id,payload)
    values(
      p_actor,'shop.order.refund.restock','shop_order',o.id::text,
      jsonb_build_object('reason',trim(p_reason))
    );
  else
    raise exception 'invalid order action';
  end if;

  return jsonb_build_object(
    'payment',(select payment_status from public.shop_orders where id=o.id),
    'fulfillment',(select fulfillment_status from public.shop_orders where id=o.id),
    'status',(select order_status from public.shop_orders where id=o.id)
  );
end
$shop$;

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
    'settledOrders',count(*) filter(where payment_status in ('paid','refunded')),
    'paidOrders',count(*) filter(where payment_status='paid'),
    'merchandise',coalesce(sum(subtotal_amount) filter(where payment_status='paid'),0),
    'shipping',coalesce(sum(shipping_amount) filter(where payment_status='paid'),0),
    'collected',coalesce(sum(grand_total_amount) filter(where payment_status='paid'),0),
    'grossCollected',coalesce(sum(grand_total_amount) filter(where payment_status in ('paid','refunded')),0),
    'refundedOrders',count(*) filter(where payment_status='refunded'),
    'refundedGross',coalesce(sum(grand_total_amount) filter(where payment_status='refunded'),0),
    'attention',count(*) filter(where order_status='attention_required'),
    'partialRefundAccounting','excluded'
  ) into summary
  from public.shop_orders
  where paid_at>=p_from and paid_at<p_to;

  select coalesce(jsonb_agg(row_data order by product_code),'[]'::jsonb) into products
  from (
    select
      i.product_code_snapshot product_code,
      max(i.title_snapshot) title,
      sum(i.quantity) filter(where o.payment_status in ('paid','refunded')) gross_units,
      coalesce(sum(i.quantity) filter(where o.payment_status='paid'),0) retained_units,
      coalesce(sum(i.quantity) filter(where o.payment_status='refunded'),0) refunded_units,
      coalesce(sum(i.line_total_amount) filter(where o.payment_status='paid'),0) retained_merchandise
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
      coalesce(sum(i.quantity) filter(where o.payment_status='paid'),0) retained_units,
      coalesce(sum(i.quantity) filter(where o.payment_status='refunded'),0) refunded_units
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

do $shop$
declare f record;
begin
  for f in
    select oid::regprocedure as signature
    from pg_proc
    where pronamespace='public'::regnamespace
      and proname in (
        'shop_expire_unattempted_orders',
        'shop_reconciliation_due',
        'shop_reconciliation_mark',
        'shop_admin_orders',
        'shop_admin_order_detail',
        'shop_admin_order_action',
        'shop_report_v2'
      )
  loop
    execute format('revoke all on function %s from public,anon,authenticated',f.signature);
    execute format('grant execute on function %s to service_role',f.signature);
  end loop;
end
$shop$;
