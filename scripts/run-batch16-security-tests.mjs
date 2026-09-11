import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function walk(directory, extensions) {
  const output = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...walk(full, extensions));
    else if (extensions.some((extension) => entry.name.endsWith(extension))) output.push(full);
  }
  return output;
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

const sourceFiles = walk(path.join(root, "src"), [".ts", ".tsx"]);
const migrationFiles = walk(path.join(root, "supabase", "migrations"), [".sql"]);

// Browser bundles must never gain access to server-only provider credentials.
for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  const isClient = /^\s*["']use client["'];?/m.test(content);
  if (!isClient) continue;

  assert.doesNotMatch(
    content,
    /SUPABASE_SERVICE_ROLE_KEY|OPENROUTER_API_KEY|PRIVATE_KEY|SERVICE_ACCOUNT/,
    `${relative(file)} is a client module and must not reference server-only credentials`
  );
}

// New raw-HTML sinks require an explicit security review. Keep the current two
// reviewed sinks closed over a fixed allowlist rather than letting the surface
// grow silently.
const rawHtmlFiles = sourceFiles
  .filter((file) => readFileSync(file, "utf8").includes("dangerouslySetInnerHTML"))
  .map(relative)
  .sort();
assert.deepEqual(rawHtmlFiles, [
  "src/app/discover/articles/[slug]/page.tsx",
  "src/app/layout.tsx"
]);

const articlePage = readFileSync(path.join(root, "src/app/discover/articles/[slug]/page.tsx"), "utf8");
assert.match(articlePage, /sanitizeArticleHtml\(article\.content\)/, "article HTML must be sanitized before render");
assert.match(articlePage, /serializeJsonLd\(jsonLd\)/, "JSON-LD must be serialized through the safe helper");
assert.match(articlePage, /__html:\s*safeContent/, "article raw-HTML sink must receive only safeContent");
assert.match(articlePage, /__html:\s*safeJsonLd/, "JSON-LD raw-HTML sink must receive only safeJsonLd");

const sanitizer = readFileSync(path.join(root, "src/lib/security/sanitizeArticleHtml.ts"), "utf8");
assert.match(sanitizer, /allowedSchemes:\s*\["http",\s*"https",\s*"mailto"\]/, "article sanitizer scheme allowlist drifted");
assert.match(sanitizer, /img:\s*\["http",\s*"https"\]/, "article images must stay http/https only");
assert.match(sanitizer, /allowProtocolRelative:\s*false/, "protocol-relative article URLs must stay disabled");
assert.match(sanitizer, /"script"[\s\S]*"iframe"[\s\S]*"object"[\s\S]*"embed"/, "active embedded content must stay blocked");
assert.match(sanitizer, /JSON\.stringify\(value\)\.replace\(\/<\/g,\s*"\\\\u003c"\)/, "JSON-LD must escape literal < characters");

const layout = readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");
assert.match(layout, /const themeScript = `([\s\S]*?)`;/, "theme bootstrap must remain a repository-owned static script");
const themeBody = layout.match(/const themeScript = `([\s\S]*?)`;/)?.[1] ?? "";
assert.doesNotMatch(themeBody, /\$\{/, "theme bootstrap must not interpolate runtime/user-controlled values");
assert.match(layout, /__html:\s*themeScript/, "layout raw-HTML sink must remain bound to themeScript only");

// SECURITY DEFINER is acceptable only with an explicitly pinned search_path.
for (const file of migrationFiles) {
  const sql = readFileSync(file, "utf8");
  const lower = sql.toLowerCase();
  let cursor = 0;
  while ((cursor = lower.indexOf("security definer", cursor)) !== -1) {
    const windowStart = Math.max(0, cursor - 240);
    const windowEnd = Math.min(lower.length, cursor + 320);
    const context = lower.slice(windowStart, windowEnd);
    assert.match(
      context,
      /set\s+search_path\s*=/,
      `${relative(file)} contains SECURITY DEFINER without a nearby pinned search_path`
    );
    cursor += "security definer".length;
  }
}

const hardening = readFileSync(path.join(root, "supabase/migrations/0004_learning_rpc_hardening.sql"), "utf8");
assert.match(hardening, /revoke all on function public\.record_learning_attempt[\s\S]*from public, anon, authenticated, service_role/i, "attempt RPC must revoke broad/default execution before grants");
assert.match(hardening, /grant execute on function public\.record_learning_attempt[\s\S]*to authenticated, service_role/i, "attempt RPC must stay authenticated/service-role only");
assert.doesNotMatch(hardening, /grant execute on function public\.record_learning_attempt[\s\S]*to anon/i, "anonymous users must not execute attempt RPC");

const outbox = readFileSync(path.join(root, "src/lib/learning/outbox.ts"), "utf8");
assert.match(outbox, /ownerUserId/, "learning outbox entries must remain account-bound");
assert.doesNotMatch(outbox, /access_token|refresh_token|service_role/i, "learning outbox must not persist credentials");

const serverAdmin = readFileSync(path.join(root, "src/lib/auth/supabase-server-admin.ts"), "utf8");
assert.doesNotMatch(serverAdmin, /^[\s\S]*["']use client["']/, "service-role Supabase helper must remain server-only");
assert.match(serverAdmin, /process\.env\.SUPABASE_SERVICE_ROLE_KEY/, "server admin helper must read service role only from server environment");

console.log(JSON.stringify({
  sourceFiles: sourceFiles.length,
  migrationFiles: migrationFiles.length,
  rawHtmlSinks: rawHtmlFiles.length,
  securityDefinerSearchPath: "PASS",
  clientCredentialBoundary: "PASS",
  articleSanitizationBoundary: "PASS",
  learningOutboxCredentialBoundary: "PASS"
}));
