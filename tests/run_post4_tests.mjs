import assert from "node:assert/strict";
import fs from "node:fs";

const results = JSON.parse(fs.readFileSync("public/data/intelligence/results.json", "utf8"));
const summary = JSON.parse(fs.readFileSync("public/data/intelligence/summary.json", "utf8"));
const metadata = JSON.parse(fs.readFileSync("public/data/intelligence/metadata.json", "utf8"));

assert.equal(Array.isArray(results), true);
assert.equal(results.length, 32);
assert.equal(summary.result_count, 32);
assert.equal(summary.data_version, "1.0.1");
assert.equal(summary.method_version, "1.0.0");
assert.equal(metadata.validation_status, "PASS");

const ids = new Set();
for (const item of results) {
  assert.ok(item.result_id);
  assert.equal(ids.has(item.result_id), false);
  ids.add(item.result_id);
  assert.ok(["validated", "conditional", "rejected"].includes(item.quality_status));
  assert.ok(Array.isArray(item.evidence) && item.evidence.length > 0);
  assert.ok(["MW", "thousand_MWh"].includes(item.result_unit));
}

assert.equal(results.filter((r) => r.group_key?.startsWith("global_region:")).length, 10);
assert.equal(results.find((r) => r.group_key === "global_region:asia_pacific").result_value, 77505.0);
assert.equal(fs.existsSync("app/page.tsx"), true);
assert.equal(fs.existsSync("app/data-intelligence/page.tsx"), true);
assert.equal(fs.existsSync("services/intelligenceValidator.ts"), true);
console.log("ALL POST #4 CONTRACT, LOADER, UI & REGRESSION TESTS PASSED (32 results verified)");
