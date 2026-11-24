import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { runDeterministicAssistant } from "@/services/assistantEngine";
import { validateIntelligencePackage } from "@/services/intelligenceValidator";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const question = typeof body?.question === "string" ? body.question : "";
    const baseDir = path.join(process.cwd(), "public", "data", "intelligence");
    const summaryRaw = JSON.parse(fs.readFileSync(path.join(baseDir, "summary.json"), "utf8"));
    const resultsRaw = JSON.parse(fs.readFileSync(path.join(baseDir, "results.json"), "utf8"));
    const metadataRaw = JSON.parse(fs.readFileSync(path.join(baseDir, "metadata.json"), "utf8"));
    const validated = validateIntelligencePackage(summaryRaw, resultsRaw, metadataRaw);
    return NextResponse.json(runDeterministicAssistant(question, validated.summary, validated.results), { status: 200 });
  } catch (err) {
    return NextResponse.json({
      answer_id: `ANS-ERR-${Date.now().toString().slice(-4)}`,
      status: "error",
      classification: "UNAVAILABLE",
      intent: null,
      answer: err instanceof Error ? err.message : "Assistant validation error.",
      evidence_references: [],
      key_values: [],
      metadata: { data_version: "1.0.1", method_version: "1.0.0", generated_at: new Date().toISOString(), quality_status: "rejected" },
      limitation: "Safe failure: unvalidated intelligence outputs are never exposed.",
      suggested_follow_ups: [],
    }, { status: 400 });
  }
}
