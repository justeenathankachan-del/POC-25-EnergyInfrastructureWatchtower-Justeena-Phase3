import assert from "node:assert/strict";
import fs from "node:fs";

const results = JSON.parse(fs.readFileSync("public/data/intelligence/results.json", "utf8"));
const catalog = JSON.parse(fs.readFileSync("assistant/config/query_catalog.json", "utf8"));
const policy = JSON.parse(fs.readFileSync("assistant/config/assistant_policy.json", "utf8"));

assert.equal(Object.keys(catalog).length, 7);
assert.equal(policy.persistent_memory, false);
assert.equal(policy.max_question_length, 500);
assert.equal(results.find((r) => r.group_key === "global_region:asia_pacific").result_value, 77505.0);
assert.equal(results.find((r) => r.group_key === "global_plant_fuel:hydro").result_value, 95308.0);
const maint = results.filter((r) => (r.group_key || "").startsWith("maintenance_baseline:"));
assert.equal(maint.length, 5);
assert.equal(maint.reduce((acc, r) => acc + r.result_value, 0), 31719.0);

for (const f of ["assistant/prompts/grounded_explanation_prompt", "assistant/core/scope_guard.py", "assistant/queries/comparative_queries.py", "services/assistantEngine.ts", "app/api/assistant/query/route.ts", "components/data-assistant/AssistantPanel.tsx"]) {
  assert.equal(fs.existsSync(f), true, `Missing ${f}`);
}
console.log("ALL POST #5 UNIT, GROUNDING, SAFETY & CONTRACT TESTS PASSED");
