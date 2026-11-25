import assert from "node:assert/strict";
import fs from "node:fs";
const docs = ["docs/PHASE3_RELEASE_MANIFEST.md","docs/CLEAN_CLONE_VALIDATION_REPORT.md","docs/FINAL_ANALYTICAL_REVALIDATION.md","docs/BUILD_AND_ENVIRONMENT_VALIDATION.md","docs/FINAL_OPERATIONAL_REGRESSION_REPORT.md","docs/FINAL_DATA_INTELLIGENCE_VALIDATION.md","docs/FINAL_ASSISTANT_VALIDATION.md","docs/FINAL_AUTOMATED_TEST_REPORT.md","docs/PHASE3_FINAL_UAT.md","docs/DEPLOYMENT_VALIDATION_REPORT.md","docs/PHASE3_FINAL_ARCHITECTURE.md","docs/PHASE3_COMPLETION_REPORT.md","docs/PHASE3_HANDOVER_GUIDE.md","README.md"];
for (const doc of docs) { assert.equal(fs.existsSync(doc), true, `Missing ${doc}`); }
assert.equal(fs.readFileSync("services/assistantEngine.ts", "utf8").includes("matched.reduce"), true);
const s = JSON.parse(fs.readFileSync("public/data/intelligence/summary.json", "utf8"));
const r = JSON.parse(fs.readFileSync("public/data/intelligence/results.json", "utf8"));
assert.equal(s.data_version, "1.0.1"); assert.equal(s.method_version, "1.0.0"); assert.equal(s.result_count, r.length);
console.log("ALL POST #6 FINAL CERTIFICATION CHECKS PASSED (phase3-v1.0.0)");
