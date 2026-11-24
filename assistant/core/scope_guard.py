import json
import re
from pathlib import Path

POLICY = json.loads(Path("assistant/config/assistant_policy.json").read_text(encoding="utf-8"))

def classify_scope(question: str):
    q = (question or "").strip()
    if not q or len(q) > POLICY["max_question_length"]:
        return {"classification": "UNSAFE", "reason": "Question is empty or exceeds 500-character limit."}
    lower = q.lower()
    for term in POLICY["blocked_patterns"]:
        if term in lower:
            if any(k in term for k in ["predict", "forecast", "next year", "2025", "2026", "2030", "scada", "live outage", "grid failure"]):
                return {"classification": "OUT_OF_SCOPE", "reason": "Forecasting, live SCADA outage tracking, and grid-failure probability are unsupported under approved Track A."}
            return {"classification": "UNSAFE", "reason": "Request violates assistant safety, secret protection, or query boundary rules."}
    if "explain result" in lower and not re.search(r"RES-[0-9]{4}", q, re.IGNORECASE):
        return {"classification": "MISSING_PARAMETER", "reason": "Specify a valid result identifier such as RES-0001."}
    return {"classification": "SUPPORTED", "reason": "Within Track A deterministic catalog."}
