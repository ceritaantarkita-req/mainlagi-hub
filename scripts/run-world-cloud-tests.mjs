import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function load(file, mocks) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    Set,
    Number,
    Array,
    Promise,
    require(id) {
      assert.ok(id in mocks, "Unmocked import " + id);
      return mocks[id];
    }
  }, { filename: file });
  return exports;
}

const MONEY_WORLD_ID = "money-festival";
const stages = [
  "money-stage-01-money-use",
  "money-stage-02-price-change",
  "money-stage-03-income-sources",
  "money-stage-04-needs-wants",
  "money-stage-05-saving",
  "money-stage-06-investment-intro",
  "money-stage-07-risk",
  "money-stage-08-final-festival"
].map((id, index) => ({ id, order: index + 1 }));

let accountId = "account-a";
let row = null;
let readError = null;
let rpcError = null;
const rpcCalls = [];

const client = {
  from(table) {
    assert.equal(table, "child_world_progress");
    const filters = {};
    return {
      select(columns) {
        assert.equal(columns, "world_id,completed_stage_ids,current_stage_id,current_segment_index,updated_at");
        return this;
      },
      eq(key, value) {
        filters[key] = value;
        return this;
      },
      async maybeSingle() {
        assert.equal(filters.account_id, "account-a");
        assert.equal(filters.child_key, "child-a");
        assert.equal(filters.world_id, MONEY_WORLD_ID);
        return { data: row, error: readError };
      }
    };
  },
  async rpc(name, args) {
    rpcCalls.push({ name, args });
    return { data: null, error: rpcError };
  }
};

const cloud = load("src/lib/learning/world/cloud.ts", {
  "@/lib/auth/supabase-auth": {
    getCurrentUserId: async () => accountId
  },
  "@/lib/auth/supabase-client": {
    getBrowserClient: () => client
  },
  "./moneyWorld": {
    MONEY_WORLD_ID,
    MONEY_WORLD_STAGES: stages
  },
  "./progress": {}
});

const empty = await cloud.readCloudMoneyWorldProgress("child-a");
assert.ok(empty, "Authenticated child without a World row must return explicit empty progress");
assert.equal(empty.worldId, MONEY_WORLD_ID);
assert.deepEqual(Array.from(empty.completedStageIds), []);
assert.equal(empty.currentStageId, null);
assert.equal(empty.currentSegmentIndex, 0);
assert.equal(empty.updatedAt, "");

row = {
  world_id: MONEY_WORLD_ID,
  completed_stage_ids: [stages[0].id, stages[1].id, "unknown-stage"],
  current_stage_id: stages[2].id,
  current_segment_index: 7,
  updated_at: "2026-09-22T01:00:00.000Z"
};
const hydrated = await cloud.readCloudMoneyWorldProgress("child-a");
assert.ok(hydrated);
assert.deepEqual(Array.from(hydrated.completedStageIds), [stages[0].id, stages[1].id]);
assert.equal(hydrated.currentStageId, stages[2].id);
assert.equal(hydrated.currentSegmentIndex, 7);

readError = new Error("read failed");
assert.equal(await cloud.readCloudMoneyWorldProgress("child-a"), null, "Cloud read errors must not masquerade as empty progress");
readError = null;

const progress = {
  worldId: MONEY_WORLD_ID,
  completedStageIds: [stages[0].id, stages[1].id],
  currentStageId: stages[2].id,
  currentSegmentIndex: 4,
  updatedAt: "2026-09-22T01:01:00.000Z"
};
assert.equal(await cloud.syncMoneyWorldProgressCloud("child-a", progress), true);
assert.equal(rpcCalls.length, 1);
assert.equal(rpcCalls[0].name, "save_world_progress");
assert.deepEqual(
  JSON.parse(JSON.stringify(rpcCalls[0].args)),
  {
    p_child_key: "child-a",
    p_world_id: MONEY_WORLD_ID,
    p_completed_stage_ids: [stages[0].id, stages[1].id],
    p_current_stage_id: stages[2].id,
    p_current_segment_index: 4
  }
);

rpcError = new Error("write failed");
assert.equal(await cloud.syncMoneyWorldProgressCloud("child-a", progress), false, "RPC errors must fail closed");
rpcError = null;

assert.equal(
  await cloud.syncMoneyWorldProgressCloud("child-a", { ...progress, worldId: "other-world" }),
  false,
  "Client adapter must reject unknown World IDs before RPC"
);
assert.equal(rpcCalls.length, 2, "Rejected World ID must not issue another RPC");

accountId = null;
row = null;
assert.equal(await cloud.readCloudMoneyWorldProgress("child-a"), null, "Guest mode must not read account World progress");
assert.equal(await cloud.syncMoneyWorldProgressCloud("child-a", progress), false, "Guest mode must not write account World progress");
assert.equal(rpcCalls.length, 2, "Guest write must not reach RPC");

const source = readFileSync("src/lib/learning/world/cloud.ts", "utf8");
assert.doesNotMatch(source, /record_learning_attempt/, "World cloud adapter must not use canonical learning-attempt RPC");
assert.doesNotMatch(source, /child_skill_mastery|learning_certificates|child_learning_achievements/, "World progress adapter must stay outside mastery/award storage");
assert.match(source, /client\.rpc\("save_world_progress"/, "World writes must use the server-owned progress RPC");

console.log("World cloud adapter regression passed: empty-row seeding, account isolation, RPC shape, errors, and mastery separation.");
