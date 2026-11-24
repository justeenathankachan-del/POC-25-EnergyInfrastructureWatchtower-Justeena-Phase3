# Assistant User Acceptance Testing (UAT) — PoC-25
| Test | Expected | Actual | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| Suggested questions | 6 approved chips appear | Rendered in `SuggestedQuestions.tsx` | PASS | `AssistantPanel.tsx` |
| Supported answer & numeric fidelity | Exact Track A numbers returned | `77,505 MW`, `95,308 MW`, `31,719 MW` verified | PASS | `tests/run_post5_tests.mjs` |
| Evidence link & limitation | Clicking `RES-XXXX` opens `EvidencePanel`; limitation shown | Both work seamlessly | PASS | `EvidenceReferences.tsx` |
| Missing param / Out-of-scope / Injection | Safe prompts & refusals without retrieval | `MISSING_PARAMETER`, `OUT_OF_SCOPE`, `UNSAFE` verified | PASS | `services/assistantEngine.ts` |
| Version mismatch / Mobile / Regression | Safe block on version mismatch; `/` and `/data-intelligence` intact | Verified via `npm run build` | PASS | `services/intelligenceValidator.ts` |
