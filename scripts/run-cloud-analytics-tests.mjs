import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Execute production modules with only their network/React boundaries replaced.
function load(file, mocks, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  vm.runInNewContext(code, { exports, Date, Map, Set, ...globals, require(id) {
    assert.ok(id in mocks, `Unmocked import ${id}`);
    return mocks[id];
  } }, { filename: file });
  return exports;
}

const timestamp = "2026-01-01T00:00:00.000Z";
const attempts = Array.from({ length: 1201 }, (_, i) => ({
  id: String(i).padStart(5, "0"), client_attempt_id: `client-${i}`,
  account_id: "account-a", child_key: "child-a", activity_id: "math-count-2",
  status: "completed", assessed: true, created_at: timestamp,
  completed_at: new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString()
}));
const evidence = attempts.flatMap((attempt) => ["a", "b", "c"].map((skill) => ({
  account_id: attempt.account_id, child_key: attempt.child_key,
  attempt_id: attempt.id, activity_id: attempt.activity_id, skill_key: skill,
  evidence_score: 1, evidence_weight: 1, qualifies_for_mastery: true, created_at: timestamp
})));
let cap = 500;
let failTable = null;
const calls = [];
const tables = {
  learning_attempts: [...attempts].reverse().concat({ ...attempts[0], id: "foreign", account_id: "account-b" }),
  learning_attempt_skill_evidence: [...evidence].reverse(),
  child_skill_mastery: []
};
const client = { from(table) {
  let rows = [...tables[table]];
  let offset = 0;
  let limit = Infinity;
  const order = [];
  return {
    select() { return this; },
    eq(key, value) { rows = rows.filter((row) => row[key] === value); return this; },
    lte(key, value) { rows = rows.filter((row) => row[key] <= value); return this; },
    order(key, { ascending }) { order.push([key, ascending]); return this; },
    range(from, to) { offset = from; limit = to - from + 1; return this; },
    limit(value) { limit = value; return this; },
    then(resolve, reject) {
      calls.push({ table, offset });
      rows.sort((a, b) => {
        for (const [key, ascending] of order) {
          const diff = String(a[key]).localeCompare(String(b[key]));
          if (diff) return ascending ? diff : -diff;
        }
        return 0;
      });
      return Promise.resolve(table === failTable && offset > 0
        ? { data: null, error: new Error("Network failed on later page") }
        : { data: rows.slice(offset, offset + Math.min(cap, limit)), error: null }).then(resolve, reject);
    }
  };
} };
const cloud = load("src/lib/learning/cloud.ts", {
  "@/lib/auth/supabase-auth": { getCurrentUserId: async () => "account-a" },
  "@/lib/auth/supabase-client": { getBrowserClient: () => client },
  "./catalog": { LEARNING_SKILLS: [] }, "./attempts": {}, "./mastery": {}
});
for (const serverCap of [500, 137]) {
  cap = serverCap;
  const result = await cloud.readCloudLearningAnalytics("child-a");
  assert.equal(result.totalAttempts, 1201);
  assert.equal(new Set(result.attempts.map((item) => item.id)).size, 1201);
  assert.equal(result.attempts.at(-1).id, "client-1200");
  assert.equal(result.lastAttemptAt, attempts.at(-1).completed_at);
  assert.equal(result.attempts.flatMap((item) => item.evidence).length, 3603);
  assert.ok(result.attempts.every((item) => item.evidence.length === 3));
}
for (const table of ["learning_attempts", "learning_attempt_skill_evidence"]) {
  failTable = table;
  assert.equal(await cloud.readCloudLearningAnalytics("child-a"), null, "A later-page failure must not return partial analytics");
}
failTable = null;
assert.equal((await cloud.readCloudLearningAnalytics("other-child")).totalAttempts, 0);
assert.ok(calls.some((call) => call.offset > 2000), "Evidence must paginate past 2000 rows");

// Small hook lifecycle driver: async refreshes and browser/auth events run the
// real hook; state setters are observable without requiring an actual account.
const empty = () => ({ attempts: [], totalAttempts: 0, masteryBySkill: {} });
const tick = () => new Promise((resolve) => setImmediate(resolve));
async function settle() { for (let i = 0; i < 8; i++) await tick(); }
function hookHarness() {
  const state = [];
  const events = new Map();
  let cursor = 0;
  let effect;
  let authChanged;
  let session = { data: { session: { user: { id: "account-a" } } }, error: null };
  let readCloud = async () => null;
  let localReads = 0;
  const hook = load("src/components/learning/useLearningAnalytics.ts", {
    react: {
      useState(initial) {
        const index = cursor++;
        if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
        return [state[index], (value) => { state[index] = typeof value === "function" ? value(state[index]) : value; }];
      },
      useEffect(callback) { effect = callback; }
    },
    "@/lib/auth/supabase-client": { getBrowserClient: () => ({ auth: {
      getSession: async () => session,
      onAuthStateChange(callback) { authChanged = callback; return { data: { subscription: { unsubscribe() {} } } }; }
    } }) },
    "@/lib/learning/attempts": {
      emptyLearningAnalytics: empty,
      readLearningAnalytics() { localReads++; return { ...empty(), totalAttempts: 99 }; }
    },
    "@/lib/learning/cloud": { readCloudLearningAnalytics: () => readCloud() },
    "@/lib/learning/outbox": {
      LEARNING_OUTBOX_EVENT: "outbox",
      overlayPendingLearningAnalytics: (value) => value,
      readPendingLearningAttemptsForCurrentUser: async () => []
    }
  }, { window: {
    requestAnimationFrame: (fn) => setImmediate(fn), cancelAnimationFrame: clearImmediate,
    addEventListener: (name, fn) => events.set(name, fn), removeEventListener: (name) => events.delete(name)
  } });
  function render() { cursor = 0; return hook.useLearningAnalyticsState("child-a"); }
  render();
  const cleanup = effect();
  return {
    render, cleanup, snapshot: () => state[1], localReads: () => localReads,
    cloud: (fn) => { readCloud = fn; }, session: (value) => { session = value; },
    event: (name) => events.get(name)?.({}), auth: () => authChanged()
  };
}
const h = hookHarness();
await settle();
assert.equal(h.snapshot().status, "unavailable");
assert.equal(h.snapshot().ready, false);
assert.equal(h.localReads(), 0, "Authenticated failures must never read guest storage");
h.cloud(async () => ({ ...empty(), totalAttempts: 1201 }));
h.event("online");
await settle();
assert.equal(h.snapshot().status, "ready");
assert.equal(h.snapshot().analytics.totalAttempts, 1201);

let resolveOld;
h.cloud(() => new Promise((resolve) => { resolveOld = resolve; }));
h.event("outbox");
await settle();
h.cloud(async () => ({ ...empty(), totalAttempts: 1202 }));
h.event("outbox");
await settle();
resolveOld({ ...empty(), totalAttempts: 1 });
await settle();
assert.equal(h.snapshot().analytics.totalAttempts, 1202, "A stale request must not overwrite a newer result");

h.session({ data: { session: null }, error: new Error("Session refresh failed") });
h.auth();
await settle();
assert.equal(h.snapshot().status, "unavailable");
assert.equal(h.localReads(), 0, "Expired/offline auth is not guest mode");
h.session({ data: { session: null }, error: null });
h.auth();
await settle();
assert.equal(h.snapshot().status, "ready");
assert.equal(h.localReads(), 1, "Explicit guest play remains local");
h.cleanup();
console.log("Cloud analytics regression passed: 1201 attempts, 3603 evidence rows, small server caps, page failure, unavailable UI state, reconnect, stale requests and guest isolation.");
