import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const migrationDir = new URL("../supabase/migrations/", import.meta.url);
const files = (await readdir(migrationDir))
  .filter((name) => name.endsWith(".sql"))
  .sort();

assert.equal(files[0], "0001_init.sql");
assert.ok(files.includes("0051_world_evidence_advisor_hardening.sql"));
assert.ok(files.includes("20260926195237_shop_foundation.sql"));
assert.ok(files.includes("20260927051000_shop_admin_workflow.sql"));
assert.ok(
  files.includes("20260928143000_shop_batch11_marketplace_candidate_variants.sql"),
);
assert.ok(
  files.includes("20260928144000_shop_batch11_shipping_dimensions.sql"),
);
assert.ok(
  files.includes("20260928145000_shop_batch11_physical_supplier_verification.sql"),
);
assert.equal(
  files.indexOf("20260926195237_shop_foundation.sql") + 1,
  files.indexOf("20260927051000_shop_admin_workflow.sql"),
  "Shop admin migration must immediately follow the Shop foundation migration",
);

for (let i = 1; i <= 51; i++) {
  const prefix = String(i).padStart(4, "0") + "_";
  assert.equal(
    files.filter((name) => name.startsWith(prefix)).length,
    1,
    `expected exactly one historical migration with prefix ${prefix}`,
  );
}

const db = new PGlite();
try {
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users (
      id uuid primary key,
      email text,
      raw_user_meta_data jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    );
    create function auth.uid() returns uuid
    language sql stable
    as 'select null::uuid';
  `);

  for (const file of files) {
    let sql = await readFile(new URL(file, migrationDir), "utf8");
    // PGlite does not ship Supabase's pgcrypto extension package. Modern
    // PostgreSQL/PGlite still provides gen_random_uuid(), which is the only
    // capability the repository migrations need from this extension. Keep the
    // real migration untouched and skip only the extension-install statement
    // inside this emulator harness.
    if (file === "0001_init.sql")
      sql = sql.replace(
        /create extension if not exists pgcrypto;\s*/i,
        "",
      );
    try {
      await db.exec(sql);
    } catch (error) {
      throw new Error(
        `Full migration-chain failure at ${file}: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );
    }
  }

  const one = async (sql, args = []) => (await db.query(sql, args)).rows[0];

  assert.equal(
    (await one("select count(*)::int n from public.shop_products")).n,
    9,
  );
  assert.equal(
    (await one("select sum(on_hand)::int n from public.shop_inventory_balances"))
      .n,
    79,
  );
  assert.equal(
    (await one("select count(*)::int n from public.shop_variants")).n,
    27,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from public.shop_variants where sku like '%-DEFAULT'",
      )
    ).n,
    0,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from public.shop_products where facts->>'verificationStatus'='marketplace_candidate_unverified'",
      )
    ).n,
    9,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from public.shop_variants where is_active and length_mm is not null and width_mm is not null and height_mm is not null",
      )
    ).n,
    27,
    "all candidate variants carry packed shipping dimensions",
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from public.shop_product_media where approval_status='approved'",
      )
    ).n,
    26,
  );
  assert.equal(
    (
      await one(
        "select count(*)::int n from public.shop_products where status='draft' and review_status='draft' and facts_verified=false",
      )
    ).n,
    9,
  );

  const notebook = await one(
    "select id from public.shop_products where product_code='008'",
  );
  await db.query(
    "update public.shop_products set facts=jsonb_set(facts,'{verificationStatus}','\"production_verified\"'::jsonb,true) where id=$1",
    [notebook.id],
  );
  const forcedNotebookReadiness = (
    await one("select public.shop_product_readiness($1) readiness", [notebook.id])
  ).readiness;
  assert.equal(
    forcedNotebookReadiness.ready,
    false,
    "verification evidence must remain mandatory even if status is forced",
  );
  assert.ok(
    forcedNotebookReadiness.blockers.includes("Verification method is required."),
  );
  await db.query(
    "update public.shop_products set facts=jsonb_set(facts,'{verificationStatus}','\"marketplace_candidate_unverified\"'::jsonb,true) where id=$1",
    [notebook.id],
  );
  const notebookReadiness = (
    await one("select public.shop_product_readiness($1) readiness", [notebook.id])
  ).readiness;
  assert.equal(
    notebookReadiness.ready,
    false,
    "marketplace candidate notebook must not become ready merely because weight/stock/variant data are populated",
  );
  assert.ok(
    notebookReadiness.blockers.includes(
      "Production facts require physical or supplier verification.",
    ),
    "generic physical/supplier verification blocker must cover non-apparel products too",
  );

  const functionPrivileges = await db.query(`
    select p.proname,
      has_function_privilege('anon', p.oid, 'EXECUTE') anon_exec,
      has_function_privilege('authenticated', p.oid, 'EXECUTE') authenticated_exec,
      has_function_privilege('service_role', p.oid, 'EXECUTE') service_exec
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and p.proname in (
        'shop_product_readiness',
        'shop_admin_product_save',
        'shop_admin_variants_replace',
        'shop_admin_media_set',
        'shop_admin_transition',
        'shop_inventory_adjust',
        'shop_pack',
        'shop_claim_shipment',
        'shop_apply_shipment',
        'shop_apply_payment',
        'shop_checkout',
        'shop_cart_set',
        'shop_rate_limit',
        'shop_report'
      )
    order by p.proname
  `);
  assert.ok(functionPrivileges.rows.length >= 10);
  for (const row of functionPrivileges.rows) {
    assert.equal(row.anon_exec, false, `${row.proname} must deny anon EXECUTE`);
    assert.equal(
      row.authenticated_exec,
      false,
      `${row.proname} must deny authenticated EXECUTE`,
    );
    assert.equal(row.service_exec, true, `${row.proname} must allow service_role`);
  }

  const rls = await db.query(`
    select relname, relrowsecurity
    from pg_class
    join pg_namespace on pg_namespace.oid=pg_class.relnamespace
    where pg_namespace.nspname='public'
      and relname like 'shop_%'
      and relkind='r'
    order by relname
  `);
  assert.ok(rls.rows.length >= 10);
  assert.ok(
    rls.rows.every((row) => row.relrowsecurity === true),
    "every public Shop table must have RLS enabled",
  );

  await db.exec("set role anon");
  assert.equal(
    (await one("select count(*)::int n from public.shop_products")).n,
    0,
    "draft Shop products remain hidden from anon after the full chain",
  );
  await assert.rejects(
    db.query("select * from public.shop_orders"),
    /permission denied/,
  );
  await assert.rejects(
    db.query(
      "select public.shop_admin_transition('00000000-0000-0000-0000-000000000001'::uuid,'draft','00000000-0000-0000-0000-000000000001'::uuid)",
    ),
    /permission denied/,
  );
  await db.exec("reset role");

  console.log(
    `Full migration chain: ${files.length} migrations, Shop 27-variant candidate seed / 79 stock / packed-dimension propagation / verification gate / RLS / RPC privilege checks PASS`,
  );
} finally {
  await db.close();
}
