import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = {
  env: await readFile(".env.example", "utf8"),
  server: await readFile("src/lib/shop/server.ts", "utf8"),
  route: await readFile("src/app/api/shop/[...path]/route.ts", "utf8"),
  workflow: await readFile(".github/workflows/ci.yml", "utf8"),
  batch11Workflow: await readFile(
    ".github/workflows/shop-batch11-staging.yml",
    "utf8",
  ),
  gate: await readFile(
    "docs/MAINLAGI_SHOP_BATCH11_LAUNCH_GATE_2026-09-27.md",
    "utf8",
  ),
};

for (const name of [
  "SHOP_STAGING_ACCEPTANCE_ENABLED",
  "SHOP_STAGING_ACCEPTANCE_SECRET",
  "SHOP_STAGING_URL",
  "SHOP_CRON_SECRET",
  "SHOP_ORDER_PII_RETENTION_DAYS",
]) {
  assert.match(files.env, new RegExp(`^${name}=.*$`, "m"), `missing ${name} in .env.example`);
}

assert.match(
  files.server,
  /SHOP_STAGING_ACCEPTANCE_ENABLED[\s\S]*SHOP_STAGING_ACCEPTANCE_SECRET[\s\S]*x-mainlagi-shop-staging-secret/,
);
assert.match(
  files.server,
  /SHOP_SALES_ENABLED[\s\S]*stagingAcceptance[\s\S]*operationalPolicyBlockers/,
  "staging acceptance must not bypass operational policy checks",
);
assert.match(
  files.route,
  /salesEnabled\(request\)/,
  "Shop cart/rates/checkout must use request-aware sales gating",
);
assert.match(
  files.gate,
  /Batch 11 must remain \*\*BLOCKED\*\*/,
  "Batch 11 must remain fail-closed until owner/data/remote-staging prerequisites pass",
);
assert.match(
  files.workflow,
  /EXPECTED_SUPABASE_PROJECT_REF:\s*estvtgflwkebomsqlolv/,
  "production Supabase project reference must remain explicit for anti-staging guardrails",
);
for (const required of [
  "supabase/setup-cli@v1",
  "supabase start",
  "supabase status -o env",
  "supabase db reset --local",
  "trycloudflare",
  "SHOP_STAGING_ACCEPTANCE_SECRET",
  "SHOP_CRON_SECRET",
]) {
  assert.match(
    files.batch11Workflow,
    new RegExp(required),
    `Batch 11 staging workflow missing ${required}`,
  );
}
assert.doesNotMatch(
  files.batch11Workflow,
  /SHOP_STAGING_SUPABASE_(?:URL|ANON_KEY|SERVICE_ROLE_KEY)/,
  "free Batch 11 staging must not require a paid remote Supabase branch/project",
);
assert.match(
  files.batch11Workflow,
  /SHOP_SALES_ENABLED(?::|=)\s*["']?false["']?/,
  "Batch 11 database-backed staging must keep public sales disabled",
);
assert.match(
  files.batch11Workflow,
  /crons": \["\*\/5 \* \* \* \*"\]/,
  "Batch 11 workflow must exercise a real temporary Cloudflare cron trigger",
);

console.log(
  "Shop Batch 11 preflight PASS: staging bypass is secret-gated, public sales remain fail-closed, production Supabase identity remains explicit, and unresolved launch gates are not silently marked complete.",
);

assert.doesNotMatch(
  files.batch11Workflow,
  /cloudflared tunnel[\s\S]*5432[12]/,
  "Supabase API/database ports must never be exposed by the public Quick Tunnel",
);
assert.doesNotMatch(
  files.batch11Workflow,
  /cloudflared tunnel[\s\S]*54321/,
  "local Supabase API must never be exposed by the public Quick Tunnel",
);
